import React, { useEffect, useState } from "react";
import menu from "../images/menu.webp";
import loader from "../images/Rectangle.webp";
import check from "../images/online.webp";
import circle from "../images/circle.webp";
import UserHeader from "../screen/component/userHeader";
import screenshot from "../images/white.svg";
import setting from "../images/setting.webp";
import line from "../images/line.webp";
import Footer from "../screen/component/footer";
// import AdminHeader from "../screen/component/adminHeader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AdminHead from "../screen/component/adminHeadSection";
import offline from "../images/not-active.svg";
import groupCompany from "../images/Group.webp"
import AdminHeader from "./component/adminHeader";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import useLoading from "../hooks/useLoading";
import axios from "axios";
import noResultFound from '../images/no-result-found.svg'
import Pusher from 'pusher-js';
import { useDispatch, useSelector } from "react-redux";
import { searchUsers } from "../store/timelineSlice";
import { GetTimelineUsersAdmin } from "../middlewares/timeline";
import { getEmployess, setEmployess } from "../store/adminSlice";

function AdminDashboard() {

    const { loading, setLoading, loading2, setLoading2 } = useLoading()
    const [data, setData] = useState(null)
    const [error, setError] = useState(false)
    const [lastScreenshot, setLastScreenshot] = useState(null)
    const [activeUser, setActiveUser] = useState(null)
    const [searchResults, setSearchResults] = useState(null)
    const navigate = useNavigate();
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("items"));
    const headers = {
        Authorization: "Bearer " + token,
    };
    const dispatch = useDispatch()
    const timeline = useSelector((state) => state?.timelineSlice?.timeline)
    const state = useSelector((state) => state)

    // Enable pusher logging - don't include this in production
    // Pusher.logToConsole = true;

    // var pusher = new Pusher('334425b3c859ed2f1d2b', {
    //     cluster: 'ap2'
    // });

    // var channel = pusher.subscribe('ss-track');

    // channel.bind('my-user', (data) => {
    //     setActiveUser(data?.data)
    //     console.log("active user ===>", data.data);
    // });

    // useEffect(() => {
    //     var channel = pusher.subscribe('ss-track');
    //     channel.bind("new-ss", (data) => {
    //         setLastScreenshot(data?.data)
    //         console.log("new ss ===>", data);
    //     });
    //     return () => {
    //         channel.unbind("new-ss");
    //     };
    // }, [])

    // channel.bind('my-event', (data) => {
    //     console.log(JSON.stringify(data));
    // });

    async function getData() {
        try {
            const response = await fetch(`${apiUrl}/superAdmin/employees`, { headers })
            const json = await response.json();
            const filterEmployess = json?.convertedEmployees?.filter((employess, index) => user.company === employess.company && user.email !== employess.email && employess.userType !== "owner")
            dispatch(getEmployess(filterEmployess))
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        dispatch(GetTimelineUsersAdmin(headers))
        getData()
    }, [])

    function moveOnlineUsers(userId) {
        navigate("/admindashboard/adminuser", {
            state: userId,
        });
    }

    function handleSearchEmployee(e) {
        const searchValue = e?.target?.value;
        dispatch(searchUsers(searchValue));
    }

    console.log(state);

    return (
        <div>
            <div className="container">
                <div className="userHeader">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                        <div><img src={groupCompany} /></div>
                        <h5>All Employee {data?.totalUsers}</h5>
                    </div>
                    <div>
                        <input
                            onChange={(e) => handleSearchEmployee(e)}
                            placeholder="Search employee"
                            style={{
                                width: "300px",
                                borderRadius: "5px",
                                padding: "12px 20px",
                                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                                border: "none",
                                outline: "none"
                            }} />
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="employeeDashboardContainer">
                        <div>
                            <div>
                                <div className="dashheadings">
                                    <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop">Employee</p>
                                    <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">Last active</p>
                                    <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">Today</p>
                                    <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">Yesterday</p>
                                    <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">This week</p>
                                    <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">This Month</p>
                                </div>
                            </div>
                        </div>
                        <div className="bgColorChangeGreen" style={{ marginTop: "20px" }}>
                            {loading ? <Skeleton count={1} height="100vh" style={{ margin: "0 0 10px 0" }} /> : timeline?.length > 0 ? timeline?.map((user, index) => {
                                return loading2 ? (
                                    <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                                ) : (
                                    <div className="dashsheadings" key={user.userId} onClick={() => moveOnlineUsers(user.userId)}>
                                        <div className="companyNameverified">
                                            <img src={user?.userId === activeUser?._id && activeUser?.isActive === true ? check : user?.isActive === true ? check : offline} alt="Verified" />
                                            <h5 className="dashCompanyName">{user?.userName}</h5>
                                        </div>
                                        <div className="companyNameverified lastActive" style={{ width: "100%" }}>
                                            <img
                                                onClick={() => moveOnlineUsers(user.userId)}
                                                className="screenShotPreview"
                                                src={lastScreenshot?.user_id === user?.userId ? lastScreenshot?.key : user?.recentScreenshot ? user?.recentScreenshot?.key : screenshot}
                                                alt="Screenshot"
                                            />
                                            <p className="dashheadingtop">
                                                ({user?.minutesAgo === "0 minutes ago" ? "just now" : user?.minutesAgo})
                                            </p>
                                        </div>
                                        <div className="nameVerified">
                                            <p className="dashheadingtop textalign">{user?.totalHours?.daily}</p>
                                            <p className="screenShotAmount" style={{ color: user.isActive === false && "#28659C" }}>${user?.billingAmounts?.daily}</p>
                                        </div>
                                        <div className="nameVerified">
                                            <p className="dashheadingtop textalign">{user?.totalHours?.yesterday}</p>
                                            <p className="screenShotAmount" style={{ color: user.isActive === false && "#28659C" }}>${user?.billingAmounts?.yesterday}</p>
                                        </div>
                                        <div className="nameVerified">
                                            <p className="dashheadingtop textalign">{user?.totalHours?.weekly}</p>
                                            <p className="screenShotAmount" style={{ color: user.isActive === false && "#28659C" }}>${user?.billingAmounts?.weekly}</p>
                                        </div>
                                        <div className="nameVerified">
                                            <p className="dashheadingtop textalign">{user?.totalHours?.monthly}</p>
                                            <p className="screenShotAmount" style={{ color: user.isActive === false && "#28659C" }}>${user?.billingAmounts?.monthly}</p>
                                        </div>
                                    </div>
                                )
                            }) : (
                                error === true ? (
                                    <Skeleton count={1} height="100vh" style={{ margin: "0 0 10px 0" }} />
                                ) : (
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        minHeight: "80vh"
                                    }}>
                                        <img style={{ width: "50%" }} src={noResultFound} />
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
