import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

function DCompanies() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [companies, setCompanies] = useState([]);

    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem('token_for_sa');
            if (!token) {
                setError('Token not found');
                setLoading(false);
                return;
            }

            const response = await axios.get('https://ss-track-xi.vercel.app/api/v1/SystemAdmin/companies', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                const transformedCompanies = [
                    ...response.data.suspendedCompanies.map((company) => ({
                        id: company._id,
                        name: company.companyName,
                        email: company.users[0]?.email || 'No email',
                        phone: company.users[0]?.name || 'No phone',
                        type: 'suspended',
                        createdAt: new Date(company.createdAt), // Convert to Date object for sorting
                    })),
                    ...response.data.otherCompanies.map((company) => ({
                        id: company._id,
                        name: company.companyName,
                        email: company.users[0]?.email || 'No email',
                        phone: company.users[0]?.name || 'No phone',
                        type: 'active',
                        createdAt: new Date(company.createdAt), // Convert to Date object for sorting
                    })),
                ];

                // Sort companies by createdAt (most recent first)
                const sortedCompanies = transformedCompanies.sort(
                    (a, b) => b.createdAt - a.createdAt
                );

                // Format createdAt for display
                const formattedCompanies = sortedCompanies.map((company) => ({
                    ...company,
                    formattedCreatedAt: company.createdAt.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }), // Example: Jul 22, 2024, 11:56:25 AM
                }));

                setCompanies(formattedCompanies);
            } else {
                setError('Failed to fetch data');
            }
        } catch (err) {
            setError('Error fetching companies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);


    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box>
            <Grid container spacing={2}>
                {companies.slice(0, 4).map((company, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card
                            sx={{
                                borderRadius: '12px',
                                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
                                padding: '16px',
                                border: '1px solid #e0e0e0',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '200px',
                                position: 'relative', // Positioning for tag placement
                            }}
                        >
                            {/* Type Tag */}
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
                                    textTransform: 'uppercase',
                                }}
                            >
                                {company.type}
                            </Box>

                            {/* Card Content */}
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px' }}>
                                    {company.name}
                                </Typography>
                                <Box
                                    sx={{
                                        backgroundColor: '#f7f9fc',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        marginTop: '20px',
                                        textAlign: 'left',
                                        color: '#555',
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontSize: '14px', marginBottom: '4px' }}>
                                        📧 {company.email}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon sx={{ marginRight: 1 }} />
                                        {company.phone}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>

    );
}

export default DCompanies;
