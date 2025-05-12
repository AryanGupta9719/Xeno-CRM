import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const deliveryLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  status: { type: String, required: true },
  details: { type: String },
  recipient: { type: String },
  messageId: { type: String }
});

const deliveryStatsSchema = new mongoose.Schema({
  total: { type: Number, default: 0 },
  sent: { type: Number, default: 0 },
  delivered: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  pending: { type: Number, default: 0 }
});

const campaignSchema = new mongoose.Schema({
  campaignId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => nanoid(10)
  },
  name: { type: String, required: true },
  objective: { type: String, required: true },
  segment: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'scheduled', 'running', 'paused', 'completed', 'failed'],
    default: 'draft'
  },
  messageVariants: [{
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
    mediaUrl: { type: String },
    weight: { type: Number, default: 1 }
  }],
  audienceRules: {
    type: { type: String, enum: ['all', 'segment', 'custom'], default: 'all' },
    segmentId: { type: String },
    customRules: { type: mongoose.Schema.Types.Mixed }
  },
  totalAudienceCount: { type: Number, default: 0 },
  deliveryStats: { type: deliveryStatsSchema, default: () => ({}) },
  tag: { type: String },
  description: { type: String },
  deliveryLogs: [deliveryLogSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add methods to update delivery stats
campaignSchema.methods.updateDeliveryStats = function(stats: any) {
  this.deliveryStats = { ...this.deliveryStats, ...stats };
  return this.save();
};

// Add method to update status
campaignSchema.methods.updateStatus = function(status: string) {
  this.status = status;
  return this.save();
};

// Add method to update audience count
campaignSchema.methods.updateAudienceCount = function(count: number) {
  this.totalAudienceCount = count;
  return this.save();
};

// Add indexes for better query performance
campaignSchema.index({ campaignId: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ createdAt: -1 });

// Add pre-save hook to update updatedAt timestamp
campaignSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);

export default Campaign; 