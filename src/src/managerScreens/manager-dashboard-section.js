// import React from "react";
// import menu from "../images/menu.webp";
// import loader from "../images/Rectangle.webp";
// import check from "../images/check.webp";
// import circle from "../images/circle.webp";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// function ManagerDashboardSection(params) {

//     const navigate = useNavigate();
//     const location = useLocation();
//     const items = JSON.parse(localStorage.getItem('items'));

//     return (
//         <div className="cursor-pointer">
//             <div className="d-flex justify-content-between align-items-center" style={{
//                 backgroundColor: "white",
//                 padding: "10px 20px",
//                 borderBottomLeftRadius: "10px",
//                 borderBottomRightRadius: "10px",
//                 margin: "0 30px 0 30px",
//             }}>
//                 <div className="d-flex gap-1 align-items-center">
//                     <div className={location.pathname === "/manager-dashboard" ? "active-tab" : "ownerSectionUser"}>
//                         <p style={{ margin: 0 }} onClick={() => navigate('/manager-dashboard')} >Dashboard</p>
//                     </div>
//                     <div className={location.pathname === "/manager-team" ? "active-tab" : "ownerSectionUser"}>
//                         <p style={{ margin: 0 }} onClick={() => navigate('/manager-team')}>Team</p>
//                     </div>
//                 </div>
//                 <div>
//                     <div className="ownerSectionCompany d-flex align-items-center cursor-default">
//                         <div><img src={circle} /></div>
//                         <p className="m-0">{items?.company}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ManagerDashboardSection;