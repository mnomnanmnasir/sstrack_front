import React, { useState, useEffect } from 'react';
import {
    Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    IconButton, Tooltip, Collapse
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
    AccessTime as AccessTimeIcon
} from '@mui/icons-material';

import { useLocation, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import logo from '../images/sloganLogo.png';

const drawerWidth = 250;
const collapsedWidth = 70;

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [userType, setUserType] = useState(null);
    const [reportsOpen, setReportsOpen] = useState(false);
    const [attendanceOpen, setAttendanceOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

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

    const sidebarItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, route: '/dashboard' },
        { text: 'Timeline', icon: <TimelineIcon />, route: '/timeline' },
        ...(userType !== 'user' ? [{ text: 'Team', icon: <PeopleIcon />, route: '/team' }] : []),
        // { text: 'Projects', icon: <FolderIcon />, route: '/Projects' },
        ...(userType !== 'user' ? [{ text: 'Projects', icon: <FolderIcon />, route: '/Projects' }] : []),
        { isDropdown: 'reports' },           // ✅ Reports dropdown
        { isDropdown: 'attendance' },        // ✅ Attendance dropdown (added here)
        { text: 'Leave Management', icon: <CalendarTodayIcon />, route: '/leave-management' },
        { text: 'Location Tracking', icon: <MapIcon />, route: '/Locationtracking' },
        // { text: 'Attendence Management', icon: <SettingsIcon />, route: '/attendence-management' },
        ...(userType === 'manager' ? [{ text: 'Attendence Management', icon: <PeopleIcon />, route: '/attendence-management' }] : []),
    ];

    const handleNavigate = (route) => {
        navigate(route);
    };

    const filteredSidebarItems = sidebarItems.filter(item => {
        // if (item.isDropdown === 'attendance' && userType === 'manager') return false;
        if (item.isDropdown === 'attendance' && ['manager', 'user'].includes(userType)) return false;

        return true;
    });

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: collapsed ? collapsedWidth : drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: collapsed ? collapsedWidth : drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#003366',
                    color: '#fff',
                    transition: 'width 0.3s',
                    borderRight: 'none',
                },
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 10px' }}>
                {!collapsed && (
                    <img src={logo} alt="Logo" className="logo" style={{ height: 50, marginRight: 'auto' }} />
                )}
                <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: 'white' }}>
                    {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </div>

            <List>
                {filteredSidebarItems.map((item, index) => {
                    // Inject the Reports dropdown in place
                    if (item.isDropdown === 'reports') {
                        const isActive = location.pathname.includes('/reports');
                        return (
                            <div key="reports-dropdown">
                                <Tooltip title={collapsed ? 'Reports' : ''} placement="right">
                                    <ListItemButton
                                        onClick={() => setReportsOpen(!reportsOpen)}
                                        sx={{
                                            backgroundColor: isActive ? '#7ACB59' : 'transparent',
                                            color: isActive ? '#ffffff' : '#ffffff',
                                            borderRadius: '8px',
                                            margin: '4px 8px',
                                            '&:hover': {
                                                backgroundColor: isActive ? '#7ACB59' : '#1a476b',
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: isActive ? '#003366' : '#fff', minWidth: 40 }}>
                                            <AssignmentIcon />
                                        </ListItemIcon>
                                        {!collapsed && <ListItemText primary="Reports" />}
                                        {!collapsed && (reportsOpen ? <ExpandLess /> : <ExpandMore />)}
                                    </ListItemButton>
                                </Tooltip>

                                <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItemButton
                                            sx={{ pl: collapsed ? 2 : 6 }}
                                            onClick={() => handleNavigate('/reports')}
                                        >
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                                                <ArticleIcon />
                                            </ListItemIcon>
                                            {!collapsed && <ListItemText primary="Detailed Reports" />}
                                        </ListItemButton>

                                        <ListItemButton
                                            sx={{ pl: collapsed ? 2 : 6 }}
                                            onClick={() => handleNavigate('/punctuality-reports')}
                                        >
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                                                <AccessTimeIcon />
                                            </ListItemIcon>
                                            {!collapsed && <ListItemText primary="Punctuality Reports" />}
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            </div>
                        );
                    }

                    if (item.isDropdown === 'attendance' && !['manager', 'user'].includes(userType)) {
                        // if (item.isDropdown === 'attendance') {
                        const isActive = location.pathname.includes('/attendence-management');
                        return (
                            <div key="attendance-dropdown">
                                <Tooltip title={collapsed ? 'Attendance' : ''} placement="right">
                                    <ListItemButton
                                        onClick={() => setAttendanceOpen(!attendanceOpen)}
                                        sx={{
                                            backgroundColor: isActive ? '#7ACB59' : 'transparent',
                                            color: isActive ? '#003366' : '#ffffff',
                                            borderRadius: '8px',
                                            margin: '4px 8px',
                                            '&:hover': {
                                                backgroundColor: isActive ? '#7ACB59' : '#1a476b',
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                                            <AccessTimeIcon />
                                        </ListItemIcon>
                                        {!collapsed && <ListItemText primary="Attendance" />}
                                        {!collapsed && (attendanceOpen ? <ExpandLess /> : <ExpandMore />)}
                                    </ListItemButton>
                                </Tooltip>

                                <Collapse in={attendanceOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItemButton
                                            sx={{
                                                pl: collapsed ? 2 : 6,
                                                // backgroundColor: location.pathname === '/settings/break-time' ,
                                                // color: location.pathname === '/settings/break-time' ? '#003366' : '#fff',

                                            }}
                                            onClick={() => handleNavigate('/settings/break-time')}
                                        >
                                            {/* <ListItemIcon sx={{ color: location.pathname === '/settings/break-time'}}> */}
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>

                                                <AccessTimeIcon />
                                            </ListItemIcon>
                                            {!collapsed && <ListItemText primary="Break Time" />}
                                        </ListItemButton>

                                        <ListItemButton
                                            sx={{
                                                pl: collapsed ? 2 : 6,
                                                // backgroundColor: location.pathname === '/attendence-management',
                                                // color: location.pathname === '/attendence-management' ? '#003366' : '#fff',

                                            }}
                                            onClick={() => handleNavigate('/attendence-management')}
                                        >
                                            {/* <ListItemIcon sx={{ color: location.pathname === '/attendence-management' }}> */}
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                                                <TimelineIcon />
                                            </ListItemIcon>
                                            {!collapsed && <ListItemText primary="Attendance Management" />}
                                        </ListItemButton>

                                        <ListItemButton
                                            sx={{
                                                pl: collapsed ? 2 : 6,
                                                // backgroundColor: location.pathname === '/settings/punctuality' ? '#7ACB59' : 'transparent',
                                                // color: location.pathname === '/settings/punctuality' ? '#003366' : '#fff',
                                            }}
                                            onClick={() => handleNavigate('/settings/punctuality')}
                                        >
                                            {/* <ListItemIcon sx={{ color: location.pathname === '/settings/punctuality' }}> */}
                                            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                                                <TimelineIcon />
                                            </ListItemIcon>
                                            {!collapsed && <ListItemText primary="Punctuality" />}
                                        </ListItemButton>

                                    </List>
                                </Collapse>
                            </div>
                        );
                    }

                    // Regular items
                    const isActive = location.pathname === item.route || (location.pathname.includes(item.route) && item.route !== '/');
                    return (
                        <Tooltip title={collapsed ? item.text : ''} placement="right" key={index}>
                            <ListItemButton
                                onClick={() => handleNavigate(item.route)}
                                sx={{
                                    backgroundColor: isActive ? '#7ACB59' : 'transparent',
                                    color: isActive ? '#ffffff' : '#ffffff',
                                    borderRadius: '8px',
                                    margin: '4px 8px',
                                    '&:hover': {
                                        backgroundColor: isActive ? '#7ACB59' : '#1a476b',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? '#fff' : '#fff', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                {!collapsed && <ListItemText primary={item.text} />}
                            </ListItemButton>
                        </Tooltip>
                    );
                })}
            </List>

        </Drawer>
    );
};

export default Sidebar;
