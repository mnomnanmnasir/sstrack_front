import React, { useState, useEffect, useMemo } from 'react';
import {
    Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    IconButton, Tooltip, Collapse, useTheme, useMediaQuery,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Timeline as TimelineIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Map as MapIcon,
    Folder as FolderIcon,
    Assignment as AssignmentIcon,
    CalendarToday as CalendarTodayIcon,
    ExpandLess,
    ExpandMore,
    AccessTime as AccessTimeIcon,
    AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import check from "../images/online.webp";
import axios from "axios";
import CalculateIcon from '@mui/icons-material/Calculate'; // For Run Payroll
import GroupAddIcon from '@mui/icons-material/GroupAdd';   // For Add Employee
import HistoryIcon from '@mui/icons-material/History';     // For Pay Stub History
import TimerIcon from '@mui/icons-material/Timer';         // ⏱ Break Time
import AlarmOnIcon from '@mui/icons-material/AlarmOn';     // ⏰ Punctuality
import InsightsIcon from '@mui/icons-material/Insights';         // 📊 Detailed Reports
import QueryStatsIcon from '@mui/icons-material/QueryStats';     // 📈 Punctuality Reports
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useSocket } from '../io'; // Adjust path if needed

import { useLocation, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import logo from '../images/sloganLogo.png';

const drawerWidth = 250;
const collapsedWidth = 30;
const apiUrl = process.env.REACT_APP_API_URL;
// const Sidebar = ({ open, onClose }) => {
const Sidebar = ({ open, onClose, userType: parentUserType }) => {

    const [collapsed, setCollapsed] = useState(false);
    // const [userType, setUserType] = useState(null);
    const [reportsOpen, setReportsOpen] = useState(false);
    const [attendanceOpen, setAttendanceOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [timelineOpen, setTimelineOpen] = useState(false);
    const [paystubOpen, setPaystubOpen] = useState(false);
    const socket = useSocket();
    const [userType, setUserType] = useState(parentUserType); // initial from props
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [token] = useState(localStorage.getItem("token"));

    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    const [showUsersDropdown, setShowUsersDropdown] = useState(false);
    const [usersDropdownPos, setUsersDropdownPos] = useState({ top: 0, left: 0 });
    const [userStats, setUserStats] = useState(null);

    useEffect(() => {
        setUserType(parentUserType); // update on prop change
    }, [parentUserType]);

    useEffect(() => {
        if (!socket) return;

        const handleRoleUpdate = (data) => {
            const token = localStorage.getItem("token");
            if (!token) return;

            const decoded = jwtDecode(token);
            if (data.user_id === decoded._id) {
                // Update the token in localStorage
                localStorage.setItem("token", data.new_token);

                // Update the userType state to trigger re-render
                const newDecoded = jwtDecode(data.new_token);
                setUserType(newDecoded.userType);
            }
        };

        socket.on('role_update', handleRoleUpdate);

        return () => {
            socket.off('role_update', handleRoleUpdate);
        };
    }, [socket]);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const res = await axios.get(`${apiUrl}/owner/getCompanyemployee`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (res.data?.success) {
                    setUserStats({
                        totalUsers: res.data.totalUsers,
                        totalActiveUsers: res.data.totalActiveUsers,
                        totalUsersWorkingToday: res.data.totalUsersWorkingToday
                    });
                }
            } catch (err) {
                console.error("Failed to fetch total user stats", err);
            }
        };

        fetchUserStats();
    }, []);

    useEffect(() => {
        if (isMobile && open) {
            setCollapsed(false); // Always expand the sidebar on mobile
        }
    }, [isMobile, open]);

    const handleNavigate = (route) => {
        navigate(route);
        if (isMobile) setMobileOpen(false);
    };

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserType(decoded?.userType);
            } catch (err) {
                console.error("Token decode error", err);
            }
        }
    }, [token]);

    const sidebarItems = useMemo(() => [
        { text: 'Dashboard', icon: <DashboardIcon />, route: '/dashboard' },
        { isDropdown: 'timeline' },
        ...(userType !== 'user' ? [{ text: 'Team', icon: <PeopleIcon />, route: '/team' }] : []),
        ...(userType !== 'user' ? [{ text: 'Projects', icon: <FolderIcon />, route: '/Projects' }] : []),
        { isDropdown: 'reports' },
        { isDropdown: 'attendance' },

        // { text: 'Geo Fencing', icon: <CalendarTodayIcon />, route: '/geo-fance' },
        // { isDropdown: 'geoFence' },

        { text: 'Leave Management', icon: <CalendarTodayIcon />, route: '/leave-management' },
        { text: 'Location Tracking', icon: <MapIcon />, route: '/Locationtracking' },

        ...(userType === 'owner' || userType === 'admin' ? [{ isDropdown: 'paystub' }] : []),

    ], [userType]);

    const filteredSidebarItems = sidebarItems.filter(item => {
        if (item.isDropdown === 'attendance' && ['manager', 'user'].includes(userType)) return false;
        return true;
    });

    const drawerContent = (
        // <div>
        <>
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 10px' }}>
                {!collapsed && (
                    <img src={logo} alt="Logo" className="logo" style={{ height: 50, marginRight: 'auto' }} />
                )}
                {/* ✅ Hide arrow on mobile */}
                {!isMobile && (
                    <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: 'white' }}>
                        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                )}
            </div>

            <List>
                {filteredSidebarItems.map((item, index) => {
                    // 🟦 TIMELINE TAB WITH USERS DROPDOWN
                    if (item.isDropdown === 'timeline') {
                        return (
                            <div
                                key="timeline-dropdown"
                                onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setUsersDropdownPos({ top: rect.top, left: rect.right });
                                    setShowUsersDropdown(true);
                                }}
                                onMouseLeave={() => setShowUsersDropdown(false)}
                            >
                                <Tooltip title={collapsed ? 'Timeline' : ''} placement="right">
                                    <ListItemButton
                                        onClick={() => setTimelineOpen(!timelineOpen)}
                                    >
                                        <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                                            <TimelineIcon />
                                        </ListItemIcon>
                                        {!collapsed && <ListItemText primary="Timeline" />}
                                        {!collapsed && (timelineOpen ? <ExpandLess /> : <ExpandMore />)}
                                    </ListItemButton>
                                </Tooltip>

                                {/* 🟢 This shows on hover only */}
                                {showUsersDropdown && !collapsed && userType !== "user" && userType !== "manager" && (
                                    <div
                                        key="timeline-tab"
                                        onMouseEnter={async (e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setUsersDropdownPos({ top: rect.top, left: rect.right });
                                            // setShowUsersDropdown(true);
                                            // setLoadingUsers(true); // start loading
                                            setShowUsersDropdown(true);
                                            setLoadingUsers(true);      // start loading
                                            setUserStats(null);         // clear old data

                                            try {
                                                const res = await fetch(`${apiUrl}/owner/getCompanyemployee`, {
                                                    headers: {
                                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                                    },
                                                });

                                                const data = await res.json();

                                                if (data?.success) {
                                                    setUserStats({
                                                        totalUsers: data.totalUsers,
                                                        totalActiveUsers: data.totalActiveUsers,
                                                        totalUsersWorkingToday: data.totalUsersWorkingToday,
                                                        onlineUsers: data.onlineUsers || [],
                                                        offlineUsers: data.offlineUsers || [],
                                                    });
                                                }
                                            } catch (err) {
                                                console.error("Failed to fetch user stats on hover", err);
                                            }
                                            finally {
                                                setLoadingUsers(false); // stop loading
                                            }
                                        }}
                                        onMouseLeave={() => setShowUsersDropdown(false)}
                                    >

                                        {showUsersDropdown && !collapsed && (
                                            <div
                                                onMouseLeave={() => setShowUsersDropdown(false)}
                                                style={{
                                                    position: 'fixed',
                                                    top: isMobile ? usersDropdownPos.top + 40 : usersDropdownPos.top,
                                                    left: isMobile ? 10 : usersDropdownPos.left,
                                                    right: isMobile ? 'auto' : '',
                                                    backgroundColor: '#002244',
                                                    borderRadius: 6,
                                                    padding: '12px 20px',
                                                    zIndex: 1300,
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                                    color: '#fff',
                                                    // width: isMobile ? '90vw' : '440px',
                                                    width: isMobile ? '90vw' : '800px', // 👈 increased width
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    // maxHeight: '80vh',
                                                    overflowY: 'hidden',
                                                }}
                                            >

                                                {loadingUsers ? (
                                                    <p style={{ color: "#ccc" }}>Loading...</p>
                                                ) : userStats ? (
                                                    isMobile ? (
                                                        <>
                                                            <div style={{ borderTop: '1px solid #ffffff33', paddingTop: 8 }}>
                                                                <p style={{ fontWeight: 'bold', marginBottom: 6 }}>Online Users:</p>
                                                                {Array.isArray(userStats.onlineUsers) && userStats.onlineUsers.filter(u => u.userName).length > 0 ? (
                                                                    userStats.onlineUsers
                                                                        .filter(u => u.userName)
                                                                        .sort((a, b) => a.userName.localeCompare(b.userName))
                                                                        .map((u) => (

                                                                            <div
                                                                                key={u.userId}
                                                                                onClick={() => {
                                                                                    navigate(`/timeline/${u.userId}`);
                                                                                    setShowUsersDropdown(false);
                                                                                }}
                                                                                style={{
                                                                                    fontSize: '13px',
                                                                                    marginBottom: 8,
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: '10px',
                                                                                    background: '#003366',
                                                                                    padding: '6px 10px',
                                                                                    borderRadius: '6px',
                                                                                    cursor: 'pointer'
                                                                                }}
                                                                            >
                                                                                <img src={check} alt="Online" style={{ width: 14, height: 14 }} />
                                                                                {u.userName}

                                                                            </div>
                                                                        ))
                                                                ) : (
                                                                    <p style={{ fontSize: '13px', color: '#ccc' }}>No one online</p>
                                                                )}
                                                            </div>

                                                            {/* OFFLINE USERS */}
                                                            <div style={{ borderTop: '1px solid #ffffff33', marginTop: 12, paddingTop: 8 }}>
                                                                <p style={{ fontWeight: 'bold', marginBottom: 6 }}>Offline Users:</p>

                                                                {Array.isArray(userStats.offlineUsers) && userStats.offlineUsers.filter(u => u.userName).length > 0 ? (
                                                                    userStats.offlineUsers
                                                                        .filter(u => u.userName)
                                                                        .sort((a, b) => a.userName.localeCompare(b.userName))
                                                                        .map((u) => (
                                                                            <div
                                                                                key={u.userId}
                                                                                onClick={() => {
                                                                                    navigate(`/timeline/${u.userId}`);
                                                                                    setShowUsersDropdown(false);
                                                                                }}
                                                                                style={{
                                                                                    fontSize: '13px',
                                                                                    marginBottom: 8,
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: '10px',
                                                                                    background: '#1c2e40',
                                                                                    padding: '6px 10px',
                                                                                    borderRadius: '6px',
                                                                                    cursor: 'pointer'

                                                                                }}
                                                                            >
                                                                                <span
                                                                                    style={{
                                                                                        width: 10,
                                                                                        height: 10,
                                                                                        borderRadius: '50%',
                                                                                        display: 'inline-block',
                                                                                        backgroundColor: '#fff',
                                                                                        boxShadow: '0 0 3px #7ACB59',
                                                                                    }}
                                                                                ></span>
                                                                                {u.userName}
                                                                            </div>
                                                                        ))
                                                                ) : (
                                                                    <p style={{ fontSize: '13px', color: '#ccc' }}>No one offline</p>
                                                                )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    gap: '20px',
                                                                    borderTop: '1px solid #ffffff33',
                                                                    paddingTop: 8,
                                                                    justifyContent: 'space-between',
                                                                }}
                                                            >
                                                                {/* 🟢 ONLINE USERS */}
                                                                <div style={{ flex: 1 }}>
                                                                    <p style={{ fontWeight: 'bold', marginBottom: 6 }}>Online Users</p>
                                                                    {Array.isArray(userStats.onlineUsers) &&
                                                                        userStats.onlineUsers.filter((u) => u.userName).length > 0 ? (
                                                                        userStats.onlineUsers
                                                                            .filter((u) => u.userName)
                                                                            .sort((a, b) => a.userName.localeCompare(b.userName))
                                                                            .map((u) => (
                                                                                <div
                                                                                    key={u.userId}
                                                                                    onClick={() => {
                                                                                        navigate(`/timeline/${u.userId}`);
                                                                                        setShowUsersDropdown(false);
                                                                                    }}
                                                                                    style={{
                                                                                        fontSize: '13px',
                                                                                        marginBottom: 8,
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        gap: '10px',
                                                                                        background: '#003366',
                                                                                        padding: '6px 10px',
                                                                                        borderRadius: '6px',
                                                                                        cursor: 'pointer'
                                                                                    }}
                                                                                >
                                                                                    <span
                                                                                        style={{
                                                                                            width: 10,
                                                                                            height: 10,
                                                                                            borderRadius: '50%',
                                                                                            backgroundColor: '#7ACB59',
                                                                                            display: 'inline-block',
                                                                                            boxShadow: '0 0 3px #7ACB59',
                                                                                        }}
                                                                                    ></span>
                                                                                    {u.userName}
                                                                                </div>
                                                                            ))
                                                                    ) : (
                                                                        <p style={{ fontSize: '13px', color: '#ccc' }}>No one online</p>
                                                                    )}
                                                                </div>

                                                                {/*  OFFLINE USERS */}
                                                                <div style={{ flex: 1 }}>
                                                                    <p style={{ fontWeight: 'bold', marginBottom: 6 }}>Offline Users</p>
                                                                    {Array.isArray(userStats.offlineUsers) &&
                                                                        userStats.offlineUsers.filter((u) => u.userName).length > 0 ? (
                                                                        userStats.offlineUsers
                                                                            .filter((u) => u.userName)
                                                                            .sort((a, b) => a.userName.localeCompare(b.userName))
                                                                            .map((u) => (
                                                                                <div
                                                                                    key={u.userId}
                                                                                    onClick={() => {
                                                                                        navigate(`/timeline/${u.userId}`);
                                                                                        setShowUsersDropdown(false);
                                                                                    }}
                                                                                    style={{
                                                                                        fontSize: '13px',
                                                                                        marginBottom: 8,
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        gap: '10px',
                                                                                        background: '#1c2e40',
                                                                                        padding: '6px 10px',
                                                                                        borderRadius: '6px',
                                                                                        cursor: 'pointer'

                                                                                    }}
                                                                                >
                                                                                    <span
                                                                                        style={{
                                                                                            width: 10,
                                                                                            height: 10,
                                                                                            borderRadius: '50%',
                                                                                            backgroundColor: '#fff',
                                                                                            display: 'inline-block',
                                                                                            boxShadow: '0 0 3px #fff',
                                                                                        }}
                                                                                    ></span>
                                                                                    {u.userName}
                                                                                </div>
                                                                            ))
                                                                    ) : (
                                                                        <p style={{ fontSize: '13px', color: '#ccc' }}>No one offline</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                ) : (
                                                    <p>Loading...</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <Collapse in={timelineOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItemButton
                                            sx={{
                                                pl: collapsed ? 2 : 6,
                                                backgroundColor: location.pathname.includes('/timeline') ? '#7ACB59' : 'transparent',
                                                color: '#fff'
                                            }}
                                            onClick={() => handleNavigate('/timeline')}
                                        >
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                                                <PeopleIcon />
                                            </ListItemIcon>
                                            {!collapsed && <ListItemText primary="Your Timeline" />}
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            </div>
                        );
                    }

                    // 🟨 REPORTS DROPDOWN
                    if (item.isDropdown === 'reports') {
                        return (
                            <div key="reports-dropdown">
                                <Tooltip title={collapsed ? 'Reports' : ''} placement="right">
                                    <ListItemButton onClick={() => setReportsOpen(!reportsOpen)}
                                    >
                                        <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                                            <AssignmentIcon />
                                        </ListItemIcon>
                                        {!collapsed && <ListItemText primary="Reports" />}
                                        {!collapsed && (reportsOpen ? <ExpandLess /> : <ExpandMore />)}
                                    </ListItemButton>
                                </Tooltip>
                                <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItemButton
                                            sx={{
                                                pl: collapsed ? 2 : 6,
                                                backgroundColor: location.pathname.includes('/reports') ? '#7ACB59' : 'transparent',
                                                color: '#fff'
                                            }}
                                            onClick={() => handleNavigate('/reports')}>
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}><InsightsIcon /></ListItemIcon>
                                            {!collapsed && <ListItemText primary="Detailed Reports" />}
                                        </ListItemButton>
                                        <ListItemButton
                                            sx={{
                                                pl: collapsed ? 2 : 6,
                                                backgroundColor: location.pathname === '/punctuality-reports' ? '#7ACB59' : 'transparent',
                                                color: '#fff'
                                            }}
                                            onClick={() => handleNavigate('/punctuality-reports')}>
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}><QueryStatsIcon /></ListItemIcon>
                                            {!collapsed && <ListItemText primary="Punctuality Reports" />}
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            </div>
                        );
                    }

                    // 🟩 ATTENDANCE DROPDOWN
                    if (item.isDropdown === 'attendance' && !['manager', 'user'].includes(userType)) {
                        return (
                            <div key="attendance-dropdown">
                                <Tooltip title={collapsed ? 'Attendance' : ''} placement="right">
                                    <ListItemButton onClick={() => setAttendanceOpen(!attendanceOpen)}
                                    >
                                        <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}><AccessTimeIcon /></ListItemIcon>
                                        {!collapsed && <ListItemText primary="Attendance" />}
                                        {!collapsed && (attendanceOpen ? <ExpandLess /> : <ExpandMore />)}
                                    </ListItemButton>
                                </Tooltip>
                                <Collapse in={attendanceOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItemButton
                                            sx={{
                                                pl: collapsed ? 2 : 6,
                                                backgroundColor: location.pathname.includes('/break-time') ? '#7ACB59' : 'transparent',
                                                color: '#fff'
                                            }}
                                            onClick={() => handleNavigate('/break-time')}>
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}><TimerIcon /></ListItemIcon>
                                            {!collapsed && <ListItemText primary="Break Time" />}
                                        </ListItemButton>
                                        <ListItemButton
                                            sx={{
                                                pl: collapsed ? 2 : 6,
                                                backgroundColor: location.pathname.includes('/punctuality') ? '#7ACB59' : 'transparent',
                                                color: '#fff'
                                            }}
                                            onClick={() => handleNavigate('/punctuality')}>
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}><AlarmOnIcon /></ListItemIcon>
                                            {!collapsed && <ListItemText primary="Punctuality" />}
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            </div>
                        );
                    }

                    if (item.isDropdown === 'paystub' && userType && ['owner', 'admin'].includes(userType)) {

                        return (
                            <div key="paystub-dropdown">
                                <Tooltip title={collapsed ? 'Pay Stub Management' : ''} placement="right">
                                    <ListItemButton onClick={() => setPaystubOpen(!paystubOpen)}>
                                        <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                                            <CalculateIcon />
                                        </ListItemIcon>
                                        {!collapsed && <ListItemText primary="Pay Roll" />}
                                        {!collapsed && (paystubOpen ? <ExpandLess /> : <ExpandMore />)}
                                    </ListItemButton>
                                </Tooltip>

                                <Collapse in={paystubOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItemButton
                                            sx={{
                                                pl: collapsed ? 2 : 6,
                                                backgroundColor: location.pathname.includes('/pay_stub_managment') ? '#7ACB59' : 'transparent',
                                                color: '#fff'
                                            }}
                                            onClick={() => handleNavigate('/pay_stub_managment')}
                                        >
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                                                <AttachMoneyIcon />
                                            </ListItemIcon>
                                            {!collapsed && <ListItemText primary="Run payroll" />}
                                        </ListItemButton>

                                        <ListItemButton
                                            sx={{
                                                pl: collapsed ? 2 : 6,
                                                backgroundColor: location.pathname === '/add-employee' ? '#7ACB59' : 'transparent',
                                                color: '#fff'
                                            }}
                                            onClick={() => handleNavigate('/add-employee')}
                                        >
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                                                <GroupAddIcon />
                                            </ListItemIcon>
                                            {!collapsed && <ListItemText primary="Add Employee" />}
                                        </ListItemButton>

                                        <ListItemButton
                                            sx={{
                                                pl: collapsed ? 2 : 6,
                                                backgroundColor: location.pathname.includes('/PayStub_history') ? '#7ACB59' : 'transparent',
                                                color: '#fff'
                                            }}
                                            onClick={() => handleNavigate('/PayStub_history')}
                                        >
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                                                <HistoryIcon />
                                            </ListItemIcon>
                                            {!collapsed && <ListItemText primary="Pay Stub History" />}
                                        </ListItemButton>

                                        <ListItemButton
                                            sx={{
                                                pl: collapsed ? 2 : 6,
                                                backgroundColor: location.pathname.includes('/PayStub_user') ? '#7ACB59' : 'transparent',
                                                color: '#fff'
                                            }}
                                            onClick={() => handleNavigate('/PayStub_user')}
                                        >
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                                                <PeopleAltIcon />
                                            </ListItemIcon>
                                            {!collapsed && <ListItemText primary="Pay Stub User" />}
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            </div>
                        );
                    }

                    // ALL OTHER REGULAR ITEMS
                    const isActive = location.pathname === item.route || (location.pathname.includes(item.route) && item.route !== '/');
                    return (
                        <Tooltip title={collapsed ? item.text : ''} placement="right" key={index}>
                            <ListItemButton onClick={() => handleNavigate(item.route)}
                                sx={{ backgroundColor: isActive ? '#7ACB59' : 'transparent', color: '#ffffff' }}>
                                <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>{item.icon}</ListItemIcon>
                                {!collapsed && <ListItemText primary={item.text} />}
                            </ListItemButton>
                        </Tooltip>
                    );
                })}

            </List>
        </>
    );

    return (
        <>
            {!isMobile && (
                <IconButton
                    onClick={() => setCollapsed(!collapsed)}
                    sx={{ color: 'white' }}
                >
                    {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            )}

            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={isMobile ? open : true}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    width: isMobile ? drawerWidth : (collapsed ? collapsedWidth : drawerWidth),
                    flexShrink: 0,
                    zIndex: 1030, // ✅ Lower than Bootstrap modal's default (1050)
                    '& .MuiDrawer-paper': {
                        // width: isMobile ? drawerWidth : (collapsed ? collapsedWidth : drawerWidth),
                        boxSizing: 'border-box',
                        backgroundColor: '#003366',
                        color: '#fff',
                        transition: 'width 0.3s',
                        borderRight: 'none',
                        zIndex: 1030, // ✅ Also here
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Sidebar;
