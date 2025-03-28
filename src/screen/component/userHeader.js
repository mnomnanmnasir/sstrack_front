
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaProjectDiagram, FaUserPlus, FaClock, FaCheckCircle, FaCalendarCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import dashboard from "../../images/dashboard.webp";
import logout from "../../images/logout.webp";
import account from "../../images/myaccount.webp";
import logo from '../../images/sloganLogo.png';
import { useSocket } from '../../io'; // Correct import
import UserDashboardSection from "../../screen/component/userDashboardsection";
import { setLogout } from "../../store/timelineSlice";
// import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineHistory } from "react-icons/ai"; // 🛠 Import History Icon
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import SettingsIcon from '@mui/icons-material/Settings';
import jwtDecode from "jwt-decode";
import HeaderOption from './HeaderOption';


function UserHeader() {
    const token = localStorage.getItem("token");
    let user = null;

    if (token) {
        try {
            user = jwtDecode(token); // Decode the token
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    } else {
        console.warn('No token available');
    }

    const [showContent, setShowContent] = useState(false);
    const [userType, setUserType] = useState(user?.userType);
    const navigate = useNavigate("");
    const dispatch = useDispatch()
    const socket = useSocket()
    const [forceUpdate, setForceUpdate] = useState(0); // 🔹 Force re-render state

    let headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
    }

    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

    const logoutDivRef = useRef(null);



    const [toggleData, setToggleData] = useState({});
    const [showMessage, setShowMessage] = useState(true); // Shared state for toggles

    const handleToggleChange = (employeeId, data) => {
        setToggleData((prev) => ({
            ...prev,
            [employeeId]: data, // Update specific employee toggle data
        }));
    };


    useEffect(() => {
        function handleClickOutside(event) {
            if (logoutDivRef.current && !logoutDivRef.current.contains(event.target)) {
                setShowContent(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
    const getitems = jwtDecode(JSON.stringify(token));
    const [items, setItem] = useState(getitems);

    const [leaveCount, setLeaveCount] = useState(0); // State to store leave request count
    useEffect(() => {
        // Function to check localStorage and update state
        const checkSetupStatus = () => {
            const isSetupComplete = localStorage.getItem("isAccountSetupComplete");
            setShowMessage(isSetupComplete !== "true");
        };

        checkSetupStatus(); // Initial check

        // Listen for localStorage changes (useful if updated from another component)
        window.addEventListener("storage", checkSetupStatus);

        return () => {
            window.removeEventListener("storage", checkSetupStatus);
        };
    }, []);
    // Fetch leave requests and calculate count
    const fetchLeaveRequests = async () => {
        try {
            const userId = items._id; // Current user ID
            const apiUrl = `https://myuniversallanguages.com:9093/api/v1/superAdmin/getAllLeaveRequests`;

            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in headers
                },
            });

            if (response.status === 200) {
                const { requestedLeaves = [] } = response.data; // Extract requested leaves
                const userRequestedLeaves = requestedLeaves.filter((leave) => leave.userId === userId);
                setLeaveCount(userRequestedLeaves.length); // Update count for the current user
            } else {
                console.error("Failed to fetch leave requests:", response.data?.message || response.statusText);
            }
        } catch (error) {
            console.error("Error fetching leave requests:", error.response || error.message || error);
        }
    };

    // Call fetchLeaveRequests on component mount
    useEffect(() => {
        if (items?.userType === "user" || items?.userType === "manager") {
            fetchLeaveRequests();
        }
    }, [items]);

    useEffect(() => {
        if (!socket) {
            console.error('Socket instance is null or undefined');
            return;
        }

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        const handleUpdateData = () => {
            console.log('Received updateData event===========SOCKET');
            updateData();
            setForceUpdate(prev => prev + 1); // 🔹 Just update state to trigger re-render

            // Window ko reload karne ke liye
        }

        socket.on('role_update', handleUpdateData);

        return () => {
            socket.off('role_update', handleUpdateData);
        };
    }, [socket]);


    async function updateData() {

        try {
            const response = await axios.patch(`${apiUrl}/signin/users/Update`, {
                // ...model
            }, {
                headers: headers
            })
            if (response.data) {
                console.log('!!!!!!!!!!!!!!!!!!>', userType);
                // setLoading(false)
                setUserType(response.data.user.userType)
                localStorage.setItem("token", response.data.token);
                // localStorage.setItem("items", JSON.stringify(response.data.user));

                // 🔹 Force re-render
                setForceUpdate(prev => prev + 1);
            }
        } catch (error) {
            // setLoading(false)

            console.log(error);
        }
    }

    function logOut() {

        localStorage.removeItem("token");

        dispatch(setLogout())
        // window.location.reload()
        navigate("/")
        setTimeout(() => {
            window.location.reload()
        }, 1000);
        setShowContent(false)
    }

    // function logOut() {
    //     localStorage.removeItem("items");
    //     localStorage.removeItem("token");
    //     dispatch(setLogout())
    //     navigate("/")
    //     setTimeout(() => {
    //         window.location.reload()
    //     }, 1000);
    //     setShowContent(false)
    // }

    function takeToDashboard() {
        setShowContent(false)
        navigate("/dashboard")
    }

    function takeToAdmin() {
        setShowContent(false)
        navigate("/account")
    }

    function takeToHistory() {
        setShowContent(false)
        navigate("/history")
    }

    function takeToSettings() {
        setShowContent(false)
        navigate("/effective-settings")
    }
    function userSettings() {
        setShowContent(false)
        navigate("/user-setting")
    }
    // function leaveManagement() {
    //     setShowContent(false)
    //     navigate("/leave-management")
    // }

    const wordsAfterSpace = user?.name?.split(" ")[1] ? user?.name?.split(" ")[1].charAt(0).toUpperCase() : "";
    const capitalizedWord = user?.name?.charAt(0).toUpperCase();





    // function logOut() {
    //     localStorage.removeItem("items");
    //     localStorage.removeItem("token");
    //     dispatch(setLogout())
    //     navigate("/signin")
    // }

    // console.log(items);

    // function takeToDashboard() {
    //     if (items?.userType === "admin" || items?.userType === "manager") {
    //         navigate("/admindashboard")
    //     }
    //     else if (items?.userType === "user") {
    //         navigate("/userdashboard");
    //     }
    //     else if (items?.userType === "owner") {
    //         navigate("/company-owner");
    //     }
    // }

    // function takeToAdmin() {
    //     if (items?.userType === "admin" || items?.userType === "manager") {
    //         navigate("/adminaccount")
    //     }
    //     else if (items?.userType === "user") {
    //         navigate("/account");
    //     }
    //     else if (items?.userType === "owner") {
    //         navigate('/account')
    //     }
    // }


    useEffect(() => {
        if (socket) {
            socket.on('role_update', (data) => {
                if (data.user_id === items._id) {
                    console.log('Role update received:', data);
                    updateRole(data.new_role);
                }
            });
        }

        // Don't forget to clean up when the component unmounts
        return () => {
            if (socket) {
                socket.off('role_update');
            }
        };
    }, [socket, items]);

    const updateRole = (newRole) => {
        localStorage.setItem('items', JSON.stringify({ ...items, userType: newRole }));
        items.userType = newRole;
    };


    return (
        <>
            <div className="cursor-pointer">
                {/* <Header /> */}
                {user?.userType === "user" ? (
                    <>
                        <HeaderOption />
                        <nav className="navbar navbar-expand-lg navbar-dark" style={{
                            // backgroundColor: "#0d3756",
                            // padding: "10px 15px",
                            // // borderTopLeftRadius: "10px",
                            // // borderTopRightRadius: "10px",
                            // margin: "0px 30px 0 30px",
                            backgroundColor: "#0d3756",
                            padding: "10px 15px",
                            // borderTopLeftRadius: "10px",
                            // borderTopRightRadius: "10px",
                            margin: "0px 30px 0 30px",
                            marginTop: '-15px'
                        }}>
                            <div className="container-fluid" style={{ position: "relative" }}>
                                <div>
                                    <img onClick={() => navigate('/')} className="logo1" src={logo} />
                                    {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button> */}
                                </div>
                                <div ref={logoutDivRef}>
                                    <div className="d-flex amButton" role="search">
                                        {/* <h1>
                                            Hello
                                        </h1> */}
                                        {/* <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/download")}>Download</p>
                                            <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/pricing")}>Pricing</p> */}
                                        {/* {token && user && (
                                                <>
                                                    <p>
                                                        {user?.name?.charAt(0).toUpperCase() + user?.name?.slice(1)} ({userType})
                                                    </p>
                                                    <button onClick={() => setShowContent(!showContent)} className="userName">
                                                        {capitalizedWord + wordsAfterSpace}
                                                    </button>
                                                </>
                                            )} */}
                                        <p>{user?.name.charAt(0).toUpperCase() + user?.name.slice(1)} ({userType})</p>
                                        <button onClick={() => setShowContent(!showContent)} className="userName">
                                            {capitalizedWord + wordsAfterSpace}
                                        </button>
                                        {/* <button onClick={() => updateData()} className="userName">
                                    {capitalizedWord}
                                </button> */}
                                    </div>
                                    {showContent && <div className="logoutDiv">
                                        <div onClick={takeToDashboard}>
                                            <div>
                                                <img src={dashboard} />
                                            </div>
                                            <p>Dashboard</p>
                                        </div>
                                        <div onClick={takeToAdmin}>
                                            <div>
                                                <img src={account} />
                                            </div>
                                            <p>My Account</p>
                                        </div>

                                        {/* {user?.userType === "user" && (
                                            <div onClick={userSettings}>
                                                <div style={{ marginLeft: '-5px' }}>
                                                    <BeachAccessIcon style={{ fontSize: '24px', color: '#fff' }} />
                                                </div>
                                                <p>Leaves</p>
                                            </div>
                                        )} */}
                                        <div onClick={takeToHistory}>
                                            <div style={{ marginLeft: '-4%' }}>
                                                <AiOutlineHistory size={24} color="#fff" /> {/* 🛠 Icon Added Here */}
                                            </div>
                                            <p>History
                                                <span style={{ marginLeft: '5%' }}>
                                                    Logs
                                                </span>
                                            </p>
                                        </div>
                                        {user?.userType === "user" ? null : (
                                            <div onClick={takeToSettings}>
                                                <div>
                                                    <img src={account} />
                                                </div>
                                                <p>Settings</p>
                                            </div>
                                        )}
                                        <div onClick={logOut}>
                                            <div>
                                                <img src={logout} />
                                            </div>
                                            <p>Logout</p>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </nav>
                        <UserDashboardSection />
                    </>

                ) : (
                    <>
                        <HeaderOption />
                        <nav className="navbar navbar-expand-lg navbar-dark" style={{
                            backgroundColor: "#0d3756",
                            padding: "10px 15px",
                            // borderTopLeftRadius: "10px",
                            // borderTopRightRadius: "10px",
                            margin: "0px 30px 0 30px",
                            marginTop: '-15px'
                        }}>
                            {/* <HeaderOption /> */}
                            <div className="container-fluid" style={{ position: "relative" }}>
                                <div>
                                    <img onClick={() => navigate('/')} className="logo1" src={logo} />

                                    {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button> */}
                                </div>
                                <div ref={logoutDivRef}>
                                    <div className="d-flex amButton text-center align-items-center" role="search">
                                        {/* <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/download")}>Download</p>
                                                <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/pricing")}>Pricing</p>
                                                <p style={{ fontSize: '18px', color: '#7ACB59', cursor: 'pointer' }} onClick={() => navigate("/workCards")}>How It Work</p> */}
                                        {token && user && (
                                            <>
                                                <p>
                                                    {user?.name?.charAt(0).toUpperCase() + user?.name?.slice(1)} ({userType})
                                                </p>
                                                <button onClick={() => setShowContent(!showContent)} className="userName">
                                                    {capitalizedWord + wordsAfterSpace}
                                                </button>
                                            </>
                                        )}
                                        {/* <button onClick={() => updateData()} className="userName">
                                        {capitalizedWord}
                                    </button> */}
                                    </div>
                                    {showContent && <div className="logoutDiv">
                                        <div onClick={takeToDashboard}>
                                            <div>
                                                <img src={dashboard} />
                                            </div>
                                            <p>Dashboard</p>
                                        </div>
                                        {/* <div onClick={leaveManagement}>
                                            <div>
                                                <img src={dashboard} />
                                            </div>
                                            <p>Leave Management</p>
                                        </div> */}
                                        <div onClick={takeToAdmin}>
                                            <div>
                                                <img src={account} />
                                            </div>
                                            <p>My Account</p>
                                        </div>
                                        {/* <div onClick={takeToHistory}>
                                            <div>
                                                <img src={account} />
                                            </div>
                                            <p>History 
                                                <span>    
                                                Logs
                                                </span>
                                                </p>
                                        </div> */}

                                        <div onClick={takeToHistory}>
                                            <div style={{ marginLeft: '-4%' }}>
                                                <AiOutlineHistory size={24} color="#fff" /> {/* 🛠 Icon Added Here */}
                                            </div>
                                            <p>History
                                                <span style={{ marginLeft: '5%' }}>
                                                    Logs
                                                </span>
                                            </p>
                                        </div>
                                        {(user?.userType === "user") || (user?.userType === "manager") ? null : (
                                            <div onClick={takeToSettings}>
                                                <div style={{ marginLeft: '-5px' }}>
                                                    <SettingsIcon style={{ fontSize: '24px', color: '#fff' }} />
                                                </div>
                                                <p>Settings</p>
                                            </div>
                                        )}



                                        <div onClick={logOut}>
                                            <div>
                                                <img src={logout} />
                                            </div>
                                            <p>Logout</p>
                                        </div>
                                    </div>

                                    }
                                </div>
                            </div>
                        </nav>
                        {showMessage && (<div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                // height: '100vh',
                                width: '100vw'
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: 'orange',
                                    padding: 10,
                                    // borderRadius: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    width: '95.2%',
                                    marginRight: 10,
                                    textAlign:'center',
                                }}
                            >
                                {/* <FaCheckCircle style={{ color: 'white' }} /> */}
                                <span>
                                    Complete your account setup by adding a project, inviting users,
                                    setting break times, ensuring punctuality, and configuring leaves.
                                    please click Training center.
                                </span>
                            </div>
                        </div>)}


                        {token && (
                            // {/* 🔹 Only UserDashboardSection reloads when socket updates */ }
                            < UserDashboardSection key={forceUpdate} />
                        )}
                        {/* <img className="line" src={line} /> */}
                    </>
                )}
            </div>
        </>
    )
}

export default UserHeader;