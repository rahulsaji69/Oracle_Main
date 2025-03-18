import React, { useState, useEffect } from 'react';
import './ShippingRepDashboard.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const ShippingRepDashboard = () => {
  const [activeTab, setActiveTab] = useState('vessels');
  const [vessels, setVessels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const Base_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'vessels') {
        const response = await axios.get(`${Base_URL}/api/ships`);
        setVessels(response.data);
      } else if (activeTab === 'bookings') {
        const response = await axios.get(`${Base_URL}/api/booking/bookings`);
        setBookings(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Updated function to handle vessel schedule updates
  const handleVesselScheduleUpdate = async (vessel) => {
    try {
      const scheduleDate = vessel.inspectionStatus?.split(' ')[1] || '';
      
      // Make PUT request to update the vessel schedule
      await axios.put(`${Base_URL}/api/ships/${vessel._id}`, {
        ...vessel,
        inspectionStatus: `Passed ${scheduleDate}`
      });

      toast.success('Vessel schedule updated successfully');
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error updating vessel schedule:', error);
      toast.error('Failed to update vessel schedule');
    }
  };

  // Updated function to handle booking status updates
  const handleBookingConfirmation = async (bookingId, newStatus) => {
    try {
      console.log(`Updating booking ${bookingId} to status ${newStatus}`);
      
      // Make PUT request to update booking status
      const response = await axios.put(`${Base_URL}/api/booking/bookings/${bookingId}`, {
        status: newStatus
      });
      
      console.log('Update response:', response.data);

      toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  // Handle date change for vessel schedule
  const handleDateChange = (vesselId, newDate) => {
    setVessels(vessels.map(vessel => 
      vessel._id === vesselId 
        ? { ...vessel, inspectionStatus: `Passed ${newDate}` }
        : vessel
    ));
  };

  return (
    <div className="srep-dashboard">
      <h1 className="srep-title">Shipping Line Representative Dashboard</h1>
      
      <div className="srep-tabs">
        <button 
          className={activeTab === 'vessels' ? 'srep-tab-active' : 'srep-tab'}
          onClick={() => setActiveTab('vessels')}
        >
          Vessel Schedules
        </button>
        <button 
          className={activeTab === 'bookings' ? 'srep-tab-active' : 'srep-tab'}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
      </div>

      {loading ? (
        <div className="srep-loading">Loading...</div>
      ) : (
        <div className="srep-content">
          {activeTab === 'vessels' && (
            <div className="srep-vessels-section">
              <h2 className="srep-section-title">Vessel Schedules</h2>
              <table className="srep-table">
                <thead>
                  <tr>
                    <th className="srep-th">Ship Name</th>
                    <th className="srep-th">IMO Number</th>
                    <th className="srep-th">Ship Type</th>
                    <th className="srep-th">Flag</th>
                    <th className="srep-th">Schedule</th>
                    <th className="srep-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vessels.map(vessel => (
                    <tr key={vessel._id} className="srep-tr">
                      <td className="srep-td">{vessel.shipName}</td>
                      <td className="srep-td">{vessel.imoNumber}</td>
                      <td className="srep-td">{vessel.shipType}</td>
                      <td className="srep-td">{vessel.flag}</td>
                      <td className="srep-td">
                        <input 
                          type="date" 
                          className="srep-input"
                          value={vessel.inspectionStatus?.split(' ')[1] || ''}
                          onChange={(e) => handleDateChange(vessel._id, e.target.value)}
                        />
                      </td>
                      <td className="srep-td">
                        <button 
                          className="srep-btn srep-btn-update"
                          onClick={() => handleVesselScheduleUpdate(vessel)}
                        >
                          Update Schedule
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="srep-bookings-section">
              <h2 className="srep-section-title">Booking Management</h2>
              <table className="srep-table">
                <thead>
                  <tr>
                    <th className="srep-th">Booking ID</th>
                    <th className="srep-th">Shipper Name</th>
                    <th className="srep-th">Route</th>
                    <th className="srep-th">Cargo Type</th>
                    <th className="srep-th">Shipping Date</th>
                    <th className="srep-th">Status</th>
                    <th className="srep-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id} className="srep-tr">
                      <td className="srep-td">{booking._id}</td>
                      <td className="srep-td">{booking.shipperName}</td>
                      <td className="srep-td">{`${booking.originPort} to ${booking.destinationPort}`}</td>
                      <td className="srep-td">{booking.cargoType}</td>
                      <td className="srep-td">{new Date(booking.preferredShippingDate).toLocaleDateString()}</td>
                      <td className="srep-td">
                        <span className={`srep-status-badge srep-status-${(booking.status || 'pending').toLowerCase()}`}>
                          {booking.status || 'PENDING'}
                        </span>
                        {booking.status === 'CUSTOMS_VERIFICATION' && (
                          <span className="srep-status-badge srep-status-customs">
                            In Customs
                          </span>
                        )}
                        {booking.status === 'CUSTOMS_APPROVED' && (
                          <span className="srep-status-badge srep-status-approved">
                            Customs Approved
                          </span>
                        )}
                        {booking.status === 'CUSTOMS_REJECTED' && (
                          <span className="srep-status-badge srep-status-rejected">
                            Customs Rejected
                          </span>
                        )}
                      </td>
                      <td className="srep-td srep-action-buttons">
                        <button 
                          className="srep-btn srep-btn-confirm"
                          onClick={() => handleBookingConfirmation(booking._id, 'CONFIRMED')}
                          disabled={booking.status === 'CONFIRMED' || booking.status === 'CUSTOMS_VERIFICATION' || booking.status === 'CUSTOMS_REJECTED'}
                        >
                          Confirm
                        </button>
                        <button 
                          className="srep-btn srep-btn-reject"
                          onClick={() => handleBookingConfirmation(booking._id, 'REJECTED')}
                          disabled={booking.status === 'REJECTED' || booking.status === 'CONFIRMED'}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShippingRepDashboard; 