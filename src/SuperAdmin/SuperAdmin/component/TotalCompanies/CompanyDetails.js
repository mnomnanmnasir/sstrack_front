import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

function CompanyDetails() {
  const { companyName } = useParams();
  const location = useLocation();
  const company = location.state;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" fontWeight="bold" marginBottom={3}>
        Company Det
      </Typography>
      <Typography variant="h6">Name: {companyName}</Typography>
      <Typography variant="body1">Email: {company.email}</Typography>
      <Typography variant="body1">Phone: {company.phone}</Typography>
    </Box>
  );
}

export default CompanyDetails;
