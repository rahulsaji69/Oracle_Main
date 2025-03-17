import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Toolbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './ShipListing.css';

function ShipListing() {
  const [ships, setShips] = useState([]);
  const Base_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShips = async () => {
      try {
        const response = await axios.get(`${Base_URL}/api/ships`);
        setShips(response.data);
      } catch (error) {
        console.error('Error fetching ships:', error);
      }
    };

    fetchShips();
  }, [Base_URL]);

  const handleAddShip = () => {
    navigate('/admin-dashboard/ships-form');
  };

  return (
    <div className="ship-listing-container">
      <Typography variant="h4" component="h2" gutterBottom>
        Ship Listing
      </Typography>
      <Toolbar className="listing-toolbar">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddShip}
        >
          Add New Ship
        </Button>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ship Name</TableCell>
              <TableCell>IMO Number</TableCell>
              <TableCell>Ship Type</TableCell>
              <TableCell>Flag</TableCell>
              <TableCell>Cargo Capacity</TableCell>
              <TableCell>LOA</TableCell>
              <TableCell>Draft</TableCell>
              <TableCell>Beam</TableCell>
              <TableCell>Inspection Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ships.map((ship) => (
              <TableRow key={ship._id}>
                <TableCell>{ship.shipName}</TableCell>
                <TableCell>{ship.imoNumber}</TableCell>
                <TableCell>{ship.shipType}</TableCell>
                <TableCell>{ship.flag}</TableCell>
                <TableCell>{ship.cargoCapacity}</TableCell>
                <TableCell>{ship.loa}</TableCell>
                <TableCell>{ship.draft}</TableCell>
                <TableCell>{ship.beam}</TableCell>
                <TableCell>{ship.inspectionStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ShipListing;
