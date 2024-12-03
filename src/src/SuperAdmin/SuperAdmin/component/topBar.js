import React from 'react';
import { Box, TextField, InputAdornment, IconButton, Avatar, Typography, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';

function TopBar() {
  const currentDateTime = new Date().toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        padding: '10px 20px',
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: 1,
        marginBottom: 3,
      }}
    >
      {/* Search Field */}
      {/* <TextField
        placeholder="Search"
        variant="outlined"
        size="small"
        sx={{
          width: '300px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            // backgroundColor: '#f1f3f5',
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: 'none',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      /> */}

      {/* Right Section with Icons and Date */}
      <Box display="flex" alignItems="center" gap={2}>
        {/* <IconButton>
          <NotificationsIcon />
        </IconButton> */}

        {/* Language Selector */}
        {/* <Select
          value="ENG"
          variant="outlined"
          size="small"
          sx={{
            fontSize: '0.875rem',
            '& .MuiSelect-icon': {
              color: 'inherit',
            },
          }}
        >
          <MenuItem value="ENG">ENG</MenuItem>
          <MenuItem value="SPA">SPA</MenuItem>
          <MenuItem value="FRA">FRA</MenuItem>
        </Select> */}

        {/* Profile Avatar */}
        <Avatar src="/assets/images/profile.jpg" alt="User Profile" sx={{ width: 32, height: 32 }} />

        {/* Date and Time */}
        <Typography variant="body2" color="textSecondary">
          {currentDateTime}
        </Typography>
      </Box>
    </Box>
  );
}

export default TopBar;
