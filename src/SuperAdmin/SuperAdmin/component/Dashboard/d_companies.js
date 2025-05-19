import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Button, CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

function DCompanies() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companyHours, setCompanyHours] = useState({});

    const calculateCompanyTotalHours = (companyId) => {
        const usersMap = companyHours[companyId];
        if (!usersMap) return '0h 0m';

        let totalMinutes = 0;

        Object.values(usersMap).forEach((timeStr) => {
            const match = timeStr.match(/(\d+)h\s*(\d+)m/);
            if (match) {
                const hours = parseInt(match[1], 10);
                const minutes = parseInt(match[2], 10);
                totalMinutes += hours * 60 + minutes;
            }
        });

        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;

        return `${totalHours}h ${remainingMinutes}m`;
    };

    const fetchCompanyHours = async () => {
        try {
            const token = localStorage.getItem('token_for_sa');
            if (!token) return;

            const response = await axios.get('https://myuniversallanguages.com:9093/api/v1/SystemAdmin/companiesHours', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const hoursData = response.data.otherCompanies;

                const hoursMap = {};

                hoursData.forEach((company) => {
                    if (!company._id || !Array.isArray(company.users)) return;

                    if (!hoursMap[company._id]) hoursMap[company._id] = {};

                    company.users.forEach((user) => {
                        hoursMap[company._id][user._id] = user.totalHours || '0h 0m';
                    });
                });

                setCompanyHours(hoursMap);
            }
        } catch (err) {
            console.error('Error fetching company hours:', err);
        }
    };

    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem('token_for_sa');
            if (!token) return setError('Token not found');

            const response = await axios.get('https://myuniversallanguages.com:9093/api/v1/SystemAdmin/companies', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                const allCompanies = [...response.data.suspendedCompanies, ...response.data.otherCompanies];

                const formatted = allCompanies.map((company) => ({
                    id: company._id,
                    name: company.companyName,
                    ownerEmail: company.users.find(u => u.userType === 'owner')?.email || 'No email',
                    ownerName: company.users.find(u => u.userType === 'owner')?.name || 'No Owner',
                    phoneNumber: company.users.find(u => u.userType === 'owner')?.phoneNumber || 'No phone number',
                    type: company.suspended ? 'suspended' : 'active',
                    //   createdAt: company.createdAt,
                    companyCreatedAt: company.companyCreatedAt || '-',
                    users: company.users.map(user => ({
                        id: user._id,  // <-- this is required for matching hours
                        lastActiveUser: user.lastActiveUser || 'No last active user',
                        name: user.name || 'No name',
                        email: user.email || 'No email',
                        phoneNumber: user.phoneNumber || 'No phone number',
                        phone: user.phone || 'No phone',
                        createdAt: user.createdAt || null,
                        role: user.userType || 'User'
                    }))
                }));

                setCompanies(formatted);
            } else {
                setError('Failed to fetch companies');
            }
        } catch (err) {
            setError('Error fetching companies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
        fetchCompanyHours(); // 👈 add this
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    const handleViewClick = (company) => {
        setSelectedCompany(company);
    };

    const handleBackClick = () => {
        setSelectedCompany(null);
    };

    return (
        <Box>
            <>
                {!selectedCompany ? (
                    <Grid container spacing={2}>
                        {companies.slice(0, 4).map((company, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card
                                    sx={{
                                        borderRadius: '12px',
                                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
                                        position: 'relative',
                                        padding: '16px',
                                        border: '1px solid #e0e0e0',
                                        minWidth: '200px',
                                        maxWidth: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    {/* Badge */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: company.type === 'suspended' ? '#ff9800' : '#4caf50',
                                            color: '#fff',
                                            borderRadius: '8px',
                                            padding: '4px 8px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {company.type}
                                    </Box>

                                    <CardContent sx={{ textAlign: 'center', padding: 0, marginTop: '20%' }}>

                                        <Typography variant="h6" fontWeight="bold">{company.name}</Typography>
                                        <Box
                                            sx={{
                                                backgroundColor: '#f7f9fc',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                marginTop: '20%',
                                                textAlign: 'left',
                                                color: '#555',
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ fontSize: '14px', marginBottom: '4px' }}>
                                                📧 {company.ownerEmail}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#555' }}>
                                                <PhoneOutlinedIcon fontSize="small" /> {company.phoneNumber}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                                {/* Left Section */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PersonIcon sx={{ color: '#555' }} />
                                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                                        {company.ownerName}
                                                    </Typography>
                                                </Box>
                                                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PersonIcon sx={{ color: '#555' }} />
                                                </Box> */}
                                                {/* Right Section */}
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="caption" sx={{ color: '#888' }}>
                                                        Created Date
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#555', fontWeight: 600 }}>
                                                        {company.companyCreatedAt ? new Date(company.companyCreatedAt).toISOString().split("T")[0] : 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </CardContent>

                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleViewClick(company)}
                                            sx={{
                                                backgroundColor: '#4caf50',
                                                color: '#fff',
                                                borderRadius: '20px',
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                boxShadow: 'none',
                                                width: '85%',
                                                '&:hover': { backgroundColor: '#43a047' },
                                            }}
                                        >
                                            View
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box>
                        {/* Back Button */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '24px',
                                cursor: 'pointer',
                            }}
                            onClick={handleBackClick} // Trigger the back function when clicked
                        >
                            {/* Left Arrow Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                                style={{
                                    color: '#333',
                                }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>

                            {/* Header Text */}
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{
                                    color: '#2E3A59',
                                    fontSize: '18px',
                                }}
                            >
                                Company Details
                            </Typography>
                        </Box>
                        {/* Company Info */}
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                border: '1px solid #e0e0e0',
                                borderRadius: '12px',
                                padding: 2,
                                marginBottom: 3,
                                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            {/* <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {selectedCompany.name}
                        </Typography> */}
                            {/* <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50', mt: 1 }}>
                            {selectedCompany.name} – Total Hours: {calculateCompanyTotalHours(selectedCompany.id)}
                        </Typography>
 */}
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{
                                    color: '#2E3A59',
                                    marginBottom: '4px',
                                }}>
                                {/* 📧 {selectedCompany.email} */}
                                {selectedCompany.name} – Total Hours: {calculateCompanyTotalHours(selectedCompany.id)}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#555', marginBottom: '8px' }}>
                                Total Users: {selectedCompany.users.length}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#555', marginBottom: '8px' }}>
                                Created At: {selectedCompany.companyCreatedAt ? new Date(selectedCompany.companyCreatedAt).toLocaleDateString() : 'N/A'}
                            </Typography>
                        </Box>

                        {/* Users */}
                        <Typography variant="h6" fontWeight="bold" marginBottom={2}>Total Users</Typography>
                        <Grid container spacing={2}>
                            {selectedCompany.users.map((user, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                    <Card
                                        sx={{
                                            borderRadius: '12px',
                                            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
                                            position: 'relative',
                                            padding: '16px',
                                            border: '1px solid #e0e0e0',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            height: '180px',
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold">{user.name}</Typography>
                                            <Typography variant="body2" sx={{ color: '#555' }}>📧 {user.email}</Typography>

                                            {/* <Typography variant="body2" sx={{ color: '#555' }}>📞 {user.phone}</Typography> */}
                                            <Typography variant="body2" sx={{ color: '#888' }}>
                                                Created At: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </Typography>
                                        </Box>

                                        {/* Role Badge */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '16px',
                                                right: '16px',
                                                backgroundColor: user.role === 'owner' ? '#e6f5e9' : '#f3f3f3',
                                                color: user.role === 'owner' ? '#4caf50' : '#999',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                            }}
                                        >
                                            {user.role.toUpperCase()}
                                        </Box>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '56px',
                                                right: '16px',
                                                backgroundColor: 'transparent',
                                                color: '#4CAF50',
                                                borderRadius: '16px',
                                                fontSize: '11px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {user.lastActiveUser === 'just now' ? (
                                                <span style={{ fontSize: '16px', color: '#4CAF50' }}>●</span>
                                            ) : (
                                                user.lastActiveUser
                                            )}
                                        </Box>
                                        <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 600, mt: 1 }}>
                                            Weekly Hours: {companyHours[selectedCompany.id]?.[user.id] || '0h 0m'}
                                        </Typography>

                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </>
        </Box>
    );
}

export default DCompanies;
