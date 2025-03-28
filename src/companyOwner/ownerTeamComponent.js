import React, { useEffect, useState } from "react";
import warning from '../images/warning.png'
import pause from "../images/pauseIcon.webp";
import archive from "../images/Archive.webp";
import deleteIcon from "../images/DeleteTeam.webp";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import useLoading from "../hooks/useLoading";
import axios from "axios";
import settingIcon from '../images/setting-icon.svg'
import search from "../images/searchIcon.webp";
import CurrencyConverter from "../screen/component/currencyConverter";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import UserSettings from "./owner-setting-components/userEffectiveSettings";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../io'; // Correct import
import { setLogout } from "../store/timelineSlice";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import TimezoneSelect from "react-timezone-select";

function OwnerTeamComponent(props) {

    const socket = useSocket()


    const { loading, setLoading } = useLoading()
    const [viewTimeline, setViewTimeline] = useState(false)
    const [role, setRole] = useState("")
    const [data, setData] = useState({});
    let { fixId, archived_unarchived_users, deleteUser, isUserArchive, selectedGroupName, inviteStatus, handleSendInvitation, payrate, reSendInvitation, users, setUsers, selectedUser } = props
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: "Bearer " + token,
    };
    const [timezone, setSelectedTimezone] = useState(
        Intl.DateTimeFormat().resolvedOptions().timeZone


    );

    const [selectedGroupId, setSelectedGroupId] = useState(null);

    useEffect(() => {
        if (selectedUser?.timezone) {
            setSelectedTimezone(selectedUser.timezone);
        }
    }, [selectedUser]);
    console.log("Current Timezone:", timezone);
    const handleStartDateChange = async (selectedTimezone) => {
        setSelectedTimezone(selectedTimezone);
        const apiUrl = `https://myuniversallanguages.com:9093/api/v1/owner/updateUsersTimezone/${fixId}`;
        const payload = {
            timezone: selectedTimezone.value.toString(),  // Example: "Asia/Kabul"
            timezoneOffset: selectedTimezone.offset.toString()  // Example: "4.5"
        };

        const token = localStorage.getItem('token'); // Replace with your actual token retrieval method

        try {
            const response = await axios.patch(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

            });

            console.log('Timezone updated successfully:', payload);
            enqueueSnackbar(response?.data?.message, {
                variant: "success",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
        } catch (error) {
            console.error('Error updating timezone:', error.response ? error.response.data : error.message);
        }
    };
    const [isUserArchived, setIsUserArchived] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleUserArchive = (data) => {
            console.log('User archived event received:', data);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === data.userId ? { ...user, isArchived: true } : user
                )
            );
            if (data.userId === user._id) {
                // Log the user out
                logOut();
            }
        };

        const handleReload = () => {
            // Reload data from server
            getData();
        };

        function logOut() {
            // localStorage.removeItem("items");
            localStorage.removeItem("token");
            localStorage.removeItem("cachedData");
            dispatch(setLogout());
            navigate('/');
            window.location.reload();
        }

        const handleUserUnarchive = (data) => {
            console.log('User unarchived event received:', data);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === data.userId ? { ...user, isArchived: false } : user
                )

            );

            if (data.userId === user._id) {
                // Log the user out
                logOut();
            }
        };

        const handleRoleUpdate = (data) => {
            console.log('Role updated event received:', data);
            const { userId, role } = data;
            changeRole(userId, role);
        };

        if (socket) {
            console.log('Socket connection established:', socket.connected);




            socket.on('user_unarchive', handleUserUnarchive);
            //   socket.on('role_update', handleRoleUpdate);
            socket.on('role_update', (data) => {
                const { userId, role } = data;
                const userIndex = users.findIndex((user) => user._id === userId);
                if (userIndex !== -1) {
                    const updatedUser = { ...users[userIndex], role };
                    setUsers([...users.slice(0, userIndex), updatedUser, ...users.slice(userIndex + 1)]);
                }
            });
            socket.on('user_archived', handleReload);
            socket.on('user_archived', (data) => { // Add this line
                if (data.userId === user._id) {
                    logOut();
                }
            });
            return () => {
                console.log('Socket connection closed:', socket.connected);
                socket.off('user_archive', handleUserArchive);
                socket.off('user_unarchive', handleUserUnarchive);
                socket.off('role_update', handleRoleUpdate);
            };
        }
    }, [socket, setUsers, setRole]);



    const changeRole = (userId, newRole) => {
        updateRole(userId, newRole);
    };

    const updateRole = (userId, newRole) => {
        // Update the role of the user in the local state
        const userIndex = users.findIndex((user) => user._id === userId);
        if (userIndex !== -1) {
            const updatedUser = { ...users[userIndex], role: newRole };
            setUsers([...users.slice(0, userIndex), updatedUser, ...users.slice(userIndex + 1)]);
        }

        // Emit the role_update event to other devices
        socket.emit('role_update', { userId, role: newRole });
    };
    //     // When archiving a user, emit an event to the server

    const handleGroupToggle = async (userId, isCurrentlyAssigned) => {
        const isAssign = !isCurrentlyAssigned;

        try {
            const response = await axios.post(
                `${apiUrl}/userGroup/addEmployeesToGroup/${selectedGroupId}`,
                {
                    isAssign,
                    userIds: [userId]
                },
                { headers }
            );

            if (response.status === 200 || response.status === 201) {
                enqueueSnackbar(`User ${isAssign ? "assigned to" : "removed from"} group`, {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });

                setUsers(prev =>
                    prev.map(user =>
                        user._id === userId ? { ...user, isGroupAssigned: isAssign } : user
                    )
                );
            }
        } catch (error) {
            console.error("Error assigning user to group:", error);
            enqueueSnackbar("Something went wrong", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
        }
    };


    const getData = async (fixId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/owner/${fixId}`, { headers });

            console.log("API Response:", response); // Log the entire response for debugging

            if (response.status === 200) {
                setLoading(false);
                if (response.data) {
                    const responseData = response.data; // Assuming data is directly under 'data'
                    setData(responseData); // Set data from API response
                    console.log("Data in component:", responseData); // Log the data received

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



    async function changeUserType(role) {
        try {
            const res = await fetch(`${apiUrl}/userGroup/edit/${fixId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...headers
                },
                body: JSON.stringify({
                    userType: role
                }),
            })
            const dataRes = await res.json()
            enqueueSnackbar("Settings saved", {
                variant: "success",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
            console.log("dataRes ====>", dataRes);
        } catch (error) {
            console.log(error);
        }
    }



    const handleAssignUser = async (userID) => {
        try {
            const response = await axios.patch(`${apiUrl}/superAdmin/assign-user-to-manager/${fixId}`, {
                userIds: [...new Set([...users.filter(user => user.isAssign).map(user => user._id), userID])]
            }, { headers })
            if (response.status) {
                const assignedUsersCount = users.filter(user => user.isAssign).length;
                enqueueSnackbar(`Settings saved`, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
        }
        catch (err) {
            setLoading(false)
            console.log(err);
        }
    }

   


    const handleRemoveAssignUser = async (id) => {
        try {
            const response = await axios.patch(`${apiUrl}/superAdmin/remove-user-from-manager/${fixId}`, {
                userId: id
            }, { headers })
            if (response.status) {
                enqueueSnackbar("Settings saved", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
        }
        catch (err) {
            setLoading(false)
            console.log(err);
        }
    }

    useEffect(() => {
        getData(fixId);
    }, [fixId])

    const user = jwtDecode(JSON.stringify(token));
    const navigate = useNavigate()

    useEffect(() => {
        setRole(data.userType)
    }, [data])



    const userType = 'owner'; // This should come from your authentication logic


    return (
        <div style={{ width: "100% !important" }}>
            <SnackbarProvider />
            {fixId ? (
                <>
                    {/* <p className="fs-2 text-success ">{data?.company}</p> */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
                        <p className="employeeDetail mt-3">Employee Details</p>
                        <div className="pauseDeleteMain">
                            {!inviteStatus && (
                                <>
                                    {user.userType !== 'manager' && (
                                        <>
                                            {selectedUser?.userType !== 'owner' &&
                                                (
                                                    <>
                                                        {/* <div className="pauseMain mt-3">
                                                            <p><img className="paueIcon" src={pause} alt="pauseIcon.png" />Pause</p>
                                                        </div> */}
                                                        <div className="archiveMain mt-3" onClick={archived_unarchived_users}>

                                                            <p><img className="paueIcon" src={archive} alt="Archive.png" />{isUserArchive ? "Archive" : "Unarchive"}</p>
                                                        </div>
                                                    </>
                                                )}
                                        </>
                                    )}
                                </>
                            )}
                            {user?.userType !== 'manager' && deleteUser && (
                                <>
                                    {selectedUser?.userType !== 'owner' && (
                                        <>
                                            <div className="deleteMain mt-3" onClick={deleteUser}>
                                                <p><img className="paueIcon" src={deleteIcon} alt="DeleteTeam.png" />Delete</p>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                            {/* {console.log("User Type", userType)} */}
                        </div>
                    </div>

                    {selectedGroupName && (
                        <div style={{ marginBottom: "20px" }}>
                            <p className="employeeDetail">Selected Group</p>
                            <p className="employeeDetailName2" style={{ fontWeight: "bold", color: "#28659C" }}>{selectedGroupName}</p>
                        </div>
                    )}
                    <div>
                        {data && Object.keys(data).length > 0 ? (
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="employeeDetailName1">{data.name}</p>
                                    <p className="employeeDetailName2">{data.email}</p>
                                </div>
                                <>
                                    {user?.userType !== 'manager' && !selectedUser?.inviteStatus && (
                                        <>

                                            {selectedUser?.userType !== 'owner' && (
                                                <div>
                                                    <CurrencyConverter userId={fixId} payrate={payrate} />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>

                            </div>
                        ) : (
                            <p></p>
                        )}
                    </div>
                    {user?.userType !== 'manager' &&
                        selectedUser?.userType !== 'owner' &&
                        !selectedUser?.inviteStatus && (  // ✅ Check if user has accepted the invite
                            <div style={{ marginTop: 30, marginBottom: 30 }}>
                                <p className="employeeDetail">Select Timezone</p>
                                <div className="dropdown" style={{ minWidth: 440 }}>
                                    <TimezoneSelect value={timezone} onChange={handleStartDateChange} />
                                </div>
                            </div>
                        )}

                    {user?._id === fixId && (user?.userType === "owner" || user?.userType === "admin") ? (
                        <>
                            <p className="employeeDetailName1">Role</p>
                            <p className="employeeDetailName2" style={{ textTransform: "capitalize" }}>{user?.userType}</p>
                        </>
                    ) : selectedUser?.userType === "owner" ? (
                        <>
                            <p className="employeeDetailName1">Role</p>
                            <p className="employeeDetailName2" style={{ textTransform: "capitalize" }}>{selectedUser?.userType}</p>
                            {console.log('Selected User: ', userType)}
                            {selectedGroupName && (
                                <div style={{ marginBottom: "20px" }}>
                                    <p className="employeeDetail">Selected Group</p>
                                    <p className="employeeDetailName2" style={{ fontWeight: "bold", color: "#28659C" }}>
                                        {selectedGroupName}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : ""}
                    {selectedGroupId && (
                        <div>
                            <p className="employeeDetail">Assign Users to Group</p>
                            {users?.map(user => (
                                <div key={user._id} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                                    <input
                                        type="checkbox"
                                        checked={user.isGroupAssigned || false}
                                        onChange={() => handleGroupToggle(user._id, user.isGroupAssigned)}
                                    />
                                    <label style={{ marginLeft: 10 }}>{user.name}</label>
                                </div>
                            ))}
                        </div>
                    )}

                    {isUserArchive === true && (
                        <>
                            {selectedUser?.userType !== 'owner' && !selectedUser?.inviteStatus && (
                                <>
                                    {loading ? <Skeleton count={1} width="100px" height="24px" style={{ margin: "0 0 16px 0" }} /> : inviteStatus === false &&

                                        <p onClick={() => {
                                            navigate(`/timeline/${fixId}`);
                                        }} style={{
                                            fontWeight: "600",
                                            color: "green",
                                            cursor: "pointer",
                                            textDecoration: "underline"
                                        }}>View timeline</p>}
                                </>
                            )}
                            <div>
                                {data && Object.keys(data).length > 0 && data.name ? ( // Check if data is not empty and data.name exists
                                    // {data && Object.keys(data).length > 0 ? (
                                    <>
                                        {/* <p className="employeeDetailName1">{data.name}</p>
                                            <p className="employeeDetailName2">{data.email}</p> */}

                                        {(user?.userType === 'manager') ? (
                                            // Display only Manager role for managers
                                            <div>
                                                {/* Manager-specific content can go here */}
                                            </div>
                                        ) : (
                                            // Display role options for other scenarios
                                            <div>
                                                {!(
                                                    user?.userType === 'admin' &&
                                                    (selectedUser?.userType === 'owner' || selectedUser?._id === user?._id)
                                                ) &&
                                                    !(user?.userType === 'owner' && selectedUser?._id === user?._id) && (
                                                        <div>
                                                            <p style={{ color: '#0E4772', fontWeight: '600', fontSize: '22px' }}>Role</p>
                                                            {/* User Role */}
                                                            <div>
                                                                <input
                                                                    disabled={data?.userType === 'owner'}
                                                                    checked={role === 'user'}
                                                                    onChange={() => {
                                                                        setRole('user');
                                                                        changeUserType('user');
                                                                    }}
                                                                    type="radio"
                                                                    id="html"
                                                                    name="user"
                                                                    value="user"
                                                                    className={data?.userType === 'owner' ? 'disabledinput' : ''}
                                                                />
                                                                <label htmlFor="html">
                                                                    User -{' '}
                                                                    <span style={{ fontSize: '16px', fontWeight: '600' }}>
                                                                        can see their own data only
                                                                    </span>
                                                                </label>
                                                            </div>
                                                            {/* Admin Role */}
                                                            <div style={{ margin: '10px 0 0 0' }}>
                                                                <input
                                                                    disabled={data?.userType === 'owner'}
                                                                    checked={role === 'admin'}
                                                                    onChange={() => {
                                                                        setRole('admin');
                                                                        changeUserType('admin');
                                                                    }}
                                                                    type="radio"
                                                                    id="css"
                                                                    name="admin"
                                                                    value="admin"
                                                                    className={data?.userType === 'owner' ? 'disabledinput' : ''}
                                                                />
                                                                <label htmlFor="css">
                                                                    Admin -{' '}
                                                                    <span style={{ fontSize: '16px', fontWeight: '600' }}>
                                                                        full control over Team, Projects & Settings. Does not have access to
                                                                        owner's "My Account" page settings.
                                                                    </span>
                                                                </label>
                                                            </div>
                                                            {/* Manager Role */}
                                                            <div style={{ margin: '10px 0 0 0' }}>
                                                                <input
                                                                    checked={role === 'manager'}
                                                                    onChange={() => {
                                                                        setRole('manager');
                                                                        changeUserType('manager');
                                                                    }}
                                                                    type="radio"
                                                                    id="owner2"
                                                                    name="manager"
                                                                    value="manager"
                                                                />
                                                                <label htmlFor="owner2">
                                                                    Manager -{' '}
                                                                    <span style={{ fontSize: '16px', fontWeight: '600' }}>
                                                                        can see selected user's Timeline & Reports (but not rates)
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p></p>
                                )}
                            </div>

                            {role === "manager" && (
                                <div style={{ marginTop: 20 }}>
                                    <div>
                                        <p className="employeeDetail">Manager For</p>
                                        <p style={{ fontSize: "16px", fontWeight: "400" }}>If enabled, {data.name} will be able to see selected user's Timeline and Reports, but not rates.</p>
                                    </div>
                                    <div style={{ marginTop: 10 }}>
                                        {users?.filter(f => f._id !== fixId && f?.isArchived === false && f?.inviteStatus === false && f.userType !== "owner").map((f) => (
                                            <div key={f._id} style={{ display: "flex", marginBottom: 10 }}>
                                                <input
                                                    onChange={() => {
                                                        setUsers((prevUsers) => {
                                                            return prevUsers.map((user) => {
                                                                if (user._id === f._id) {
                                                                    const newIsAssign = !user.isAssign;
                                                                    if (newIsAssign) {
                                                                        handleAssignUser([f._id]); // Pass the updated userIds array
                                                                    } else {
                                                                        handleRemoveAssignUser(user._id); // Pass user ID to removal function
                                                                    }
                                                                    return {
                                                                        ...user,
                                                                        isAssign: newIsAssign,
                                                                        managerId: newIsAssign ? [...user.managerId, fixId] : user.managerId.filter(id => id !== fixId)

                                                                        // If newIsAssign is true, add fixId to managerId array; otherwise, remove fixId from the array
                                                                    };
                                                                }
                                                                return user;
                                                            })
                                                        });
                                                    }}
                                                    className="react-switch-checkbox"
                                                    id={`react-switch-${f._id}`}
                                                    type="checkbox"
                                                    checked={
                                                        f?.managerId?.length === 0 ? false : users.find((user) => user._id === f._id)?.managerId.includes(fixId)
                                                        // f?.managerId?.length === 0 ? false : users.find((user) => user._id === f._id)?.managerId.includes(fixId)
                                                    }
                                                />
                                                {user?.userType !== "manager" && <label
                                                    style={{
                                                        background:
                                                            f?.managerId?.length === 0
                                                                ? 'grey' // If managerId array is empty, set background to grey
                                                                : users.find((user) => user._id === f._id)?.managerId.includes(fixId)
                                                                    ? "#5CB85C" // If fixId is included in managerId array, set background to green
                                                                    : "grey" // Otherwise, set background to grey
                                                    }}
                                                    className="react-switch-label"
                                                    htmlFor={`react-switch-${f._id}`}
                                                >
                                                    <span className={`react-switch-button`} />
                                                </label>}
                                                <p style={{ margin: "0 0 0 10px", color: "#aaa", fontWeight: "500" }}>{f?.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}



                        </>
                    )}

                </>
            ) : (
                <img width={500} src={settingIcon} alt="" style={{ display: "block", margin: "auto" }} />
            )
            }

        </div >
    )
}

export default OwnerTeamComponent;











