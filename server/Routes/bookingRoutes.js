const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController');

// Add create booking route that matches the client endpoint
router.post('/create', bookingController.createBooking);

router.post('/bookings', bookingController.createBooking);

router.get('/bookings', bookingController.getAllBookings);

router.get('/bookings/:id', bookingController.getBookingById);

// Add update route
router.put('/bookings/:id', bookingController.updateBooking);

module.exports = router;
