// NotificationBell.js
import React, { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const NotificationBell = ({ userType, userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    useEffect(() => {
        const fetchNotifications = async () => {
            let apiUrl = "";
            if (userType === "user") {
                apiUrl = "https://myuniversallanguages.com:9093/api/v1/timetrack/getUserNotifications";
            } else if (userType === "manager") {
                apiUrl = "https://myuniversallanguages.com:9093/api/v1/manager/getManagerNotifications";
            } else {
                apiUrl = "https://myuniversallanguages.com:9093/api/v1/superAdmin/getAdminNotifications";
            }

            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                // let fetchedNotifications = response.data.userNotifications || response.data.managerNotifications || response.data.data?.notifications || response.data.adminNotifications || [];
                let fetchedNotifications = [];

                if (userType === "user") {
                    fetchedNotifications = response.data.userNotifications || [];
                } else if (userType === "manager") {
                    fetchedNotifications = response.data.managerNotifications || [];
                } else {
                    fetchedNotifications = response.data.adminNotifications || response.data.data?.notifications || [];
                }

                setNotifications(fetchedNotifications);
                setNotificationCount(fetchedNotifications.length);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 20000);
        return () => clearInterval(interval);
    }, [userType]);

    return (
        <div style={{ position: "relative", marginRight: "8px" }} ref={notificationRef}>
            <button
                className="btn position-relative"
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ background: "transparent", border: "none" }}
            >
                <FaBell size={20} style={{ color: '#fff' }} />

                {(notificationCount >= 0) && (
                    <sup
                        style={{
                            position: "absolute",
                            top: "-4px",
                            right: "-8px",
                            backgroundColor: "#7CCB58", // SS Track green
                            color: "#FFFFFF",
                            borderRadius: "10%",
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

            {showNotifications && (
                <ul
                    className="shadow"
                    style={{
                        position: "absolute",
                        top: "100%",
                        right: window.innerWidth < 480 ? "8px" : "0", // ✅ Right margin on small screens
                        width: "259px",
                        maxHeight: "350px",
                        overflowY: "auto",
                        backgroundColor: "#fff",
                        padding: "10px",
                        borderRadius: "8px",
                        zIndex: 1000,
                        marginLeft: window.innerWidth < 480 ? '-100px' : '0px', // ✅ Add left shift on mobile
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
                                        <div style={{ color: "#333" }}>{notif.message || "No message provided."}</div>
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
                                                fontSize: "13px",
                                            }}
                                        >
                                            View All
                                        </button>
                                    </Link>
                                </li>
                            {/* <li className="text-center d-flex justify-content-space-between px-2">
                                <Link to="/notification">
                                    <button
                                        className="btn btn-primary btn-sm w-100"
                                        style={{
                                            backgroundColor: "#28659C",
                                            borderColor: "#28659C",
                                            borderRadius: "5px",
                                            fontSize: "13px",
                                        }}
                                    >
                                        View All
                                    </button>
                                </Link>
                                <button
                                    className="btn btn-primary btn-sm w-100"
                                    style={{
                                        backgroundColor: "#28659C",
                                        borderColor: "#28659C",
                                        borderRadius: "5px",
                                        fontSize: "13px",
                                    }}
                                    
                                >
                                    View All
                                </button>
                                <button
                                    className="btn btn-primary btn-sm"
                                    style={{
                                        borderRadius: "5px",
                                        fontSize: "13px",
                                    }}
                                    onClick={() => setShowNotifications(false)}
                                >
                                    Cancel
                                </button>
                            </li> */}
                        </>
                    )}
                </ul>
            )}
        </div>
    );
};

export default NotificationBell;
