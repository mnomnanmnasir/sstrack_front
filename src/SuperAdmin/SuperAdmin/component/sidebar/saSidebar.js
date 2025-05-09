import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
  Typography,
  Divider,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/Logo.png';

function SaSidebar({ selectedItem, onSelectItem }) {
  const [open, setOpen] = useState(true); // Sidebar toggle state
  const isMobile = useMediaQuery('(max-width:600px)'); // Detect mobile view
  const navigate = useNavigate(); // For navigation

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token_for_sa'); // Clear authentication token
    navigate('/'); // Redirect to login page
    window.location.reload();
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon /> },
    { label: 'Total Companies', icon: <BusinessIcon /> },
    { label: 'Requests', icon: <PeopleIcon /> },
    // { label: 'Punctuality Reports', icon: <BarChartIcon /> },
    { label: 'Financials', icon: <BarChartIcon /> },
    // { label: 'Create Blogs', icon: <BarChartIcon /> },    
  ];

  return (
    <>
      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
            backgroundColor: '#1a3e5b',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 0',
          },
        }}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
      >
        {/* Logo */}
        <img src={Logo} alt="SS Track Logo" style={{ width: '150px', marginBottom: '20px' }} />

        {/* User Info */}
        <Avatar
          style={{
            width: '80px',
            height: '80px',
            marginBottom: '10px',
            border: '2px solid #ffffff',
            backgroundColor: '#6DBB48',
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          KT
        </Avatar>

        <Typography variant="h6" style={{ color: 'white', marginBottom: '5px' }}>
          Kamran Tariq
        </Typography>
        <Typography variant="body2" style={{ color: '#b0bec5', marginBottom: '20px' }}>
          kamran@handshr.com
        </Typography>

        {/* Menu Items */}
        <List style={{ width: '100%' }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.label}
              onClick={() => onSelectItem(item.label)} // Notify parent of selection
              style={{
                backgroundColor: selectedItem === item.label ? '#6DBB48' : 'transparent',
                color: 'white',
                marginBottom: '10px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {item.icon}
              <ListItemText primary={item.label} style={{ marginLeft: '15px' }} />
            </ListItem>
          ))}

          {/* Divider above Logout */}
          <Divider style={{ backgroundColor: '#ffffff', margin: '10px 0' }} />

          {/* Logout Button */}
          <ListItem
            button
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              marginBottom: '10px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            <LogoutIcon style={{ marginRight: '15px' }} />
            <ListItemText primary="Logout" />
          </ListItem>
        </List>

        {/* Footer */}
        <div style={{ marginTop: 'auto', padding: '10px', textAlign: 'center' }}>
          <Divider style={{ backgroundColor: '#ffffff', marginBottom: '10px' }} />
          <Typography variant="caption" style={{ color: '#b0bec5' }}>
            Copyright © 2025 By SS Track. <br /> All Rights Reserved
          </Typography>
        </div>
      </Drawer>

      {/* Menu Button (Mobile Only) */}
      {isMobile && (
        <div style={{ position: 'fixed', top: 10, left: 10 }}>
          <IconButton color="inherit" onClick={handleDrawerToggle}>
            <MenuIcon style={{ color: '#ffffff' }} />
          </IconButton>
        </div>
      )}
    </>
  );
}

export default SaSidebar;
