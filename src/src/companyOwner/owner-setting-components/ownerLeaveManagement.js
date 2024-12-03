
// import React, { useEffect, useState } from "react";
// // import UserHeader from "../screen/component/userHeader";
// // import OwnerSection from "./ownerComponent/ownerSection";
// // import groupCompany from "../images/Group.webp";
// import groupCompany from '../../images/Group.webp'
// import search from "../../images/searchIcon.webp";
// // import line from "../images/Line 3.webp";
import line from '../../images/Line 3.webp'
// // import OwnerTeamComponent from "./ownerTeamComponent";
// import axios from "axios";
// import { enqueueSnackbar, SnackbarProvider } from 'notistack'
// // import Footer from "../screen/component/footer";
// import Footer from '../../screen/component/footer'
// import Skeleton from "react-loading-skeleton";
// import 'react-loading-skeleton/dist/skeleton.css'
// import useLoading from "../../hooks/useLoading";
// import { useNavigate } from "react-router-dom";
// // import Swal from 'sweetalert2/dist/sweetalert2.js'
// // import '../../node_modules/sweetalert2/src/sweetalert2.scss'
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import { AiOutlineUser, AiFillCrown, AiFillStar } from 'react-icons/ai'
// import archiveIcon from "../../images/Archive.webp";
// import inviteIcon from "../../images/invitation.svg";
// import { useQuery } from 'react-query';
// import { CircleSpinnerOverlay, FerrisWheelSpinner } from 'react-spinner-overlay'
// // import { setLogout } from "../store/timelineSlice";
// import { setLogout } from "../../store/timelineSlice";

// import { useDispatch } from "react-redux";
// import OwnerLeave from './ownerLeave'
// import { useSocket } from '../../io'; // Correct import

// const apiUrl = "https://ss-track-xi.vercel.app/api/v1";


// function OwnerTeam() {

//     const [requestedLeaves, setRequestedLeaves] = useState([]); // State for leave data

//     const [isTypingEmail, setIsTypingEmail] = useState(false);
//     const [isValidEmail, setIsValidEmail] = useState(false);
//     const [show, setShow] = useState(false);
//     const [show2, setShow2] = useState(false);
//     const [show3, setShow3] = useState(false);
//     const [email, setEmail] = useState("")
//     const [deleteType, setDeleteType] = useState("");
//     const [selectedUser, setSelectedUser] = useState(null);
//     const navigate = useNavigate()
//     const { loading, setLoading, loading2, setLoading2 } = useLoading()
//     const [payrate, setPayrate] = useState(null)
//     const [inviteStatus, setInviteStatus] = useState("")
//     const [isUserArchive, setIsUserArchive] = useState(false)
//     const [isArchived, setIsArchived] = useState(true)
//     const [activeId, setActiveId] = useState(null)
//     const socket = useSocket()
//     const [mainId, setMainId] = useState(null)
//     const [loadingInvite, setLoadingInvite] = useState(false);
//     const [users, setUsers] = useState(null);
//     const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
//     const token = localStorage.getItem('token');
//     const headers = {
//         Authorization: "Bearer " + token,
//     };
//     const user = JSON.parse(localStorage.getItem("items"))

//     const fetchOwnerCompanies = async () => {
//         const response = await axios.get(`${apiUrl}/superAdmin/getAllLeaveRequests`, { headers });

//         console.log("Leave Request User Names:", response.data.requestedLeaves.map((leave) => leave.userName));

//         return response.data;  // React Query will handle the response status internall
//     }
//     const dispatch = useDispatch();

//     function getAssignedUsersCount(users, assignedUsers, currentUserId) {
//         const assignedUsersList = users?.filter((u) => assignedUsers.includes(u._id) && u._id !== currentUserId);
//         return assignedUsersList.length;
//         // return assignedUsersList.length > 0 ? assignedUsersList.length - 1 : 0;
//     }

//     function logOut() {
//         localStorage.clear();
//         localStorage.removeItem("cachedData");
//         dispatch(setLogout());
//         navigate('/');
//         window.location.reload();

//         // Broadcast the logout event to other windows or tabs
//         localStorage.setItem('logout', 'true');
//         window.dispatchEvent(new Event('storage'));
//     }
//     useEffect(() => {
//         window.addEventListener('storage', () => {
//             if (localStorage.getItem('logOut') === 'true') {
//                 logOut();
//             }
//         });
//     }, []);
//     useEffect(() => {
//         if (socket) {
//             console.log('Socket connection established:', socket.connected);
//             socket.on('user_archive', (userId) => {
//                 console.log(`Received user archived update event: ${userId}`);
//                 // Update the archive icon in real-time
//                 const user = users.find((user) => user._id === userId);
//                 if (user) {
//                     user.isArchived = true;
//                     setUsers([...users]);
//                 }

//                 const currentUser = JSON.parse(localStorage.getItem("items"));
//                 if (currentUser && currentUser._id === userId) {
//                     logOut();
//                 }
//                 // logOut();
//             });

//             socket.on('user_unarchive', (userId) => {
//                 console.log(`Received user unarchived update event: ${userId}`);
//                 // Update the archive icon in real-time
//                 const user = users.find((user) => user._id === userId);
//                 if (user) {
//                     user.isArchived = false;
//                     setUsers([...users]);
//                 }
//                 const currentUser = JSON.parse(localStorage.getItem("items"));
//                 if (currentUser && currentUser._id === userId) {
//                     logOut();
//                 }
//                 // logOut();
//             });
//         }
//     }, [socket, users, setUsers]);

//     // When you archive a user on this device
//     const archiveUser = (userId) => {
//         socket.emit('user_archive', userId);
//         // Update the local state
//         const user = users.find((user) => user._id === userId);
//         if (user) {
//             user.isArchived = true;
//             setUsers([...users]);
//         }

//     };

//     // When you unarchive a user on this device
//     const unarchiveUser = (userId) => {
//         socket.emit('user_unarchive', userId);
//         // Update the local state
//         const user = users.find((user) => user._id === userId);
//         if (user) {
//             user.isArchived = false;
//             setUsers([...users]);
//         }
//     };

//     const { data: users1, isLoading, isError, refetch } = useQuery({
//         queryKey: ['ownerCompanies'],
//         queryFn: fetchOwnerCompanies,
//         select: (data) => {
//             return data?.employees?.sort((a, b) => {
//                 if (a.inviteStatus !== b.inviteStatus) {
//                     return a.inviteStatus ? 1 : -1;
//                 }
//                 if (a.isArchived !== b.isArchived) {
//                     return a.isArchived ? 1 : -1;
//                 }
//                 return 0;
//             });
//         },
//         onError: (error) => {
//             console.error("Error fetching data:", error);
//             enqueueSnackbar("Error fetching data", {
//                 variant: "error",
//                 anchorOrigin: { vertical: "top", horizontal: "right" }
//             });
//         }
//     });

//     // Update users state whenever users1 changes
//     useEffect(() => {
//         if (users1) {
//             setUsers(users1);
//         }
//     }, [users1]);

//     const fetchManagerTeam = async () => {
//         const headers = {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//         };
//         const response = await axios.get(`${apiUrl}/manager/employees`, { headers });
//         return response.data;  // React Query will handle the response status internally
//     };

//     // Integrate React Query for fetching manager team
//     const { data: managerUsers, isLoading: isManagerLoading, isError: isManagerError, refetch: refetchManager } = useQuery({
//         queryKey: ['managerTeam'],  // Query key
//         queryFn: fetchManagerTeam,  // Fetching function
//         select: (data) => {
//             return data?.convertedEmployees?.filter((user) => !user.isArchived).sort((a, b) => {
//                 if (a.inviteStatus !== b.inviteStatus) {
//                     return a.inviteStatus ? 1 : -1;
//                 }
//                 return 0;
//             });
//         },
//         enabled: user?.userType === "manager", // Add this line
//         // onError: (error) => {
//         //     console.error("Error fetching manager team:", error);
//         //     enqueueSnackbar("Error fetching manager team", {
//         //         variant: "error",
//         //         anchorOrigin: { vertical: "top", horizontal: "right" }
//         //     });
//         // }
//     });

//     useEffect(() => {
//         if (managerUsers) {
//             setUsers(managerUsers);
//         }
//     }, [managerUsers, user]);




//     async function archived_unarchived_users() {
//         setShow2(false);
//         setLoading(true);

//         try {
//             const res = await axios.patch(`${apiUrl}/superAdmin/archived/${mainId}`, {
//                 isArchived: isUserArchive // Toggle the current archive status
//             }, {
//                 headers: headers
//             });

//             if (res.status) {
//                 // Update the local state to reflect the new archive status
//                 setUsers((prevUsers) =>
//                     prevUsers.map((user) =>
//                         user._id === mainId ? { ...user, isArchived: !user.isArchived } : user
//                     )
//                 );
//                 // // Update the selected user state
//                 // setSelectedUser((prevUser) => ({
//                 //     ...prevUser,
//                 //     isArchived: !prevUser.isArchived
//                 // }));
//                 // Update the archive state
//                 // setIsUserArchive(!isUserArchive);
//                 if (user?._id === selectedUser?._id) {
//                     logOut(); // Call logOut() if the archived user is the current user
//                 }
//                 enqueueSnackbar(res.data.message, {
//                     variant: "success",
//                     anchorOrigin: {
//                         vertical: "top",
//                         horizontal: "right"
//                     }
//                 });
//             }
//         } catch (error) {
//             enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
//                 variant: "error",
//                 anchorOrigin: {
//                     vertical: "top",
//                     horizontal: "right"
//                 }
//             });
//         } finally {
//             setLoading(false);
//         }
//     }


//     async function deleteUser() {
//         setShow(false);

//         try {
//             const headers = {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 "Content-Type": "application/json",
//             };

//             console.log("Deleting user with mainId:", mainId); // Log mainId
//             const res = await axios.delete(`${apiUrl}/superAdmin/deleteEmp/${mainId}`, { headers });

//             if (res.status === 200) {
//                 console.log("deleteUser RESPONSE:", res.data); // Log response data
//                 fetchOwnerCompanies(); // Refresh the user list
//                 enqueueSnackbar(res.data.Message, {
//                     variant: "success",
//                     anchorOrigin: { vertical: "top", horizontal: "right" },
//                 });
//                 setTimeout(() => setMainId(null), 1000);
//             } else {
//                 console.warn("Unexpected status code:", res.status); // Log unexpected status
//             }
//         } catch (error) {
//             console.error("Delete API Error:", error.response || error.message); // Log errors
//             enqueueSnackbar(
//                 error?.response?.data?.message || "Network error",
//                 {
//                     variant: "error",
//                     anchorOrigin: { vertical: "top", horizontal: "right" },
//                 }
//             );
//         }
//     }

//     const [invitedEmail, setInvitedEmail] = useState(""); // State to store the invited email

//     const handleSendInvitation = async () => {
//         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         if (email !== "" && emailRegex.test(email)) {
//             setShow3(false)
//             setLoading(true); // Set loading state to true
//             try {
//                 const res = await axios.post(`${apiUrl}/superAdmin/email`, {
//                     toEmail: email,
//                     // name: user.name
//                     company: user.company,
//                 }, {
//                     headers: headers,
//                 })
//                 if (res.status) {
//                     enqueueSnackbar(res.data.message, {
//                         variant: "success",
//                         anchorOrigin: {
//                             vertical: "top",
//                             horizontal: "right"
//                         }
//                     })
//                     fetchOwnerCompanies()
//                     setInvitedEmail(email); // Set the invited email to display
//                     setEmail("") // Reset the email input field
//                 }
//                 console.log("invitationEmail RESPONSE =====>", res);

//             } catch (error) {
//                 enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
//                     variant: "error",
//                     anchorOrigin: {
//                         vertical: "top",
//                         horizontal: "right"
//                     }
//                 })
//                 console.log("catch error =====>", error);
//                 setEmail("") // Reset the email input field in case of error
//             }
//             finally {
//                 setLoading(false); // Set loading state to false
//             }
//         }
//         else {
//             enqueueSnackbar("Please enter a valid email address", {
//                 variant: "error",
//                 anchorOrigin: {
//                     vertical: "top",
//                     horizontal: "right"
//                 }
//             })
//         }
//     }

//     const isAdmin = user?.userType === "admin";
//     const isOwner = user?.userType === "owner";



//     return (
//         <div>
//             {show ? <Modal show={show} onHide={() => setShow(false)} animation={false} centered>
//                 <Modal.Body>
//                     <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>Are you sure want to delete {selectedUser?.name} ?</p>
//                     <p>All of the time tracking data and screenshots for this employee will be lost. This can not be undone. Please type <b>DELETE</b> in the box below to acknowledge that employee will be deleted.</p>
//                     <input value={deleteType} onChange={(e) => setDeleteType(e.target.value.trim())} type="text" placeholder="DELETE" style={{
//                         fontSize: "18px",
//                         padding: "5px 10px",
//                         width: "100%",
//                         border: "1px solid #cacaca"
//                     }} />
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <button disabled={deleteType !== "DELETE" ? true : false} className={`${deleteType !== "DELETE" ? "teamActionButtonDisabled" : "teamActionButton"}`} onClick={deleteUser}>
//                         DELETE
//                     </button>
//                     <button className="teamActionButton" onClick={() => setShow(false)}>
//                         CANCEL
//                     </button>
//                 </Modal.Footer>
//             </Modal> : null}
//             {show2 ? <Modal show={show2} onHide={() => setShow2(false)} animation={false} centered>
//                 <Modal.Body>
//                     <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>{!isUserArchive ? "Unarchive" : "Archive"} {selectedUser?.name} ?</p>
//                     <p>The user:</p>
//                     {!isUserArchive ? (
//                         <ul>
//                             <li>Will be able to track time for your company</li>
//                             <li>Will appear in the list of users on your home or timeline</li>
//                             <li>Their data will not be retained and accessible in reports</li>
//                             <li>You will be charged for this user</li>
//                         </ul>
//                     ) : (
//                         <ul>
//                             <li>Will not be able to track time for your company</li>
//                             <li>Will not appear in the list of users on your home or timeline</li>
//                             <li>Their data will be retained and accessible in reports</li>
//                             <li>You will not be charged for this user</li>
//                         </ul>
//                     )}
//                     {!isUserArchive && <p>You can restore this user any time</p>}
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <button className="teamActionButton" onClick={archived_unarchived_users}>
//                         {!isUserArchive ? "UN-ARCHIVE" : "ARCHIVE"}
//                     </button>
//                     <button className="teamActionButton" onClick={() => setShow2(false)}>
//                         CANCEL
//                     </button>
//                 </Modal.Footer>
//             </Modal> : null}
//             {show3 ? <Modal show={show3} onHide={() => setShow3(false)} animation={false} centered>
//                 <Modal.Body>
//                     <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>Invite user via email address</p>
//                     <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Enter user email" style={{
//                         fontSize: "18px",
//                         padding: "5px 10px",
//                         width: "100%",
//                         border: "1px solid #cacaca"
//                     }} />
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <button className="teamActionButton" onClick={handleSendInvitation}>
//                         SEND
//                     </button>
//                     <button className="teamActionButton" onClick={() => setShow3(false)}>
//                         CANCEL
//                     </button>
//                 </Modal.Footer>
//             </Modal> : null}
//             <SnackbarProvider />
//             <div className="container">
//                 <div className="userHeader">
//                     <div className="d-flex align-items-center gap-3">
//                         <div><img src={groupCompany} /></div>
//                         <h5>Team</h5>
//                     </div>
//                 </div>
// <div className="mainwrapper">
//     <div className="ownerTeamContainer">
//                         <div className="d-flex gap-3">
//                             <div style={{ width: "350px" }}>
//                                 {user?.userType !== "manager" && (
//                                     <>
//                                         <p className="addUserButton" onClick={() => navigate('/company-owner-user')}>+ Create user</p>
//                                         <div style={{
//                                             marginTop: "20px",
//                                             display: "flex",
//                                             width: '350px',
//                                             justifyContent: "space-between"
//                                         }}>
//                                             <input value={email} onChange={(e) => {
//                                                 const emailValue = e.target.value;
//                                                 setEmail(emailValue);
//                                                 setIsTypingEmail(!!emailValue); // Set isTypingEmail to true if the input field is not empty
//                                                 const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//                                                 setIsValidEmail(emailRegex.test(emailValue)); // Set isValidEmail to true if the email address is valid
//                                             }} type="email" placeholder="Add user by email" style={{
//                                                 fontSize: "18px",
//                                                 padding: "6px 10px",
//                                                 width: "100%",
//                                                 border: "1px solid #cacaca",
//                                                 outline: "none",
//                                                 borderTopLeftRadius: '5px',
//                                                 borderBottomLeftRadius: '5px',
//                                             }} />
//                                             <button style={{
//                                                 backgroundColor: "#7acb59",
//                                                 borderTopRightRadius: "4px",
//                                                 borderBottomRightRadius: "4px",
//                                                 padding: "10px 25px",
//                                                 color: "white",
//                                                 border: "none",
//                                             }} onClick={handleSendInvitation}
//                                                 disabled={loading || !isValidEmail}
//                                             >
//                                                 {loading && isValidEmail ? (
//                                                     <FerrisWheelSpinner loading={loading} size={23} color="#fff" />
//                                                 ) : (
//                                                     "INVITE"
//                                                 )}
//                                             </button>
//                                         </div>
//                                     </>
//                                 )}
// <div className="companyFont">
//     <p style={{
//         margin: 0,
//         padding: 0,
//         fontSize: "20px",
//         color: "#0E4772",
//         fontWeight: "600",
//     }}>Total</p>
//     <div style={{
//         backgroundColor: "#28659C",
//         color: "white",
//         fontSize: "600",
//         width: "30px",
//         height: "30px",
//         borderRadius: "100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center"
//     }}>
//         {requestedLeaves?.length}
//     </div>
//  </div>
//                                 <div>
//                                     {/* Map through the leave data */}
//                                     {requestedLeaves?.map((leave, index) => (
//                                         <div key={index} className="leaveItem">
//                                             <p style={{ margin: "10px 0", fontWeight: "600", fontSize: "16px" }}>
//                                                 {index + 1}. {leave.userName}
//                                                 {console.log("Leave Username", leave.userName)}
//                                             </p>
//                                             <p style={{
//                                                 margin: "5px 0",
//                                                 fontSize: "14px",
//                                                 color: leave.status === "Pending" ? "orange" : leave.status === "Approved" ? "green" : "red"
//                                             }}>
//                                                 Status: {leave.status}
//                                             </p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

// <div>
//     <img src={line} style={{ height: '100%' }} />
// </div>
//                             {/* <div style={{ width: "100%", display: mainId === null ? "flex" : "", justifyContent: mainId === null ? "center" : "", alignItems: mainId === null ? "center" : "" }}>
//                                 <div>
//                                     <p className="settingScreenshotHeading">Currency symbol</p>
//                                     <div className="settingScreenshotDiv">
//                                         <p>The symbol (e.g. $, €, £) will be shown when you set hourly pay rates for your employees and everywhere where money is shown (like total amount spent today or on a specific project).</p>

//                                     </div>
//                                     <p>
//                                         <input className="dollar" placeholder="$" />

//                                     </p>

//                                     <p className="settingScreenshotIndividual">Individual Settings</p>
//                                     <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
//                                 </div>

//                             </div> */}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default OwnerTeam;
import React, { useEffect, useState } from "react";
import axios from "axios";

const OwnerTeam = () => {
    const [requestedLeaves, setRequestedLeaves] = useState([]);
    const [approvedLeaves, setApprovedLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Fetch the leave requests data
    const fetchLeaveRequests = async () => {
        try {
            const response = await axios.get(`${apiUrl}/superAdmin/getAllLeaveRequests`, { headers });
            const { requestedLeaves, approvedLeaves } = response.data;

            setRequestedLeaves(requestedLeaves);
            setApprovedLeaves(approvedLeaves);

            console.log("Requested Leaves:", requestedLeaves);
            console.log("Approved Leaves:", approvedLeaves);
        } catch (error) {
            console.error("Error fetching leave requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="container">
            <div className="userHeader">
                <h5>Team</h5>
            </div>
            <div className="mainwrapper ownerTeamContainer" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>

                {/* Left Section */}
                <div style={{ width: "350px", marginRight: "20px" }}>
                    <div className="companyFont">
                        <p style={{
                            margin: 0,
                            padding: 0,
                            fontSize: "20px",
                            color: "#0E4772",
                            fontWeight: "600",
                        }}>Total</p>
                        <div style={{
                            backgroundColor: "#28659C",
                            color: "white",
                            fontSize: "600",
                            width: "30px",
                            height: "30px",
                            borderRadius: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            {(requestedLeaves?.length || 0) + (approvedLeaves?.length || 0)}
                        </div>
                    </div>

                    {/* Requested and Approved Leaves */}
                    <div>
                        {[...(requestedLeaves || []), ...(approvedLeaves || [])]?.map((leave, index) => (
                            <div
                                key={index}
                                className="requested-leave-item"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    borderBottom: "1px solid #ccc",
                                    padding: "10px 0",
                                    cursor: "pointer", // Added this line
                                }}
                                onClick={() => setSelectedUser(leave)} // Update selected user on click
                            >
                                <div
                                    style={{
                                        backgroundColor: "#e7e7e7",
                                        borderRadius: "50%",
                                        width: "30px",
                                        height: "30px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {index + 1}
                                </div>
                                <div style={{ flexGrow: 1 }}>
                                    <strong>{leave.userName}</strong>
                                </div>
                                <div
                                    style={{
                                        color:
                                            leave.status === "Pending"
                                                ? "orange"
                                                : leave.status === "Approved"
                                                    ? "green"
                                                    : "red",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {leave.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center Line */}
                <div>
                    <img src={line} style={{ height: "100%" }} />
                </div>

                {/* Right Section */}
                <div style={{ flexGrow: 1, paddingLeft: "20px" }}>
                    {selectedUser ? (
                        <div>
                            <p
                                style={{
                                    fontSize: "18px",
                                    color: "#0E4772",
                                    fontWeight: "600",
                                    marginBottom: "10px",
                                }}
                            >
                                Selected User Details
                            </p>
                            <p>
                                <strong>Name:</strong> {selectedUser.userName}
                            </p>
                            <p>
                                <strong>Status:</strong> {selectedUser.status}
                            </p>
                        </div>
                    ) : (
                        <p
                            style={{
                                fontSize: "16px",
                                color: "#666",
                            }}
                        >
                            Click on a user to view their details here.
                        </p>
                    )}
                </div>

            </div>
        </div>

    );
};

export default OwnerTeam;
