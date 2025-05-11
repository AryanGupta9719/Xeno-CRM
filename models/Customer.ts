import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  totalSpend: {
    type: Number,
    default: 0
  },
  visitCount: {
    type: Number,
    default: 0
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  daysInactive: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update daysInactive before saving
customerSchema.pre('save', function(next) {
  const now = new Date();
  const lastVisit = this.lastVisit || now;
  const diffTime = Math.abs(now.getTime() - lastVisit.getTime());
  this.daysInactive = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  this.updatedAt = now;
  next();
});

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

export default Customer; 