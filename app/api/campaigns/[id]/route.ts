import { NextResponse } from 'next/server';
import { Campaign } from '@/models/campaign';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await Campaign.findById(params.id);
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: { campaign } });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const campaign = await Campaign.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: { campaign } });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await Campaign.findByIdAndDelete(params.id);
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
} 