import mongoose from 'mongoose';

const CommunicationLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  campaignId: { type: String, required: true },
  status: { type: String, enum: ['SENT', 'FAILED'], required: true },
  sentCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

CommunicationLogSchema.index({ userId: 1, campaignId: 1 }, { unique: true });

export const CommunicationLog = mongoose.models.CommunicationLog || mongoose.model('CommunicationLog', CommunicationLogSchema); 