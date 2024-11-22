// import React, { useEffect, useState } from "react";
// import UserHeader from "../screen/component/userHeader";
// import OwnerSection from "./ownerComponent/ownerSection";
// import groupCompany from "../images/Group.webp";
// import search from "../images/searchIcon.webp";
// import line from "../images/Line 3.webp";
// import OwnerTeamComponent from "./ownerTeamComponent";
// import axios from "axios";
// import { enqueueSnackbar, SnackbarProvider } from 'notistack'
// import Footer from "../screen/component/footer";
// import Skeleton from "react-loading-skeleton";
// import 'react-loading-skeleton/dist/skeleton.css'
// import useLoading from "../hooks/useLoading";
// import { useNavigate, useParams } from "react-router-dom";
// import Swal from 'sweetalert2/dist/sweetalert2.js'
// import '../../node_modules/sweetalert2/src/sweetalert2.scss'
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import { AiFillStar } from 'react-icons/ai'
// import archiveIcon from "../images/archive.svg";
// import inviteIcon from "../images/invitation.svg";

// function OwnerUserTimeline() {

//     const navigate = useNavigate()
//     const { loading, setLoading, loading2, setLoading2 } = useLoading()
//     const [data, setData] = useState([]);
//     const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
//     const token = localStorage.getItem('token');
//     const headers = {
//         Authorization: "Bearer " + token,
//     };
//     const user = JSON.parse(localStorage.getItem("items"))
//     const { id } = useParams()

//     const [day, setDay] = useState("");
//     const [month, setMonth] = useState("Jan");
//     const [showDropdown, setShowDropdown] = useState({
//         active1: false,
//         active2: false,
//         active3: false,
//     });
//     const months = [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December",
//     ];
//     const years = [
//         2024,
//         2025,
//         2026,
//         2027,
//         2028,
//         2029,
//         2030,
//         2031,
//         2032,
//         2033,
//         2034,
//         2035,
//     ];
//     const [year, setYear] = useState(new Date().getFullYear());

//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonth = currentDate.getMonth();
//     const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
//     const allDaysOfMonth = Array.from({ length: daysInMonth }, (_, index) => index + 1);

//     const getData = async () => {
//         setLoading(true)
//         try {
//             const response = await axios.get(`${apiUrl}/tracker/getTrackerDataAdmin/${id}`, { headers })
//             if (response.status) {
//                 setLoading(false)
//                 setData(response.data.data)
//                 console.log(response);
//             }
//         }
//         catch (err) {
//             console.log(err);
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         getData();
//     }, [])

//     const calculateTotalDistance = () => {
//         return data?.groupedLocations?.reduce((totalDistance, session) => {
//             return totalDistance + (session?.locations?.reduce((sessionTotal, location) => sessionTotal + (location.distance || 0), 0) || 0);
//         }, 0);
//     };

//     const totalDistance = calculateTotalDistance()

//     console.log(totalDistance);

//     return (
//         <div>
//             <div className="container">
//                 <div className="userHeader">
//                     <div className="d-flex align-items-center gap-3">
//                         <div><img src={groupCompany} /></div>
//                         <h5>User location activity</h5>
//                     </div>
//                 </div>

//                 <div className="mainwrapper">
//                     <div className="ownerTeamContainer">
//                         <div style={{
//                             display: "flex", position: "relative"
//                         }}>


//                             <div onClick={() => setShowDropdown({ ...showDropdown, active2: false, active3: false, active1: !showDropdown.active1 })} style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                                 backgroundColor: "white",
//                                 boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
//                                 borderRadius: "10px",
//                                 padding: "10px",
//                                 margin: "20px 0",
//                                 cursor: "pointer",
//                             }}>
//                                 <p style={{ fontSize: 16, margin: 0 }}>{day === "" ? "Select Day" : day}</p>
//                             </div>
//                             {showDropdown.active1 && (
//                                 <div style={{
//                                     width: 100,
//                                     height: "300px",
//                                     overflowY: "scroll",

//                                     overflowX: "hidden",
//                                     position: "absolute",
//                                     top: 65,
//                                     zIndex: 1000,
//                                     backgroundColor: "white",
//                                     boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
//                                     borderRadius: 10,
//                                     padding: 10
//                                 }}>
//                                     {allDaysOfMonth.map((day) => <p onClick={() => setDay(day)} style={{ color: "black", fontSize: 16, fontWeight: "700", cursor: "pointer" }}>{day}</p>)}
//                                 </div>
//                             )}


//                             <div onClick={() => setShowDropdown({ ...showDropdown, active1: false, active3: false, active2: !showDropdown.active2 })} style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                                 backgroundColor: "white",
//                                 boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
//                                 borderRadius: "10px",
//                                 padding: "10px",
//                                 margin: "20px 30px",
//                                 cursor: "pointer",
//                             }}>
//                                 <p style={{ fontSize: 16, margin: 0 }}>{month === "" ? "Select Month" : month}</p>
//                             </div>
//                             {showDropdown.active2 && (
//                                 <div style={{
//                                     width: 120,
//                                     height: "300px",
//                                     overflowY: "scroll",
//                                     overflowX: "hidden",
//                                     position: "absolute",
//                                     top: 65,
//                                     left: 100,
//                                     zIndex: 1000,
//                                     backgroundColor: "white",
//                                     boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
//                                     borderRadius: 10,
//                                     padding: 10
//                                 }}>
//                                     {months.map((month) => <p onClick={() => setMonth(month)} style={{ color: "black", fontSize: 16, fontWeight: "700", cursor: "pointer" }}>{month}</p>)}
//                                 </div>
//                             )}


//                             <div onClick={() => setShowDropdown({ ...showDropdown, active1: false, active2: false, active3: !showDropdown.active3 })} style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                                 backgroundColor: "white",
//                                 boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
//                                 borderRadius: "10px",
//                                 padding: "10px",
//                                 margin: "20px 0",
//                                 cursor: "pointer",
//                             }}>
//                                 <p style={{ fontSize: 16, margin: 0 }}>{year === "" ? "Select Year" : year}</p>
//                             </div>
//                             {showDropdown.active3 && (
//                                 <div style={{
//                                     width: 100,
//                                     height: "300px",
//                                     overflowY: "scroll",

//                                     overflowX: "hidden",
//                                     position: "absolute",
//                                     top: 65,
//                                     left: 200,
//                                     zIndex: 1000,
//                                     backgroundColor: "white",
//                                     boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
//                                     borderRadius: 10,
//                                     padding: 10
//                                 }}>
//                                     {years.map((year) => <p onClick={() => setYear(year)} style={{ color: "black", fontSize: 16, fontWeight: "700", cursor: "pointer" }}>{year}</p>)}
//                                 </div>
//                             )}


//                         </div>
//                         {loading ? (
//                             <div className="loader"></div>
//                         ) : (
//                             <>
//                                 <div style={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "space-between",
//                                     backgroundColor: "white",
//                                     boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
//                                     borderRadius: "20px",
//                                     padding: "20px",
//                                     margin: "20px 0"
//                                 }}>
//                                     <div style={{
//                                         textAlign: "center"
//                                     }}>
//                                         <p className="employeeDetailName3">Total Distance</p>
//                                         <p style={{
//                                             fontWeight: "600",
//                                             fontSize: "20px",
//                                             color: "#0E4772",
//                                             margin: "0"
//                                         }}>
//                                             {totalDistance?.toFixed(2)} KM
//                                         </p>
//                                     </div>
//                                     <div style={{
//                                         textAlign: "center"
//                                     }}>
//                                         <p className="employeeDetailName3">Timezone</p>
//                                         <p style={{
//                                             fontWeight: "600",
//                                             fontSize: "20px",
//                                             color: "#0E4772",
//                                             margin: "0"
//                                         }}>{data?.timezone}</p>
//                                     </div>
//                                     <div style={{
//                                         textAlign: "center"
//                                     }}>
//                                         <p className="employeeDetailName4">Daily Hours</p>
//                                         <p style={{
//                                             fontWeight: "600",
//                                             fontSize: "20px",
//                                             color: "#0E4772",
//                                             margin: "0"
//                                         }}>{data?.totalHours?.daily}</p>
//                                     </div>
//                                     <div style={{
//                                         textAlign: "center"
//                                     }}>
//                                         <p className="employeeDetailName5">Weekly Hours</p>
//                                         <p style={{
//                                             fontWeight: "600",
//                                             fontSize: "20px",
//                                             color: "#0E4772",
//                                             margin: "0"
//                                         }}>{data?.totalHours?.weekly}</p>
//                                     </div>
//                                     <div style={{
//                                         textAlign: "center"
//                                     }}>
//                                         <p className="employeeDetailName6">Monthly Hours</p>
//                                         <p style={{
//                                             fontWeight: "600",
//                                             fontSize: "20px",
//                                             color: "#0E4772",
//                                             margin: "0"
//                                         }}>{data?.totalHours?.monthly}</p>
//                                     </div>
//                                 </div>
//                                 <div class="wrapper" style={{ margin: "50px 0" }}>
//                                     <div class="timelineBox row">
//                                         {[0,1,2].map((groupedLocations, index) => {
//                                             return (
//                                                 <div class="timelineBody col-lg-4">
//                                                     <h2>{groupedLocations.time}</h2>
//                                                     {[0].map((location) => {
//                                                         return (
//                                                             <ul class="timeline">
//                                                                 <li>
//                                                                     <div class="timelineDot" style={{
//                                                                         fontSize: "62.5% !important"
//                                                                     }}></div>
//                                                                     <div class="timelineWork" style={{
//                                                                         fontSize: "62.5% !important"
//                                                                     }}>Distance<small>{location?.distance?.toFixed(2)} KM</small></div>
//                                                                 </li>
//                                                                 <li>
//                                                                     <div class="timelineDot" style={{
//                                                                         fontSize: "62.5% !important"
//                                                                     }}></div>
//                                                                     <div class="timelineWork" style={{
//                                                                         fontSize: "62.5% !important"
//                                                                     }}>Location<small>{location?.location}</small></div>
//                                                                 </li>
//                                                                 <li>
//                                                                     <div class="timelineDot" style={{
//                                                                         fontSize: "62.5% !important"
//                                                                     }}></div>
//                                                                     <div class="timelineWork" style={{
//                                                                         fontSize: "62.5% !important"
//                                                                     }}>Time<small>{location?.time}</small></div>
//                                                                 </li>
//                                                                 <li>
//                                                                     <div class="timelineDot" style={{
//                                                                         fontSize: "62.5% !important"
//                                                                     }}></div>
//                                                                     <div class="timelineWork" style={{
//                                                                         fontSize: "62.5% !important"
//                                                                     }}>Total Time<small>{location?.totalTime}</small></div>
//                                                                 </li>
//                                                             </ul>
//                                                         )
//                                                     })}
//                                                 </div>
//                                             )
//                                         })}
//                                     </div>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div >
//         </div >
//     )
// }

// export default OwnerUserTimeline;