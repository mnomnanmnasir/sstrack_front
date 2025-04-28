

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

        { text: 'Pay Stub Managment', icon: <AttachMoneyIcon />, route: '/pay_stub_managment' },

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

            <Drawer
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
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Sidebar;

