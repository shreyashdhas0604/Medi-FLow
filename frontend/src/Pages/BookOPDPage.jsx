import React, { useState, useEffect } from "react";
import apiClient from "../api/ApiClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { hoursToMilliseconds } from "date-fns";
import VirtualOPD from "../Components/VirtualOPD";

const BookOPDPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  
  const { hospital, selectedDate, selectedTimeSlot } = location.state || {};
  
  // Initialize form data with default values
  const [formData, setFormData] = useState({
    patientName: "",
    contactNumber: "",
    hospital: "",
    doctor: "",
    department: "",
    bed: "",
    date: new Date(),
    symptoms: "",
    age: "",
    gender: "",
    address: "",
    insuranceCard: "",
    rationCard: "",
    permanentIllness: "",
    disabilityStatus: "",
    followUp: false,
    followUpDate: null,
    followUpReason: "",
    followUpPrescription: "",
    followUpDiagnosis: "",
    allergies: "",
    bloodGroup: "",
    weight: "",
    isVirtualOPD: false,
    OPDTime: "",
  });

  // Set data from location state if available
  useEffect(() => {
    if (hospital) {
      console.log("selected timeslot: ", selectedTimeSlot);
      setFormData((prevFormData) => ({
        ...prevFormData,
        hospital: hospital.id,
        date: selectedDate || new Date(),
        OPDTime: selectedTimeSlot || "",
      }));
    }
  }, [hospital, selectedDate, selectedTimeSlot]);

  // Fetch hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await apiClient.get("/hospital/hospitals");
        console.log("Fetched hospitals:", response.data.data.hospitals);
        setHospitals(response.data.data.hospitals || []);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        toast.error("Failed to fetch hospitals");
      }
    };

    fetchHospitals();
  }, []);

  // Fetch doctors when hospital changes
  useEffect(() => {
    const fetchDoctors = async () => {
      // Only fetch if hospital ID is available
      if (!formData.hospital) {
        setDoctors([]);
        return;
      }
      
      try {
        const response = await apiClient.get(`/doctor/getDoctorsByHospital/${formData.hospital}`);
        console.log("Fetched doctors 1 :", response.data.data.doctors.data.doctors);
        // Properly handle the nested data structure
        if (response.data?.data?.doctors?.data?.doctors) {
          console.log("Fetched doctors:", response.data.data.doctors.data.doctors);
          setDoctors(response.data.data.doctors.data.doctors);
        } else if (response.data?.data?.doctors) {
          // Alternative path if structure is different
          console.log("Fetched doctors (alt path):", response.data.data.doctors);
          setDoctors(response.data.data.doctors);
        } else {
          console.log("No doctors found in response", response.data);
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to fetch doctors for this hospital");
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, [formData.hospital]);

  // Fetch patient data, hospital data, doctor data and time slots
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await apiClient.get("/user/me");
        console.log("Fetched patient data:", response.data.data.user);
        setPatientData(response.data.data.user);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast.error("Failed to fetch your profile data");
      }
    };

    const fetchHospitalData = async () => {
      if (!formData.hospital) return;
      
      try {
        const response = await apiClient.get(`/hospital/hospital/${formData.hospital}`);
        console.log("Hospital Data:", response.data);
        setHospitalData(response.data);
      } catch (error) {
        console.error("Error fetching hospital data:", error);
        toast.error("Failed to fetch hospital details");
      }
    };

    const fetchDoctorData = async () => {
      if (!formData.doctor) return;
      
      try {
        const response = await apiClient.get(`/doctor/getDoctor/${formData.doctor}`);
        console.log("Fetched doctor data:", response.data.data.doctor);
        setDoctorData(response.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        toast.error("Failed to fetch doctor details");
      }
    };

    const fetchTimeSlots = async () => {
      if (!formData.hospital || !formData.date) return;
      
      try {
        // Format date to match API requirements if needed
        const dateStr = formData.date.toISOString().split('T')[0];
        
        const response = await apiClient.get(
          `hospital/available-timeslots/${formData.hospital}/${dateStr}`
        );
        console.log("Fetched time slots:", response.data.data.availableTimeSlots);
        setTimeSlots(response.data.data.availableTimeSlots || []);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        toast.error("Failed to fetch available time slots");
      }
    };

    fetchPatientData();
    fetchHospitalData();
    fetchDoctorData();
    fetchTimeSlots();
  }, [formData.hospital, formData.doctor, formData.date]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientName)
      newErrors.patientName = "Patient name is required";
    if (!formData.contactNumber)
      newErrors.contactNumber = "Contact number is required";
    if (!formData.hospital)
      newErrors.hospital = "Hospital selection is required";
    if (!formData.doctor) newErrors.doctor = "Doctor selection is required";
    if (!formData.symptoms) newErrors.symptoms = "Symptoms are required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleProceed = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    // Validate the form data
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const patientID = JSON.parse(localStorage.getItem("user"));
  
    // Construct OPD data
    const opdData = {
      name: formData.patientName,
      patientID: parseInt(patientID?.id),
      doctorID: parseInt(formData.doctor),
      hospitalID: parseInt(formData.hospital),
      departmentID: formData.department || null,
      bedID: formData.bed || null,
      date: formData.date,
      symptoms: formData.symptoms || "N/A",
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
      address: formData.address || "N/A",
      insuranceCard: formData.insuranceCard || "N/A",
      rationCard: formData.rationCard || "N/A",
      permanentIllness: formData.permanentIllness || "N/A",
      disabilityStatus: formData.disabilityStatus || "N/A",
      followUp: formData.followUp,
      followUpDate: formData.followUp ? formData.followUpDate : null,
      followUpReason: formData.followUp ? formData.followUpReason : "N/A",
      followUpPrescription: formData.followUp ? formData.followUpPrescription : "N/A",
      followUpDiagnosis: formData.followUp ? formData.followUpDiagnosis : "N/A",
      allergies: formData.allergies || "N/A",
      bloodGroup: formData.bloodGroup || "N/A",
      weight: formData.weight ? parseFloat(formData.weight) : null,
      OPDTime: formData.OPDTime || timeSlots[selectedTimeSlot].time,
      isVirtualOPD: formData.isVirtualOPD,
      VirtualOPDLink: null,
      VirtualOPDRoomName: null,
    };

    
  
    try {
      // Submit OPD registration data
        console.log("selected TimeSlot : ",selectedTimeSlot);
        console.log("timeslots : ",timeSlots);

    const timeslotIndex = timeSlots.findIndex(slot => slot.time === formData.OPDTime);

    const originalDate = new Date(formData.date);

// Reset time to midnight
      const updatedDate = new Date(Date.UTC(
        originalDate.getUTCFullYear(),
        originalDate.getUTCMonth(),
        originalDate.getUTCDate()
      ));
      const opddate = new Date(formData.date);
      const payload = {
        uniqueIdentifier : `${opddate.toISOString().split("T")[0]}-${formData.OPDTime}-${formData.hospital}`,
        hospitalID: formData.hospital,
        time: timeSlots[selectedTimeSlot]?.time || formData.OPDTime,
        date: updatedDate.toISOString(),
        availableCount: timeSlots[timeslotIndex].availableCount - 1,
      }

      console.log("payload : ",payload);
  
      const updateSlot = await apiClient.post(`/hospital/${formData.hospital}/timeslots`, payload);
      console.log("Timeslot updated:", updateSlot.data);


      let response;
      if (formData.isVirtualOPD) {
        response = await apiClient.post("/opd/schedulemeet", opdData);
        console.log("Virtual Meeting booked:", response.data);
      } else {
        response = await apiClient.post("/opd/register", opdData);
        console.log("OPD booked:", response.data);
      }
  
      // Proceed to the next page after successful submission
    // Replace with actual doctor data if available
    if (patientData?.id && hospitalData?.id && doctorData?.id && opdData?.name) {
      navigate("/payment", {
        state: {
          patientData,
          hospitalData,
          doctorData,
          opdData,
          paymentStatus: "Pending",
        },
      });

    }
    toast.success("OPD booked successfully!");
    } catch (error) {
      console.error("Error booking OPD:", error);
      toast.error("Failed to book OPD. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const patientID = JSON.parse(localStorage.getItem("user"));

    console.log("selected TimeSlot : ",selectedTimeSlot);
    console.log("timeslots : ",timeSlots);
    console.log("formData.OPDTime : ",formData.OPDTime);
    const opdData = {
      name: formData.patientName,
      patientID: parseInt(patientID?.id),
      doctorID: parseInt(formData.doctor),
      hospitalID: parseInt(formData.hospital),
      departmentID: formData.department || null,
      bedID: formData.bed || null,
      date: formData.date,
      symptoms: formData.symptoms || "N/A",
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
      address: formData.address || "N/A",
      insuranceCard: formData.insuranceCard || "N/A",
      rationCard: formData.rationCard || "N/A",
      permanentIllness: formData.permanentIllness || "N/A",
      disabilityStatus: formData.disabilityStatus || "N/A",
      followUp: formData.followUp,
      followUpDate: formData.followUp ? formData.followUpDate : null,
      followUpReason: formData.followUp ? formData.followUpReason : "N/A",
      followUpPrescription: formData.followUp
        ? formData.followUpPrescription
        : "N/A",
      followUpDiagnosis: formData.followUp ? formData.followUpDiagnosis : "N/A",
      allergies: formData.allergies || "N/A",
      bloodGroup: formData.bloodGroup || "N/A",
      weight: formData.weight ? parseFloat(formData.weight) : null,
      OPDTime: (selectedTimeSlot ? (timeSlots[selectedTimeSlot].time) : (formData.OPDTime)),
      isVirtualOPD: formData.isVirtualOPD,
      VirtualOPDLink: null,
      VirtualOPDRoomName : null,
    };

    const timeslotIndex = timeSlots.findIndex(slot => slot.time === formData.OPDTime);
    const originalDate = new Date(formData.date);

// Reset time to midnight
      const updatedDate = new Date(Date.UTC(
        originalDate.getUTCFullYear(),
        originalDate.getUTCMonth(),
        originalDate.getUTCDate()
      ));

      const opddate = new Date(formData.date);
      const payload = {
        uniqueIdentifier : `${opddate.toISOString().split("T")[0]}-${formData.OPDTime}-${formData.hospital}`,
        hospitalID: formData.hospital,
        time: timeSlots[selectedTimeSlot]?.time || formData.OPDTime,
        date: updatedDate.toISOString(),
        availableCount: timeSlots[timeslotIndex].availableCount - 1,
      }

    const updateSlot = await apiClient.post(`/hospital/${formData.hospital}/timeslots`, payload);
    console.log("Timeslot updated:", updateSlot.data);

    try {
      if(formData.isVirtualOPD){
        const response = await apiClient.post("/opd/schedulemeet", opdData);
        console.log("Virtual Meeting booked:", response.data);
        toast.success("OPD booked successfully!");
      }
      else{
        const register = await apiClient.post("/opd/register", opdData);
        console.log("OPD booked:", register.data);
        toast.success("OPD booked successfully!");
      }
    } catch (error) {
      console.error("Error booking OPD:", error);
      toast.error("Failed to book OPD. Please try again.");
    }
  };

  return (
    <div className="book-opd-page bg-gradient-to-r from-blue-500 to-green-500 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-white mb-6">
        Book OPD Appointment
      </h1>
      <form
        onSubmit={handleProceed}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            {errors.patientName && (
              <p className="text-red-500 text-sm">{errors.patientName}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm">{errors.contactNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Hospital</label>

{/* Fix for hospital options */}
<select
  name="hospital"
  value={formData.hospital}
  onChange={handleChange}
  className="w-full border rounded p-2"
>
  <option key="default-hospital" value="">Select Hospital</option>
  {hospitals.map((hospital) => (
    <option key={`hospital-${hospital.id}`} value={hospital.id}>
      {hospital.name}
    </option>
  ))}
</select>

{errors.hospital && (
  <p className="text-red-500 text-sm">{errors.hospital}</p>
)}
          </div>
          {selectedTimeSlot !== undefined ? (
  <div>
    <label className="block text-gray-700">Time Slot</label>
    <select
      name="OPDTime"
      value={formData.OPDTime}
      onChange={handleChange}
      className="w-full border rounded p-2"
    >
      {timeSlots.length === 0 ? (
        <option key="no-slots" value="">No Time Slots Available</option>
      ) : (
        <option key={`slot-${selectedTimeSlot}`} value={selectedTimeSlot}>
          {timeSlots[selectedTimeSlot]?.time || "Invalid Slot"}
        </option>
      )}
    </select>
  </div>
) : formData.hospital ? (
  <div>
    <label className="block text-gray-700">Time Slot</label>
    <select
      name="OPDTime"
      value={formData.OPDTime}
      onChange={handleChange}
      className="w-full border rounded p-2"
    >
      {timeSlots.length === 0 ? (
        <option key="no-slots" value="">No Time Slots Available</option>
      ) : (
        <>
          <option key="default-slot" value="">Select Time Slot</option>
          {timeSlots.map((timeSlot, index) => (
            <option key={`slot-${timeSlot.id || index}`} value={timeSlot.id}>
              {timeSlot.time}
            </option>
          ))}
        </>
      )}
    </select>
  </div>
) : null}

          <div>
            <label className="block text-gray-700">Doctor</label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.user.username}
                </option>
              ))}
            </select>
            {errors.doctor && (
              <p className="text-red-500 text-sm">{errors.doctor}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Symptoms</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              className="w-full border rounded p-2"
            ></textarea>
            {errors.symptoms && (
              <p className="text-red-500 text-sm">{errors.symptoms}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Appointment Date</label>
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded p-2"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Allergies</label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Blood Group</label>
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Virtual OPD</label>
            <input
              type="checkbox"
              name="isVirtualOPD"
              checked={formData.isVirtualOPD}
              onChange={(e) =>
                setFormData({ ...formData, isVirtualOPD: e.target.checked })
              }
              className="w-4 h-4"
            />
          </div>
        <div>
          <label className="block text-gray-700">Follow-up</label>
          <input
            type="checkbox"
            name="followUp"
            checked={formData.followUp}
            onChange={(e) => setFormData({ ...formData, followUp: e.target.checked })}
            className="w-4 h-4"
          />
        </div>

        {formData.followUp && (
          <div>
            <label className="block text-gray-700">Follow-up Reason</label>
            <input
              type="text"
              name="followUpReason"
              value={formData.followUpReason}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        )}

        {formData.followUp && (
          <div>
            <label className="block text-gray-700">Follow-up Prescription</label>
            <input
              type="text"
              name="followUpPrescription"
              value={formData.followUpPrescription}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        )}

        
        </div>
        {/* Follow-up fields */}

        <div className="mt-6 flex justify-between">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleProceed}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookOPDPage;


