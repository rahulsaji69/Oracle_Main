const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  // Shipper Information
  shipperName: { type: String, required: true },
  shipperPhone: { type: String, required: true },
  shipperEmail: { type: String, required: true },
  shipperAddress: { type: String, required: true },

  // Receiver Information
  receiverName: { type: String, required: true },
  receiverPhone: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  receiverAddress: { type: String, required: true },

  // Cargo Details
  cargoType: { type: String, required: true },
  cargoWeight: { type: Number, required: true },
  cargoDimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  cargoQuantity: { type: Number, required: true },
  cargoValue: { type: Number, required: true },

  // Shipment Type
  serviceType: { type: String, required: true },
  shippingClass: { type: String, required: true },

  // Origin and Destination
  originPort: { type: String, required: true },
  destinationPort: { type: String, required: true },

  // Schedule and Route
  preferredShippingDate: { type: Date, required: true },
  preferredCarrier: { type: String },

  // Insurance
  insuranceRequired: { type: Boolean, default: false },
  insuranceValue: { type: Number },

  // Special Handling
  specialInstructions: { type: String },
  isFragile: { type: Boolean, default: false },
  requiresRefrigeration: { type: Boolean, default: false },
  isHazardous: { type: Boolean, default: false },

  // Payment Information
  paymentMethod: { type: String, required: true },

  // Tracking and Notifications
  trackingPreference: { type: String, required: true },

  // Customs Information
  hsCode: { type: String },
  customsDocuments: [{ type: String }], // Array of document URLs or IDs

  // Additional Services
  additionalServices: [{ type: String }],

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }
}, { timestamps: true });

// Add a pre-save hook to update the 'updatedAt' field
BookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);

