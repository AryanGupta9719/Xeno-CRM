import { NextResponse } from 'next/server'
import { Campaign } from '@/models/campaign'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose from 'mongoose'

// Simulate sending to users in a segment
async function simulateDelivery(campaignId: string) {
  const db = await connectToDatabase()
  
  // Convert string ID to ObjectId
  const objectId = new mongoose.Types.ObjectId(campaignId)
  const campaign = await Campaign.findById(objectId)
  
  if (!campaign) {
    throw new Error('Campaign not found')
  }

  // Simulate audience size between 100-1000 users
  const audienceSize = Math.floor(Math.random() * 900) + 100
  
  // Initialize delivery stats
  let sent = 0
  let failed = 0
  const deliveryLogs = []
  
  // Update campaign status to sending
  await Campaign.findByIdAndUpdate(objectId, {
    status: 'sending',
    totalAudienceCount: audienceSize,
    deliveryStats: { sent, failed },
    deliveryLogs: []
  })

  // Simulate delivery to each user
  for (let i = 0; i < audienceSize; i++) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate a random user ID
    const userId = `user_${Math.random().toString(36).substr(2, 9)}`
    
    // Randomly mark as sent or failed (90% success rate)
    const success = Math.random() < 0.9
    if (success) {
      sent++
      deliveryLogs.push({
        userId,
        status: 'sent',
        timestamp: new Date(),
        error: null
      })
    } else {
      failed++
      deliveryLogs.push({
        userId,
        status: 'failed',
        timestamp: new Date(),
        error: 'Network timeout'
      })
    }
    
    // Update delivery stats and logs every 10 users
    if (i % 10 === 0 || i === audienceSize - 1) {
      await Campaign.findByIdAndUpdate(objectId, {
        deliveryStats: { sent, failed },
        $push: { deliveryLogs: { $each: deliveryLogs.slice(-10) } }
      })
    }
  }

  // Mark campaign as completed
  await Campaign.findByIdAndUpdate(objectId, {
    status: 'completed',
    deliveryStats: { sent, failed }
  })

  return { sent, failed, totalAudienceCount: audienceSize }
}

// In a real application, this would be stored in a database
let campaigns: any[] = []

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Simulate sending process
    const campaign = campaigns.find(c => c._id === id)
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Update campaign status to sending
    campaign.status = 'sending'
    campaign.deliveryStats = {
      sent: 0,
      failed: 0
    }

    // Simulate sending progress with realistic delays
    const totalAudience = campaign.totalAudienceCount || 1000
    const successRate = 0.95 // 95% success rate
    const sent = Math.floor(totalAudience * successRate)
    const failed = totalAudience - sent

    // Simulate delivery time (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update delivery stats
    campaign.deliveryStats = {
      sent,
      failed
    }

    // Update campaign status to completed
    campaign.status = 'completed'

    return NextResponse.json({
      success: true,
      data: {
        campaign,
        totalAudienceCount: totalAudience,
        deliveryStats: campaign.deliveryStats
      }
    })
  } catch (error) {
    console.error('Error sending campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send campaign' },
      { status: 500 }
    )
  }
} 