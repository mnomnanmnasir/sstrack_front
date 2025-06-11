import React, { useState } from 'react';
// import { Box, Grid, Typography, Card, Button } from '@mui/material';
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
// import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TuneIcon from '@mui/icons-material/Tune';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const alertData = [
  {
    type: 'Geofence Exit',
    description: 'John Smith left Main Office',
    location: 'Main Office',
    employee: 'John Smith',
    time: '10:23 AM',
    date: '2025-05-16',
    status: 'New',
    priority: 'High',
  },
  {
    type: 'Geofence Entry',
    description: 'Mike Jones entered Warehouse B',
    location: 'Warehouse B',
    employee: 'Mike Jones',
    time: '09:45 AM',
    date: '2025-05-16',
    status: 'Acknowledged',
    priority: 'Medium',
  },
  {
    type: 'Schedule Violation',
    description: 'Sarah Johnson arrived 30 minutes late',
    location: 'Customer Site',
    employee: 'Sarah Johnson',
    time: '08:30 AM',
    date: '2025-05-16',
    status: 'Resolved',
    priority: 'Low',
  },
  {
    type: 'Geofence Exit',
    description: 'David Brown left Downtown Area',
    location: 'Downtown Area',
    employee: 'David Brown',
    time: 'Yesterday',
    date: '2025-05-15',
    status: 'New',
    priority: 'High',
  },
  {
    type: 'Unauthorized Access',
    description: 'Unknown employee attempted to access Secure Zone',
    location: 'Secure Zone',
    employee: 'Unknown',
    time: 'Yesterday',
    date: '2025-05-15',
    status: 'Acknowledged',
    priority: 'Medium',
  },
];

const statusColor = {
  New: 'error',
  Acknowledged: 'warning',
  Resolved: 'success',
};

const AlertComp = () => {

  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedImages, setSelectedImages] = useState([]);

  const filteredAlerts =
    priorityFilter === 'All'
      ? alertData
      : alertData.filter((item) => item.priority === priorityFilter);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const handleModalClose = () => {
    setOpenCreateModal(false);
    setSelectedImages([]); // Clear the image state
  };

  return (
    <>
      <div className="container">
        <div className="userHeader">
          <h5>Alerts</h5>
        </div>
        <div className="mainwrapper ownerTeamContainer" style={{ justifyContent: "center", paddingBottom: "90px" }}>

          <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
              {/* <Typography variant="h5" fontWeight="bold"></Typography> */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" startIcon={<NotificationsNoneIcon />}>
                  Configure Alert Rules
                </Button>
                <Button variant="contained" onClick={() => setOpenCreateModal(true)}>
                  Create Alert
                </Button>
              </Box>
            </Box>

            {/* Alert Cards */}

            <Grid container spacing={3}>
              {/* High Priority */}
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    padding: 3,
                    backgroundColor: '#fff5f5',
                    border: '1px solid #f8d7da',
                    borderRadius: '12px',
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ErrorOutlineIcon sx={{ color: '#d32f2f', mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold">High Priority</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Immediate attention required
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="error">2</Typography>
                </Card>
              </Grid>

              {/* Medium Priority */}
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    padding: 3,
                    backgroundColor: '#fff9e6',
                    border: '1px solid #ffe0b2',
                    borderRadius: '12px',
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ReportProblemOutlinedIcon sx={{ color: '#fb8c00', mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold">Medium Priority</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Attention required soon
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#fb8c00' }}>2</Typography>
                </Card>
              </Grid>

              {/* Low Priority */}
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    padding: 3,
                    backgroundColor: '#f5f9ff',
                    border: '1px solid #bbdefb',
                    borderRadius: '12px',
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <NotificationsNoneIcon sx={{ color: '#2196f3', mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold">Low Priority</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    For information only
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#2196f3' }}>1</Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">Alerts</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<NotificationsNoneIcon />}>Configure Alert Rules</Button>
              <Button variant="contained">Create Alert</Button>
            </Box>
          </Box> */}

          {/* Filters */}
          {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <TextField
              placeholder="Search alerts..."
              size="small"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              size="small"
              variant="outlined"
              defaultValue="All"
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Acknowledged">Acknowledged</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
            </TextField>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {['All Alerts', 'High Priority', 'Medium Priority', 'Low Priority'].map((label, idx) => (
                <Button key={idx} variant={idx === 0 ? 'contained' : 'outlined'} size="small">
                  {label}
                </Button>
              ))}
            </Box>
          </Box> */}

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 4, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search alerts..."
              size="small"
              variant="outlined"
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              size="small"
              variant="outlined"
              defaultValue="All"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Acknowledged">Acknowledged</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
            </TextField>
            <IconButton sx={{ border: '1px solid #ccc', borderRadius: 1 }}>
              <TuneIcon />
            </IconButton>
          </Box>

          {/* 🔘 Tabs for Priority */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {['All', 'High', 'Medium', 'Low'].map((label) => (
              <Button
                key={label}
                variant={priorityFilter === label ? 'contained' : 'outlined'}
                size="small"
                sx={{
                  textTransform: 'none',
                  color: priorityFilter === label ? '#fff' : undefined,
                  backgroundColor:
                    priorityFilter === label
                      ? {
                        All: '#6c757d',
                        High: '#f44336',
                        Medium: '#fb8c00',
                        Low: '#2196f3',
                      }[label]
                      : undefined,
                  '&:hover': {
                    backgroundColor:
                      priorityFilter === label
                        ? {
                          All: '#5a6268',
                          High: '#d32f2f',
                          Medium: '#ef6c00',
                          Low: '#1976d2',
                        }[label]
                        : undefined,
                  },
                }}
                onClick={() => setPriorityFilter(label)}
              >
                {label === 'All' ? 'All Alerts' : `${label} Priority`}
              </Button>
            ))}
          </Box>

          {/* Alert Table */}
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f9f9f9' }}>
                <TableRow>
                  <TableCell><strong>Alert</strong></TableCell>
                  <TableCell><strong>Location</strong></TableCell>
                  <TableCell><strong>Employee</strong></TableCell>
                  <TableCell><strong>Time</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAlerts.map((alert, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {alert.type.includes('Unauthorized') ? (
                            <ErrorOutlineIcon sx={{ color: '#e53935' }} />
                          ) : alert.type.includes('Violation') ? (
                            <WarningAmberOutlinedIcon sx={{ color: '#fb8c00' }} />
                          ) : (
                            <RoomOutlinedIcon sx={{ color: alert.type.includes('Exit') ? '#e53935' : '#4caf50' }} />
                          )}
                          <strong>{alert.type}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {alert.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{alert.location}</TableCell>
                    <TableCell>{alert.employee}</TableCell>
                    <TableCell>
                      <Typography>{alert.time}</Typography>
                      <Typography variant="caption" color="text.secondary">{alert.date}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={alert.status} color={statusColor[alert.status]} size="small" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" variant="text">View</Button>
                        {alert.status !== 'Resolved' && (
                          <Button size="small" variant="outlined">
                            {alert.status === 'Acknowledged' ? 'Resolve' : 'Acknowledge'}
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Alert</DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Create a new alert for geofence violations, schedule deviations, or other issues.
              </Typography>

              {/* Alert Type & Priority */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField label="Alert Type" fullWidth select defaultValue="">
                  <MenuItem value="">Select type</MenuItem>
                  <MenuItem value="geofence-exit">Geofence Exit</MenuItem>
                  <MenuItem value="geofence-entry">Geofence Entry</MenuItem>
                  <MenuItem value="schedule-violation">Schedule Violation</MenuItem>
                  <MenuItem value="unauthorized-access">Unauthorized Access</MenuItem>
                </TextField>
                <TextField label="Priority" fullWidth select defaultValue="Medium">
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </TextField>
              </Box>

              {/* Description */}
              <TextField
                label="Description"
                placeholder="Describe the alert details..."
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />

              {/* Location & Employee */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField label="Location" fullWidth placeholder="Enter location" />
                <TextField label="Employee (Optional)" select fullWidth defaultValue="">
                  <MenuItem value="">Select employee</MenuItem>
                  <MenuItem value="john">John Smith</MenuItem>
                  <MenuItem value="mike">Mike Jones</MenuItem>
                  <MenuItem value="sarah">Sarah Johnson</MenuItem>
                  {/* You can dynamically load these from an employee list */}
                </TextField>
              </Box>

              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                Leave empty for system-wide alerts
              </Typography>

              {/* Image Upload */}
              <Box sx={{ mb: 2 }}>
                <Button variant="outlined" component="label">
                  Add Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Upload relevant photos for this alert (optional)
                </Typography>
              </Box>
              {selectedImages.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                  {selectedImages.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                    />
                  ))}
                </Box>
              )}

            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleModalClose}>
                Create Alert
              </Button>
            </DialogActions>
          </Dialog>

        </div>
      </div>
    </>

  );
};

export default AlertComp;
