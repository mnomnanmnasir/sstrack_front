
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaProjectDiagram, FaUserPlus, FaClock, FaCheckCircle, FaCalendarCheck, FaBell } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import dashboard from "../../images/dashboard.webp";
import logout from "../../images/logout.webp";
import account from "../../images/myaccount.webp";
import logo from '../../images/sloganLogo.png';
import { useSocket } from '../../io'; // Correct import
import UserDashboardSection from "../../screen/component/userDashboardsection";
import { setLogout } from "../../store/timelineSlice";
// import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineHistory } from "react-icons/ai"; // 🛠 Import History Icon
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import SettingsIcon from '@mui/icons-material/Settings';
import jwtDecode from "jwt-decode";
import HeaderOption from './HeaderOption';
import circle from "../../images/circle.webp";
import NotificationBell from "../Notification/noticationBell";


function UserHeader() {
    const token = localStorage.getItem("token");
    let user = null;

    if (token) {
        try {
            user = jwtDecode(token); // Decode the token
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    } else {
        console.warn('No token available');
    }

    const [showContent, setShowContent] = useState(false);
    const [userType, setUserType] = useState(user?.userType);

    const navigate = useNavigate("");
    const dispatch = useDispatch()
    const socket = useSocket()
    const [forceUpdate, setForceUpdate] = useState(0); // 🔹 Force re-render state
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]); // store fetched notifications
    const notificationRef = useRef(null);
    const [notificationCount, setNotificationCount] = useState(0);
    const [prevNotificationIds, setPrevNotificationIds] = useState([]);

    let headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
    }

    const [remainingBreakTime, setRemainingBreakTime] = useState(''); // State to store remaining break time

    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";


    const logoutDivRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    useEffect(() => {
        const fetchRemainingBreakTime = async () => {
            if (user?.userType === "user" || user?.userType === 'manager' || user?.userType === 'admin' && user?._id) {
                try {
                    const userId = user._id; // Extract userId dynamically
                    const apiUrl = `https://myuniversallanguages.com:9093/api/v1/timetrack/remainingBreak/${userId}`;

                    console.log("Fetching Remaining Break Time for User ID:", userId);
                    console.log("API URL:", apiUrl);

                    // Make the API call
                    const response = await axios.get(apiUrl, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token in headers
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.status === 200 && response.data?.data) {
                        const { remainingBreakTime } = response.data.data; // Extract remainingBreakTime
                        console.log("Remaining Break Time from API:", remainingBreakTime);
                        setRemainingBreakTime(remainingBreakTime || "0h:0m"); // Fallback to "0h:0m" if no time
                    } else {
                        console.error(
                            "Failed to fetch remaining break time. Status:",
                            response.status,
                            "Message:",
                            response.data?.message || response.statusText
                        );
                        setRemainingBreakTime("0h:0m"); // Fallback on failure
                    }
                } catch (error) {
                    console.error("Error fetching remaining break time:", error.response || error.message || error);
                    setRemainingBreakTime("0h:0m"); // Fallback on error
                }
            } else {
                console.warn("User type is not 'user' or userId is missing.");
                setRemainingBreakTime("0h:0m"); // Fallback when condition fails
            }
        };

        fetchRemainingBreakTime();
    }, [user]);

    const [toggleData, setToggleData] = useState({});
    const [showMessage, setShowMessage] = useState(true); // Shared state for toggles

    const handleToggleChange = (employeeId, data) => {
        setToggleData((prev) => ({
            ...prev,
            [employeeId]: data, // Update specific employee toggle data
        }));
    };


    useEffect(() => {
        function handleClickOutside(event) {
            if (logoutDivRef.current && !logoutDivRef.current.contains(event.target)) {
                setShowContent(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
    const getitems = jwtDecode(JSON.stringify(token));
    const [items, setItem] = useState(getitems);

    const [leaveCount, setLeaveCount] = useState(0); // State to store leave request count
    useEffect(() => {
        // Function to check localStorage and update state
        const checkSetupStatus = () => {
            const isSetupComplete =
                localStorage.getItem("isUsehasVisitedPuncutlity") === "true" &&
                localStorage.getItem("isUsehasVisitedLeave") === "true" &&
                localStorage.getItem("is1stUser") === "true" &&
                localStorage.getItem("is1stProjectisCreated") === "true" &&
                localStorage.getItem("isUsehasVisitedbreak") === "true" &&
                localStorage.getItem("TrainingisCompleted") === "true";

            setShowMessage(!isSetupComplete);
        };

        checkSetupStatus(); // Initial check

        // Listen for localStorage changes (useful if updated from another component)
        window.addEventListener("storage", checkSetupStatus);

        return () => {
            window.removeEventListener("storage", checkSetupStatus);
        };
    }, []);
    // Fetch leave requests and calculate count
    const fetchLeaveRequests = async () => {
        try {
            const userId = items._id; // Current user ID
            const apiUrl = `https://myuniversallanguages.com:9093/api/v1/superAdmin/getAllLeaveRequests`;

            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in headers
                },
            });

            if (response.status === 200) {
                const { requestedLeaves = [] } = response.data; // Extract requested leaves
                const userRequestedLeaves = requestedLeaves.filter((leave) => leave.userId === userId);
                setLeaveCount(userRequestedLeaves.length); // Update count for the current user
            } else {
                console.error("Failed to fetch leave requests:", response.data?.message || response.statusText);
            }
        } catch (error) {
            console.error("Error fetching leave requests:", error.response || error.message || error);
        }
    };

    // Call fetchLeaveRequests on component mount
    useEffect(() => {
        if (items?.userType === "user" || items?.userType === "manager") {
            fetchLeaveRequests();
        }
    }, [items]);

    useEffect(() => {
        if (!socket) {
            console.error('Socket instance is null or undefined');
            return;
        }

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        const handleUpdateData = () => {
            console.log('Received updateData event===========SOCKET');
            updateData();
            // setForceUpdate(prev => prev + 1); // 🔹 Just update state to trigger re-render

            // Window ko reload karne ke liye
        }

        socket.on('role_update', handleUpdateData);

        return () => {
            socket.off('role_update', handleUpdateData);
        };
    }, [socket]);


    async function updateData() {

        try {
            const response = await axios.patch(`${apiUrl}/signin/users/Update`, {
                // ...model
            }, {
                headers: headers
            })
            if (response.data) {
                console.log('!!!!!!!!!!!!!!!!!!>', userType);
                // setLoading(false)
                setUserType(response.data.user.userType)
                localStorage.setItem("token", response.data.token);
                // localStorage.setItem("items", JSON.stringify(response.data.user));

                // 🔹 Force re-render
                setForceUpdate(prev => prev + 1);
            }
        } catch (error) {
            // setLoading(false)

            console.log(error);
        }
    }

    function logOut() {

        localStorage.removeItem("token");

        dispatch(setLogout())
        // window.location.reload()
        navigate("/")
        setTimeout(() => {
            window.location.reload()
        }, 1000);
        setShowContent(false)
    }


    function takeToDashboard() {
        setShowContent(false)
        navigate("/dashboard")
    }

    function takeToAdmin() {
        setShowContent(false)
        navigate("/account")
    }

    function takeToHistory() {
        setShowContent(false)
        navigate("/history")
    }

    function takeToSettings() {
        setShowContent(false)
        navigate("/effective-settings")
    }
    function userSettings() {
        setShowContent(false)
        navigate("/user-setting")
    }
    // function leaveManagement() {
    //     setShowContent(false)
    //     navigate("/leave-management")
    // }

    const wordsAfterSpace = user?.name?.split(" ")[1] ? user?.name?.split(" ")[1].charAt(0).toUpperCase() : "";
    const capitalizedWord = user?.name?.charAt(0).toUpperCase();

    useEffect(() => {
        if (socket) {
            socket.on('role_update', (data) => {
                if (data.user_id === items._id) {
                    console.log('Role update received:', data);
                    updateRole(data.new_role);
                }
            });
        }

        // Don't forget to clean up when the component unmounts
        return () => {
            if (socket) {
                socket.off('role_update');
            }
        };
    }, [socket, items]);

    const updateRole = (newRole) => {
        localStorage.setItem('items', JSON.stringify({ ...items, userType: newRole }));
        items.userType = newRole;
    };

    return (
        <>
            <div className="px-3">
                {/* <Header /> */}
                {user?.userType === "user" ? (
                    <>
                        <HeaderOption />
                        {/* <nav className="navbar navbar-expand-lg navbar-dark" style={{
                            backgroundColor: "#0d3756",
                            padding: "10px 15px",
                            margin: "0px 30px 0 30px",
                            marginTop: '-15px'
                        }}> */}
                        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 py-2">
                            {/* <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center w-100"> */}
                            <div className="container-fluid d-flex flex-column flex-lg-row align-items-center justify-content-between">

                                {/* <div className="d-flex align-items-center mb-2 mb-lg-0"> */}
                                    <img onClick={() => navigate('/')} className="logo1" src={logo} />

                                {/* </div> */}
                                {/* <div ref={logoutDivRef}> */}
                                <div className="d-flex flex-wrap align-items-center gap-2" ref={logoutDivRef}>
                                    <div className="d-flex amButton" role="search">
                                        <div style={{ position: "relative", marginRight: "15px" }} ref={notificationRef}>
                                            <button
                                                className="btn position-relative"
                                                type="button"
                                                onClick={() => setShowNotifications(!showNotifications)} // Toggle manually
                                                style={{ background: "transparent", border: "none" }}
                                            >
                                                <FaBell size={20} style={{ color: '#28659C' }} />

                                                {(notificationCount >= 0) && (
                                                    <sup
                                                        style={{
                                                            position: "absolute",
                                                            top: "-4px",
                                                            right: "-8px",
                                                            backgroundColor: "#7CCB58",
                                                            color: "white",
                                                            borderRadius: "50%",
                                                            padding: "2px 6px",
                                                            fontSize: "10px",
                                                            fontWeight: "bold",
                                                            lineHeight: "1",
                                                        }}
                                                    >
                                                        {notificationCount > 10 ? "10+" : notificationCount}
                                                    </sup>
                                                )}
                                            </button>

                                            {showNotifications && ( // 🧠 Conditionally render dropdown
                                                <ul
                                                    className="shadow"
                                                    style={{
                                                        position: "absolute",
                                                        top: "100%",
                                                        right: "0",
                                                        width: "300px",
                                                        maxHeight: "350px",
                                                        overflowY: "auto",
                                                        backgroundColor: "#fff",
                                                        padding: "10px",
                                                        borderRadius: "8px",
                                                        zIndex: 1000,
                                                    }}
                                                >
                                                    {notifications.length === 0 ? (
                                                        <li className="text-center text-muted" style={{ fontSize: "13px" }}>
                                                            No notifications
                                                        </li>
                                                    ) : (
                                                        <>
                                                            {notifications.slice(0, 3).map((notif, index) => (
                                                                <li key={notif._id || index}>
                                                                    <div
                                                                        style={{
                                                                            padding: "10px",
                                                                            marginBottom: "8px",
                                                                            backgroundColor: "#fff",
                                                                            borderRadius: "6px",
                                                                            borderLeft: "4px solid #28659C",
                                                                            fontSize: "13px",
                                                                            lineHeight: "1.4",
                                                                        }}
                                                                    >
                                                                        <div style={{ fontWeight: "600", color: "#28659C", marginBottom: "4px" }}>
                                                                            {notif.title || "Untitled"}
                                                                        </div>
                                                                        <div style={{ color: "#333" }}>
                                                                            {notif.message || "No message provided."}
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}

                                                            <li className="text-center">
                                                                <Link to="/notification">
                                                                    <button
                                                                        className="btn btn-primary btn-sm"
                                                                        style={{
                                                                            backgroundColor: "#28659C",
                                                                            borderColor: "#28659C",
                                                                            borderRadius: "5px",
                                                                            fontSize: "13px"
                                                                        }}
                                                                    >
                                                                        View All
                                                                    </button>
                                                                </Link>
                                                            </li>
                                                        </>
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                        <div className="d-flex justify-content-end align-items-center flex-nowrap info-container">
                                            {(user?.userType === "user" || user?.userType === "manager" || user?.userType === "admin") && (
                                                <div className="company-name-container1">
                                                    <div>

                                                    </div>
                                                    <p className="m-0 fw-bold">
                                                        Break Time {remainingBreakTime || '0h 0m'}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="company-name-container1">
                                                <div>
                                                    <img src={circle} className="company-logo" alt="Company Logo" />
                                                </div>
                                                <p className="m-0 fw-bold">
                                                    {items?.company}
                                                </p>
                                            </div>
                                        </div>
                                        <p>{user?.name.charAt(0).toUpperCase() + user?.name.slice(1)} ({userType})</p>
                                        <button onClick={() => setShowContent(!showContent)} className="userName">
                                            {capitalizedWord + wordsAfterSpace}
                                        </button>
                                        {/* <button onClick={() => updateData()} className="userName">
                                    {capitalizedWord}
                                </button> */}
                                    </div>
                                    {showContent && <div className="logoutDiv">
                                        <div onClick={takeToDashboard}>
                                            <div>
                                                <img src={dashboard} />
                                            </div>
                                            <p>Dashboard</p>
                                        </div>
                                        <div onClick={takeToAdmin}>
                                            <div>
                                                <img src={account} />
                                            </div>
                                            <p>My Account</p>
                                        </div>
                                        <div onClick={takeToHistory}>
                                            <div style={{ marginLeft: '-4%' }}>
                                                <AiOutlineHistory size={24} color="#fff" /> {/* 🛠 Icon Added Here */}
                                            </div>
                                            <p>History
                                                <span style={{ marginLeft: '5%' }}>
                                                    Logs
                                                </span>
                                            </p>
                                        </div>


                                        {user?.userType === "user" ? null : (
                                            <div onClick={takeToSettings}>
                                                <div>
                                                    <img src={account} />
                                                </div>
                                                <p>Settings</p>
                                            </div>
                                        )}
                                        <div onClick={logOut}>
                                            <div>
                                                <img src={logout} />
                                            </div>
                                            <p>Logout</p>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </nav>
                        {/* <UserDashboardSection /> */}
                    </>

                ) : (
                    <>
                        <HeaderOption />
                        <nav className="navbar navbar-expand-lg navbar-dark" style={{
                            backgroundColor: "#0d3756",
                            padding: "10px 15px",
                            // borderTopLeftRadius: "10px",
                            // borderTopRightRadius: "10px",
                            margin: "0px 30px 0 30px",
                            marginTop: '-15px'
                        }}>
                            {/* <HeaderOption /> */}
                            <div className="container-fluid" style={{ position: "relative" }}>
                                <div>
                                    <img onClick={() => navigate('/')} className="logo1" src={logo} />

                                </div>
                                <div ref={logoutDivRef}>


                                    <div className="d-flex amButton text-center align-items-center" role="search">

                                        {/* Notification call the component */}
                                        <div style={{ position: "relative", marginRight: "15px" }} ref={notificationRef}>
                                            <NotificationBell userType={items?.userType} userId={items?._id} />
                                        </div>

                                        {token && user && (
                                            <>
                                                <div className="d-flex justify-content-end align-items-center flex-nowrap info-container">
                                                    {(user?.userType === "user" || user?.userType === "manager" || user?.userType === "admin") && (
                                                        <div className="company-name-container1">
                                                            <div>

                                                            </div>
                                                            <p className="m-0 fw-bold">
                                                                Break Time {remainingBreakTime || '0h 0m'}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="company-name-container1">
                                                        <div>
                                                            <img src={circle} className="company-logo" alt="Company Logo" />
                                                        </div>
                                                        <p className="m-0 fw-bold">
                                                            {items?.company}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p>
                                                    {user?.name?.charAt(0).toUpperCase() + user?.name?.slice(1)} ({userType})
                                                </p>
                                                <button onClick={() => setShowContent(!showContent)} className="userName">
                                                    {capitalizedWord + wordsAfterSpace}
                                                </button>
                                            </>
                                        )}
                                        {/* <button onClick={() => updateData()} className="userName">
                                        {capitalizedWord}
                                    </button> */}
                                    </div>
                                    {showContent && <div className="logoutDiv">
                                        {/* <div className="text-white p-3 mt-2 rounded"> */}
                                        <div className="d-flex flex-column gap-2">
                                            <div onClick={takeToDashboard}>
                                                <div>
                                                    <img src={dashboard} />
                                                </div>
                                                <p>Dashboard</p>
                                            </div>
                                            {/* <div onClick={leaveManagement}>
                                            <div>
                                                <img src={dashboard} />
                                            </div>
                                            <p>Leave Management</p>
                                        </div> */}
                                            <div onClick={takeToAdmin}>
                                                <div>
                                                    <img src={account} />
                                                </div>
                                                <p>My Account</p>
                                            </div>
                                            {/* <div onClick={takeToHistory}>
                                            <div>
                                                <img src={account} />
                                            </div>
                                            <p>History 
                                                <span>    
                                                Logs
                                                </span>
                                                </p>
                                        </div> */}

                                            <div onClick={takeToHistory}>
                                                <div style={{ marginLeft: '-4%' }}>
                                                    <AiOutlineHistory size={24} color="#fff" /> {/* 🛠 Icon Added Here */}
                                                </div>
                                                <p>History
                                                    <span style={{ marginLeft: '5%' }}>
                                                        Logs
                                                    </span>
                                                </p>
                                            </div>
                                            {(user?.userType === "user") || (user?.userType === "manager") ? null : (
                                                <div onClick={takeToSettings}>
                                                    <div style={{ marginLeft: '-5px' }}>
                                                        <SettingsIcon style={{ fontSize: '24px', color: '#fff' }} />
                                                    </div>
                                                    <p>Settings</p>
                                                </div>
                                            )}



                                            <div onClick={logOut}>
                                                <div>
                                                    <img src={logout} />
                                                </div>
                                                <p>Logout</p>
                                            </div>
                                        </div>
                                    </div>
                                        // </div>
                                    }
                                </div>
                            </div>

                        </nav>
                        {/* {showMessage && ( */}
                        {showMessage && (
                            <div
                                className="alert d-flex justify-content-center align-items-center text-center mb-3 mx-3 mx-sm-4 mx-md-5"
                                style={{
                                    backgroundColor: 'orange',
                                    color: 'white',
                                    fontWeight: 500,
                                    borderRadius: '0 0 8px 8px',
                                }}
                                role="alert"
                            >
                                <span>
                                    Complete your account setup by adding a{' '}
                                    <Link to="/Projects" className="text-success text-decoration-underline">
                                        project
                                    </Link>
                                    , inviting{' '}
                                    <Link to="/team" className="text-success text-decoration-underline">
                                        users
                                    </Link>
                                    , setting{' '}
                                    {(userType === 'admin' || userType === 'owner') && (
                                        <Link to="/settings/break-time" className="text-success text-decoration-underline">
                                            break times
                                        </Link>
                                    )}
                                    , ensuring{' '}
                                    {(userType === 'admin' || userType === 'owner') && (
                                        <Link to="/settings/punctuality" className="text-success text-decoration-underline">
                                            punctuality
                                        </Link>
                                    )}
                                    , and configuring{' '}
                                    <Link to="/leave-management" className="text-success text-decoration-underline">
                                        leaves
                                    </Link>
                                    , Please click{' '}
                                    <Link to="/Training" className="text-success text-decoration-underline">
                                        Training center
                                    </Link>
                                    .
                                </span>
                            </div>

                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default UserHeader;