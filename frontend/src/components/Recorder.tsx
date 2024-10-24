import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { BsFillStopFill } from "react-icons/bs";
import { BsFillMicFill } from "react-icons/bs";
import axios from "axios";
const Recorder = () => {
  const audioChunks = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordings, setRecordings] = useState<string[]>([]);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [editedTranscription, setEditedTranscription] = useState<string>(""); // Initialize as empty string
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [transcriptionId, setTranscriptionId] = useState<number | null>(null);


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
        "http://localhost:5000/process_audio",
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
      {isRecording ? (
        <Button
          className="bg-red-500 text-white flex items-center"
          onClick={stopRecording}
        >
          <BsFillStopFill className="mr-2" /> 
        </Button>
      ) : (
        <Button
          className="bg-[#ea580c] dark:bg-orange-500 dark:hover:bg-yellow-600 text-white flex items-center"
          onClick={startRecording}
        >
          <BsFillMicFill size={500} className="mr-2 text-white"/> 
        </Button>
      )}
    </>
  );
};

export default Recorder;
