import React, { useEffect, useState, useRef } from "react"; // Include useRef
import menu from "../../images/menu.webp";
import loader from "../../images/Rectangle.webp";
import check from "../../images/check.webp";
import circle from "../../images/circle.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Joyride from "react-joyride";
import BreakTime from '../../adminScreens/settingScreenComponent/breakTime';
import { FaChevronDown } from "react-icons/fa"; // 🛠 Import Professional Arrow Icon
import { FaBell } from "react-icons/fa";

function UserDashboardSection({ settingsTabs }) {
    const [run, setRun] = useState(true);
    const [stepIndex, setStepIndex] = useState(0);
    const token = localStorage.getItem("token");
    const getitems = jwtDecode(JSON.stringify(token));
    const navigate = useNavigate();
    const location = useLocation();
    const [attendanceDropdownOpen, setAttendanceDropdownOpen] = useState(false);
    const [items, setItems] = useState(getitems);
    const [notificationCount, setNotificationCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]); // store fetched notifications
    const [prevNotificationIds, setPrevNotificationIds] = useState([]);
    const notificationRef = useRef(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [selectedTab, setSelectedTab] = useState(null); // Track selected tab
    const steps = [
        {
            target: "#team",
            content: "Here you can see all your team members and control their roles",
            disableBeacon: true,
            continuous: true,
        },
        {
            target: "#Reports",
            content: "Here you can see your company reports",
            // disableBeacon: true,
            continuous: true,
        },
        {
            target: "#Projects",
            content: "Here you can see your company projects",
            // disableBeacon: true,
            continuous: true,
        },
        {
            target: "#Leave",
            content: "Here you can manage your leave requests",
            // disableBeacon: true,
            continuous: true,
        },
        {
            target: "#LocationTracking",
            content: "Here you can see your location tracking",
            // disableBeacon: true,
            continuous: true,
        },
        {
            target: "#Attendence",
            content: "Here you can manage your attendance",
            // disableBeacon: true,
            continuous: true,
        },
    ];

    useEffect(() => {
        let intervalId;

        const fetchNotifications = async () => {
            const apiUrl =
                items?.userType === "user"
                    ? `${apiUrl}/timetrack/getUserNotifications`
                    : items?.userType === "manager"
                        ? `${apiUrl}/manager/getManagerNotifications`
                        : `${apiUrl}/superAdmin/getAdminNotifications`;

            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.status === 200) {
                    let fetchedNotifications = [];

                    if (items?.userType === "user") {
                        fetchedNotifications =
                            response.data.userNotifications ||
                            response.data.notifications ||
                            response.data.data?.notifications ||
                            [];
                    } else if (items?.userType === "manager") {
                        fetchedNotifications =
                            response.data.managerNotifications ||
                            response.data.notifications ||
                            response.data.data?.notifications ||
                            [];
                    } else {
                        fetchedNotifications = response.data.adminNotifications || [];
                    }

                    console.log("📦 Total Notifications:", fetchedNotifications.length);
                    // console.table(fetchedNotifications.map(n => ({
                    //     ID: n._id,
                    //     Title: n.title,
                    //     Message: n.message
                    // })));

                    // 🔄 Track notifications
                    const currentIds = fetchedNotifications.map((n) => n._id);
                    setPrevNotificationIds(currentIds);

                    // ✅ Show total notifications count
                    setNotificationCount(fetchedNotifications.length);
                    setNotifications(fetchedNotifications);

                } else {
                    console.error("Notification fetch failed", response);
                }
            } catch (error) {
                console.error("Notification error:", error);
            }
        };

        if (items?._id) {
            fetchNotifications(); // Initial fetch
            intervalId = setInterval(fetchNotifications, 20000); // ⏱ Poll every 20 seconds
        }

        return () => {
            clearInterval(intervalId); // ✅ Cleanup on unmount
        };

    }, [items]);



    useEffect(() => {
        const updatedItems = getitems
        setItems(updatedItems);
    }, []);
    console.log('itemmsssss', items._id === "679b223b61427668c045c659");


    const handleJoyrideCallback = (data) => {
        const { action, index, status } = data;

        if (action === "next") {
            setStepIndex(index + 1);
        }
        if (status === "finished" || status === "skipped") {
            setRun(false); // End the tour when finished
        }
    };

    const [remainingBreakTime, setRemainingBreakTime] = useState(''); // State to store remaining break time


    const [leaveCount, setLeaveCount] = useState(0); // State to store leave request count

    // Fetch leave requests and calculate count
    const fetchLeaveRequests = async () => {
        try {
            const userId = items._id; // Current user ID
            const apiUrl = `${apiUrl}/superAdmin/getAllLeaveRequests`;

            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token in headers
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
        if (!items?.company) {
            navigate('/profile');
        }
    }, [items, navigate]);

    useEffect(() => {
        const fetchRemainingBreakTime = async () => {
            if (items?.userType === "user" || items?.userType === 'manager' && items?._id) {
                try {
                    const userId = items._id; // Extract userId dynamically
                    const apiUrl = `${apiUrl}/timetrack/remainingBreak/${userId}`;

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
    }, [items]);

    const [dropdownOpen, setDropdownOpen] = useState(false)

    return (
        <div className="cursor-pointer">
            {items._id === "679b223b61427668c045c659" && (
                <Joyride
                    steps={steps}
                    run={run}
                    callback={handleJoyrideCallback}
                    showProgress
                    showSkipButton
                    continuous
                    scrollToFirstStep
                />
            )}

            <div className="d-flex justify-content-between align-items-center" style={{
                backgroundColor: "white",
                padding: "10px 20px",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                margin: "0px 30px 0 30px",
            }}>
                <div className="d-flex align-items-center flex-wrap">
                    <div className={location.pathname === "/dashboard" ? "active-tab" : "ownerSectionUser"} onClick={() => {
                        navigate('/dashboard')
                    }} >
                        <p style={{ margin: 0 }} onClick={() => {
                            navigate('/dashboard')
                        }}>Dashboard</p>
                    </div>
                    {/* {Object.entries(toggleData).map(([employeeId, data]) => (
                        data.showFields && data.userType === "user" && ( // Ensure userType is "user"
                            <div key={employeeId} style={{ marginLeft: '20px' }}>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>Employee ID: {employeeId}</p>
                                <p style={{ margin: 0 }}>Start Time: {data.startTime || 'Not Set'}</p>
                                <p style={{ margin: 0 }}>End Time: {data.endTime || 'Not Set'}</p>
                            </div>
                        )
                    ))} */}


                    {items?.userType === "user" || items?.userType === "manager" && <div className={location.pathname.includes("/timeline") ? "active-tab" : "ownerSectionUser"} onClick={() => navigate(`/timeline/${items?._id}`)}>
                        <p style={{ margin: 0, whiteSpace: 'nowrap' }} onClick={() => navigate(`/timeline/${items?._id}`)}>Timeline</p>
                    </div>}

                    {/* {(items?.userType === "owner" || items?.userType === "manager" || items?.userType === "admin") && ( */}
                    <div
                        id="Attendence"
                        className={location.pathname.startsWith("/reports") ? "active-tab" : "ownerSectionUser"}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            position: "relative",
                            // backgroundColor: "#F5F5F5", // ✅ Background color
                            // padding: "10px 15px",
                            borderRadius: "5px",
                        }}
                        onClick={() => navigate("/reports")}
                    >
                        {/* ✅ Attendance Management Text */}


                        <div
                            className="dropdown1"
                            onMouseEnter={() => setDropdownOpen(true)}
                            onMouseLeave={() => setDropdownOpen(false)}
                            style={{ position: "relative" }}
                        >
                            <div
                                className=""
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between", // 
                                    gap: "15px",
                                    cursor: "pointer",
                                    position: "relative",
                                    // backgroundColor: "#F5F5F5", // ✅ Background color
                                    // padding: "10px 15px",
                                    borderRadius: "5px",
                                    // width: items?.userType === "manager" ? "190px" : "80px",

                                }}
                            >
                                <span style={{ textAlign: 'center' }}>
                                    Reports
                                    {/* ✅ Manager ke liye dropdown icon hide karein */}
                                    {/* {items?.userType !== "manager" && ( */}
                                    <FaChevronDown size={14} color="#000" style={{ marginLeft: "5px" }} />
                                    {/* )} */}
                                </span>
                                {/* <FaChevronDown size={14} color="#000" style={{ marginLeft: "5px" }} /> ✅ Icon ko Padding di */}
                            </div>
                            {/* {items?.userType !== "manager" && ( */}
                            <>
                                {dropdownOpen && (
                                    <div className="dropdown-content1">
                                        <Link
                                            to="/reports"
                                            state={{ activateTabs: true }}
                                            style={{
                                                color: '#28659C', textDecoration: 'none', fontSize: '15px',
                                                display: 'block',
                                                padding: '5px 10px'
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Detailed Reports
                                        </Link>
                                        <Link
                                            to="/punctuality-reports"
                                            state={{ deactivateTabs: true }}
                                            style={{
                                                color: '#28659C', textDecoration: 'none', fontSize: '15px',

                                                display: 'block',
                                                padding: '10px 12px'
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Punctuality Reports
                                        </Link>
                                    </div>
                                )}
                            </>
                            {/* )} */}
                        </div>

                    </div>
                    {/* )} */}

                    {!(items?.userType === "user") && (
                        <>
                            <div id="Projects" className={location.pathname === "/Projects" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/Projects')}>
                                <p style={{ margin: 0 }} onClick={() => navigate('/Projects')}>Projects</p>
                            </div>
                        </>
                    )}

                    {/* Leave Tab with Count */}
                    {(items?.userType === "owner" || items?.userType === "manager" || items?.userType === "admin") && (
                        <div
                            id="Leave"
                            className={location.pathname === "/leave-management" ? "active-tab" : "ownerSectionUser"}
                            onClick={() => navigate("/leave-management")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                cursor: "pointer",
                            }}
                        >
                            <p style={{ margin: 0 }}>
                                Leave
                                <span style={{ marginLeft: "5px" }}>
                                    Management
                                </span>
                            </p>

                            {/* <span
                                style={{
                                    backgroundColor: "#28659C",
                                    color: "white",
                                    borderRadius: "50%",
                                    padding: "5px 10px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                }}
                            >
                                {leaveCount}
                            </span> */}
                        </div>
                    )}
                    {/* {(items?.userType === "user") && (
                        <div
                            id="LocationTracking"
                            className={location.pathname === "/user-setting" ? "active-tab" : "ownerSectionUser"}
                            onClick={() => navigate("/user-setting")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",

                                cursor: "pointer",
                            }}
                        >
                            <p style={{ margin: 0 }}>Leave</p>
                            <span>
                                Management
                            </span>

                        </div>
                    )} */}
                    {/* {/ Location Tracking /} */}
                    {(items?.userType === "owner" || items?.userType === "manager" || items?.userType === "admin" || items?.userType === "user") && (
                        <div
                            id="LocationTracking"
                            className={location.pathname === "/Locationtracking" ? "active-tab" : "ownerSectionUser"}
                            onClick={() => navigate("/Locationtracking")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",

                                cursor: "pointer",
                            }}
                        >
                            <p style={{ margin: 0 }}>Location</p>
                            <span>
                                Tracking
                            </span>

                        </div>
                    )}
                    {(items?.userType === "user") && (
                        <div
                            id="LocationTracking"
                            className={location.pathname === "/user-setting" ? "active-tab" : "ownerSectionUser"}
                            onClick={() => navigate("/user-setting")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",

                                cursor: "pointer",
                            }}
                        >
                            <p style={{ margin: 0 }}>Leave</p>
                            <span>
                                Management
                            </span>

                        </div>
                    )}
                    {/* ✅ Attendance Management Dropdown */}
                    {(items?.userType === "owner" || items?.userType === "manager" || items?.userType === "admin") && (
                        <div
                            id="Attendence"
                            className={location.pathname.startsWith("/attendence-management") ? "active-tab" : "ownerSectionUser"}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                position: "relative",
                                // backgroundColor: "#F5F5F5", // ✅ Background color
                                // padding: "10px 15px",
                                borderRadius: "5px",
                            }}
                            onClick={() => navigate("/attendence-management")}
                        >
                            {/* ✅ Attendance Management Text */}


                            <div
                                className="dropdown1"
                                onMouseEnter={() => setDropdownOpen(true)}
                                onMouseLeave={() => setDropdownOpen(false)}
                                style={{ position: "relative" }}
                            >
                                <div
                                    className=""
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between", // 
                                        gap: "15px",
                                        cursor: "pointer",
                                        position: "relative",
                                        // backgroundColor: "#F5F5F5", // ✅ Background color
                                        // padding: "10px 15px",
                                        borderRadius: "5px",
                                        width: items?.userType === "manager" ? "190px" : "210px",

                                    }}
                                >
                                    <span style={{ textAlign: 'center' }}>
                                        Attendence Management
                                        {/* ✅ Manager ke liye dropdown icon hide karein */}
                                        {items?.userType !== "manager" && (
                                            <FaChevronDown size={14} color="#000" style={{ marginLeft: "5px" }} />
                                        )}
                                    </span>
                                    {/* <FaChevronDown size={14} color="#000" style={{ marginLeft: "5px" }} /> ✅ Icon ko Padding di */}
                                </div>
                                {items?.userType !== "manager" && (
                                    <>
                                        {dropdownOpen && (
                                            <div className="dropdown-content1">
                                                <Link
                                                    to="/settings/break-time"
                                                    state={{ deactivateTabs: true }}
                                                    style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}
                                                >
                                                    <p
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // navigate("/settings/break-time"); // ✅ Navigate to Break Time Page
                                                        }}
                                                    >
                                                        Break Time
                                                    </p>
                                                </Link>
                                                <Link
                                                    to="/settings/punctuality"
                                                    state={{ deactivateTabs: true }} // ✅ Jab navigate ho to tabs deactivate ho jayein
                                                    style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}
                                                >
                                                    <p
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // navigate("/settings/punctuality");
                                                        }}
                                                    >
                                                        Punctuality
                                                    </p>
                                                </Link>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                        </div>
                    )}

                    {/* ✅ Render BreakTime Component When "Break Time" is Selected */}
                    {/* <div className=" container">

                    </div> */}
                </div>
                {/* <FaBell
                    size={20}
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowNotifications(!showNotifications)}
                /> */}

                {/* <div className="dropdown" style={{ position: "relative", marginRight: "15px" }}>
                    <button
                        className="btn btn-light position-relative dropdown-toggle"
                        type="button"
                        id="notificationDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <FaBell />
                        {notificationCount > 0 && (
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                style={{ fontSize: "10px" }}
                            >
                                {notificationCount}
                            </span>
                        )}
                    </button>

                    <ul
                        className={`dropdown-menu dropdown-menu-end p-2 shadow ${showNotifications ? 'show' : ''}`}
                        aria-labelledby="notificationDropdown"
                        style={{ width: "300px", maxHeight: "300px", overflowY: "auto" }}
                    >
                        {notifications.length === 0 ? (
                            <li className="text-center text-muted" style={{ fontSize: "13px" }}>
                                No notifications
                            </li>
                        ) : (
                            notifications.map((notif, index) => (
                                <li
                                    key={notif._id || index}
                                    className="mb-2 p-2 border-start border-3 border-primary rounded bg-light"
                                >
                                    <div className="fw-bold">{notif.title}</div>
                                    <div className="small text-muted">{notif.message}</div>
                                </li>
                            ))
                        )}
                    </ul>
                </div> */}


                <div className="d-flex justify-content-end align-items-center flex-nowrap">

                    {/* {(items?.userType === "user" || items?.userType === "manager" || items?.userType === "admin") && (
                        <div className="break-time-container">
                            <p className="" style={{ textAlign: 'center', width: '50%' }}>
                                Break Time {remainingBreakTime || '0h 0m'}
                            </p>
                        </div>
                    )} */}


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
                        {(items?.userType === "user" || items?.userType === "manager" || items?.userType === "admin") && (
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
                </div>
            </div>
        </div>
        // </div>
    )
}

export default UserDashboardSection;