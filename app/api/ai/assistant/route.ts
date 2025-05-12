import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Campaign from '@/models/campaign'

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    await connectDB()

    // Get campaign statistics for context
    const totalCampaigns = await Campaign.countDocuments()
    const completedCampaigns = await Campaign.countDocuments({ status: 'completed' })
    const totalRecipients = await Campaign.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAudienceCount' } } }
    ])

    // Get latest campaign for context
    const latestCampaign = await Campaign.findOne()
      .sort({ createdAt: -1 })
      .lean()

    // Simple response generation based on message content
    let response = "I'm not sure how to help with that. Could you please rephrase your question?"

    if (message.toLowerCase().includes('campaign')) {
      if (message.toLowerCase().includes('how many')) {
        response = `You have sent ${totalCampaigns} campaigns in total, with ${completedCampaigns} completed successfully.`
      } else if (message.toLowerCase().includes('latest')) {
        response = latestCampaign 
          ? `Your latest campaign was sent to ${(latestCampaign as any).totalAudienceCount?.toLocaleString()} recipients with a ${(((latestCampaign as any).deliveryStats?.sent || 0) / ((latestCampaign as any).totalAudienceCount || 1) * 100).toFixed(1)}% delivery rate.`
          : "You haven't sent any campaigns yet."
      }
    } else if (message.toLowerCase().includes('subscriber') || message.toLowerCase().includes('recipient')) {
      response = `Your campaigns have reached ${totalRecipients[0]?.total?.toLocaleString() || 0} recipients in total.`
    } else if (message.toLowerCase().includes('help') || message.toLowerCase().includes('what can you do')) {
      response = "I can help you with campaign statistics, subscriber information, and provide insights about your email marketing performance. Just ask me about your campaigns, subscribers, or performance metrics!"
    }

    return NextResponse.json({ success: true, response })
  } catch (error) {
    console.error('Error processing AI assistant request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 