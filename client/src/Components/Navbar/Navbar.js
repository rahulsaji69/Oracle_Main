import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 
import Logo from '../../Assets/Logo.jpg'

function Navbar () {
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setNavbarScrolled(true);
    } else {
      setNavbarScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${navbarScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-logo">
        <Link to="/">
        <img src={Logo} alt="Logo" />
        </Link>
      </div>
      <div className="navbar-menu">
        <a href="#search">Search</a>
        <a href="#tracking">Tracking</a>
        
        <a href="/login">Login</a>
      </div>
      <button className="navbar-toggler">&#9776;</button>
    </nav>
  );
};

export default Navbar;
