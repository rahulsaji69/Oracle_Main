import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Button, 
  Menu, 
  MenuItem,
  Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Logo from '../../Assets/Logo.jpg';

const LoginNav = ({ toggleDrawer = () => () => {}, userDetails }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/", { replace: true });
    handleCloseMenu();
  };

  return (
    <AppBar position="fixed" style={{ backgroundColor: 'white', color: '#333', boxShadow: 'none', borderBottom: '1px solid #eee' }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          sx={{ marginRight: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Center section with logo */}
        <Box sx={{ 
          position: 'absolute', 
          left: '50%', 
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Link to="/">
            <img src={Logo} alt="Logo" style={{ height: '45px' }} />
          </Link>
        </Box>

        {/* Right section with navigation items */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '32px',
          marginLeft: 'auto'
        }}>
          <Link to="/search" style={{ 
            textDecoration: 'none', 
            color: '#333', 
            fontWeight: '500',
            fontSize: '16px'
          }}>
            Search
          </Link>
          <Link to="/tracking" style={{ 
            textDecoration: 'none', 
            color: '#333', 
            fontWeight: '500',
            fontSize: '16px'
          }}>
            Tracking
          </Link>
          <Link to="/support" style={{ 
            textDecoration: 'none', 
            color: '#333', 
            fontWeight: '500',
            fontSize: '16px'
          }}>
            Support
          </Link>
          
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
            <Button
              onClick={handleProfileClick}
              style={{ 
                textTransform: 'none',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Typography variant="body1" style={{ fontWeight: '500' }}>
                {userDetails ? userDetails.name : "GUEST"}
              </Typography>
              <AccountCircle />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LoginNav;

