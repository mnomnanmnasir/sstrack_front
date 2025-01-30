import React, { useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { Modal, Button, Form } from "react-bootstrap";
// import { FaUser } from "react-icons/fa";
import PersonIcon from "@mui/icons-material/Person";
import jwtDecode from "jwt-decode";
import UserHeader from "../../screen/component/userHeader";
import Footer from "../../screen/component/footer";

const OwnerTeam = () => {
    const [leaveData, setLeaveData] = useState({
        requestedLeaves: [],
        approvedLeaves: [],
        rejectedLeaves: [],
    });
    const [openApplyModal, setOpenApplyModal] = useState(false); // State for Apply Leave modal
    const [currentUser, setCurrentUser] = useState(null); // Store current user info
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("requestedLeaves");
    const [selectedLeave, setSelectedLeave] = useState(null); // To store the clicked leave
    const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
    const data = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [modalOpen, setModalOpen] = useState(false)
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const items = jwtDecode(JSON.stringify(token));
    // const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('items')) || {});
    const [pendingCount, setPendingCount] = useState(0); // New state for pending request count
    const [isSubmitting, setIsSubmitting] = useState(false); // For loading state during submission

    const [modalFields, setModalFields] = useState({
        userName: "",
        leaveType: "",
        startDate: "",
        endDate: "",
    }); // Holds modal data
    const [leaveFormData, setLeaveFormData] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
    });



    const [modalContent, setModalContent] = useState(""); // Content for the modal

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeaveData({ ...leaveData, [name]: value });
    };

    // Handle input changes in the form
    const handleLeaveInputChange = (e) => {
        const { name, value } = e.target;
        setLeaveFormData({ ...leaveFormData, [name]: value });
    };

    // Handle form submission
    const handleLeaveSubmit = async () => {

        // Validation: Check if all fields are filled
        if (!leaveFormData.leaveType || !leaveFormData.startDate || !leaveFormData.endDate || !leaveFormData.reason) {
            enqueueSnackbar("Please fill in all fields before submitting the leave application.", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
            return; // Stop the function if validation fails
        }

        // API Endpoint
        const apiUrl = "https://myuniversallanguages.com:9093/api/v1/timetrack/applyForLeave";

        // Payload from form state
        const payload = {
            leaveType: leaveFormData.leaveType,
            startDate: leaveFormData.startDate,
            endDate: leaveFormData.endDate,
            reason: leaveFormData.reason,
        };

        try {
            // Send POST request
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("API Response:", response.data);

            // Show success notification
            enqueueSnackbar("Leave application submitted successfully!", {
                variant: "success",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });

            // Close modal and reset form
            setLeaveFormData({
                leaveType: "",
                startDate: "",
                endDate: "",
                reason: "",
            });
            setOpenApplyModal(false);
        } catch (error) {
            // alert(error.response?.data?.message || "An error occurred.");
            const fullMessage = error.response?.data?.message || "An error occurred.";
            const formattedMessage = fullMessage.replace(
                /Leave already applied for the dates (.*?) \d{2}:\d{2}:\d{2} GMT.* to (.*?) \d{2}:\d{2}:\d{2} GMT.*/,
                "Leave already applied for the date $1 to $2"
            );
            enqueueSnackbar(formattedMessage, {
                variant: 'error',
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });

            // enqueueSnackbar(error.response?.data?.message, { variant: 'error' });
        }
    };


    const handleApply = async () => {
        // Check if all fields are filled
        if (
            !leaveData.sickLeaves ||
            !leaveData.casualLeaves ||
            !leaveData.bereavementLeaves ||
            !leaveData.annualLeaves
        ) {
            enqueueSnackbar("Please fill in all fields before applying.", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
            return; // Stop the submission
        }
        setIsSubmitting(true); // Start loading
        try {
            const token = localStorage.getItem("token"); // Replace with actual token retrieval method
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            // Send POST request
            const response = await axios.post(
                `${apiUrl}/superAdmin/addLeaves`,
                leaveData,
                { headers }
            );

            console.log("API Response:", response.data);

            // Handle success
            // alert("Leave allowance set successfully!");
            enqueueSnackbar('Leave allowance set successfully!', {
                variant: 'success', anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
            // Reset the leaveData state to its initial values
            // setLeaveData({
            //     ...leaveData, // Preserve the original structure
            //     sickLeaves: "",
            //     casualLeaves: "",
            //     bereavementLeaves: "",
            //     annualLeaves: "",
            // });
            setModalOpen(false); // Close the modal
        } catch (error) {
            console.error("Error setting leave allowance:", error);
            alert("Failed to set leave allowance. Please try again.");
        } finally {
            setIsSubmitting(false); // Stop loading
        }
    };

    const fetchLeaveRequests = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/superAdmin/getAllLeaveRequests`,
                { headers }
            );

            const { requestedLeaves = [], approvedLeaves = [], rejectedLeaves = [] } =
                response.data || {};

            // Extract and log leave details for each object
            approvedLeaves.forEach((leave) => {
                console.log("User Name:", leave.userName);
                console.log("Sick Leaves:", leave.sickLeaves);
                console.log("Casual Leaves:", leave.casualLeaves);
                console.log("Annual Leaves:", leave.annualLeaves);
                console.log("Bereavement Leaves:", leave.bereavementLeaves);
            });

            // Update state
            setLeaveData({ requestedLeaves, approvedLeaves, rejectedLeaves });
            setPendingCount(requestedLeaves.length);
        } catch (error) {
            console.error("Error fetching leave requests:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const getFilteredLeaves = (leaves, query, currentUser) => {
        return leaves
            .filter((leave) => {
                // Exclude leaves if the current user is an owner and it's their leave
                if (currentUser?.userType === "owner" && leave.userId === currentUser.userId) {
                    return false;
                }
                // Exclude leaves with userType as "owner"
                return leave.userType?.toLowerCase() !== "owner";
            })
            .filter((leave) => {
                // Filter based on the search query
                const lowerCaseQuery = query.toLowerCase();
                return (
                    leave.userName?.toLowerCase().includes(lowerCaseQuery) ||
                    leave.leaveType?.toLowerCase().includes(lowerCaseQuery) ||
                    leave.reason?.toLowerCase().includes(lowerCaseQuery) ||
                    leave.status?.toLowerCase().includes(lowerCaseQuery) ||
                    leave.approvedBy?.name?.toLowerCase().includes(lowerCaseQuery) ||
                    new Date(leave.startDate).toLocaleDateString("en-GB").includes(lowerCaseQuery) ||
                    new Date(leave.endDate).toLocaleDateString("en-GB").includes(lowerCaseQuery) ||
                    new Date(leave.appliedAt).toLocaleDateString("en-GB").includes(lowerCaseQuery)
                );
            });
    };

    // Usage in your component
    const filteredLeaves = getFilteredLeaves(leaveData[activeTab], searchQuery, currentUser);


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

    // Function to open modal
    const handleModalOpen = (content) => {
        setModalContent(content); // Set content for modal
        setModalOpen(true); // Open modal
    };

    // Function to close modal
    const handleModalClose = () => {
        setModalOpen(false); // Close modal
    };

    const [rejectionReason, setRejectionReason] = useState("");

    // Reject the leave request
    const handleReject = async (leaveId, userId) => {
        try {
            // console.log("Sending rejection payload:", {
            //     userId,
            //     leaveId,
            //     status: "Rejected",
            //     reasonOfReject: rejectionReason, // Ensure this field is sent
            // });

            const payload = {
                userId: userId,
                leaveId: leaveId,
                status: "Rejected",
                rejectReason: rejectionReason,
            };

            console.log("Payload being sent:", payload);

            const response = await axios.post(`${apiUrl}/superAdmin/approveLeaves`, payload, { headers });
            console.log("API Response:", response.data);

            console.log("Leave request Rejected:", response.data);
            enqueueSnackbar('Leave request accepted successfully', {
                variant: 'success', anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
            fetchLeaveRequests(); // Refresh the leave requests data
            setRejectionReason(""); // Clear the rejection reason input
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

    const renderOpenModal = () => {
        if (!isModalOpen) return null; // Only render modal when isModalOpen is true

        return (
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#fff",
                    padding: "20px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px",
                    zIndex: 1000,
                }}
            >
                <h3 style={{ margin: 0 }}>Modal Title</h3>
                <p>This is the content of the modal.</p>
                <button
                    onClick={() => setModalOpen(false)} // Close modal on click
                    style={{
                        marginTop: "10px",
                        padding: "10px 20px",
                        backgroundColor: "#FF6F6F",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                >
                    Close
                </button>
            </div>
        );
    };

    //  modal
    const renderModal = () => {
        if (!selectedLeave) return null;

        const userLeaveData = leaveData.approvedLeaves.find(
            (leave) => leave.userId === selectedLeave.userId
        );

        console.log("Casual Leaves Count:", userLeaveData);

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
                            <PersonIcon style={{ color: "#0E4772", fontSize: "24px" }} />
                            {/* <FaUser style={{ color: "#0E4772", fontSize: "24px" }} /> */}
                            {/* 👤 */}
                        </div>
                        <strong style={{ fontSize: "18px", color: "#4F4F4F" }}>
                            {selectedLeave.userName}
                        </strong>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "flex-start",
                                gap: "20px", // Adds space between sections
                                marginBottom: "20px",
                            }}
                        >
                            {/* Left Side: Leave Details */}
                            <div style={{ flex: 1 }}>
                                <p>
                                    <strong>Start Date:</strong>{" "}
                                    {/* {new Date(selectedLeave.startDate).toLocaleDateString("en-GB")} */}
                                    {selectedLeave.startDate
                                        ? new Date(selectedLeave.startDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })
                                        : "-"}
                                </p>
                                <p>
                                    <strong>End Date:</strong>{" "}
                                    {selectedLeave.endDate
                                        ? new Date(selectedLeave.endDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })
                                        : "-"}
                                    {/* {new Date(selectedLeave.endDate).toLocaleDateString("en-GB")} */}
                                </p>
                                <p>
                                    <strong>Request Date:</strong>{" "}
                                    {selectedLeave.appliedAt
                                        ? new Date(selectedLeave.appliedAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })
                                        : "-"}
                                    {/* {new Date(selectedLeave.appliedAt).toLocaleDateString("en-GB")} */}
                                </p>
                                <p>
                                    <strong>Leave Type:</strong> {selectedLeave.leaveType}
                                </p>
                                <p>
                                    <strong>Approval Date:</strong>{" "}
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
                                    <strong>{activeTab === "rejectedLeaves" ? "Rejected By:" : "Approved By:"}</strong>{" "}
                                    {selectedLeave.approvedBy ? (
                                        <>
                                            {selectedLeave.approvedBy.name}
                                            <span
                                                style={{
                                                    marginLeft: "10px",
                                                    fontStyle: "italic",
                                                    color: "#888",
                                                }}
                                            >
                                                ({selectedLeave.approvedBy.userType})
                                            </span>
                                        </>
                                    ) : (
                                        "-"
                                    )}
                                </p>
                            </div>

                            {/* Center Line */}
                            <div
                                style={{
                                    width: "1px", // Thin vertical line
                                    backgroundColor: "#D9D9D9", // Gray color
                                    alignSelf: "stretch", // Ensures it stretches to the height of its parent container
                                }}
                            ></div>

                            {/* Right Side: Leave Counts */}
                            <div style={{ flex: 1 }}>
                                <h4 style={{ color: "#0E4772", marginBottom: "10px", fontSize: "20px" }}>
                                    User Leave Count
                                </h4>
                                <p>
                                    {/* {userLeaveData.sickLeaves || 0} */}
                                    <strong>Annual Leaves:</strong> {userLeaveData.annualLeaves || 0}
                                </p>
                                <p>

                                    <strong>Casual Leaves:</strong> {userLeaveData.casualLeaves || 0}
                                </p>
                                <p>
                                    <strong>Sick Leaves:</strong> {userLeaveData.sickLeaves || 0}
                                </p>
                                <p>
                                    <strong>Bereavement Leaves:</strong> {userLeaveData.bereavementLeaves || 0}
                                </p>
                            </div>
                        </div>

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
                                    value={rejectionReason} // Bind the value to the state
                                    onChange={(e) => setRejectionReason(e.target.value)} // Update state on input
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
            </div >

        );
    };

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
        const filteredLeaves = leaves.filter((leave) => leave.userType?.toLowerCase() !== "owner");

        if (!filteredLeaves || filteredLeaves.length === 0) {
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
        const currentItems = filteredLeaves.slice(indexOfFirstItem, indexOfLastItem);

        return (
            <tbody>
                {currentItems.map((leave, index) => (
                    leave.userType !== "owner" && ( // Additional check to ensure no owner leaves are displayed
                        <tr
                            key={index}
                            style={{
                                borderBottom: "1px solid #E0E0E0",
                                backgroundColor: "#FFF",
                                cursor: "pointer", // Indicate row is clickable
                            }}
                            onClick={() => handleRowClick(leave)} // Handle row click
                        >
                            <td style={{ padding: "10px", color: "#4F4F4F", fontWeight: "400" }}>
                                {leave.userType !== "owner" && (
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
                                            <PersonIcon style={{ color: "#0E4772", fontSize: "24px" }} />
                                        </span>
                                        <span style={{ flexGrow: 1, textAlign: "left" }}>
                                            {leave.userName}
                                        </span>
                                    </div>
                                )}
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
                            <td style={{ padding: "10px", color: "#4F4F4F" }}>{leave.leaveType}</td>
                            <td style={{ padding: "10px", color: "#4F4F4F" }}>
                                {leave.approvedAt
                                    ? new Date(leave.approvedAt).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })
                                    : "-"}
                            </td>
                            <td style={{ padding: "10px", color: "#4F4F4F" }}>{leave.reason}</td>
                            <td>
                                {leave.approvedBy ? (
                                    <>
                                        {leave.approvedBy.name}
                                        <span
                                            style={{
                                                marginLeft: "10px",
                                                fontStyle: "italic",
                                                color: "#888",
                                            }}
                                        >
                                            ({leave.approvedBy.userType})
                                        </span>
                                    </>
                                ) : "-"}
                            </td>
                            <td
                                style={{
                                    padding: "10px",
                                    color: "#4F4F4F",
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
                    )
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
        <UserHeader />
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
                        {/* <button
                                style={{
                                    padding: "10px 20px",
                                    border: "none",
                                    backgroundColor:
                                        activeTab === "requestedLeaves" ? "#7FC45B" : "#E8F4FC",
                                    color:
                                        activeTab === "requestedLeaves" ? "#fff" : "#7094B0",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    position: "relative", // Added to position the count correctly
                                }}
                                onClick={() => {
                                    setActiveTab("requestedLeaves");
                                    setCurrentPage(1); // Reset to first page
                                }}
                            >
                                Pending
                                {pendingCount > 0 && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "-5px",
                                            right: "-10px",
                                            backgroundColor: "red",
                                            color: "white",
                                            borderRadius: "50%",
                                            padding: "2px 8px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {pendingCount}
                                    </span>
                                )}
                            </button> */}

                        <button
                            style={{
                                padding: "10px 20px",
                                border: "none",
                                backgroundColor: activeTab === "requestedLeaves" ? "#7FC45B" : "#E8F4FC",
                                color: activeTab === "requestedLeaves" ? "#fff" : "#7094B0",
                                fontWeight: "600",
                                cursor: "pointer",
                                position: "relative",
                            }}
                            onClick={() => {
                                setActiveTab("requestedLeaves");
                                setCurrentPage(1); // Reset to first page
                            }}
                        >
                            Pending
                            <sup
                                style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    // borderRadius: "50%",
                                    // position: "absolute",
                                    // top: "-5px",
                                    // right: "-10px",
                                    color: "#28659C",
                                    marginLeft: "5px",
                                    // backgroundColor: "#28659C",
                                }}
                            >
                                {pendingCount || 0}
                            </sup>
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

                {/* Search Filter */}
                <div
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between", // Added space between elements for buttons
                        gap: '20px',
                    }}
                >
                    <div style={{ fontWeight: '500', color: "#28659C", fontSize: '17px', }}>
                        Total Leave Requests
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, type, or status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            padding: "10px",
                            border: "1px solid #E0E0E0",
                            borderRadius: "10px", // Increased border radius for a rounded look
                            marginRight: "10px",
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: "0 auto", // Centers the input box horizontally
                            width: '40%' // Reduced width
                        }}
                    />
                    <div style={{ display: "flex", gap: "10px" }}> {/* Container for buttons */}
                        {/* <button
                            onClick={() => setModalOpen(true)} // Opens the modal
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
                            Button 1
                        </button> */}
                        <button
                            onClick={() => setModalOpen(true)} // Opens the modal
                            style={{
                                padding: "5px 10px",
                                backgroundColor: "#7FC45B",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "600",
                                // fontSize: '17px'
                            }}
                        >
                            Set Leave Allowances
                        </button>
                        {items?.userType !== "owner" && (
                            <button
                                onClick={() => setOpenApplyModal(true)} // Opens the modal
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#7FC45B",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    // fontSize: '17px'
                                }}
                            >
                                Apply Leave
                            </button>
                        )}
                    </div>
                    
                </div>

                {/* Apply Leave Modal */}
                {/* Apply Leave Modal */}
                <Modal show={openApplyModal} onHide={() => setOpenApplyModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Apply for Leave</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Leave Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="leaveType"
                                    value={leaveFormData.leaveType}
                                    onChange={handleLeaveInputChange}
                                >
                                    <option value="" disabled>
                                        Select Type of Leave
                                    </option>
                                    <option value="casualLeaves">Casual Leave</option>
                                    <option value="sickLeaves">Sick Leave</option>
                                    <option value="annualLeaves">Annual Leave</option>
                                    <option value="bereavementLeaves">Bereavement Leave</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="startDate"
                                    value={leaveFormData.startDate}
                                    onChange={handleLeaveInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="endDate"
                                    value={leaveFormData.endDate}
                                    onChange={handleLeaveInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Reason</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="reason"
                                    value={leaveFormData.reason}
                                    onChange={handleLeaveInputChange}
                                    placeholder="Enter your reason for leave"
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    {/* <Modal.Footer> */}
                    {/* <Button
                            variant="secondary"
                            onClick={() => setOpenApplyModal(false)}
                        >
                            Close
                        </Button> */}
                    {/* <Button
                            variant="primary"
                            onClick={handleLeaveSubmit} // Submit form
                        >
                            Submit
                        </Button> */}
                    {/* </Modal.Footer> */}
                    <Modal.Footer>
                        <Button
                            variant="success"
                            onClick={handleLeaveSubmit}
                            disabled={isSubmitting} // Disable button during submission
                            style={{
                                backgroundColor: "#7FC45B",
                                border: "none",
                                width: "100%",
                                padding: "10px",
                                fontWeight: "bold",
                                fontSize: "16px",
                            }}
                        >
                            {isSubmitting ? "Submitting..." : "Apply"}
                        </Button>
                    </Modal.Footer>
                </Modal>


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
                                        // activeTab === "rejectedLeaves" ? "Rejection By" : "Approval Date",
                                        "Approval Date",
                                        "Reason",
                                        activeTab === "rejectedLeaves" ? "Rejected By" : "Approved By",
                                        // "Approved By",
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
                            {/* {renderLeaves(leaveData[activeTab])} */}
                            {renderLeaves(filteredLeaves)}
                        </table>

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
                    {/* Pagination Controls */}
                </div>
                {/* Render Modal */}
                {isModalOpen && renderModal()}

                {/* Modal */}
                <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: "#1E477A", fontWeight: "bold" }}>
                            Set Leave Allowance
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {/* Sick Leaves */}
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: "bold", color: "#1E477A" }}>
                                    SICK LEAVES
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    name="sickLeaves"
                                    value={leaveData.sickLeaves || 0} // Show existing value or 0
                                    onChange={handleInputChange}
                                    placeholder="Enter Sick Leaves"
                                />
                            </Form.Group>

                            {/* Casual Leaves */}
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: "bold", color: "#1E477A" }}>
                                    CASUAL LEAVES
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    name="casualLeaves"
                                    value={leaveData.casualLeaves || 0} // Show existing value or 0
                                    onChange={handleInputChange}
                                    placeholder="Enter Casual Leaves"
                                />
                            </Form.Group>

                            {/* Bereavement Leaves */}
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: "bold", color: "#1E477A" }}>
                                    BEREAVEMENT LEAVE
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    name="bereavementLeaves"
                                    value={leaveData.bereavementLeaves || 0} // Show existing value or 0
                                    onChange={handleInputChange}
                                    placeholder="Enter Bereavement Leaves"
                                />
                            </Form.Group>

                            {/* Annual Leaves */}
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: "bold", color: "#1E477A" }}>
                                    ANNUAL LEAVES
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    name="annualLeaves"
                                    value={leaveData.annualLeaves || 0} // Show existing value or 0
                                    onChange={handleInputChange}
                                    placeholder="Enter Annual Leaves"
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="success"
                            onClick={handleApply}
                            disabled={isSubmitting} // Disable button during submission
                            style={{
                                backgroundColor: "#7FC45B",
                                border: "none",
                                width: "100%",
                                padding: "10px",
                                fontWeight: "bold",
                                fontSize: "16px",
                            }}
                        >
                            {isSubmitting ? "Submitting..." : "Apply"}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* {modalOpen && renderOpenModal()} */}

            </div >
            <Footer />
        </>
    );
};

export default OwnerTeam;
