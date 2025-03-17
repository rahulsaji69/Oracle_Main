import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section">
          <h3>COUNTRY-LOCATION / LOCAL OFFICE</h3>
          <div className="location-selector">
            <select className="country-select">
              <option value="IN">IN</option>
              {/* Add more countries as needed */}
            </select>
            <select className="office-select">
              <option value="MUMBAI">OCEAN ORACLE MUMBAI</option>
              {/* Add more offices as needed */}
            </select>
          </div>
          <div className="contact-info">
            <a href="tel:+912226378000">+91 2226378000</a>
            <a href="mailto:info@oceanoracle.com">info@oceanoracle.com</a>
            <button className="office-details-btn">Office details</button>
          </div>
        </div>

        <div className="footer-section">
          <h3>DOING BUSINESS TOGETHER</h3>
          <div className="footer-links">
            <Link to="/solutions">Solutions</Link>
            <Link to="/local-information">Local information</Link>
            <Link to="/e-business">E-Business</Link>
            <Link to="/sustainability">Sustainability</Link>
            <Link to="/my-account">myOceanOracle</Link>
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
        </div>
      </div>

      <div className="footer-bottom">
        <div className="social-links">
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
    </footer>
  );
};

export default Footer;