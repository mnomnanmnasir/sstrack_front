import React, { useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { Modal, Button, Form } from "react-bootstrap";
// import { FaUser } from "react-icons/fa";
import PersonIcon from "@mui/icons-material/Person";
import jwtDecode from "jwt-decode";
import Joyride from "react-joyride";
import ManualLeavesModal from "./ManualLeaves";
import { Link, useNavigate } from "react-router-dom";

const OwnerTeam = () => {
    const [run, setRun] = useState(true);
    const [stepIndex, setStepIndex] = useState(0);
    const [leaveData, setLeaveData] = useState({
        requestedLeaves: [],
        approvedLeaves: [],
        rejectedLeaves: [],
    });
    const [leaveCounts, setLeaveCounts] = useState({
        annualLeaves: 0,
        sickLeaves: 0,
        casualLeaves: 0,
        bereavementLeaves: 0
    });
    const [leavemodalCounts, setLeavemodalCounts] = useState({
        annualLeaves: 0,
        sickLeaves: 0,
        casualLeaves: 0,
        bereavementLeaves: 0
    });


    const [openManualModal, setOpenManualModal] = useState(false);

   
    const [allUsersList, setAllUsersList] = useState([]);

    const fetchAllUsersList = async () => {
        try {
            const userType = items?.userType;
            let endpoint = "";
            if (userType === "admin" || userType === "owner") {
                endpoint = `${apiUrl}/superAdmin/getAllUserLeaves`; // ✅ Admin + Owner only
            } else if (userType === "manager") {
                endpoint = `${apiUrl}/manager/getAllUserLeaves`;    // ✅ Manager specific
            } else {
                // Optional: handle unknown types
                console.warn("Unrecognized userType", userType);
            }

            const response = await axios.get(endpoint, { headers });
            const users = response.data?.data || [];
            console.log('Leave', response)
            // Optional: Filter out "owner" type here if needed
            setAllUsersList(users);
        } catch (error) {
            console.error("Error fetching all users for manual modal:", error);
        }
    };

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

    const steps = [
        {
            target: '#buttons',
            content: 'here you can see approved, rejected and pending leaves',
            continuous: true,
            disableBeacon: true,
        },
        {
            target: '#leaveCounts',
            content: 'here are alloted leave count from the company',
            continuous: true,
        },
        {
            target: '#allLeaves',
            content: 'here you can approve, reject and see your leave requests',
            continuous: true,
        },

    ];
    const handleJoyrideCallback = (data) => {
        const { action, index, status } = data;

        if (action === "next") {
            setStepIndex(index + 1);
        }
        if (status === "finished" || status === "skipped") {
            setRun(false); // End the tour when finished
        }
    };

    const [modalContent, setModalContent] = useState(""); // Content for the modal

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeavemodalCounts({ ...leavemodalCounts, [name]: value });
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
            !leavemodalCounts.sickLeaves ||
            !leavemodalCounts.casualLeaves ||
            !leavemodalCounts.bereavementLeaves ||
            !leavemodalCounts.annualLeaves
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
                leavemodalCounts,
                { headers }
            );



            // Handle success
            // alert("Leave allowance set successfully!");
            fetchLeaveData();
            enqueueSnackbar('Leave allowance set successfully!', {
                variant: 'success', anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
            // Reset the leaveData state to its initial values
            // setLeavemodalCounts({
            //     ...leavemodalCounts, // Preserve the original structure
            //     sickLeaves: "",
            //     casualLeaves: "",
            //     bereavementLeaves: "",
            //     annualLeaves: "",
            // });
      
            setModalOpen(false); // Close the modal
        } catch (error) {

            alert("Failed to Set Group Leave Policy. Please try again.");
        } finally {
            setIsSubmitting(false); // Stop loading
        }
    };
    console.log('userType', items?.userType)

    const fetchLeaveRequests = async () => {
        try {
            const userType = items?.userType;
            const endpoint = userType === 'manager'
                ? `${apiUrl}/manager/getAllLeaveRequests`
                : `${apiUrl}/superAdmin/getAllLeaveRequests`;

            const response = await axios.get(endpoint, { headers });

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
    const apiUrlforleaves = "https://myuniversallanguages.com:9093/api/v1/superAdmin/getAllUserLeaves"
    // Fetch leave data from API
    const fetchLeaveData = async () => {
        try {
            // const userType = items?.userType;

            const userType = items?.userType;
            // ❌ Owner: skip fetching/displaying their leaves
            // if (userType === "owner") {
            //     setLoading(false);
            //     return;
            // }

            const apiUrlForLeaves = userType === 'manager'
                ? "https://myuniversallanguages.com:9093/api/v1/manager/getAllUserLeaves"
                : "https://myuniversallanguages.com:9093/api/v1/superAdmin/getAllUserLeaves";

            const response = await axios.get(apiUrlForLeaves, { headers });
            const usersData = response.data?.data || [];

            const currentUser = jwtDecode(token);
            const userId = currentUser?.id || currentUser?._id;

            const userData = usersData.find((user) =>
                String(user.userId?._id || user.userId) === String(userId)
            );

            if (userData) {
                // Set allotted leave counts
                const { allottedLeaves = [] } = userData;
                const {
                    sickLeaves = 0,
                    casualLeaves = 0,
                    annualLeaves = 0,
                    bereavementLeaves = 0,
                } = allottedLeaves[0] || {};

                setLeaveCounts({ annualLeaves, sickLeaves, casualLeaves, bereavementLeaves });
                setLeavemodalCounts({ annualLeaves, sickLeaves, casualLeaves, bereavementLeaves });

                // ✅ Check for leaveHistory (in case of admin where leave requests not stored in leaveData)
                const leaveHistory = userData?.leaveHistory || [];

                if (leaveHistory.length > 0) {
                    const formattedLeaves = leaveHistory.map((leave) => ({
                        userId: userId,
                        userName: userData.userId.name,
                        leaveType: leave.leaveType || "N/A",
                        startDate: leave.startDate,
                        endDate: leave.endDate,
                        appliedAt: leave.appliedAt,
                        approvedAt: leave.approvedAt,
                        reason: leave.reason || "-",
                        approvedBy: {
                            name: leave.approvedBy?.name || "-",
                            userType: leave.approvedBy?.userType || "-"
                        },
                        status: leave.status || "Approved"
                    }));

                    setLeaveData((prev) => ({
                        ...prev,
                        approvedLeaves: [...prev.approvedLeaves, ...formattedLeaves],
                    }));
                } else {
                    // Inject dummy row if no history
                    const dummyLeave = {
                        userId: userId,
                        userName: userData.userId.name,
                        leaveType: "N/A",
                        startDate: "-",
                        endDate: "-",
                        appliedAt: "-",
                        approvedAt: "-",
                        reason: "No leave history found",
                        approvedBy: null,
                        status: "Approved",
                    };

                    setLeaveData((prev) => ({
                        ...prev,
                        approvedLeaves: [...prev.approvedLeaves, dummyLeave],
                    }));
                }
            }
        } catch (error) {
            console.error("❌ Error fetching leave data:", error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        localStorage.setItem("isUsehasVisitedLeave", "true");
        fetchLeaveRequests();
        fetchLeaveData();
        fetchAllUsersList(); // 👈 Add this
    }, []);

    // const getFilteredLeaves = (leaves) => {
    //     return leaves.filter((leave) => {
    //       const type = leave.userType?.toLowerCase() || leave.userId?.userType?.toLowerCase();

    //       // Allow current admin to see their own leaves
    //     //   if (type === "admin" && leave.userId === userId) return true;

    //     //   // Still hide other admins if needed
    //     //   if (type === "admin" && leave.userId !== userId) return false;

    //       //  Hide owners
    //       return type !== "owner";
    //     });
    //   };
    const getFilteredLeaves = (leaves) => {
        const loggedInUser = jwtDecode(token);
        const loggedInUserId = loggedInUser?.id || loggedInUser?._id;

        return leaves.filter((leave) => {
            const type = leave.userType?.toLowerCase() || leave.userId?.userType?.toLowerCase();
            const leaveUserId = leave.userId?._id || leave.userId;

            const isOwnLeave = String(leaveUserId) === String(loggedInUserId);

            if (isOwnLeave) return true; // ✅ Show admin's own leave

            if (type === "owner") return false; // ❌ Hide owner

            return true; // ✅ Show others
        });
    };



    // Usage in your component
    const filteredLeaves = getFilteredLeaves(leaveData[activeTab], searchQuery, currentUser);
    // const filteredLeaves = getFilteredLeaves(leaveData[activeTab]);

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
            fetchAllUsersList()
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
            fetchAllUsersList()
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

        const userLeaveData = leaveData?.approvedLeaves?.find(
            (leave) => leave.userId === selectedLeave.userId
        );

        console.log("Casual Leaves Count:", userLeaveData);

        return (
      
            <Modal show={isModalOpen} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: "#0E4772" }}>User Leave Request Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-between">
                        {/* Left Section - User Info & Leave Details */}
                        <div style={{ flex: 1 }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                                    <PersonIcon style={{ color: "#0E4772", fontSize: "24px" }} />
                                </div>
                                <strong style={{ fontSize: "18px", color: "#4F4F4F" }}>{selectedLeave?.userName}</strong>
                            </div>

                            {/* Leave Details */}
                            <div className="mt-3">
                                <p><strong>Start Date:</strong> {selectedLeave?.startDate ? new Date(selectedLeave.startDate).toLocaleDateString("en-GB") : "-"}</p>
                                <p><strong>End Date:</strong> {selectedLeave?.endDate ? new Date(selectedLeave.endDate).toLocaleDateString("en-GB") : "-"}</p>
                                <p><strong>Request Date:</strong> {selectedLeave?.appliedAt ? new Date(selectedLeave.appliedAt).toLocaleDateString("en-GB") : "-"}</p>
                                <p><strong>Leave Type:</strong> {selectedLeave?.leaveType || "-"}</p>
                                <p><strong>Approval Date:</strong> {selectedLeave?.approvedAt ? new Date(selectedLeave.approvedAt).toLocaleDateString("en-GB") : "-"}</p>
                                <p><strong>Reason:</strong> {selectedLeave?.reason || "-"}</p>
                                <p>
                                    <strong>{activeTab === "rejectedLeaves" ? "Rejected By:" : "Approved By:"}</strong>{" "}
                                    {selectedLeave?.approvedBy ? (
                                        <>
                                            {selectedLeave.approvedBy.name} <span className="text-muted">({selectedLeave.approvedBy.userType})</span>
                                        </>
                                    ) : "-"}
                                </p>
                            </div>
                        </div>

                        {/* Right Section - User Leave Count */}
                        <div style={{ flex: 1, paddingLeft: "20px", marginTop: '13%', borderLeft: "1px solid #ddd" }}>
                            <h4 style={{ color: "#0E4772", fontSize: "20px" }}>User Leave Count</h4>
                            <p><strong>Annual Leaves:</strong> {userLeaveData?.annualLeaves || 0}</p>
                            <p><strong>Casual Leaves:</strong> {userLeaveData?.casualLeaves || 0}</p>
                            <p><strong>Sick Leaves:</strong> {userLeaveData?.sickLeaves || 0}</p>
                            <p><strong>Breavement Leaves:</strong> {userLeaveData?.bereavementLeaves || 0}</p>
                        </div>
                    </div>
                    
                    {/* Rejection Reason */}
                    {activeTab === "requestedLeaves" && (
                        <div className="mt-3">
                            <p><strong>Enter Reason for Rejection:</strong></p>
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
                        </div>
                    )}
                </Modal.Body>

                {/* Modal Footer with Buttons */}
                <Modal.Footer style={{
                    borderTop: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    {selectedLeave?.status.toLowerCase() === "pending" ? (
                        <>
                            <div style={{ marginTop: "0px", textAlign: "center" }}>
                                <button variant="success"
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
                                    onClick={() => { handleAccept(selectedLeave.leaveId, selectedLeave.userId); closeModal(); }}>
                                    Accept
                                </button>
                                <Button variant="danger" style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#FF6F6F",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    textAlign: 'center'
                                }}
                                    onClick={() => { handleReject(selectedLeave.leaveId, selectedLeave.userId); closeModal(); }}>
                                    Reject
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: "center", alignItems: 'center' }}>

                            <Button variant="secondary"
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#7FC45B",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                    textAlign: 'center',
                                    cursor: "pointer",
                                }}
                                onClick={closeModal}>Done</Button>
                        </div>
                    )}
                </Modal.Footer>

                {/* Status Badge */}
                <span className="position-absolute top-0 end-0 m-3 px-3 py-1 border rounded text-danger bg-light">
                    {selectedLeave?.status?.toUpperCase()}
                </span>
            </Modal >

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
        // const filteredLeaves = leaves.filter((leave) => leave.userType?.toLowerCase() !== "owner");
        // const filteredLeaves = leaves.filter((leave) => {
        //     const type = leave.userType?.toLowerCase() || leave.userId?.userType?.toLowerCase();
        //     const leaveUserId = leave.userId?._id || leave.userId; // covers both object or string
        //     const isOwnLeave = String(leaveUserId) === String(items?._id); // current admin match

        //     // ✅ show if not owner OR if it's current user's own leave
        //     return type !== "owner" || isOwnLeave;
        // });
        // const filteredLeaves = leaves.filter((leave) => {
        //     const leaveUserType = (leave?.userType || leave?.userId?.userType || "").toLowerCase();
        //     const leaveUserId = leave?.userId?._id || leave?.userId;
        //     const loggedInUserId = items?._id;

        //     const isOwnLeave = String(leaveUserId) === String(loggedInUserId);
        //     return leaveUserType !== "owner" && (leaveUserType !== "admin" || isOwnLeave);
        // });        
        const filteredLeaves = leaves.filter((leave) => {
            const leaveUserType = (leave?.userType || leave?.userId?.userType || "").toLowerCase();
            const leaveUserId = leave?.userId?._id || leave?.userId;
            const loggedInUserId = items?.id || items?._id;

            const isOwnLeave = String(leaveUserId) === String(loggedInUserId);

            return isOwnLeave || (leaveUserType !== "owner" && leaveUserType !== "admin");
        });

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
            <>
                <tbody>
                    {currentItems.map((leave, index) => (
                        (leave?.userId?.userType || leave?.userType) !== "owner" && (
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
            </>
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
    console.log("API Response:", leaveCounts);
    // main component
    return (
        <>
            {items?._id === "679b223b61427668c045c659" && (
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
                    <div id='buttons' style={{ display: "flex" }}>
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
                                padding: "10px 10px",
                                backgroundColor: "#7FC45B",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "600",
                                // fontSize: '17px'
                            }}
                        >
                            Set Group Leave Policy
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
                        {(items?.userType === "owner" || items?.userType === "admin") && (
                            <Link to="/ownerManualLeave">
                                <button
                                    // onClick={() => setOpenManualModal(true)} // 👈 Open Manual Modal
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#7FC45B",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        marginLeft: "10px",
                                    }}
                                >
                                    Set Individual Leave
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
                <div
                    id="leaveCounts"
                    style={{
                        // padding: "10px 0px",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center", // Added space between elements for buttons
                        // gap: '20px',
                        // border: '1px solid #ddd', // Light border color
                        // borderRadius: '10px', // Rounded corners
                    }}
                >
                    <div

                        style={{
                            padding: "20px 30px",
                            backgroundColor: "#fff",
                            width: '99%',
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start", // Added space between elements for buttons
                            gap: '20px',
                            border: '1px solid #ddd', // Light border color
                            borderRadius: '10px', // Rounded corners
                        }}
                    >
                        <div style={{ fontWeight: '500', color: "#28659C", fontSize: '17px', }}>
                            Total Alloted leaves (by company):
                        </div>
                        <div>Sick leaves: {leaveCounts.sickLeaves}</div>
                        <div>Annual leaves: {leaveCounts.annualLeaves}</div>
                        <div>Casual leaves: {leaveCounts.casualLeaves}</div>
                        <div>Bereavement leaves: {leaveCounts.bereavementLeaves}</div>

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
                    <div

                        style={{ width: "100%" }}>
                        <table
                            id='allLeaves'
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                alignItems: 'center',
                                textAlign: 'center',
                                fontSize: '12px'
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
                            {/* {renderLeaves(filteredLeaves)} */}
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
                {/* Render Manual Leave Modal */}
                {/* <ManualLeavesModal
                    show={openManualModal}
                    handleClose={() => setOpenManualModal(false)}
                /> */}
                {/* <ManualLeavesModal
                    show={openManualModal}
                    handleClose={() => setOpenManualModal(false)}
                    userId={items?._id}
                    fetchLeaveRequests={fetchLeaveRequests}
                    // fetchAllUsers={fetchAllUsers}
                /> */}

                <ManualLeavesModal
                    show={openManualModal}
                    handleClose={() => setOpenManualModal(false)}
                    fetchLeaveRequests={fetchLeaveRequests}
                    allUsers={allUsersList} // 👈 Pass users as prop
                />

                {/* Modal */}
                <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: "#1E477A", fontWeight: "bold" }}>
                            Set Group Leave Policy
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
                                    value={leavemodalCounts.sickLeaves || ""} // Show existing value or 0
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
                                    value={leavemodalCounts.casualLeaves || ""} // Show existing value or 0
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
                                    value={leavemodalCounts.bereavementLeaves || ""} // Show existing value or 0
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
                                    value={leavemodalCounts.annualLeaves || ""} // Show existing value or 0
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
        </>
    );
};

export default OwnerTeam;
