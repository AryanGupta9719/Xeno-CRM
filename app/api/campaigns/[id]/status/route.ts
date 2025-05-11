import { NextResponse } from 'next/server'

// In a real application, this would be stored in a database
const sampleCampaigns = [
  {
    _id: "1",
    name: "Summer Sale Announcement",
    createdAt: "2024-03-15T10:00:00Z",
    segment: "All Customers",
    status: "sending",
    messageVariants: [
      {
        content: "🎉 Summer Sale is here! Get up to 50% off on selected items. Use code SUMMER50 at checkout.",
        type: "email"
      }
    ],
    audienceRules: {
      segment: "All Customers",
      conditions: []
    },
    totalAudienceCount: 12500,
    deliveryStats: {
      sent: 12375,
      failed: 125
    },
    tag: "Seasonal",
    objective: "Promote summer sale",
    description: "Announcing our biggest summer sale of the year"
  }
]

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status } = await request.json()

    // Validate status
    const validStatuses = ['draft', 'sending', 'completed', 'failed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    // In a real application, this would update the database
    const campaign = sampleCampaigns.find(c => c._id === id)
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Update status
    campaign.status = status

    // If status is completed, ensure delivery stats are final
    if (status === 'completed') {
      campaign.deliveryStats = {
        sent: campaign.totalAudienceCount - campaign.deliveryStats.failed,
        failed: campaign.deliveryStats.failed
      }
    }

    return NextResponse.json({
      success: true,
      data: { campaign }
    })
  } catch (error) {
    console.error('Error updating campaign status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update campaign status' },
      { status: 500 }
    )
  }
} 