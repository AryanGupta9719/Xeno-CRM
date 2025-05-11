import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const enqueueDeliveryReceipt = async (receipt: {
  campaignId: string;
  userId: string;
  status: 'delivered' | 'failed';
  timestamp: string;
}) => {
  try {
    await redis.lpush('delivery-receipts', JSON.stringify(receipt));
    return { success: true };
  } catch (error) {
    console.error('Error enqueueing delivery receipt:', error);
    return { success: false, error: 'Failed to enqueue delivery receipt' };
  }
};

export const processDeliveryReceipts = async () => {
  try {
    const receipt = await redis.rpop('delivery-receipts');
    if (receipt) {
      const parsedReceipt = JSON.parse(receipt);
      // Process the receipt (e.g., update campaign stats)
      return { success: true, receipt: parsedReceipt };
    }
    return { success: true, receipt: null };
  } catch (error) {
    console.error('Error processing delivery receipt:', error);
    return { success: false, error: 'Failed to process delivery receipt' };
  }
}; 