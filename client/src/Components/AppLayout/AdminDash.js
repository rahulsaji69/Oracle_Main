import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Paper, 
  Typography, 
  Button 
} from '@mui/material';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PeopleIcon from '@mui/icons-material/People';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import './AdminDash.css';

const AdminDash = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    { title: 'Ships', icon: <DirectionsBoatIcon />, path: '/admin-dashboard/ships' },
    { title: 'Schedules', icon: <ScheduleIcon />, path: '/admin-dashboard/schedules' },
    { title: 'Users', icon: <PeopleIcon />, path: '/admin-dashboard/users' },
    { title: 'Bookings', icon: <BookOnlineIcon />, path: '/admin-dashboard/bookings' },
  ];

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      <Typography variant="h4" className="dashboard-title">
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper 
              className="dashboard-item" 
              elevation={3}
              onClick={() => handleItemClick(item.path)}
            >
              <div className="item-icon">{item.icon}</div>
              <Typography variant="h6">{item.title}</Typography>
              <Button variant="contained" color="primary">
                View Details
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AdminDash;

