// import React, { useState, useEffect } from 'react';
// import apiClient from '../api/ApiClient';

// const UserProfile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [userData, setUserData] = useState({
//     username: '',
//     email: '',
//     age: null,
//     gender: '',
//     address: '',
//     contactNumber: '',
//     insuranceCard: '',
//     rationCard: '',
//     permanentIllness: '',
//     avatar: '',
//     role: '',
//     disabilityStatus: '',
//   }); 

//   const [newAvatar, setNewAvatar] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await apiClient.get('/user/me');
//         //only set userData fields that are in the usestate initialization
//         const user = response.data.data?.user || {};
//         console.log('User data response in fetchuserdata:', user); // Add this log to debug
//         setUserData({
//           username: user.username || '',
//           email: user.email || '',
//           age: user.age || null,
//           gender: user.gender || '',
//           address: user.address || '',
//           contactNumber: user.contactNumber || '',
//           insuranceCard: user.insuranceCard || '',
//           rationCard: user.rationCard || '',
//           permanentIllness: user.permanentIllness || '',
//           avatar: user.avatar || '',
//           role: user.role || '',
//           disabilityStatus: user.disabilityStatus || '',
//         });
//         console.log('Fetched user data:', response.data.data); // Add this log to debug
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };
//     fetchUserData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserData({
//       ...userData,
//       [name]: value,
//     });
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewAvatar(file);
//     }
//   };

//   const handleSave = async () => {
//     setIsEditing(false);

//     const formData = new FormData();

//     // Add all user data except avatar to formData
//     Object.keys(userData).forEach((key) => {
//       if (key !== 'avatar') {
//         formData.append(key, userData[key] !== null ? userData[key] : '');
//       }
//     });

//     // Only append the new avatar if it exists
//     if (newAvatar) {
//       formData.append('avatar', newAvatar);
//     }

//     try {
//       const response = await apiClient.put('/user/update-profile', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
      
//       console.log('Server response:', response.data);
//       setUserData(response.data.data);
//       setNewAvatar(null); // Reset newAvatar after successful upload
//     } catch (error) {
//       console.error('Error updating profile:', error);
//     }
//   };

//   // Function to get the correct avatar URL
//   const getAvatarUrl = () => {
//     // If there's a newAvatar file selected, show its preview
//     if (newAvatar) {
//       return URL.createObjectURL(newAvatar);
//     }
//     console.log('Avatar URL Debug 1:', userData.user?.avatar); // Debug log
    
//     // If there's an avatar URL in userData, use it
//     if (userData.user?.avatar) {
//       // Check if avatar is already a full URL or needs a base URL prepended
//       console.log('Avatar URL Debug :', userData.user?.avatar); // Debug log
//       if (userData.user?.avatar.startsWith('http')) {
//         return userData.user?.avatar.replace(/\s+/g, '');
//       } else {
//         // You might need to prepend your API base URL if the avatar is a relative path
//         // For example: return `${API_BASE_URL}${userData.avatar}`;
//         return userData.user?.avatar.replace(/\s+/g, '');
//       }
//     }
    
//     // Default avatar
//     return 'https://res.cloudinary.com/dxjwv0l  ph/image/upload/v1746970139/Shreyash%20Dhas-1746970137995.jpg';

//   };

//   const userRenderDetails = () => {
//     return (
//       <div className="bg-white text-gray-900 shadow-lg rounded-lg w-full max-w-5xl p-6 lg:p-10">
//         <h1 className="text-3xl text-center text-blue-500 font-bold mb-6">User Profile</h1>
//         <div className="flex flex-col items-center mb-8">
//           <img
//             src={getAvatarUrl()}
//             alt="User Avatar"
//             className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-teal-500 shadow-md"
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = '/default-avatar.png';
//             }}
//           />
//           {isEditing && (
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleAvatarChange}
//               className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-teal-500 file:text-white hover:file:bg-teal-600"
//             />
//           )}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-md font-medium">Username :</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="username"
//                 value={userData.username || ''}
//                 onChange={handleChange}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-md"
//               />
//             ) : (
//               <p className="text-lg text-blue-500 font-medium">{userData.username || 'N/A'}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-md font-medium">Email :</label>
//             {isEditing ? (
//               <input
//                 type="email"
//                 name="email"
//                 value={userData.email || ''}
//                 onChange={handleChange}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-md"
//               />
//             ) : (
//               <p className="text-lg  text-blue-500 font-medium">{userData.email || 'N/A'}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-md font-medium">Age :</label>
//             {isEditing ? (
//               <input
//                 type="number"
//                 name="age"
//                 value={userData.age || ''}
//                 onChange={handleChange}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-md"
//               />
//             ) : (
//               <p className="text-lg  text-blue-500 font-medium">{userData.age || 'N/A'}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-md font-medium">Gender :</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="gender"
//                 value={userData.gender || ''}
//                 onChange={handleChange}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-md"
//               />
//             ) : (
//               <p className="text-lg  text-blue-500 font-medium">{userData.gender || 'N/A'}</p>
//             )}
//           </div>

//           <div className="lg:col-span-2">
//             <label className="block text-md font-medium">Address :</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="address"
//                 value={userData.address || ''}
//                 onChange={handleChange}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-md"
//               />
//             ) : (
//               <p className="text-lg  text-blue-500 font-medium">{userData.address || 'N/A'}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-md font-medium">Insurance Card :</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="insuranceCard"
//                 value={userData.insuranceCard || ''}
//                 onChange={handleChange}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-md"
//               />
//             ) : (
//               <p className="text-lg  text-blue-500 font-medium">{userData.insuranceCard || 'N/A'}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-md font-medium">Ration Card :</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="rationCard"
//                 value={userData.rationCard || ''}
//                 onChange={handleChange}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-md"
//               />
//             ) : (
//               <p className="text-lg  text-blue-500 font-medium">{userData.rationCard || 'N/A'}</p>
//             )}
//           </div>
//           <div className="lg:col-span-2">
//             <label className="block text-md font-medium">Permanent Illness :</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="permanentIllness"
//                 value={userData.permanentIllness || ''}
//                 onChange={handleChange}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-md"
//               />
//             ) : (
//               <p className="text-lg  text-blue-500 font-medium">{userData.permanentIllness || 'N/A'}</p>
//             )}
//           </div>
          
//             <div className="lg:col-span-2">
//                 <label className="block text-md font-medium">Role :</label>
//                 <p className="text-lg  text-blue-500 font-medium">{userData.role || 'N/A'}</p>
//             </div>
//         </div>

//         <div className="flex justify-between mt-8">
//           <button
//             onClick={() => setIsEditing(!isEditing)}
//             className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
//           >
//             {isEditing ? 'Cancel' : 'Edit'}
//           </button>
//           {isEditing && (
//             <button
//               onClick={handleSave}
//               className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600"
//             >
//               Save
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Doctor and OPD render functions remain the same
//   const doctorRenderDetails = () => {
//     return (
//       <div className="bg-white text-gray-900 shadow-lg rounded-lg w-full max-w-5xl p-6 lg:p-10">
//         <h1 className="text-3xl text-center text-blue-500 font-bold mb-6">Doctor Details</h1>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-md font-medium">Specialization :</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="specialization"
//                 value={userData.doctorInfo?.specialization || ''}
//                 onChange={handleChange}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-md"
//               />
//             ) : (
//               <p className="text-lg text-blue-500 font-medium">{userData.doctorInfo?.specialization || 'N/A'}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-md font-medium">Qualification :</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="qualification"
//                 value={userData.doctorInfo?.qualification || ''}
//                 onChange={handleChange}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-md"
//               />
//             ) : (
//               <p className="text-lg text-blue-500 font-medium">{userData.doctorInfo?.qualification || 'N/A'}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-md font-medium">Experience :</label>
//             {isEditing ? (
//               <input
//                 type="number"
//                 name="experience"
//                 value={userData.doctorInfo?.experience || ''}
//                 onChange={handleChange}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-md"
//               />
//             ) : (
//               <p className="text-lg text-blue-500 font-medium">{userData.doctorInfo?.experience || 'N/A'} years</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-md font-medium">Hospital :</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="hospital"
//                 value={userData.doctorInfo?.hospital?.name || ''}
//                 onChange={handleChange}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-md"
//               />
//             ) : (
//               <p className="text-lg text-blue-500 font-medium">{userData.doctorInfo?.hospital?.name || 'N/A'}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-md font-medium">Department :</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="department"
//                 value={userData.doctorInfo?.department?.name || ''}
//                 onChange={handleChange}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-md"
//               />
//             ) : (
//               <p className="text-lg text-blue-500 font-medium">{userData.doctorInfo?.department?.name || 'N/A'}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-md font-medium">Availability :</label>
//             {isEditing ? (
//               <select
//                 name="isAvailable"
//                 value={userData.doctorInfo?.isAvailable ? 'Available' : 'Not Available'}
//                 onChange={handleChange}
//                 className="mt-1 p-3 w-full border border-gray-300 rounded-md"
//               >
//                 <option value="Available">Available</option>
//                 <option value="Not Available">Not Available</option>
//               </select>
//             ) : (
//               <p className="text-lg text-blue-500 font-medium">{userData.doctorInfo?.isAvailable ? 'Available' : 'Not Available'}</p>
//             )}
//           </div>
//           <div className="lg:col-span-2">
//             <label className="block text-md font-medium">Ratings :</label>
//             <p className="text-lg text-blue-500 font-medium">{userData.doctorInfo?.ratings || 'N/A'}</p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const opdRenderDetails = () => {
//     return (
//       <div className="bg-white text-gray-900 shadow-lg rounded-lg w-full max-w-5xl p-6 lg:p-10">
//         <h1 className="text-3xl text-center text-blue-500 font-bold mb-6">OPD Details</h1>
//         {userData.registrations && userData.registrations.length > 0 ? (
//           userData.registrations.map((registration, index) => (
//             <div key={index} className="mb-8">
//               <div className="flex flex-col items-center mb-4">
//                 <img
//                   src={registration.doctor.user.avatar || '/default-avatar.png'}
//                   alt="Doctor Avatar"
//                   className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-teal-500 shadow-md"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = '/default-avatar.png';
//                   }}
//                 />
//               </div>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-md font-medium">Doctor Name :</label>
//                   <p className="text-lg text-blue-500 font-medium">{registration.doctor.user.username || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">Doctor Email :</label>
//                   <p className="text-lg text-blue-500 font-medium">{registration.doctor.user.email || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">Doctor Contact Number :</label>
//                   <p className="text-lg text-blue-500 font-medium">{registration.doctor.user.contactNumber || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">Hospital Name :</label>
//                   <p className="text-lg text-blue-500 font-medium">{registration.hospital.name || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">Hospital Speciality :</label>
//                   <p className="text-lg text-blue-500 font-medium">{registration.hospital.speciality || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">Hospital Address :</label>
//                   <p className="text-lg text-blue-500 font-medium">{registration.hospital.address || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">OPD Time :</label>
//                   <p className="text-lg text-blue-500 font-medium">{registration.OPDTime || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">OPD Date :</label>
//                   <p className="text-lg text-blue-500 font-medium">
//                     {registration.date ? new Date(registration.date).toLocaleDateString() : 'N/A'}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">OPD Type :</label>
//                   <p className="text-lg text-blue-500 font-medium">{registration.isVirtualOPD === true ? "Virtual" : "In Hospital"}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">OPD Booked Date :</label>
//                   <p className="text-lg text-blue-500 font-medium">
//                     {registration.updatedAt ? new Date(registration.updatedAt).toLocaleDateString() : 'N/A'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           userData.doctorInfo?.registrations && userData.doctorInfo.registrations.length > 0 ? (
//             userData.doctorInfo.registrations.map((registration, index) => (
//               <div key={index} className="mb-8">
//                 <div className="flex flex-col items-center mb-4">
//                   <img
//                     src={getAvatarUrl()}
//                     alt="Doctor Avatar"
//                     className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-teal-500 shadow-md"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = '/default-avatar.png';
//                     }}
//                   />
//                 </div>
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-md font-medium">Patient Name :</label>
//                     <p className="text-lg text-blue-500 font-medium">
//                       {registration.patient.username || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-md font-medium">Doctor :</label>
//                     <p className="text-lg text-blue-500 font-medium">
//                       {userData.username || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-md font-medium">Patient Email :</label>
//                     <p className="text-lg text-blue-500 font-medium">
//                       {registration.patient.email || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-md font-medium">Patient Contact Number :</label>
//                     <p className="text-lg text-blue-500 font-medium">
//                       {registration.patient.contactNumber || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-md font-medium">Hospital Name :</label>
//                     <p className="text-lg text-blue-500 font-medium">
//                       {userData.doctorInfo?.hospital?.name || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-md font-medium">Hospital Speciality :</label>
//                     <p className="text-lg text-blue-500 font-medium">
//                       {userData.doctorInfo?.hospital?.speciality || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-md font-medium">Hospital Address :</label>
//                     <p className="text-lg text-blue-500 font-medium">
//                       {userData.doctorInfo?.hospital?.address || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-md font-medium">OPD Time :</label>
//                     <p className="text-lg text-blue-500 font-medium">
//                       {registration?.OPDTime || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-md font-medium">OPD Date :</label>
//                     <p className="text-lg text-blue-500 font-medium">
//                       {registration?.date ? new Date(registration.date).toLocaleDateString() : "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-md font-medium">OPD Type :</label>
//                     <p className="text-lg text-blue-500 font-medium">
//                       {registration?.isVirtualOPD === true ? "Virtual" : "In Hospital"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-lg text-center text-blue-500 font-medium">No OPD registrations found.</p>
//           )
//         )}
//       </div>
//     );
//   };

//   const adminRenderDetails = () => {
//     return (
//       <div className="bg-white text-gray-900 shadow-lg rounded-lg w-full max-w-5xl p-6 lg:p-10">
//         <h1 className="text-2xl text-center text-blue-500 font-bold mt-6 mb-4">Managed Hospitals</h1>
//         {userData.managedHospitals && userData.managedHospitals.length > 0 ? (
//           userData.managedHospitals.map((hospital, index) => (
//             <div key={index} className="mb-8">
//               <div className="flex flex-col items-center mb-4">
//                 <img
//                   src={hospital.hospitalImageUrl && hospital.hospitalImageUrl[0] ? hospital.hospitalImageUrl[0] : '/default-hospital.png'}
//                   alt="Hospital"
//                   className="w-124 h-96 rounded-md object-cover mb-4 border-4 border-teal-500 shadow-md"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = '/default-hospital.png';
//                   }}
//                 />
//               </div>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-md font-medium">Hospital Name :</label>
//                   <p className="text-lg text-blue-500 font-medium">{hospital.name || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">Speciality :</label>
//                   <p className="text-lg text-blue-500 font-medium">{hospital.speciality || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">Address :</label>
//                   <p className="text-lg text-blue-500 font-medium">{hospital.address || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">Contact Number :</label>
//                   <p className="text-lg text-blue-500 font-medium">{hospital.contactNumber || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">Registration Number :</label>
//                   <p className="text-lg text-blue-500 font-medium">{hospital.registrationNumber || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">Total Beds :</label>
//                   <p className="text-lg text-blue-500 font-medium">{hospital.totalBeds || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">Timings :</label>
//                   <p className="text-lg text-blue-500 font-medium">{hospital.timings || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">Established Date :</label>
//                   <p className="text-lg text-blue-500 font-medium">
//                     {hospital.establishedDate ? new Date(hospital.establishedDate).toLocaleDateString() : 'N/A'}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-md font-medium">Verified Status :</label>
//                   <p className="text-lg text-blue-500 font-medium">{hospital.isVerified ? 'Verified' : 'Not Verified'}</p>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-lg text-blue-500 font-medium">No hospitals managed.</p>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="bg-gradient-to-r from-blue-500 to-teal-500 min-h-screen flex flex-col items-center justify-center p-4">
//       <div className="w-full max-w-5xl grid grid-cols-1 gap-6">
//         {userRenderDetails()}
//         {userData.role === 'Doctor' && doctorRenderDetails()}
//         {opdRenderDetails()}
//         {userData.role === 'Admin' && adminRenderDetails()}
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

import React, { useState, useEffect } from 'react';
import apiClient from '../api/ApiClient';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    age: null,
    gender: '',
    address: '',
    contactNumber: '',
    insuranceCard: '',
    rationCard: '',
    permanentIllness: '',
    avatar: '',
    role: '',
    disabilityStatus: '',
    // Include nested objects to match your API structure
    doctorInfo: null,
    registrations: [],
    managedHospitals: []
  }); 

  const [newAvatar, setNewAvatar] = useState(null);
  // Add a loading state to prevent re-fetching while data is loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoading) return; // Prevent multiple fetches
      
      try {
        const response = await apiClient.get('/user/me');
        const user = response.data.data?.user || {};
        console.log('User data response:', user);
        
        // Directly map the whole structure instead of individual fields
        setUserData({
          // Map all expected fields
          username: user.username || '',
          email: user.email || '',
          age: user.age || null,
          gender: user.gender || '',
          address: user.address || '',
          contactNumber: user.contactNumber || '',
          insuranceCard: user.insuranceCard || '',
          rationCard: user.rationCard || '',
          permanentIllness: user.permanentIllness || '',
          avatar: user.avatar || '', // Store just the avatar string
          role: user.role || '',
          disabilityStatus: user.disabilityStatus || '',
          // Include the nested objects that might be needed later
          doctorInfo: user.doctorInfo || null,
          registrations: user.registrations || [],
          managedHospitals: user.managedHospitals || []
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false); // Mark loading as complete regardless of success/failure
      }
    };
    
    fetchUserData();
  }, [isLoading]); // Only depend on isLoading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);

    const formData = new FormData();

    // Add all user data except avatar to formData
    Object.keys(userData).forEach((key) => {
      // Skip complex objects and arrays when adding to formData
      if (key !== 'avatar' && 
          typeof userData[key] !== 'object' && 
          !Array.isArray(userData[key]) &&
          userData[key] !== null) {
        formData.append(key, userData[key]);
      }
    });

    // Only append the new avatar if it exists
    if (newAvatar) {
      formData.append('avatar', newAvatar);
    }

    try {
      const response = await apiClient.put('/user/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Server response:', response.data);
      
      // Refresh user data after successful update
      setIsLoading(true);
      setNewAvatar(null); // Reset newAvatar after successful upload
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Fixed getAvatarUrl function
  const getAvatarUrl = () => {
    // If there's a newAvatar file selected, show its preview
    if (newAvatar) {
      return URL.createObjectURL(newAvatar);
    }
    // If there's an avatar URL in userData, use it
    if (userData.avatar) {
      // Check if avatar is already a full URL or needs a base URL prepended
      if (userData.avatar.startsWith('http')) {
        // Fix for URL with space
        return userData.avatar.replace(/\s+/g, '');
      } else {
        // You might need to prepend your API base URL if the avatar is a relative path
        // For example: return `${API_BASE_URL}${userData.avatar}`;
        return userData.avatar;
      }
    }
    
    // Default avatar - fixed URL without spaces
    return 'https://res.cloudinary.com/dxjwv0lph/image/upload/v1746970139/default-avatar.jpg';
  };

  const userRenderDetails = () => {
    return (
      <div className="bg-white text-gray-900 shadow-lg rounded-lg w-full max-w-5xl p-6 lg:p-10">
        <h1 className="text-3xl text-center text-blue-500 font-bold mb-6">User Profile</h1>
        <div className="flex flex-col items-center mb-8">
          <img
            src={getAvatarUrl()}
            alt="User Avatar"
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-teal-500 shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-avatar.png';
            }}
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-teal-500 file:text-white hover:file:bg-teal-600"
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-md font-medium">Username :</label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={userData.username || ''}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-lg text-blue-500 font-medium">{userData.username || 'N/A'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-md font-medium">Email :</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={userData.email || ''}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-lg  text-blue-500 font-medium">{userData.email || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-md font-medium">Age :</label>
            {isEditing ? (
              <input
                type="number"
                name="age"
                value={userData.age || ''}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-lg  text-blue-500 font-medium">{userData.age || 'N/A'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-md font-medium">Gender :</label>
            {isEditing ? (
              <input
                type="text"
                name="gender"
                value={userData.gender || ''}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-lg  text-blue-500 font-medium">{userData.gender || 'N/A'}</p>
            )}
          </div>

          <div className="lg:col-span-2">
            <label className="block text-md font-medium">Address :</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={userData.address || ''}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-lg  text-blue-500 font-medium">{userData.address || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-md font-medium">Insurance Card :</label>
            {isEditing ? (
              <input
                type="text"
                name="insuranceCard"
                value={userData.insuranceCard || ''}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-lg  text-blue-500 font-medium">{userData.insuranceCard || 'N/A'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-md font-medium">Ration Card :</label>
            {isEditing ? (
              <input
                type="text"
                name="rationCard"
                value={userData.rationCard || ''}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-lg  text-blue-500 font-medium">{userData.rationCard || 'N/A'}</p>
            )}
          </div>
          
          <div className="lg:col-span-2">
            <label className="block text-md font-medium">Permanent Illness :</label>
            {isEditing ? (
              <input
                type="text"
                name="permanentIllness"
                value={userData.permanentIllness || ''}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-lg  text-blue-500 font-medium">{userData.permanentIllness || 'N/A'}</p>
            )}
          </div>
          
          <div className="lg:col-span-2">
            <label className="block text-md font-medium">Role :</label>
            <p className="text-lg  text-blue-500 font-medium">{userData.role || 'N/A'}</p>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600"
            >
              Save
            </button>
          )}
        </div>
      </div>
    );
  };

  // Doctor section with fixed data structure
  const doctorRenderDetails = () => {
    const doctorInfo = userData.doctorInfo || {};
    
    return (
      <div className="bg-white text-gray-900 shadow-lg rounded-lg w-full max-w-5xl p-6 lg:p-10">
        <h1 className="text-3xl text-center text-blue-500 font-bold mb-6">Doctor Details</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-md font-medium">Specialization :</label>
            {isEditing ? (
              <input
                type="text"
                name="specialization"
                value={doctorInfo.specialization || ''}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-lg text-blue-500 font-medium">{doctorInfo.specialization || 'N/A'}</p>
            )}
          </div>
          <div>
            <label className="block text-md font-medium">Qualification :</label>
            {isEditing ? (
              <input
                type="text"
                name="qualification"
                value={doctorInfo.qualification || ''}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-lg text-blue-500 font-medium">{doctorInfo.qualification || 'N/A'}</p>
            )}
          </div>
          <div>
            <label className="block text-md font-medium">Experience :</label>
            {isEditing ? (
              <input
                type="number"
                name="experience"
                value={doctorInfo.experience || ''}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-lg text-blue-500 font-medium">{doctorInfo.experience || 'N/A'} years</p>
            )}
          </div>
          <div>
            <label className="block text-md font-medium">Hospital :</label>
            {isEditing ? (
              <input
                type="text"
                name="hospital"
                value={doctorInfo.hospital?.name || ''}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-lg text-blue-500 font-medium">{doctorInfo.hospital?.name || 'N/A'}</p>
            )}
          </div>
          <div>
            <label className="block text-md font-medium">Department :</label>
            {isEditing ? (
              <input
                type="text"
                name="department"
                value={doctorInfo.department?.name || ''}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-lg text-blue-500 font-medium">{doctorInfo.department?.name || 'N/A'}</p>
            )}
          </div>
          <div>
            <label className="block text-md font-medium">Availability :</label>
            {isEditing ? (
              <select
                name="isAvailable"
                value={doctorInfo.isAvailable ? 'Available' : 'Not Available'}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            ) : (
              <p className="text-lg text-blue-500 font-medium">{doctorInfo.isAvailable ? 'Available' : 'Not Available'}</p>
            )}
          </div>
          <div className="lg:col-span-2">
            <label className="block text-md font-medium">Ratings :</label>
            <p className="text-lg text-blue-500 font-medium">{doctorInfo.ratings || 'N/A'}</p>
          </div>
        </div>
      </div>
    );
  };

  // OPD section with fixed data structure
  const opdRenderDetails = () => {
    return (
      <div className="bg-white text-gray-900 shadow-lg rounded-lg w-full max-w-5xl p-6 lg:p-10">
        <h1 className="text-3xl text-center text-blue-500 font-bold mb-6">OPD Details</h1>
        {userData.registrations && userData.registrations.length > 0 ? (
          userData.registrations.map((registration, index) => (
            <div key={index} className="mb-8">
              <div className="flex flex-col items-center mb-4">
                <img
                  src={registration.doctor?.user?.avatar || '/default-avatar.png'}
                  alt="Doctor Avatar"
                  className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-teal-500 shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-md font-medium">Doctor Name :</label>
                  <p className="text-lg text-blue-500 font-medium">{registration.doctor?.user?.username || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">Doctor Email :</label>
                  <p className="text-lg text-blue-500 font-medium">{registration.doctor?.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">Doctor Contact Number :</label>
                  <p className="text-lg text-blue-500 font-medium">{registration.doctor?.user?.contactNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">Hospital Name :</label>
                  <p className="text-lg text-blue-500 font-medium">{registration.hospital?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">Hospital Speciality :</label>
                  <p className="text-lg text-blue-500 font-medium">{registration.hospital?.speciality || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">Hospital Address :</label>
                  <p className="text-lg text-blue-500 font-medium">{registration.hospital?.address || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">OPD Time :</label>
                  <p className="text-lg text-blue-500 font-medium">{registration.OPDTime || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">OPD Date :</label>
                  <p className="text-lg text-blue-500 font-medium">
                    {registration.date ? new Date(registration.date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-md font-medium">OPD Type :</label>
                  <p className="text-lg text-blue-500 font-medium">{registration.isVirtualOPD === true ? "Virtual" : "In Hospital"}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">OPD Booked Date :</label>
                  <p className="text-lg text-blue-500 font-medium">
                    {registration.updatedAt ? new Date(registration.updatedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          userData.doctorInfo?.registrations && userData.doctorInfo.registrations.length > 0 ? (
            userData.doctorInfo.registrations.map((registration, index) => (
              <div key={index} className="mb-8">
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={getAvatarUrl()}
                    alt="Doctor Avatar"
                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-teal-500 shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-md font-medium">Patient Name :</label>
                    <p className="text-lg text-blue-500 font-medium">
                      {registration.patient?.username || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-md font-medium">Doctor :</label>
                    <p className="text-lg text-blue-500 font-medium">
                      {userData.username || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-md font-medium">Patient Email :</label>
                    <p className="text-lg text-blue-500 font-medium">
                      {registration.patient?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-md font-medium">Patient Contact Number :</label>
                    <p className="text-lg text-blue-500 font-medium">
                      {registration.patient?.contactNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-md font-medium">Hospital Name :</label>
                    <p className="text-lg text-blue-500 font-medium">
                      {userData.doctorInfo?.hospital?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-md font-medium">Hospital Speciality :</label>
                    <p className="text-lg text-blue-500 font-medium">
                      {userData.doctorInfo?.hospital?.speciality || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-md font-medium">Hospital Address :</label>
                    <p className="text-lg text-blue-500 font-medium">
                      {userData.doctorInfo?.hospital?.address || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-md font-medium">OPD Time :</label>
                    <p className="text-lg text-blue-500 font-medium">
                      {registration?.OPDTime || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-md font-medium">OPD Date :</label>
                    <p className="text-lg text-blue-500 font-medium">
                      {registration?.date ? new Date(registration.date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-md font-medium">OPD Type :</label>
                    <p className="text-lg text-blue-500 font-medium">
                      {registration?.isVirtualOPD === true ? "Virtual" : "In Hospital"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg text-center text-blue-500 font-medium">No OPD registrations found.</p>
          )
        )}
      </div>
    );
  };

  // Admin section with fixed data structure
  const adminRenderDetails = () => {
    return (
      <div className="bg-white text-gray-900 shadow-lg rounded-lg w-full max-w-5xl p-6 lg:p-10">
        <h1 className="text-2xl text-center text-blue-500 font-bold mt-6 mb-4">Managed Hospitals</h1>
        {userData.managedHospitals && userData.managedHospitals.length > 0 ? (
          userData.managedHospitals.map((hospital, index) => (
            <div key={index} className="mb-8">
              <div className="flex flex-col items-center mb-4">
                <img
                  src={hospital.hospitalImageUrl && hospital.hospitalImageUrl[0] ? hospital.hospitalImageUrl[0] : '/default-hospital.png'}
                  alt="Hospital"
                  className="w-124 h-96 rounded-md object-cover mb-4 border-4 border-teal-500 shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-hospital.png';
                  }}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-md font-medium">Hospital Name :</label>
                  <p className="text-lg text-blue-500 font-medium">{hospital.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">Speciality :</label>
                  <p className="text-lg text-blue-500 font-medium">{hospital.speciality || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">Address :</label>
                  <p className="text-lg text-blue-500 font-medium">{hospital.address || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">Contact Number :</label>
                  <p className="text-lg text-blue-500 font-medium">{hospital.contactNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">Registration Number :</label>
                  <p className="text-lg text-blue-500 font-medium">{hospital.registrationNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">Total Beds :</label>
                  <p className="text-lg text-blue-500 font-medium">{hospital.totalBeds || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">Timings :</label>
                  <p className="text-lg text-blue-500 font-medium">{hospital.timings || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-md font-medium">Established Date :</label>
                  <p className="text-lg text-blue-500 font-medium">
                    {hospital.establishedDate ? new Date(hospital.establishedDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-md font-medium">Verified Status :</label>
                  <p className="text-lg text-blue-500 font-medium">{hospital.isVerified ? 'Verified' : 'Not Verified'}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-lg text-blue-500 font-medium">No hospitals managed.</p>
        )}
      </div>
    );
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white text-gray-900 shadow-lg rounded-lg w-full max-w-5xl p-6 lg:p-10 text-center">
          <h1 className="text-3xl text-blue-500 font-bold mb-6">Loading profile data...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-teal-500 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 gap-6">
        {userRenderDetails()}
        {userData.role === 'Doctor' && doctorRenderDetails()}
        {opdRenderDetails()}
        {userData.role === 'Admin' && adminRenderDetails()}
      </div>
    </div>
  );
};

export default UserProfile;