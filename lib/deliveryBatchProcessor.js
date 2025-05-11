import { dequeueAllReceipts, getQueueSize } from './deliveryQueue';
import { connectToDatabase } from '@/lib/mongodb';
import { Campaign } from '@/models/Campaign';
import { CommunicationLog } from '@/models/CommunicationLog';

async function processBatch() {
  const batch = dequeueAllReceipts();
  if (batch.length === 0) return;

  console.log(`[Batch] Processing ${batch.length} delivery receipts...`);
  
  try {
    await connectToDatabase();

    const campaignStats = {};
    const communicationLogs = [];

    for (const { userId, campaignId, status } of batch) {
      communicationLogs.push({
        updateOne: {
          filter: { userId, campaignId },
          update: {
            $set: { status, lastUpdated: new Date() },
            $inc: { 
              sentCount: status === 'SENT' ? 1 : 0,
              failedCount: status === 'FAILED' ? 1 : 0
            }
          },
          upsert: true
        }
      });

      if (!campaignStats[campaignId]) {
        campaignStats[campaignId] = { sent: 0, failed: 0 };
      }
      if (status === 'SENT') {
        campaignStats[campaignId].sent += 1;
      } else {
        campaignStats[campaignId].failed += 1;
      }
    }

    if (communicationLogs.length > 0) {
      await CommunicationLog.bulkWrite(communicationLogs);
    }

    for (const [campaignId, stats] of Object.entries(campaignStats)) {
      await Campaign.findByIdAndUpdate(
        campaignId,
        {
          $inc: {
            'deliveryStats.sent': stats.sent,
            'deliveryStats.failed': stats.failed
          }
        }
      );
    }

    console.log(`[Batch] Successfully processed ${batch.length} receipts`);
  } catch (error) {
    console.error('[Batch] Error processing receipts:', error);
  }
}

let processingInterval;

export function startBatchProcessing() {
  if (processingInterval) {
    clearInterval(processingInterval);
  }

  processingInterval = setInterval(async () => {
    await processBatch();
  }, 10000);
}

export function stopBatchProcessing() {
  if (processingInterval) {
    clearInterval(processingInterval);
    processingInterval = null;
  }
} 