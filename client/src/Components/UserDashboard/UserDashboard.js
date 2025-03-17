import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserDashboard.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

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
  MenuItem 
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle"; // Import AccountCircle icon
import Logo from '../../Assets/Logo.jpg'; // Import the logo
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

const Dashboard = () => {
  const [fromPort, setFromPort] = useState('');
  const [toPort, setToPort] = useState('');
  const [date, setDate] = useState('');
  const [userDetails, setUserDetails] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for the menu anchor
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schedules');
  const [currentSlide, setCurrentSlide] = useState(0);

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
    localStorage.removeItem("user"); // Clear user details as well
    toast.success("Logged out successfully!");
    navigate("/", { replace: true }); // Redirect to the home page and replace the current entry
    // No need for window.location.reload() as the navigation will handle it
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget); // Set the anchor element for the menu
  };

  const handleCloseMenu = () => {
    setAnchorEl(null); // Close the menu
  };

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
            
            {/* User Profile Button */}
            <Button
              onClick={handleProfileClick}
              style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}
            >
              <Typography variant="subtitle1" style={{ marginRight: '10px' }}>
                {userDetails ? userDetails.name : "Guest"}
              </Typography>
              <AccountCircle style={{ fontSize: '30px', color: '#333' }} />
            </Button>
            {/* User Menu */}
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
              {/* Add contacts content here */}
              <p>Contacts information will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
      <div className="main-content">
        {/* Solutions Section */}
        <section className="solutions-section" style={{ backgroundImage: `url(${solutionsBackground})` }}>
          <div className="container">
            <h2>Our Solutions</h2>
            <p className="solutions-description">
              As a global leader in container shipping, our worldwide teams of industry-specific experts offer round-the-clock personalized service. We ensure fast and reliable transit times, providing the best solutions for your needs.
            </p>
            <div className="solutions-container">
              <div className="solution">
                <img src={shippingIcon} alt="Shipping Solutions" className="solution-icon" />
                <h3>Shipping Solutions</h3>
              </div>
              <div className="solution">
                <img src={inlandIcon} alt="Inland Transportation" className="solution-icon" />
                <h3>Inland Transportation & Logistics Solutions</h3>
              </div>
              <div className="solution">
                <img src={airCargoIcon} alt="Air Cargo" className="solution-icon" />
                <h3>Air Cargo Solutions</h3>
              </div>
              <div className="solution">
                <img src={digitalIcon} alt="Digital Business" className="solution-icon" />
                <h3>Digital Business Solutions</h3>
              </div>
              <div className="solution">
                <img src={cargoCoverIcon} alt="Cargo Cover" className="solution-icon" />
                <h3>Cargo Cover Solutions</h3>
              </div>
            </div>
            <button className="see-all-button">See all solutions</button>
          </div>
        </section>

        {/* Industries Section */}
        <section className="industries-section">
          <div className="container">
            <h2 className="section-title">Your Shipping Needs Met</h2>
            <div className="title-underline"></div>
            
            <div className="description-text">
              <p>At Ocean Oracle we pride ourselves on being a global container shipping company that delivers tailored solutions designed to meet the specific needs of each of our customers. Regardless of your cargo type, or final destination, we offer versatile solutions that cover air, land, and sea.</p>
              <p>Thanks to the extensive capacity of our container fleet, Ocean Oracle is the trusted transportation partner and shipping company for numerous companies the world over.</p>
            </div>

            <div className="industries-slider">
              <button className="slider-arrow prev" onClick={() => setCurrentSlide(prev => (prev === 0 ? industries.length - 1 : prev - 1))}>
                ‹
              </button>
              
              <div className="industries-container">
                {industries.map((industry, index) => (
                  <div 
                    key={industry.title}
                    className={`industry-card ${index === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${industry.image})` }}
                  >
                    <div className="industry-content">
                      <h3>{industry.title}</h3>
                      <p>{industry.description}</p>
                      <button className="read-more">READ MORE</button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="slider-arrow next" onClick={() => setCurrentSlide(prev => (prev === industries.length - 1 ? 0 : prev + 1))}>
                ›
              </button>
            </div>

            <div className="slider-dots">
              {industries.map((_, index) => (
                <span 
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                ></span>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="footer-section">
          <div className="footer-container">
            <div className="footer-left">
              <div className="location-selector">
                <select defaultValue="IN" className="country-select">
                  <option value="IN">IN</option>
                </select>
                <select defaultValue="MUMBAI" className="office-select">
                  <option value="MUMBAI">OCEAN ORACLE MUMBAI</option>
                </select>
              </div>
              <div className="contact-info">
                <a href="tel:+912226378000"><i className="fas fa-phone"></i>+91 2226378000</a>
                <a href="mailto:info@oceanoracle.com"><i className="fas fa-envelope"></i>info@oceanoracle.com</a>
                <a href="ff"><i className="fas fa-map-marker-alt"></i>Office details</a>
              </div>
            </div>

            <div className="footer-center">
              <div className="footer-links">
                <span>Solutions</span>
                <span>Local information</span>
                <span>E-Business</span>
                <span>Sustainability</span>
                <span>myOceanOracle</span>
              </div>
            </div>

            <div className="footer-right">
              <div className="footer-links">
                <span>Ocean Oracle Group</span>
                <span>Newsroom</span>
                <span>Events</span>
                <span>Blog</span>
                <span>Careers</span>
                <span>Contact us</span>
                <span>Preference Center</span>
              </div>
              <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
