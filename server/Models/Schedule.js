const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  shipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ship',
    required: true
  },
  startingPort: {
    type: String,
    required: true
  },
  intermediatePorts: {
    type: [String],
    required: true
  },
  destinationPort: {
    type: String,
    required: true
  },
  currentLocation: {
    type: String,
    required: true
  },
  eta: {
    type: Date,
    required: true
  },
  etd: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
