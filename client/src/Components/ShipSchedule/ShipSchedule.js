import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
 
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AddSchedule from "./AddSchedule";
import axios from "axios";
import "./ShipSchedule.css";

const ShipSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isAddScheduleDialogOpen, setIsAddScheduleDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updatedScheduleData, setUpdatedScheduleData] = useState({});
  const Base_URL = process.env.REACT_APP_BASE_URL;

  const handleAddScheduleClick = () => {
    setIsAddScheduleDialogOpen(true);
  };

  const handleScheduleAdded = () => {
    console.log("Schedule added successfully");
    fetchSchedules();
  };

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${Base_URL}/api/ships/schedules`);
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [Base_URL]);

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleUpdateClick = () => {
    setUpdatedScheduleData(selectedSchedule);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateClose = () => {
    setIsUpdateDialogOpen(false);
  };

  const handleUpdateSave = async () => {
    try {
      await axios.put(`${Base_URL}/api/ships/schedules/${updatedScheduleData._id}`, updatedScheduleData);
      setSelectedSchedule(updatedScheduleData);
      setIsUpdateDialogOpen(false);
      fetchSchedules();
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedScheduleData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="ship-schedule">
      <Typography variant="h4" className="page-title">
        Ship Schedules
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddScheduleClick}
        className="add-schedule-btn"
      >
        Add Schedule
      </Button>

      <div className="schedule-container">
        <List className="ship-list">
          {schedules.map((schedule) => (
            <ListItem
              key={schedule._id}
              button
              onClick={() => handleScheduleClick(schedule)}
              selected={selectedSchedule && selectedSchedule._id === schedule._id}
            >
              <ListItemText primary={schedule.shipId?.shipName || "N/A"} />
            </ListItem>
          ))}
        </List>

        {selectedSchedule && (
          <div className="ship-details">
            <Typography variant="h5">{selectedSchedule.shipId?.shipName || "N/A"}</Typography>
            <Typography>Starting Port: {selectedSchedule.startingPort}</Typography>
            <Typography>Destination Port: {selectedSchedule.destinationPort}</Typography>
            <Typography>Current Location: {selectedSchedule.currentLocation}</Typography>
            <Typography>ETA: {new Date(selectedSchedule.eta).toLocaleString()}</Typography>
            <Typography>ETD: {new Date(selectedSchedule.etd).toLocaleString()}</Typography>

            <Stepper activeStep={-1} orientation="vertical" className="custom-stepper">
              <Step key="start">
                <StepLabel StepIconComponent={CustomStepIcon}>{selectedSchedule.startingPort}</StepLabel>
              </Step>
              {selectedSchedule.intermediatePorts.map((port, index) => (
                <Step key={index}>
                  <StepLabel StepIconComponent={CustomStepIcon}>{port}</StepLabel>
                </Step>
              ))}
              <Step key="end">
                <StepLabel StepIconComponent={CustomStepIcon}>{selectedSchedule.destinationPort}</StepLabel>
              </Step>
            </Stepper>

            <Button variant="contained" color="primary" onClick={handleUpdateClick}>
              Update Details
            </Button>
          </div>
        )}
      </div>

      <AddSchedule
        open={isAddScheduleDialogOpen}
        onClose={() => setIsAddScheduleDialogOpen(false)}
        onScheduleAdded={handleScheduleAdded}
      />

      <Dialog open={isUpdateDialogOpen} onClose={handleUpdateClose}>
        <DialogTitle>Update Schedule Details</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="currentLocation"
            label="Current Location"
            type="text"
            fullWidth
            value={updatedScheduleData.currentLocation || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="eta"
            label="Estimated Time of Arrival"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={updatedScheduleData.eta ? updatedScheduleData.eta.slice(0, 16) : ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="etd"
            label="Estimated Time of Departure"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={updatedScheduleData.etd ? updatedScheduleData.etd.slice(0, 16) : ''}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Custom StepIcon component to display numbers
const CustomStepIcon = ({ active, completed, icon }) => {
  return (
    <div className={`custom-step-icon ${active ? 'active' : ''} ${completed ? 'completed' : ''}`}>
      {icon}
    </div>
  );
};

export default ShipSchedule;
