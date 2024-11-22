import React, { useEffect, useState } from "react";
import groupCompany from "../images/Group.webp";
import line from "../images/Line 3.webp";
import SystemAdminComponent from "../systemAdmin/component/systemAdminComponent";
import axios from "axios";
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import useLoading from "../hooks/useLoading";
import { useNavigate } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";

function SystemAdminDashboard() {

    const [show, setShow] = useState(false);
    const [activeId, setActiveId] = useState(null)
    const [mainId, setMainId] = useState(null)
    const [users, setUsers] = useState([]);
    const [isUserArchive, setIsUserArchive] = useState(false)
    const { loading, setLoading, loading2, setLoading2 } = useLoading()
    const navigate = useNavigate();
    const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
    const [data, setData] = useState([])
    let token = localStorage.getItem('adminToken');
    const [fixComponent, setFixComponent] = useState();
    const [mainComponent, setMainComponent] = useState();

    let headers = {
        Authorization: 'Bearer ' + token,
    }

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        setLoading(true)
        try {
            setLoading2(true)
            const response = await axios.get(`${apiUrl}/SystemAdmin/companies`, { headers })
            if (response.status) {
                setLoading(false)
                setTimeout(() => {
                    setLoading2(false)
                }, 1000);
                setData(response.data)
                console.log(response);
            }
        }
        catch (err) {
            console.log(err);
            setLoading(false)
            setTimeout(() => {
                setLoading2(false)
            }, 1000);
        }
    }

    console.log(data)

    return (
        <div>

            <div>
                <SnackbarProvider />
                <div className="container">
                    <div className="userHeader">
                        <div className="d-flex align-items-center gap-3">
                            <div><img src={groupCompany} /></div>
                            <h5>Companies</h5>
                        </div>
                    </div>
                    <div className="mainwrapper">
                        <div className="ownerTeamContainer">
                            <div className="d-flex gap-3">
                                <div style={{ width: "500px" }}>
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
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            {data?.filter((d, i) => d.owner.isArchived === false)?.length}
                                        </div>
                                    </div>
                                    <div style={{
                                        height: data?.filter((d, i) => d.owner.isArchived === false).length >= 5 && 300,
                                        overflowY: data?.filter((d, i) => d.owner.isArchived === false).length >= 5 && "scroll",
                                        marginTop: 20
                                    }}>
                                        {loading ? <Skeleton count={1} height="40vh" style={{ margin: "10px 0 0 0" }} /> : users && data?.filter((d, i) => d.owner.isArchived === false)?.map((e, i) => {
                                            return loading2 ? (
                                                <Skeleton count={1} height="56px" style={{ margin: "10px 0 0 0" }} />
                                            ) : (
                                                <div className={`adminTeamEmployess ${activeId === e._id ? "activeEmploy" : ""} align-items-center gap-1`} onClick={() => {
                                                    setActiveId(e._id)
                                                    setIsUserArchive(false)
                                                }}>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <div className="groupContentMainImg">
                                                            <p>{i + 1}</p>
                                                        </div>
                                                        <p className="groupContent">{e?.owner?.company}</p>
                                                    </div>
                                                    {e?.userType === "owner" ? <div>
                                                        <AiFillStar color="#e7c741" size={20} />
                                                    </div> : null}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="archiveFont">
                                        <p style={{
                                            margin: 0,
                                            padding: 0,
                                            fontSize: "20px",
                                            color: "#727272",
                                            fontWeight: "600",
                                        }}>Disable</p>
                                        <div style={{
                                            backgroundColor: "#727272",
                                            color: "white",
                                            fontSize: "600",
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            {data?.filter((d, i) => d.owner.isArchived === true)?.length}
                                        </div>
                                    </div>
                                    <div style={{
                                        height: data?.filter((d, i) => d.owner.isArchived === true)?.length >= 5 && 300,
                                        overflowY: data?.filter((d, i) => d.owner.isArchived === true)?.length >= 5 && "scroll",
                                        marginTop: 20
                                    }}>
                                        {loading ? <Skeleton count={1} height="20vh" style={{ margin: "10px 0 0 0" }} /> : users && data?.filter((d, i) => d.isArchived === true)?.map((e, i) => {
                                            return loading2 ? (
                                                <Skeleton count={1} height="56px" style={{ margin: "10px 0 0 0" }} />
                                            ) : (
                                                <div className={`adminTeamEmployess ${activeId === e._id ? "activeEmploy" : ""} align-items-center gap-1`} onClick={() => {
                                                    setActiveId(e._id)
                                                    setIsUserArchive(true)
                                                }}>
                                                    <div>
                                                        <div className="groupContentMainImg">
                                                            <p>{i + 1}</p>
                                                        </div>
                                                        <p className="groupContent archive-user">{e?.owner?.company}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <img src={line} />
                                </div>
                                <div style={{ width: "100%", display: mainId === null ? "flex" : "", justifyContent: mainId === null ? "center" : "", alignItems: mainId === null ? "center" : "" }}>
                                    <SystemAdminComponent
                                        fixId={mainId}
                                        getCompanies={getData}
                                        isUserArchive={isUserArchive}
                                        fixComponent={mainComponent ? mainComponent : fixComponent}
                                        show={show}
                                        setShow={setShow}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SystemAdminDashboard;