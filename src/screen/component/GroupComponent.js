import axios from "axios";
import React, { useEffect, useState } from "react";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import archive from "../../images/Archive.webp";
import deleteIcon from "../../images/DeleteTeam.webp";
import Modal from 'react-bootstrap/Modal';


function GroupComponent({ rawData, users, fetchData }) {
    const [items, setItems] = useState([]); // Initialize as an empty array
    const allowedEmployees = rawData?.allowedEmployees || [];
    console.log('>>>>>>', allowedEmployees);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isArchived, setIsArchived] = useState(rawData?.isArchived || false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteType, setDeleteType] = useState("");

    useEffect(() => {
        if (users) {
            setItems(
                users.map(user => ({
                    ...user,
                    isChecked: allowedEmployees.includes(user._id) // Set true if in allowedEmployees
                }))
            );
        }
    }, [users, allowedEmployees]); // Depend on both users and allowedEmployees

    const handleToggle = async (id, isChecked) => {
        try {
            // Update state before API call
            setItems(prevItems =>
                prevItems.map(item =>
                    item._id === id ? { ...item, isChecked } : item
                )
            );

            // Get token from localStorage or state
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found.");
                return;
            }
            // API request to assign/unassign employee
            const { data } = await axios.patch(
                `${apiUrl}/userGroup/addEmployeesToGroup/${rawData._id}`,
                {
                    isAssign: isChecked,
                    userIds: [id]
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            console.log(`User ${id} ${isChecked ? "assigned" : "removed"} successfully`);
            enqueueSnackbar(data?.message || "Action successful", {
                variant: "success",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });

            // Update `rawData.allowedEmployees` manually before refetching
            rawData.allowedEmployees = isChecked
                ? [...allowedEmployees, id]
                : allowedEmployees.filter(empId => empId !== id);

            setItems(prevItems =>
                prevItems.map(item =>
                    item._id === id ? { ...item, isChecked } : item
                )
            );

            fetchData(); // Refetch fresh data
        } catch (error) {
            console.error("Error updating user:", error);
            enqueueSnackbar(error?.response?.data?.message || "Error updating user", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
        }
    };

    const token = localStorage.getItem("token"); // Token from localStorage
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };


    const handleArchive = async (groupId) => {
        try {
            const res = await axios.patch(
                `${apiUrl}/userGroup/archiveGroup/${groupId}`,
                { isArchived: !isArchived }, // Toggle archive status
                { headers }
            );

            setIsArchived(!isArchived); // Update local state
            enqueueSnackbar(
                `Group ${!isArchived ? "archived" : "unarchived"} successfully!`
                , {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                }
            );
            fetchData();
        } catch (error) {
            enqueueSnackbar("Error updating archive status", { variant: "error" });
            console.error(error);
        }
    };


    const handleDelete = async (groupId) => {
        // if (!window.confirm("Are you sure you want to delete this group?")) return;

        try {
            const res = await axios.delete(
                `${apiUrl}/userGroup/deleteGroup/${groupId}`,
                { headers } // ✅ Token passed here
            );
            enqueueSnackbar("Group deleted successfully!", {
                variant: "success",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
            fetchData();
        } catch (error) {
            enqueueSnackbar("Error deleting group", { variant: "error" });
            console.error(error);
        }
    };



    return (
        <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "flex-start", textAlign: "left", padding: "10px", }}>
            <SnackbarProvider />
            <div
                style={{
                    display: "flex",
                    // alignItems: "center",
                    gap: "15px",
                    marginBottom: "10px",
                    fontSize: "24px",
                }}
            >
                <div className="employeeDetailName1">
                    Group name: {rawData?.name}
                </div>

                {/* Archive/Unarchive Link */}
                {/* <div className="pauseDeleteMain"> */}
                <button
                    onClick={() => handleArchive(rawData._id)}
                    className="link-button"
                >
                    <img className="paueIcon" src={archive} alt="Archive.png" /> {isArchived ? "Unarchive" : "Archive"}
                </button>

                <button
                    onClick={() => setShowDeleteModal(true)} // ✅ Show modal instead
                    // onClick={() => handleDelete(rawData._id)}
                    className="link-button"
                >
                    <img className="paueIcon" src={deleteIcon} alt="Delete.png" /> Delete
                </button>
            </div>
            {/* </div> */}

            <div className="employeeDetailName" style={{ fontSize: '20px' }}>Group Members:</div>
            <div style={{ marginTop: 10 }}>
                {items
                    .filter(f => f.userType !== "owner" && f.name) // 👈 Check name exists
                    .map(f => (
                        <div key={f._id} style={{ display: "flex", marginBottom: 10 }}>
                            <input
                                onChange={e => handleToggle(f._id, e.target.checked)}
                                className="react-switch-checkbox"
                                id={`react-switch-${f._id}`}
                                type="checkbox"
                                checked={f.isChecked} // Controlled checkbox
                            />
                            <label
                                style={{
                                    background: f.isChecked ? "#5CB85C" : "grey"
                                }}
                                className="react-switch-label"
                                htmlFor={`react-switch-${f._id}`}
                            >
                                <span className="react-switch-button" />
                            </label>

                            <p style={{ margin: "0 0 0 10px", color: "#aaa", fontWeight: "500" }}>
                                {f?.name}
                            </p>
                        </div>
                    ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                {/* <div className="employeeDetailName1" style={{ fontSize: '24px' }}>
                    Group name: {rawData?.name}
                </div> */}

                {/* Archive Link */}
                {/* Archive/Unarchive Link */}
            </div>

            {showDeleteModal && (
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} animation={false} centered>
                    <Modal.Body>
                        <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>
                            Are you sure you want to delete <span style={{ color: "#428BCA" }}>{rawData?.name}</span>?
                        </p>
                        <p>
                            Deleting this group is a <b>permanent action</b>. Please type <b>DELETE</b> in the box below to confirm deletion of this group.
                        </p>
                        <input
                            value={deleteType}
                            onChange={(e) => setDeleteType(e.target.value.trim())}
                            type="text"
                            placeholder="DELETE"
                            style={{
                                fontSize: "18px",
                                padding: "5px 10px",
                                width: "100%",
                                border: "1px solid #cacaca"
                            }}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            disabled={deleteType !== "DELETE"}
                            className={deleteType !== "DELETE" ? "teamActionButtonDisabled" : "teamActionButton"}
                            onClick={() => {
                                handleDelete(rawData._id);
                                setShowDeleteModal(false);
                                setDeleteType("");
                            }}
                        >
                            DELETE
                        </button>
                        <button className="teamActionButton" onClick={() => {
                            setShowDeleteModal(false);
                            setDeleteType("");
                        }}>
                            CANCEL
                        </button>
                    </Modal.Footer>
                </Modal>
            )}

        </div>
    );
}

export default GroupComponent;
