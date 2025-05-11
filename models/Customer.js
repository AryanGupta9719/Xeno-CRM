const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  totalSpend: {
    type: Number,
    default: 0,
    min: [0, 'Total spend cannot be negative']
  },
  visitCount: {
    type: Number,
    default: 0,
    min: [0, 'Visit count cannot be negative']
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

module.exports = Customer; 