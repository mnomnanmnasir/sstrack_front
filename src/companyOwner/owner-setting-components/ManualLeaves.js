import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import jwtDecode from "jwt-decode";

// const ManualLeaveModal = ({ show, handleClose, userId, fetchLeaveRequests }) => {
const ManualLeaveModal = ({ show, handleClose, fetchLeaveRequests, allUsers }) => {
    // const [manualLeaveData, setManualLeaveData] = useState({
    //     leaveType: "",
    //     startDate: "",
    //     endDate: "",
    //     reason: "",
    // });
    const [manualLeaveData, setManualLeaveData] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
    });

    // Reset form when modal opens
    useEffect(() => {
        if (show) {
            setManualLeaveData({
                leaveType: "",
                startDate: "",
                endDate: "",
                reason: "",
            });
        }
    }, [show]);

    let token = localStorage.getItem('token');
    const items = jwtDecode(JSON.stringify(token));

    const [selectedUserEmail, setSelectedUserEmail] = useState("");
    const [allUser, setAllUsers] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setManualLeaveData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const apiUrl = process.env.REACT_APP_API_URL;

    let headers = {
        Authorization: 'Bearer ' + token,
    }

    const fetchAllUsers = async () => {

        try {
            const endpoint = items?.userType === 'manager'
                ? `${apiUrl}/manager/getAllUserLeaves`
                : `${apiUrl}/superAdmin/getAllUserLeaves`;

            const response = await axios.get(endpoint, { headers });
            const users = response.data?.data || [];

            setAllUsers(users);
        } catch (error) {
            console.error("Error fetching user list:", error);
        }
    };

    useEffect(() => {
        if (items?.userType !== 'user') {
            fetchAllUsers();
        }
    }, []);


    const handleSubmit = async () => {
        const payload = {
            ...manualLeaveData,
        };

        // Validation
        if (!payload.leaveType || !payload.startDate || !payload.endDate || !payload.reason) {
            enqueueSnackbar("Please fill in all fields.", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
            return;
        }

        try {
            const response = await axios.post(
                `${apiUrl}/superAdmin/addmanualLeave`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            enqueueSnackbar("Manual leave added successfully!", {
                variant: "success",
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });

            fetchLeaveRequests(); // Refresh data
            handleClose(); // Close modal
        } catch (error) {
            const errMsg = error.response?.data?.message || "Something went wrong!";
            enqueueSnackbar(errMsg, {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Manual Leave</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Leave Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="leaveType"
                            value={manualLeaveData.leaveType}
                            onChange={handleChange}
                        >
                            <option value="">Select Leave Type</option>
                            <option value="casualLeaves">Casual Leave</option>
                            <option value="sickLeaves">Sick Leave</option>
                            <option value="annualLeaves">Annual Leave</option>
                            <option value="bereavementLeaves">Bereavement Leave</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Select User</Form.Label>
                        <Form.Control
                            as="select"
                            value={manualLeaveData.userId || ""}
                            name="userId"
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select a user</option>
                            {allUsers
                                .filter(user => user?.userId?.userType?.toLowerCase() !== "owner")
                                .map((user, index) => (
                                    <option key={index} value={user?.userId?._id}>
                                        {user?.userId?.name} ({user?.userId?.email})
                                    </option>
                                ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="startDate"
                            value={manualLeaveData.startDate}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="endDate"
                            value={manualLeaveData.endDate}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Reason</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="reason"
                            value={manualLeaveData.reason}
                            onChange={handleChange}
                            placeholder="Enter your reason for leave"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button> */}
                <Button
                    variant="success"
                    style={{ backgroundColor: "#7FC45B", border: "none" }}
                    onClick={handleSubmit}
                >
                    Approve
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ManualLeaveModal;
