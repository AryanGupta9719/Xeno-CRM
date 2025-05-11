import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const newCampaign = {
      _id: uuidv4(),
      name: body.name || 'New Campaign',
      createdAt: new Date().toISOString(),
      segment: body.segment || 'All Customers',
      status: 'draft',
      messageVariants: body.messageVariants || [
        {
          content: "🎉 Welcome to our new campaign!",
          type: "email"
        }
      ],
      audienceRules: body.audienceRules || {
        segment: "All Customers",
        conditions: [
          {
            field: "last_purchase",
            operator: "less_than",
            value: "30"
          }
        ]
      },
      totalAudienceCount: body.totalAudienceCount || 1000,
      deliveryStats: {
        sent: 0,
        failed: 0
      },
      tag: body.tag || 'General',
      objective: body.objective || 'General communication',
      description: body.description || 'New campaign'
    }

    return NextResponse.json({
      success: true,
      data: { campaign: newCampaign }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
} 