import React, { useEffect, useState } from "react";

const History = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 15;

    const token = localStorage.getItem("token");
    const [backendMessage, setBackendMessage] = useState("");

    let userType = null;
    if (token) {
        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            userType = decodedToken.userType;
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    // const apiUrl =
    //     userType === "user"
    //         ? "https://myuniversallanguages.com:9093/api/v1/timetrack/getUserNotifications"
    //         : "https://myuniversallanguages.com:9093/api/v1/superAdmin/getAdminNotifications";
    const apiUrl =
        userType === "user"
            ? "https://myuniversallanguages.com:9093/api/v1/timetrack/getUserNotifications"
            : userType === "manager"
                ? "https://myuniversallanguages.com:9093/api/v1/manager/getManagerNotifications"
                : "https://myuniversallanguages.com:9093/api/v1/superAdmin/getAdminNotifications";


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(apiUrl, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                console.log("Fetched Notifications:", data);

                if (data.success === false) {
                    setBackendMessage(data.message);
                } else {
                    // const list = data.userNotifications || data.adminNotifications || [];
                    let list = [];
                    if (userType === "user") {
                        list = data.userNotifications || [];
                    } 
                    else if (userType === "manager") {
                        list = data.managerNotifications || [];
                    } else {
                        list = data.adminNotifications || [];
                    }
                    setNotifications(list);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchNotifications();
        } else {
            setError("No authentication token found");
            setLoading(false);
        }
    }, [token]);

    // Pagination
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = notifications.slice(indexOfFirstRow, indexOfLastRow);

    return (
        <div className="container">
            <div className="userHeader flex justify-between items-center mb-6 bg-blue-600 p-4 rounded-md">
                <h5 className="text-lg font-semibold text-white">Notification History</h5>
            </div>

            {loading ? (
                <tbody>
                    <tr>
                        <td colSpan="9" style={{ background: '#0E4772', textAlign: "center", padding: "20px" }}>
                            Loading...
                        </td>
                    </tr>
                </tbody>
            ) : error ? (
                <p className="text-center text-red-500">Error: {error}</p>
            ) : (
                <div className="mainwrapper ownerTeamContainer">
                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        textAlign: "center",
                        fontSize: "13px",
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: "#F5F7FA" }}>

                                <th style={{
                                    padding: "10px",
                                    border: "1px solid #000",
                                    fontWeight: "bold"
                                }}>Title</th>
                                <th style={{
                                    padding: "10px",
                                    border: "1px solid #000",
                                    fontWeight: "bold"
                                }}>Message </th>
                                {/* <th style={{
                                    padding: "10px",
                                    border: "1px solid #000",
                                    fontWeight: "bold"
                                }}>Created By </th> */}
                                <th style={{
                                    padding: "10px",
                                    border: "1px solid #000",
                                    fontWeight: "bold"
                                }}>Created By </th>
                                {userType !== "user" && (
                                    <th style={{
                                        padding: "10px",
                                        border: "1px solid #000",
                                        fontWeight: "bold"
                                    }}>Created to</th>
                                )}
                                <th style={{
                                    padding: "10px",
                                    border: "1px solid #000",
                                    fontWeight: "bold"
                                }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.length > 0 ? (
                                currentRows.map((item, index) => (
                                    <tr key={item._id || index} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                                        <td style={{ border: "1px solid #000", padding: "10px" }}>{item.title || "Untitled"}</td>
                                        <td style={{ border: "1px solid #000", padding: "10px" }}>{item.message || "No message provided"}</td>
                                        {/* <td style={{ border: "1px solid #000", padding: "10px" }}>{item.message || "No message provided"}</td> */}
                                        {/* <td style={{ border: "1px solid #000", padding: "10px" }}>{item.message || "No message provided"}</td> */}
                                        <td style={{ border: "1px solid #000", padding: "10px" }}>
                                            <strong>{item.createdBy?.name || "N/A"}</strong><br />
                                            <small>{item.createdBy?.email || "-"}</small>
                                        </td>
                                        {userType !== "user" && (
                                            <td style={{ border: "1px solid #000", padding: "10px" }}>
                                                <strong>{item.recipientId?.name || "N/A"}</strong><br />
                                                <small>{item.recipientId?.email || "-"}</small>
                                            </td>
                                        )}
                                        <td style={{ border: "1px solid #000", padding: "10px" }}>
                                            {new Date(item.createdAt).toLocaleString() || "N/A"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center", padding: "15px", border: "1px solid #000" }}>
                                        {backendMessage || "No notifications available"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div style={{ textAlign: "center", marginTop: "15px" }}>
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                                padding: "6px 12px",
                                marginRight: "10px",
                                borderRadius: "4px",
                                border: "none",
                                backgroundColor: "#ccc",
                                cursor: currentPage === 1 ? "not-allowed" : "pointer"
                            }}
                        >
                            Previous
                        </button>
                        <span> Page {currentPage} of {Math.ceil(notifications.length / rowsPerPage)} </span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={indexOfLastRow >= notifications.length}
                            style={{
                                padding: "6px 12px",
                                marginLeft: "10px",
                                borderRadius: "4px",
                                border: "none",
                                backgroundColor: "#ccc",
                                cursor: indexOfLastRow >= notifications.length ? "not-allowed" : "pointer"
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
