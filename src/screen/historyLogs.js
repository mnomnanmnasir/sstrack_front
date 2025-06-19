import React, { useEffect, useState } from "react";

const History = () => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 15; // ✅ 1 Page = 15 Rows
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");
    const [backendMessage, setBackendMessage] = useState(""); // ✅ Backend message state


    // ✅ Decode Token & Get userType
    let userType = null;
    if (token) {
        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
            userType = decodedToken.userType;
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    // ✅ API URL based on userType
    const apiUrls =
        userType === "user"
            ? `${apiUrl}/timetrack/getUserHistory`
            : userType === "manager"
                ? `${apiUrl}/manager/getManagerHistory`
                : `${apiUrl}/superAdmin/getAdminHistory`;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(apiUrls, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                console.log("Backend Response:", data); // ✅ Debugging

                if (data.success === false) {
                    setBackendMessage(data.message); // ✅ Backend message ko store karein
                } else {
                    setHistoryData(data.history || []);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchHistory();
        } else {
            setError("No authentication token found");
            setLoading(false);
        }
    }, [token]);

    // ✅ Pagination Logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = historyData.slice(indexOfFirstRow, indexOfLastRow);

    return (
        <div className="container">
            {/* Header Section */}
            <div className="userHeader flex justify-between items-center mb-6 bg-blue-600 p-4 rounded-md">
                <h5 className="text-lg font-semibold text-white">History Logs</h5>
            </div>

            {/* Display Loading or Error */}
            {loading ? (
                <p className="text-center ownerTeamContainer">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">Error: {error}</p>
            ) : (
                <div className="mainwrapper ownerTeamContainer" style={{ marginTop: "-2px" }}>
                    <div style={{ width: "100%" }}>
                        <table
                            id="allLeaves"
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                alignItems: "center",
                                textAlign: "center",
                                fontSize: "12px",
                            }}
                        >
                            <thead style={{ alignItems: "center", textAlign: "center" }}>
                                <tr style={{ backgroundColor: "#F5F7FA"}}>
                                    {["Date", "Edited By", "Domain", "Message", "Name"].map((header, index) => (
                                        <th
                                            key={index}
                                            style={{
                                                padding: "10px",
                                                textAlign: "center",
                                                color: "#4F4F4F",
                                                fontWeight: "bold",
                                                borderBottom: "2px solid #000", // ✅ Header border
                                                border: "1px solid #000", // ✅ Each column border
                                                fontSize: '14px'
                                            }}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.length > 0 ? (
                                    currentRows.map((item, index) => (
                                        <tr key={index} style={{
                                            borderBottom: "2px solid #000", // ✅ Bottom border for each row
                                            border: "1px solid #000", // ✅ Border around row
                                            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff", // ✅ Alternate row color
                                        }}>
                                            <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>{item.createdOn || "N/A"}</td>
                                            <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>{item.editedBy?.name || "N/A"}</td>
                                            <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>{item.domain || "N/A"}</td>
                                            <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>{item.scope || "-"}</td>
                                            <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>{item.affectedUserId?.name || "-"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{
                                            textAlign: "center",
                                            padding: "15px",
                                            fontWeight: "bold",
                                            border: "1px solid #000", // ✅ Border for empty row
                                            backgroundColor: "#f9f9f9",
                                            color: "#721C24",
                                        }}>
                                            {backendMessage}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* ✅ Pagination Buttons */}
                        <div className="pagination-controls" style={{ textAlign: "center", marginTop: "10px" }}>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{
                                    padding: "10px 20px",
                                    marginLeft: "10px",
                                    backgroundColor: "#ddd",
                                    color: "#000",
                                    borderRadius: "5px",
                                    border: "none",
                                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                    opacity: currentPage === 1 ? 0.5 : 1,
                                }}
                            >
                                Previous
                            </button>
                            <span> Page {currentPage} of {Math.ceil(historyData.length / rowsPerPage)} </span>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={indexOfLastRow >= historyData.length}
                                style={{
                                    padding: "10px 20px",
                                    marginRight: "10px",
                                    backgroundColor: "#ddd",
                                    color: "#000",
                                    borderRadius: "5px",
                                    border: "none",
                                    cursor: indexOfLastRow >= historyData.length ? "not-allowed" : "pointer",
                                    opacity: indexOfLastRow >= historyData.length ? 0.5 : 1,
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
