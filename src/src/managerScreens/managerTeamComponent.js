// import React, { useEffect, useState } from "react";
// import warning from '../images/warning.png'
// import pause from "../images/pauseIcon.webp";
// import archive from "../images/Archive.webp";
// import deleteIcon from "../images/DeleteTeam.webp";
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
// import useLoading from "../hooks/useLoading";
// import axios from "axios";
// import settingIcon from '../images/setting-icon.svg'
// import search from "../images/searchIcon.webp";
// import CurrencyConverter from "../screen/component/currencyConverter";
// import Swal from 'sweetalert2/dist/sweetalert2.js'
// import 'sweetalert2/src/sweetalert2.scss'
// import { SnackbarProvider, enqueueSnackbar } from "notistack";

// function ManagerTeamComponent(props) {

//     const { loading, setLoading } = useLoading()
//     const [viewTimeline, setViewTimeline] = useState(false)
//     const [role, setRole] = useState("")
//     const [data, setData] = useState();
//     const { fixId, archived_unarchived_users, deleteUser, isUserArchive, inviteStatus, handleSendInvitation, payrate } = props
//     const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
//     const token = localStorage.getItem('token');
//     const headers = {
//         Authorization: "Bearer " + token,
//     };

//     const getData = async (fixId) => {
//         setLoading(true)
//         try {
//             const response = await axios.get(`${apiUrl}/manager/sorted-datebased/${fixId}`, { headers })
//             if (response.status) {
//                 setLoading(false)
//                 setData(response.data.data)
//                 console.log(response);
//             }
//         }
//         catch (err) {
//             setLoading(false)
//             console.log(err);
//         }
//     }

//     async function changeUserType() {
//         Swal.fire({
//             title: `Are you sure want to update this user settings ?`,
//             // html: `<p>All of the time tracking data and screenshots for this employee will be lost.</p>`,
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#0E4772',
//             cancelButtonColor: 'grey',
//             confirmButtonText: 'Yes'
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 try {
//                     const res = await fetch(`${apiUrl}/userGroup/edit/${fixId}`, {
//                         method: "PATCH",
//                         headers: {
//                             "Content-Type": "application/json",
//                             ...headers
//                         },
//                         body: JSON.stringify({
//                             userType: role
//                         }),
//                     })
//                     const dataRes = await res.json()
//                     enqueueSnackbar(dataRes.Message, {
//                         variant: "success",
//                         anchorOrigin: {
//                             vertical: "top",
//                             horizontal: "right"
//                         }
//                     })
//                     console.log("dataRes ====>", dataRes);
//                 } catch (error) {
//                     console.log(error);
//                 }
//             }
//         })
//     }

//     useEffect(() => {
//         getData(fixId);
//     }, [fixId])

//     useEffect(() => {
//         setRole(data?.usertype)
//     }, [data])

//     console.log(data)

//     return (
//         <div style={{ width: "100% !important" }}>
//             <SnackbarProvider />
//             {fixId ? (
//                 <>
//                     <p className="fs-2 text-success ">{data?.company}</p>
//                     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
//                         <p className="employeeDetail">Employee Details</p>
//                         <div className="pauseDeleteMain">
//                             {!inviteStatus && (
//                                 <>
//                                     <div className="pauseMain">
//                                         <p><img className="paueIcon" src={pause} alt="pauseIcon.png" />Pause</p>
//                                     </div>
//                                     <div className="archiveMain" onClick={archived_unarchived_users}>
//                                         <p><img className="paueIcon" src={archive} alt="Archive.png" />{isUserArchive === false ? "Unarchive" : "Archive"}</p>
//                                     </div>
//                                 </>
//                             )}
//                             <div className="deleteMain" onClick={deleteUser}>
//                                 <p><img className="paueIcon" src={deleteIcon} alt="DeleteTeam.png" />Delete</p>
//                             </div>
//                         </div>
//                     </div>
//                     <div style={{ display: "flex", justifyContent: "space-between" }}>
//                         <div>
//                             {loading ? <Skeleton count={1} width="300px" height="42px" style={{ margin: "0 0 5px 0" }} /> : <p className="employeeDetailName1">{data?.name}</p>}
//                             {loading ? <Skeleton count={1} width="300px" height="33px" style={{ margin: "0 0 16px 0" }} /> : <p className="employeeDetailName2">{data?.email}</p>}
//                         </div>
//                         <div>
//                             <CurrencyConverter userId={fixId} payrate={payrate} />
//                         </div>
//                     </div>
//                     {loading ? <Skeleton count={1} width="100px" height="24px" style={{ margin: "0 0 16px 0" }} /> : inviteStatus === false && 
//                     <p onClick={() => {
//                         setViewTimeline(!viewTimeline)
//                     }} style={{
//                         fontWeight: "600",
//                         color: "green",
//                         cursor: "pointer",
//                         textDecoration: "underline"
//                     }}>{viewTimeline === true ? "Hide" : "View"} timeline</p>}
//                     {inviteStatus === false && viewTimeline ? (
//                         <div style={{
//                             display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "white",
//                             boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
//                             borderRadius: "20px",
//                             padding: "20px",
//                             margin: "20px 0"
//                         }}>
//                             <div style={{
//                                 textAlign: "center"
//                             }}>
//                                 <p className="employeeDetailName3">Timezone</p>
//                                 <p style={{
//                                     fontWeight: "600",
//                                     fontSize: "20px",
//                                     color: "#0E4772",
//                                     margin: "0"
//                                 }}>{data?.timezone}</p>
//                             </div>
//                             <div style={{
//                                 textAlign: "center"
//                             }}>
//                                 <p className="employeeDetailName4">Daily Hours</p>
//                                 <p style={{
//                                     fontWeight: "600",
//                                     fontSize: "20px",
//                                     color: "#0E4772",
//                                     margin: "0"
//                                 }}>{data?.totalHours?.daily}</p>
//                             </div>
//                             <div style={{
//                                 textAlign: "center"
//                             }}>
//                                 <p className="employeeDetailName5">Weekly Hours</p>
//                                 <p style={{
//                                     fontWeight: "600",
//                                     fontSize: "20px",
//                                     color: "#0E4772",
//                                     margin: "0"
//                                 }}>{data?.totalHours?.weekly}</p>
//                             </div>
//                             <div style={{
//                                 textAlign: "center"
//                             }}>
//                                 <p className="employeeDetailName6">Monthly Hours</p>
//                                 <p style={{
//                                     fontWeight: "600",
//                                     fontSize: "20px",
//                                     color: "#0E4772",
//                                     margin: "0"
//                                 }}>{data?.totalHours?.monthly}</p>
//                             </div>
//                         </div>
//                     ) : null}
//                     <div>
//                         {loading ? <Skeleton count={1} width="50px" height="33px" style={{ margin: "0 0 16px 0" }} /> : <p style={{
//                             color: "#0E4772",
//                             fontWeight: '600',
//                             fontSize: "22px"
//                         }}>Role</p>}
//                         <div>
//                             {data?.usertype !== "owner" ? loading ? <Skeleton count={1} width="300px" height="24px" style={{ margin: "0 0 10px 0" }} /> : <div>
//                                 <input
//                                     disabled={data?.usertype === "owner" ? true : false}
//                                     checked={role === "user" ? true : false}
//                                     onChange={(e) => {
//                                         setRole(e.target.name)
//                                     }}
//                                     type="radio"
//                                     id="html"
//                                     name="user"
//                                     value="user"
//                                     className={data?.userType === "owner" ? "disabledinput" : ""}
//                                 />
//                                 <label for="html">User - <span style={{ fontSize: "16px", fontWeight: "600" }}>can see their own data only</span></label>
//                             </div> : null}
//                             {data?.usertype !== "owner" ? loading ? <Skeleton count={1} width="600px" height="24px" /> : <div style={{ margin: "10px 0 0 0" }}>
//                                 <input
//                                     disabled={data?.usertype === "owner" ? true : false}
//                                     checked={role === "admin" ? true : false}
//                                     onChange={(e) => {
//                                         setRole(e.target.name)
//                                     }}
//                                     type="radio"
//                                     id="css"
//                                     name="admin"
//                                     value="admin"
//                                     className={data?.userType === "owner" ? "disabledinput" : ""}
//                                 />
//                                 <label for="css">Admin - <span style={{ fontSize: "16px", fontWeight: "600" }}>full control over Team, Projects & Settings. Does not have access to owner's "My Account" page settings.</span></label>
//                             </div> : null}
//                             {data?.usertype === "owner" && <div style={{ margin: "10px 0 0 0" }}>
//                                 <input
//                                     disabled={data?.usertype === "owner" ? true : false}
//                                     checked={role === "owner" ? true : false}
//                                     onChange={(e) => {
//                                         setRole(e.target.name)
//                                     }}
//                                     type="radio"
//                                     id="css"
//                                     name="admin"
//                                     value="admin"
//                                     className={data?.userType === "owner" ? "disabledinput" : ""}
//                                 />
//                                 <label for="css">Owner - <span style={{ fontSize: "16px", fontWeight: "600" }}>full control over Team & Settings. Does not have access to owner's "My Account" page settings.</span></label>
//                             </div>}
//                         </div>
//                         {loading ? <Skeleton count={1} width="50px" height="33px" style={{ margin: "16px 0" }} /> : <p style={{
//                             color: "#0E4772",
//                             fontWeight: '600',
//                             fontSize: "22px",
//                             margin: "16px 0"
//                         }}>Payrate</p>}
//                         {loading ? <Skeleton count={1} width="100px" height="42px" style={{ margin: "0 0 5px 0" }} /> : <p className="employeePayrate"><span style={{ color: "#50AA00" }}>USD </span>{payrate?.billingInfo?.ratePerHour ? payrate?.billingInfo?.ratePerHour : 0}</p>}
//                         {loading ? <Skeleton count={1} width="75.73px" height="45.5px" style={{ margin: "10px 0 0 0" }} /> : <button onClick={changeUserType} style={{
//                             // width: "100%",
//                             marginTop: "20px",
//                             border: 0,
//                             backgroundColor: "#50AA00",
//                             color: "#FFFFFF",
//                             borderRadius: "5px",
//                             width: "140px",
//                             height: "43px",
//                             fontSize: "17px",
//                             fontWeight: 600,
//                         }}>save</button>}
//                     </div>
//                 </>
//             ) : (
//                 <img width={500} src={settingIcon} alt="" style={{ display: "block", margin: "auto" }} />
//             )}
//         </div>
//     )
// }


// export default ManagerTeamComponent;