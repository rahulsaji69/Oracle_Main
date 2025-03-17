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
  MenuItem 
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Logo from '../../Assets/Logo.jpg';

const LoginNav = ({ toggleDrawer, userDetails }) => {
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
    <AppBar position="fixed" style={{ backgroundColor: 'white', color: '#333' }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <div className="navbar-logo" style={{ flexGrow: 1, textAlign: 'center' }}>
          <Link to="/">
            <img src={Logo} alt="Logo" style={{ height: '40px' }} />
          </Link>
        </div>
        <div className="navbar-menu" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="#search" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Search</Link>
          <Link to="#tracking" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Tracking</Link>
          
          <Button
            onClick={handleProfileClick}
            style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}
          >
            <Typography variant="subtitle1" style={{ marginRight: '10px' }}>
              {userDetails ? userDetails.name : "Guest"}
            </Typography>
            <AccountCircle style={{ fontSize: '30px', color: '#333' }} />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default LoginNav;

