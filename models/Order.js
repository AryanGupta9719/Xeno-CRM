const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required']
  },
  orderValue: {
    type: Number,
    required: [true, 'Order value is required'],
    min: [0, 'Order value cannot be negative']
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order; 