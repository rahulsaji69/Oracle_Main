import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ScheduledShip.css';
import { useNavigate } from 'react-router-dom';

const ScheduledShip = () => {
  const [fromPort, setFromPort] = useState('');
  const [toPort, setToPort] = useState('');
  const [date, setDate] = useState('');
  const [vesselName, setVesselName] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('point-to-point');
  const [dateError, setDateError] = useState('');
  const [ports, setPorts] = useState([]);
  const navigate = useNavigate();
  console.log(ports);

  console.log(filteredSchedules);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setDate(today);
  }, []);

  const fetchSchedule = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/ships/schedules`);
      setSchedules(response.data);

    } catch (error) {
      setError("Error fetching schedules. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPorts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/port`);
      setPorts(response.data.ports);
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchSchedule();
    fetchPorts()
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    
    const filtered = schedules.filter((schedule) => {
      // Normalize inputs for reliable comparison
      const inputFromPort = fromPort.trim().toLowerCase();
      const inputToPort = toPort.trim().toLowerCase();
  
      // Normalize schedule ports and check each condition
      const scheduleStartingPort = schedule.startingPort?.trim().toLowerCase();
      const scheduleDestinationPort = schedule.destinationPort?.trim().toLowerCase();
      const scheduleIntermediatePorts = schedule.intermediatePorts?.map(port => port.trim().toLowerCase());
  
      // Check if fromPort matches startingPort or any intermediate port
      const matchesFromPort = !fromPort || 
        scheduleStartingPort === inputFromPort || 
        scheduleIntermediatePorts?.includes(inputFromPort);
  
      // Check if toPort matches destinationPort or any intermediate port
      const matchesToPort = !toPort || 
        scheduleDestinationPort === inputToPort || 
        scheduleIntermediatePorts?.includes(inputToPort);
  
      return matchesFromPort && matchesToPort;
    });
  
    console.log("Filtered Schedules:", filtered);
    setFilteredSchedules(filtered);
  };
  
  

  const validateDate = (value) => {
    const selectedDate = new Date(value);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      return "Please select a future date";
    }
    return "";
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    setDateError(validateDate(newDate));
  };

  const handleDateBlur = () => {
    setDateError(validateDate(date));
  };

  const handleSwapPorts = () => {
    setFromPort(toPort);
    setToPort(fromPort);
  };

  const handleBooking = (schedule) => {
    // Navigate to booking form with schedule details as state
    navigate('/ebookings', {
      state: {
        scheduleId: schedule._id,
        originPort: schedule.startingPort,
        destinationPort: schedule.destinationPort,
        preferredShippingDate: schedule.etd,
        preferredCarrier: schedule.shipId?.shipName || '',
        voyageNumber: schedule.voyageNumber
      }
    });
  };

  return (
    <div className="scheduled-ship-container">
      <h1>Schedules</h1>
      <div className="scheduled-ship-search-container">
        <div className="scheduled-ship-tabs">
          {['point-to-point', 'vessel', 'arrivals/departures'].map((tab) => (
            <button
              key={tab}
              className={`scheduled-ship-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch}>
          {activeTab === 'point-to-point' && (
            <>
              <div className="scheduled-ship-input-group">
                <div className="scheduled-ship-input-wrapper">
                  <input
                    className="scheduled-ship-input"
                    type="text"
                    id="fromPort"
                    value={fromPort}
                    onChange={(e) => setFromPort(e.target.value)}
                    placeholder="From Port"
                     list="portOptions"
                    required
                  />
                </div>
                <button type="button" onClick={handleSwapPorts}  className="scheduled-ship-swap-btn">
                  <span className="material-icons">swap_horiz</span>
                </button>
                <div className="scheduled-ship-input-wrapper">
                  <input
                    className="scheduled-ship-input"
                    type="text"
                    id="toPort"
                    value={toPort}
                    onChange={(e) => setToPort(e.target.value)}
                    placeholder="To Port"
                     list="portOptions"
                    required
                  />
                </div>
              </div>
              <div className="scheduled-ship-date-wrapper">
                <input
                  className={`scheduled-ship-input ${dateError ? 'error' : ''}`}
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  onBlur={handleDateBlur}
                  min={today}
                  placeholder={today}
                  required
                />
                {dateError && <span className="error-message">{dateError}</span>}
              </div>

              <datalist id="portOptions">
            {ports.map((port, index) => (
              <option key={index} value={port} />
            ))}
          </datalist>
            </>
          )}
          <button type="submit" id="searchBtn" className="scheduled-ship-search-btn" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
      {error && <p className="scheduled-ship-error-message">{error}</p>}
      {filteredSchedules.length > 0 && (
        <div className="scheduled-ship-results-container">
          <table>
            <thead>
              <tr>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Vessel / Voyage No.</th>
                <th>Estimated Transit Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.map((schedule, index) => (
                <tr key={index}>
                  <td>{new Date(schedule.etd).toLocaleDateString()}</td>
                  <td>{new Date(schedule.eta).toLocaleDateString()}</td>
                  <td>{schedule.shipId?.shipName || 'N/A'} / {schedule.voyageNumber || 'N/A'}</td>
                  <td>{Math.ceil((new Date(schedule.eta) - new Date(schedule.etd)) / (1000 * 60 * 60 * 24))} Days</td>
                  <td>
                    <button id="bookBtn"
                      className="scheduled-ship-book-btn"
                      onClick={() => handleBooking(schedule)}
                    >
                      I'm ready to book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ScheduledShip;
