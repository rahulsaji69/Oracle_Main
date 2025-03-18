import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserDashboard.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaTruck, FaCalendarAlt, FaBoxOpen, FaUserCog, FaCheckCircle, FaMapMarkerAlt, FaClock, FaRoute, FaHistory, FaEye, FaFileAlt, FaFileInvoice, FaFileContract, FaHome, FaBook, FaShip, FaTruckLoading, FaUser, FaPhone, FaEnvelope, FaMapMarker } from 'react-icons/fa';

import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  IconButton, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Menu, 
  MenuItem,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  ListItemIcon,
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CloseIcon from '@mui/icons-material/Close';
import Logo from '../../Assets/Logo.jpg';
import solutionsBackground from '../../Assets/cc.jpg';
import shippingIcon from '../../Assets/ii.jpg';
import inlandIcon from '../../Assets/gg.jpg';
import airCargoIcon from '../../Assets/cc.jpg';
import digitalIcon from '../../Assets/mm.jpg';
import cargoCoverIcon from '../../Assets/cargo cover solution.jpg';
import agricultureImg from '../../Assets/agriculture.webp';
import fruitsImg from '../../Assets/fruits.webp';
import pharmaceuticalsImg from '../../Assets/pharmaceuticals.webp';
import carPartsImg from '../../Assets/car-parts.webp';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-left">
          <h3>About Us</h3>
          <p>Ocean Oracle is your trusted partner in global shipping and logistics solutions. We provide comprehensive services to meet all your transportation needs.</p>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>
        
        <div className="footer-center">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/dashboard/bookings">Bookings</Link></li>
            <li><Link to="/dashboard/shipping">Shipping</Link></li>
            <li><Link to="/dashboard/trucking">Trucking</Link></li>
            <li><Link to="/dashboard/profile">Profile</Link></li>
          </ul>
        </div>
        
        <div className="footer-right">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>info@oceanoracle.com</span>
            </div>
            <div className="contact-item">
              <FaMapMarker className="contact-icon" />
              <span>123 Shipping Lane, Port City, PC 12345</span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Ocean Oracle. All rights reserved.</p>
      </div>
    </footer>
  );
};

const Dashboard = () => {
  const [fromPort, setFromPort] = useState('');
  const [toPort, setToPort] = useState('');
  const [date, setDate] = useState('');
  const [userDetails, setUserDetails] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schedules');
  const [currentSlide, setCurrentSlide] = useState(0);

  const [openSchedulingDialog, setOpenSchedulingDialog] = useState(false);
  const [openMovementDialog, setOpenMovementDialog] = useState(false);
  const [openDriverDialog, setOpenDriverDialog] = useState(false);
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false);
  const [schedulingFormData, setSchedulingFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    pickupLocation: '',
    deliveryDate: '',
    deliveryTime: '',
    deliveryLocation: '',
    cargoType: '',
    specialInstructions: ''
  });
  const [movementFormData, setMovementFormData] = useState({
    containerId: '',
    status: 'In Transit',
    currentLocation: '',
    estimatedDelivery: '',
    notes: ''
  });
  const [driverFormData, setDriverFormData] = useState({
    driverName: '',
    driverPhone: '',
    vehicleType: '',
    vehicleId: '',
    containerId: ''
  });
  const [deliveryFormData, setDeliveryFormData] = useState({
    containerId: '',
    deliveryDate: '',
    receiverName: '',
    receiverSignature: '',
    notes: '',
    status: 'Pending'
  });

  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  const [bookingHistory, setBookingHistory] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingDetailOpen, setBookingDetailOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchUserDetails = () => {
    setUserDetails(JSON.parse(localStorage.getItem("user")));
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const menuItems = [
    "Dashboard",
    "eBookings",
    "Shipping Instructions",
    "Trucking Services",
    "My Profile"
  ];

  const industries = [
    {
      title: "Agriculture",
      image: agricultureImg,
      description: "With global sourcing an everyday reality, Ocean Oracle connects the growers, farmers and producers of agricultural products around the world with their key markets.",
    },
    {
      title: "Fruits",
      image: fruitsImg,
      description: "Whether you're shipping apples or avocados, our world-leading reefer fleet is equipped with the technology you need to keep your fruit in perfect condition.",
    },
    {
      title: "Pharmaceuticals",
      image: pharmaceuticalsImg,
      description: "More and more pharmaceutical companies are turning to sea transport to deliver medicines and other essential goods quickly and safely to their destination.",
    },
    {
      title: "Car Parts",
      image: carPartsImg,
      description: "Whether you are shipping production or service parts, a reliable and experienced shipping partner is a vital link in your uninterruptible supply chain.",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/", { replace: true });
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenSchedulingDialog = () => {
    setOpenSchedulingDialog(true);
  };

  const handleCloseSchedulingDialog = () => {
    setOpenSchedulingDialog(false);
  };

  const handleOpenMovementDialog = () => {
    setOpenMovementDialog(true);
  };

  const handleCloseMovementDialog = () => {
    setOpenMovementDialog(false);
  };

  const handleOpenDriverDialog = () => {
    setOpenDriverDialog(true);
  };

  const handleCloseDriverDialog = () => {
    setOpenDriverDialog(false);
  };

  const handleOpenDeliveryDialog = () => {
    setOpenDeliveryDialog(true);
  };

  const handleCloseDeliveryDialog = () => {
    setOpenDeliveryDialog(false);
  };

  const handleSchedulingSubmit = () => {
    toast.success("Pickup/delivery scheduled successfully!");
    setOpenSchedulingDialog(false);
  };

  const handleMovementSubmit = () => {
    toast.success("Container movement updated successfully!");
    setOpenMovementDialog(false);
  };

  const handleDriverSubmit = () => {
    toast.success("Driver assigned successfully!");
    setOpenDriverDialog(false);
  };

  const handleDeliverySubmit = () => {
    toast.success("Delivery confirmed successfully!");
    setOpenDeliveryDialog(false);
  };

  const handleSchedulingFormChange = (e) => {
    const { name, value } = e.target;
    setSchedulingFormData({
      ...schedulingFormData,
      [name]: value
    });
  };

  const handleMovementFormChange = (e) => {
    const { name, value } = e.target;
    setMovementFormData({
      ...movementFormData,
      [name]: value
    });
  };

  const handleDriverFormChange = (e) => {
    const { name, value } = e.target;
    setDriverFormData({
      ...driverFormData,
      [name]: value
    });
  };

  const handleDeliveryFormChange = (e) => {
    const { name, value } = e.target;
    setDeliveryFormData({
      ...deliveryFormData,
      [name]: value
    });
  };

  const handleTrackPackage = async () => {
    if (!trackingNumber) {
      toast.error("Please enter a tracking number");
      return;
    }

    setIsTracking(true);
    setTrackingError('');

    try {
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            status: 'success',
            data: {
              trackingNumber: trackingNumber,
              currentStatus: 'In Transit',
              currentLocation: 'Mumbai Port',
              estimatedDelivery: '2024-03-25T15:00:00',
              history: [
                {
                  date: '2024-03-20T10:00:00',
                  location: 'Mumbai Port',
                  status: 'Package Received',
                  description: 'Package received at origin facility'
                },
                {
                  date: '2024-03-21T14:30:00',
                  location: 'Mumbai Port',
                  status: 'Processing',
                  description: 'Package being processed for shipping'
                },
                {
                  date: '2024-03-22T09:15:00',
                  location: 'Mumbai Port',
                  status: 'In Transit',
                  description: 'Package loaded onto container'
                }
              ]
            }
          });
        }, 1000);
      });

      if (response.status === 'success') {
        setTrackingResult(response.data);
        setTrackingHistory(response.data.history);
        toast.success("Package tracking information retrieved successfully!");
      }
    } catch (error) {
      setTrackingError("Unable to track package. Please try again later.");
      toast.error("Failed to track package");
    } finally {
      setIsTracking(false);
    }
  };

  const fetchBookingHistory = async () => {
    setIsLoadingBookings(true);
    
    try {
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            status: 'success',
            data: [
              {
                id: 'BK-2024-0001',
                date: '2024-03-01T10:30:00',
                status: 'Completed',
                origin: 'Mumbai Port',
                destination: 'Singapore Port',
                cargoType: 'General Cargo',
                containerId: 'CONT-78945',
                vessel: 'Ocean Voyager',
                eta: '2024-03-15T08:00:00'
              },
              {
                id: 'BK-2024-0002',
                date: '2024-03-05T14:15:00',
                status: 'In Transit',
                origin: 'Mumbai Port',
                destination: 'Dubai Port',
                cargoType: 'Electronics',
                containerId: 'CONT-65432',
                vessel: 'Sea Navigator',
                eta: '2024-03-25T16:30:00'
              },
              {
                id: 'BK-2024-0003',
                date: '2024-03-10T09:45:00',
                status: 'Processing',
                origin: 'Mumbai Port',
                destination: 'Shanghai Port',
                cargoType: 'Chemicals',
                containerId: 'CONT-13579',
                vessel: 'Ocean Explorer',
                eta: '2024-04-05T10:15:00'
              }
            ]
          });
        }, 1000);
      });

      if (response.status === 'success') {
        setBookingHistory(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch booking history");
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleViewBookingDetail = (booking) => {
    setSelectedBooking(booking);
    setBookingDetailOpen(true);
  };

  const handleCloseBookingDetail = () => {
    setBookingDetailOpen(false);
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const drawerList = (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((text, index) => (
          <ListItem button key={text} onClick={() => {
            navigate(`/${text.replace(" ", "").toLowerCase()}`);
          }}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div className="dashboard-container">
      <ToastContainer />
      <AppBar position="fixed" style={{ backgroundColor: '#f4f4f4', color: '#333' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <div className="navbar-logo" style={{ flexGrow: 1, marginLeft: '750px' }}>
            <Link to="/dashboard">
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
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
      <div style={{ marginTop: '70px', padding: '20px' }}>
        <div className="header-section">
          <h1 className="main-title">Welcome to Your Dashboard</h1>
          <div className="tracking-container">
            <div className="tracking-tabs">
              <button 
                className={`tab ${activeTab === 'tracking' ? 'active' : ''}`}
                onClick={() => setActiveTab('tracking')}
              >
                TRACKING
              </button>
              <button 
                className={`tab ${activeTab === 'schedules' ? 'active' : ''}`}
                onClick={() => setActiveTab('schedules')}
              >
                SCHEDULES
              </button>
              <button 
                className={`tab ${activeTab === 'contacts' ? 'active' : ''}`}
                onClick={() => setActiveTab('contacts')}
              >
                CONTACTS
              </button>
            </div>
            {activeTab === 'tracking' && (
              <div className="tracking-content">
                <div className="tracking-options">
                  <label>
                    <input type="radio" name="tracking" value="container" defaultChecked />
                    Container / Bill of Lading Number
                  </label>
                  <label>
                    <input type="radio" name="tracking" value="booking" />
                    Booking Number
                  </label>
                </div>
                <input type="text" placeholder="Search..." className="search-input" />
              </div>
            )}
            {activeTab === 'schedules' && (
              <div className="schedules-content">
                <div className="port-inputs">
                  <input
                    type="text"
                    placeholder="From (Port)"
                    className="port-input"
                    value={fromPort}
                    onChange={(e) => setFromPort(e.target.value)}
                  />
                  <button className="swap-button" onClick={() => {
                    const temp = fromPort;
                    setFromPort(toPort);
                    setToPort(temp);
                  }}>⇄</button>
                  <input
                    type="text"
                    placeholder="To (Port)"
                    className="port-input"
                    value={toPort}
                    onChange={(e) => setToPort(e.target.value)}
                  />
                </div>
                <input
                  type="date"
                  className="date-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <button
                  className="search-button"
                  onClick={() => navigate(`/shipschedules?from=${fromPort}&to=${toPort}&date=${date}`)}
                >
                  Search
                </button>
              </div>
            )}
            {activeTab === 'contacts' && (
              <div className="contacts-content">
                <p>Contacts information will be displayed here.</p>
              </div>
            )}
          </div>
        </div>

        <div className="tracking-section">
          <h2 className="section-title">Package Tracking</h2>
          <p className="section-description">Track your packages in real-time with detailed status updates</p>
          
          <div className="tracking-search">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="tracking-input"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleTrackPackage}
              disabled={isTracking}
              className="track-button"
            >
              {isTracking ? "Tracking..." : "Track Package"}
            </Button>
          </div>

          {trackingError && (
            <div className="tracking-error">
              {trackingError}
            </div>
          )}

          {trackingResult && (
            <div className="tracking-result">
              <Card className="tracking-status-card">
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <div className="status-item">
                        <FaMapMarkerAlt className="status-icon" />
                        <div>
                          <Typography variant="subtitle2" color="textSecondary">
                            Current Location
                          </Typography>
                          <Typography variant="h6">
                            {trackingResult.currentLocation}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <div className="status-item">
                        <FaClock className="status-icon" />
                        <div>
                          <Typography variant="subtitle2" color="textSecondary">
                            Current Status
                          </Typography>
                          <Typography variant="h6">
                            {trackingResult.currentStatus}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <div className="status-item">
                        <FaRoute className="status-icon" />
                        <div>
                          <Typography variant="subtitle2" color="textSecondary">
                            Estimated Delivery
                          </Typography>
                          <Typography variant="h6">
                            {new Date(trackingResult.estimatedDelivery).toLocaleString()}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <div className="tracking-timeline">
                <Typography variant="h6" className="timeline-title">
                  Tracking History
                </Typography>
                <div className="timeline">
                  {trackingHistory.map((event, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <Typography variant="subtitle1" className="timeline-date">
                          {new Date(event.date).toLocaleString()}
                        </Typography>
                        <Typography variant="h6" className="timeline-status">
                          {event.status}
                        </Typography>
                        <Typography variant="body2" className="timeline-location">
                          {event.location}
                        </Typography>
                        <Typography variant="body2" className="timeline-description">
                          {event.description}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="services-section">
            <h2 className="section-title">Services</h2>
            <p className="section-description">Manage your shipping and delivery needs</p>
            
            <Grid container spacing={3} className="services-grid">
              <Grid item xs={12} sm={6} md={4}>
                <Card className="service-card" onClick={handleOpenSchedulingDialog}>
                  <CardContent>
                    <FaCalendarAlt size={40} className="service-icon" />
                    <Typography variant="h6" component="div">
                      Pick-up/Delivery Scheduling
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Schedule pickups and deliveries for your containers
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card className="service-card" onClick={handleOpenMovementDialog}>
                  <CardContent>
                    <FaBoxOpen size={40} className="service-icon" />
                    <Typography variant="h6" component="div">
                      Container Movement Updates
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Update or track the movement of your containers
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card className="service-card" onClick={handleOpenDriverDialog}>
                  <CardContent>
                    <FaUserCog size={40} className="service-icon" />
                    <Typography variant="h6" component="div">
                      Driver Assignment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Assign drivers to your shipments
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card className="service-card" onClick={handleOpenDeliveryDialog}>
                  <CardContent>
                    <FaCheckCircle size={40} className="service-icon" />
                    <Typography variant="h6" component="div">
                      Delivery Confirmation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Confirm delivery of your containers
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        </div>

        <div className="booking-history-section">
          <h2 className="section-title">Booking History</h2>
          <p className="section-description">View and manage your past bookings</p>
          
          {isLoadingBookings ? (
            <div className="loading-spinner">
              <Typography>Loading booking history...</Typography>
            </div>
          ) : (
            <div className="booking-history-table">
              <Card>
                <CardContent>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Booking ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Origin</TableCell>
                        <TableCell>Destination</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookingHistory.length > 0 ? (
                        bookingHistory.map((booking) => (
                          <TableRow key={booking.id} className="booking-row">
                            <TableCell>{booking.id}</TableCell>
                            <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                            <TableCell>{booking.origin}</TableCell>
                            <TableCell>{booking.destination}</TableCell>
                            <TableCell>
                              <span className={`status-badge status-${booking.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                {booking.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                color="primary"
                                onClick={() => handleViewBookingDetail(booking)}
                                title="View Details"
                              >
                                <FaEye />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No booking history found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <Dialog open={openSchedulingDialog} onClose={handleCloseSchedulingDialog} maxWidth="md">
        <DialogTitle>Schedule Pickup/Delivery</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Pickup Date"
                name="pickupDate"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={schedulingFormData.pickupDate}
                onChange={handleSchedulingFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Pickup Time"
                name="pickupTime"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={schedulingFormData.pickupTime}
                onChange={handleSchedulingFormChange}
              />
            </Grid>
          </Grid>
          <TextField
            margin="dense"
            label="Pickup Location"
            name="pickupLocation"
            fullWidth
            value={schedulingFormData.pickupLocation}
            onChange={handleSchedulingFormChange}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Delivery Date"
                name="deliveryDate"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={schedulingFormData.deliveryDate}
                onChange={handleSchedulingFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Delivery Time"
                name="deliveryTime"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={schedulingFormData.deliveryTime}
                onChange={handleSchedulingFormChange}
              />
            </Grid>
          </Grid>
          <TextField
            margin="dense"
            label="Delivery Location"
            name="deliveryLocation"
            fullWidth
            value={schedulingFormData.deliveryLocation}
            onChange={handleSchedulingFormChange}
          />
          <TextField
            margin="dense"
            label="Cargo Type"
            name="cargoType"
            fullWidth
            value={schedulingFormData.cargoType}
            onChange={handleSchedulingFormChange}
          />
          <TextField
            margin="dense"
            label="Special Instructions"
            name="specialInstructions"
            fullWidth
            multiline
            rows={3}
            value={schedulingFormData.specialInstructions}
            onChange={handleSchedulingFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSchedulingDialog}>Cancel</Button>
          <Button onClick={handleSchedulingSubmit} color="primary">Schedule</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openMovementDialog} onClose={handleCloseMovementDialog} maxWidth="md">
        <DialogTitle>Container Movement Updates</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Container ID"
            name="containerId"
            fullWidth
            value={movementFormData.containerId}
            onChange={handleMovementFormChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={movementFormData.status}
              onChange={handleMovementFormChange}
              label="Status"
            >
              <MenuItem value="At Origin">At Origin</MenuItem>
              <MenuItem value="In Transit">In Transit</MenuItem>
              <MenuItem value="At Destination">At Destination</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Delayed">Delayed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Current Location"
            name="currentLocation"
            fullWidth
            value={movementFormData.currentLocation}
            onChange={handleMovementFormChange}
          />
          <TextField
            margin="dense"
            label="Estimated Delivery"
            name="estimatedDelivery"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={movementFormData.estimatedDelivery}
            onChange={handleMovementFormChange}
          />
          <TextField
            margin="dense"
            label="Notes"
            name="notes"
            fullWidth
            multiline
            rows={3}
            value={movementFormData.notes}
            onChange={handleMovementFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMovementDialog}>Cancel</Button>
          <Button onClick={handleMovementSubmit} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDriverDialog} onClose={handleCloseDriverDialog} maxWidth="md">
        <DialogTitle>Driver Assignment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Container ID"
            name="containerId"
            fullWidth
            value={driverFormData.containerId}
            onChange={handleDriverFormChange}
          />
          <TextField
            margin="dense"
            label="Driver Name"
            name="driverName"
            fullWidth
            value={driverFormData.driverName}
            onChange={handleDriverFormChange}
          />
          <TextField
            margin="dense"
            label="Driver Phone"
            name="driverPhone"
            fullWidth
            value={driverFormData.driverPhone}
            onChange={handleDriverFormChange}
          />
          <TextField
            margin="dense"
            label="Vehicle Type"
            name="vehicleType"
            fullWidth
            value={driverFormData.vehicleType}
            onChange={handleDriverFormChange}
          />
          <TextField
            margin="dense"
            label="Vehicle ID/License"
            name="vehicleId"
            fullWidth
            value={driverFormData.vehicleId}
            onChange={handleDriverFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDriverDialog}>Cancel</Button>
          <Button onClick={handleDriverSubmit} color="primary">Assign</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeliveryDialog} onClose={handleCloseDeliveryDialog} maxWidth="md">
        <DialogTitle>Delivery Confirmation</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Container ID"
            name="containerId"
            fullWidth
            value={deliveryFormData.containerId}
            onChange={handleDeliveryFormChange}
          />
          <TextField
            margin="dense"
            label="Delivery Date"
            name="deliveryDate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={deliveryFormData.deliveryDate}
            onChange={handleDeliveryFormChange}
          />
          <TextField
            margin="dense"
            label="Receiver Name"
            name="receiverName"
            fullWidth
            value={deliveryFormData.receiverName}
            onChange={handleDeliveryFormChange}
          />
          <TextField
            margin="dense"
            label="Receiver Signature"
            name="receiverSignature"
            fullWidth
            value={deliveryFormData.receiverSignature}
            onChange={handleDeliveryFormChange}
          />
          <TextField
            margin="dense"
            label="Notes"
            name="notes"
            fullWidth
            multiline
            rows={3}
            value={deliveryFormData.notes}
            onChange={handleDeliveryFormChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={deliveryFormData.status}
              onChange={handleDeliveryFormChange}
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Partial Delivery">Partial Delivery</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeliveryDialog}>Cancel</Button>
          <Button onClick={handleDeliverySubmit} color="primary">Confirm Delivery</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={bookingDetailOpen} onClose={handleCloseBookingDetail} maxWidth="md">
        <DialogTitle>
          Booking Details
          <IconButton
            aria-label="close"
            onClick={handleCloseBookingDetail}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Booking ID</Typography>
                <Typography variant="body1" gutterBottom>{selectedBooking.id}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Date</Typography>
                <Typography variant="body1" gutterBottom>{new Date(selectedBooking.date).toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                <Typography variant="body1" gutterBottom>{selectedBooking.status}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Cargo Type</Typography>
                <Typography variant="body1" gutterBottom>{selectedBooking.cargoType}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Origin</Typography>
                <Typography variant="body1" gutterBottom>{selectedBooking.origin}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Destination</Typography>
                <Typography variant="body1" gutterBottom>{selectedBooking.destination}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Container ID</Typography>
                <Typography variant="body1" gutterBottom>{selectedBooking.containerId}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Vessel</Typography>
                <Typography variant="body1" gutterBottom>{selectedBooking.vessel}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">ETA</Typography>
                <Typography variant="body1" gutterBottom>{new Date(selectedBooking.eta).toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Shipment Documents</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><FaFileAlt /></ListItemIcon>
                    <ListItemText primary="Bill of Lading" secondary="View | Download" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><FaFileInvoice /></ListItemIcon>
                    <ListItemText primary="Commercial Invoice" secondary="View | Download" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><FaFileContract /></ListItemIcon>
                    <ListItemText primary="Packing List" secondary="View | Download" />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBookingDetail}>Close</Button>
          {selectedBooking && selectedBooking.status === 'In Transit' && (
            <Button color="primary" startIcon={<FaRoute />} onClick={() => {
              handleCloseBookingDetail();
              setTrackingNumber(selectedBooking.containerId);
              handleTrackPackage();
            }}>
              Track Shipment
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
