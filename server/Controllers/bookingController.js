const Booking = require('../Models/Bookings');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/documents';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max file size
}).fields([
  { name: 'billOfLading', maxCount: 1 },
  { name: 'commercialInvoice', maxCount: 1 },
  { name: 'packingList', maxCount: 1 },
  { name: 'customsDocuments', maxCount: 1 },
  { name: 'certificateOfOrigin', maxCount: 1 }
]);

exports.createBooking = async (req, res) => {
  try {
    upload(req, res, async function(err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: 'File upload error',
          error: err.message
        });
      } else if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error creating booking',
          error: err.message
        });
      }

      const bookingData = { ...req.body };
      
      // Process cargoDimensions from JSON string to object
      if (bookingData.cargoDimensions && typeof bookingData.cargoDimensions === 'string') {
        bookingData.cargoDimensions = JSON.parse(bookingData.cargoDimensions);
      }

      // Process additionalServices from JSON string to array
      if (bookingData.additionalServices && typeof bookingData.additionalServices === 'string') {
        bookingData.additionalServices = JSON.parse(bookingData.additionalServices);
      }

      // Convert string number values to actual numbers
      if (bookingData.cargoWeight) bookingData.cargoWeight = Number(bookingData.cargoWeight);
      if (bookingData.cargoQuantity) bookingData.cargoQuantity = Number(bookingData.cargoQuantity);
      if (bookingData.cargoValue) bookingData.cargoValue = Number(bookingData.cargoValue);
      if (bookingData.insuranceValue) bookingData.insuranceValue = Number(bookingData.insuranceValue);
      
      // Convert cargoDimensions values to numbers
      if (bookingData.cargoDimensions) {
        if (bookingData.cargoDimensions.length) bookingData.cargoDimensions.length = Number(bookingData.cargoDimensions.length);
        if (bookingData.cargoDimensions.width) bookingData.cargoDimensions.width = Number(bookingData.cargoDimensions.width);
        if (bookingData.cargoDimensions.height) bookingData.cargoDimensions.height = Number(bookingData.cargoDimensions.height);
      }

      // Convert boolean strings to actual booleans
      if (bookingData.insuranceRequired) bookingData.insuranceRequired = bookingData.insuranceRequired === 'true';
      if (bookingData.isFragile) bookingData.isFragile = bookingData.isFragile === 'true';
      if (bookingData.requiresRefrigeration) bookingData.requiresRefrigeration = bookingData.requiresRefrigeration === 'true';
      if (bookingData.isHazardous) bookingData.isHazardous = bookingData.isHazardous === 'true';

      // Handle file uploads
      const documents = {};
      if (req.files) {
        Object.keys(req.files).forEach(fileType => {
          if (req.files[fileType][0]) {
            documents[fileType] = req.files[fileType][0].path;
          }
        });
        bookingData.documents = documents;
      }

      const newBooking = new Booking(bookingData);
      
      // Set booking status to need customs verification by default
      newBooking.status = 'PENDING';
      newBooking.customsVerificationStatus = 'PENDING';
      
      const savedBooking = await newBooking.save();

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: savedBooking
      });
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Optional: Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Find the booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // If updating the status to involve customs
    if (updateData.status) {
      // If status is being set to CONFIRMED and it's not already approved by customs,
      // automatically route it to customs verification
      if (updateData.status === 'CONFIRMED' && 
          booking.customsVerificationStatus !== 'APPROVED') {
        updateData.status = 'CUSTOMS_VERIFICATION';
        updateData.customsVerificationStatus = 'IN_PROGRESS';
      }
    }

    // If specifically updating customs verification status
    if (updateData.customsVerificationStatus) {
      // If customs approved, update main status accordingly
      if (updateData.customsVerificationStatus === 'APPROVED') {
        // If the main status was waiting on customs, proceed to CONFIRMED
        if (booking.status === 'CUSTOMS_VERIFICATION') {
          updateData.status = 'CUSTOMS_APPROVED';
        }
      } 
      // If customs rejected, update main status
      else if (updateData.customsVerificationStatus === 'REJECTED') {
        updateData.status = 'CUSTOMS_REJECTED';
      }
    }

    // Update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};
