import { NextResponse } from 'next/server';
import { enqueueReceipt } from '../../../lib/deliveryQueue';

// Simulate random delivery delay between 200-800ms
const getRandomDelay = () => Math.floor(Math.random() * (800 - 200 + 1)) + 200;

// Simulate 90% success rate
const isDeliverySuccessful = () => Math.random() < 0.9;

export async function POST(request) {
  try {
    const { userId, campaignId, message } = await request.json();

    if (!userId || !campaignId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simulate delivery delay
    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

    // Simulate random success/failure
    const isSuccess = isDeliverySuccessful();
    const status = isSuccess ? 'SENT' : 'FAILED';

    // Queue the delivery receipt
    enqueueReceipt({ userId, campaignId, status });

    return NextResponse.json({
      success: true,
      status,
      message: isSuccess ? 'Message delivered successfully' : 'Message delivery failed',
    });
  } catch (error) {
    console.error('Error in vendor send endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process message delivery' },
      { status: 500 }
    );
  }
} 