// import React, { useEffect, useState } from "react";
// import menu from "../../images/menu.webp";
// import loader from "../../images/Rectangle.webp";
// import check from "../../images/check.webp";
// import circle from "../../images/circle.webp";
// import online from "../../images/online.webp";
// import offline from "../../images/offline.webp";
// import { useNavigate } from "react-router-dom";

// function AdminHead() {

//     const [showContent, setShowContent] = useState(false)
//     const [filterData, setFilterData] = useState([]);
//     const [data, setData] = useState([]);
//     let token = localStorage.getItem('token');
//     const navigate = useNavigate('');
//     let headers = {
//         Authorization: 'Bearer ' + token,
//     }

//     const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

//     async function getData() {
//         try {
//             const response = await fetch(`${apiUrl}/superAdmin/employees`, { headers })
//             const json = await response.json();
//             setFilterData(json)
//             setData(json)
//         } catch (err) {
//             console.log(err);
//         }

//     }
//     useEffect(() => {
//         getData();
//     }, [])

//     function searchMe(value) {
//         const filteration = value ? filterData.filter(item => item.name.toLowerCase().includes(value.toLowerCase())) : data;
//         setFilterData([...filteration])
//     }

//     function sendData(users) {
//         navigate("/adminuser", {
//             state: users
//         })
//     }

//     return (
//         <section>
//             <div className="listDiv container">
//                 <div>
//                     <ul className="lists">
//                         <li onClick={() => navigate("/admindashboard")} >My Home</li>
//                         <li>
//                             <div className="btn-group ">
//                                 <button className="btn btn-secondary btn-lg dropdown-toggle activeClass " type="button" data-bs-toggle="dropdown" aria-expanded="false">
//                                     TimeLine
//                                 </button>
//                                 <ul className="dropdown-menu showDropdown">
//                                     <button><input onChange={(e) => searchMe(e.target.value)} className="timelineInput" placeholder="Search" /></button>
//                                     <li></li>
//                                     <li></li>
//                                     {filterData && filterData?.employees?.map((items, index) => {
//                                         return (
//                                             <li key={index}><p><img src={items.isActive ? online : offline} /></p><a onClick={() => sendData(items._id)} className="dropdown-item-list" href="#">{items?.name.charAt(0).toUpperCase() + items?.name.slice(1).toLowerCase()}</a></li>
//                                         )
//                                     })}
//                                 </ul>
//                             </div>
//                         </li>
//                         <li>
//                             <div className="btn-group">
//                                 <button className="btn btn-secondary btn-lg dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//                                     Reports
//                                 </button>
//                                 <ul className="dropdown-menu">
//                                     <li><a className="dropdown-item" href="#">Summary</a></li>
//                                     <li><a className="dropdown-item" href="#">Detailed</a></li>
//                                     <li><hr className="dropdown-divider" /></li>
//                                     <li><a className="dropdown-item" href="#">Weekly Report</a></li>
//                                     <li><a className="dropdown-item" href="#">Saved Report</a></li>
//                                 </ul>
//                             </div>

//                         </li>
//                         <li className="ms-2" onClick={() => navigate("/adminteam")}>Team</li>
//                         <li><img onClick={() => setShowContent(!showContent)} src={menu} /></li>
//                         {showContent && <div className="teamDiv">
//                             <div onClick={() => navigate('/adminProject')}><p>Project</p></div>
//                             <div onClick={() => navigate('/adminClient')}><p>Client</p></div>
//                             <div onClick={() => navigate('/setting')}><p>Setting</p></div>
//                             <div ><p>Download</p></div>
//                         </div>}
//                         <li><img src={loader} /></li>
//                     </ul>
//                 </div>
//                 <div>
//                     <ul>
//                         <div className="btn-group">
//                             <button className="btn  y8hr btn-secondary btn-lg dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//                                 <img src={circle} /> Y8HR
//                             </button>
//                             <ul className="dropdown-menu menuitem ">
//                                 <li><a className="dropdown-item" href="#">Summary</a></li>
//                                 <li><a className="dropdown-item" href="#">Detailed</a></li>
//                                 <li><hr className="dropdown-divider" /></li>
//                                 <li><a className="dropdown-item" href="#">Weekly Report</a></li>
//                                 <li><a className="dropdown-item" href="#">Saved Report</a></li>
//                             </ul>
//                         </div>
//                     </ul>
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default AdminHead;

import React from "react";
import circle from "../../images/circle.webp"
import { useLocation, useNavigate } from "react-router-dom";

function AdminHead() {

    let token = localStorage.getItem('token');
    const items = JSON.parse(localStorage.getItem('items'));
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <div className="cursor-pointer">
            <div
                className="d-flex justify-content-between align-items-center"
                style={{
                    backgroundColor: "white",
                    padding: "10px 20px",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                    margin: "0 30px 0 30px",
                }}>
                <div className="d-flex gap-1 align-items-center">
                    <div className={location.pathname === "/dashboard" || location.pathname === "/admindashboard/adminuser" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/dashboard')} >Dashboard</p>
                    </div>
                    {/* <div className={location.pathname === "/company-owner-user-signup" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/company-owner-user-signup')}>Add User</p>
                    </div> */}
                    <div className={location.pathname === "/adminteam" || location.pathname === "/admindashboard/admin-user-signup" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/adminteam')}>Team</p>
                    </div>
                    <div className={location.pathname === "/admin-reports" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/admin-reports')}>Reports</p>
                    </div>
                    {/* <div className={location.pathname === "/setting" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/setting')}>Settings</p>
                    </div>
                    <div className={location.pathname === "/adminProject" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/adminProject')}>Project</p>
                    </div>
                    <div className={location.pathname === "/admin-reports" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/admin-reports')}>Reports</p>
                    </div> */}
                </div>
                <div>
                    <div className="ownerSectionCompany d-flex align-items-center cursor-default">
                        <div><img src={circle} /></div>
                        <p className="m-0">{items?.company}</p>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default AdminHead;