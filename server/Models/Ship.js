const mongoose = require('mongoose');

const ShipSchema = new mongoose.Schema({
  shipName: {
    type: String,
    required: true,
  },
  imoNumber: {
    type: String,
  },
  shipType: {
    type: String,
  },
  flag: {
    type: String,
  },
  cargoCapacity: {
    type: Number,
  },
  loa: {
    type: Number,
  },
  draft: {
    type: Number,
  },
  beam: {
    type: Number,
  },
  inspectionStatus: {
    type: String,
  },
  // Carbon emission related fields
  emissionClass: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F'],
    default: 'C'
  },
  emissionRatePerMile: {
    type: Number,
    default: 33 // Default average CO2 emission in kg per nautical mile
  },
  fuelType: {
    type: String,
    enum: ['Heavy Fuel Oil', 'Marine Diesel Oil', 'Liquefied Natural Gas', 'Biofuel', 'Hybrid'],
    default: 'Marine Diesel Oil'
  },
  greenTechnologyEquipped: [{
    type: String,
    enum: ['Solar Panels', 'Wind Assistance', 'Shore Power Connection', 'Exhaust Gas Cleaning', 'Energy Recovery Systems', 'None']
  }]
}, {
  timestamps: true 
});

module.exports = mongoose.model('Ship', ShipSchema);
