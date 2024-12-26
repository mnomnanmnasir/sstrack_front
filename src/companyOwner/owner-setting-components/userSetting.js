import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MyLeavesApplication = () => {
    // State for leave counts and requests
    const [leaveCounts, setLeaveCounts] = useState({
        annualLeaves: 0,
        sickLeaves: 0,
        casualLeaves: 0,
        bereavementLeaves: 0
    });
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = "https://myuniversallanguages.com:9093/api/v1/superAdmin/getAllUserLeaves";
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch leave data from API
    const fetchLeaveData = async () => {
        try {
            const response = await axios.get(apiUrl, { headers });
            const usersData = response.data?.data || [];

            // Assuming the API returns data for multiple users, filter for the current user
            const currentUser = JSON.parse(localStorage.getItem("items")); // Current user data from localStorage
            const userId = currentUser?.id || currentUser?._id;

            // Find the current user's leave data
            const userData = usersData.find((user) => user.userId?._id === userId);

            if (userData) {
                const { sickLeaves, casualLeaves, annualLeaves, leaveHistory, bereavementLeaves } = userData;

                // Set leave counts and requests
                setLeaveCounts({
                    annualLeaves: annualLeaves || 0,
                    sickLeaves: sickLeaves || 0,
                    casualLeaves: casualLeaves || 0,
                    bereavementLeaves: bereavementLeaves || 0,
                });
                setLeaveRequests(leaveHistory || []);
            } else {
                console.warn("No data found for the current user.");
            }
        } catch (error) {
            console.error("Error fetching leave data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaveData();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(leaveRequests.length / itemsPerPage);
    const currentItems = leaveRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const openModal = (leave) => {
        setSelectedLeave(leave);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedLeave(null);
        setIsModalOpen(false);
    };


    const renderModal = () => {
        if (!selectedLeave) return null;

        return (
            <div>
                {/* Background overlay */}
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 999,
                    }}
                    onClick={closeModal} // Close modal on background click
                ></div>

                {/* Modal content */}
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1000,
                        backgroundColor: "#FFFFFF",
                        padding: "30px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        borderRadius: "12px",
                        width: "570px",
                        border: "1px solid #E0E0E0",
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={closeModal}
                        style={{
                            position: "absolute",
                            top: "-2px",
                            right: "8px",
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#888",
                            fontSize: "24px",
                            cursor: "pointer",
                        }}
                    >
                        &times;
                    </button>

                    <h3 style={{ color: "#0E4772", marginBottom: "20px" }}>
                        User Leave Request Detail
                    </h3>

                    {/* User Information */}
                    {/* <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                            marginBottom: "20px",
                        }}
                    >
                        <div
                            style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                backgroundColor: "#E8F4FC",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            👤
                        </div>
                        <strong style={{ fontSize: "18px", color: "#4F4F4F" }}>
                            {selectedLeave.userName || "No User Name"}
                        </strong>
                    </div> */}

                    {/* Leave Details */}
                    <div style={{ marginBottom: "20px" }}>
                        <p>
                            <strong>Start Date:</strong>{" "}
                            {selectedLeave.startDate
                                ? new Date(selectedLeave.startDate).toLocaleDateString("en-GB")
                                : "-"}
                        </p>
                        <p>
                            <strong>End Date:</strong>{" "}
                            {selectedLeave.endDate
                                ? new Date(selectedLeave.endDate).toLocaleDateString("en-GB")
                                : "-"}
                        </p>
                        <p>
                            <strong>Request Date:</strong>{" "}
                            {selectedLeave.appliedAt
                                ? new Date(selectedLeave.appliedAt).toLocaleDateString("en-GB")
                                : "-"}
                        </p>
                        <p>
                            <strong>Leave Type:</strong> {selectedLeave.leaveType || "-"}
                        </p>
                        <p>
                            <strong>Approval Date:</strong>{" "}
                            {selectedLeave.approvedAt
                                ? new Date(selectedLeave.approvedAt).toLocaleDateString("en-GB")
                                : "-"}
                        </p>
                        <p>
                            <strong>Reason:</strong> {selectedLeave.reason || "No reason provided"}
                        </p>
                        {/* Conditionally render Reason of Reject */}
                        {selectedLeave.status?.trim().toUpperCase() === "REJECTED" && (
                            <>
                                <p style={{ marginBottom: "0" }}>
                                    <strong>Reason of Rejection:</strong>
                                </p>
                                <p style={{ marginTop: "0" }}>
                                    {selectedLeave.reasonOfReject || "No reason provided"}
                                </p>

                            </>
                        )}
                        {/* <p>
                            <strong>Approved By:</strong>{" "}
                            {selectedLeave.approvedBy?.name || "-"}
                            {selectedLeave.approvedBy?.userType && (
                                <span style={{ marginLeft: "10px", fontStyle: "italic", color: "#888" }}>
                                    ({selectedLeave.approvedBy.userType})
                                </span>
                            )}
                        </p> */}
                    </div>

                    {/* Status Badge */}
                    {/* <span
                        style={{
                            position: "absolute",
                            top: "27px",
                            right: "30px",
                            backgroundColor: "#FFF5F5",
                            color: "#FF6F6F",
                            border: "1px solid #FF6F6F",
                            padding: "5px 10px",
                            borderRadius: "12px",
                            fontWeight: "600",
                        }}
                    >
                        {selectedLeave.status ? selectedLeave.status.toUpperCase() : "PENDING"}
                    </span> */}
                    <span
                        style={{
                            position: "absolute",
                            top: "27px",
                            right: "30px",
                            backgroundColor: "#FFF5F5",
                            color: "#FF6F6F",
                            border: "1px solid #FF6F6F",
                            padding: "5px 10px",
                            borderRadius: "12px",
                            fontWeight: "600",
                            color:
                                selectedLeave.status.trim().toUpperCase() === "APPROVED"
                                    ? "blue" // Blue color for approved
                                    : selectedLeave.status.trim().toUpperCase() === "PENDING"
                                        ? "orange" // Orange color for pending
                                        : "red", // Red color for rejected
                        }}
                    >
                        {selectedLeave.status}
                    </span>


                </div>
            </div>
        );
    };


    return (
        <>
            <div className="container">
                <div
                    className="userHeader"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#28659C",
                        padding: "16px 20px",
                        color: "white",
                        borderRadius: "5px 5px 0 0",
                    }}
                >
                    <h5 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                        Employee Leave Management
                    </h5>
                </div>

                <div className="mainwrapper ownerTeamContainer">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div>


                            <div className="d-flex" style={{ gap: "50px", justifyContent: "space-between", alignItems: "center" }}>
                                <h3 style={{ textAlign: "left", fontSize: '25px', color: "#0E4772", display: "inline" }}>My Leave Application</h3>
                                <p style={{ margin: 0, gap: "5px", padding: "10px", border: "1px solid #000" }}>
                                    <b>Remaining Leaves:</b> Annual Leaves: {leaveCounts.annualLeaves}, Sick Leaves: {leaveCounts.sickLeaves}, Casual Leaves: {leaveCounts.casualLeaves}, bereavement Leaves: {leaveCounts.bereavementLeaves}
                                </p>
                                <Link to="/applyForLeave">
                                    <button
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#7FC45B",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                        }}
                                    >
                                        Apply For Leave
                                    </button>
                                </Link>
                            </div>

                            {currentItems.length > 0 ? (
                                currentItems.map((leave, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: "20px",
                                            backgroundColor: "#fff",
                                            border: "1px solid #ddd",
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginTop: "10px",
                                        }}
                                    >
                                        <div>
                                            <h3 style={{ color: "#0E4772", margin: 0 }}>{leave.leaveType}</h3>
                                            {/* <p style={{ margin: "5px 0", color: "#777", fontWeight: "bold" }}>
                                                The concise explanation for leave......
                                            </p> */}
                                            <p style={{ margin: "5px 0", color: "#555" }}>
                                                <b>Start Date:</b>{" "}
                                                {new Date(leave.startDate).toLocaleDateString()} &nbsp; | &nbsp;
                                                <b>End Date:</b>{" "}
                                                {new Date(leave.endDate).toLocaleDateString()} &nbsp; | &nbsp;
                                                <b>Approved Date:</b>                             {leave.approvedAt
                                                    ? new Date(leave.approvedAt).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                    })
                                                    : "-"}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <button
                                                onClick={() => openModal(leave)}
                                                style={{
                                                    padding: "10px 20px",
                                                    backgroundColor: "#7FC45B",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                View
                                            </button>
                                            <p
                                                style={{
                                                    marginTop: "10px",
                                                    fontWeight: "600",
                                                    color:
                                                        leave.status.trim().toUpperCase() === "APPROVED"
                                                            ? "blue" // Blue color for approved
                                                            : leave.status.trim().toUpperCase() === "PENDING"
                                                                ? "orange" // Orange color for pending
                                                                : "red", // Red color for rejected
                                                }}
                                            >
                                                {leave.status}
                                            </p>

                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No leave requests found.</p>
                            )}

                            {/* Pagination Controls */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "20px",
                                }}
                            >
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    style={{
                                        padding: "10px 20px",
                                        marginRight: "10px",
                                        backgroundColor: "#ddd",
                                        color: "#000",
                                        borderRadius: "5px",
                                        border: "none",
                                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                    }}
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    style={{
                                        padding: "10px 20px",
                                        marginLeft: "10px",
                                        backgroundColor: "#ddd",
                                        color: "#000",
                                        borderRadius: "5px",
                                        border: "none",
                                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && renderModal()}
        </>
    );
};

export default MyLeavesApplication;

