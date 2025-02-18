import React, { useEffect, useState } from "react";
import line from "../images/line.webp";
import check from "../images/online.webp";
import screenshot from "../images/whiteImages.PNG";
import setting from "../images/setting.webp";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import useLoading from "../hooks/useLoading";
import axios from "axios";
import offline from "../images/not-active.svg";
import moment from 'moment-timezone';
// import socket from '../io';
import { io } from 'socket.io-client'; // Correct import
import { useSocket } from '../io'; // Correct import
import { useQuery } from 'react-query';
import jwtDecode from "jwt-decode";
const fetcher = (url, headers) => axios.get(url, { headers }).then((res) => res.data);



function UserDashboard() {
    const [activeUser, setActiveUser] = useState(null);
    const { loading, setLoading } = useLoading();
    const [data, setData] = useState(null);
    const [data2, setData2] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [lastActiveSortOrder, setLastActiveSortOrder] = useState('asc');
    const [todaySortOrder, setTodaySortOrder] = useState('asc');
    const [yesterdaySortOrder, setYesterdaySortOrder] = useState('asc');
    const [thisWeekSortOrder, setThisWeekSortOrder] = useState('asc');
    const [thisMonthSortOrder, setThisMonthSortOrder] = useState('asc');
    const [socketData, setSocketData] = useState(null); // State to store data from socket
    const navigate = useNavigate();
    const socket = useSocket()
    const token = localStorage.getItem("token");
    let user;

    try {
        if (token) {
            user = jwtDecode(JSON.stringify(token));// Decode token
        } else {
            throw new Error("Token is not available");
        }
    } catch (error) {
        console.error("Invalid token:", error.message);
        localStorage.removeItem("token"); // Remove invalid token
        user = null;
        navigate("/");
        window.location.reload(); // Reload the page
    }

    //
    const headers = {
        Authorization: 'Bearer ' + token,
    };

 


    // Define URLs based on user type
    const userUrl = user?.userType === 'user' ? 'https://myuniversallanguages.com:9093/api/v1/timetrack/hours' : null;
    const ownerUrl = (user?.userType === 'owner' || user?.userType === 'admin') ? 'https://myuniversallanguages.com:9093/api/v1/owner/getCompanyemployee' : null;
    const managerUrl = user?.userType === 'manager' ? 'https://myuniversallanguages.com:9093/api/v1/manager/dashboard' : null;

    // Use React Query to fetch data
    const { data: userData, error: userError, isLoading: isUserLoading } = useQuery({
        queryKey: ['userData', userUrl],
        queryFn: () => fetcher(userUrl, headers),
        enabled: !!userUrl // Only fetch if userUrl is defined
    });

    const { data: ownerData, error: ownerError, isLoading: isOwnerLoading } = useQuery({
        queryKey: ['ownerData', ownerUrl],
        queryFn: () => fetcher(ownerUrl, headers),
        enabled: !!ownerUrl // Only fetch if ownerUrl is defined
    });

    const { data: managerData, error: managerError, isLoading: isManagerLoading } = useQuery({
        queryKey: ['managerData', managerUrl],
        queryFn: () => fetcher(managerUrl, headers),
        enabled: !!managerUrl // Only fetch if managerUrl is defined
    });

    // Handle the fetched data
    const processOwnerData = (data) => {
        if (data) {
            const onlineUsers = data?.onlineUsers?.length > 0 ? data.onlineUsers : [];
            const offlineUsers = data?.offlineUsers?.length > 0 ? data.offlineUsers : [];
            const allUsers = [...onlineUsers, ...offlineUsers];
            return allUsers.filter((f) => f.isArchived === false && f.UserStatus === false);
        }
        return [];
    };

    const processManagerData = (data) => {
        if (data) {
            const onlineUsers = data?.onlineUsers?.length > 0 ? data.onlineUsers : [];
            const offlineUsers = data?.offlineUsers?.length > 0 ? data.offlineUsers : [];
            const allUsers = [...onlineUsers, ...offlineUsers];
            return allUsers.filter((f) => f.isArchived === false && f.UserStatus === false);
        }
        return [];
    };

    // Determine if loading
    const isLoading = isUserLoading || isOwnerLoading || isManagerLoading;

    if (userError || ownerError || managerError) {
        console.error('Error fetching data:', userError || ownerError || managerError);
        // return <div>Error loading data</div>;
    }

    const getManagerData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`https://myuniversallanguages.com:9093/api/v1/manager/dashboard`, {
                headers: headers,
            })
            if (response.status) {
                setLoading(false)
                const onlineUsers = response.data?.onlineUsers?.length > 0 ? response.data?.onlineUsers : []
                const offlineUsers = response.data?.offlineUsers?.length > 0 ? response.data?.offlineUsers : []
                const allUsers = [...onlineUsers, ...offlineUsers];
                setData2(allUsers.filter((f) => f.isArchived === false && f.UserStatus === false))
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    const getOwnerData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`https://myuniversallanguages.com:9093/api/v1/owner/getCompanyemployee`, {
                headers: headers,
            })
            if (response.status) {
                setLoading(false)
                const onlineUsers = response.data?.onlineUsers?.length > 0 ? response.data?.onlineUsers : []
                const offlineUsers = response.data?.offlineUsers?.length > 0 ? response.data?.offlineUsers : []
                const allUsers = [...onlineUsers, ...offlineUsers];
                console.log(response.data);
                // localStorage.setItem('cachedData', JSON.stringify(filteredUsers));
                setData2(allUsers.filter((f) => f.isArchived === false && f.UserStatus === false))
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    async function getUserData() {
        setLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/timetrack/hours`, {
                headers,
            })
            if (response.status) {
                setData(response.data)
                setLoading(false)
                console.log(response);
            }
        }
        catch (error) {
            setLoading(false)
            console.log(error);
        }
    }


    const getTimeAgo = lastActiveTime => {
        const currentTime = new Date();
        const timeDiffInMs = currentTime.getTime() - lastActiveTime.getTime();
        const minutesAgo = Math.floor(timeDiffInMs / (1000 * 60));
        const hoursAgo = Math.floor(timeDiffInMs / (1000 * 60 * 60));
        const daysAgo = Math.floor(timeDiffInMs / (1000 * 60 * 60 * 24));
        const monthsAgo = Math.floor(daysAgo / 30); // Calculate months

        if (minutesAgo < 60) {
            return minutesAgo !== 1 && minutesAgo > 0
                ? `${minutesAgo} minutes ago`
                : `just now`;
        } else if (hoursAgo < 24) {
            return hoursAgo > 1 ? `${hoursAgo} hours ago` : `${hoursAgo} hour ago`;
        } else if (daysAgo < 30) {
            return daysAgo > 1 ? `${daysAgo} days ago` : `${daysAgo} day ago`;
        } else if (monthsAgo < 12) {
            return monthsAgo > 1 ? `${monthsAgo} months ago` : `${monthsAgo} month ago`;
        } else {
            const yearsAgo = Math.floor(monthsAgo / 12);
            return yearsAgo > 1 ? `${yearsAgo} years ago` : `${yearsAgo} year ago`;
        }
    };


    useEffect(() => {
        if (!socket) {
            console.error('Socket instance is null or undefined');
            return;
        }

        const handleNewSS = (data) => {
            console.log("New data received from socket:", data);
            setData2(prevData => {
                const updatedData = prevData.map(user => {
                    if (user.userId === data.user_id) {
                        const lastActiveTime = new Date(data.createdAt);
                        const timeAgo = getTimeAgo(lastActiveTime);
                        return {
                            ...user,
                            recentScreenshot: { ...user.recentScreenshot, key: data.key },
                            minutesAgo: timeAgo
                        };
                    }
                    return user;
                });
                console.log("Updated data:", updatedData);
                return updatedData;
            });
        };

        const handleProfileUpdate = (data) => {
            console.log("Profile update received from socket:", data);
            setData2(prevData => {
                const updatedData = prevData.map(user => {
                    if (user.userId === data.user_id) {
                        return {
                            ...user,
                            name: data.name
                        };
                    }
                    return user;
                });
                console.log("Updated data:", updatedData);
                return updatedData;
            });
        };

        socket.on('new-ss', handleNewSS);
        socket.on('profile_update', handleProfileUpdate);


        return () => {
            socket.off('new-ss', handleNewSS);
        };


    }, [socket]);


    useEffect(() => {
        if (userData) {
            setData(userData);
        }
    }, [userData]);

    useEffect(() => {
        if (ownerData) {
            const onlineUsers = ownerData?.onlineUsers?.length > 0 ? ownerData.onlineUsers : [];
            const offlineUsers = ownerData?.offlineUsers?.length > 0 ? ownerData.offlineUsers : [];
            const allUsers = [...onlineUsers, ...offlineUsers];
            setData2(allUsers.filter((f) => f.isArchived === false && f.UserStatus === false));
        }
    }, [ownerData]);

    useEffect(() => {
        if (managerData) {
            const onlineUsers = managerData?.onlineUsers?.length > 0 ? managerData.onlineUsers : [];
            const offlineUsers = managerData?.offlineUsers?.length > 0 ? managerData.offlineUsers : [];
            const allUsers = [...onlineUsers, ...offlineUsers];
            setData2(allUsers.filter((f) => f.isArchived === false && f.UserStatus === false));
        }
    }, [managerData]);


    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

    const fetchData = async () => {
        setLoading(true);
        try {
            let endpoint;
            if (user?.userType === "user") {
                endpoint = `${apiUrl}/timetrack/hours`;
            } else if (user?.userType === "owner" || user?.userType === "admin") {
                endpoint = `${apiUrl}/owner/getCompanyemployee`;
            } else if (user?.userType === "manager") {
                endpoint = `${apiUrl}/manager/dashboard`;
            }
            const response = await axios.get(endpoint, { headers });
            if (response.status === 200) {
                setLoading(false);
                const onlineUsers = response.data?.onlineUsers || [];
                const offlineUsers = response.data?.offlineUsers || [];
                const allUsers = [...onlineUsers, ...offlineUsers];
                const filteredUsers = allUsers.filter(f => !f.isArchived && !f.UserStatus);
                setData2(filteredUsers);
                localStorage.setItem('cachedData', JSON.stringify(filteredUsers));
                // Fetch additional data for owner/admin
                if (user?.userType === "owner" || user?.userType === "admin") {
                    const responseTotalHours = await axios.get(`${apiUrl}/owner/getTotalHoursAll`, { headers });
                    if (responseTotalHours.status === 200) {
                        // Process responseTotalHours.data as needed
                        console.log("Total hours data:", responseTotalHours.data);
                        // Update state or perform actions with this data
                    }

                    const responseOnlineOfflineUsers = await axios.get(`${apiUrl}/owner/getOnlineOfflineUsers`, { headers });
                    if (responseOnlineOfflineUsers.status === 200) {
                        // Process responseOnlineOfflineUsers.data as needed
                        console.log("Online/offline users data:", responseOnlineOfflineUsers.data);
                        // Update state or perform actions with this data
                    }
                }
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };



    // const items = jwtDecode(JSON.stringify(token));
    let items;

    if (token) {
        items = jwtDecode(JSON.stringify(token));
    } else {
        // Run any other line of code if token is not available
        items = null
        console.log("Token is not available");
        // You can place any other logic you want to run here
    }
    const offsetInMinutes = moment.tz(items?.timezone).utcOffset();
    const offsetInHours = offsetInMinutes / 60;
    const offsetSign = offsetInHours >= 0 ? '+' : '-';
    const formattedOffset = `${offsetSign}${Math.abs(offsetInHours)}`;

    // Helper function to convert time description to minutes
    const convertToMinutes = (description) => {
        if (description.includes('minute')) return parseInt(description);
        if (description.includes('hour')) return parseInt(description) * 60;
        if (description.includes('day')) return parseInt(description) * 1440;
        if (description.includes('week')) return parseInt(description) * 10080;
        if (description.includes('month')) return parseInt(description) * 43200;
        return 0;
    };

    // Function to handle sorting of employees by name
    const handleSort = () => {
        const sorted = [...data2].sort((a, b) => {
            const nameA = a.userName.toUpperCase();
            const nameB = b.userName.toUpperCase();
            return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
        setData2(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    // Function to handle sorting of employees by last active time
    const handleLastActiveSort = () => {
        const sorted = [...data2].sort((a, b) => {
            const minutesA = convertToMinutes(a.minutesAgo);
            const minutesB = convertToMinutes(b.minutesAgo);
            return lastActiveSortOrder === 'asc' ? minutesA - minutesB : minutesB - minutesA;
        });
        setData2(sorted);
        setLastActiveSortOrder(lastActiveSortOrder === 'asc' ? 'desc' : 'asc');
    };

    // Function to handle sorting of employees by today's data
    const handleTodaySort = () => {
        const sorted = [...data2].sort((a, b) => {
            const todayHoursA = a.totalHours?.daily || 0;
            const todayHoursB = b.totalHours?.daily || 0;
            return todaySortOrder === 'asc' ? todayHoursA - todayHoursB : todayHoursB - todayHoursA;
        });
        setData2(sorted);
        setTodaySortOrder(todaySortOrder === 'asc' ? 'desc' : 'asc');
    };

    // Function to handle sorting of employees by yesterday's data
    const handleYesterdaySort = () => {
        const sorted = [...data2].sort((a, b) => {
            const yesterdayHoursA = a.totalHours?.yesterday || 0;
            const yesterdayHoursB = b.totalHours?.yesterday || 0;
            return yesterdaySortOrder === 'asc' ? yesterdayHoursA - yesterdayHoursB : yesterdayHoursB - yesterdayHoursA;
        });
        setData2(sorted);
        setYesterdaySortOrder(yesterdaySortOrder === 'asc' ? 'desc' : 'asc');
    };

    // Function to handle sorting of employees by this week's data
    const handleThisWeekSort = () => {
        const sorted = [...data2].sort((a, b) => {
            const thisWeekHoursA = a.totalHours?.weekly || 0;
            const thisWeekHoursB = b.totalHours?.weekly || 0;
            return thisWeekSortOrder === 'asc' ? thisWeekHoursA - thisWeekHoursB : thisWeekHoursB - thisWeekHoursA;
        });
        setData2(sorted);
        setThisWeekSortOrder(thisWeekSortOrder === 'asc' ? 'desc' : 'asc');
    };

    // Function to handle sorting of employees by this month's data
    const handleThisMonthSort = () => {
        const sorted = [...data2].sort((a, b) => {
            const thisMonthHoursA = a.totalHours?.monthly || 0;
            const thisMonthHoursB = b.totalHours?.monthly || 0;
            return thisMonthSortOrder === 'asc' ? thisMonthHoursA - thisMonthHoursB : thisMonthHoursB - thisMonthHoursA;
        });
        setData2(sorted);
        setThisMonthSortOrder(thisMonthSortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="mobhayat">
            <div className="container">
                <div className="userHeader">
                    <div>
                        <h5>Employee Dashboard</h5>
                    </div>
                    <div className="headerTop">
                        <h6>All times are UTC {formattedOffset}</h6>
                        <img src={setting} alt="setting.png" style={{ cursor: "pointer" }} onClick={() => navigate("/account")} />
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="userDashboardContainer">
                        <div className="dashheadings">
                            <p
                                style={{ fontSize: "18px", color: "#0D3756", cursor: "pointer" }}
                                className="dashheadingtop"
                                onClick={handleSort}
                            >
                                Employee {sortOrder === 'asc' ? '↑' : '↓'}
                            </p>
                            <p
                                style={{ fontSize: "18px", color: "#0D3756", cursor: "pointer" }}
                                className="dashheadingtop textalign"
                                onClick={handleLastActiveSort}
                            >
                                Last active {lastActiveSortOrder === 'asc' ? '↑' : '↓'}
                            </p>
                            <p
                                style={{ fontSize: "18px", color: "#0D3756", cursor: "pointer" }}
                                className="dashheadingtop textalign"
                                onClick={handleTodaySort}
                            >
                                Today {todaySortOrder === 'asc' ? '↑' : '↓'}
                            </p>
                            <p
                                style={{ fontSize: "18px", color: "#0D3756", cursor: "pointer" }}
                                className="dashheadingtop textalign"
                                onClick={handleYesterdaySort}
                            >
                                Yesterday {yesterdaySortOrder === 'asc' ? '↑' : '↓'}
                            </p>
                            <p
                                style={{ fontSize: "18px", color: "#0D3756", cursor: "pointer" }}
                                className="dashheadingtop textalign"
                                onClick={handleThisWeekSort}
                            >
                                This week {thisWeekSortOrder === 'asc' ? '↑' : '↓'}
                            </p>
                            <p
                                style={{ fontSize: "18px", color: "#0D3756", cursor: "pointer" }}
                                className="dashheadingtop textalign"
                                onClick={handleThisMonthSort}
                            >
                                This month {thisMonthSortOrder === 'asc' ? '↑' : '↓'}
                            </p>
                        </div>
                        {isLoading ? (
                            <>
                                <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                                <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                                <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                                <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                                <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                                <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                            </>
                        ) : (
                            <>
                                {user?.userType === "user" ? (
                                    <div onClick={() => navigate(`/timeline`)} className={`dashsheadings ${data?.isActive === true ? "activeColorChange" : "bgColorChange"}`} key={data?.userId}>
                                        <div className="companyNameverified">
                                            <img src={activeUser?.isActive ? check : data?.data?.isActive ? check : offline} alt="Verified" />
                                            <h5 className="dashCompanyName">{data?.data?.name}</h5>
                                        </div>
                                        <div className="companyNameverified lastActive" style={{ width: "100%" }}>
                                            <img
                                                className="screenShotPreview"
                                                src={data?.data?.lastScreenshot?.key ? data?.data?.lastScreenshot?.key : screenshot}
                                                alt="Screenshot"
                                            />
                                            <p className="dashheadingtop">
                                                ({data?.data?.lastActiveTime === "0 minutes ago" ? "just now" : data?.data?.lastActiveTime})
                                            </p>
                                        </div>
                                        <div className="nameVerified">
                                            <p className="dashheadingtop textalign">{data?.data?.totalHours?.daily}</p>
                                            <p className="screenShotAmount" style={{ color: data?.isActive === false && "#28659C" }}>${data?.data?.billingAmounts?.daily}</p>
                                        </div>
                                        <div className="nameVerified">
                                            <p className="dashheadingtop textalign">{data?.data?.totalHours?.yesterday}</p>
                                            <p className="screenShotAmount" style={{ color: data?.isActive === false && "#28659C" }}>${data?.data?.billingAmounts?.yesterday}</p>
                                        </div>
                                        <div className="nameVerified">
                                            <p className="dashheadingtop textalign">{data?.data?.totalHours?.weekly}</p>
                                            <p className="screenShotAmount" style={{ color: data?.isActive === false && "#28659C" }}>${data?.data?.billingAmounts?.weekly}</p>
                                        </div>
                                        <div className="nameVerified">
                                            <p className="dashheadingtop textalign">{data?.data?.totalHours?.monthly}</p>
                                            <p className="screenShotAmount" style={{ color: data?.isActive === false && "#28659C" }}>${data?.data?.billingAmounts?.monthly}</p>
                                        </div>
                                    </div>
                                ) : (
                                    data2.map((user, index) => (
                                        <div className="dashsheadings" key={user?.userId} onClick={() => navigate(`/timeline/${user?.userId}`)}>
                                            <div className="companyNameverified">
                                                <img src={user?.userId === activeUser?._id && activeUser?.isActive === true ? check : user?.isActive === true ? check : offline} alt="Verified" />
                                                <h5 className="dashCompanyName">{user?.userName}</h5>
                                            </div>
                                            <div key={user.userId} className="companyNameverified lastActive" style={{ width: "100%" }}>
                                                <img
                                                    className="screenShotPreview"
                                                    src={user?.recentScreenshot && user?.recentScreenshot.key ? user.recentScreenshot.key : screenshot}
                                                    alt="Screenshot"
                                                />
                                                <p className="dashheadingtop">
                                                    ({user.minutesAgo === "0 minutes ago" ? "just now" : user.minutesAgo})
                                                </p>
                                            </div>




                                            <div className="nameVerified">
                                                <p className="dashheadingtop textalign">{user?.totalHours?.daily}</p>
                                                <p className="screenShotAmount" style={{ color: user?.isActive === true && "#28659C" }}>${Math.round(user?.billingAmounts?.daily || 0)}
                                                </p>
                                            </div>
                                            <div className="nameVerified">
                                                <p className="dashheadingtop textalign">{user?.totalHours?.yesterday}</p>
                                                <p className="screenShotAmount" style={{ color: user?.isActive === true && "#28659C" }}>${Math.round(user?.billingAmounts?.yesterday || 0)}</p>
                                            </div>
                                            <div className="nameVerified">
                                                <p className="dashheadingtop textalign">{user?.totalHours?.weekly}</p>
                                                <p className="screenShotAmount" style={{ color: user?.isActive === true && "#28659C" }}>${Math.round(user?.billingAmounts?.weekly || 0)}
                                                </p>
                                            </div>
                                            <div className="nameVerified">
                                                <p className="dashheadingtop textalign">{user?.totalHours?.monthly}</p>
                                                <p className="screenShotAmount" style={{ color: user?.isActive === true && "#28659C" }}>${Math.round(user?.billingAmounts?.monthly || 0)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </>
                        )}

                    </div>
                </div>
            </div>
            <img className="userDasboardLine" src={line} alt="line" />
        </div>
    );
}


export default UserDashboard;
