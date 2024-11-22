import React, { useEffect, useMemo, useState } from "react";
import OwnerSection from "./ownerComponent/ownerSection";
import groupCompany from "../images/Group.webp"
import screenshot from "../images/white.svg";
import offline from "../images/not-active.svg";
import check from "../images/online.webp";
import { useNavigate } from "react-router-dom";
import line from "../images/line.webp";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import useLoading from "../hooks/useLoading";
import axios from "axios";
import noResultFound from '../images/no-result-found.svg'
import Pusher from 'pusher-js';
import { getTimeline, searchUsers } from "../store/timelineSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetAllTimelineUsersOwner, GetTimelineUsers } from "../middlewares/timeline";
import { getEmployess } from "../store/adminSlice";

function CompanyOwner() {

    const [lastScreenshot, setLastScreenshot] = useState(null)
    const [error, setError] = useState(false)
    const [activeUser, setActiveUser] = useState(null)
    const navigate = useNavigate()
    const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
    const token = localStorage.getItem('token');
    const user = JSON.stringify(localStorage.getItem('items'));
    const [data, setData] = useState(null)
    const [searchResults, setSearchResults] = useState(null)
    const headers = {
        Authorization: "Bearer " + token,
    };
    const timeline = useSelector((state) => state.timelineSlice.timeline)
    const loading = useSelector((state) => state.loading)
    const dispatch = useDispatch()
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
            const response = await fetch(`${apiUrl}/owner/companies`, { headers })
            const json = await response.json();
            const filterEmployess = json?.employees?.filter((employess, index) => user.company === employess.company && user.email !== employess.email && employess.userType !== "owner")
            dispatch(getEmployess(filterEmployess))
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // if (timeline && timeline?.length === 0) {
        dispatch(GetAllTimelineUsersOwner(headers))
        getData()
        // }
    }, [])

    function moveOnlineUsers(userId) {
        console.log(userId);
        navigate("/company-owner/company-individual-user", {
            state: userId,
        });
    }

    function handleSearchEmployee(e) {
        const searchValue = e?.target?.value;
        dispatch(searchUsers(searchValue));
    }

    console.log(timeline);

    return (
        <>
            <div className="container">
                <div>
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
                        <div className="systemOwnerContainer">
                            <div className="dashheadings">
                                <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop">Employee</p>
                                <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">Last active</p>
                                <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">Today</p>
                                <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">Yesterday</p>
                                <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">This week</p>
                                <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">This Month</p>
                            </div>
                            <div className="bgColorChangeGreen" style={{ marginTop: "20px" }}>
                                {loading ? (
                                    <>
                                        <Skeleton count={1} height="400px" style={{ margin: "0 0 10px 0" }} />
                                    </>
                                ) :
                                    timeline?.length > 0 ?
                                        // timeline?.sort((a, b) => {
                                        //     const timestampA = b?.recentScreenshot?.createdAt || 0;
                                        //     const timestampB = a?.recentScreenshot?.createdAt || 0;
                                        //     if (timestampA === 0 && timestampB === 0) return 0;
                                        //     if (timestampA === 0) return -1;
                                        //     if (timestampB === 0) return 1;
                                        //     return timestampA - timestampB;
                                        // })
                                        timeline?.map((user, index) => {
                                            return (
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
                                                            ({user?.minutesAgo === "0 minutes ago" ? "a minute ago" : user?.minutesAgo})
                                                        </p>
                                                    </div>
                                                    <div className="nameVerified">
                                                        <p className="dashheadingtop textalign">{user?.totalHours?.daily}</p>
                                                        <p className="screenShotAmount" style={{ color: user.isActive === true && "#28659C" }}>${user?.billingAmounts?.daily}</p>
                                                    </div>
                                                    <div className="nameVerified">
                                                        <p className="dashheadingtop textalign">{user?.totalHours?.yesterday}</p>
                                                        <p className="screenShotAmount" style={{ color: user.isActive === true && "#28659C" }}>${user?.billingAmounts?.yesterday}</p>
                                                    </div>
                                                    <div className="nameVerified">
                                                        <p className="dashheadingtop textalign">{user?.totalHours?.weekly}</p>
                                                        <p className="screenShotAmount" style={{ color: user.isActive === true && "#28659C" }}>${user?.billingAmounts?.weekly}</p>
                                                    </div>
                                                    <div className="nameVerified">
                                                        <p className="dashheadingtop textalign">{user?.totalHours?.monthly}</p>
                                                        <p className="screenShotAmount" style={{ color: user.isActive === true && "#28659C" }}>${user?.billingAmounts?.monthly}</p>
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
                <img className="userDetailLine" src={line} />
            </div>
        </>
    )
}

export default CompanyOwner;