import React from 'react';
import { Link } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import HelpIcon from '@mui/icons-material/Help';
import './BottomNavbar.css';

const BottomNavbar = ({ value, setValue }) => {
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        className="bottom-navbar"
      >
        <BottomNavigationAction 
          component={Link} 
          to="/" 
          label="Home" 
          icon={<HomeIcon />} 
        />
        <BottomNavigationAction 
          component={Link} 
          to="/search" 
          label="Search" 
          icon={<SearchIcon />} 
        />
        <BottomNavigationAction 
          component={Link} 
          to="/tracking" 
          label="Track" 
          icon={<LocalShippingIcon />} 
        />
        <BottomNavigationAction 
          component={Link} 
          to="/booking" 
          label="Book" 
          icon={<ConfirmationNumberIcon />} 
        />
        <BottomNavigationAction 
          component={Link} 
          to="/support" 
          label="Support" 
          icon={<HelpIcon />} 
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavbar; 