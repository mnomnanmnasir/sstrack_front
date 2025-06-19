import PersonIcon from '@mui/icons-material/Person';
import { Box, Button, Card, CardContent, CircularProgress, Grid, MenuItem, Select, Typography, Modal } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TopBar from '../topBar';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { useSnackbar } from 'notistack';

const apiUrl = process.env.REACT_APP_API_URL;
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
  const [companyHours, setCompanyHours] = useState({});
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [sourceCompanyId, setSourceCompanyId] = useState('');
  const [targetCompanyId, setTargetCompanyId] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const { enqueueSnackbar } = useSnackbar();

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

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token_for_sa');
      if (!token) {
        setError('Token not found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${apiUrl}/SystemAdmin/companies`, {
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
          lastActiveCompany: company.lastActiveCompany || 'No last active company',
          companyCreatedAt: company.companyCreatedAt || '-',
          companyHours: company.companyHours || '-',
          ownerEmail: company.users.find(u => u.userType === 'owner')?.email || 'No email',
          ownerName: company.users.find(u => u.userType === 'owner')?.name || 'No Owner',
          phoneNumber: company.users.find(u => u.userType === 'owner')?.phoneNumber || 'No phone number',
          city: company.users.find(u => u.userType === 'owner')?.city || 'No city',
          regionName: company.users.find(u => u.userType === 'owner')?.regionName || 'No region Name',
          country: company.users.find(u => u.userType === 'owner')?.country || 'No country',

          // phoneNumber: user.phoneNumber || 'No phone number',
          type: 'suspended', // Indicate that it's a suspended company
          users: company.users.map((user) => ({
            lastActiveUser: user.lastActiveUser || 'No last active user',
            name: user.name || 'Unknown', // Placeholder if name is missing
            email: user.email || 'No email',
            phoneNumber: user.phoneNumber || 'No phone number',
            createdAt: user.createdAt || '-',
            role: user.userType || 'User', // Add role if available
            phone: user.phone || '(123) 456-7890', // Placeholder if phone is missing
          })),
        }));
        const transformedOtherCompanies = response.data.otherCompanies.map((company) => ({
          id: company._id, // Add a unique ID for the company
          name: company.companyName,
          accessBlock: company.accessBlock,
          lastActiveCompany: company.lastActiveCompany || 'No last active company',
          companyCreatedAt: company.companyCreatedAt || '-', // ✅ Add this line
          companyHours: company.companyHours || '-',
          createdAt: company.createdAt || '-', // ✅ Add this line
          ownerEmail: company.users.find(u => u.userType === 'owner')?.email || 'No email',
          ownerName: company.users.find(u => u.userType === 'owner')?.name || 'No Owner',
          phoneNumber: company.users.find(u => u.userType === 'owner')?.phoneNumber || 'No phone number',
          city: company.users.find(u => u.userType === 'owner')?.city || 'No city',
          regionName: company.users.find(u => u.userType === 'owner')?.regionName || 'No region Name',
          country: company.users.find(u => u.userType === 'owner')?.country || 'No country',

          type: 'other', // Indicate that it's another company
          users: company.users.map((user) => ({
            id: user._id, // ✅ required to reference totalHours correctly
            lastActiveUser: user.lastActiveUser || 'No last active user',
            name: user.name || 'Unknown', // Placeholder if name is missing
            email: user.email || 'No email',
            phoneNumber: user.phoneNumber || 'No phone number',
            createdAt: user.createdAt || '-',
            role: user.userType || 'User', // Add role if available
            phone: user.phone || '(123) 456-7890', // Placeholder if phone is missing
          })),
        }));
        const transformedArchiveCompanies = response.data.archivedCompanies.map((company) => ({
          id: company._id, // Add a unique ID for the company
          name: company.companyName,
          accessBlock: company.accessBlock,
          lastActiveCompany: company.lastActiveCompany || 'No last active company',
          companyCreatedAt: company.companyCreatedAt || '-', // ✅ Add this line
          companyHours: company.companyHours || '0h 0m',  // ✅ Add this line
          phoneNumber: company.users.find(u => u.userType === 'owner')?.phoneNumber || 'No phone number',
          city: company.users.find(u => u.userType === 'owner')?.city || 'No city',
          regionName: company.users.find(u => u.userType === 'owner')?.regionName || 'No region Name',
          country: company.users.find(u => u.userType === 'owner')?.country || 'No country',

          email: company.users[0]?.email || 'No email',
          type: 'archive', // Indicate that it's another company
          users: company.users.map((user) => ({
            lastActiveUser: user.lastActiveUser || 'No last active user',
            name: user.name || 'Unknown', // Placeholder if name is missing
            email: user.email || 'No email',
            phoneNumber: user.phoneNumber || 'No phone number',
            role: user.userType || 'User', // Add role if available
            phone: user.phone || '(123) 456-7890', // Placeholder if phone is missing
          })),
        }));
        // Combine both arrays if needed
        // const transformedCompanies = [...transformedSuspendedCompanies, ...transformedOtherCompanies,...transformedArchiveCompanies];
        const transformedCompanies = [...transformedSuspendedCompanies, ...transformedOtherCompanies, ...transformedArchiveCompanies];
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
        `${apiUrl}/SystemAdmin/updateCompany/${selectedCompanyId}`,
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
        `${apiUrl}/SystemAdmin/updateCompany/${selectedCompanyId}`,
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

  const handleSuspend = async (selectedCompanyId) => {
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
      const updatedSuspended = selectedCompany?.type === "suspended" ? false : true;

      // console.log('unupdated',updatedSuspended, '............',selectedCompany.type)
      const response = await axios.post(
        `${apiUrl}/SystemAdmin/updateCompany/${selectedCompanyId}`,
        {
          isArchived: false,
          suspended: updatedSuspended,
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

  const fetchCompanyHours = async () => {
    try {
      const token = localStorage.getItem('token_for_sa');
      if (!token) return;

      const response = await axios.get('${apiUrl}/SystemAdmin/companiesHours', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const hoursData = response.data.otherCompanies;

        // Create a map: companyId -> userId -> totalHours
        const hoursMap = {};

        hoursData.forEach((company) => {
          if (!company._id || !Array.isArray(company.users)) return;

          if (!hoursMap[company._id]) hoursMap[company._id] = {};

          company.users.forEach((user) => {
            hoursMap[company._id][user._id] = user.totalHours || '0h 0m';
          });
        });

        console.log("✅ Final Hours Map:", hoursMap);
        setCompanyHours(hoursMap); // Set it in state
      }
    } catch (err) {
      console.error('❌ Error fetching company hours:', err);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchCompanyHours();
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
                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total Companies
                  </Typography>
                  <Button startIcon={<ListAltIcon />} variant="text" sx={{ color: '#333' }}>
                    List View
                  </Button>
                </Box> */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total Companies
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setMergeModalOpen(true)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 'bold',
                      borderRadius: '20px',
                      padding: '6px 16px',
                      fontSize: '14px',
                    }}
                  >
                    Merge Companies
                  </Button>
                </Box>

                <Modal
                  open={mergeModalOpen}
                  onClose={() => setMergeModalOpen(false)}
                  aria-labelledby="merge-modal-title"
                  aria-describedby="merge-modal-description"
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 400,
                      bgcolor: 'background.paper',
                      boxShadow: 24,
                      p: 4,
                      borderRadius: 2,
                    }}
                  >
                    <Typography id="merge-modal-title" variant="h6" mb={2}>
                      Merge Companies
                    </Typography>

                    <Select
                      fullWidth
                      displayEmpty
                      value={sourceCompanyId}
                      onChange={(e) => setSourceCompanyId(e.target.value)}
                      sx={{ mb: 2 }}
                    >
                      <MenuItem disabled value="">Select Source Company</MenuItem>
                      {companies.map((company) => (
                        <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
                      ))}
                    </Select>

                    <Select
                      fullWidth
                      displayEmpty
                      value={targetCompanyId}
                      onChange={(e) => {
                        setTargetCompanyId(e.target.value);
                        const selectedCompany = companies.find(c => c.id === e.target.value);
                        setSelectedName(selectedCompany?.name || '');
                      }}
                      sx={{ mb: 2 }}
                    >
                      <MenuItem disabled value="">Select Target Company</MenuItem>
                      {companies.map((company) => (
                        <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
                      ))}
                    </Select>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button onClick={() => setMergeModalOpen(false)}>Cancel</Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                          const token = localStorage.getItem('token_for_sa');
                          if (!sourceCompanyId || !targetCompanyId || !selectedName) {
                            alert("Please fill all fields.");
                            return;
                          }

                          try {
                            const res = await axios.patch(
                              '${apiUrl}/SystemAdmin/mergeCompanies',
                              {
                                sourceCompanyId,
                                targetCompanyId,
                                selectedName
                              },
                              {
                                headers: { Authorization: `Bearer ${token}` }
                              }
                            );

                            if (res.status === 200) {
                              enqueueSnackbar(res.data.message, {
                                variant: "success",
                                anchorOrigin: { vertical: "top", horizontal: "right" }
                              });

                              // alert("Companies merged successfully!");
                              setMergeModalOpen(false);
                              setSourceCompanyId('');
                              setTargetCompanyId('');
                              setSelectedName('');
                              fetchCompanies(); // Refresh data
                            }
                          } catch (err) {
                            console.error(err);
                            alert("Merge failed.");
                          }
                        }}
                      >
                        Merge
                      </Button>
                    </Box>
                  </Box>
                </Modal>

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
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          backgroundColor: 'transparent',
                          color: '#4CAF50',
                          borderRadius: '16px',
                          fontSize: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        {company.lastActiveCompany === 'just now' ? (
                          <span style={{ fontSize: '16px', color: '#4CAF50' }}>●</span>
                        ) : (
                          company.lastActiveCompany
                        )}

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
                            📧 {company.ownerEmail}
                          </Typography>

                          <Typography variant="body" sx={{ fontSize: '14px', marginBottom: '4px' }}>
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
                  justifyContent: 'space-between',  // Align left and right sides
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                {/* Left Side: Back Button and Title */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={handleBackClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ color: '#333' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>

                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#2E3A59', fontSize: '18px' }}>
                    Company Details
                  </Typography>
                </Box>

                {/* Right Side: 3 Buttons */}
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
                      '&:hover': { backgroundColor: '#FFCCCC' },
                    }}
                    onClick={() => handleDelete(selectedCompany.id)}
                  >
                    Archive
                  </Button>

                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#E9F8EA',
                      color: '#4CAF50',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      padding: '8px 16px',
                      '&:hover': { backgroundColor: '#DFF6E4' },
                    }}
                    onClick={() => handleBlock(selectedCompany.id)}
                  >
                    {selectedCompany.accessBlock ? `Unblock Access` : `Block Access`}
                  </Button>

                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#F0F4FF',
                      color: '#1E3A8A',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      padding: '8px 16px',
                      '&:hover': { backgroundColor: '#DFF6E4' },
                    }}
                    onClick={() => handleSuspend(selectedCompany.id)}
                  >
                    {selectedCompany?.type === "suspended" ? `Unsuspended` : `Suspended`}
                  </Button>
                </Box>
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
                    {selectedCompany.name} – Total Hours: {calculateCompanyTotalHours(selectedCompany.id)}
                  </Typography>

                  <Typography variant="body1" sx={{ color: '#555', marginBottom: '8px' }}>
                    Email: {selectedCompany.ownerEmail}
                  </Typography>

                  <Typography variant="body1" sx={{ color: '#555', marginBottom: '8px' }}>
                    Phone Number: {selectedCompany.phoneNumber}
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
                  </Typography>

                  <Typography variant="body1" sx={{ color: '#555', marginBottom: '8px' }}>
                    {/* Total Users: {selectedCompany.users.length} */}
                    Created At: {selectedCompany.companyCreatedAt ? new Date(selectedCompany.companyCreatedAt).toLocaleDateString() : 'N/A'}
                  </Typography>

                  {/* <Typography variant="body1" sx={{ color: '#555', marginBottom: '8px' }}>
                    City: {selectedCompany.city}
                  </Typography>

                  <Typography variant="body1" sx={{ color: '#555', marginBottom: '8px' }}>
                    Country: {selectedCompany.country}
                  </Typography> */}

                </Box>

                {/* Right Section with Buttons */}
                <Box sx={{ textAlign: 'right', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', gap: '8px' }}>

                  {/* <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                    City: {selectedCompany.city}
                  </Typography> */}
                  {/* City Row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Typography variant="body1" sx={{ color: '#555', fontWeight: 'bold' }}>
                      City:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                      {selectedCompany.city}
                    </Typography>
                  </Box>

                  {/* Region Name Row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Typography variant="body1" sx={{ color: '#555', fontWeight: 'bold' }}>
                      Region Name:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                      {selectedCompany.regionName}
                    </Typography>
                  </Box>

                  {/* Country Name Row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Typography variant="body1" sx={{ color: '#555', fontWeight: 'bold' }}>
                      Country:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                      {selectedCompany.country}
                    </Typography>
                  </Box>
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
                        {user.role === 'owner' && user.phoneNumber && (
                          <Typography variant="body2" sx={{ color: '#555' }}><PhoneOutlinedIcon fontSize="small" /> {user.phoneNumber}</Typography>
                        )}

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
