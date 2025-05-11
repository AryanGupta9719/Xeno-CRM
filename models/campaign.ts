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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  segment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'sending', 'completed', 'failed'],
    default: 'draft',
  },
  messageVariants: [{
    content: String,
    type: {
      type: String,
      enum: ['email', 'sms', 'push'],
      default: 'email',
    },
  }],
  audienceRules: {
    segment: String,
    conditions: [{
      field: String,
      operator: String,
      value: String,
    }],
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
  tag: String,
  objective: String,
  description: String,
  deliveryLogs: [deliveryLogSchema],
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