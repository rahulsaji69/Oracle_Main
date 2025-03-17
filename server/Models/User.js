const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  street: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  phone: {
    type: String,
  },
  role: {
    type: String
  },
  status: {
    type: String,
    enum: ['enabled', 'disabled'], 
    default: 'enabled', 
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
