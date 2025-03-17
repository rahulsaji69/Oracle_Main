import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  DirectionsBoat,
  Schedule,
  BookOnline,
  ExitToApp,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AppLayout.css";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#e74c3c',
    },
    background: {
      default: '#ecf0f1',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
});

const AppLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && contentRef.current.contains(event.target)) {
        closeDrawer();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check authentication status when component mounts
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
    navigate("/", { replace: true });
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin-dashboard" },
    { text: "Users", icon: <People />, path: "/admin-dashboard/users" },
    { text: "Ships", icon: <DirectionsBoat />, path: "/admin-dashboard/ships" },
    { text: "Schedules", icon: <Schedule />, path: "/admin-dashboard/schedules" },
    { text: "Bookings", icon: <BookOnline />, path: "/admin-dashboard/bookings" },
  ];

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className="admin-page">
        <CssBaseline />
        <ToastContainer />
        <AppBar position="fixed" className="app-bar">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              className="menu-button"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          classes={{
            paper: `drawer-paper ${drawerOpen ? 'drawer-open' : ''}`,
          }}
        >
          <div className="drawer-spacer"></div>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  closeDrawer();
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><ExitToApp /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Drawer>
        <main ref={contentRef} className={`content ${drawerOpen ? 'content-shift' : ''}`}>
          <Outlet />
        </main>
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout;
