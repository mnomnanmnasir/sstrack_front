import React, { useEffect, useState } from "react";
import line from "../images/line.webp";
import check from "../images/online.webp";
import screenshot from "../images/whiteImages.PNG";
import setting from "../images/setting.webp";
// import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import useLoading from "../hooks/useLoading";
import axios from "axios";
import offline from "../images/not-active.svg";
import moment from 'moment-timezone';
import Joyride from 'react-joyride';
// import socket from '../io';
import { io } from 'socket.io-client'; // Correct import
import { useSocket } from '../io'; // Correct import
import { useQuery } from 'react-query';
import { useNavigate, Link } from 'react-router-dom';
import jwtDecode from "jwt-decode";

const fetcher = (url, headers) => axios.get(url, { headers }).then((res) => res.data);



function UserDashboard() {
    const [run, setRun] = useState(true);
    const [stepIndex, setStepIndex] = useState(0);
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
    const [totalUsersWorkingToday, setTotalWorking] = useState('0');
    const [totalActiveUsers, setTotalActiveUsers] = useState('0');



    const [socketData, setSocketData] = useState(null); // State to store data from socket
    const navigate = useNavigate();
    const socket = useSocket()
    const token = localStorage.getItem("token");
    const [billingSummary, setBillingSummary] = useState({
        daily: 0,
        yesterday: 0,
        weekly: 0,
        monthly: 0
    });
    const [totalAmount, setTotalAmount] = useState({
        daily: 0,
        yesterday: 0,
        weekly: 0,
        monthly: 0
    });
    let user;
    useEffect(() => {
        console.log('run--------', run)
    }, []);
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
    const steps = [
        {
            target: '.my-first-step',
            content: 'here you can see your summary of hours worked. Click on the screenshot to see details',
            //   disableBeacon: true,
            continuous: true,
        },
        {
            target: '.dashsheadings',
            content: 'Here you can see all your employees and the summary of their work. Click on the screenshot to see details',
            continuous: true,
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
            // setRun(true);
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
                        // ✅ Store billing amounts in state
                        // Update state or perform actions with this data
                    }
                }

                setTotalWorking(response.data.totalUsersWorkingToday)
                // setTotalUsers(response.data.totalUsers)
                setTotalActiveUsers(response.data.totalActiveUsers)

                // ✅ Store totalBillingAmounts directly from this response
                if (user?.userType === "owner" || user?.userType === "admin") {
                    setTotalAmount(response.data.totalBillingAmounts || {});
                    console.log("Set Billing Amount", response.data.totalBillingAmounts)
                }
                // ✅ Store totalHours directly from this response
                if (user?.userType === "owner" || user?.userType === "admin") {
                    setBillingSummary(response.data.totalHours || {});
                    console.log("Set Total Hours", response.data.totalHours)
                }
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // OR [user] if you're computing user asynchronously


    // const items = jwtDecode(JSON.stringify(token));
    let items;
    console.log('data for dashboard filter', data2)
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

    useEffect(() => {
        if (ownerData) {
            const onlineUsers = ownerData?.onlineUsers || [];
            const offlineUsers = ownerData?.offlineUsers || [];
            const allUsers = [...onlineUsers, ...offlineUsers];
            setData2(allUsers.filter((f) => !f.isArchived && !f.UserStatus));

            // ✅ Set immediately here
            setTotalWorking(ownerData.totalUsersWorkingToday);
            setTotalActiveUsers(ownerData.totalActiveUsers);
            setTotalAmount(ownerData.totalBillingAmounts || {});
            setBillingSummary(ownerData.totalHours || {});
        }
    }, [ownerData]);

    return (
        <>
            {/* <Sidebar /> */}
            <div className="mobhayat">
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
                            <div className="dashheadings dashheading-wrapper">
                                <p className="dashheadingtop heading-col" onClick={handleSort}>
                                    Employee {sortOrder === 'asc' ? '↑' : '↓'}

                                    {/* ✅ Hide for userType === "user" */}
                                    {items?.userType !== "user" && ownerData && (
                                        <div style={{ color: 'grey', fontWeight: '600', cursor: 'pointer' }}>
                                            {totalActiveUsers || '0'} online, {totalUsersWorkingToday || '0'} worked today
                                        </div>
                                    )}

                                </p>
                                <p className="dashheadingtop heading-col" onClick={handleLastActiveSort}>
                                    Last active {lastActiveSortOrder === 'asc' ? '↑' : '↓'}
                                    <p style={{ width: '20%', color: '#666', fontWeight: '500' }}>
                                        {/* {totalUsersWorkingToday} online, worked today */}
                                    </p>
                                </p>
                                {/* <p className="dashheadingtop heading-col" onClick={handleTodaySort}>
                                    Today {todaySortOrder === 'asc' ? '↑' : '↓'}
                                </p> */}
                                {/* <div style={{ fontWeight: 'bold', color: '#444', textAlign: 'center', cursor: 'pointer' }} onClick={handleTodaySort}> */}
                                <p className="dashheadingtop heading-col" onClick={handleTodaySort}>

                                    Today {todaySortOrder === 'asc' ? '↑' : '↓'}
                                    {items?.userType !== "user" && (
                                        <>
                                            <div style={{ color: 'grey', fontWeight: '600', cursor: 'pointer' }}>
                                                {billingSummary.daily || '0h 0m'}
                                            </div>
                                            <div style={{ color: '#000', fontSize: '13px' }}>
                                                ${totalAmount.daily || 0}
                                            </div>
                                        </>
                                    )}
                                </p>
                                <p className="dashheadingtop heading-col" onClick={handleYesterdaySort}>
                                    Yesterday {yesterdaySortOrder === 'asc' ? '↑' : '↓'}
                                    {items?.userType !== "user" && (
                                        <>
                                            <div style={{ color: 'grey', fontWeight: '600', cursor: 'pointer' }}>
                                                {billingSummary.yesterday || '0h 0m'}
                                            </div>
                                            <div style={{ color: '#888', fontSize: '13px' }}>
                                                ${totalAmount.yesterday || 0}
                                            </div>
                                        </>
                                    )}
                                </p>
                                <p className="dashheadingtop heading-col" onClick={handleThisWeekSort}>
                                    This week {thisWeekSortOrder === 'asc' ? '↑' : '↓'}
                                    {items?.userType !== "user" && (
                                        <>
                                            <div style={{ color: 'grey', fontWeight: '600', cursor: 'pointer' }}>
                                                {billingSummary.weekly || '0h 0m'}
                                            </div>
                                            <div style={{ color: '#888', fontSize: '13px' }}>
                                                ${totalAmount.weekly || 0}
                                            </div>
                                        </>
                                    )}
                                </p>
                                <p className="dashheadingtop heading-col" onClick={handleThisMonthSort}>
                                    This month {thisMonthSortOrder === 'asc' ? '↑' : '↓'}
                                    {items?.userType !== "user" && (
                                        <>
                                            <div style={{ color: 'grey', fontWeight: '600', cursor: 'pointer' }}>
                                                {billingSummary.monthly || '0h 0m'}
                                            </div>
                                            <div style={{ color: '#888', fontSize: '13px' }}>
                                                ${totalAmount.monthly || 0}
                                            </div>
                                        </>
                                    )}
                                </p>
                            </div>

                            {/* <div className="dashheadings dashheading-wrapper" style={{ display: 'flex', alignItems: 'center', background: '#f9f9f9', padding: '10px 20px', borderRadius: '6px', marginBottom: '15px' }}>
                                <p style={{ width: '20%', color: '#666', fontWeight: '500' }}>
                                    {totalUsersWorkingToday} online, worked today
                                </p>

                                <div onClick={handleTodaySort}>
                                    <div style={{ color: '#28659C', fontWeight: '600', cursor: 'pointer' }}>
                                        {billingSummary.daily || '0h 0m'}
                                    </div>
                                    <div style={{ color: '#888', fontSize: '13px' }}>
                                        ${totalAmount.daily || 0}
                                    </div>
                                </div>

                                <div style={{ width: '20%', textAlign: 'center' }} onClick={handleYesterdaySort}>
                                    <div style={{ color: '#28659C', fontWeight: '600', cursor: 'pointer' }}>
                                        {billingSummary.yesterday || '0h 0m'}
                                    </div>
                                    <div style={{ color: '#888', fontSize: '13px' }}>
                                        ${totalAmount.yesterday || 0}
                                    </div>
                                </div>

                                <div style={{ width: '20%', textAlign: 'center' }} onClick={handleThisWeekSort}>
                                    <div style={{ color: '#28659C', fontWeight: '600', cursor: 'pointer' }}>
                                        {billingSummary.weekly || '0h 0m'}
                                    </div>
                                    <div style={{ color: '#888', fontSize: '13px' }}>
                                        ${totalAmount.weekly || 0}
                                    </div>
                                </div>

                                <div style={{ width: '20%', textAlign: 'center' }} onClick={handleThisMonthSort}>
                                    <div style={{ color: '#28659C', fontWeight: '600', cursor: 'pointer' }}>
                                        {billingSummary.monthly || '0h 0m'}
                                    </div>
                                    <div style={{ color: '#888', fontSize: '13px' }}>
                                        ${totalAmount.monthly || 0}
                                    </div>
                                </div>
                            </div> */}

                            {/* <div className="billing-summary-bar" style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '15px 20px', borderRadius: '6px', marginBottom: '20px' }}>
                                <div style={{ fontWeight: '500', fontSize: '16px', color: '#888' }}>
                                    {totalUsersWorkingToday}
                                </div>
                                <div style={{ display: 'flex', gap: '40px', fontSize: '15px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ color: '#888' }}>${billingSummary.daily || 0}</div>
                                        <div style={{ color: '#888' }}>${totalAmount.daily || 0}</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ color: '#888' }}>${billingSummary.yesterday || 0}</div>
                                        <div style={{ color: '#888' }}>${totalAmount.yesterday || 0}</div>

                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ color: '#888' }}>
                                            {billingSummary.weekly || 0}
                                        </p>
                                        <div style={{ color: '#888' }}>${totalAmount.weekly || 0}</div>

                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ color: '#888' }}>${billingSummary.monthly || 0}</div>
                                        <div style={{ color: '#888' }}>${totalAmount.monthly || 0}</div>

                                    </div>
                                </div>
                            </div> */}

                            <div className="my-first-step">
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
                                                    <p className="screenShotAmount" style={{ color: data?.isActive === false && "#28659C" }}>${data?.data?.billingAmounts?.daily?.usdAmount || 0}</p>
                                                </div>
                                                <div className="nameVerified">
                                                    <p className="dashheadingtop textalign">{data?.data?.totalHours?.yesterday}</p>
                                                    <p className="screenShotAmount" style={{ color: data?.isActive === false && "#28659C" }}>${data?.data?.billingAmounts?.yesterday?.usdAmount || 0}</p>
                                                </div>
                                                <div className="nameVerified">
                                                    <p className="dashheadingtop textalign">{data?.data?.totalHours?.weekly}</p>
                                                    <p className="screenShotAmount" style={{ color: data?.isActive === false && "#28659C" }}>${data?.data?.billingAmounts?.weekly?.usdAmount || 0}</p>
                                                </div>
                                                <div className="nameVerified">
                                                    <p className="dashheadingtop textalign">{data?.data?.totalHours?.monthly}</p>
                                                    <p className="screenShotAmount" style={{ color: data?.isActive === false && "#28659C" }}>${data?.data?.billingAmounts?.monthly?.usdAmount || 0}</p>
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
                                                        <div className="firststep">
                                                            <img
                                                                className="screenShotPreview"
                                                                src={user?.recentScreenshot && user?.recentScreenshot.key ? user.recentScreenshot.key : screenshot}
                                                                alt="Screenshot"
                                                            />
                                                        </div>
                                                        <p className="dashheadingtop">
                                                            ({user.minutesAgo === "0 minutes ago" ? "just now" : user.minutesAgo})
                                                        </p>
                                                    </div>




                                                    <div className="nameVerified">
                                                        <p className="dashheadingtop textalign">{user?.totalHours?.daily}</p>
                                                        <p className="screenShotAmount" style={{ color: user?.isActive === true && "#28659C" }}>${Math.round(user?.billingAmounts?.daily?.usdAmount || 0)}
                                                        </p>
                                                        {/* <div style={{ color: '#888' }}>${billingSummary.daily || 0}</div>
                                                        <div style={{ color: '#888' }}>${totalAmount.daily || 0}</div> */}
                                                    </div>
                                                    <div className="nameVerified">
                                                        <p className="dashheadingtop textalign">{user?.totalHours?.yesterday}</p>
                                                        <p className="screenShotAmount" style={{ color: user?.isActive === true && "#28659C" }}>${Math.round(user?.billingAmounts?.yesterday?.usdAmount || 0)}</p>
                                                    </div>
                                                    <div className="nameVerified">
                                                        <p className="dashheadingtop textalign">{user?.totalHours?.weekly}</p>
                                                        <p className="screenShotAmount" style={{ color: user?.isActive === true && "#28659C" }}>${Math.round(user?.billingAmounts?.weekly?.usdAmount || 0)}
                                                        </p>
                                                    </div>
                                                    <div className="nameVerified">
                                                        <p className="dashheadingtop textalign">{user?.totalHours?.monthly}</p>
                                                        <p className="screenShotAmount" style={{ color: user?.isActive === true && "#28659C" }}>${Math.round(user?.billingAmounts?.monthly?.usdAmount || 0)}
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
                </div>
                <img className="userDasboardLine" src={line} alt="line" />
            </div>
            {(user?.userType !== "user") && (
                <>

                    {/* <div className="mobhayat w-50"> */}
                    <div className="container">
                        <div className="container" style={{ borderRadius: '5%' }}>
                            <div className="userDashboardContainer1 d-flex gap-3 text-center align-items-center justify-content-center">
                                <h4 className="fw-bold text-dark mb-0">Want to add team members?</h4>
                                <a
                                    href="/team"
                                    className="btn btn-primary"
                                    style={{
                                        backgroundColor: "#7ACB59",
                                        border: "none",
                                        padding: "10px 20px",
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        borderRadius: "6px",
                                        textDecoration: "none",
                                        color: "white"
                                    }}
                                >
                                    Click here
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}


export default UserDashboard;
