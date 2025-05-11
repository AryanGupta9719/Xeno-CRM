import mongoose from 'mongoose';

const deliveryLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['sent', 'failed'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  error: {
    type: String,
    default: null,
  }
});

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  objective: {
    type: String,
    required: true,
    enum: ['awareness', 'conversion', 'retention', 'feedback'],
  },
  segment: {
    type: String,
    required: true,
  },
  audienceRules: [{
    rules: [{
      field: String,
      operator: String,
      value: String,
    }],
  }],
  messageVariants: [{
    content: String,
    type: {
      type: String,
      enum: ['text', 'image', 'video'],
    },
  }],
  tag: {
    type: String,
    enum: [
      'Win-back',
      'High-Value Customers',
      'New Customers',
      'Engagement',
      'Loyalty',
      'Seasonal',
      'Feedback',
      'Cart Abandonment',
      'General'
    ],
    default: 'General',
  },
  status: {
    type: String,
    enum: ['draft', 'sending', 'completed', 'failed'],
    default: 'draft',
  },
  totalAudienceCount: {
    type: Number,
    default: 0,
  },
  deliveryStats: {
    sent: {
      type: Number,
      default: 0,
    },
    failed: {
      type: Number,
      default: 0,
    },
  },
  deliveryLogs: [deliveryLogSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
campaignSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema); 