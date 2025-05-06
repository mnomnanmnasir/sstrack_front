import React, { useState, useEffect } from 'react';
import {
    Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    IconButton, Tooltip, Collapse, useTheme, useMediaQuery,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Timeline as TimelineIcon,
    Settings as SettingsIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Map as MapIcon,
    Folder as FolderIcon,
    Assignment as AssignmentIcon,
    CalendarToday as CalendarTodayIcon,
    ExpandLess,
    ExpandMore,
    Article as ArticleIcon,
    AccessTime as AccessTimeIcon,
    AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import check from "../images/online.webp";
import offline from "../images/not-active.svg";
import CircleIcon from '@mui/icons-material/Circle';
import axios from "axios";


import { useLocation, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import logo from '../images/sloganLogo.png';

const drawerWidth = 250;
const collapsedWidth = 70;

const Sidebar = ({ open, onClose }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [userType, setUserType] = useState(null);
    const [reportsOpen, setReportsOpen] = useState(false);
    const [attendanceOpen, setAttendanceOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserType(decoded?.userType);
            } catch (err) {
                console.error("Token decode error", err);
            }
        }
    }, []);

    const [employees, setEmployees] = useState([]);
    const [showUsersDropdown, setShowUsersDropdown] = useState(false);
    const [usersDropdownPos, setUsersDropdownPos] = useState({ top: 0, left: 0 });
    const [userStats, setUserStats] = useState(null);

    // useEffect(() => {
    //     const fetchSidebarUsers = async () => {
    //         try {
    //             const res = await axios.get("https://myuniversallanguages.com:9093/api/v1/owner/getCompanyemployee", {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                 },
    //             });
    //             const { onlineUsers = [], offlineUsers = [] } = res.data;
    //             const all = [...onlineUsers, ...offlineUsers].filter(u => !u.isArchived && !u.UserStatus);
    //             setSidebarUsers(all);
    //         } catch (err) {
    //             console.error("Sidebar users fetch failed", err);
    //         }
    //     };
    //     if (userType === 'owner' || userType === 'admin' || userType === 'manager') {
    //         fetchSidebarUsers();
    //     }
    // }, []);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const res = await axios.get("https://myuniversallanguages.com:9093/api/v1/owner/getCompanyemployee", {
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

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        if (isMobile && open) {
            setCollapsed(false); // Always expand the sidebar on mobile
        }
    }, [isMobile, open]);

    const handleNavigate = (route) => {
        navigate(route);
        if (isMobile) setMobileOpen(false);
    };

    const sidebarItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, route: '/dashboard' },
        { text: 'Timeline', icon: <TimelineIcon />, route: '/timeline' },
        ...(userType !== 'user' ? [{ text: 'Team', icon: <PeopleIcon />, route: '/team' }] : []),
        ...(userType !== 'user' ? [{ text: 'Projects', icon: <FolderIcon />, route: '/Projects' }] : []),
        { isDropdown: 'reports' },
        { isDropdown: 'attendance' },
        { text: 'Leave Management', icon: <CalendarTodayIcon />, route: '/leave-management' },
        { text: 'Location Tracking', icon: <MapIcon />, route: '/Locationtracking' },

        // { text: 'Pay Stub Managment', icon: <AttachMoneyIcon />, route: '/pay_stub_managment' },
        ...(userType === 'owner' || userType === 'admin' ? [
            { text: 'Pay Stub Managment', icon: <PeopleIcon />, route: '/pay_stub_managment' }
        ] : []),
        
        ...(userType === 'manager' ? [{ text: 'Attendence Management', icon: <PeopleIcon />, route: '/attendence-management' }] : []),
    ];

    const filteredSidebarItems = sidebarItems.filter(item => {
        if (item.isDropdown === 'attendance' && ['manager', 'user'].includes(userType)) return false;
        return true;
    });

    const drawerContent = (
        <div>
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
                    if (item.text === 'Timeline' && userType !== 'user') {
                        return (
                            <div
                                key="timeline-tab"
                                onMouseEnter={async (e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setUsersDropdownPos({ top: rect.top, left: rect.right });
                                    setShowUsersDropdown(true);

                                    try {
                                        const res = await fetch("https://myuniversallanguages.com:9093/api/v1/owner/getCompanyemployee", {
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
                                }}
                                onMouseLeave={() => setShowUsersDropdown(false)}
                            >
                                <Tooltip title={collapsed ? 'Timeline' : ''} placement="right">
                                    <ListItemButton
                                        onClick={() => handleNavigate('/timeline')}
                                        sx={{
                                            backgroundColor: location.pathname === '/timeline' ? '#7ACB59' : 'transparent',
                                            color: '#ffffff',
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}><TimelineIcon /></ListItemIcon>
                                        {!collapsed && <ListItemText primary="Timeline" />}
                                    </ListItemButton>
                                </Tooltip>

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
                                            maxHeight: '80vh',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        {userStats ? (
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
                                                                        {/* <p key={u.userId}

                                                                        onClick={() => {
                                                                            navigate(`/timeline/${u.userId}`);
                                                                            setShowUsersDropdown(false);
                                                                        }}
                                                                        style={{ fontSize: '13px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: '6px' }}> */}
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
                                                        {/* <p style={{ fontSize: '13px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                                                        Offline Users:
                                                    </p> */}
                                                        {Array.isArray(userStats.offlineUsers) && userStats.offlineUsers.filter(u => u.userName).length > 0 ? (
                                                            userStats.offlineUsers
                                                                .filter(u => u.userName)
                                                                .sort((a, b) => a.userName.localeCompare(b.userName))
                                                                .map((u) => (
                                                                    // <p key={u.userId} style={{ fontSize: '13px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    //     <span
                                                                    //         style={{
                                                                    //             width: 10,
                                                                    //             height: 10,
                                                                    //             borderRadius: '50%',
                                                                    //             backgroundColor: '#fff',
                                                                    //             display: 'inline-block',
                                                                    //             boxShadow: '0 0 3px #fff',
                                                                    //         }}
                                                                    //     ></span>
                                                                    //     {u.userName}
                                                                    // </p>
                                                                    // <p
                                                                    //     key={u.userId}
                                                                    //     onClick={() => {
                                                                    //         navigate(`/timeline/${u.userId}`);
                                                                    //         setShowUsersDropdown(false);
                                                                    //     }}
                                                                    //     style={{
                                                                    //         fontSize: '13px',
                                                                    //         marginBottom: 8,
                                                                    //         display: 'flex',
                                                                    //         alignItems: 'center',
                                                                    //         gap: '10px',
                                                                    //         background: '#003366',
                                                                    //         padding: '6px 10px',
                                                                    //         borderRadius: '6px',
                                                                    //         cursor: 'pointer'

                                                                    //     }}
                                                                    // >
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
                        );

                    }

                    // 🟨 REPORTS DROPDOWN
                    if (item.isDropdown === 'reports') {
                        const isActive = location.pathname.includes('/reports');
                        return (
                            <div key="reports-dropdown">
                                <Tooltip title={collapsed ? 'Reports' : ''} placement="right">
                                    <ListItemButton onClick={() => setReportsOpen(!reportsOpen)}
                                        sx={{ backgroundColor: isActive ? '#7ACB59' : 'transparent', color: '#ffffff' }}>
                                        <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                                            <AssignmentIcon />
                                        </ListItemIcon>
                                        {!collapsed && <ListItemText primary="Reports" />}
                                        {!collapsed && (reportsOpen ? <ExpandLess /> : <ExpandMore />)}
                                    </ListItemButton>
                                </Tooltip>
                                <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItemButton sx={{ pl: collapsed ? 2 : 6 }} onClick={() => handleNavigate('/reports')}>
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}><ArticleIcon /></ListItemIcon>
                                            {!collapsed && <ListItemText primary="Detailed Reports" />}
                                        </ListItemButton>
                                        <ListItemButton sx={{ pl: collapsed ? 2 : 6 }} onClick={() => handleNavigate('/punctuality-reports')}>
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}><AccessTimeIcon /></ListItemIcon>
                                            {!collapsed && <ListItemText primary="Punctuality Reports" />}
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            </div>
                        );
                    }

                    // 🟩 ATTENDANCE DROPDOWN
                    if (item.isDropdown === 'attendance' && !['manager', 'user'].includes(userType)) {
                        const isActive = location.pathname.includes('/attendence-management');
                        return (
                            <div key="attendance-dropdown">
                                <Tooltip title={collapsed ? 'Attendance' : ''} placement="right">
                                    <ListItemButton onClick={() => setAttendanceOpen(!attendanceOpen)}
                                        sx={{ backgroundColor: isActive ? '#7ACB59' : 'transparent', color: '#ffffff' }}>
                                        <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}><AccessTimeIcon /></ListItemIcon>
                                        {!collapsed && <ListItemText primary="Attendance" />}
                                        {!collapsed && (attendanceOpen ? <ExpandLess /> : <ExpandMore />)}
                                    </ListItemButton>
                                </Tooltip>
                                <Collapse in={attendanceOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItemButton sx={{ pl: collapsed ? 2 : 6 }} onClick={() => handleNavigate('/settings/break-time')}>
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}><AccessTimeIcon /></ListItemIcon>
                                            {!collapsed && <ListItemText primary="Break Time" />}
                                        </ListItemButton>
                                        <ListItemButton sx={{ pl: collapsed ? 2 : 6 }} onClick={() => handleNavigate('/attendence-management')}>
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}><TimelineIcon /></ListItemIcon>
                                            {!collapsed && <ListItemText primary="Attendance Management" />}
                                        </ListItemButton>
                                        <ListItemButton sx={{ pl: collapsed ? 2 : 6 }} onClick={() => handleNavigate('/settings/punctuality')}>
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}><TimelineIcon /></ListItemIcon>
                                            {!collapsed && <ListItemText primary="Punctuality" />}
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            </div>
                        );
                    }

                    // 🟥 ALL OTHER REGULAR ITEMS
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
        </div>
    );

    return (
        <>
            {/* {isMobile && (
                <IconButton
                    onClick={handleDrawerToggle}
                    sx={{ position: 'fixed', top: 10, left: 10, zIndex: 2000, color: 'white' }}
                >
                    <ChevronRightIcon />
                </IconButton>
            )} */}

            {!isMobile && (
                <IconButton
                    onClick={() => setCollapsed(!collapsed)}
                    sx={{ color: 'white' }}
                >
                    {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            )}

            {/* <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={isMobile ? open : true}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    width: isMobile ? drawerWidth : (collapsed ? collapsedWidth : drawerWidth),
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: isMobile ? drawerWidth : (collapsed ? collapsedWidth : drawerWidth),
                        boxSizing: 'border-box',
                        backgroundColor: '#003366',
                        color: '#fff',
                        transition: 'width 0.3s',
                        borderRight: 'none'
                    },
                }}
            > */}
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
                        width: isMobile ? drawerWidth : (collapsed ? collapsedWidth : drawerWidth),
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

