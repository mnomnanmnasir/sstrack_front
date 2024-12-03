import React, { useEffect, useRef, useState } from "react";
import menu from "../../images/menu.webp";
import loader from "../../images/Rectangle.webp";
import check from "../../images/check.webp";
import circle from "../../images/circle.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from '../../images/ss-track-logo.svg';
import { useDispatch } from "react-redux";
import { useSocket } from '../../io'; // Correct import


function UserDashboardSection(params) {

    // const navigate = useNavigate();
    const location = useLocation();
    const items = JSON.parse(localStorage.getItem('items'));

    const user = JSON.parse(localStorage.getItem('items'));
    const [showContent, setShowContent] = useState(false);
    const [userType, setUserType] = useState(user?.userType);
    const navigate = useNavigate("");
    const dispatch = useDispatch()
    const socket = useSocket()
    let token = localStorage.getItem('token');
    let headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
    }
    console.log(items);

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
    const wordsAfterSpace = user?.name?.split(" ")[1] ? user?.name?.split(" ")[1].charAt(0).toUpperCase() : "";
    const capitalizedWord = user?.name?.charAt(0).toUpperCase();

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
          window.scrollTo({
            top: section.offsetTop,
            behavior: 'smooth',
          });
        }
      };

    return (

        // <div className="cursor-pointer">
        //     <div className="mt-3 d-flex justify-content-between align-items-center" style={{
        //         backgroundColor: "white",
        //         // padding: "10px",
        //         borderTopLeftRadius: "10px",
        //         borderTopRightRadius: "10px",
        //         margin: "0px 30px 0px 30px",
        //     }}>
        //         <div className="d-flex gap-1 align-items-center">

        //         </div>

        //         <div>

        //             <div>

        //                 <div className="ownerSectionUser d-flex align-items-center gap-4 justify-content-end fw-500 flex-end text-end cursor-none">
        //                     {/* <div><img src={circle} /></div> */}
        // <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer', fontWeight: '500' }} onClick={() => navigate("/download")}>Download</p>
        // <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer', fontWeight: '500' }} onClick={() => navigate("/pricing")}>Pricing</p>
        // <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer', fontWeight: '500' }} onClick={() => navigate("/workCards")}>How It Work</p>
        //                 </div>
        //             </div>

        //         </div>
        //         {/* <div>
        //             <div className="ownerSectionCompany d-flex align-items-center cursor-none">
        //                 <div><img src={circle} /></div>
        //                 <p className="m-0">{items?.company}</p>
        //             </div>
        //         </div> */}
        //     </div>
        // </div>
        // <div className="cursor-pointer mt-3">
        //     <div className="d-flex justify-content-between align-items-center" style={{
        //         backgroundColor: "white",
        //         padding: "10px 20px",
        //         borderTopLeftRadius: "10px",
        //         borderTopRightRadius: "10px",
        //         margin: "0 30px 0 30px",
        //     }}>
        //         <div className="d-flex gap-1 align-items-center">

        //         </div>
        //         <div>
        //             <div className="ownerSectionCompany1 d-flex align-items-center cursor-none">
        //                 {/* <div><img src={circle} /></div> */}
        //                 <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer', fontWeight: '500' }} onClick={() => navigate("/download")}>Download</p>
        //                 <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer', fontWeight: '500' }} onClick={() => navigate("/pricing")}>Pricing</p>
        //                 <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer', fontWeight: '500' }} onClick={() => navigate("/workCards")}>How It Work</p>
        //             </div>
        //         </div>
        //     </div>
        // </div>




        // <div className="cursor-pointer mt-4">
        // <div className="d-flex justify-content-space-betweem align-items-center" style={{
        //     backgroundColor: "#0d3756",
        //     padding: "10px 5px",
        //     borderTopLeftRadius: "10px",
        //     borderTopRightRadius: "10px",
        //     margin: "10px 30px 0 30px",
        // }}>

        //             <div>
        //                 <img onClick={() => navigate('/')} className="logo" src={logo} />
        //             </div>
        //             <div className="d-flex align-items-center text-end justify-content-end" style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer', fontWeight: '500' }}>
        // <div className="ownerSectionUser" onClick={() => {
        //     navigate('/')
        // }} >
        //     <p style={{ margin: 0 }} onClick={() => {
        //         navigate('/')

        //     }}>Home</p>
        // </div>
        // <div className="" onClick={() => {
        //     navigate('/download')
        // }} >
        //     <p className="ownerSectionUser" style={{ margin: 0 }} onClick={() => {
        //         navigate('/download')
        //     }}>Download</p>
        // </div>
        // <div className="ownerSectionUser" style={{ whiteSpace: 'nowrap' }} onClick={() => {
        //     navigate('/workCards')
        // }} >
        //     <p style={{ margin: 0 }} onClick={() => {
        //         navigate('/workCards')
        //     }}>How It Work</p>
        // </div>
        // <div className="ownerSectionUser" onClick={() => {
        //     navigate('/pricing')
        // }} >
        //     <p style={{ margin: 0 }} onClick={() => {
        //         navigate('/pricing')
        //     }}>Pricing</p>
        // </div>
        //                 {/* {items?.userType === "user" && <div className={location.pathname.includes("/timeline") ? "active-tab" : "ownerSectionUser"} onClick={() => navigate(`/timeline/${items?._id}`)}>
        //                 <p style={{ margin: 0 }} onClick={() => navigate(`/timeline/${items?._id}`)}>My timeline</p>
        //             </div>} */}
        //                 {/* {(items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager") && (
        //                 <>
        //                     <div className={location.pathname === "/team" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/team')}>
        //                         <p style={{ margin: 0 }} onClick={() => navigate('/team')}>Team</p>
        //                     </div>
        //                 </>
        //             )} */}

        //                 {/* <div className={location.pathname === "/download" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/download')}>
        //             <p style={{ margin: 0 }} onClick={() => navigate('/download')}>Download</p>
        //         </div>
        //         <div className={location.pathname === "/workCards" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/workCards')}>
        //             <p className="d-flex" style={{ margin: 0 , whiteSpace: 'nowrap'}} onClick={() => navigate('/workCards')}>How It Work</p>
        //         </div>
        //         <div className={location.pathname === "/pricing" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/pricing')}>
        //             <p style={{ margin: 0 }} onClick={() => navigate('/pricing')}>Pricing</p>
        //         </div> */}
        //                 <div className="d-flex container">
        //                     {/* <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/download")}>Download</p>
        //             <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/pricing")}>Pricing</p>
        //             <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/workCards")}>How It Work</p> */}
        //                 </div>
        //             </div>

        //         {/* <div>
        //         <div className="ownerSectionCompany d-flex align-items-center cursor-none">
        //             <div><img src={circle} /></div>
        //             <p className="m-0">{items?.company}</p>
        //         </div>
        //     </div> */}
        //     </div>
        // </div>
        <div className="cursor-pointer mt-3">
            {/* <Header /> */}
            <>
                {/* <HeaderOption /> */}
                <nav className="navbar navbar-expand-lg navbar-dark" style={{
                    backgroundColor: "#0d3756",
                    padding: "10px 0px",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    margin: "0px 30px 0 30px",
                }}>
                    {/* <HeaderOption /> */}
                    <div className="container-fluid" style={{ position: "relative" }}>
                        <div>
                            {/* <img onClick={() => navigate('/')} className="logo" src={logo} /> */}
                            {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button> */}
                        </div>
                        <div>
                            <div className="d-flex amButton justify-content-end" role="search">
                                <div className="ownerSectionUser1 text-white" onClick={() => {
                                    navigate('/')
                                }} >
                                    <p style={{ margin: 0 }} onClick={() => {
                                        navigate('/')

                                    }}>Home</p>
                                </div>
                                <div className="ownerSectionUser1 text-white" onClick={() => {
                                    navigate('/download')
                                }} >
                                    <p className="ownerSectionUser1 text-white" style={{ margin: 0 }} onClick={() => {
                                        navigate('/download')
                                    }}>Download</p>
                                </div>
                                <div className="ownerSectionUser1 text-white" style={{ whiteSpace: 'nowrap' }} onClick={() => {
                                    navigate('/workCards')
                                }} >
                                    <p style={{ margin: 0 }} onClick={() => location.pathname === "/" ? scrollToSection('section4') : navigate("/")}>How It Work</p>
                                </div>
                                <div className="ownerSectionUser1 text-white" onClick={() => {
                                    navigate('/pricing')
                                }} >
                                    <p style={{ margin: 0 }} onClick={() => location.pathname === "/" ? scrollToSection('section3') : navigate("/")}>Pricing</p>
                                </div>
                                {/* <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/download")}>Download</p>
                                            <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/pricing")}>Pricing</p>
                                            <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/workCards")}>How It Work</p> */}
                                {/* <p>{user?.name.charAt(0).toUpperCase() + user?.name.slice(1)} ({userType})</p> */}
                                {/* <button onClick={() => setShowContent(!showContent)} className="userName"> */}
                                {/* {capitalizedWord + wordsAfterSpace}
                                        </button> */}
                                {/* <button onClick={() => updateData()} className="userName">
                                    {capitalizedWord}
                                </button> */}
                            </div>

                        </div>
                    </div>

                {/* <div className="container-fluid d-flex align-items-center justify-content-end">
                    <p>{user?.name.charAt(0).toUpperCase() + user?.name.slice(1)} ({userType})</p>
                    <button onClick={() => setShowContent(!showContent)} className="userName">
                        {capitalizedWord + wordsAfterSpace}
                    </button>
                </div> */}
                </nav>
                {/* <UserDashboardSection /> */}
                {/* <img className="line" src={line} /> */}
            </>

        </div>
        //         <div className="cursor-pointer">
        //             <div className="d-flex justify-content-center align-items-center" style={{
        //                 backgroundColor: "#0d3756",
        //                 padding: "10px 5px",
        //                 borderTopLeftRadius: "10px",
        //                 borderTopRightRadius: "10px",
        //                 margin: "10px 30px 0 30px",
        //             }}>
        //                 <div className="container-fluid" style={{ position: "relative" }}>
        //                     <div>
        //                         <img onClick={() => navigate('/')} className="logo" src={logo} />
        //                         {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        //     <span className="navbar-toggler-icon"></span>
        // </button> */}
        //                     </div>
        //                     {/* <div className="container-fluid justify-content-end"> */}
        //                         <div className="d-flex justify-content-end" role="search">
        //                             <div className="ownerSectionUser" onClick={() => {
        //                                 navigate('/')
        //                             }} >
        //                                 <p style={{ margin: 0 }} onClick={() => {
        //                                     navigate('/')

        //                                 }}>Home</p>
        //                             </div>
        //                             <div className="" onClick={() => {
        //                                 navigate('/download')
        //                             }} >
        //                                 <p className="ownerSectionUser" style={{ margin: 0 }} onClick={() => {
        //                                     navigate('/download')
        //                                 }}>Download</p>
        //                             </div>
        //                             <div className="ownerSectionUser" style={{ whiteSpace: 'nowrap' }} onClick={() => {
        //                                 navigate('/workCards')
        //                             }} >
        //                                 <p style={{ margin: 0 }} onClick={() => {
        //                                     navigate('/workCards')
        //                                 }}>How It Work</p>
        //                             </div>
        //                             <div className="ownerSectionUser" onClick={() => {
        //                                 navigate('/pricing')
        //                             }} >
        //                                 <p style={{ margin: 0 }} onClick={() => {
        //                                     navigate('/pricing')
        //                                 }}>Pricing</p>
        //                             </div>
        //                             {/* <h1>
        //                 Hello
        //             </h1> */}
        //                             {/* <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/download")}>Download</p>
        //                 <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/pricing")}>Pricing</p> */}

        //                             {/* <button onClick={() => updateData()} className="userName">
        //         {capitalizedWord}
        //     </button> */}
        //                         </div>
        //                     {/* </div> */}

        //                     {/* {showContent && <div className="logoutDiv">
        //                 <div onClick={takeToDashboard}>
        //                     <div>
        //                         <img src={dashboard} />
        //                     </div>
        //                     <p>Dashboard</p>
        //                 </div>
        //                 <div onClick={takeToAdmin}>
        //                     <div>
        //                         <img src={account} />
        //                     </div>
        //                     <p>My Account</p>
        //                 </div>
        //                 {user?.userType === "user" ? null : (
        //                     <div onClick={takeToSettings}>
        //                         <div>
        //                             <img src={account} />
        //                         </div>
        //                         <p>Settings</p>
        //                     </div>
        //                 )}
        //                 <div onClick={logOut}>
        //                     <div>
        //                         <img src={logout} />
        //                     </div>
        //                     <p>Logout</p>
        //                 </div>
        //             </div>} */}

        //                 </div>
        //             </div>
        //         </div>


    )
}

export default UserDashboardSection;