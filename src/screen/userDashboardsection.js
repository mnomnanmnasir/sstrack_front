// import React from "react";
// import menu from "../../images/menu.webp";
// import loader from "../../images/Rectangle.webp";
// import check from "../../images/check.webp";
// import circle from "../../images/circle.webp";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// function UserDashboardSection() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const items = JSON.parse(localStorage.getItem('items'));
//     return (
//         <div>
//             <section>
//                 <div className="listDiv container">
//                     <div>
//                         <ul className="lists">
//                             <li className={location.pathname === "/userdashboard" ? "active-tab-2" : "user-active-tabs"} onClick={() => navigate('/userdashboard')}>Dashboard</li>
//                             <li className={location.pathname === "/userdetail" ? "active-tab-2" : "user-active-tabs"} onClick={() => navigate('/userdetail')}><img src={check} /><span>{items?.name.charAt(0).toUpperCase() + items?.name.slice(1)}</span></li>
//                             <li className={location.pathname === "/usersummary" ? "active-tab-2" : "user-active-tabs"} onClick={() => navigate('/usersummary')}>Reports</li>
//                             {/* <li style={{backgroundColor:"#00000"}}>
//                     <select className="dropdown">
//                         <option style={{backgroundColor:"#00000"}}>Reports</option>
//                         <option style={{backgroundColor:"#00000"}}>Summary</option>
//                         <option style={{backgroundColor:"#00000"}}>Detailed</option>
//                         <option style={{backgroundColor:"#00000"}}>Weekly Report</option>
//                         <option style={{backgroundColor:"#00000"}}> Saved Report</option>
//                     </select>
//                 </li> */}
//                             {/* <li><img src={menu} /></li>
//                             <li><img src={loader} /></li> */}
//                         </ul>
//                     </div>
//                     <div>

//                         <ul>
//                             <div className="btn-group">
//                                 <button className="btn  y8hr btn-secondary  btn-lg " type="button" aria-expanded="false">
//                                     <img src={circle} /> {items?.company}
//                                 </button>
//                                 {/* <ul className="dropdown-menu menuitem ">

//                                     <li>
//                                         <Link to="/summary" onClick={() => navigate("/summary")}>
//                                             Summary
//                                         </Link>
//                                     </li>
//                                     <li><a className="dropdown-item" href="#">Detailed</a></li>
//                                     <li><hr className="dropdown-divider" /></li>
//                                     <li><a className="dropdown-item" href="#">Weekly Report</a></li>
//                                     <li><a className="dropdown-item" href="#">Saved Report</a></li>

//                                 </ul> */}
//                             </div>
//                         </ul>


//                     </div>
//                 </div>
//             </section>
//         </div>
//     )
// }

// export default UserDashboardSection;

import React from "react";
import menu from "../../images/menu.webp";
import loader from "../../images/Rectangle.webp";
import check from "../../images/check.webp";
import circle from "../../images/circle.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";

function UserDashboardSection(params) {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const location = useLocation();
    // const items = JSON.parse(localStorage.getItem('items'));

    // console.log(items);

    // return (
    //     <div className="cursor-pointer">
    //         <div className="d-flex justify-content-between align-items-center" style={{
    //             backgroundColor: "white",
    //             padding: "10px 20px",
    //             borderBottomLeftRadius: "10px",
    //             borderBottomRightRadius: "10px",
    //             margin: "0 30px 0 30px",
    //         }}>
    //             <div className="d-flex gap-1 align-items-center">
    //                 <div className={location.pathname === "/dashboard" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate(`/timeline/${items?._id}`)}>
    //                     <p style={{ margin: 0 }} onClick={() => {
    //                         navigate('/dashboard')
    //                     }}>Dashboard</p>
    //                 </div>
    //                 {items?.userType === "user" && <div className={location.pathname.includes("/timeline") ? "active-tab" : "ownerSectionUser"} onClick={() => navigate(`/timeline/${items?._id}`)}>
                       
    //                     <p style={{ margin: 0 }} onClick={() => navigate(`/timeline/${items?._id}`)}>My timeline</p>
    //                 </div>}
    //                 {(items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager") && (
    //                     <>
    //                         <div className={location.pathname === "/team" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/team')}>
    //                             <p style={{ margin: 0 }} onClick={() => navigate('/team')}>Team</p>
    //                         </div>
    //                     </>
    //                 )}
    //                 <div className={location.pathname === "/reports" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/reports')}>
    //                     <p style={{ margin: 0 }} onClick={() => navigate('/reports')}>Reports</p>
    //                 </div>
    //             </div>
    //             <div>
    //                 <div className="ownerSectionCompany d-flex align-items-center cursor-none">
    //                     <div><img src={circle} /></div>
    //                     <p className="m-0">{items?.company}</p>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )
    return (
        <div className="cursor-pointer">
            <div className="d-flex justify-content-between align-items-center" style={{
                backgroundColor: "white",
                padding: "10px 20px",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                margin: "0 30px 0 30px",
            }}>
                <div className="d-flex gap-1 align-items-center">
                    <div className={location.pathname === "/dashboard" ? "active-tab" : "ownerSectionUser"} onClick={() => {
                        navigate('/dashboard')
                    }} >
                        <p style={{ margin: 0 }} onClick={() => {
                            navigate('/dashboard')
                        }}>Dashboard</p>
                    </div>
                    {items?.userType === "user" && <div className={location.pathname.includes("/timeline") ? "active-tab" : "ownerSectionUser"} onClick={() => navigate(`/timeline/${items?._id}`)}>
                        <p style={{ margin: 0 }} onClick={() => navigate(`/timeline/${items?._id}`)}>My timeline</p>
                    </div>}
                    {(items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager") && (
                        <>
                            <div className={location.pathname === "/team" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/team')}>
                                <p style={{ margin: 0 }} onClick={() => navigate('/team')}>Team</p>
                            </div>
                        </>
                    )}
                    <div className={location.pathname === "/reports" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/reports')}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/reports')}>Reports</p>
                    </div>
                    <div className={location.pathname === "/Projects" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/Projects')}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/Projects')}>Projects</p>
                    </div>
                </div>
                <div>
                    <div className="ownerSectionCompany d-flex align-items-center cursor-none">
                        <div><img src={circle} /></div>
                        <p className="m-0">{items?.company}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDashboardSection;