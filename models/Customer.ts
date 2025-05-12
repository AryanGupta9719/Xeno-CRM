import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const customerSchema = new mongoose.Schema({
  customerId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => nanoid(10)
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  segment: { type: String },
  tags: [{ type: String }],
  metadata: { type: mongoose.Schema.Types.Mixed },
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for better query performance
customerSchema.index({ customerId: 1 });
customerSchema.index({ email: 1 });
customerSchema.index({ segment: 1 });
customerSchema.index({ createdAt: -1 });

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