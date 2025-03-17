import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
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
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
//import cargoCoverImage from '../../Assets/cargo cover solution.jpg'; 

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('schedules');
  const [fromPort, setFromPort] = useState('');
  const [toPort, setToPort] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

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

  return (
    <div className="home">
      {/* Header Section */}
      <section className="header-section">
        <h1 className="main-title">Leader in Shipping & Logistics</h1>
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
      </section>

      {/* Our Solutions Section */}
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
            
            <p>Thanks to the extensive capacity of our container fleet, Ocean Oracle is the trusted transportation partner and shipping company for numerous companies the world over. Combining this with our global port coverage and extensive equipment availability means, we are able to deliver a professional, efficient shipping service, tailored to the specific needs of your business.</p>
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

      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-left">
            <div className="location-selector">
              <select defaultValue="IN" className="country-select">
                <option value="IN">IN</option>
                {/* Add more country options */}
              </select>
              <select defaultValue="MUMBAI" className="office-select">
                <option value="MUMBAI">OCEAN ORACLE MUMBAI</option>
                {/* Add more office options */}
              </select>
            </div>
            <div className="contact-info">
              <a href="tel:+912226378000"><i className="fas fa-phone"></i>+91 2226378000</a>
              <a href="mailto:info@oceanoracle.com"><i className="fas fa-envelope"></i>info@oceanoracle.com</a>
              <a href="tt"><i className="fas fa-map-marker-alt"></i>Office details</a>
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

          <div className="footer-section">
          <h3>GET TO KNOW US</h3>
          <div className="footer-links">
            <Link to="/about">Ocean Oracle Group</Link>
            <Link to="/newsroom">Newsroom</Link>
            <Link to="/events">Events</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/contact">Contact us</Link>
            <Link to="/preferences">Preference Center</Link>
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
  );
};

export default HomePage;
