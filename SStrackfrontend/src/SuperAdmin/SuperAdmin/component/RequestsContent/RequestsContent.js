import React, { useEffect, useState } from 'react';
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { Box, Typography, Button, Paper, TextField, Grid, MenuItem, Select, CircularProgress, Tabs, Tab } from '@mui/material';
import TopBar from '../topBar';
import axios from 'axios';
import { set } from 'lodash';



function RequestsContent() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  // const [pendingRequests, setpendingRequests] = useState(0);
  // const [approvedRequests, setapprovedRequests] = useState(0);
  // const [cancelRequests, setcancelRequests] = useState(0);
  const [pendingRequests, setpendingRequests] = useState([]);
  const [approvedRequests, setapprovedRequests] = useState([]);
  const [cancelRequests, setcancelRequests] = useState([]);

  const [requests, setRequests] = useState([]); // State to store API data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null);





  // Editable fields state
  const [editableFields, setEditableFields] = useState({
    userCount: '',
    contactNumber: '',
    screenshotsTime: '',
    discount: '',
  });

  const fetchRequests = async () => {
    setLoading(true);
    const token = localStorage.getItem('token_for_sa'); // Get token from local storage
    if (!token) {
      setError('Token not found');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        'https://myuniversallanguages.com:9093/api/v1/SystemAdmin/getEnterpriseRequests',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {

        const pendingRequests = response.data.pending.map((request) => {
          const company = request.companyId || {}; // Prevents undefined error
          const owner = company?.ownerId || {}; // Prevents undefined error on ownerId

          return {
            id: request._id,
            type: 'Pending',
            name: company?.companyName || 'Unknown Company', // Avoids undefined error
            plan: request.paymentPlan || 'N/A',
            time: request.createdAt ? new Date(request.createdAt).toLocaleTimeString() : 'N/A',
            details: {
              email: owner?.email || 'Not Provided', // Prevents error if ownerId is missing
              userCount: request.userCounts || 'N/A',
              paymentPlan: request.paymentPlan || 'N/A',
              contactNumber: request.contactNumber || 'N/A',
              screenshotsTime: request.ssStoredFor || 'N/A',
              discount: `${request.Discount || '0'}% Discount`,
              totalAmount: `$${request.totalAmount || '0'}`,
              billingDate: company?.billingDate
                ? new Date(company.billingDate).toLocaleDateString()
                : 'N/A',
              cardInfo: company.cardInfo?.find((card) => card.defaultCard) || {}, // Avoids error if empty
            },
          };
        });

        const approvedRequests = Array.isArray(response.data.approved)
          ? response.data.approved.map((request, index) => {
            console.log(`Processing Approved Request ${index + 1}:`, request);

            const company = request.companyId || {}; // Handle missing company data
            const owner = company?.ownerId || {}; // Avoid undefined errors

            return {
              id: request._id,
              type: 'Approved',
              name: company?.companyName || 'Unknown Company',
              plan: request.paymentPlan || 'N/A',
              time: request.createdAt ? new Date(request.createdAt).toLocaleTimeString() : 'N/A',
              details: {
                email: owner?.email || 'Not Provided',
                userCount: request.userCounts || 'N/A',
                paymentPlan: request.paymentPlan || 'N/A',
                contactNumber: request.contactNumber || 'N/A',
                screenshotsTime: request.ssStoredFor || 'N/A',
                discount: `${request.Discount || '0'}% Discount`,
                totalAmount: `$${request.totalAmount || '0'}`,
                billingDate: company?.billingDate
                  ? new Date(company.billingDate).toLocaleDateString()
                  : 'N/A',
                cardInfo: company.cardInfo?.find((card) => card.defaultCard) || {},
              },
            };
          })
          : [];

        console.log('Final Processed Approved Requests:', approvedRequests);

        const cancelRequests = Array.isArray(response.data.cancel)
          ? response.data.cancel.map((request, index) => {
            console.log(`Processing Cancelled Request ${index + 1}:`, request);

            const company = request.companyId || {}; // Handle missing company data
            const owner = company?.ownerId || {}; // Avoid undefined errors

            return {
              id: request._id,
              type: 'Cancelled',
              name: company?.companyName || 'Unknown Company',
              plan: request.paymentPlan || 'N/A',
              time: request.createdAt ? new Date(request.createdAt).toLocaleTimeString() : 'N/A',
              details: {
                email: owner?.email || 'Not Provided',
                userCount: request.userCounts || 'N/A',
                paymentPlan: request.paymentPlan || 'N/A',
                contactNumber: request.contactNumber || 'N/A',
                screenshotsTime: request.ssStoredFor || 'N/A',
                discount: `${request.Discount || '0'}% Discount`,
                totalAmount: `$${request.totalAmount || '0'}`,
                billingDate: company?.billingDate
                  ? new Date(company.billingDate).toLocaleDateString()
                  : 'N/A',
                cardInfo: company.cardInfo?.find((card) => card.defaultCard) || {},
              },
            };
          })
          : [];

        console.log('Final Processed Cancelled Requests:', cancelRequests);


        setLoading(false);
        setRequests(pendingRequests);
        setpendingRequests([...pendingRequests]);
        setapprovedRequests([...approvedRequests]);
        setcancelRequests([...cancelRequests]);
        // setpendingRequests(pendingRequests);
        // setapprovedRequests(approvedRequests);
        // setcancelRequests(cancelRequests); // Update the state with transformed data
      } else {
        setLoading(false);
        setError(response.data.message || 'Failed to fetch enterprise requests');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequests();
    console.log('selected Request', selectedRequest)
  }, [])
  console.log('Pending Requests:', pendingRequests);
  // const handleTabChange = (event, newValue) => {
  //   setSelectedTab(newValue);
  //   if (newValue === 0) setRequests(pendingRequests);
  //   else if (newValue === 1) setRequests(approvedRequests);
  //   else if (newValue === 2) setRequests(cancelRequests);
  // };
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) setRequests([...pendingRequests]);
    else if (newValue === 1) setRequests([...approvedRequests]);
    else if (newValue === 2) setRequests([...cancelRequests]);
  }

  const handleViewClick = (request) => {
    setSelectedRequest(request);
    setEditableFields({
      userCount: request.details?.userCount || '',
      contactNumber: request.details?.contactNumber || '',
      screenshotsTime: request.details?.screenshotsTime || '',
      discount: request.details?.discount || '',
    });
  };


  const handleFieldChange = (field, value) => {
    setEditableFields((prev) => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('requestId', selectedRequest.id);
    formData.append('companyName', selectedRequest.name);
    formData.append('userCounts', editableFields.userCount);
    formData.append('contactNumber', editableFields.contactNumber);
    formData.append('ssStoredFor', editableFields.screenshotsTime);
    formData.append('Discount', editableFields.discount);
    console.log('formdata===>', formData)
    try {
      const token = localStorage.getItem('token_for_sa');
      const response = await axios.post('https://myuniversallanguages.com:9093/api/v1/SystemAdmin/updateEnterpriseRequest', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        enqueueSnackbar('Enterprise requests fetched successfully', { variant: 'success' }); // Success notification
      } else {
        enqueueSnackbar(response.status || 'Failed to fetch enterprise requests', { variant: 'error' }); // Error notification
      }
    } catch (err) {
      enqueueSnackbar(err || 'Error details', { variant: 'error' }); // Error notification
      // Check if the error response is available for better insight
      if (err.response) {
        console.error('Response error:', err.response.data);
        enqueueSnackbar(err.response.data.message || 'Error updating request:', { variant: 'error' });
      } else if (err.request) {
        console.error('Request error:', err.request);

        enqueueSnackbar('Error making the request. Please check your network connection:', { variant: 'error' });
      } else {
        console.error('Unexpected error:', err.message);
        enqueueSnackbar('Unexpected error occurred while updating the request.', { variant: 'error' });
      }
    }
  };
  const handleApprove = async () => {
    const formData = new FormData();
    formData.append('approved', "approved");
    formData.append('requestId', selectedRequest.id);
    formData.append('companyName', selectedRequest.name);
    formData.append('userCounts', editableFields.userCount);
    formData.append('contactNumber', editableFields.contactNumber);
    formData.append('ssStoredFor', editableFields.screenshotsTime);
    formData.append('Discount', editableFields.discount);
    console.log('formdata===>', formData)
    try {
      const token = localStorage.getItem('token_for_sa');
      const response = await axios.post('https://myuniversallanguages.com:9093/api/v1/SystemAdmin/updateEnterpriseRequest', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        enqueueSnackbar('Enterprise requests fetched successfully', { variant: 'success' });
        setRequests([])
        fetchRequests();
        setTimeout(() => {
          handleBackClick();
        }, 2000);


      } else {
        enqueueSnackbar(response.status || 'Failed to fetch enterprise requests', { variant: 'error' });
      }
    } catch (err) {
      console.error('Error details:', err);
      // Check if the error response is available for better insight
      if (err.response) {
        console.error('Response error:', err.response.data);

        enqueueSnackbar(err.response.data.message || 'Error updating request:', { variant: 'error' });
      } else if (err.request) {
        console.error('Request error:', err.request);
        enqueueSnackbar('Error making the request. Please check your network connection:', { variant: 'error' });
      } else {
        console.error('Unexpected error:', err.message);
        enqueueSnackbar('Unexpected error occurred while updating the request.', { variant: 'error' });
      }
    }
  };
  const handleCancel = async () => {
    const formData = new FormData();
    formData.append('approved', "canceled");
    formData.append('requestId', selectedRequest.id);
    formData.append('companyName', selectedRequest.name);
    formData.append('userCounts', editableFields.userCount);
    formData.append('contactNumber', editableFields.contactNumber);
    formData.append('ssStoredFor', editableFields.screenshotsTime);
    formData.append('Discount', editableFields.discount);
    console.log('formdata===>', formData)
    try {
      const token = localStorage.getItem('token_for_sa');
      const response = await axios.post('https://myuniversallanguages.com:9093/api/v1/SystemAdmin/updateEnterpriseRequest', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        enqueueSnackbar('Enterprise requests fetched successfully', { variant: 'success' });
        setRequests([])
        fetchRequests();
        setTimeout(() => {
          handleBackClick();
        }, 2000);
      } else {
        enqueueSnackbar(response.status || 'Failed to fetch enterprise requests', { variant: 'error' });
      }
    } catch (err) {
      console.error('Error details:', err);
      // Check if the error response is available for better insight
      if (err.response) {
        console.error('Response error:', err.response.data);
        enqueueSnackbar(`Error updating request: ${err.response.data.message || 'Unknown error'}`, { variant: 'error' }); // Error from response
      } else if (err.request) {
        console.error('Request error:', err.request);
        enqueueSnackbar('Error making the request. Please check your network connection.', { variant: 'warning' }); // Request error
      } else {
        console.error('Unexpected error:', err.message);
        enqueueSnackbar('Unexpected error occurred while updating the request.', { variant: 'error' }); // Unexpected error
      }
    }
  };


  const handleBackClick = () => {
    setSelectedRequest(null);
    // Clear the selected request to go back to the list view
  };
  if (loading) return <CircularProgress />;
  return (
    <>
      <SnackbarProvider />
      <Box sx={{ padding: 3, fontFamily: 'Arial, sans-serif', alignSelf: 'start', flex: 1 }}>
        {/* TopBar */}
        <TopBar />

        {/* Conditionally render the list or the details view */}

        {selectedRequest ? (
          <>
            <Box sx={{ maxWidth: '90%', marginX: 'auto' }}>
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
                    fontSize: '24px',
                  }}
                >
                  {selectedRequest.name}
                </Typography>
              </Box>
              {console.log('selectedRequest', selectedRequest)}
              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 4 }}>
                <Button
                  onClick={handleCancel}
                  sx={{
                    color: '#fff',
                    backgroundColor: '#4caf50',
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: '#e8f5e9' },
                  }}
                >
                  Cancel request
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: '#43a047' },
                  }}
                >
                  Save changes
                </Button>
                <Button
                  onClick={handleApprove}
                  variant="contained"
                  sx={{
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: '#43a047' },
                  }}
                  disabled={selectedRequest.type === 'Approved'} // Disable button if type is "approved"
                >
                  Approve Request
                </Button>

              </Box>
              <Paper
                sx={{
                  padding: '32px',
                  borderRadius: '12px',
                  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  marginBottom: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                  Company Information
                </Typography>

                <Grid container spacing={3}>
                  {[
                    { label: 'COMPANY NAME', value: selectedRequest?.name || 'Not Provided', subLabel: 'Name' },
                    { label: 'EMAIL ADDRESS', value: selectedRequest?.details?.email || 'Not Provided', subLabel: 'Email' },
                    {
                      label: 'USER COUNT',
                      value: editableFields.userCount, // Use the state for editable fields
                      subLabel: 'Users',
                      isDropdown: true,
                      options: ['50-100', '100-200', '200-300'],
                    },
                    { label: 'PAYMENT PLAN', value: selectedRequest?.details?.paymentPlan || 'Not Provided', subLabel: 'Payment' },
                    {
                      label: 'CONTACT NUMBER',
                      value: editableFields.contactNumber, // Use the state for editable fields
                      subLabel: 'Phone number for inquiries',
                      editable: true,
                    },
                    {
                      label: 'SCREENSHOTS SAVED TIME',
                      value: editableFields.screenshotsTime, // Use the state for editable fields
                      subLabel: 'Screenshots Saved Time',
                      editable: true,
                    },
                    {
                      label: 'DISCOUNT',
                      value: editableFields.discount, // Use the state for editable fields
                      subLabel: 'Added Discount',
                      editable: true,
                    },
                    { label: 'TOTAL AMOUNT', value: selectedRequest?.details?.totalAmount || 'Not Provided', subLabel: 'Final Payable Amount' },
                    // { label: 'GENERATE INVOICE', value: null, isButton: true, subLabel: 'Download Invoice' },
                  ].map((field, index) => (
                    <Grid item xs={12} key={index}>
                      {field.isButton ? (
                        <Box sx={{ display: 'flex', mt: 2, alignItems: 'center' }}>
                          <Box sx={{ flex: 1, minWidth: '200px' }}>
                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                              {field.label}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px' }}>
                              {field.subLabel}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: '#4caf50',
                              color: '#fff',
                              borderRadius: '20px',
                              textTransform: 'none',
                              fontWeight: 'bold',
                              padding: '8px 24px',
                              '&:hover': { backgroundColor: '#43a047' },
                            }}
                          >
                            Download PDF
                          </Button>
                        </Box>
                      ) : field.isDropdown ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ flex: 1, minWidth: '200px' }}>
                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                              {field.label}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px' }}>
                              {field.subLabel}
                            </Typography>
                          </Box>
                          <Select
                            value={editableFields.userCount} // Bind directly to editableFields
                            onChange={(e) => handleFieldChange('userCount', e.target.value)} // Update editableFields state
                            fullWidth
                            sx={{
                              ml: 1,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                backgroundColor: '#f9f9f9',
                              },
                            }}
                          >
                            {field.options.map((option, optionIndex) => (
                              <MenuItem key={optionIndex} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ flex: 1, minWidth: '200px' }}>
                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                              {field.label}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px' }}>
                              {field.subLabel}
                            </Typography>
                          </Box>
                          {field.editable ? (
                            <TextField
                              variant="outlined"
                              fullWidth
                              value={field.value}
                              onChange={(e) => {
                                if (field.label === 'CONTACT NUMBER') {
                                  handleFieldChange('contactNumber', e.target.value); // Explicit key
                                } else if (field.label === 'SCREENSHOTS SAVED TIME') {
                                  handleFieldChange('screenshotsTime', e.target.value); // Explicit key
                                } else if (field.label === 'DISCOUNT') {
                                  handleFieldChange('discount', e.target.value); // Explicit key
                                }
                              }}
                              sx={{
                                ml: 1,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  backgroundColor: '#f9f9f9',
                                },
                              }}
                            />
                          ) : (
                            <TextField
                              variant="outlined"
                              fullWidth
                              value={field.value}
                              InputProps={{ readOnly: true }}
                              sx={{
                                ml: 1,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  backgroundColor: '#f9f9f9',
                                },
                              }}
                            />
                          )}
                        </Box>
                      )}
                    </Grid>
                  ))}
                </Grid>

              </Paper>




            </Box>
          </>
        ) : (

          <>
            <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
              Requests For Enterprise Plan
            </Typography>
            {/* Tabs */}
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              sx={{ marginBottom: 2 }}
              centered
            >
              <Tab label="Pending" />
              <Tab label="Approved" />
              <Tab label="Canceled" />
            </Tabs>

            {/* List View */ console.log('checkkkkk', requests)}
            {requests.length === 0 ? (
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  textAlign: 'center',
                  color: '#666',
                  marginTop: 4,
                }}
              >
                No requests available
              </Typography>
            ) : (
              requests.map((request, index) => (
                <Paper
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e0e0e0',
                    marginBottom: 2,
                    maxWidth: '90%',
                    marginX: 'auto',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '16px', color: '#333' }}>
                      {request.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>
                      {request.plan}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '12px', color: '#999' }}>
                      {request.time}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => handleViewClick(request)}
                    sx={{
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      borderRadius: '20px',
                      textTransform: 'none',
                      padding: '6px 16px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      boxShadow: 'none',
                      '&:hover': { backgroundColor: '#43a047' },
                    }}
                  >
                    View
                  </Button>
                </Paper>
              ))
            )}

          </>
        )}
      </Box>
    </>
  );
}

export default RequestsContent;
