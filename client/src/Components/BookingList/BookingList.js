import axios from 'axios';
import React, { useState, useEffect } from 'react';

function BookingList() {
    const [bookings, setBookings] = useState([]);
    
    const fetchBookings = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/booking/bookings`);
            setBookings(response.data.data); // Set the fetched booking data
        } catch(error) {
            console.error(error);
        }
    }

    useEffect(() => {
     fetchBookings();
    }, []);

  return (
    <div>

        {bookings.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Shipper Name</th>
                <th>Receiver Name</th>
                <th>Origin Port</th>
                <th>Destination Port</th>
                <th>Cargo Type</th>
                <th>Cargo Weight</th>
                <th>Shipping Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.shipperName}</td>
                  <td>{booking.receiverName}</td>
                  <td>{booking.originPort}</td>
                  <td>{booking.destinationPort}</td>
                  <td>{booking.cargoType}</td>
                  <td>{booking.cargoWeight}</td>
                  <td>{new Date(booking.preferredShippingDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings found.</p>
        )}
    </div>
  );
}

export default BookingList;
