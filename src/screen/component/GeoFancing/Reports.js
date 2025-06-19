import React, { useState } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Grid,
    Card,
    CardContent,
    Button,
    MenuItem,
    TextField,
    IconButton
} from '@mui/material';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import MapIcon from '@mui/icons-material/Map';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);


const Reports = () => {

    const [tab, setTab] = useState(0);
    const [range, setRange] = useState('Last 7 Days');

    const handleTabChange = (e, newValue) => {
        setTab(newValue);
    };

    const reportCards = [
        {
            icon: <PeopleOutlineIcon color="primary" />,
            title: 'Employee Report',
            desc: 'Attendance and productivity data',
        },
        {
            icon: <MapIcon color="primary" />,
            title: 'Geofence Activity',
            desc: 'Entry, exit and violation data',
        },
        {
            icon: <SummarizeOutlinedIcon color="primary" />,
            title: 'Alert Summary',
            desc: 'Alert types and resolution times',
        },
        {
            icon: <ScheduleIcon color="primary" />,
            title: 'Time & Attendance',
            desc: 'Hours worked and schedule adherence',
        },
        {
            icon: <InsightsOutlinedIcon color="primary" />,
            title: 'System Performance',
            desc: 'App usage and reliability metrics',
        },
        {
            icon: <AssessmentOutlinedIcon color="primary" />,
            title: 'Custom Report',
            desc: 'Create your own report',
        },
    ];

    return (
        <>

            <div className="container">

                <div className="userHeader">

                    <h5>Reports</h5>

                </div>

                <div className="mainwrapper ownerTeamContainer" style={{ justifyContent: "center", paddingBottom: "90px" }}>
                    <Box sx={{ pb: 6 }}>
                        {/* <Box sx={{ mb: 2 }}>
                            <Typography variant="h5" fontWeight="bold">Reports</Typography>
                        </Box> */}

                        {/* Filters */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                            <TextField select size="small" value={range} onChange={(e) => setRange(e.target.value)}>
                                <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
                                <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
                                <MenuItem value="Custom">Custom Range</MenuItem>
                            </TextField>
                            <Button variant="outlined">📅 Date Range</Button>
                            <Button variant="contained" startIcon={<FileDownloadIcon />}>Export Report</Button>
                        </Box>

                        {/* Tabs */}
                        <Box
                            sx={{
                                borderRadius: 2,
                                overflow: 'hidden',
                                background: '#6c757d',
                                // mb: 3,
                                px: 0.6,
                                py: 1
                                // p:1
                            }}
                        >
                            <Tabs
                                value={tab}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                sx={{
                                    '& .MuiTabs-flexContainer': {
                                        justifyContent: 'space-between',
                                    },
                                    '& .MuiTab-root': {
                                        minHeight: 44,
                                        color: '#cfd4da',
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        borderRadius: '6px',
                                        // px: 2,
                                        transition: 'background-color 0.3s ease',
                                    },
                                    '& .Mui-selected': {
                                        backgroundColor: '#fff',
                                        color: '#000',
                                    },
                                    '& .MuiTabs-indicator': {
                                        display: 'none',
                                    },
                                }}
                            >
                                <Tab icon={<AccessTimeIcon fontSize="small" />} iconPosition="start" label="Overview" />
                                <Tab icon={<PeopleOutlineIcon fontSize="small" />} iconPosition="start" label="Attendance" />
                                <Tab icon={<MapIcon fontSize="small" />} iconPosition="start" label="Geofence Activity" />
                                <Tab icon={<InsightsOutlinedIcon fontSize="small" />} iconPosition="start" label="Alert Analytics" />
                            </Tabs>
                        </Box>

                        {tab === 0 && (
                            <>
                                {/* Report Cards */}
                                <Grid container spacing={3} mb={3}>
                                    {reportCards.map((item, i) => (
                                        <Grid item xs={12} sm={6} md={4} key={i}>
                                            <Card sx={{ borderRadius: 2 }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        {item.icon}
                                                        <Typography variant="subtitle1" fontWeight="bold">{item.title}</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" mb={2}>{item.desc}</Typography>
                                                    <Button variant="outlined" fullWidth>View Report</Button>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Charts Section */}
                                <Grid container spacing={3}>
                                    {/* Bar Chart */}
                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ borderRadius: 2 }}>
                                            <CardContent sx={{ height: 300 }}>
                                                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                                                    Employee Attendance Summary
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">Last 5 days</Typography>
                                                <Box sx={{ height: 220 }}>
                                                    <Bar
                                                        data={{
                                                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                                                            datasets: [
                                                                { label: 'present', data: [12, 11, 10, 10, 9], backgroundColor: '#4caf50' },
                                                                { label: 'late', data: [1, 1, 2, 0, 2], backgroundColor: '#ffeb3b' },
                                                                { label: 'absent', data: [1, 2, 1, 2, 3], backgroundColor: '#f44336' },
                                                            ],
                                                        }}
                                                        options={{
                                                            responsive: true,
                                                            maintainAspectRatio: false,
                                                            plugins: {
                                                                legend: { position: 'bottom' },
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Pie Chart */}
                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ borderRadius: 2 }}>
                                            <CardContent sx={{ height: 300 }}>
                                                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                                                    Alert Distribution
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" mb={2}>
                                                    By alert type
                                                </Typography>
                                                <Box sx={{ height: 220 }}>
                                                    <Pie
                                                        data={{
                                                            labels: ['Geofence Entry', 'Geofence Exit', 'Schedule Violation', 'Unauthorized Access'],
                                                            datasets: [
                                                                {
                                                                    label: 'Alert Type %',
                                                                    data: [41, 38, 16, 5],
                                                                    backgroundColor: ['#2196f3', '#4caf50', '#ff9800', '#f44336'],
                                                                },
                                                            ],
                                                        }}
                                                        options={{
                                                            responsive: true,
                                                            maintainAspectRatio: false,
                                                            plugins: {
                                                                legend: { position: 'right' },
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                </Grid>
                            </>
                        )}

                        {tab === 1 && (
                            <Grid item xs={12}>
                                <Card sx={{ borderRadius: 2 }}>
                                    <CardContent sx={{ height: 400 }}>
                                        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                                            Employee Attendance Report
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" mb={2}>
                                            Daily Attendance Statistics
                                        </Typography>
                                        <Box sx={{ height: 300 }}>
                                            <Bar
                                                data={{
                                                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                                                    datasets: [
                                                        {
                                                            label: 'present',
                                                            data: [12, 11, 10, 11, 9],
                                                            backgroundColor: '#4caf50',
                                                        },
                                                        {
                                                            label: 'late',
                                                            data: [1, 1, 1, 2, 2],
                                                            backgroundColor: '#ffeb3b',
                                                        },
                                                        {
                                                            label: 'absent',
                                                            data: [0, 0, 2, 0, 2],
                                                            backgroundColor: '#f44336',
                                                        },
                                                    ],
                                                }}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: {
                                                            position: 'bottom',
                                                        },
                                                    },
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                            ticks: {
                                                                stepSize: 3,
                                                            },
                                                        },
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                        {/* Cards */}
                        {/* <Grid container spacing={3}>
                            {reportCards.map((item, i) => (
                                <Grid item xs={12} sm={6} md={4} key={i}>
                                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                {item.icon}
                                                <Typography variant="subtitle1" fontWeight="bold">{item.title}</Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" mb={2}>{item.desc}</Typography>
                                            <Button variant="outlined" fullWidth>View Report</Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid> */}
                    </Box>
                </div>
            </div>
        </>
    )
}


export default Reports; 