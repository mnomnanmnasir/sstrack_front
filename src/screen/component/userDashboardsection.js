import React, { useEffect, useState } from "react";
import menu from "../../images/menu.webp";
import loader from "../../images/Rectangle.webp";
import check from "../../images/check.webp";
import circle from "../../images/circle.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";


function UserDashboardSection() {
    const token = localStorage.getItem("token");
    const getitems = jwtDecode(JSON.stringify(token));
    const navigate = useNavigate();
    const location = useLocation();
    const [items, setItems] = useState(getitems);

    useEffect(() => {
        const updatedItems = getitems
        setItems(updatedItems);
    }, []);

    console.log('Items from localStorage:', items);
    const [remainingBreakTime, setRemainingBreakTime] = useState(''); // State to store remaining break time


    const [leaveCount, setLeaveCount] = useState(0); // State to store leave request count

    // Fetch leave requests and calculate count
    const fetchLeaveRequests = async () => {
        try {
            const userId = items._id; // Current user ID
            const apiUrl = `https://myuniversallanguages.com:9093/api/v1/superAdmin/getAllLeaveRequests`;

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
    }, [items]);

    return (
        <div className="cursor-pointer">
            <div className="d-flex justify-content-between align-items-center" style={{
                backgroundColor: "white",
                padding: "10px 20px",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                margin: "0px 30px 0 30px",
            }}>
                <div className="d-flex gap-1 align-items-center w-80">
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
                        <p style={{ margin: 0, whiteSpace: 'nowrap' }} onClick={() => navigate(`/timeline/${items?._id}`)}>My timeline</p>
                    </div>}
                    {(items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager" ) && (
                        <>
                            <div className={location.pathname === "/team" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/team')}>
                                <p style={{ margin: 0, whiteSpace: 'nowrap' }} onClick={() => navigate('/team')}>Team</p>
                            </div>
                        </>
                    )}
                    <div className={location.pathname === "/reports" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/reports')}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/reports')}>Reports</p>
                    </div>
                    {!(items?.userType === "user" || items?.userType === "manager") && (
                        <>
                            <div className={location.pathname === "/Projects" ? "active-tab" : "ownerSectionUser"} onClick={() => navigate('/Projects')}>
                                <p style={{ margin: 0 }} onClick={() => navigate('/Projects')}>Projects</p>
                            </div>
                        </>
                    )}
                    {/* Leave Tab with Count */}
                    {(items?.userType === "owner" || items?.userType === "manager" || items?.userType === "admin") && (
                        <div
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
                    {/* {/ Location Tracking /} */}
                    {(items?.userType === "owner" || items?.userType === "manager" || items?.userType === "admin" || items?.userType === "user") && (
                        <div
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
                    {(items?.userType === "owner" || items?.userType === "manager" || items?.userType === "admin") && (
                        <div
                            className={location.pathname === "/attendence-management" ? "active-tab" : "ownerSectionUser"}
                            onClick={() => navigate("/attendence-management")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                cursor: "pointer",
                            }}
                        >
                            <p style={{ margin: 0 }}>
                                Attendence
                                <span style={{ marginLeft: "5px" }}>
                                    Management
                                </span>
                            </p>

                        </div>
                    )}

                    <div className="d-flex container">

                    </div>
                </div>

                <div className="d-flex">
                    {/* <p className="ownerSectionCompany" style={{ margin: "0 20px", fontWeight: "bold" }}>
                        Break Time: {remainingBreakTime}
                    </p> */}
                    {(items?.userType === "user" || items?.userType === "manager" || items?.userType === "admin") && (
                        <div className="ownerSectionCompany company-container" style={{ margin: "0 10px", fontWeight: "bold", display: 'flex', alignItems: 'center' }}>
                            <p style={{ margin: "0px", fontWeight: "bold", fontSize: '14px' }}>
                                Break Time: <span>{remainingBreakTime || '0h:0m'}</span>
                            </p>
                        </div>
                    )}
                    <div className="ownerSectionCompany d-flex align-items-center cursor-none company-container">
                        <div><img src={circle} className="company-logo" alt="Company Logo" />
                        </div>
                        <p className="m-0 text-truncate fw-bold company-text">
                            {items?.company}</p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default UserDashboardSection;