import React from "react";
import { useForm } from "react-hook-form";
import { FaMicrophone } from "react-icons/fa";
import Recorder from "./Recorder";

type FormData = {
  name: string;
  occupation: string;
  address: string;
  phone_number: string;
  district_corporation: string;
  taluka_zone: string;
  village_area: string;
  subject: string;
  department: string;
  message: string;
  email: string;
  my_otp: string;
};

const MyForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <div className="w-[100vw] flex justify-center">
      <div className="flex container w-[85%] justify-center ml-[30px] p-[30px]">
        <div className="w-[70%]">
          <div className="mb-4 text-center text-orange-600 text-lg">
            {/* Success message */}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-1  font-bold dark:text-white"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  {...register("name", { required: true })}
                  className={`form-input border-[1px] ${
                    errors.name ? "border-red-500" : "border-orange-500"
                  } w-full`}
                />
                {errors.name && (
                  <div className="text-red-500">This field is required</div>
                )}
              </div>

              {/* Occupation */}
              <div>
                <label
                  htmlFor="occupation"
                  className="block mb-1 font-bold dark:text-white"
                >
                  Occupation
                </label>
                <select
                  id="occupation"
                  {...register("occupation")}
                  className="form-select w-full border-[1px] border-orange-500 rounded dark:text-black"
                >
                  <option value="">-Select-</option>
                  <option value="Goverment Servant">Goverment Servant</option>
                  <option value="Ex-Servant">Ex-Servant</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Businessman">Businessman</option>
                  <option value="Private Employee">Private Employee</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block mb-1 font-bold dark:text-white"
                >
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="address"
                  {...register("address", { required: true })}
                  className={`form-input border-[1px] ${
                    errors.address
                      ? "border-red-500"
                      : "border-orange-500 rounded"
                  } w-full`}
                />
                {errors.address && (
                  <div className="text-red-500">This field is required</div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone_number"
                  className="block mb-1 font-bold dark:text-white"
                >
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone_number"
                  type="tel"
                  {...register("phone_number", { required: true })}
                  className={`form-input border-[1px] ${
                    errors.phone_number
                      ? "border-red-500"
                      : "border-orange-500 rounded"
                  } w-full`}
                />
                {errors.phone_number && (
                  <div className="text-red-500">This field is required</div>
                )}
              </div>

              {/* District/Corporation */}
              <div>
                <label
                  htmlFor="district_corporation"
                  className="block mb-1 font-bold dark:text-white"
                >
                  District/Corporation <span className="text-red-500">*</span>
                </label>
                <select
                  id="district_corporation"
                  {...register("district_corporation", { required: true })}
                  className="form-select w-full border-[1px] border-orange-500 rounded dark:text-black"
                >
                  <option value="" selected={true}>
                    -Select-
                  </option>
                  <option value="7">AHMEDABAD</option>
                  <option value="13">AMRELI</option>
                  <option value="15">ANAND</option>
                  <option value="31">ARVALLI</option>
                  <option value="2">BANASKANTHA</option>
                  <option value="21">BHARUCH</option>
                  <option value="14">BHAVNAGAR</option>
                  <option value="30">BOTAD</option>
                  <option value="33">CHHOTAUDEPUR</option>
                  <option value="18">DAHOD</option>
                  <option value="27">DEVBHUMI DWARKA</option>
                  <option value="6">GANDHINAGAR</option>
                  <option value="29">GIR SOMNATH</option>
                  <option value="10">JAMNAGAR</option>
                  <option value="12">JUNAGADH</option>
                  <option value="1">KACHCHH</option>
                  <option value="16">KHEDA</option>
                  <option value="4">MAHESANA</option>
                  <option value="32">MAHISAGAR</option>
                  <option value="28">MORBI</option>
                  <option value="20">NARMADA</option>
                  <option value="24">NAVSARI</option>
                  <option value="17">PANCHMAHALS</option>
                  <option value="3">PATAN</option>
                  <option value="11">PORBANDAR</option>
                  <option value="9">RAJKOT</option>
                  <option value="5">SABARKANTHA</option>
                  <option value="22">SURAT</option>
                  <option value="8">SURENDRANAGAR</option>
                  <option value="26">TAPI</option>
                  <option value="23">THE DANGS</option>
                  <option value="19">VADODARA</option>
                  <option value="25">VALSAD</option>
                  <option value="300">AHMEDABAD (Corporation)</option>
                  <option value="304">RAJKOT (Corporation)</option>
                  <option value="307">JUNAGADH (Corporation)</option>
                  <option value="306">BHAVNAGAR (Corporation)</option>
                  <option value="301">SURAT (Corporation)</option>
                  <option value="305">JAMNAGAR (Corporation)</option>
                  <option value="302">VADODARA (Corporation)</option>
                  <option value="303">GANDHINAGAR (Corporation)</option>
                  <option value="  "></option>
                </select>
                {errors.district_corporation && (
                  <div className="text-red-500">This field is required</div>
                )}
              </div>

              {/* Department */}
              <div className="col-span-2 dark:text-black">
                <label
                  htmlFor="department"
                  className="block mb-1 font-bold dark:text-white"
                >
                  Department
                </label>
                <select
                  id="department"
                  {...register("department")}
                  className="form-select w-full border-orange-500 rounded border-[1px]"
                >
                  <option value="" selected={true}>
                    -Select-
                  </option>
                  <option value=" AGRICULTURE, FARMERS WELFARE AND CO-OPERATION DEPARTMENT (કૃષિ, ખેડુત કલ્યાણ અને સહકાર વિભાગ)">
                    {" "}
                    AGRICULTURE, FARMERS WELFARE AND CO-OPERATION DEPARTMENT
                    (કૃષિ, ખેડુત કલ્યાણ અને સહકાર વિભાગ)
                  </option>
                  <option value=" EDUCATION DEPARTMENT (શિક્ષણ વિભાગ)">
                    {" "}
                    EDUCATION DEPARTMENT (શિક્ષણ વિભાગ)
                  </option>
                  <option value=" ENERGY and PETRO CHEMICALS DEPARTMENT (ઉર્જા અને પેટ્રો કેમિકલ્સ વિભાગ)">
                    {" "}
                    ENERGY and PETRO CHEMICALS DEPARTMENT (ઉર્જા અને પેટ્રો
                    કેમિકલ્સ વિભાગ)
                  </option>
                  <option value=" FINANCE DEPARTMENT (નાણા વિભાગ)">
                    {" "}
                    FINANCE DEPARTMENT (નાણા વિભાગ)
                  </option>
                  <option value=" FOOD, CIVIL SUPPLIES and CONSUMER AFFAIRS DEPARTMENT (અન્ન નાગરિક પુરવઠા અને ગ્રાહક બાબતોનો વિભાગ)">
                    {" "}
                    FOOD, CIVIL SUPPLIES and CONSUMER AFFAIRS DEPARTMENT (અન્ન
                    નાગરિક પુરવઠા અને ગ્રાહક બાબતોનો વિભાગ)
                  </option>
                  <option value=" FOREST and ENVIRONMENT DEPARTMENT (વન અને પર્યાવરણ વિભાગ)">
                    {" "}
                    FOREST and ENVIRONMENT DEPARTMENT (વન અને પર્યાવરણ વિભાગ)
                  </option>
                  <option value=" GENERAL ADMINISTRATION DEPARTMENT (સામાન્ય વહીવટ વિભાગ)">
                    {" "}
                    GENERAL ADMINISTRATION DEPARTMENT (સામાન્ય વહીવટ વિભાગ)
                  </option>
                  <option value=" GUJARAT LEGISLATURE SECRETARIATE (GUJARAT LEGISLATURE SECRETARIATE)">
                    {" "}
                    GUJARAT LEGISLATURE SECRETARIATE (GUJARAT LEGISLATURE
                    SECRETARIATE)
                  </option>
                  <option value=" HEALTH and FAMILY WELFARE DEPARTMENT (આરોગ્ય અને પરિવાર કલ્યાણ વિભાગ)">
                    {" "}
                    HEALTH and FAMILY WELFARE DEPARTMENT (આરોગ્ય અને પરિવાર
                    કલ્યાણ વિભાગ)
                  </option>
                  <option value=" HOME DEPARTMENT (ગૃહ વિભાગ)">
                    {" "}
                    HOME DEPARTMENT (ગૃહ વિભાગ)
                  </option>
                  <option value=" INDUSTRIES and MINES DEPARTMENT (ઉદ્યોગ અને ખાણ વિભાગ)">
                    {" "}
                    INDUSTRIES and MINES DEPARTMENT (ઉદ્યોગ અને ખાણ વિભાગ)
                  </option>
                  <option value=" INFORMATION AND BROADCASTING DEPARTMENT (માહિતી અને પ્રસારણ વિભાગ)">
                    {" "}
                    INFORMATION AND BROADCASTING DEPARTMENT (માહિતી અને પ્રસારણ
                    વિભાગ)
                  </option>
                  <option value=" LABOUR, SKILL DEVELOPMENT and EMPLOYMENT DEPARTMENT (શ્રમ, કૌશલ્ય વિકાસ અને રોજગાર વિભાગ)">
                    {" "}
                    LABOUR, SKILL DEVELOPMENT and EMPLOYMENT DEPARTMENT (શ્રમ,
                    કૌશલ્ય વિકાસ અને રોજગાર વિભાગ)
                  </option>
                  <option value=" LEGAL DEPARTMENT (કાયદા વિભાગ)">
                    {" "}
                    LEGAL DEPARTMENT (કાયદા વિભાગ)
                  </option>
                  <option value=" LEGISLATIVE and PARLIAMENTARY AFFAIRS DEPARTMENT (વૈધાનિક અને સંસદીય બાબતોનો વિભાગ)">
                    {" "}
                    LEGISLATIVE and PARLIAMENTARY AFFAIRS DEPARTMENT (વૈધાનિક
                    અને સંસદીય બાબતોનો વિભાગ)
                  </option>
                  <option value=" NARMADA WATER RESOURCES and WATER SUPPLY DEPARTMENT (નર્મદા, જળ સંપતિ, પાણી પુરવઠા અને કલ્પસર વિભાગ)">
                    {" "}
                    NARMADA WATER RESOURCES and WATER SUPPLY DEPARTMENT (નર્મદા,
                    જળ સંપતિ, પાણી પુરવઠા અને કલ્પસર વિભાગ)
                  </option>
                  <option value=" PANCHAYATS, RURAL HOUSING and RURAL DEVELOPMENT DEPARTMENT (પંચાયત, ગ્રામ ગૃહનિર્માણ અને ગ્રામ વિકાસ વિભાગ)">
                    {" "}
                    PANCHAYATS, RURAL HOUSING and RURAL DEVELOPMENT DEPARTMENT
                    (પંચાયત, ગ્રામ ગૃહનિર્માણ અને ગ્રામ વિકાસ વિભાગ)
                  </option>
                  <option value=" PORTS and TRANSPORT DEPARTMENT (બંદરો અને વાહન વ્યવહાર વિભાગ)">
                    {" "}
                    PORTS and TRANSPORT DEPARTMENT (બંદરો અને વાહન વ્યવહાર
                    વિભાગ)
                  </option>
                  <option value=" REVENUE DEPARTMENT (મહેસુલ વિભાગ)">
                    {" "}
                    REVENUE DEPARTMENT (મહેસુલ વિભાગ)
                  </option>
                  <option value=" ROADS AND BUILDING DEPARTMENT (માર્ગ અને મકાન વિભાગ)">
                    {" "}
                    ROADS AND BUILDING DEPARTMENT (માર્ગ અને મકાન વિભાગ)
                  </option>
                  <option value=" SCIENCE AND TECHNOLOGY DEPARTMENT (વિજ્ઞાન અને પ્રૌધ્યોગિકી વિભાગ)">
                    {" "}
                    SCIENCE AND TECHNOLOGY DEPARTMENT (વિજ્ઞાન અને પ્રૌધ્યોગિકી
                    વિભાગ)
                  </option>
                  <option value=" SOCIAL JUSTICE AND EMPOWERMENT DEPARTMENT (સામાજિક ન્યાય અને અધિકારીતા વિભાગ)">
                    {" "}
                    SOCIAL JUSTICE AND EMPOWERMENT DEPARTMENT (સામાજિક ન્યાય અને
                    અધિકારીતા વિભાગ)
                  </option>
                  <option value=" SPORTS, YOUTH and CULTURAL ACTIVITIES DEPARTMENT (રમતગમત, યુવા અને સાંસ્કૃતિક પ્રવૃતિ વિભાગ)">
                    {" "}
                    SPORTS, YOUTH and CULTURAL ACTIVITIES DEPARTMENT (રમતગમત,
                    યુવા અને સાંસ્કૃતિક પ્રવૃતિ વિભાગ)
                  </option>
                  <option value=" URBAN DEVELOPMENT and URBAN HOUSING DEPARTMENT (શહેરી વિકાસ અને શહેરી ગૃહ નિર્માણ વિભાગ)">
                    {" "}
                    URBAN DEVELOPMENT and URBAN HOUSING DEPARTMENT (શહેરી વિકાસ
                    અને શહેરી ગૃહ નિર્માણ વિભાગ)
                  </option>
                  <option value=" WOMEN AND CHILD DEVELOPMENT DEPARTMENT (મહિલા અને બાળ કલ્યાણ વિકાસ વિભાગ)">
                    {" "}
                    WOMEN AND CHILD DEVELOPMENT DEPARTMENT (મહિલા અને બાળ કલ્યાણ
                    વિકાસ વિભાગ)
                  </option>
                  <option value=" TRIBAL DEVELOPMENT DEPARTMENT (આદિજાતિ વિકાસ વિભાગ)">
                    {" "}
                    TRIBAL DEVELOPMENT DEPARTMENT (આદિજાતિ વિકાસ વિભાગ)
                  </option>
                  <option value=" Climate Change Department (કલાઇમેટ ચેઇન્‍જ વિભાગ)">
                    {" "}
                    Climate Change Department (કલાઇમેટ ચેઇન્‍જ વિભાગ)
                  </option>
                  <option value=" Chief Minister Office Department (મુખ્યમંત્રી કચેરી વિભાગ)">
                    {" "}
                    Chief Minister Office Department (મુખ્યમંત્રી કચેરી વિભાગ)
                  </option>
                  <option value=" Other"> Other</option>
                </select>
              </div>

              {/* Subject */}
              <div className="col-span-2">
                <label
                  htmlFor="subject"
                  className="block mb-1 font-bold dark:text-white "
                >
                  Subject
                </label>
                <div>
                  <Recorder />
                </div>
              </div>

              {/* Message */}
              <div className="col-span-2">
                <label
                  htmlFor="message"
                  className="block mb-1 font-bold dark:text-white"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                {errors.message && (
                  <div className="text-red-500">This field is required</div>
                )}
              </div>

              {/* Submit Button */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className="btn btn-primary w-full bg-orange-600 rounded font-bold	"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="w-[30%] ml-[70px] flex">
          <img
            src="https://cmogujarat.gov.in/sites/default/files/2022-07/write_to_gujarat.png"
            alt="Write to Gujarat"
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  );
};

export default MyForm;
