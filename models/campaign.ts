import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

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

const deliveryStatsSchema = new mongoose.Schema({
  sent: {
    type: Number,
    default: 0
  },
  failed: {
    type: Number,
    default: 0
  }
}, { _id: false });

const campaignSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    unique: true,
    default: () => nanoid(10)
  },
  name: {
    type: String,
    required: true,
  },
  objective: {
    type: String,
    required: true
  },
  segment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'sending', 'completed', 'failed'],
    default: 'draft',
  },
  messageVariants: [{
    id: String,
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
    type: deliveryStatsSchema,
    default: () => ({})
  },
  tag: String,
  description: String,
  deliveryLogs: [deliveryLogSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

// Add indexes for better query performance
campaignSchema.index({ status: 1 });
campaignSchema.index({ createdAt: -1 });

// Update the updatedAt timestamp before saving
campaignSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add a method to update delivery stats
campaignSchema.methods.updateDeliveryStats = async function(sent = 0, failed = 0) {
  this.deliveryStats.sent += sent;
  this.deliveryStats.failed += failed;
  return this.save();
};

// Add a method to update status
campaignSchema.methods.updateStatus = async function(status: string) {
  this.status = status;
  return this.save();
};

// Add a method to update audience count
campaignSchema.methods.updateAudienceCount = async function(count: number) {
  this.totalAudienceCount = count;
  return this.save();
};

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);

export default Campaign; 