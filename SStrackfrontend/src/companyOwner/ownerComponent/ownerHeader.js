
// import React, { useState } from "react";
// import logo from '../../images/popHeadLogo.png';
// import line from '../../images/line.webp';
// import dashboard from "../../images/dashboard.webp";
// import account from "../../images/myaccount.webp";
// import logout from "../../images/logout.webp";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setLogout } from "../../store/timelineSlice";


// function OwnerHeader() {

//     const items = JSON.parse(localStorage.getItem('items'));
//     const [showContent, setShowContent] = useState(false);
//     const dispatch = useDispatch()

//     const navigate = useNavigate("");

//     function logOut() {
//         localStorage.removeItem("items");
//         localStorage.removeItem("token");
//         dispatch(setLogout())
//         navigate("/signin")
//     }

//     // console.log(items);

//     function takeToDashboard() {
//         if (items?.userType === "admin" || items?.userType === "manager") {
//             navigate("/admindashboard")
//         }
//         else if (items?.userType === "user") {
//             navigate("/userdashboard");
//         }
//         else if (items?.userType === "owner") {
//             navigate("/company-owner");
//         }
//     }

//     function takeToAdmin() {
//         if (items?.userType === "admin" || items?.userType === "manager") {
//             navigate("/adminaccount")
//         }
//         else if (items?.userType === "user") {
//             navigate("/account");
//         }
//         else if (items?.userType === "owner") {
//             navigate('/owner-account')
//         }
//     }


//     useEffect(() => {
//         if (socket) {
//             socket.on('role_update', (data) => {
//                 if (data.user_id === items._id) {
//                     console.log('Role update received:', data);
//                     updateRole(data.new_role);
//                 }
//             });
//         }

//         // Don't forget to clean up when the component unmounts
//         return () => {
//             if (socket) {
//                 socket.off('role_update');
//             }
//         };
//     }, [socket, items]);

//     const updateRole = (newRole) => {
//         localStorage.setItem('items', JSON.stringify({ ...items, userType: newRole }));
//         items.userType = newRole;
//     };



//     return (
//         <section>
//             <nav className="container navbar navbar-expand-lg navbar-dark">
//                 <div className="container-fluid">
//                     <div><a className="navbar-brand" href="#"><img className="logo" src={logo} /></a>
//                         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//                             <span className="navbar-toggler-icon"></span>
//                         </button></div>
//                     {/* <div className="collapse navbar-collapse" id="navbarSupportedContent">
//                     <ul className="navbar-nav me-auto ms-auto mb-2 mb-lg-0">
//                         <li className="nav-item">
//                             <a className="nav-link active" aria-current="page" href="#">Demo</a>
//                         </li>
//                         <li className="nav-item">
//                             <a className="nav-link active" aria-current="page" href="#">Pricing</a>
//                         </li>
//                         <li className="nav-item">
//                             <a className="nav-link active" aria-current="page" href="#">Download</a>
//                         </li>

//                     </ul>
                   
//                 </div> */}
//                     <div className="d-flex amButton" role="s    earch">
//                         <p>{items?.name.charAt(0).toUpperCase() + items?.name.slice(1)} ({items?.userType})</p>
//                         <button onClick={() => setShowContent(!showContent)} className="userName">{items?.name.charAt(0).toUpperCase()}</button>
//                     </div>
//                     {showContent && <div className="logoutDiv">
//                         <div onClick={takeToDashboard}><div><img src={dashboard} /></div><p>Dashboard</p></div>
//                         <div onClick={takeToAdmin}><div><img src={account} /></div><p>My Account</p></div>
//                         <div onClick={logOut}><div><img src={logout} /></div><p>Logout</p></div>
//                     </div>}
//                 </div>
//             </nav>
//             <img className="line" src={line} />
//         </section>
//     )
// }

// export default OwnerHeader;