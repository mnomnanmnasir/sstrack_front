import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Avatar, CircularProgress, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TopBar from '../topBar'
import axios from 'axios';
import Dcompanies from './d_companies';

function Dashboard({ onNavigate }) {
  // const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCompaniesUsers, setTotalCompaniesUsers] = useState(null);
  const [newCompaniesUsers, setNewCompaniesUsers] = useState(null);




  const fetchTotalCompaniesUsers = async () => {
    const token = localStorage.getItem('token_for_sa');
    if (!token) {
      setError('Authentication token not found');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://myuniversallanguages.com:9093/api/v1/SystemAdmin/getTotalCompaniesUsers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setTotalCompaniesUsers(response.data.data); // Adjust state name based on your use case
        setLoading(false);
      } else {
        setError(response.data.message || 'Failed to fetch total companies and users');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };
  const fetchNewCompaniesUsers = async () => {
    const token = localStorage.getItem('token_for_sa');
    if (!token) {
      setError('Authentication token not found');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://myuniversallanguages.com:9093/api/v1/SystemAdmin/getnewCompaniesUsers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setNewCompaniesUsers(response.data.data); // Adjust state name based on your use case
        setLoading(false);
      } else {
        setError(response.data.message || 'Failed to fetch new companies and users');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };


  // const fetchInvoices = async () => {
  //   const token = localStorage.getItem('token_for_sa');
  //   if (!token) {
  //     setError('Authentication token not found');
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await axios.get('https://myuniversallanguages.com:9093/api/v1/SystemAdmin/getAllInvoices', {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (response.data.success) {
  //       setInvoices(response.data.data);
  //       setLoading(false);
  //     } else {
  //       setError(response.data.message || 'Failed to fetch invoices');
  //       setLoading(false);
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Something went wrong');
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchTotalCompaniesUsers();
    fetchNewCompaniesUsers();
    // fetchInvoices();
  }, []);
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success.main';
      case 'pending':
        return 'warning.main';
      case 'expired':
      case 'failed':
        return 'error.main';
      default:
        return 'warning.main';
    }
  };


  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);
  return (
    <Box sx={{ padding: 3, backgroundColor: '#fff', Height: '70vh', width: '80vw', alignSelf: 'start' }}>
      {/* TopBar */}
      <TopBar />

      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={4}>
        {[
          {
            label: 'Total Companies',
            value: `${totalCompaniesUsers?.totalCompanies || 0}`,
            icon: <TrendingUpIcon color="success" />,
            trend: '+1.01%',
            change: '10.2',
            onClick: () => {
              // Add the action to be performed when clicking "Total Companies"
              console.log('Navigating to Total Companies');
              onNavigate('Total Companies'); // Call the navigation function
            },
          },
          {
            label: 'Total Users',
            value: `${totalCompaniesUsers?.totalUsers || 0}`,
            icon: <TrendingUpIcon color="success" />,
            trend: '+1.01%',
            change: '10.2',
          },
          {
            label: 'New Users',
            value: `${newCompaniesUsers?.newUsers || 0}`,
            icon: <TrendingUpIcon color="success" />,
            trend: '+1.01%',
            change: '10.2',
          },
          {
            label: 'New Companies',
            value: `${newCompaniesUsers?.newCompanies || 0}`,
            icon: <TrendingUpIcon color="success" />,
            trend: '+1.01%',
            change: '10.2',
          },
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: 1,
                cursor: card.onClick ? 'pointer' : 'default', // Show pointer cursor if onClick is present
              }}
              onClick={card.onClick} // Attach onClick only if it exists
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5">{card.value}</Typography>
                  <Typography color="textSecondary">{card.label}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#e0f7fa' }}>{card.icon}</Avatar>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Companies
        </Typography>
        <Button
          variant="text"
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
          }}
          onClick={() => onNavigate('Total Companies')} // Replace with your logic
        >
          Show More
        </Button>
      </Box>

      {/* Summary Cards */}
      <Dcompanies />

      {/* Invoices Overview Table */}
      {/* <Box sx={{ backgroundColor: '#fff', borderRadius: 2, padding: 2 }}>
        <Typography variant="h6" mb={2}>
          Invoices Overview
        </Typography>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice</TableCell>
                <TableCell>Owner Name</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.ownerName}</TableCell>
                  <TableCell>{invoice.company}</TableCell>
                  <TableCell>{invoice.planId}</TableCell>
                  <TableCell>${invoice.balance.toFixed(2)} USD</TableCell>
                  <TableCell>
                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Typography color={getStatusColor(invoice.status)}>
                      {capitalizeFirstLetter(invoice.status)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

     
       
      </Box> */}
    </Box>
  );
}

export default Dashboard;
