// import React from "react";
// import circle from "../../images/circle.webp"
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { io } from 'socket.io-client'; // Correct import
// import { useSocket } from '../../io'; // Correct import


// function OwnerSection() {

//     let token = localStorage.getItem('token');
//     const items = JSON.parse(localStorage.getItem('items'));
//     const navigate = useNavigate()
//     const location = useLocation()


//     const user = JSON.parse(localStorage.getItem('items'));
//     const [showContent, setShowContent] = useState(false);
//     const [userType, setUserType] = useState(user?.userType);

//     const dispatch = useDispatch()
//     const socket = useSocket()


//     const apiUrl = "https://ss-track-xi.vercel.app/api/v1";

//     const logoutDivRef = useRef(null);

//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (logoutDivRef.current && !logoutDivRef.current.contains(event.target)) {
//                 setShowContent(false);
//             }
//         }
//         document.addEventListener("click", handleClickOutside);
//         return () => {
//             document.removeEventListener("click", handleClickOutside);
//         };
//     }, []);




//     useEffect(() => {
//         if (!socket) {
//             console.error('Socket instance is null or undefined');
//             return;
//         }

//         socket.on('connect', () => {
//             console.log('Socket connected:', socket.id);
//         });

//         const handleUpdateData = () => {
//             console.log('Received updateData event===========SOCKET');
//             updateData()
//         };

//         socket.on('role_update', handleUpdateData);

//         return () => {
//             socket.off('role_update', handleUpdateData);
//         };
//     }, [socket]);


//     async function updateData() {

//         try {
//             const response = await axios.patch(`${apiUrl}/signin/users/Update`, {
//                 // ...model
//             }, {
//                 headers: headers
//             })
//             if (response.data) {
//                 console.log('!!!!!!!!!!!!!!!!!!>', userType);
//                 // setLoading(false)
//                 setUserType(response.data.user.userType)
//                 localStorage.setItem("token", response.data.token);
//                 localStorage.setItem("items", JSON.stringify(response.data.user));

//             }
//         } catch (error) {
//             // setLoading(false)

//             console.log(error);
//         }
//     }

//     function logOut() {
//         localStorage.removeItem("items");
//         localStorage.removeItem("token");
//         dispatch(setLogout())
//         navigate("/")
//         setTimeout(() => {
//             window.location.reload()
//         }, 1000);
//         setShowContent(false)
//     }

//     function takeToDashboard() {
//         setShowContent(false)
//         navigate("/dashboard")
//     }

//     function takeToAdmin() {
//         setShowContent(false)
//         navigate("/account")
//     }

//     function takeToSettings() {
//         setShowContent(false)
//         navigate("/effective-settings")
//     }

//     const wordsAfterSpace = user?.name?.split(" ")[1] ? user?.name?.split(" ")[1].charAt(0).toUpperCase() : "";
//     const capitalizedWord = user?.name?.charAt(0).toUpperCase();


//     return (

//         <div className="cursor-pointer">
//             {user.userType === "user" ? (
//                 <>
//                     <div
//                         className="d-flex justify-content-between align-items-center"
//                         style={{
//                             backgroundColor: "white",
//                             padding: "10px 20px",
//                             borderBottomLeftRadius: "10px",
//                             borderBottomRightRadius: "10px",
//                             margin: "0 30px 0 30px",
//                         }}>
//                         <div className="d-flex gap-1 align-items-center">
//                             <div className={location.pathname === "/company-owner" || location.pathname === "/company-owner/company-individual-user" ? "active-tab" : "ownerSectionUser"}>
//                                 <p style={{ margin: 0 }} onClick={() => navigate('/company-owner')} >Dashboard</p>
//                             </div>
//                             {/* <div className={location.pathname === "/company-owner-user-signup" ? "active-tab" : "ownerSectionUser"}>
//                         <p style={{ margin: 0 }} onClick={() => navigate('/company-owner-user-signup')}>Add User</p>
//                     </div> */}
//                             <div className={location.pathname === "/owner-team" || location.pathname === "/owner-team/company-owner-user-signup" ? "active-tab" : "ownerSectionUser"}>
//                                 <p style={{ margin: 0 }} onClick={() => navigate('/owner-team')}>Team</p>
//                             </div>
//                             <div className={location.pathname === "/owner-reports" ? "active-tab" : "ownerSectionUser"}>
//                                 <p style={{ margin: 0 }} onClick={() => navigate('/owner-reports')}>Reports</p>
//                             </div>
//                             {/* <div className={location.pathname === "/owner-settings" ? "active-tab" : "ownerSectionUser"}>
//                         <p style={{ margin: 0 }} onClick={() => navigate('/owner-settings')}>Settings</p>
//                     </div> */}
//                         </div>
//                         <div>
//                             <div className="ownerSectionCompany d-flex align-items-center cursor-default">
//                                 <div><img src={circle} /></div>
//                                 <p className="m-0">{items?.company}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </>

//             ) : (
//                 <section>
//                     <>
//                         <nav className="navbar navbar-expand-lg navbar-dark" style={{
//                             backgroundColor: "#0d3756",
//                             padding: "20px 30px",
//                             borderTopLeftRadius: "10px",
//                             borderTopRightRadius: "10px",
//                             margin: "30px 30px 0 30px",
//                         }}>
//                             <div className="container-fluid" style={{ position: "relative" }}>
//                                 <div>
//                                     <img onClick={() => navigate('/')} className="logo" src={logo} />
//                                     {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//                                 <span className="navbar-toggler-icon"></span>
//                             </button> */}
//                                 </div>
//                                 <div ref={logoutDivRef}>
//                                     <div className="d-flex amButton" role="search">
//                                         <p>{user?.name.charAt(0).toUpperCase() + user?.name.slice(1)} ({userType})</p>
//                                         <button onClick={() => setShowContent(!showContent)} className="userName">
//                                             {capitalizedWord + wordsAfterSpace}
//                                         </button>
//                                         {/* <button onClick={() => updateData()} className="userName">
//                                     {capitalizedWord}
//                                 </button> */}
//                                     </div>
//                                     {showContent && <div className="logoutDiv">
//                                         <div onClick={takeToDashboard}>
//                                             <div>
//                                                 <img src={dashboard} />
//                                             </div>
//                                             <p>Dashboard</p>
//                                         </div>
//                                         <div onClick={takeToAdmin}>
//                                             <div>
//                                                 <img src={account} />
//                                             </div>
//                                             <p>My Account</p>
//                                         </div>
//                                         {user.userType === "user" ? null : (
//                                             <div onClick={takeToSettings}>
//                                                 <div>
//                                                     <img src={account} />
//                                                 </div>
//                                                 <p>Settings</p>
//                                             </div>
//                                         )}
//                                         <div onClick={logOut}>
//                                             <div>
//                                                 <img src={logout} />
//                                             </div>
//                                             <p>Logout</p>
//                                         </div>
//                                     </div>}
//                                 </div>
//                             </div>
//                         </nav>
//                         <UserDashboardSection />
//                         {/* <img className="line" src={line} /> */}
//                     </>

//                 </section>
//             )}
//         </div>


//     )
// }

// export default OwnerSection;