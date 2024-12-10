import PersonIcon from '@mui/icons-material/Person';
import { Box, Button, Card, CardContent, CircularProgress, Grid, MenuItem, Select, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TopBar from '../topBar';

function TotalCompanies() {
  const [companies, setCompanies] = useState([]); // State for companies data
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('other');
  const [loading, setLoading] = useState(true);
  const [DLTloading, setDLTLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // State to track selected company
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token_for_sa');
      if (!token) {
        setError('Token not found');
        setLoading(false);
        return;
      }

      const response = await axios.get('https://myuniversallanguages.com:9093/api/v1/SystemAdmin/companies', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Transform the API data to include users within each company
        const transformedSuspendedCompanies = response.data.suspendedCompanies.map((company) => ({
          id: company._id, // Add a unique ID for the company
          accessBlock: company.accessBlock,
          name: company.companyName,
          phone: company.users[0]?.name || 'no user name found⚠️', // Company phone with default value
          email: company.users[0]?.email || 'No email',
          type: 'suspended', // Indicate that it's a suspended company
          users: company.users.map((user) => ({
            name: user.name || 'Unknown', // Placeholder if name is missing
            email: user.email || 'No email',
            role: user.userType || 'User', // Add role if available
            phone: user.phone || '(123) 456-7890', // Placeholder if phone is missing
          })),
        }));
        const transformedOtherCompanies = response.data.otherCompanies.map((company) => ({
          id: company._id, // Add a unique ID for the company
          name: company.companyName,
          accessBlock: company.accessBlock,
          phone: company.users[0]?.name || 'no user name found⚠️', // Company phone with default value
          email: company.users[0]?.email || 'No email',
          type: 'other', // Indicate that it's another company
          users: company.users.map((user) => ({
            name: user.name || 'Unknown', // Placeholder if name is missing
            email: user.email || 'No email',
            role: user.userType || 'User', // Add role if available
            phone: user.phone || '(123) 456-7890', // Placeholder if phone is missing
          })),
        }));
        // Combine both arrays if needed
        const transformedCompanies = [...transformedSuspendedCompanies, ...transformedOtherCompanies];
        setCompanies(transformedCompanies);
        setFilteredCompanies(transformedOtherCompanies)
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError('Error fetching companies');
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (selectedCompanyId) => {
    if (!selectedCompanyId) {
      alert('No company selected.');
      return;
    }

    const token = localStorage.getItem('token_for_sa');
    if (!token) {
      setError('Token not found');
      setLoading(false);
      return;
    }

    setDLTLoading(true);

    try {
      const response = await axios.post(
        `https://myuniversallanguages.com:9093/api/v1/SystemAdmin/updateCompany/${selectedCompanyId}`,
        {
          isArchived: true,
          suspended: false,
          accessBlock: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Show confirmation using window.confirm
        const isConfirmed = window.confirm('Company updated successfully! Click OK to refresh the list.');
        if (isConfirmed) {
          setSelectedCompany(null);
          console.log(selectedCompany) // Reset the selected company
          fetchCompanies(); // Refresh the company list
        }
      } else {
        alert('Failed to update the company.');
      }
    } catch (error) {
      console.error('Error updating the company:', error);
      alert('An error occurred while updating the company.');
    } finally {
      setDLTLoading(false);
    }
  };

  const handleBlock = async (selectedCompanyId) => {
    if (!selectedCompanyId) {
      alert('No company selected.');
      return;
    }

    const token = localStorage.getItem('token_for_sa');
    if (!token) {
      setError('Token not found');
      setLoading(false);
      return;
    }

    setDLTLoading(true);

    try {
      // Toggle the accessBlock value
      const updatedAccessBlock = !selectedCompany?.accessBlock;
      const response = await axios.post(
        `https://myuniversallanguages.com:9093/api/v1/SystemAdmin/updateCompany/${selectedCompanyId}`,
        {
          isArchived: false,
          suspended: false,
          accessBlock: updatedAccessBlock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Show confirmation using window.confirm
        const isConfirmed = window.confirm('Company updated successfully! Click OK to refresh the list.');
        if (isConfirmed) {
          setSelectedCompany(null);
          setSelectedFilter('other') // Reset the selected company
          fetchCompanies(); // Refresh the company list
        }
      } else {
        alert('Failed to update the company.');
      }
    } catch (error) {
      console.error('Error updating the company:', error);
      alert('An error occurred while updating the company.');
    } finally {
      setDLTLoading(false);
    }
  };


  const handleFilterChange = (event) => {
    const filter = event.target.value;
    setSelectedFilter(filter);

    // Filter companies based on the selected filter
    if (filter === 'all') {
      setFilteredCompanies(companies); // Show all companies
    } else {
      const filtered = companies.filter((company) => company.type === filter);
      setFilteredCompanies(filtered); // Update filteredCompanies
    }

    // Reset to the first page when the filter changes
    setCurrentPage(1);
  };



  useEffect(() => {
    fetchCompanies();
  }, []);


  // Function to handle "View" button click
  const handleViewClick = (company) => {

    setSelectedCompany(company); // Set the entire company object, including its users
  };


  // Function to go back to the company list
  const handleBackClick = () => {
    setSelectedCompany(null); // Reset the selected company
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  return (
    <Box sx={{ padding: 3, fontFamily: 'Arial, sans-serif', alignSelf: 'start', width: '98%' }}>
      <TopBar />

      {loading ? (
        <Typography align="center">Loading...</Typography>
      ) : error ? (
        <Typography align="center" color="error">
          Error: {error}
        </Typography>
      ) : (
        <>
          {!selectedCompany && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total Companies 
                  </Typography>
                  {/* <Button startIcon={<ListAltIcon />} variant="text" sx={{ color: '#333' }}>
                    List View
                  </Button> */}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Select
                    value={selectedFilter}
                    onChange={handleFilterChange}
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      maxHeight: '35px',
                      padding: '4px 12px',
                      fontSize: '14px',
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                    <MenuItem value="other">Active</MenuItem>
                  </Select>


                </Box>
              </Box>

              <Grid container spacing={2}>
                {filteredCompanies.map((company, index) => (
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
                      {/* Indicator Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          backgroundColor: company.type === 'suspended' ? '#ff9800' : '#2196f3',
                          color: '#fff',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        {company.type === 'suspended' ? 'Suspended' : 'active'}
                      </Box>
                      <CardContent sx={{ textAlign: 'center', padding: 0, marginTop: '20%' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px' }}>
                          {company.name}
                        </Typography>

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
                            📧 {company.email}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ marginRight: 1 }} />
                            {company.phone}
                          </Typography>
                        </Box>
                      </CardContent>

                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2  }}>
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

              {/* {filteredCompanies.length > 0 && (
                <Pagination
                  count={Math.ceil(companies.length / itemsPerPage)}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  variant="outlined"
                  shape="rounded"
                  sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}
                />
              )} */}
            </>
          )}

          {selectedCompany && (
            // Selected company details rendering
            <Box>
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

              {/* Company Details Header */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e0e0e0',
                  minHeight: '120px',
                }}
              >
                {/* Left Section with Company Info */}
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      color: '#2E3A59',
                      marginBottom: '4px',
                    }}
                  >
                    {selectedCompany.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#555', marginBottom: '8px' }}>
                    Total Users: {selectedCompany.users.length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#888',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {/* Location and Time Info */}
                    {/* <Box
                    component="span"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      style={{ width: '16px', height: '16px', color: '#999' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 2c4.418 0 8 3.582 8 8 0 4.418-3.582 8-8 8s-8-3.582-8-8c0-4.418 3.582-8 8-8zm0 0v4m-2 2h4"
                      />
                    </svg>
                    Ontario, Canada
                  </Box> */}
                    {/* <Box
                    component="span"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      style={{ width: '16px', height: '16px', color: '#999' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8c1.657 0 3 1.343 3 3v6h1a2 2 0 110 4H8a2 2 0 110-4h1v-6c0-1.657 1.343-3 3-3z"
                      />
                    </svg>
                    (GMT-8:00) Pacific Time
                  </Box> */}
                  </Typography>
                </Box>

                {/* Right Section with Buttons */}
                <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#FFEEEE',
                      color: '#FF5A5A',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      padding: '8px 16px',
                      '&:hover': {
                        backgroundColor: '#FFCCCC',
                      },
                    }}
                    onClick={() => handleDelete(selectedCompany.id)}
                  >
                    Archive
                  </Button>
                  {/* block Company */}
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#E9F8EA',
                      color: '#4CAF50',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      padding: '8px 16px',
                      '&:hover': {
                        backgroundColor: '#DFF6E4',
                      },
                    }}
                    onClick={() => handleBlock(selectedCompany.id)}
                  >
                    {selectedCompany.accessBlock ? `Unblock Access` : `Block Access`}
                  </Button>

                </Box>
              </Box>


              {/* Total Users Section */}
              <Typography variant="h6" fontWeight="bold" marginBottom={2}>
                Total Users
              </Typography>
              <Grid container spacing={2}>
                {selectedCompany.users.map((user, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
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
                      {/* User Details */}
                      <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#555', marginBottom: '4px' }}>
                          📧 {user.email}
                        </Typography>
                        {/* <Typography variant="body2" sx={{ color: '#555' }}>
                          📞 {user.phone}
                        </Typography> */}
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
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Back to Companies Button */}
              {/* <Box sx={{ marginTop: '24px', textAlign: 'right' }}>
              <Button
                variant="contained"
                onClick={handleBackClick}
                sx={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#0056b3' },
                }}
              >
                Back to Companies
              </Button>
            </Box> */}
            </Box>
          )}
        </>
      )}
    </Box>
  );


}

export default TotalCompanies;
