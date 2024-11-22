// import React, { useEffect, useState } from "react";
// import UserHeader from "../screen/component/userHeader";
// import group from "../images/Group.webp";
// import search from "../images/searchIcon.webp";
// import info from "../images/infoIcon.png";
// import groupImage from "../images/groupImg.png";
// import middleLine from "../images/Line 3.webp";
// import line from "../images/line.webp";
// import Footer from "../screen/component/footer";
// import AdminHead from "../screen/component/adminHeadSection";
// import AdminTeamComponent from "./component/adminTeamComponent";
// import { json, useNavigate } from "react-router-dom";


// function AdminTeam() {
//     const [showCreate, setShowCreate] = useState(false);
//     const [name, setName] = useState("");
//     const [data, setData] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [id, setId] = useState();
//     const [fixId, setFixId] = useState();

//     const navigate = useNavigate('');
//     let token = localStorage.getItem('token');
//     let headers = {
//         Authorization: 'Bearer ' + token,
//     }
//     const apiUrl = "https://ss-track-xi.vercel.app/api/v1";

//     async function createUserGroup() {
//         try {
//             const headers = {
//                 'Content-Type': 'application/json',
//             };

//             const data = {
//                 name: name,
//             };

//             const response = await fetch(`${apiUrl}/userGroup/add`, {
//                 headers,
//                 method: "POST",
//                 body: JSON.stringify(data),
//             });

//             if (response.ok) {
//                 const json = await response.json();

//                 setShowCreate(false);
//                 // setData(json);
//             } else {
//                 console.log('Failed to create object:', response.status, response.statusText);
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     async function getData() {
//         try {
//             const response = await fetch(`${apiUrl}/userGroup/`, { headers });
//             const response1 = await fetch(`${apiUrl}/superAdmin/employees`, { headers });
//             const json = await response.json();
//             const json1 = await response1.json();
//             setData(json)
//             // console.log(json1);
//             setUsers(json1);
//             // console.log(json1[0]._id);


//         } catch (err) {

//             console.log(err);
//         }
//     }

//     useEffect(() => {
//         getData();

//     },[])

//     function moveId(id) {
//         setId(id)
//     }

//     useEffect(() => {
//         if (users.employees) {
//             setFixId(users.employees[0]._id)
//         }

//     }, [users.employees])
//     // console.log(fixId);
//     return (
//         <div>

//             <UserHeader />
//             <AdminHead />
//             <section>
//                 <div className="container">
//                     <div className="userHeader">
//                         <div className="headerTop">
//                             <img src={group} />
//                             <h5>Team</h5>
//                         </div>
//                         {/* {console.log(users)} */}

//                     </div>
//                     <div className="mainwrapper">
//                         <div className="adminTeamContainer">
//                             <div className="settingMainDiv">
//                                 <div>
//                                     <div className="searchGroupnEmployee">
//                                         <div className="searchIconMain">
//                                             <img src={search} alt="searchIcon.png" />
//                                         </div>
//                                         <input className="searchMainInput" type="text" placeholder="Search" />
//                                     </div>
//                                     {showCreate && <div className="inviteForm">
//                                         <input className="inviteFormInput" type="text" onChange={(e) => setName(e.target.value)} placeholder="Add new employee by email" />
//                                         <button onClick={createUserGroup} className="inviteButton">Create</button>
//                                     </div>}
//                                     <div onClick={() => setShowCreate(true)} className="createUserGroup">
//                                         <button className="createUserButton">+Create user Group</button>
//                                         <button className="infoHover"><img src={info} alt="infoIcon.png" /></button>
//                                     </div>
//                                     <div>
//                                         {data && data?.map((e, i) => {
//                                             return (
//                                                 <div className="groupContentMain">
//                                                     <div className="groupContentMainImg">
//                                                         <img src={groupImage} alt="groupImg.png" />
//                                                     </div>
//                                                     {/* {console.log(e.name)} */}
//                                                     <p className="groupContent">{e?.name}</p>
//                                                 </div>
//                                             )
//                                         })}


//                                     </div>
//                                     <div className="inviteForm">
//                                         <input className="inviteFormInput" type="text" placeholder="Add new employee by email" />
//                                         <button className="inviteButton">Invite</button>
//                                     </div>
//                                     {/* <div className="tabishDiv activeButtonClasss">
//                                         <button className="buttonOne">1</button>
//                                         <p>Accounts Tabish</p>

//                                     </div> */}
//                                     <div>
//                                         {users && searchUsers?.employees?.map((e, i) => {
//                                             // {console.log(e)}
//                                             return (
//                                                 <div className="tabishDiv" onClick={() => moveId(e._id)}>
//                                                     <button className="buttonOne">{i + 1}</button>
//                                                     <p>{e?.name}</p>

//                                                 </div>
//                                             )
//                                         })}
//                                     </div>

//                                 </div>
//                                 <div>
//                                     <img src={middleLine} />
//                                 </div>
//                                 <div>
//                                     <AdminTeamComponent id={id ? id : fixId} />
//                                 </div>

//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <div>
//                 <img className="line" src={line} />
//             </div>
//             <Footer />
//         </div>
//     )
// }

// export default AdminTeam;

import React, { useEffect, useState } from "react";
import UserHeader from "../screen/component/userHeader";
import OwnerSection from "../companyOwner/ownerComponent/ownerSection";
import groupCompany from "../images/Group.webp";
import archiveIcon from "../images/archive.svg";
import inviteIcon from "../images/invitation.svg";
import line from "../images/Line 3.webp";
import OwnerTeamComponent from "../companyOwner/ownerTeamComponent";
import AdminHead from "../screen/component/adminHeadSection";
import AdminTeamComponent from "./component/adminTeamComponent";
import axios from "axios";
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import Footer from "../screen/component/footer";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import useLoading from "../hooks/useLoading";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '../../node_modules/sweetalert2/src/sweetalert2.scss'
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AiFillStar } from "react-icons/ai";

function AdminTeam() {

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [deleteType, setDeleteType] = useState("");
    const [confirmation, setConfirmation] = useState('');
    const { loading, setLoading, loading2, setLoading2 } = useLoading()
    const [payrate, setPayrate] = useState(null)
    const [inviteStatus, setInviteStatus] = useState("")
    const [isUserArchive, setIsUserArchive] = useState(false)
    const [activeId, setActiveId] = useState(null)
    const [mainId, setMainId] = useState(null)
    const [email, setEmail] = useState("")
    const [resendEmail, setResendEmail] = useState("")
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isArchived, setIsArchived] = useState(true)
    const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: "Bearer " + token,
    };
    const user = JSON.parse(localStorage.getItem("items"))

    const navigate = useNavigate()

    async function getData() {
        setLoading(true)
        try {
            setLoading2(true)
            const response = await fetch(`${apiUrl}/superAdmin/employees`, { headers });
            const json = await response.json();
            setUsers(() => {
                const filterCompanies = json?.convertedEmployees?.filter((employess, index) => {
                    return user.company === employess.company && user.email !== employess.email && employess.userType !== "owner"
                }).sort((a, b) => {
                    // Compare inviteStatus first
                    if (a.inviteStatus !== b.inviteStatus) {
                        return a.inviteStatus ? 1 : -1; // Users with inviteStatus true will appear after false
                    }
                    
                    // If inviteStatus is the same, compare isArchive
                    if (a.isArchived !== b.isArchived) {
                        return a.isArchive ? 1 : -1; // Users with isArchive true will appear after false
                    }
                    
                    // If both inviteStatus and isArchive are the same, maintain the original order
                    return 0;
                });
                return filterCompanies
            })
            setLoading(false)
            setLoading2(false)
        } catch (err) {
            setLoading(false)
            setLoading2(false)
            console.log(err);
        }
    }

    useEffect(() => {
        getData();
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

    async function deleteUser() {
        setShow(false)
        try {
            const res = await axios.delete(`${apiUrl}/superAdmin/deleteEmp/${mainId}`)
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
                console.log("deleteUser RESPONSE =====>", res);
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

    const handleSendInvitation = async () => {
        if (email !== "") {
            setShow3(false)
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

    const reSendInvitation = async () => {
        console.log({
            toEmail: resendEmail,
            company: user.company,
        });
        try {
            const res = await axios.post(`${apiUrl}/superAdmin/email`, {
                toEmail: resendEmail,
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
                            <div style={{ width: "500px" }}>
                                <p className="addUserButton" onClick={() => navigate('/dashboard')}>+ Create user</p>
                                <div style={{
                                    marginTop: "20px",
                                    display: "flex",
                                    justifyContent: "space-between"
                                }}>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Add employee by email" style={{
                                        fontSize: "18px",
                                        padding: "6px 10px",
                                        width: "100%",
                                        border: "1px solid #cacaca",
                                        outline: "none",
                                        borderTopLeftRadius: '5px',
                                        borderBottomLeftRadius: '5px',
                                    }} />
                                    <button style={{
                                        backgroundColor: "#7acb59",
                                        borderTopRightRadius: "4px",
                                        borderBottomRightRadius: "4px",
                                        padding: "10px 25px",
                                        color: "white",
                                        border: "none"
                                    }} onClick={handleSendInvitation}>
                                        INVITE
                                    </button>
                                </div>

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
                                <div style={{
                                    height: users?.length >= 5 && 300,
                                    overflowY: users?.length >= 5 && "scroll",
                                    marginTop: 20
                                }}>
                                    {users?.map((e, i) => {
                                        return (
                                            <div className={`adminTeamEmployess ${activeId === e._id ? "activeEmploy" : ""} align-items-center gap-1`} onClick={() => {
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
                                                    {e?.inviteStatus === true ? (
                                                        <div style={{
                                                            marginRight: "3px",
                                                            padding: "3px 10px",

                                                            borderRadius: "3px",
                                                            color: "#fff",
                                                            fontSize: "12px",
                                                            lineHeight: 1.4,
                                                        }}>
                                                            <img width={30} src={inviteIcon} />
                                                        </div>
                                                    ) : e?.isArchived === true ? (
                                                        <div style={{
                                                            marginRight: "3px",
                                                            padding: "3px 10px",

                                                            borderRadius: "3px",
                                                            color: "#fff",
                                                            fontSize: "12px",
                                                            lineHeight: 1.4,
                                                        }}>
                                                            <img width={30} src={archiveIcon} />
                                                        </div>
                                                    ) : null}
                                                </div>
                                                {e?.userType === "owner" ? <div>
                                                    <AiFillStar color="#e7c741" size={20} />
                                                </div> : null}
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* <div className="archiveFont">
                                    <p style={{
                                        margin: 0,
                                        padding: 0,
                                        fontSize: "20px",
                                        color: "#727272",
                                        fontWeight: "600",
                                    }}>Archive</p>
                                    <div style={{
                                        backgroundColor: "#727272",
                                        color: "white",
                                        fontSize: "600",
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        {searchUsers?.filter((d, i) => d.isArchived === true && d.inviteStatus === false)?.length}
                                    </div>
                                </div>
                                <div style={{
                                    height: searchUsers?.filter((d, i) => d.isArchived === true && d.inviteStatus === false).length >= 5 && 300,
                                    overflowY: searchUsers?.filter((d, i) => d.isArchived === true && d.inviteStatus === false).length >= 5 && "scroll",
                                    marginTop: 20
                                }}>
                                    {users && searchUsers?.filter((d, i) => d.isArchived === true && d.inviteStatus === false)?.map((e, i) => {
                                        return (
                                            <div className={`adminTeamEmployess ${activeId === e._id ? "activeEmploy" : ""} align-items-center gap-1`} onClick={() => {
                                                setMainId(e._id)
                                                setActiveId(e._id)
                                                setIsUserArchive(true)
                                                setInviteStatus(false)
                                            }}>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <div className="groupContentMainImg">
                                                        <p>{i + 1}</p>
                                                    </div>
                                                    <p className="groupContent archive-user">{e?.name}</p>
                                                </div>
                                                {e?.userType === "owner" ? <div>
                                                    <AiFillStar color="#e7c741" size={20} />
                                                </div> : null}
                                            </div>
                                        )
                                    })}
                                </div> */}

                                {/* <div className="archiveFont">
                                    <p style={{
                                        margin: 0,
                                        padding: 0,
                                        fontSize: "20px",
                                        color: "#727272",
                                        fontWeight: "600",
                                    }}>Pending invite</p>
                                    <div style={{
                                        backgroundColor: "#727272",
                                        color: "white",
                                        fontSize: "600",
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        {searchUsers?.filter((d, i) => d.inviteStatus === true)?.length}
                                    </div>
                                </div>
                                <div style={{
                                    height: searchUsers?.filter((d, i) => d.inviteStatus === true).length >= 5 && 300,
                                    overflowY: searchUsers?.filter((d, i) => d.inviteStatus === true).length >= 5 && "scroll",
                                    marginTop: 20
                                }}>
                                    {users && searchUsers?.filter((d, i) => d.inviteStatus === true)?.map((e, i) => {
                                        return (
                                            <div className={`adminTeamEmployess ${activeId === e._id ? "activeEmploy" : ""} align-items-center gap-1`} onClick={() => {
                                                setMainId(e._id)
                                                setActiveId(e._id)
                                                setIsUserArchive(true)
                                                setInviteStatus(true)
                                                setResendEmail(e.email)
                                            }}>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <div className="groupContentMainImg">
                                                        <p>{i + 1}</p>
                                                    </div>
                                                    <p className="groupContent archive-user">{e?.email}</p>
                                                </div>
                                                {e?.userType === "owner" ? <div>
                                                    <AiFillStar color="#e7c741" size={20} />
                                                </div> : null}
                                            </div>
                                        )
                                    })}
                                </div> */}

                            </div>

                            <div>
                                <img src={line} />
                            </div>
                            <div style={{ width: "100%", display: mainId === null ? "flex" : "", justifyContent: mainId === null ? "center" : "", alignItems: mainId === null ? "center" : "" }}>
                                <AdminTeamComponent
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
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AdminTeam;