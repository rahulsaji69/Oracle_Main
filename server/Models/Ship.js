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
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Ship', ShipSchema);
