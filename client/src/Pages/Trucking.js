import React from 'react';
import TruckingModule from '../Components/Trucking/TruckingModule';
import LoginNav from '../Components/Navbar/LoginNav';
import { Box } from '@mui/material';

const Trucking = () => {
  // Get user details from localStorage
  const userDetails = JSON.parse(localStorage.getItem('user'));
  
  return (
    <Box sx={{ paddingTop: '64px' }}>
      <LoginNav userDetails={userDetails} />
      <TruckingModule />
    </Box>
  );
};

export default Trucking; 