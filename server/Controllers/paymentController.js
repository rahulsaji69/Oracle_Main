const Payment = require('../Models/Payment');
const Booking = require('../Models/Bookings');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

// Check if keys are loaded
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Razorpay keys are not set in environment variables');
  process.exit(1);
}

// Initialize Razorpay with keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Make sure to export all controller functions
const paymentController = {
  createOrder: async (req, res) => {
    try {
      const { amount, bookingId } = req.body;
      console.log('Creating order with amount:', amount);

      const options = {
        amount: amount ,
        currency: "INR",
        receipt: bookingId,
      };

      const order = await razorpay.orders.create(options);
      console.log('Order created:', order);

      res.status(200).json({
        success: true,
        order
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating payment order',
        error: error.message
      });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const { bookingId, paymentId, orderId, signature, amount } = req.body;

      // Verify signature
      const body = orderId + "|" + paymentId;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== signature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature'
        });
      }

      // Create payment record
      const payment = new Payment({
        bookingId,
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        razorpaySignature: signature,
        amount,
        status: 'completed'
      });

      await payment.save();

      // Update booking status
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        paymentId: payment._id
      });

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        payment
      });

    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({
        success: false,
        message: 'Error verifying payment',
        error: error.message
      });
    }
  },

  getPaymentsByBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const payments = await Payment.find({ bookingId });
      
      res.status(200).json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching payments',
        error: error.message
      });
    }
  }
};

module.exports = paymentController; 