import { NextResponse } from 'next/server';
import { enqueueDeliveryReceipt } from '@/lib/deliveryQueue';

export async function POST(request) {
  try {
    const { userId, campaignId, status } = await request.json();

    if (!userId || !campaignId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['SENT', 'FAILED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Queue the receipt instead of processing immediately
    enqueueDeliveryReceipt({ userId, campaignId, status });

    return NextResponse.json({
      success: true,
      message: 'Delivery receipt queued successfully',
    });
  } catch (error) {
    console.error('Error queueing delivery receipt:', error);
    return NextResponse.json(
      { error: 'Failed to queue delivery receipt' },
      { status: 500 }
    );
  }
} 