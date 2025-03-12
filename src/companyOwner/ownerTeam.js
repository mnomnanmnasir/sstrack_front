
import axios from "axios";
import jwtDecode from "jwt-decode";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { AiFillStar, AiOutlineUser } from 'react-icons/ai';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from "react-router-dom";
import { FerrisWheelSpinner } from 'react-spinner-overlay';
import '../../node_modules/sweetalert2/src/sweetalert2.scss';
import useLoading from "../hooks/useLoading";
import archiveIcon from "../images/archive.svg";
import groupCompany from "../images/Group.webp";
import inviteIcon from "../images/invitation.svg";
import line from "../images/Line 3.webp";
import OwnerTeamComponent from "./ownerTeamComponent";
import Joyride from "react-joyride";

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
    const [users, setUsers] = useState(null);
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const token = localStorage.getItem('token');
    const [isInviteLoading, setIsInviteLoading] = useState(false); // For invite button
    const [isDeleteLoading, setIsDeleteLoading] = useState(false); // For delete action
    const headers = {
        Authorization: "Bearer " + token,
    };
    const user = jwtDecode(JSON.stringify(token));
    // console.log('check',user._id === "679b223b61427668c045c659");
    
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
    const handleJoyrideCallback = (data) => {
        const { action, index, status } = data;

        if (action === "next") {
            setStepIndex(index + 1);
        }
        if (status === "finished" || status === "skipped") {
            setRun(false); // End the tour when finished
        }
    };
    const getData = async () => {
        setLoading(true)
        try {
            setLoading2(true)
            const response = await axios.get(`${apiUrl}/owner/companies`, { headers })
            if (response.status) {
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

    const handleSendInvitation = async () => {
        if (email !== "") {
            setShow3(false)
            setIsInviteLoading(true); // Start loading for invite button

            try {
                const res = await axios.post(`${apiUrl}/superAdmin/email`, {
                    toEmail: email,
                    company: user.company,
                }, {
                    headers: headers,
                })
                if (res.status) {
                    enqueueSnackbar(res.data.message, {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                    getData()
                    setEmail("") // Reset the email input field
                }
                console.log("invitationEmail RESPONSE =====>", res);
            } catch (error) {
                enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                console.log("catch error =====>", error);
            }
            finally {
                setIsInviteLoading(false); // Reset loading for invite button
            }
        }
        else {
            enqueueSnackbar("Email address is required", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
        }

    }

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
                    <button disabled={deleteType !== "DELETE" ? true : false} className={`${deleteType !== "DELETE" ? "teamActionButtonDisabled" : "teamActionButton"}`} onClick={deleteUser}>
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
            {user?._id === "679b223b61427668c045c659" && (
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
                <div className="userHeader">
                    <div className="d-flex align-items-center gap-3">
                        <div><img src={groupCompany} /></div>
                        <h5>Team</h5>
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="ownerTeamContainer">
                        <div className="d-flex gap-3">
                            <div style={{ width: "400px" }}>
                                {user?.userType !== "manager" && (
                                    <>
                                        {/* <p className="addUserButton" onClick={() => navigate('/company-owner-user')}>+ Create user</p> */}
                                        <div
                                            id="addUserButton"
                                            style={{
                                                marginTop: "20px",
                                                display: "flex",
                                                justifyContent: "space-between"
                                            }}>
                                            <input value={email} onChange={(e) => {
                                                const emailValue = e.target.value;
                                                setEmail(emailValue);
                                                setIsTypingEmail(!!emailValue); // Set isTypingEmail to true if the input field is not empty
                                                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                                                setIsValidEmail(emailRegex.test(emailValue)); // Set isValidEmail to true if the email address is valid
                                            }} type="text" placeholder="Add user by email" style={{
                                                fontSize: "18px",
                                                padding: "6px 10px",
                                                width: "100%",
                                                border: "1px solid #cacaca",
                                                outline: "none",
                                                borderTopLeftRadius: '5px',
                                                borderBottomLeftRadius: '5px',
                                            }} />
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
                                                onClick={handleSendInvitation}
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
                                <div id="lisstofallusers" >
                                    {users?.map((e, i) => {
                                        return (
                                            <div

                                                className={`adminTeamEmployess ${activeId === e._id ? "activeEmploy" : ""} align-items-center gap-1`} onClick={() => {
                                                    setMainId(e._id)
                                                    setActiveId(e._id)
                                                    setIsUserArchive(e?.isArchived ? false : true)
                                                    setInviteStatus(false)
                                                    setPayrate(e)
                                                    setSelectedUser(e)
                                                }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: '100%' }}>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <div className="groupContentMainImg">
                                                            <p>{i + 1}</p>
                                                        </div>
                                                        <p className="groupContent">{e?.inviteStatus === true ? e?.email : e?.name}</p>
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
                                                {
                                                    e?.userType === "owner" ? <div>
                                                        <AiFillStar color="#e7c741" size={20} />
                                                    </div> :
                                                        e?.userType === "admin" ? <div>
                                                            <AiFillStar color="#28659C" size={20} />
                                                        </div>
                                                            :
                                                            e?.userType === "manager" && (
                                                                <div style={{ backgroundColor: "#5CB85C", width: 80, padding: "5px 10px", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                                    <AiOutlineUser color="white" size={20} />
                                                                    <p style={{ margin: 0, fontWeight: "600", color: "white" }}>{e?.assignedUsers?.filter(f => f !== user._id)?.length}</p>
                                                                </div>
                                                            )}
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>
                            <div>
                                <img src={line} />
                            </div>
                            <div style={{ width: "100%", display: mainId === null ? "flex" : "", justifyContent: mainId === null ? "center" : "", alignItems: mainId === null ? "center" : "" }}>
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
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerTeam;












