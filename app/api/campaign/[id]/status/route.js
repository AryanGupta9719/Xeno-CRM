import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Campaign from '../../../../models/campaign';

// Define valid status transitions
const validTransitions = {
  draft: ['pending', 'active'],
  pending: ['active', 'failed'],
  active: ['completed', 'failed'],
  completed: [], // Terminal state
  failed: ['pending', 'active'] // Allow retry
};

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = Object.keys(validTransitions);
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid status',
          validStatuses 
        },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Get current campaign state
    const currentCampaign = await Campaign.findById(id);
    if (!currentCampaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Validate status transition
    const currentStatus = currentCampaign.status;
    if (!validTransitions[currentStatus].includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot transition from ${currentStatus} to ${status}`,
          validTransitions: validTransitions[currentStatus]
        },
        { status: 400 }
      );
    }

    // Update campaign with status change and audit log
    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { 
        status,
        $push: {
          statusHistory: {
            from: currentStatus,
            to: status,
            timestamp: new Date(),
            reason: 'Manual status update'
          }
        }
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ 
      success: true, 
      campaign: {
        ...campaign.toObject(),
        id: campaign.campaignId
      }
    });
  } catch (error) {
    console.error('Error updating campaign status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update campaign status' },
      { status: 500 }
    );
  }
} 