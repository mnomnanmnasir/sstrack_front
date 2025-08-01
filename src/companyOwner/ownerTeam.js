import axios from "axios";
import jwtDecode from "jwt-decode";
import moment from "moment-timezone";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { AiFillStar, AiOutlineUser } from 'react-icons/ai';
import Joyride from "react-joyride";
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FerrisWheelSpinner } from 'react-spinner-overlay';
import '../../node_modules/sweetalert2/src/sweetalert2.scss';
import BreakTimeModal from ".././screen/component/Modal/BreakTimeModal";
import PunctualityModal from ".././screen/component/Modal/PunctualityModal";
import useLoading from "../hooks/useLoading";
import archiveIcon from "../images/archive.svg";
import groupCompany from "../images/Group.webp";
import inviteIcon from "../images/invitation.svg";
import line from "../images/Line 3.webp";
import settingIcon from '../images/setting-icon.svg';
import GroupComponent from "../screen/component/GroupComponent";
import { setEmployessSetting5 } from "../store/adminSlice"; // Adjust path if needed
import OwnerTeamComponent from "./ownerTeamComponent";



function OwnerTeam() {
    const [run, setRun] = useState(true);
    const [stepIndex, setStepIndex] = useState(0);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [isTypingEmail, setIsTypingEmail] = useState(false);
    const [show3, setShow3] = useState(false);
    const [email, setEmail] = useState("")
    const [deleteType, setDeleteType] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate()
    const { loading, setLoading, loading2, setLoading2 } = useLoading()
    const [payrate, setPayrate] = useState(null)
    const [inviteStatus, setInviteStatus] = useState("")
    const [isUserArchive, setIsUserArchive] = useState(false)
    const [isArchived, setIsArchived] = useState(true)
    const [activeId, setActiveId] = useState(null)
    const [mainId, setMainId] = useState(null)
    const [GroupData, setGroupData] = useState(null);
    const [users, setUsers] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('token');
    const [isInviteLoading, setIsInviteLoading] = useState(false); // For invite button
    const [isDeleteLoading, setIsDeleteLoading] = useState(false); // For delete action
    const headers = {
        Authorization: "Bearer " + token,
    };
    // const ownerTeamRef = useRef(null);

    const dispatch = useDispatch();
    const [showAutoPauseSaveModal, setShowAutoPauseSaveModal] = useState(false);
    const [pauseSetting, setPauseSetting] = useState(true); // default true

    const [frequency, setFrequency] = useState(20); // default frequency

    const [showAutoPauseModal, setShowAutoPauseModal] = useState(false);
    // const [timezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [showBreakTimeModal, setShowBreakTimeModal] = useState(false);
    const [breakStartTime, setBreakStartTime] = useState("");
    const [breakEndTime, setBreakEndTime] = useState("");
    const [breakTimeLoading, setBreakTimeLoading] = useState(false);
    const [showPunctualityModal, setShowPunctualityModal] = useState(false);

    const employee = useSelector((state) => state?.adminSlice?.employess) || [];

    const [puncStartTime, setPuncStartTime] = useState("");
    const [puncEndTime, setPuncEndTime] = useState("");
    const [punctualityLoading, setPunctualityLoading] = useState(false);

    const [model, setModel] = useState({
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: null,
    });

    const fillModel = (key, val) => {
        setModel((prevModel) => ({
            ...prevModel,
            [key]: val,
        }));
    };

    const [showNewModal, setShowNewModal] = useState(false);
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [timezoneOffset, setTimezoneOffset] = useState(new Date().getTimezoneOffset()); // initial system offset

    // import { useEffect } from "react";

    // useEffect(() => {
    //     if (window.location.hash === "#team") {
    //         setTimeout(() => {
    //             const section = document.getElementById("team");
    //             if (section) {
    //                 section.scrollIntoView({ behavior: "smooth" });
    //             }
    //         }, 300); // delay to allow page to render
    //     }
    // }, []);
    // const location = useLocation();

    // useEffect(() => {
    //     const scrollTo = location?.state?.scrollTo || window.location.hash?.replace("#", "");
    //     if (scrollTo === "team") {
    //         setTimeout(() => {
    //             const section = document.getElementById("team");
    //             if (section) {
    //                 section.scrollIntoView({ behavior: "smooth" });
    //             }
    //         }, 300); // Delay ensures DOM is ready
    //     }
    // }, [location]);    

    const rolePriority = {
        "owner": 1,
        "admin": 2,
        "manager": 3,
        "user": 4
    };

    const handleRadioChange = async (employee, shouldPause) => {
        const updatedSettings = {
            ...employee.effectiveSettings,
            individualAutoPause: true,
            autoPauseTrackingAfter: {
                pause: shouldPause,
                frequency: 20, // ✅ Default frequency
            },
        };

        try {
            const response = await axios.patch(
                `${apiUrl}/owner/settingsE/${mainId}`,
                {
                    userId: mainId,
                    effectiveSettings: updatedSettings,
                },
                { headers }
            );

            if (response.status === 200) {
                enqueueSnackbar("AutoPause setting updated!", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });

                dispatch(
                    setEmployessSetting5({
                        id: employee._id,
                        key: "pause",
                        value: shouldPause,
                    })
                );
            } else {
                enqueueSnackbar("Failed to update AutoPause setting.", {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
            }
        } catch (error) {
            console.error("❌ AutoPause Error:", error);
            enqueueSnackbar("Error updating AutoPause setting.", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
        }
    };

    const handleBreakTimeSave = async () => {
        try {
            if (!mainId) {
                enqueueSnackbar("No user selected to update break time.", {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
                return;
            }

            if (!breakStartTime || !breakEndTime) {
                enqueueSnackbar("Please select both Break Start Time and Break End Time.", {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
                return;
            }

            if (!timezone) {
                enqueueSnackbar("Please select timezone.", {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
                return;
            }

            const currentDate = new Date().toISOString().split("T")[0];

            const breakStart = moment.tz(`${currentDate}T${breakStartTime}`, timezone).format();
            const breakEnd = moment.tz(`${currentDate}T${breakEndTime}`, timezone).format();

            const requestData = {
                userId: mainId,
                settings: {
                    breakTime: [
                        {
                            TotalHours: Number(calculateTotalHours(breakStartTime, breakEndTime)),
                            breakStartTime: breakStart,
                            breakEndTime: breakEnd,
                        },
                    ],
                    timezone,
                    timezoneOffset,
                },
            };

            console.log("📌 mainId:", mainId);
            console.log("📦 requestData:", requestData);

            const response = await axios.post(
                `${apiUrl}/superAdmin/addIndividualPunctuality`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                // enqueueSnackbar("Break Time successfully submitted!", { variant: "success" });
                enqueueSnackbar("Break Time successfully submitted!", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });


                const timezonePayload = {
                    timezone,
                    timezoneOffset,
                    breakStartTime,
                    breakEndTime,
                };

                await axios.patch(
                    `${apiUrl}/owner/updateUsersTimezone/${mainId}`,
                    timezonePayload,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                // enqueueSnackbar("Timezone successfully updated!", { variant: "success" });
                enqueueSnackbar("Timezone successfully updated!", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });

                setShowBreakTimeModal(false);
            } else {
                enqueueSnackbar("Failed to submit Break Time.", { variant: "error" });
            }
        } catch (error) {
            console.error("❌ BreakTime Error:", error.response?.data || error.message);
            enqueueSnackbar("Error submitting Break Time or updating Timezone.", { variant: "error" });
        }
    };



    const handleSavePunctuality = async () => {
        try {
            if (!puncStartTime || !puncEndTime) {
                enqueueSnackbar("Please select both Start and End Time.", {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
                return;
            }

            const currentDate = new Date().toISOString().split("T")[0];

            const requestData = {
                userId: mainId,  // ✅ Use mainId for selected/invited user
                settings: {
                    puncStartTime: `${currentDate}T${puncStartTime}:00`,
                    puncEndTime: `${currentDate}T${puncEndTime}:00`,
                    timezone: timezone,
                    timezoneOffset: timezoneOffset,
                },
            };

            const response = await axios.post(
                `${apiUrl}/superAdmin/addIndividualPunctuality`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                enqueueSnackbar("Punctuality successfully saved!", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });

                // ✅ Call second API to update timezone
                const timezonePayload = {
                    settings: {
                        timezone: timezone,
                        timezoneOffset: timezoneOffset,
                        puncStartTime: puncStartTime,
                        puncEndTime: puncEndTime,
                    }
                };

                await axios.patch(
                    `${apiUrl}/owner/updateUsersTimezone/${mainId}`,
                    timezonePayload,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                enqueueSnackbar("Timezone successfully updated!", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });

                setShowPunctualityModal(false);
            } else {
                enqueueSnackbar("Failed to save Punctuality.", { variant: "error" });
            }
        } catch (error) {
            console.error("Error saving Punctuality:", error);
            enqueueSnackbar("Error saving Punctuality or updating Timezone.", { variant: "error" });
        }
    };

    useEffect(() => {
        if (user?.userType === "manager") {
            getManagerTeam();
        } else {
            getData();
        }

        // ✅ Scroll if hash or query exists
        const hash = window.location.hash;
        const params = new URLSearchParams(window.location.search);
        const scrollToId = hash ? hash.substring(1) : params.get('scrollTo');

        if (scrollToId) {
            setTimeout(() => {
                const section = document.getElementById(scrollToId);
                if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                }
            }, 500); // small delay for rendering
        }
    }, []);

    const calculateTotalHours = (start, end) => {
        const [startHours, startMinutes] = start.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);

        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;

        const totalMinutes = endTotalMinutes - startTotalMinutes;
        return (totalMinutes / 60).toFixed(2); // Return total hours in decimal (like 0.5, 1.25 etc.)
    };

    // const handleInviteClick = () => {
    //     setShow3(true);               // Show modal
    //     handleSendInvitation();      // Trigger API call
    // };

    const handleInviteClick = () => {

        handleSendInvitation();      // Trigger API call

    };

    // const user = jwtDecode(JSON.stringify(token));
    const user = jwtDecode(token); // ✅ Fix here

    // console.log('check',user._id === "679b223b61427668c045c659");
    const [selectedGroupName, setSelectedGroupName] = useState("");

    const steps = [
        {
            target: '#addUserButton',
            content: 'Invite employees to track their time for your company',
            // disableBeacon: true,
            continuous: true,
        },
        {
            target: '#lisstofallusers',
            content: 'Here you can assign a role or User, Manager or Admin',
            // disableBeacon: true,
            // continuous: true,
        },

    ];

    const [showGroupInput, setShowGroupInput] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");

    const handleJoyrideCallback = (data) => {
        const { action, index, status } = data;

        if (action === "next") {
            setStepIndex(index + 1);
        }
        if (status === "finished" || status === "skipped") {
            setRun(false); // End the tour when finished
        }
    };

    const [groups, setGroups] = useState([]);

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) return;

        try {
            const response = await axios.post(`${apiUrl}/userGroup/add`, {
                name: newGroupName,
            }, { headers });

            if (response.status === 200 || response.status === 201) {
                enqueueSnackbar("Group created successfully!", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });

                const newGroup = response.data?.savedGroup;
                console.log("added you group name", newGroup)
                // Add the new group to list
                setGroups(prev => [...prev, newGroup]);

                setNewGroupName("");
                setShowGroupInput(false);
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to create group", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
        }
    };

    const getData = async () => {
        setLoading(true)
        try {
            setLoading2(true)
            const response = await axios.get(`${apiUrl}/owner/companies`, { headers })
            if (response.status) {
                localStorage.setItem("is1stUser", "true");
                setLoading(false)
                setLoading2(false)
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
                setGroups(() => {
                    return response?.data?.groupsData?.sort((a, b) => {

                        if (a.isArchived !== b.isArchived) {
                            return a.isArchive ? 1 : -1;
                        }
                        return 0;
                    });
                })
                console.log(response);
            }
        }
        catch (err) {
            console.log(err);
            setLoading(false)
            setLoading2(false)
        }
    }

    const getManagerTeam = async () => {
        setLoading(true)
        try {
            setLoading2(true)
            const response = await axios.get(`${apiUrl}/manager/employees`, { headers })
            if (response.status) {
                setLoading(false)
                setLoading2(false)
                setUsers(() => {
                    const filterCompanies = response?.data?.convertedEmployees?.sort((a, b) => {
                        if (a.inviteStatus !== b.inviteStatus) {
                            return a.inviteStatus ? 1 : -1;
                        }
                        if (a.isArchived !== b.isArchived) {
                            return a.isArchive ? 1 : -1;
                        }
                        return 0;
                    });
                    return filterCompanies
                })
                console.log(response);
            }
        }
        catch (err) {
            console.log(err);
            setLoading(false)
            setLoading2(false)
        }
    }

    useEffect(() => {
        if (user?.userType === "manager") {
            getManagerTeam();
        }
        else {
            getData();
        }
    }, [])

    async function archived_unarchived_users() {
        setShow2(false)
        try {
            const res = await axios.patch(`${apiUrl}/superAdmin/archived/${mainId}`, {
                isArchived: isUserArchive
            }, {
                headers: headers
            })
            if (res.status) {
                getData()
                enqueueSnackbar(res.data.message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                setTimeout(() => {
                    setMainId(null)
                }, 1000);
                console.log("archived_unarchived_users RESPONSE =====>", res);
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
        }
    }

    // const [isDeleting, setIsDeleting] = useState(false); // For deletion process

    async function deleteUser() {
        setShow(false)
        setIsDeleteLoading(true); // Start loading for delete action

        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json",
            };
            const res = await axios.delete(`${apiUrl}/superAdmin/deleteEmp/${mainId}`, { headers });
            if (res.status === 200) {
                getData()
                enqueueSnackbar(res.data.Message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                setTimeout(() => {
                    setMainId(null)
                }, 1000);

            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
        }
        finally {
            setIsDeleteLoading(false); // Reset loading for delete action
        }
    }

    // const handleSendInvitation = async () => {
    //     if (email !== "") {
    //         setShow3(false)
    //         setIsInviteLoading(true); // Start loading for invite button

    //         try {
    //             const res = await axios.post(`${ apiUrl } / superAdmin / email`, {
    //                 toEmail: email,
    //                 company: user.company,
    //             }, {
    //                 headers: headers,
    //             })
    //             if (res.status) {
    //                 enqueueSnackbar(res.data.message, {
    //                     variant: "success",
    //                     anchorOrigin: {
    //                         vertical: "top",
    //                         horizontal: "right"
    //                     }
    //                 })
    //                 getData()
    //                 setEmail("") // Reset the email input field
    //             }
    //             console.log("invitationEmail RESPONSE =====>", res);
    //         } catch (error) {
    //             enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
    //                 variant: "error",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right"
    //                 }
    //             })
    //             console.log("catch error =====>", error);
    //         }
    //         finally {
    //             setIsInviteLoading(false); // Reset loading for invite button
    //         }
    //     }
    //     else {
    //         enqueueSnackbar("Email address is required", {
    //             variant: "error",
    //             anchorOrigin: {
    //                 vertical: "top",
    //                 horizontal: "right"
    //             }
    //         })
    //     }

    // }
    const handleSendInvitation = async () => {
        if (!email || !isValidEmail) {
            enqueueSnackbar("Please enter a valid email address", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
            return;
        }

        setShow3(false);
        setIsInviteLoading(true);

        try {
            const res = await axios.post(`${apiUrl}/superAdmin/email`, {
                toEmail: email,
                company: user.company,
            }, { headers });

            if (res.status) {
                enqueueSnackbar(res.data.message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });

                // ✅ Set mainId from updatedUser._id
                const invitedUser = res.data?.updatedUser;
                if (invitedUser && invitedUser._id) {
                    setMainId(invitedUser._id); // ✅ This will now be used in your timezone API
                    setSelectedUser(invitedUser); // optional, if needed later
                }

                getData(); // Refresh user list
                setEmail("");
                // setShowNewModal(true); // Show company policy modal
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.message || "Network error", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
        } finally {
            setIsInviteLoading(false);
        }
    };

    return (
        <div>
            {show ? <Modal show={show} onHide={() => setShow(false)} animation={false} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>Are you sure want to delete {selectedUser?.name} ?</p>
                    <p>All of the time tracking data and screenshots for this employee will be lost. This can not be undone. Please type <b>DELETE</b> in the box below to acknowledge that employee will be deleted.</p>
                    <input value={deleteType} onChange={(e) => setDeleteType(e.target.value.trim())} type="text" placeholder="DELETE" style={{
                        fontSize: "18px",
                        padding: "5px 10px",
                        width: "100%",
                        border: "1px solid #cacaca"
                    }} />
                </Modal.Body>
                <Modal.Footer>
                    <button disabled={deleteType !== "DELETE" ? true : false} className={`${deleteType !== "DELETE" ? "teamActionButtonDisabled" : "teamActionButton"} `} onClick={deleteUser}>
                        DELETE
                    </button>

                    <button className="teamActionButton" onClick={() => setShow(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            {show2 ? <Modal show={show2} onHide={() => setShow2(false)} animation={false} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>{!isUserArchive ? "Unarchive" : "Archive"} {selectedUser?.name} ?</p>
                    <p>The user:</p>
                    {!isUserArchive ? (
                        <ul>
                            <li>Will be able to track time for your company</li>
                            <li>Will appear in the list of users on your home or timeline</li>
                            <li>Their data will not be retained and accessible in reports</li>
                            <li>You will be charged for this user</li>
                        </ul>
                    ) : (
                        <ul>
                            <li>Will not be able to track time for your company</li>
                            <li>Will not appear in the list of users on your home or timeline</li>
                            <li>Their data will be retained and accessible in reports</li>
                            <li>You will not be charged for this user</li>
                        </ul>
                    )}
                    {!isUserArchive && <p>You can restore this user any time</p>}
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={archived_unarchived_users}>
                        {!isUserArchive ? "UN-ARCHIVE" : "ARCHIVE"}
                    </button>
                    <button className="teamActionButton" onClick={() => setShow2(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            {show3 ? <Modal show={show3} onHide={() => setShow3(false)} animation={false} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>Invite user via email address</p>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Enter user email" style={{
                        fontSize: "18px",
                        padding: "5px 10px",
                        width: "100%",
                        border: "1px solid #cacaca"
                    }} />
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={handleSendInvitation}>
                        SEND
                    </button>
                    <button className="teamActionButton" onClick={() => setShow3(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}

            {showAutoPauseSaveModal && (

                <Modal show={showAutoPauseSaveModal} onHide={() => setShowAutoPauseSaveModal(false)} style={{ zIndex: 2000 }} backdropStyle={{ zIndex: 1999 }}>
                    {/* <Modal show={showAutoPauseSaveModal} onHide={() => setShowAutoPauseSaveModal(false)} centered> */}
                    <Modal.Header closeButton>
                        <Modal.Title>🕒 Auto-Pause Policy</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p style={{ marginBottom: "16px" }}>Choose whether to pause tracking after inactivity:</p>

                        {/* Radio: Pause after */}
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                            <input
                                type="radio"
                                name="autoPauseOption"
                                id="pauseOption"
                                value="true"
                                checked={pauseSetting === true}
                                onChange={() => setPauseSetting(true)}
                                style={{ marginRight: "10px" }}
                            />
                            <label htmlFor="pauseOption" style={{ margin: 0, fontWeight: 500 }}>
                                Pause after
                            </label>

                            <input
                                type="number"
                                min="1"
                                value={frequency}
                                onChange={(e) => setFrequency(Number(e.target.value))}
                                style={{ width: "60px", margin: "0 10px", padding: "4px 6px" }}
                            />
                            <span>minutes of inactivity</span>
                        </div>

                        {/* Radio: Do not pause */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                                type="radio"
                                name="autoPauseOption"
                                id="noPauseOption"
                                value="false"
                                checked={pauseSetting === false}
                                onChange={() => setPauseSetting(false)}
                                style={{ marginRight: "10px" }}
                            />
                            <label htmlFor="noPauseOption" style={{ margin: 0, fontWeight: 500 }}>
                                Don't auto pause
                            </label>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <button className="btn btn-secondary" onClick={() => setShowAutoPauseSaveModal(false)}>
                            Cancel
                        </button>
                        <button
                            className="btn text-white" style={{ backgroundColor: '#7CCB58' }}
                            onClick={async () => {
                                if (!mainId) {
                                    enqueueSnackbar("Please select a user to apply auto-pause policy", { variant: "error" });
                                    return;
                                }

                                const emp = users?.find(u => u._id === mainId);
                                if (!emp) {
                                    enqueueSnackbar("User not found", { variant: "error" });
                                    return;
                                }

                                const updatedSettings = {
                                    ...emp.effectiveSettings,
                                    individualAutoPause: true,
                                    autoPauseTrackingAfter: {
                                        pause: pauseSetting,
                                        frequency: frequency,
                                    }
                                };

                                try {
                                    const res = await axios.patch(
                                        `${apiUrl}/owner/settingsE/${emp._id}`,
                                        {
                                            userId: emp._id,
                                            effectiveSettings: updatedSettings,
                                        },
                                        { headers }
                                    );

                                    if (res.status === 200) {
                                        enqueueSnackbar("AutoPause setting updated!", {
                                            variant: "success",
                                            anchorOrigin: { vertical: "top", horizontal: "right" },
                                        });
                                        dispatch(setEmployessSetting5({ id: emp._id, key: "pause", value: pauseSetting }));
                                        dispatch(setEmployessSetting5({ id: emp._id, key: "frequency", value: frequency }));
                                        setShowAutoPauseSaveModal(false);
                                    }
                                } catch (err) {
                                    enqueueSnackbar("Error updating settings", { variant: "error" });
                                }
                            }}
                        >
                            Save
                        </button>
                    </Modal.Footer>
                </Modal>
            )}

            <PunctualityModal
                show={showPunctualityModal}
                onClose={() => setShowPunctualityModal(false)}
                puncStartTime={puncStartTime}
                timezone={timezone}
                setTimezone={setTimezone}
                setTimezoneOffset={setTimezoneOffset}
                setPuncStartTime={setPuncStartTime}
                puncEndTime={puncEndTime}
                setPuncEndTime={setPuncEndTime}
                onSave={async () => {
                    setPunctualityLoading(true);
                    await handleSavePunctuality(); // ✅ API call yahan hoga
                    setPunctualityLoading(false);
                }}
                loading={punctualityLoading}
            />

            {showNewModal && (
                //   <Modal
                //   show={showNewModal}
                //   onHide={() => setShowNewModal(false)}
                //   centered
                //   size="lg"
                //   backdrop="static"
                //   keyboard={false}
                //   dialogClassName="zmodal-fix"
                // />

                <Modal show={showNewModal} onHide={() => setShowNewModal(false)} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>📋 Company Policy Setup</Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{ fontSize: "16px", lineHeight: "1.6" }}>
                        <p><strong>Welcome!</strong> Set default company-wide policies that apply automatically to all new users.</p>

                        <hr />
                        {/* Break Policy with Button */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h6><strong>Break Policy</strong></h6>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                style={{ padding: "2px 10px", fontSize: "14px" }}
                                onClick={() => setShowBreakTimeModal(true)} // ✅ Open modal
                            >
                                Break Time
                            </button>
                        </div>
                        <ul>
                            <li><strong>Break Time:</strong> 12:00 PM to 12:30 PM</li>
                        </ul>

                        <hr />
                        {/* Auto-Pause Policy with Button */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h6><strong>Auto-Pause Policy</strong></h6>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                style={{ padding: "2px 10px", fontSize: "14px" }}
                                onClick={() => {
                                    setPauseSetting(true); // or set based on default if needed
                                    setShowAutoPauseSaveModal(true); // open your new modal
                                }}
                            >
                                Policy
                            </button>
                        </div>
                        <ul>
                            <li>Automatically pause tracking after inactivity.</li>
                            <li><strong>Default:</strong> 20 minutes of inactivity triggers pause.</li>
                        </ul>

                        <hr />

                        {/* Working Hours Policy with Punctuality Button */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h6><strong>Working Hours Policy</strong></h6>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                style={{ padding: "2px 10px", fontSize: "14px" }}
                                onClick={() => setShowPunctualityModal(true)} // ✅ Open punctuality modal
                            >
                                Punctuality
                            </button>
                        </div>

                        <ul>
                            <li>Start Time: <strong>09:00 AM</strong></li>
                            <li>End Time: <strong>05:00 PM</strong></li>
                        </ul>

                        <hr />
                        {/* Automatic Application */}
                        <h6><strong>Automatic Application</strong></h6>
                        <ul>
                            <li>Applies to all <strong>new</strong> users.</li>
                        </ul>

                        <hr />
                        {/* Important Note */}
                        <h6><strong>📢 Important Note</strong></h6>
                        <p>You can override these policies for individual users anytime.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <button className="btn text-white" style={{ background: '#7CCB58' }} onClick={() => setShowNewModal(false)}>Got It!</button>
                    </Modal.Footer>
                </Modal>
            )
            }

            <BreakTimeModal
                show={showBreakTimeModal}
                onClose={() => setShowBreakTimeModal(false)}
                timezone={timezone}
                setTimezone={setTimezone}
                timezoneOffset={timezoneOffset}
                setTimezoneOffset={setTimezoneOffset}
                breakStartTime={breakStartTime}
                setBreakStartTime={setBreakStartTime}
                breakEndTime={breakEndTime}
                setBreakEndTime={setBreakEndTime}
                onSave={async () => {
                    setBreakTimeLoading(true);
                    await handleBreakTimeSave();
                    setBreakTimeLoading(false);
                }}
                loading={breakTimeLoading}
            />

            {
                user?._id === "679b223b61427668c045c659" && (
                    <Joyride
                        steps={steps}
                        run={run}
                        callback={handleJoyrideCallback}
                        showProgress
                        showSkipButton
                        continuous
                        scrollToFirstStep
                    />
                )
            }
            <SnackbarProvider />

            <div className="container" id='team'>
                <div className="userHeader">
                    <div className="d-flex align-items-center gap-3">
                        <div><img src={groupCompany} /></div>
                        <h5>Team</h5>
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="ownerTeamContainer">
                        <div className="row">
                            <div className="col-12 col-lg-4">
                                {user?.userType !== "manager" && (
                                    <>
                                        <p className="addUserButton" onClick={() => setShowGroupInput(!showGroupInput)}>
                                            {showGroupInput ? "× Close" : "+ Create user group"}
                                        </p>
                                        {showGroupInput && (
                                            <div
                                                id="addUserButton"
                                                style={{
                                                    marginTop: "20px",
                                                    display: "flex",
                                                    justifyContent: "space-between"
                                                }}>
                                                <input
                                                    type="email"
                                                    value={newGroupName}
                                                    onChange={(e) => setNewGroupName(e.target.value)}
                                                    placeholder="Enter new group name"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && newGroupName.trim()) {
                                                            handleCreateGroup();
                                                        }
                                                    }}
                                                    style={{
                                                        fontSize: "18px",
                                                        padding: "6px 10px",
                                                        width: "100%",
                                                        border: "1px solid #cacaca",
                                                        outline: "none",
                                                        borderTopLeftRadius: '5px',
                                                        borderBottomLeftRadius: '5px',
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleCreateGroup()}
                                                    style={{
                                                        backgroundColor: "#7acb59",
                                                        borderTopRightRadius: "4px",
                                                        borderBottomRightRadius: "4px",
                                                        padding: "10px 25px",
                                                        color: "white",
                                                        border: "none",
                                                    }}
                                                    disabled={!newGroupName.trim()}
                                                >
                                                    Create
                                                </button>
                                            </div>
                                        )}
                                        {groups.length > 0 && (
                                            <div style={{ marginTop: "15px" }}>
                                                <h6 style={{ fontWeight: 600, marginBottom: "10px", color: "#0E4772" }}>
                                                    Created Groups:
                                                </h6>
                                                <ul style={{ paddingLeft: "20px" }}>
                                                    {groups?.map((e, i) => (
                                                        <div

                                                            className={`adminTeamEmployess ${activeId === e._id ? "activeEmploy" : ""} align - items - center gap - 1`} onClick={() => {
                                                                setGroupData(e)
                                                                setMainId(null)
                                                                setActiveId(e._id)

                                                            }}>
                                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: '100%' }}>
                                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                                    <div className="groupContentMainImg">
                                                                        <p>{i + 1}</p>
                                                                    </div>
                                                                    <p className="groupContent">{e?.name}</p>
                                                                </div>
                                                                {e?.inviteStatus === true && (
                                                                    <div
                                                                        style={{
                                                                            marginRight: "3px",
                                                                            padding: "3px 10px",
                                                                            borderRadius: "3px",
                                                                            color: "#fff",
                                                                            fontSize: "12px",
                                                                            lineHeight: 1.4,
                                                                        }}
                                                                    >
                                                                        <img width={30} src={inviteIcon} alt="Invite Icon" />
                                                                    </div>
                                                                )}

                                                                {/* Archive Icon */}
                                                                {e?.isArchived === true && (
                                                                    <div
                                                                        style={{
                                                                            marginRight: "3px",
                                                                            padding: "3px 10px",
                                                                            borderRadius: "3px",
                                                                            color: "#fff",
                                                                            fontSize: "12px",
                                                                            lineHeight: 1.4,
                                                                        }}
                                                                    >
                                                                        <img width={30} src={archiveIcon} alt="Archive Icon" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                        </div>

                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* <p className="addUserButton" onClick={() => navigate('/company-owner-user')}>+ Create user group</p> */}
                                        <div
                                            id="addUserButton"
                                            style={{
                                                marginTop: "20px",
                                                display: "flex",
                                                justifyContent: "space-between"
                                            }}>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    const emailValue = e.target.value;
                                                    setEmail(emailValue);
                                                    setIsTypingEmail(!!emailValue);

                                                    // Regex validation for email
                                                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                                                    setIsValidEmail(emailRegex.test(emailValue));
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && isValidEmail && !isInviteLoading) {
                                                        e.preventDefault();
                                                        handleSendInvitation();
                                                    }
                                                }}
                                                placeholder="Enter user email"
                                                style={{
                                                    fontSize: "18px",
                                                    padding: "6px 10px",
                                                    width: "100%",
                                                    border: "1px solid #cacaca",
                                                    outline: "none",
                                                    borderTopLeftRadius: "5px",
                                                    borderBottomLeftRadius: "5px",
                                                }}
                                            />

                                            <button
                                                style={{
                                                    backgroundColor: "#7acb59",
                                                    borderTopRightRadius: "4px",
                                                    borderBottomRightRadius: "4px",
                                                    padding: "10px 25px",
                                                    color: "white",
                                                    border: "none",
                                                }}
                                                disabled={isInviteLoading || !isTypingEmail} // Use isInviteLoading here
                                                onClick={handleInviteClick}
                                            >
                                                {isInviteLoading && isValidEmail ? (
                                                    <FerrisWheelSpinner loading={isInviteLoading} size={23} color="#fff" />
                                                ) : (
                                                    "INVITE"
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}

                                <div className="companyFont">
                                    <p style={{
                                        margin: 0,
                                        padding: 0,
                                        fontSize: "20px",
                                        color: "#0E4772",
                                        fontWeight: "600",
                                    }}>Total</p>
                                    <div style={{
                                        backgroundColor: "#28659C",
                                        color: "white",
                                        fontSize: "600",
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        {users?.length}
                                    </div>
                                </div>

                                <div id="lisstofallusers" className="container-fluid">
                                    {loading || !Array.isArray(users) ? (
                                        <div style={{ padding: "40px 0", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <FerrisWheelSpinner loading={true} size={40} color="#28659C" message="Loading users..." />
                                        </div>
                                    ) : (
                                        [...users]
                                            .sort((a, b) => {
                                                if (a.inviteStatus && !b.inviteStatus) return 1;
                                                if (!a.inviteStatus && b.inviteStatus) return -1;
                                                if (a.isArchived && !b.isArchived) return 1;
                                                if (!a.isArchived && b.isArchived) return -1;
                                                const roleA = rolePriority[a.userType] || 99;
                                                const roleB = rolePriority[b.userType] || 99;
                                                if (roleA !== roleB) return roleA - roleB;
                                                const nameA = (a.name || a.email || "").toLowerCase();
                                                const nameB = (b.name || b.email || "").toLowerCase();
                                                return nameA.localeCompare(nameB);
                                            })
                                            .map((e, i, arr) => {
                                                const prev = arr[i - 1];
                                                const currentRole = e.userType;
                                                const prevRole = prev?.userType;

                                                const isNewSection =
                                                    !prev ||
                                                    prev?.inviteStatus !== e?.inviteStatus ||
                                                    prev?.isArchived !== e?.isArchived ||
                                                    prevRole !== currentRole;

                                                let sectionTitle = "";
                                                if (e.inviteStatus) sectionTitle = "Invited Users";
                                                else if (e.isArchived) sectionTitle = "Archived Users";
                                                else if (e.userType === "owner") sectionTitle = "Owners";
                                                else if (e.userType === "admin") sectionTitle = "Admins";
                                                else if (e.userType === "manager") sectionTitle = "Managers";
                                                else sectionTitle = "Users";

                                                return (
                                                    <React.Fragment key={e._id}>
                                                        {isNewSection && (
                                                            <h6 style={{ fontWeight: 600, marginTop: "20px", marginBottom: "10px", color: "#0E4772" }}>
                                                                {sectionTitle}
                                                            </h6>
                                                        )}

                                                        <div
                                                            className={`adminTeamEmployess ${activeId === e._id ? "activeEmploy" : ""} align-items-center gap-1`}
                                                            onClick={() => {
                                                                setMainId(e._id);
                                                                setActiveId(e._id);
                                                                setIsUserArchive(e?.isArchived ? false : true);
                                                                setInviteStatus(false);
                                                                setPayrate(e);
                                                                setSelectedUser(e);
                                                                setGroupData(null);
                                                            }}
                                                        >
                                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: '100%' }}>
                                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                                    <div className="groupContentMainImg">
                                                                        <p>{i + 1}</p>
                                                                    </div>
                                                                    <p className="groupContent">{e?.inviteStatus ? e?.email : e?.name}</p>
                                                                </div>

                                                                {e?.inviteStatus && (
                                                                    <div style={{
                                                                        marginRight: "3px", padding: "3px 10px", borderRadius: "3px",
                                                                        color: "#fff", fontSize: "12px", lineHeight: 1.4,
                                                                    }}>
                                                                        <img width={30} src={inviteIcon} alt="Invite Icon" />
                                                                    </div>
                                                                )}
                                                                {e?.isArchived && (
                                                                    <div style={{
                                                                        marginRight: "3px", padding: "3px 10px", borderRadius: "3px",
                                                                        color: "#fff", fontSize: "12px", lineHeight: 1.4,
                                                                    }}>
                                                                        <img width={30} src={archiveIcon} alt="Archive Icon" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Role Badge */}
                                                            {e?.userType === "owner" ? (
                                                                <AiFillStar color="#e7c741" size={20} />
                                                            ) : e?.userType === "admin" ? (
                                                                <AiFillStar color="#28659C" size={20} />
                                                            ) : e?.userType === "manager" && (
                                                                <div style={{
                                                                    backgroundColor: "#5CB85C", width: 80, padding: "5px 10px",
                                                                    borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "space-between"
                                                                }}>
                                                                    <AiOutlineUser color="white" size={20} />
                                                                    <p style={{ margin: 0, fontWeight: "600", color: "white" }}>
                                                                        {e?.assignedUsers?.filter(f => f !== user._id)?.length}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            })
                                    )}
                                </div>

                            </div>
                            <div className="d-none d-lg-block" style={{ width: "0px", margin: "0 0 0 60px" }}>
                                <img src={line} />
                            </div>
                            {/* <div className="d-none d-lg-block" style={{ width: "10px", backgroundColor: "#ccc", margin: "0 0 0 60px" }}></div> */}

                            <div className="col-12 col-lg-6">
                                <div
                                    // ref={ownerTeamRef}  // ✅ Add this line
                                    style={{

                                        display: mainId == null && GroupData == null ? "flex" : "",
                                        justifyContent: mainId == null && GroupData == null ? "center" : "",
                                        alignItems: mainId == null && GroupData == null ? "center" : "",
                                    }}
                                >
                                    {mainId ? (
                                        <OwnerTeamComponent
                                            fixId={mainId}
                                            archived_unarchived_users={() => setShow2(true)}
                                            deleteUser={() => setShow(true)}
                                            isArchived={isArchived}
                                            setIsArchived={setIsArchived}
                                            isUserArchive={isUserArchive}
                                            inviteStatus={inviteStatus}
                                            handleSendInvitation={handleSendInvitation}
                                            payrate={payrate}
                                            users={users}
                                            setUsers={setUsers}
                                            selectedUser={selectedUser}
                                            selectedGroupName={selectedGroupName}
                                        />
                                    ) : GroupData ? (
                                        <GroupComponent rawData={GroupData} users={users} fetchData={getData} />
                                    ) : (
                                        <img width={500} src={settingIcon} alt="" style={{ display: "block", margin: "auto" }} />
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default OwnerTeam;












