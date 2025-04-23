import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import archive from "../../../images/Archive.webp";
import deleteIcon from "../../../images/DeleteTeam.webp";
import { useNavigate } from 'react-router-dom';
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import useLoading from '../../../hooks/useLoading';
import { useQuery } from 'react-query';
import ConfirmationDialog from '../../component/popupmodals/ConfirmationDialog';
import jwtDecode from 'jwt-decode';


const Projectcomponent = (props) => {
    // style
    const buttonStyle = {
        padding: '5px 10px',
        border: 'none',
        cursor: 'pointer',
        flex: '1 1 auto',
        borderRadius: '5px'
    };

    const archiveButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#007bff',
        color: 'white'
    };

    const deleteButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#dc3545',
        color: 'white'
    };
    //style
    const { loading, setLoading } = useLoading()
    const [viewTimeline, setViewTimeline] = useState(false)
    const [role, setRole] = useState("")
    const [data, setData] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [users, setUsers] = useState(null);

    const { fixId, archived_unarchived_users, isUserArchive, inviteStatus, handleSendInvitation, projectName, getData, allowEmp, setAllowemp, handleSetProjectConditionally } = props
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: "Bearer " + token,
    };



    const fetchOwnerCompanies = async () => {
        const response = await axios.get(`${apiUrl}/owner/companies`, { headers });
        return response.data;  // React Query will handle the response status internally
    }


    const { data: users1, isLoading, isError, refetch } = useQuery({
        queryKey: ['users', fixId],
        queryFn: fetchOwnerCompanies,
        select: (data) => {
            return data?.employees?.sort((a, b) => {
                if (a.inviteStatus !== b.inviteStatus) {
                    return a.inviteStatus ? 1 : -1;
                }
                if (a.isArchived !== b.isArchived) {
                    return a.isArchived ? 1 : -1;
                }
                return 0;
            });
        },
        onError: (error) => {
            console.error("Error fetching data:", error);
            enqueueSnackbar("Error fetching data", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
        }
    });


    // Update users state whenever users1 changes
    useEffect(() => {
        if (users1) {
            setUsers(users1);
        }
    }, [users1]);







    const getDatas = async (fixId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/owner/companies`, { headers })

            // console.log("API Response:", response); // Log the entire response for debugging

            if (response.status === 200) {
                setLoading(false);
                if (response.data) {
                    const responseData = response.data; // Assuming data is directly under 'data'
                    setData(responseData); // Set data from API response
                    // console.log("Data in component:", responseData); 
                    // const userIds = response.employees.map(employee => employee._id);
                    setUsers(() => {
                        return response?.data?.employees?.sort((a, b) => {
                            if (a.inviteStatus !== b.inviteStatus) {
                                return a.inviteStatus ? 1 : -1;
                            }
                            if (a.isArchived !== b.isArchived) {
                                return a.isArchive ? 1 : -1;
                            }
                            return 0;
                        });
                    })

                } else {
                    console.error("API Error:", response.data.message);
                }
            } else {
                console.error("Failed to fetch data:", response.statusText);
            }
        }
        catch (error) {
            setLoading(false);
            console.error("Error fetching data:", error);
        }
    };



    // const handleToggleUser = async (userID) => {
    //     try {
    //         const isAssign = !allowEmp.includes(userID);
    //         console.log("isAssign:", isAssign, "userID:", userID, "projectID:", fixId);
    //         const response = await axios.post(`${apiUrl}/superAdmin/assignProject`, {
    //             userIds: [userID],
    //             isAssign: isAssign,
    //             projectId: [fixId]
    //         }, { headers });
    //         if (response.status === 200) {


    //             // Update allowEmp state
    //             setAllowemp((prevAllowEmp) => {
    //                 if (isAssign) {
    //                     return [...prevAllowEmp, userID];
    //                 } else {
    //                     return prevAllowEmp.filter(id => id !== userID);
    //                 }
    //             });

    //             // Update users state to reflect the new isAssign status
    //             setUsers((prevUsers) => {
    //                 return prevUsers.map((user) => {
    //                     if (user._id === userID) {
    //                         return {
    //                             ...user,
    //                             isAssign: isAssign
    //                         };
    //                     }
    //                     return user;
    //                 });
    //             });
    //         }
    //     } catch (err) {
    //         console.error("Error toggling user:", err);
    //     }
    // };

    const handleToggleUser = async (userID) => {
        const isAssign = !allowEmp.includes(userID);

        // Optimistically update the state
        setAllowemp((prevAllowEmp) => {
            if (isAssign) {
                return [...prevAllowEmp, userID];
            } else {
                return prevAllowEmp.filter(id => id !== userID);
            }
        });

        setUsers((prevUsers) => {
            return prevUsers.map((user) => {
                if (user._id === userID) {
                    return {
                        ...user,
                        isAssign: isAssign
                    };
                }
                return user;
            });
        });

        try {
            console.log("isAssign:", isAssign, "userID:", userID, "projectID:", fixId);
            const response = await axios.post(`${apiUrl}/superAdmin/assignProject`, {
                userIds: [userID],
                isAssign: isAssign,
                projectId: [fixId]
            }, { headers });
            if (response.status === 200) {
                enqueueSnackbar("Settings saved", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            }
        } catch (err) {
            console.error("Error toggling user:", err);

            // Revert the state if the API call fails
            setAllowemp((prevAllowEmp) => {
                if (isAssign) {
                    return prevAllowEmp.filter(id => id !== userID);
                } else {
                    return [...prevAllowEmp, userID];
                }
            });

            setUsers((prevUsers) => {
                return prevUsers.map((user) => {
                    if (user._id === userID) {
                        return {
                            ...user,
                            isAssign: !isAssign
                        };
                    }
                    return user;
                });
            });

            // Get the error message from the response if available
            const errorMessage = err.response?.data?.message || "Failed to save settings";

            enqueueSnackbar(errorMessage, {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
        }
    };

    useEffect(() => {
        getDatas(fixId);
    }, [fixId])

    const user = jwtDecode(JSON.stringify(token));
    const navigate = useNavigate()

    useEffect(() => {
        setRole(data.userType)
    }, [data])


    const userType = 'owner'; // This should come from your authentication logic
    const deleteUser = () => console.log('Delete user function called'); // Replace with your actual delete logic


    const addAll = async () => {
        console.log("Add All clicked", users.map(employee => employee._id));
        let u_ID = users.map(employee => employee._id);
        let isAssign = true;
        try {

            console.log("projectID:", fixId);
            const response = await axios.post(`${apiUrl}/superAdmin/assignProject`, {
                userIds: u_ID,
                isAssign: isAssign,
                projectId: [fixId]
            }, { headers });
            if (response.status === 200) {
                // Update allowEmp state
                setAllowemp(u_ID);

                // Update users state to reflect the new isAssign status
                setUsers((prevUsers) => {
                    return prevUsers.map((user) => {
                        return {
                            ...user,
                            isAssign: isAssign
                        };
                    });
                });

                enqueueSnackbar("All users assigned successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            }
        } catch (err) {
            console.error("Error toggling user:", err);
        }
        // Add your logic here for adding all items
    }

    const removeAll = async () => {
        console.log("Remove All clicked", allowEmp);
        let isAssign = false;
        try {

            console.log("projectID:", fixId);
            const response = await axios.post(`${apiUrl}/superAdmin/assignProject`, {
                userIds: allowEmp,
                isAssign: isAssign,
                projectId: [fixId]
            }, { headers });
            if (response.status === 200) {
                getData();
                // Update allowEmp state
                setAllowemp([]);

                // Update users state to reflect the new isAssign status
                setUsers((prevUsers) => {
                    return prevUsers.map((user) => {
                        return {
                            ...user,
                            isAssign: isAssign
                        };
                    });
                });

                enqueueSnackbar("All users removed successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            }
        } catch (err) {
            console.error("Error toggling user:", err);
        }
        // Add your logic here for removing all items
    }


    const handleArchive = async () => {
        try {
            const config = {
                headers, // Make sure the headers are passed correctly
            };

            const body = {
                isArchived: isUserArchive ? true : false, // Send isArchived as true in the request body
            };

            const response = await axios.patch(
                `${apiUrl}/superAdmin/archiveProject/${fixId}`,
                body,
                config
            );

            if (response.status === 200) {
                enqueueSnackbar("Project archived successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
                getData(); // Implement any additional logic for archiving the project
            }
        } catch (err) {
            console.error("Error archiving project:", err.response || err);
            enqueueSnackbar("Failed to archive project", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
            getData();
        }
    };



    const handleConfirmDelete = async () => {
        try {
            const response = await axios.delete(`${apiUrl}/superAdmin/deleteProject/${fixId}`, { headers });
            if (response.status === 200) {
                enqueueSnackbar("Project deleted successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
                getData();
                handleSetProjectConditionally();

            }
        } catch (err) {
            console.error("Error deleting project:", err);
            enqueueSnackbar("Failed to delete project", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
            getData();

        }
        setOpenDialog(false); // Close the confirmation dialog after the action
    };

    const handleCancelDelete = () => {
        setOpenDialog(false); // Close the dialog without doing anything
    };
    const handleDelete = async () => {
        // Show the confirmation dialog
        setOpenDialog(true);
    };

    return (
        <div className="container p-3">
            <SnackbarProvider />
            {/* Header Right Side */}
            <div className="d-flex justify-content-between align-items-center flex-wrap w-100 mb-2">
                <div className="employeeDetailName1" style={{ fontSize: '24px' }}>{projectName}</div>
                <div className="d-flex gap-2">
                    <div className="archiveMain mt-3" onClick={handleArchive}>
                        <p><img className="paueIcon" src={archive} alt="Archive.png" />{isUserArchive ? "Archive" : "Unarchive"}</p>
                    </div>
                    <div className="deleteMain mt-3" onClick={handleDelete}>
                        <p><img className="paueIcon" src={deleteIcon} alt="DeleteTeam.png" />Delete</p>
                    </div>
                </div>
            </div>
            {/* Assign Project to Client */}
            {/* <div className=" mb-3" style={{ cursor: 'pointer', fontSize: '18px', color: 'black' }}>Assign Project to Client</div> */}
            {/* Project Member */}

            { isUserArchive ? (
                <>
                    <div className="employeeDetailName1" style={{ fontSize: '24px' }}>Project Member</div>
                    <div className="d-flex gap-2">
                        <div className=" mt-3" style={{ fontSize: '18px', cursor: 'pointer', color: 'black' }} onClick={addAll}>Add All</div>
                        <div className=" mt-3" style={{ fontSize: '18px', cursor: 'pointer', color: 'black' }} onClick={removeAll}>Remove All</div>
                    </div>
                </>
            ) : (
                <div>
                    {/* <p>The project is Archived </p> */}
                    {/* <p>Total Users: 0</p> */}
                </div>
            )}


            {users && isUserArchive ? (
                <div style={{ marginTop: 10 }}>
                    {users.filter(f => !f.isArchived && f.name).length > 0 ? (
                        users.filter(f => !f.isArchived && f.name).map((f) => (
                            <div key={f._id} style={{ display: "flex", marginBottom: 10 }}>
                                <input
                                    onChange={() => handleToggleUser(f._id)}
                                    className="react-switch-checkbox"
                                    id={`react-switch-${f._id}`}
                                    type="checkbox"
                                    checked={allowEmp.includes(f._id)}
                                />
                                <label
                                    style={{
                                        background: allowEmp.includes(f._id) ? "#5CB85C" : "grey"
                                    }}
                                    className="react-switch-label"
                                    htmlFor={`react-switch-${f._id}`}
                                >
                                    <span className={`react-switch-button`} />
                                </label>
                                <p style={{ margin: "0 0 0 10px", color: "#aaa", fontWeight: "500" }}>{f.name}</p>
                            </div>
                        ))
                    ) : (
                        <p>No project with a name available...</p>
                    )}
                    {/* <p style={{ fontSize: 18, fontWeight: 500 }}>
                        Total Users: {users.filter(f => !f.isArchived && f.name).length}
                    </p> */}
                </div>
            ) : (
                <div>
                    {/* <p>No project available </p>
                    <p>Total Users: 0</p> */}
                </div>
            )}
            {/* Confirmation dialog */}
            <ConfirmationDialog
                open={openDialog}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                text={'Are you sure you want to delete this project? This action cannot be undone.'}
            />
        </div>
    );
};

export default Projectcomponent;
