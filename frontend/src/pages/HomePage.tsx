import { useState, useRef } from "react";
import React from "react";
import axios from "axios";
import { BsFillMicFill, BsFillStopFill } from "react-icons/bs";
import { CgDarkMode } from "react-icons/cg";

import {  IoSunny } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import GrievanceList from "@/components/GrievanceList";
import Modal from "@/components/Modal";
import MyForm from "@/components/Form";

const AudioRecorder: React.FC = () => {
  const [dark, setDark] = useState(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordings, setRecordings] = useState<string[]>([]);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [editedTranscription, setEditedTranscription] = useState<string>(""); // Initialize as empty string
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [transcriptionId, setTranscriptionId] = useState<number | null>(null);

  // Toggle Dark Mode
  const darkModeHandler = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };

  // Start Audio Recording
  const startRecording = async () => {
    try {
      setIsRecording(true);
      audioChunks.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const wavBlob = await convertWebmToWav(audioBlob);
        const url = URL.createObjectURL(wavBlob);
        setAudioUrl(url);
        setRecordings((prev) => [...prev, url]);
        await sendAudioToBackend(wavBlob);
      };

      mediaRecorder.current.start();
    } catch (error) {
      console.error("Error starting audio recording:", error);
    }
  };

  // Stop Audio Recording
  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  // Convert WebM to WAV
  const convertWebmToWav = async (webmBlob: Blob): Promise<Blob> => {
    const audioContext = new AudioContext();
    const arrayBuffer = await webmBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const wavBuffer = audioBufferToWav(audioBuffer);
    return new Blob([wavBuffer], { type: "audio/wav" });
  };

  // Helper function to convert AudioBuffer to WAV
  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // 1 for PCM (uncompressed)
    const bitDepth = 16;

    const wavData = new DataView(new ArrayBuffer(44 + buffer.length * 2));
    let offset = 0;

    // Write WAV header
    writeString(wavData, offset, "RIFF");
    offset += 4;
    wavData.setUint32(offset, 36 + buffer.length * 2, true);
    offset += 4;
    writeString(wavData, offset, "WAVE");
    offset += 4;
    writeString(wavData, offset, "fmt ");
    offset += 4;
    wavData.setUint32(offset, 16, true);
    offset += 4; // Subchunk1Size
    wavData.setUint16(offset, format, true);
    offset += 2; // AudioFormat
    wavData.setUint16(offset, numberOfChannels, true);
    offset += 2;
    wavData.setUint32(offset, sampleRate, true);
    offset += 4;
    wavData.setUint32(
      offset,
      sampleRate * numberOfChannels * (bitDepth / 8),
      true
    );
    offset += 4; // ByteRate
    wavData.setUint16(offset, numberOfChannels * (bitDepth / 8), true);
    offset += 2; // BlockAlign
    wavData.setUint16(offset, bitDepth, true);
    offset += 2;
    writeString(wavData, offset, "data");
    offset += 4;
    wavData.setUint32(offset, buffer.length * 2, true);
    offset += 4; // Subchunk2Size

    // Write PCM data
    const channelData = buffer.getChannelData(0);
    let i = 0;
    while (i < channelData.length) {
      wavData.setInt16(offset, channelData[i++] * 0x7fff, true);
      offset += 2;
    }

    return wavData.buffer;
  };

  // Helper function to write string to DataView
  const writeString = (view: DataView, offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // Send audio to backend
  const sendAudioToBackend = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob);

      const response = await axios.post(
        "http://10.10.2.179:5000/process_audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response from backend:", response.data);

      const transcriptionText =
        response.data.text || "No transcription available";
      const transcriptionId = response.data.id; // Get the transcription ID from the response

      setTranscription(transcriptionText);
      setEditedTranscription(transcriptionText); // Set the edited transcription immediately
      setTranscriptionId(transcriptionId); // Store the transcription ID
    } catch (error) {
      console.error("Error sending audio to backend:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle transcription edit
  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (editedText: string) => {
    if (transcriptionId !== null) {
      try {
        const response = await axios.post(
          "http://localhost:5000/submit_audio",
          {
            id: transcriptionId,
            text: editedText,
          }
        );
        console.log("API response:", response.data);
        setTranscription(editedText); // Update transcription after successful submission
      } catch (error) {
        console.error("Error submitting edited transcription:", error);
      }
    }
  };

  const handleRemoveTranscription = async () => {
    if (transcriptionId !== null) {
      try {
        await axios.post("http://localhost:5000/remove_audio", {
          id: transcriptionId,
        });
        setTranscription(null); // Clear transcription from state
        setEditedTranscription(""); // Reset edited transcription
        setTranscriptionId(null);
      } catch (error) {
        console.error("Error removing transcription:", error);
      }
    }
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="w-full dark:bg-black">
        <button onClick={darkModeHandler} className="absolute right-3 mt-3">
          {dark ? <IoSunny size={30} /> : <CgDarkMode size={30} />}
        </button>
      </div>
      <div className="mt-[20px]">
        <MyForm />
        <div className="dark:bg-black w-[100%] h-[88vh] flex justify-center items-center bg-[url('/cm-banner.jpg')] bg-no-repeat bg-contain bg-center">
          <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg max-w-md dark:text-[#FBB917] mx-auto md:w-[1000px]">
            <h2 className="text-4xl font-semibold mb-4 dark:text-orange-500">
              Audio Recorder
            </h2>
            <div className="flex justify-center items-center mb-4">
              {isRecording ? (
                <Button
                  className="bg-red-500 text-white flex items-center"
                  onClick={stopRecording}
                >
                  <BsFillStopFill className="mr-2" /> Stop Recording
                </Button>
              ) : (
                <Button
                  className="bg-orange-500 dark:bg-orange-500 dark:hover:bg-black text-white flex items-center"
                  onClick={startRecording}
                >
                  <BsFillMicFill size={500} className="mr-2 text-white" /> Start
                  Recording
                </Button>
              )}
            </div>
            {loading ? (
              <Loader />
            ) : (
              <>
                {audioUrl && (
                  <audio controls className="w-full mb-4">
                    <source src={audioUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {transcription && (
                  <div className="w-full mt-4">
                    <div className="text-black dark:text-black">
                      <div className="w-full border-primary p-2 text-black text-3xl">
                        {transcription}
                      </div>
                      <div>
                        <Button
                          onClick={handleEdit}
                          className="bg-orange-500 text-white"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div>
        <GrievanceList />
      </div>
      <div>
        <Footer />
      </div>

      {/* Modal for editing transcription */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        onRemove={handleRemoveTranscription}
        initialText={editedTranscription}
      />
    </>
  );
};

const HomePage: React.FC = () => {
  return (
    <div>
      <AudioRecorder />
    </div>
  );
};

export default HomePage;
