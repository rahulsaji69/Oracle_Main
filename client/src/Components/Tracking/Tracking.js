import React, { useState } from 'react';

const ShipmentTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipmentDetails, setShipmentDetails] = useState(null);

  const handleTrackShipment = () => {
    // Simulate API call to fetch tracking data
    const mockData = {
      containerNumber: 'MSC123456789',
      from: 'Shanghai',
      to: 'Los Angeles',
      status: 'In Transit',
      eta: '2024-10-05',
    };
    setShipmentDetails(mockData);
  };

  return (
    <div className="tracking-container">
      <h1>Track a Shipment</h1>
      <input
        type="text"
        placeholder="Enter Bill of Lading or Booking Number"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
      />
      <button onClick={handleTrackShipment}>Track</button>

      {shipmentDetails && (
        <div className="shipment-details">
          <h2>Shipment Details</h2>
          <p>Container Number: {shipmentDetails.containerNumber}</p>
          <p>From: {shipmentDetails.from}</p>
          <p>To: {shipmentDetails.to}</p>
          <p>Status: {shipmentDetails.status}</p>
          <p>ETA: {shipmentDetails.eta}</p>
        </div>
      )}
    </div>
  );
};

export default ShipmentTracking;
