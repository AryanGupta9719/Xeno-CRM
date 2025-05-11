import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

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
    required: true
  },
  objective: {
    type: String,
    required: true
  },
  segment: {
    type: String,
    required: true
  },
  messageVariants: [{
    id: String,
    content: String
  }],
  audienceRules: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'draft', 'sending', 'completed', 'failed'],
    default: 'pending'
  },
  totalAudienceCount: {
    type: Number,
    default: 0
  },
  deliveryStats: {
    type: deliveryStatsSchema,
    default: () => ({})
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
campaignSchema.index({ status: 1 });
campaignSchema.index({ createdAt: -1 });

// Add a method to update delivery stats
campaignSchema.methods.updateDeliveryStats = async function(sent = 0, failed = 0) {
  this.deliveryStats.sent += sent;
  this.deliveryStats.failed += failed;
  return this.save();
};

// Add a method to update status
campaignSchema.methods.updateStatus = async function(status) {
  this.status = status;
  return this.save();
};

// Add a method to update audience count
campaignSchema.methods.updateAudienceCount = async function(count) {
  this.totalAudienceCount = count;
  return this.save();
};

export const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema); 