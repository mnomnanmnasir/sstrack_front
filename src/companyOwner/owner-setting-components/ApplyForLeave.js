import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';


const OwnerTeam = () => {
    const navigate = useNavigate();
    const [leaveRequest, setLeaveRequest] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
    });
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const currentUser = JSON.parse(localStorage.getItem("items"));
    const userId = currentUser?.id || "";
    const userType = currentUser?.userType || "";
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Predefined reasons for leave
    const leaveReasons = [
        "Personal Reason",
        "Health Issues",
        "Family Emergency",
        "Vacation",
        "Other",
    ];

    // Fetch all leave requests for the current user
    const fetchLeaveRequests = async () => {
        try {
            // Debug localStorage data
            // console.log("LocalStorage items:", localStorage.getItem("items"));   

            const currentUser = JSON.parse(localStorage.getItem("items")) || {};
            const userId = currentUser?.id || currentUser?._id || "";

            if (!userId) {
                console.error("No userId found. Ensure the logged-in user data is correct.");
                return;
            }

            console.log("Current userId:", userId);

            const response = await axios.get(`${apiUrl}/superAdmin/getAllLeaveRequests`, { headers });
            const { requestedLeaves, approvedLeaves } = response.data;

            // Filter leave requests for the logged-in user only
            const userRequestedLeaves = requestedLeaves.filter((leave) => leave.userId === userId);
            const userApprovedLeaves = approvedLeaves.filter((leave) => leave.userId === userId);

            // Combine filtered data for the logged-in user
            const userLeaves = [...userRequestedLeaves, ...userApprovedLeaves];

            // Count the number of casual leaves and sick leaves
            const casualLeaveCount = userLeaves.filter((leave) => leave.leaveType === "casualLeaves").length;
            const sickLeaveCount = userLeaves.filter((leave) => leave.leaveType === "sickLeaves").length;

            // Log the counts to the console
            console.log(`Casual Leaves Count: ${casualLeaveCount}`);
            console.log(`Sick Leaves Count: ${sickLeaveCount}`);

            // Log filtered leaves for the specific user
            console.log(`Filtered leaves for userId (${userId}):`, userLeaves);

            setLeaveRequests(userLeaves); // Update state to display filtered data
        } catch (error) {
            console.error("Error fetching leave requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userType === "user") {
            fetchLeaveRequests();
        }
    }, [userType]);

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeaveRequest((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);    

        const { leaveType, startDate, endDate, reason } = leaveRequest;

        
        if (!leaveType || !startDate || !endDate || !reason.trim()) {
            enqueueSnackbar('Please fill in all fields before submitting', {
                variant: 'error',
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                },
            });
            setFormSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/timetrack/applyForLeave`, leaveRequest, {
                headers,
            });

            if (response.status === 200) {
                enqueueSnackbar('Leave request submitted successfully', { variant: 'success', anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                } });

                // Clear the form fields
                setLeaveRequest({
                    leaveType: "",
                    startDate: "",
                    endDate: "",
                    reason: "",
                });

                // Fetch updated leave requests
                fetchLeaveRequests();
            } else {
                enqueueSnackbar('Error submitting leave request', { variant: 'error', });
            }
        } catch (error) {
            enqueueSnackbar('Error submitting leave request:', error, { variant: 'error' });

        } finally {
            setFormSubmitting(false);
        }
    };

    return (
        <>
            <SnackbarProvider />
            <div className="container">
                {userType === "user" ? (
                    <>
                        <div className="userHeader">
                            <h5>Apply For Leave</h5>
                        </div>
                        <div
                            className="mainwrapper ownerTeamContainer"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingBottom: "90px",
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    
                                    padding: "20px",
                                    borderRadius: "10px",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",  }}>
                                    <h3
                                        style={{
                                            color: "#0E4772",
                                            fontWeight: "600",
                                            marginBottom: "20px",
                                            marginRight: "20%",
                                        }}
                                    >
                                        Apply for Leave
                                    </h3>
                                    {/* Buttons */}
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button
                                            style={{
                                                padding: "10px 20px",
                                                backgroundColor: "#F9F9F9",
                                                color: "#7FC45B",
                                                border: "1px solid #E0E0E0",
                                                borderRadius: "20px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "5px",
                                            }}
                                            onClick={() => {
                                                navigate('/user-setting');
                                            }}
                                        >
                                            <span style={{ fontSize: "16px" }}>×</span>
                                            Cancel
                                        </button>
                                        <button
                                            style={{
                                                padding: "10px 20px",
                                                backgroundColor: "#7FC45B",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "20px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                            }}
                                            onClick={handleFormSubmit}
                                            disabled={formSubmitting}
                                        >
                                            {formSubmitting ? "Applying..." : "Apply"}
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px"}}>
                                    {/* Leave Type */}
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                                        <label
                                            style={{
                                                width: "30%",
                                                fontWeight: "600",
                                                color: "#4F4F4F",
                                                fontSize: "14px",
                                                textAlign: "left",
                                            }}
                                        >
                                            LEAVE TYPE *
                                        </label>
                                        <select
                                            name="leaveType"
                                            value={leaveRequest.leaveType}
                                            onChange={handleInputChange}
                                            style={{
                                                width: "70%",
                                                padding: "10px",
                                                border: "1px solid #E0E0E0",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                color: "#4F4F4F",
                                            }}
                                        >
                                            <option value="" disabled>
                                                Select Type of Leave
                                            </option>
                                            <option value="casualLeaves">Casual Leave</option>
                                            <option value="sickLeaves">Sick Leave</option>
                                            <option value="annualLeaves">Annual Leave</option>
                                            <option value="bereavementLeaves">Bereavement Leave</option>
                                        </select>
                                    </div>

                                    {/* Period of Leave */}
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                                        <label
                                            style={{
                                                width: "30%",
                                                fontWeight: "600",
                                                color: "#4F4F4F",
                                                fontSize: "14px",
                                                textAlign: "left",
                                            }}
                                        >
                                            PERIOD OF LEAVE *
                                        </label>
                                        <div style={{ width: "70%", display: "flex", gap: "10px" }}>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={leaveRequest.startDate}
                                                onChange={handleInputChange}
                                                style={{
                                                    flex: "1",
                                                    padding: "10px",
                                                    border: "1px solid #E0E0E0",
                                                    borderRadius: "8px",
                                                    fontSize: "14px",
                                                    color: "#4F4F4F",
                                                }}
                                            />
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={leaveRequest.endDate}
                                                onChange={handleInputChange}
                                                style={{
                                                    flex: "1",
                                                    padding: "10px",
                                                    border: "1px solid #E0E0E0",
                                                    borderRadius: "8px",
                                                    fontSize: "14px",
                                                    color: "#4F4F4F",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Leave Reason */}
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                                        <label
                                            style={{
                                                width: "30%",
                                                fontWeight: "600",
                                                color: "#4F4F4F",
                                                fontSize: "14px",
                                                textAlign: "left",
                                            }}
                                        >
                                            LEAVE REASON *
                                        </label>
                                        <textarea
                                            name="reason"
                                            value={leaveRequest.reason}
                                            onChange={handleInputChange}
                                            placeholder="The concise explanation for leave, providing context for their absence"
                                            style={{
                                                width: "70%",
                                                padding: "10px",
                                                border: "1px solid #E0E0E0",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                color: "#4F4F4F",
                                                resize: "none",
                                                height: "100px",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>You are not authorized to submit leave requests.</p>
                )}
            </div>

        </>
    );
};

export default OwnerTeam;


