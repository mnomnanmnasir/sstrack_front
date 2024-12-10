import React, { useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';

const OwnerTeam = () => {
    const [leaveData, setLeaveData] = useState({
        requestedLeaves: [],
        approvedLeaves: [],
        rejectedLeaves: [],
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("requestedLeaves");
    const [selectedLeave, setSelectedLeave] = useState(null); // To store the clicked leave
    const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
    const data = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);

    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Fetch leave requests data
    const fetchLeaveRequests = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/superAdmin/getAllLeaveRequests`,
                { headers }
            );
            const { requestedLeaves = [], approvedLeaves = [], rejectedLeaves = [] } =
                response.data || {};

                
            setLeaveData({ requestedLeaves, approvedLeaves, rejectedLeaves });
        } catch (error) {
            console.error("Error fetching leave requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    // Open modal and set selected leave
    const handleRowClick = (leave) => {
        setSelectedLeave(leave); // Store the clicked leave details
        setIsModalOpen(true); // Open the modal
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedLeave(null);
    };

    // Reject the leave request
    const handleReject = async (leaveId, userId) => {
        try {
            const response = await axios.post(
                `${apiUrl}/superAdmin/approveLeaves`,
                {
                    "userId": userId,
                    "leaveId": leaveId,
                    "status": "Rejected"
                },
                { headers }

            );
            console.log("Leave request accepted:", response.data);
            enqueueSnackbar('Leave request accepted successfully', {
                variant: 'success', anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
            fetchLeaveRequests(); // Refresh the leave requests data
        } catch (error) {
            enqueueSnackbar('Error accepting leave request', {
                variant: 'error', anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
            console.error("Error accepting leave request:", error);
        }
    }
    // Accept the leave request
    const handleAccept = async (leaveId, userId) => {
        try {
            const response = await axios.post(
                `${apiUrl}/superAdmin/approveLeaves`,
                {
                    "userId": userId,
                    "leaveId": leaveId,
                    "status": "Approved"
                },
                { headers }

            );
            console.log("Leave request accepted:", response.data);
            enqueueSnackbar('Leave request accepted successfully', {
                variant: 'success', anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
            fetchLeaveRequests(); // Refresh the leave requests data
        } catch (error) {
            enqueueSnackbar('Error accepting leave request', {
                variant: 'error', anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
            console.error("Error accepting leave request:", error);
        }
    }


    //  modal
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
                    <div
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
                            {selectedLeave.userName}
                        </strong>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        <p>
                            <strong>Start Date:</strong>{" "}
                            {new Date(selectedLeave.startDate).toLocaleDateString("en-GB")}
                        </p>
                        <p>
                            <strong>End Date:</strong>{" "}
                            {new Date(selectedLeave.endDate).toLocaleDateString("en-GB")}
                        </p>
                        <p>
                            <strong>Request Date:</strong>{" "}
                            {new Date(selectedLeave.appliedAt).toLocaleDateString("en-GB")}
                        </p>
                        <p>
                            <strong>Leave Type:</strong> {selectedLeave.leaveType}
                        </p>
                        <p>
                            <strong>Approval Date:</strong>
                            {selectedLeave.approvedAt
                                ? new Date(selectedLeave.approvedAt).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })
                                : "-"}
                        </p>
                        <p>
                            <strong>Reason:</strong> {selectedLeave.reason}
                        </p>
                        <p>
                            <strong>Approved By:</strong> {selectedLeave.approvedBy ? (
                                <>
                                    {selectedLeave.approvedBy.name}
                                    <span style={{ marginLeft: "10px", fontStyle: "italic", color: "#888" }}>
                                        ({selectedLeave.approvedBy.userType})
                                    </span>
                                </>
                            ) : "-"}
                        </p>
                        {activeTab === "requestedLeaves" && (
                            <>
                                <p>
                                    <strong>Enter Reason for Rejection:</strong>
                                </p>
                                <textarea
                                    placeholder="Enter rejection reason..."
                                    style={{
                                        width: "100%",
                                        height: "100px",
                                        padding: "10px",
                                        border: "1px solid #E0E0E0",
                                        borderRadius: "5px",
                                        resize: "none",
                                        marginBottom: "20px",
                                    }}
                                ></textarea>
                            </>
                        )}
                    </div>

                    {/* Conditional Buttons and Inputs */}
                    {selectedLeave.status.toLowerCase() === "approved" && (
                        <div style={{ marginTop: "20px", textAlign: "center" }}>
                            <button
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#7FC45B",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                }}
                                onClick={closeModal}
                            >
                                Back
                            </button>
                        </div>
                    )}

                    {selectedLeave.status.toLowerCase() === "rejected" && (
                        <div style={{ marginTop: "20px" }}>
                            {/* <textarea
                                placeholder="Enter rejection reason..."
                                style={{
                                    width: "100%",
                                    height: "100px",
                                    padding: "10px",
                                    border: "1px solid #E0E0E0",
                                    borderRadius: "5px",
                                    resize: "none",
                                    marginBottom: "20px",
                                }}
                            ></textarea> */}
                            <div style={{ textAlign: "center" }}>
                                <button
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#7FC45B",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        // Handle submission logic if needed
                                        closeModal();
                                    }}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}

                    {selectedLeave.status.toLowerCase() === "pending" && (
                        <div style={{ marginTop: "20px", textAlign: "center" }}>
                            <button
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#7FC45B",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    // Handle accept logic
                                    handleAccept(selectedLeave.leaveId, selectedLeave.userId);
                                    console.log("Accepted", selectedLeave.userId, 'abdullah', selectedLeave.leaveId);
                                    closeModal();
                                }}
                            >
                                Accept
                            </button>
                            <button
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#FF6F6F",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    // Handle reject logic
                                    handleReject(selectedLeave.leaveId, selectedLeave.userId);
                                    console.log("Rejected");
                                    closeModal();
                                }}
                            >
                                Reject
                            </button>
                        </div>
                    )}

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
                        }}
                    >
                        {selectedLeave.status.toUpperCase()}
                    </span>
                </div>
            </div>
        );
    };

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;


    //leave rowss
    const renderLeaves = (leaves) => {
        if (loading) {
            return (
                <tbody>
                    <tr>
                        <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                            Loading...
                        </td>
                    </tr>
                </tbody>
            );
        }

        // Filter out owner users before rendering
        const filteredLeaves = leaves.filter((leave) => leave.userRole !== "Owner"); // Assuming 'userRole' is a field

        if (!leaves || leaves.length === 0) {
            return (
                <tbody>
                    <tr>
                        <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                            No leaves found for this category.
                        </td>
                    </tr>
                </tbody>
            );
        }

        // Calculate the index range for current page
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = leaves.slice(indexOfFirstItem, indexOfLastItem);

        return (
            // <tbody>
            //     {leaves.map((leave, index) => (
            //         <tr
            //             key={index}
            //             style={{
            //                 borderBottom: "1px solid #E0E0E0",
            //                 backgroundColor: "#FFF",
            //                 cursor: "pointer", // Indicate row is clickable
            //             }}
            //             onClick={() => handleRowClick(leave)} // Handle row click
            //         >
            // <td style={{ padding: "10px", color: "#4F4F4F", fontWeight: "400", display: "flex", alignItems: "center", gap: "10px" }}>
            //     <span
            //         style={{
            //             display: "flex",
            //             justifyContent: "center",
            //             alignItems: "center",
            //             backgroundColor: "#E8F4FC",
            //             borderRadius: "50%",
            //             width: "30px",
            //             height: "30px",
            //             color: "#0E4772",
            //             fontWeight: "bold",
            //         }}
            //     >
            //         👤
            //     </span>
            //     {leave.userName}
            // </td>
            //             <td style={{ padding: "10px", color: "#4F4F4F" }}>
            //                 {new Date(leave.startDate).toLocaleDateString("en-GB", {
            //                     day: "2-digit",
            //                     month: "2-digit",
            //                     year: "numeric",
            //                 })}
            //             </td>
            //             <td style={{ padding: "10px", color: "#4F4F4F" }}>
            //                 {new Date(leave.endDate).toLocaleDateString("en-GB", {
            //                     day: "2-digit",
            //                     month: "2-digit",
            //                     year: "numeric",
            //                 })}
            //             </td>
            //             <td style={{ padding: "10px", color: "#4F4F4F" }}>
            //                 {new Date(leave.appliedAt).toLocaleDateString("en-GB", {
            //                     day: "2-digit",
            //                     month: "2-digit",
            //                     year: "numeric",
            //                 })}
            //             </td>
            //             <td style={{ padding: "10px", color: "#4F4F4F" }}>
            //                 {leave.leaveType}
            //             </td>
            //             <td style={{ padding: "10px", color: "#4F4F4F" }}>  {new Date(leave.approvedAt).toLocaleDateString("en-GB", {
            //                 day: "2-digit",
            //                 month: "2-digit",
            //                 year: "numeric",
            //             })}</td>


            //    <tbody>
            //         {currentItems.map((leave, index) => (
            //             <tr
            //                 key={index}
            //                 style={{
            //                     borderBottom: "1px solid #E0E0E0",
            //                     backgroundColor: "#FFF",
            //                     cursor: "pointer",
            //                 }}
            //                 onClick={() => handleRowClick(leave)}
            //             >
            //                 <td style={{ padding: "10px", color: "#4F4F4F", fontWeight: "400", display: "flex", alignItems: "center", gap: "10px" }}>
            //                     <span
            //                         style={{
            //                             display: "flex",
            //                             justifyContent: "center",
            //                             alignItems: "center",
            //                             backgroundColor: "#E8F4FC",
            //                             borderRadius: "50%",
            //                             width: "30px",
            //                             height: "30px",
            //                             color: "#0E4772",
            //                             fontWeight: "bold",
            //                         }}
            //                     >
            //                         👤
            //                     </span>
            //                     {leave.userName}
            //                 </td>
            //                 <td style={{ padding: "10px", color: "#4F4F4F" }}>
            //                     {new Date(leave.startDate).toLocaleDateString("en-GB")}
            //                 </td>
            //                 <td style={{ padding: "10px", color: "#4F4F4F" }}>
            //                     {new Date(leave.endDate).toLocaleDateString("en-GB")}
            //                 </td>
            //                 <td style={{ padding: "10px", color: "#4F4F4F" }}>
            //                     {new Date(leave.appliedAt).toLocaleDateString("en-GB")}
            //                 </td>
            //                 <td style={{ padding: "10px", color: "#4F4F4F" }}>{leave.leaveType}</td>
            //                 <td style={{ padding: "10px", color: "#4F4F4F" }}>
            //                     {new Date(leave.approvedAt).toLocaleDateString("en-GB")}
            //                 </td>
            //                 <td style={{ padding: "10px", color: "#4F4F4F" }}>{leave.reason}</td>
            //                 <td style={{ padding: "10px", color: "#4F4F4F" }}>{leave.approvedBy}</td>
            //                 <td style={{ padding: "10px", color: "#4F4F4F" }}>{leave.reason}</td>
            //                 <td style={{ padding: "10px", color: "#4F4F4F" }}>{leave.approvedBy}</td>
            //                 <td style={{
            //                     padding: "10px",
            //                     color: "#4F4F4F",
            //                     textAlign: "center",
            //                 }}>
            //                     <span
            //                         style={{
            //                             padding: "5px 10px",
            //                             borderRadius: "12px",
            //                             color:
            //                                 leave.status === "Approved"
            //                                     ? "green"
            //                                     : leave.status === "Pending"
            //                                         ? "orange"
            //                                         : "red",
            //                             border:
            //                                 leave.status === "Approved"
            //                                     ? "1px solid green"
            //                                     : leave.status === "Pending"
            //                                         ? "1px solid orange"
            //                                         : "1px solid red",
            //                             fontWeight: "bold",
            //                             display: "inline-block",
            //                         }}
            //                     >
            //                         {leave.status.toUpperCase()}
            //                     </span>
            //                 </td>
            //             </tr>
            //         ))}
            //     </tbody>

            <tbody>
                {currentItems.map((leave, index) => (
                    <tr
                        key={index}
                        style={{
                            borderBottom: "1px solid #E0E0E0",
                            backgroundColor: "#FFF",
                            cursor: "pointer", // Indicate row is clickable
                            // alignItems: 'center',
                            // textAlign: 'center'
                        }}
                        onClick={() => handleRowClick(leave)} // Handle row click
                    >
                        <td style={{ padding: "10px", color: "#4F4F4F", fontWeight: "400" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#E8F4FC",
                                        borderRadius: "50%",
                                        width: "30px",
                                        height: "30px",
                                        color: "#0E4772",
                                        fontWeight: "bold",
                                    }}
                                >
                                    👤
                                </span>
                                <span style={{ flexGrow: 1, textAlign: "left" }}>{leave.userName}</span>
                            </div>
                        </td>

                        <td style={{ padding: "10px", color: "#4F4F4F" }}>
                            {new Date(leave.startDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </td>
                        <td style={{ padding: "10px", color: "#4F4F4F" }}>
                            {new Date(leave.endDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </td>
                        <td style={{ padding: "10px", color: "#4F4F4F" }}>
                            {new Date(leave.appliedAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </td>
                        <td style={{ padding: "10px", color: "#4F4F4F" }}>
                            {leave.leaveType}
                        </td>
                        <td style={{ padding: "10px", color: "#4F4F4F" }}>
                            {leave.approvedAt
                                ? new Date(leave.approvedAt).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })
                                : "-"}

                        </td>
                        {/* <td style={{ padding: "10px", color: "#4F4F4F" }}>  {new Date(leave.approvedAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}</td> */}
                        <td style={{ padding: "10px", color: "#4F4F4F" }}>{leave.reason}</td>

                        {/* <td style={{ padding: "10px", color: "#4F4F4F" }}>{leave.approvedBy}</td> */}
                        {/* <td>{leave.approvedBy ? leave.approvedBy.name : "-"}</td> */}
                        <td>
                            {leave.approvedBy ? (
                                <>
                                    {leave.approvedBy.name}
                                    <span style={{ marginLeft: "10px", fontStyle: "italic", color: "#888" }}>
                                        ({leave.approvedBy.userType})
                                    </span>
                                </>
                            ) : "-"}
                        </td>


                        <td
                            style={{
                                padding: "10px",
                                color: "#4F4F4F",
                                // textAlign: "center",
                            }}
                        >
                            <span
                                style={{
                                    padding: "5px 10px",
                                    borderRadius: "12px",
                                    color:
                                        leave.status === "Approved"
                                            ? "green"
                                            : leave.status === "Pending"
                                                ? "orange"
                                                : "red",
                                    border:
                                        leave.status === "Approved"
                                            ? "1px solid green"
                                            : leave.status === "Pending"
                                                ? "1px solid orange"
                                                : "1px solid red",
                                    fontWeight: "bold",
                                    display: "inline-block",
                                }}
                            >
                                {leave.status.toUpperCase()}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>

        );
    };

    const totalPages = Math.ceil(leaveData[activeTab].length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // main component
    return (
        <>
            <SnackbarProvider />
            <div className="container">
                <div
                    className="userHeader"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#28659C",
                        padding: "10px 20px",
                        color: "white",
                        borderRadius: "5px 5px 0 0",
                    }}
                >
                    <h5 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                        Employee Leave Management
                    </h5>
                    <div style={{ display: "flex" }}>
                        <button
                            style={{
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "5px 0 0 5px",
                                backgroundColor:
                                    activeTab === "approvedLeaves" ? "#7FC45B" : "#E8F4FC",
                                color:
                                    activeTab === "approvedLeaves" ? "#fff" : "#7094B0",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setActiveTab("approvedLeaves");
                                setCurrentPage(1); // Reset to first page
                            }}
                        >
                            Approved
                        </button>
                        <button
                            style={{
                                padding: "10px 20px",
                                border: "none",
                                backgroundColor:
                                    activeTab === "requestedLeaves" ? "#7FC45B" : "#E8F4FC",
                                color:
                                    activeTab === "requestedLeaves" ? "#fff" : "#7094B0",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setActiveTab("requestedLeaves");
                                setCurrentPage(1); // Reset to first page
                            }}
                        >
                            Pending
                        </button>
                        <button
                            style={{
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "0 5px 5px 0",
                                backgroundColor:
                                    activeTab === "rejectedLeaves" ? "#7FC45B" : "#E8F4FC",
                                color:
                                    activeTab === "rejectedLeaves" ? "#fff" : "#7094B0",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setActiveTab("rejectedLeaves");
                                setCurrentPage(1); // Reset to first page
                            }}
                        >
                            Rejected
                        </button>
                    </div>
                </div>
                <div className="mainwrapper ownerTeamContainer" style={{ marginTop: "-2px" }}>
                    <div style={{ width: "100%" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                alignItems: 'center',
                                textAlign: 'center'
                            }}
                        >
                            <thead style={{
                                alignItems: 'center',
                                textAlign: 'center'
                            }}>
                                <tr style={{
                                    backgroundColor: "#F5F7FA"
                                }}>
                                    {[
                                        "Name ↕",
                                        "Start Date",
                                        "End Date",
                                        "Request Date",
                                        "Leave Type ↕",
                                        "Approval Date",
                                        "Reason",
                                        "Approved By",
                                        "Status",
                                    ].map((header, index) => (
                                        <th
                                            key={index}
                                            style={{
                                                padding: "10px",
                                                textAlign: "center",
                                                color: "#4F4F4F",
                                                fontWeight: "500",
                                                borderBottom: "1px solid #E0E0E0",
                                            }}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            {renderLeaves(leaveData[activeTab])}
                        </table>
                        <div style={{ display: "end", alignItems: "center", justifyContent: 'flex-start', gap: '10px', marginTop: "20px" }}>
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                style={{ fontSize: '15px', padding: '5px 10px', borderRadius: '35%' }}
                            >
                                <i className="fas fa-arrow-left"></i> {/* Left arrow */}
                            </button>

                            <span style={{ flex: 1, textAlign: "center" }}>
                                {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                style={{ fontSize: '15px', padding: '5px 10px', borderRadius: '35%' }}
                            >
                                <i className="fas fa-arrow-right"></i> {/* Right arrow */}
                            </button>
                        </div>
                    </div>
                    {/* Pagination Controls */}
                </div>
                {/* Render Modal */}
                {isModalOpen && renderModal()}
            </div >
        </>
    );
};

export default OwnerTeam;










