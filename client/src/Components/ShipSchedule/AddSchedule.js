import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  MenuItem 
} from '@mui/material';

const AddSchedule = ({ open, onClose, onScheduleAdded }) => {
  const [ships, setShips] = useState([]);
  const [scheduleData, setScheduleData] = useState({
    shipId: '',
    startingPort: '',
    intermediatePorts: '',
    destinationPort: '',
    currentLocation: '',
    eta: '',
    etd: ''
  });
  const Base_URL = process.env.REACT_APP_BASE_URL;

  // Fetch ships when component mounts
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({ ...scheduleData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${Base_URL}/api/ships/schedules`, scheduleData);
      onScheduleAdded(); // Notify parent component
      onClose(); // Close the dialog
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Ship Schedule</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Select Ship"
          name="shipId"
          fullWidth
          value={scheduleData.shipId}
          onChange={handleChange}
          margin="dense"
        >
          {ships.map((ship) => (
            <MenuItem key={ship._id} value={ship._id}>
              {ship.shipName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Starting Port"
          name="startingPort"
          fullWidth
          value={scheduleData.startingPort}
          onChange={handleChange}
        />
        <TextField
          label="Intermediate Ports (comma separated)"
          name="intermediatePorts"
          fullWidth
          value={scheduleData.intermediatePorts}
          onChange={handleChange}
        />
        <TextField
          label="Destination Port"
          name="destinationPort"
          fullWidth
          value={scheduleData.destinationPort}
          onChange={handleChange}
        />
        <TextField
          label="Current Location"
          name="currentLocation"
          fullWidth
          value={scheduleData.currentLocation}
          onChange={handleChange}
        />
        <TextField
          label="ETA"
          name="eta"
          type="datetime-local"
          fullWidth
          value={scheduleData.eta}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min steps
          }}
        />
        <TextField
          label="ETD"
          name="etd"
          type="datetime-local"
          fullWidth
          value={scheduleData.etd}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min steps
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Add Schedule</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSchedule;
