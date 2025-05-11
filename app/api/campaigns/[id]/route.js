import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Campaign } from '@/models/Campaign';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      campaign: {
        ...campaign.toObject(),
        id: campaign._id
      }
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
} 