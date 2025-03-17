const mongoose = require('mongoose');

const portSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    unique: true 
  },
  ports: [{
    type: String,
    required: true
  }]
});

module.exports = mongoose.model('Port', portSchema);
