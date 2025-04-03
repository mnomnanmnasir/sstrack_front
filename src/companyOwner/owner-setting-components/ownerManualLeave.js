import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import jwtDecode from "jwt-decode";


const OwnerTeam = () => {
    const navigate = useNavigate();
    const [leaveRequest, setLeaveRequest] = useState({
        userId: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
    });

    const [leaveCounts, setLeaveCounts] = useState({
        annualLeaves: 0,
        sickLeaves: 0,
        casualLeaves: 0,
        bereavementLeaves: 0
    });
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const [remainingLeaves, setRemainingLeaves] = useState([]);

    useEffect(() => {
        console.log("Selected UserId", leaveRequest.userId);
        console.log("Remaining Leaves ", remainingLeaves);
    }, [leaveRequest.userId, remainingLeaves]);

    const token = localStorage.getItem("token");
    const items = jwtDecode(JSON.stringify(token));

    const currentUser = jwtDecode(JSON.stringify(token));
    const userId = currentUser?.id || "";
    const userType = currentUser?.userType || "";
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const [selectedUserLeaves, setSelectedUserLeaves] = useState({
        annualLeaves: 0,
        sickLeaves: 0,
        casualLeaves: 0,
        bereavementLeaves: 0
    });

    // Predefined reasons for leave
    const leaveReasons = [
        "Personal Reason",
        "Health Issues",
        "Family Emergency",
        "Vacation",
        "Other",
    ];

    useEffect(() => {
        if (leaveRequest.userId && remainingLeaves.length > 0) {
            const userLeaves = remainingLeaves.find(
                (item) => item?.userId?._id?.toString() === leaveRequest.userId?.toString()
            );

            if (userLeaves) {
                setSelectedUserLeaves({
                    annualLeaves: userLeaves.annualLeaves || 0,
                    sickLeaves: userLeaves.sickLeaves || 0,
                    casualLeaves: userLeaves.casualLeaves || 0,
                    bereavementLeaves: userLeaves.bereavementLeaves || 0,
                });
            } else {
                setSelectedUserLeaves({
                    annualLeaves: 0,
                    sickLeaves: 0,
                    casualLeaves: 0,
                    bereavementLeaves: 0,
                });
            }
        } else {
            setSelectedUserLeaves({
                annualLeaves: 0,
                sickLeaves: 0,
                casualLeaves: 0,
                bereavementLeaves: 0,
            });
        }
    }, [leaveRequest.userId, remainingLeaves]);

    // const [remainingLeaves, setRemainingLeaves] = useState([]);

    const apiUrlLeaves = "https://myuniversallanguages.com:9093/api/v1/timetrack/getAllLeaves";

    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserEmail, setSelectedUserEmail] = useState("");

    const fetchAllUsers = async () => {
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

            setAllUsers(users);
        } catch (error) {
            console.error("Error fetching user list:", error);
        }
    };

    // Fetch leave data from API
    const fetchLeaveData = async () => {
        const response = await axios.get(apiUrlLeaves, { headers });
        const responseData = response?.data;

        if (responseData?.success) {
            const remaining = responseData?.remainingLeaves || [];
            setRemainingLeaves(remaining);
        }
    };

    useEffect(() => {
        fetchAllUsers();
        fetchLeaveData(); // ✅ Call this too
    }, []);


    // Fetch all leave requests for the current user
    // const fetchLeaveRequests = async () => {
    //     try {
    //         // Debug localStorage data
    //         // console.log("LocalStorage items:", localStorage.getItem("items"));   

    //         const currentUser = jwtDecode(JSON.stringify(token)) || {};
    //         const userId = currentUser?.id || currentUser?._id || "";

    //         if (!userId) {
    //             console.error("No userId found. Ensure the logged-in user data is correct.");
    //             return;
    //         }

    //         console.log("Current userId:", userId);

    //         const response = await axios.get(`${apiUrl}/superAdmin/getAllLeaveRequests`, { headers });
    //         const { requestedLeaves, approvedLeaves } = response.data;

    //         // Filter leave requests for the logged-in user only
    //         const userRequestedLeaves = requestedLeaves.filter((leave) => leave.userId === userId);
    //         const userApprovedLeaves = approvedLeaves.filter((leave) => leave.userId === userId);

    //         // Combine filtered data for the logged-in user
    //         const userLeaves = [...userRequestedLeaves, ...userApprovedLeaves];

    //         // Count the number of casual leaves and sick leaves
    //         const casualLeaveCount = userLeaves.filter((leave) => leave.leaveType === "casualLeaves").length;
    //         const sickLeaveCount = userLeaves.filter((leave) => leave.leaveType === "sickLeaves").length;

    //         // Log the counts to the console
    //         console.log(`Casual Leaves Count: ${casualLeaveCount}`);
    //         console.log(`Sick Leaves Count: ${sickLeaveCount}`);

    //         // Log filtered leaves for the specific user
    //         console.log(`Filtered leaves for userId (${userId}):`, userLeaves);

    //         setLeaveRequests(userLeaves); // Update state to display filtered data
    //     } catch (error) {
    //         console.error("Error fetching leave requests:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     if (userType === "user") {
    //         fetchLeaveRequests();
    //     }
    // }, [userType]);

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

        const { leaveType, startDate, endDate, reason, userId } = leaveRequest;

        if (!leaveType || !startDate || !endDate || !reason.trim() || !userId) {
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
            const response = await axios.post(
                `${apiUrl}/superAdmin/addmanualLeave`,
                leaveRequest,
                { headers }
            );

            if (response.status === 200 || response.status === 201) {
                enqueueSnackbar('Manual leave submitted successfully', {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });

                // Clear the form
                setLeaveRequest({
                    leaveType: "",
                    startDate: "",
                    endDate: "",
                    reason: "",
                    userId: ""
                });

                // Refresh user leaves list
                fetchAllUsers();
            } else {
                enqueueSnackbar('Failed to submit manual leave', { variant: 'error' });
            }
        } catch (error) {
            console.error("API error:", error);
            enqueueSnackbar(error.response?.data?.message || 'Something went wrong', {
                variant: 'error',
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
        } finally {
            setFormSubmitting(false);
        }
    };
    useEffect(() => {
        const fetchSelectedUserLeaves = async () => {
            if (!leaveRequest.userId) {
                setSelectedUserLeaves({
                    annualLeaves: 0,
                    sickLeaves: 0,
                    casualLeaves: 0,
                    bereavementLeaves: 0,
                });
                return;
            }

            try {
                const response = await axios.get(
                    `${apiUrl}/superAdmin/getAllottedLeavOfUser/${leaveRequest.userId}`,
                    { headers }
                );

                const leavesArray = response.data?.remainingLeaves;

                if (Array.isArray(leavesArray) && leavesArray.length > 0) {
                    const leaves = leavesArray[0]; // ⬅️ FIRST object of array

                    setSelectedUserLeaves({
                        annualLeaves: leaves.annualLeaves || 0,
                        sickLeaves: leaves.sickLeaves || 0,
                        casualLeaves: leaves.casualLeaves || 0,
                        bereavementLeaves: leaves.bereavementLeaves || 0,
                    });
                } else {
                    setSelectedUserLeaves({
                        annualLeaves: 0,
                        sickLeaves: 0,
                        casualLeaves: 0,
                        bereavementLeaves: 0,
                    });
                }
            } catch (error) {
                console.error("Error fetching user leaves:", error);
                setSelectedUserLeaves({
                    annualLeaves: 0,
                    sickLeaves: 0,
                    casualLeaves: 0,
                    bereavementLeaves: 0,
                });
            }
        };

        fetchSelectedUserLeaves();
    }, [leaveRequest.userId]);



    return (
        <>
            <SnackbarProvider />
            <div className="container">
                {(userType === "owner" || userType == "admin") ? (
                    <>
                        <div className="userHeader">
                            <h5>Employee Leave Management</h5>
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
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                                    <h3
                                        style={{
                                            color: "#0E4772",
                                            fontWeight: "600",
                                            marginBottom: "20px",
                                            marginRight: "20%",
                                        }}
                                    >
                                        Add Manual Leave
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
                                                navigate('/leave-management');
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
                                            {formSubmitting ? "loading" : "Approve"}
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
                                    {/* Select User Dropdown (For Owners Only) */}
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
                                            SELECT USER *
                                        </label>
                                        <select
                                            name="userId"
                                            value={leaveRequest.userId || ""}
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
                                                Select a user
                                            </option>
                                            {/* {allUsers
                                                .filter((user) => user?.userId?.userType?.toLowerCase() !== "owner") // exclude owners
                                                .map((user, index) => (
                                                    <option key={index} value={user?.userId?._id}>
                                                        {user?.userId?.name} ({user?.userId?.email})
                                                    </option>
                                                ))} */}
                                            {allUsers
                                                .filter((user) => {
                                                    const userData = user?.userId;
                                                    const targetType = userData?.userType?.toLowerCase();

                                                    // Exclude nulls
                                                    if (!userData || !userData._id || !userData.name || !userData.email) return false;

                                                    // ✅ If I'm admin, don't show myself in dropdown
                                                    if (userType === "admin" && userData._id === userId) return false;

                                                    // ✅ If I'm admin, hide ALL admins and owners (only show employees)
                                                    if (userType === "admin" && ["admin", "owner"].includes(targetType)) return false;

                                                    // ✅ If I'm owner, just hide other owners (admins should show)
                                                    if (userType === "owner" && targetType === "owner") return false;

                                                    return true;
                                                })
                                                .map((user, index) => (
                                                    <option key={index} value={user.userId._id}>
                                                        {user.userId.name} ({user.userId.email})
                                                    </option>
                                                ))}

                                            {/* {allUsers
                                                .filter((user) =>
                                                    user?.userId &&
                                                    user?.userId?.userType?.toLowerCase() !== "owner" &&
                                                    user?.userId?._id &&
                                                    user?.userId?.name &&
                                                    user?.userId?.email
                                                )
                                                .map((user, index) => (
                                                    <option key={index} value={user.userId._id}>
                                                        {user.userId.name} ({user.userId.email})
                                                    </option>
                                                ))} */}

                                        </select>
                                    </div>
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
                                    {/* REMAINING LEAVES - INLINE STYLE LIKE SCREENSHOT */}
                                    {/* <p style={{ margin: 0, gap: "5px", padding: "10px", border: "1px solid #000" }}>
                                        <b>Remaining Leaves:</b> Annual Leaves: {leaveCounts.annualLeaves}, Sick Leaves: {leaveCounts.sickLeaves}, Casual Leaves: {leaveCounts.casualLeaves}, bereavement Leaves: {leaveCounts.bereavementLeaves}
                                    </p> */}
                                    {/* {leaveRequest.userId && ( */}
                                    {/* <div style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "20px" }}> */}
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>

                                        <label style={{
                                            width: "30%",
                                            fontWeight: "600",
                                            color: "#4F4F4F",
                                            fontSize: "14px",
                                            textAlign: "left",
                                        }}>
                                            REMAINING LEAVES *
                                        </label>

                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                            <span style={{ fontWeight: "500", color: "#4F4F4F", fontSize: "14px" }}>CASUAL</span>
                                            <input
                                                value={selectedUserLeaves.casualLeaves}
                                                readOnly
                                                style={{
                                                    width: "60px",
                                                    padding: "8px",
                                                    borderRadius: "8px",
                                                    border: "1px solid #E0E0E0",
                                                    textAlign: "center"
                                                }}
                                            />

                                            <span style={{ fontWeight: "500", color: "#4F4F4F", fontSize: "14px" }}>SICK</span>
                                            <input
                                                value={selectedUserLeaves.sickLeaves}
                                                readOnly
                                                style={{
                                                    width: "60px",
                                                    padding: "8px",
                                                    borderRadius: "8px",
                                                    border: "1px solid #E0E0E0",
                                                    textAlign: "center"
                                                }}
                                            />

                                            <span style={{ fontWeight: "500", color: "#4F4F4F", fontSize: "14px" }}>ANNUAL</span>
                                            <input
                                                value={selectedUserLeaves.annualLeaves}
                                                readOnly
                                                style={{
                                                    width: "60px",
                                                    padding: "8px",
                                                    borderRadius: "8px",
                                                    border: "1px solid #E0E0E0",
                                                    textAlign: "center"
                                                }}
                                            />

                                            <span style={{ fontWeight: "500", color: "#4F4F4F", fontSize: "14px" }}>BEREAVEMENT</span>
                                            <input
                                                value={selectedUserLeaves.bereavementLeaves}
                                                readOnly
                                                style={{
                                                    width: "60px",
                                                    padding: "8px",
                                                    borderRadius: "8px",
                                                    border: "1px solid #E0E0E0",
                                                    textAlign: "center"
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* )} */}

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
                                                    fontSize: " 14px",
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


