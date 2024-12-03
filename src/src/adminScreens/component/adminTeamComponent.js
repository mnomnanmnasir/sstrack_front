import React, { useEffect, useState } from "react";
import pause from "../../images/pauseIcon.webp";
import archive from "../../images/Archive.webp";
import deleteIcon from "../../images/DeleteTeam.webp";
import flag from "../../images/pak flag.webp";
import { useLocation, useNavigate } from "react-router-dom";
import edit from "../../images/editIcon.webp";
import warning from '../../images/warning.png'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import useLoading from "../../hooks/useLoading";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import axios from "axios";
import settingIcon from '../../images/setting-icon.svg'
import CurrencyConverter from "../../screen/component/currencyConverter";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import UserSettings from "../../companyOwner/owner-setting-components/userEffectiveSettings";

function AdminTeamComponent(props) {

    const { loading, setLoading } = useLoading()
    const [settings, setSettings] = useState()
    const [viewTimeline, setViewTimeline] = useState(false)
    const [data, setData] = useState([]);
    const [project, setProject] = useState([]);
    const [idData, setIdData] = useState({});
    const location = useLocation();
    const [userType, setUserType] = useState("");
    const [companyName, setCompanyName] = useState();
    const [screenshot, setScreenshot] = useState({});
    const [change, setChange] = useState(false);
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("");
    const [userId, setUserId] = useState("");
    const [toggleButton, setToggleButton] = useState([])
    const [assignUser, setAssignUser] = useState(null)
    const { fixId, archived_unarchived_users, deleteUser, isUserArchive, inviteStatus, handleSendInvitation, payrate, reSendInvitation, users, setUsers } = props
    const [role, setRole] = useState("")
    const [userIds, setUserIds] = useState([])

    const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
    let token = localStorage.getItem("token");
    let headers = {
        Authorization: "Bearer " + token,
    };

    // console.log(data);
    // const initialToggleButtons = settings?.map(() => false);
    // const ProjectInitialToggleButtons = project?.map(() => false);
    // console.log(initialToggleButtons);
    // console.log(toggleButton);

    // async function getIdData() {
    //     try {
    //         const responses = await fetch(
    //             `${apiUrl}/superAdmin/emp/${fixId}`,
    //             { headers }
    //         );
    //         const settingResponse = await fetch(
    //             `${apiUrl}/superAdmin/Settings/${fixId}`,
    //             { headers }
    //         );
    //         const jsons = await responses.json();
    //         const settingJson = await settingResponse.json();
    //         // console.log(settingJson);
    //         setScreenshot(settingJson.employeeSettings);
    //         setIdData(jsons);
    //         setUserType(jsons.userType);
    //         // console.log(jsons);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // async function handleRadioChange(event) {
    //     setUserType(event.target.value);
    //     try {
    //         const response = await fetch(
    //             `${apiUrl}/userGroup/edit/${id}`,
    //             {
    //                 method: "PATCH",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({ userType: event.target.value }),
    //             }
    //         );

    //         if (response.ok) {
    //             const json = await response.json();
    //             // console.log(json);
    //         } else {
    //             // console.log('Failed to create object:', response.status, response.statusText);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // async function clickme(name,id) {
    //     console.log(toggleButton);
    //     console.log(id);
    // }

    // async function clickme(name, ids, index) {
    //     initialToggleButtons[index - 1] = !initialToggleButtons[index - 1];
    //     console.log(initialToggleButtons[index - 1]);
    //     if (initialToggleButtons[index - 1]) {
    //         try {
    //             const response = await fetch(
    //                 `${apiUrl}/userGroup/addEmployeesToGroup/${ids}`,
    //                 {
    //                     method: "PATCH",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     body: JSON.stringify({
    //                         userIds: [id]
    //                     }),
    //                 }
    //             );

    //             if (response.ok) {
    //                 const json = await response.json();
    //                 // console.log(json);
    //             } else {
    //                 console.log('Failed to create object:', response.status, response.statusText);
    //             }
    //         } catch (err) {
    //             // console.log(err);
    //         }
    //     }
    //     else {
    //         try {
    //             const response = await fetch(
    //                 `${apiUrl}/userGroup/delete/${ids}`,
    //                 {
    //                     method: "DELETE",

    //                     headers: {
    //                         "Content-Type": "application/json",
    //                         ...headers
    //                     },
    //                     body: JSON.stringify({
    //                         userId: id
    //                     }),
    //                 }
    //             );

    //             if (response.ok) {
    //                 const json = await response.json();
    //                 // console.log(json);
    //             } else {
    //                 console.log('Failed to create object:', response.status, response.statusText);
    //             }
    //         } catch (err) {
    //             // console.log(err);
    //         }
    //         // alert("user is delete ")
    //     }

    // }

    // async function addUserToProject(name, ids, index) {
    //     ProjectInitialToggleButtons[index - 1] = !ProjectInitialToggleButtons[index - 1];
    //     console.log(ProjectInitialToggleButtons[index - 1]);
    //     if (ProjectInitialToggleButtons[index - 1]) {
    //         try {
    //             const response = await fetch(
    //                 `${apiUrl}/userGroup/addEmployeesToProject/${ids}`,
    //                 {
    //                     method: "PATCH",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     body: JSON.stringify({
    //                         userIds: [id]
    //                     }),
    //                 }
    //             );

    //             if (response.ok) {
    //                 const json = await response.json();
    //                 console.log(json);
    //             } else {
    //                 console.log('Failed to create object:', response.status, response.statusText);
    //             }
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     }
    //     else {
    //         try {
    //             const response = await fetch(
    //                 `${apiUrl}/userGroup/deleteProject/${ids}`,
    //                 {
    //                     method: "DELETE",

    //                     headers: {
    //                         "Content-Type": "application/json",
    //                         ...headers
    //                     },
    //                     body: JSON.stringify({
    //                         userId: id
    //                     }),
    //                 }
    //             );

    //             if (response.ok) {
    //                 const json = await response.json();
    //                 console.log(json);
    //             } else {
    //                 console.log('Failed to create object:', response.status, response.statusText);
    //             }
    //         } catch (err) {
    //             console.log(err);
    //         }
    //         // alert("user is delete ")
    //     }

    // }

    // async function changeIt() {
    //     try {
    //         const token = localStorage.getItem("token");
    //         const response = await fetch(
    //             `${apiUrl}/superAdmin/UpdateBillingInfo/${id}`,
    //             {
    //                 method: "PATCH",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     token,
    //                 },
    //                 body: JSON.stringify({
    //                     ratePerHour: price,
    //                     currency: currency,
    //                 }),
    //             }
    //         );
    //         if (response.ok) {
    //             const json = await response.json();
    //             console.log(json);
    //             setChange(!change);
    //         } else {
    //             console.log(
    //                 "Failed to create object:",
    //                 response.status,
    //                 response.statusText
    //             );
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // function moveMe(data) {
    //     navigate("/setting", {
    //         state: data

    //     })
    // }

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

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/superAdmin/sorted-datebased/${fixId}`, { headers })
            if (response.status) {
                setLoading(false)
                setSettings(response.data.data)
                setRole(response.data.data.usertype)
                console.log(response);
            }
        }
        catch (err) {
            setLoading(false)
            console.log(err);
        }
    };

    const handleAssignUser = async (userID) => {
        try {
            const response = await axios.patch(`${apiUrl}/superAdmin/assign-user-to-manager/${fixId}`, {
                userIds: userID
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
        fetchData(fixId);
    }, [fixId])

    const navigate = useNavigate()

    console.log(users);

    return (
        <div>
            <SnackbarProvider />
            {fixId ? (
                <>
                    <p className="fs-2 text-success ">{settings?.company}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
                        <p className="employeeDetail">Employee Details</p>
                        <div className="pauseDeleteMain">
                            {!inviteStatus && (
                                <>
                                    <div className="pauseMain">
                                        <p><img className="paueIcon" src={pause} alt="pauseIcon.png" />Pause</p>
                                    </div>
                                    <div className="archiveMain" onClick={archived_unarchived_users}>
                                        <p><img className="paueIcon" src={archive} alt="Archive.png" />{isUserArchive === false ? "Unarchive" : "Archive"}</p>
                                    </div>
                                </>
                            )}
                            <div className="deleteMain" onClick={deleteUser}>
                                <p><img className="paueIcon" src={deleteIcon} alt="DeleteTeam.png" />Delete</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                            {loading ? <Skeleton count={1} width="300px" height="42px" style={{ margin: "0 0 5px 0" }} /> : <p className="employeeDetailName1">{settings?.name}</p>}
                            {loading ? <Skeleton count={1} width="300px" height="33px" style={{ margin: "0 0 16px 0" }} /> : <p className="employeeDetailName2">{settings?.email}</p>}
                        </div>
                        <div>
                            <CurrencyConverter userId={fixId} payrate={payrate} />
                        </div>
                    </div>
                    {isUserArchive === true && (
                        <>
                            {loading ? <Skeleton count={1} width="100px" height="24px" style={{ margin: "0 0 16px 0" }} /> : inviteStatus === false && <p onClick={() => {
                                setViewTimeline(!viewTimeline)
                                navigate("/admindashboard/adminuser", {
                                    state: fixId,
                                });
                            }} style={{
                                fontWeight: "600",
                                color: "green",
                                cursor: "pointer",
                                textDecoration: "underline"
                            }}>View timeline</p>}
                            <div>
                                {loading ? <Skeleton count={1} width="50px" height="33px" style={{ margin: "0 0 16px 0" }} /> : <p style={{
                                    color: "#0E4772",
                                    fontWeight: '600',
                                    fontSize: "22px"
                                }}>Role</p>}
                                <div>
                                    {loading ? <Skeleton count={1} width="300px" height="24px" style={{ margin: "0 0 10px 0" }} /> : <div>
                                        <input
                                            disabled={settings?.usertype === "owner" ? true : false}
                                            checked={role === "user" ? true : false}
                                            onChange={async (e) => {
                                                setRole(e.target.name)
                                                changeUserType(e.target.name)
                                            }}
                                            type="radio"
                                            id="html"
                                            name="user"
                                            value="user"
                                            className={data?.userType === "owner" ? "disabledinput" : ""}
                                        />
                                        <label for="html">User - <span style={{ fontSize: "16px", fontWeight: "600" }}>can see their own data only</span></label>
                                    </div>}
                                    {/* {loading ? <Skeleton count={1} width="600px" height="24px" /> : <div style={{ margin: "10px 0 0 0" }}>
                                    <input
                                        disabled={settings?.usertype === "owner" ? true : false}
                                        checked={role === "admin" ? true : false}
                                        onChange={async (e) => {
                                            setRole(e.target.name)
                                            changeUserType(e.target.name)
                                        }}
                                        type="radio"
                                        id="css"
                                        name="admin"
                                        value="admin"
                                        className={data?.userType === "owner" ? "disabledinput" : ""}
                                    />
                                    <label for="css">Admin - <span style={{ fontSize: "16px", fontWeight: "600" }}>full control over Team, Projects & Settings. Does not have access to owner's "My Account" page settings.</span></label>
                                </div>} */}
                                    {settings?.usertype === "owner" && <div style={{ margin: "10px 0 0 0" }}>
                                        <input
                                            disabled={settings?.usertype === "owner" ? true : false}
                                            checked={role === "owner" ? true : false}
                                            onChange={async (e) => {
                                                setRole(e.target.name)
                                                changeUserType(e.target.name)
                                            }}
                                            type="radio"
                                            id="css"
                                            name="admin"
                                            value="admin"
                                            className={data?.userType === "owner" ? "disabledinput" : ""}
                                        />
                                        <label for="css">Owner - <span style={{ fontSize: "16px", fontWeight: "600" }}>full control over Team & Settings. Does not have access to owner's "My Account" page settings.</span></label>
                                    </div>}
                                    <div style={{ margin: "10px 0 0 0" }}>
                                        <input
                                            checked={role === "manager" ? true : false}
                                            onChange={async (e) => {
                                                setRole(e.target.name)
                                                changeUserType(e.target.name)
                                            }}
                                            type="radio"
                                            id="owner2"
                                            name="manager"
                                            value="manager"
                                        />
                                        <label htmlFor="owner2">Manager - <span style={{ fontSize: "16px", fontWeight: "600" }}>can see selected user's Timeline & Reports (but not rates)</span></label>
                                    </div>
                                </div>
                                {role === "manager" && (
                                    <div style={{ marginTop: 20 }}>
                                        <div>
                                            <p className="employeeDetail">Manager For</p>
                                            <p style={{ fontSize: "16px", fontWeight: "400" }}>If enabled, {settings.name} will be able to see selected user's Timeline and Reports, but not rates.</p>
                                        </div>
                                        <div style={{ marginTop: 10 }}>
                                            {users?.filter(f => f._id !== fixId && f?.isArchived === false && f?.inviteStatus === false).map((f) => (
                                                <div key={f._id} style={{ display: "flex", marginBottom: 10 }}>
                                                    <input
                                                        onChange={() => {
                                                            setUsers((prevUsers) => {
                                                                return prevUsers.map((user) => {
                                                                    if (user._id === f._id) {
                                                                        const newIsAssign = !user.isAssign;
                                                                        if (newIsAssign) {
                                                                            handleAssignUser([...user.managerId, f._id]); // Pass the updated userIds array
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
                                                        }
                                                    />
                                                    <label
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
                                                    </label>
                                                    <p style={{ margin: "0 0 0 10px", color: "#aaa", fontWeight: "500" }}>{f?.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* {loading ? <Skeleton count={1} width="50px" height="33px" style={{ margin: "16px 0" }} /> : <p style={{
                                color: "#0E4772",
                                fontWeight: '600',
                                fontSize: "22px",
                                margin: "16px 0"
                            }}>Payrate</p>} */}
                                {/* {loading ? <Skeleton count={1} width="100px" height="42px" style={{ margin: "0 0 5px 0" }} /> : <p className="employeePayrate"><span style={{ color: "#50AA00" }}>USD </span>{payrate?.billingInfo?.ratePerHour ? payrate?.billingInfo?.ratePerHour : 0}</p>}
                            {loading ? <Skeleton count={1} width="75.73px" height="45.5px" style={{ margin: "10px 0 0 0" }} /> : <button onClick={changeUserType} style={{
                                marginTop: "20px",
                                border: 0,
                                backgroundColor: "#50AA00",
                                color: "#FFFFFF",
                                borderRadius: "5px",
                                width: "140px",
                                height: "43px",
                                fontSize: "17px",
                                fontWeight: 600,
                            }}>save</button>} */}
                            </div>
                        </>
                    )}
                    {/* <UserSettings /> */}
                </>
            ) : (
                <img width={500} src={settingIcon} alt="" style={{ display: "block", margin: "auto" }} />
            )}

            {/* )} */}

            {/* <div className="rightSideDiv">
                <div className="namenDeleteMain">
                    <div className="nameContentMain">
                        <h5 className="nameContent">{idsettings?.name}</h5>
                    </div>
                    <div className="pauseDeleteMain">
                        <div className="pauseMain">
                            <button className="pauseContent"><img className="paueIcon" src={pause} alt="pauseIcon.png" />Pause</button>
                        </div>
                        <div className="archiveMain">
                            <button className="pauseContent"><img className="paueIcon" src={archive} alt="Archive.png" />Archive</button>
                        </div>
                        <div className="archiveMain">
                            <button className="pauseContent"><img className="paueIcon" src={deleteIcon} alt="DeleteTeam.png" />Delete</button>
                        </div>
                    </div>

                </div>
                <div className="eamilnCountryMain">
                    <div className="emailContentMains">
                        <p className="emailContent">{idsettings?.email}</p>
                    </div>
                    <div className="countryFlag">
                        <img className="flagIcon" src={flag} alt="Flag_of_Pakistan 1.png" />
                    </div>
                </div>
                <div className="amountnChangeButtonMain">
                    <div className="amountMain">
                        <p className="amountContent">{idsettings?.billingInfo?.ratePerHour} {idsettings?.billingInfo?.currency}/hr</p>
                    </div>
                    <div className="changeButtonMain">
                        <button onClick={() => setChange(true)} className="changeContent">Change</button>
                    </div>

                </div>
                {change && <div>
                    <div>
                        <input onChange={(e) => setPrice(e.target.value)} className="priceInput" placeholder="enter your price " />
                    </div>
                    <div>
                        <input onChange={(e) => setCurrency(e.target.value)} className="priceInput" placeholder="enter your currency" />
                    </div>
                    <button onClick={changeIt} className="changeCurrency">Change</button>
                </div>}
                <div className="viewTimelineButtonMain">
                    <button className="viewTimelineContent">View timeline</button>
                </div>
                <div className="roleContentMain">
                    <div className="roleHeadingContentMain">
                        <h5 className="roleHeadingContent">Role</h5>
                    </div>
                    <form action="#" className="radio-button">
                        <p>
                            <input
                                type="radio"
                                id="test1"
                                name="radio-group"
                                value="user"
                                checked={userType === "user"}
                                onChange={handleRadioChange}
                            />
                            <label htmlFor="test1">
                                User - <span className="bulletInfo">can see their own data only</span>
                            </label>
                        </p>
                        <p>
                            <input
                                type="radio"
                                id="test2"
                                name="radio-group"
                                value="manager"
                                checked={userType === "manager"}
                                onChange={handleRadioChange}
                            />
                            <label htmlFor="test2">
                                Manager - <span className="bulletInfo">can see selected user's Timeline & Reports (but not rates)</span>
                            </label>
                        </p>
                        <p>
                            <input
                                type="radio"
                                id="test3"
                                name="radio-group"
                                value="admin"
                                checked={userType === "admin"}
                                onChange={handleRadioChange}
                            />
                            <label htmlFor="test3">
                                Admin - <span className="bulletInfo">full control over Team, Projects & Settings. Does not have access to owner's "My Account" page settings.</span>
                            </label>
                        </p>
                    </form>
                    <div className="userGroupsMain">
                        <div className="userGroupMainDiv">
                            <div>
                                <h5 className="roleHeadingContent">User Groups</h5>
                                <div className="viewTimelineButtonMain">
                                    <button className="viewTimelineContent addAll">Add all</button>
                                    <button className="viewTimelineContent">Remove all</button>
                                </div>
                            </div>
                            <div>
                                <p className="inputCheckbox"><input className="checkboxLarge" type="checkbox" />
                                    <p>Use per project pay rates</p>
                                </p>
                            </div>
                        </div>
                        <div className="toggleMainContent">
                            {data && settings?.map((e, i) => (

                                <div className="toggleMain" key={i}>
                                    <label className="switch" htmlFor={i}>
                                        <input

                                            className="toggleContent"
                                            type="checkbox"
                                            onClick={() => clickme(e.name, e._id, i)}
                                            id={i}
                                        />
                                        <div className="slider round"></div>
                                        <label className="groupLabel" htmlFor="group">
                                            {e.name}
                                        </label>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="projectsGroupsMain">
                        <div className="userGroupMainDiv">
                            <div>
                                <h5 className="roleHeadingContent">Projects</h5>
                                <div className="viewTimelineButtonMain">
                                    <button className="viewTimelineContent addAll">Add all</button>
                                    <button className="viewTimelineContent">Remove all</button>
                                </div>
                            </div>
                            <div>
                                <p className="inputCheckbox"><input className="checkboxLarge" type="checkbox" />
                                    <p>Use per project pay rates</p>
                                </p>
                            </div>
                        </div>
                        <div className="toggleMainContent">
                            {project && project?.map((e, i) => (

                                <div className="toggleMain" key={i}>
                                    <label className="switch" htmlFor={e._id}>
                                        <input

                                            className="toggleContent"
                                            type="checkbox"
                                            onClick={() => addUserToProject(e.name, e._id, i)}
                                            id={e._id}
                                        />
                                        <div className="slider round"></div>
                                        <label className="groupLabel" htmlFor="group">
                                            {e.name}
                                        </label>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="settingsMainContent">
                        <div className="settingsnHeadingMain">
                            <h5 className="roleHeadingContent">Effective settings</h5>
                        </div>
                        <div className="settingheading">
                            <h6 className="settingheadingMain">Screenshots</h6>
                            <button onClick={() => moveMe("component1")} className="settingButton">{screenshot && screenshot?.screenshots?.frequency} {screenshot && screenshot?.screenshots?.allowBlur ? "Allow blur" : "Do not Allow Blur"}</button>
                            <div><img className="editSettings" src={edit} /></div>

                        </div>
                        <div className="settingheading">
                            <h6 className="settingheadingMain">Activity Level tracking</h6>
                            <button onClick={() => moveMe("component2")} className="settingButton">{screenshot && screenshot?.activityLevelTracking ? "Track" : "Do not Track"}</button>
                            <div><img className="editSettings" src={edit} /></div>


                        </div>
                        <div className="settingheading">
                            <h6 className="settingheadingMain">App & URL tracking</h6>
                            <button onClick={() => moveMe("component3")} className="settingButton">{screenshot && screenshot?.allowAddingOfflineTime ? "Track" : "Do not Track"}</button>
                            <div><img className="editSettings" src={edit} /></div>

                        </div>
                        <div className="settingheading">
                            <h6 className="settingheadingMain">Weekly time limit</h6>
                            <button onClick={() => moveMe("component4")} className="settingButton">{screenshot && screenshot?.weeklyTimeLimit} Hours</button>
                            <div><img className="editSettings" src={edit} /></div>
                            <div><input placeholder="Enter Hour" /></div>
                        </div>
                        <div className="settingheading">
                            <h6 className="settingheadingMain">Auto-pause tracking after</h6>
                            <button onClick={() => moveMe("component5")} className="settingButton">{screenshot && screenshot?.autoPauseTrackingAfter} minutes</button>
                            <div><img className="editSettings" src={edit} /></div>

                        </div>
                        <div className="settingheading">
                            <h6 className="settingheadingMain">Allow adding Offline Time</h6>
                            <button onClick={() => moveMe("component6")} className="settingButton">{screenshot && screenshot?.allowAddingOfflineTime ? "Allow" : "Do not Allow"}</button>
                            <div><img className="editSettings" src={edit} /></div>

                        </div>
                        <div className="settingheading">
                            <h6 className="settingheadingMain">Notify when screenshot is taken</h6>
                            <button onClick={() => moveMe("component7")} className="settingButton">{screenshot && screenshot?.notifyWhenScreenshotTaken ? "Notify" : "Do not Notify"}</button>
                            <div><img className="editSettings" src={edit} /></div>

                        </div>
                    </div>
                </div>
            </div> */}
        </div>

    )
}
export default AdminTeamComponent;