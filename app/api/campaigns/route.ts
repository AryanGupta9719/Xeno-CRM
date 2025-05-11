import { NextResponse } from 'next/server'

const sampleCampaigns = [
  {
    _id: "1",
    name: "Summer Sale Announcement",
    createdAt: "2024-03-15T10:00:00Z",
    segment: "All Customers",
    status: "completed",
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
  },
  {
    _id: "2",
    name: "New Product Launch",
    createdAt: "2024-03-10T14:30:00Z",
    segment: "High Value Customers",
    status: "completed",
    messageVariants: [
      {
        content: "✨ Introducing our new premium collection! Be the first to shop with exclusive early access.",
        type: "email"
      }
    ],
    audienceRules: {
      segment: "High Value Customers",
      conditions: []
    },
    totalAudienceCount: 8750,
    deliveryStats: {
      sent: 8645,
      failed: 105
    },
    tag: "High-Value Customers",
    objective: "Product launch",
    description: "Launch of new premium product line"
  },
  {
    _id: "3",
    name: "Customer Feedback Survey",
    createdAt: "2024-03-05T09:15:00Z",
    segment: "Recent Purchasers",
    status: "completed",
    messageVariants: [
      {
        content: "We value your feedback! Take our quick survey and get 10% off your next purchase.",
        type: "email"
      }
    ],
    audienceRules: {
      segment: "Recent Purchasers",
      conditions: []
    },
    totalAudienceCount: 5000,
    deliveryStats: {
      sent: 4875,
      failed: 125
    },
    tag: "Feedback",
    objective: "Collect feedback",
    description: "Gather customer feedback on recent purchases"
  },
  {
    _id: "4",
    name: "Back to School Special",
    createdAt: "2024-03-01T11:20:00Z",
    segment: "Parents Segment",
    status: "completed",
    messageVariants: [
      {
        content: "📚 Back to School Sale! Get 20% off on all school supplies and backpacks.",
        type: "email"
      }
    ],
    audienceRules: {
      segment: "Parents Segment",
      conditions: []
    },
    totalAudienceCount: 7500,
    deliveryStats: {
      sent: 7350,
      failed: 150
    },
    tag: "Seasonal",
    objective: "Promote back to school sale",
    description: "Special offers for back to school season"
  },
  {
    _id: "5",
    name: "Loyalty Program Update",
    createdAt: "2024-02-25T15:45:00Z",
    segment: "Loyalty Members",
    status: "completed",
    messageVariants: [
      {
        content: "🌟 Exciting news! We've enhanced our loyalty program with new rewards and benefits.",
        type: "email"
      }
    ],
    audienceRules: {
      segment: "Loyalty Members",
      conditions: []
    },
    totalAudienceCount: 15000,
    deliveryStats: {
      sent: 14850,
      failed: 150
    },
    tag: "Loyalty",
    objective: "Program update",
    description: "Announcement of loyalty program enhancements"
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        campaigns: sampleCampaigns
      }
    })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
} 