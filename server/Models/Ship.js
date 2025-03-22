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
  // Emission related data
  emissionClass: {
    type: Number, // 1-5, where 1 is best (lowest emissions)
    default: 3,
  },
  fuelType: {
    type: String,
    enum: ['Heavy Fuel Oil', 'Marine Diesel Oil', 'Liquefied Natural Gas', 'Biofuel', 'Hybrid'],
    default: 'Marine Diesel Oil'
  },
  fuelEfficiency: {
    type: Number, // grams of fuel per ton-mile
  },
  co2PerTonMile: {
    type: Number, // kg of CO2 per ton-mile
  },
  greenTechnologyEquipped: [{
    type: String,
    enum: ['Wind Assist', 'Solar Panels', 'Hull Optimization', 'Battery Systems', 'Waste Heat Recovery']
  }],
  emissionsHistory: [{
    date: Date,
    totalEmissions: Number, // kg of CO2
    distance: Number, // miles
    cargoWeight: Number, // tons
    emissionEfficiency: Number // kg CO2 per ton-mile
  }]
}, {
  timestamps: true 
});

module.exports = mongoose.model('Ship', ShipSchema);
