
// import React, { useEffect, useState } from "react";
// import line from "../images/line.webp";
// import check from "../images/online.webp";
// import screenshot from "../images/white.svg";
// import setting from "../images/setting.webp";
// import { Link, useNavigate } from "react-router-dom";
// import Skeleton from "react-loading-skeleton";
// import 'react-loading-skeleton/dist/skeleton.css'
// import useLoading from "../hooks/useLoading";
// import axios from "axios";
// import offline from "../images/not-active.svg";
// import Pusher from 'pusher-js';
// import moment from 'moment-timezone';

// function ManagerDashboard() {

//     const [lastScreenshot, setLastScreenshot] = useState(null)
//     const [activeUser, setActiveUser] = useState(null)
//     const { loading, setLoading } = useLoading()
//     const [data, setData] = useState([]);
//     const navigate = useNavigate();
//     let token = localStorage.getItem('token');
//     let headers = {
//         Authorization: 'Bearer ' + token,
//     }
//     const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

//     async function getData() {
//         setLoading(true)
//         try {
//             const response = await axios.get(`${apiUrl}/manager/dashboard`, {
//                 headers,
//             })
//             if (response.status) {
//                 setTimeout(() => {
//                     setLoading(false)
//                 }, 1000);
//                 const onlineUsers = response.data?.onlineUsers?.length > 0 ? response.data?.onlineUsers : []
//                 const offlineUsers = response.data?.offlineUsers?.length > 0 ? response.data?.offlineUsers : []
//                 const allUsers = [...onlineUsers, ...offlineUsers];
//                 setData(allUsers)
//                 console.log(response);
//             }
//         }
//         catch (error) {
//             setTimeout(() => {
//                 setLoading(false)
//             }, 1000);
//             console.log(error);
//         }
//     }

//     useEffect(() => {
//         getData();
//     }, [])

//     console.log(data);

//     // var pusher = new Pusher('334425b3c859ed2f1d2b', {
//     //     cluster: 'ap2'
//     // });

//     // var channel = pusher.subscribe('ss-track');

//     // channel.bind('my-user', (data) => {
//     //     setActiveUser(data?.data)
//     //     console.log("active user ===>", data.data);
//     // });

//     // useEffect(() => {
//     //     var channel = pusher.subscribe('ss-track');
//     //     channel.bind("new-ss", (data) => {
//     //         setLastScreenshot(data?.data)
//     //         console.log("new ss ===>", data);
//     //     });
//     //     return () => {
//     //         channel.unbind("new-ss");
//     //     };
//     // }, [])

//     // channel.bind('my-event', (data) => {
//     //     console.log(JSON.stringify(data));
//     // });

//     const items = JSON.parse(localStorage.getItem('items'));

//     const offsetInMinutes = moment.tz(items?.timezone).utcOffset();
//     const offsetInHours = offsetInMinutes / 60;
//     const offsetSign = offsetInHours >= 0 ? '+' : '-';
//     const formattedOffset = `${offsetSign}${Math.abs(offsetInHours)}`;

//     function moveOnlineUsers(userId) {
//         navigate("/manager-dashboard/manager-user", {
//             state: userId,
//         });
//     }

//     return (
//         <div>
//             <div className="container">
//                 <div className="userHeader">
//                     <div>
//                         <h5>Manager Dashboard</h5>
//                     </div>
//                     <div className="headerTop">
//                         <h6>All times are UTC {formattedOffset}</h6>
//                         <img src={setting} alt="setting.png" style={{ cursor: "pointer" }} onClick={() => navigate("/account")} />
//                     </div>
//                 </div>
//                 <div className="mainwrapper">
//                     <div className="userDashboardContainer">
//                         <div className="dashheadings">
//                             <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop">Employee</p>
//                             <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">Last active</p>
//                             <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">Today</p>
//                             <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">Yesterday</p>
//                             <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">This week</p>
//                             <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">This Month</p>
//                         </div>
//                         {loading || data.length === 0 ? (
//                             <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
//                         ) : (
//                             data?.map((user, index) => {
//                                 return (
//                                     <div className="dashsheadings" key={user.userId} onClick={() => moveOnlineUsers(user.userId)}>
//                                         <div className="companyNameverified">
//                                             <img src={user?.userId === activeUser?._id && activeUser?.isActive === true ? check : user?.isActive === true ? check : offline} alt="Verified" />
//                                             <h5 className="dashCompanyName">{user?.userName}</h5>
//                                         </div>
//                                         <div className="companyNameverified lastActive" style={{ width: "100%" }}>
//                                             <img
//                                                 onClick={() => moveOnlineUsers(user.userId)}
//                                                 className="screenShotPreview"
//                                                 src={lastScreenshot?.user_id === user?.userId ? lastScreenshot?.key : user?.recentScreenshot ? user?.recentScreenshot?.key : screenshot}
//                                                 alt="Screenshot"
//                                             />
//                                             <p className="dashheadingtop">
//                                                 ({user?.minutesAgo === "0 minutes ago" ? "a minute ago" : user?.minutesAgo})
//                                             </p>
//                                         </div>
//                                         <div className="nameVerified">
//                                             <p className="dashheadingtop textalign">{user?.totalHours?.daily}</p>
//                                             <p className="screenShotAmount" style={{ color: user.isActive === true && "#28659C" }}>${user?.billingAmounts?.daily}</p>
//                                         </div>
//                                         <div className="nameVerified">
//                                             <p className="dashheadingtop textalign">{user?.totalHours?.yesterday}</p>
//                                             <p className="screenShotAmount" style={{ color: user.isActive === true && "#28659C" }}>${user?.billingAmounts?.yesterday}</p>
//                                         </div>
//                                         <div className="nameVerified">
//                                             <p className="dashheadingtop textalign">{user?.totalHours?.weekly}</p>
//                                             <p className="screenShotAmount" style={{ color: user.isActive === true && "#28659C" }}>${user?.billingAmounts?.weekly}</p>
//                                         </div>
//                                         <div className="nameVerified">
//                                             <p className="dashheadingtop textalign">{user?.totalHours?.monthly}</p>
//                                             <p className="screenShotAmount" style={{ color: user.isActive === true && "#28659C" }}>${user?.billingAmounts?.monthly}</p>
//                                         </div>
//                                     </div>
//                                 )
//                             })
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <img className="userDasboardLine" src={line} />
//         </div>
//     )
// }

// export default ManagerDashboard;