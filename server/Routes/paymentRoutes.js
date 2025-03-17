const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/paymentController');

// Create Razorpay order
router.post('/create-order', paymentController.createOrder);

// Verify payment
router.post('/verify', paymentController.verifyPayment);

// Get payments by booking ID
router.get('/booking/:bookingId', paymentController.getPaymentsByBooking);

module.exports = router; 