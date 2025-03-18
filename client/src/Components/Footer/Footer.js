import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Select, MenuItem } from '@mui/material';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box sx={{ 
      backgroundColor: '#1a1a1a', 
      color: '#fff',
      mt: 'auto',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Country/Location Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ 
              color: '#666',
              fontSize: '14px',
              fontWeight: 500,
              mb: 2,
              textTransform: 'uppercase'
            }}>
              COUNTRY-LOCATION / LOCAL OFFICE
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Select
                value="IN"
                sx={{
                  backgroundColor: '#333',
                  color: '#fff',
                  width: '80px',
                  height: '40px',
                  mr: 1,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#444'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#555'
                  }
                }}
              >
                <MenuItem value="IN">IN</MenuItem>
              </Select>
              <Select
                value="MUMBAI"
                sx={{
                  backgroundColor: '#333',
                  color: '#fff',
                  width: '200px',
                  height: '40px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#444'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#555'
                  }
                }}
              >
                <MenuItem value="MUMBAI">OCEAN ORACLE MUMBAI</MenuItem>
              </Select>
            </Box>
            <Box sx={{ color: '#999', fontSize: '14px' }}>
              <Typography component="p" sx={{ mb: 1 }}>+91 2226378000</Typography>
              <Typography component="p" sx={{ mb: 1 }}>info@oceanoracle.com</Typography>
              <Link to="#" style={{ color: '#999', textDecoration: 'none' }}>
                Office details
              </Link>
            </Box>
          </Grid>

          {/* Doing Business Together Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ 
              color: '#666',
              fontSize: '14px',
              fontWeight: 500,
              mb: 2,
              textTransform: 'uppercase'
            }}>
              DOING BUSINESS TOGETHER
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link to="/solutions" style={{ color: '#999', textDecoration: 'none' }}>Solutions</Link>
              <Link to="/local-information" style={{ color: '#999', textDecoration: 'none' }}>Local information</Link>
              <Link to="/e-business" style={{ color: '#999', textDecoration: 'none' }}>E-Business</Link>
              <Link to="/sustainability" style={{ color: '#999', textDecoration: 'none' }}>Sustainability</Link>
              <Link to="/my-account" style={{ color: '#999', textDecoration: 'none' }}>myOceanOracle</Link>
            </Box>
          </Grid>

          {/* Customer Support Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ 
              color: '#666',
              fontSize: '14px',
              fontWeight: 500,
              mb: 2,
              textTransform: 'uppercase'
            }}>
              CUSTOMER SUPPORT
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link to="/support" style={{ color: '#999', textDecoration: 'none' }}>Support Center</Link>
              <Link to="/support?tab=faq" style={{ color: '#999', textDecoration: 'none' }}>FAQs</Link>
              <Link to="/support?tab=documentation" style={{ color: '#999', textDecoration: 'none' }}>Documentation</Link>
              <Link to="/support?tab=ticket" style={{ color: '#999', textDecoration: 'none' }}>Submit a Ticket</Link>
              <Link to="/support?tab=chat" style={{ color: '#999', textDecoration: 'none' }}>Live Chat</Link>
              <Link to="/contact" style={{ color: '#999', textDecoration: 'none' }}>Contact us</Link>
              <Link to="/preferences" style={{ color: '#999', textDecoration: 'none' }}>Preference Center</Link>
            </Box>
          </Grid>
        </Grid>

        {/* Social Media Icons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: 2,
          mt: 4,
          borderTop: '1px solid #333',
          pt: 2
        }}>
          <Link to="#" style={{ color: '#999' }}><FaFacebookF /></Link>
          <Link to="#" style={{ color: '#999' }}><FaTwitter /></Link>
          <Link to="#" style={{ color: '#999' }}><FaInstagram /></Link>
          <Link to="#" style={{ color: '#999' }}><FaLinkedin /></Link>
          <Link to="#" style={{ color: '#999' }}><FaYoutube /></Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;