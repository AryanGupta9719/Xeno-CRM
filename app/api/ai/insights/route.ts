import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Campaign } from '@/models/campaign'

export async function GET() {
  try {
    await connectDB()

    // Get the latest campaign
    const latestCampaign = await Campaign.findOne()
      .sort({ createdAt: -1 })
      .lean()

    // Get campaign statistics
    const totalCampaigns = await Campaign.countDocuments()
    const completedCampaigns = await Campaign.countDocuments({ status: 'completed' })
    const totalRecipients = await Campaign.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAudienceCount' } } }
    ])

    // Calculate average open rate
    const campaignsWithStats = await Campaign.find({
      status: 'completed',
      'deliveryStats.sent': { $gt: 0 }
    }).lean()

    const totalSent = campaignsWithStats.reduce((sum, campaign) => 
      sum + (campaign.deliveryStats?.sent || 0), 0)
    const totalOpens = campaignsWithStats.reduce((sum, campaign) => 
      sum + (campaign.deliveryStats?.opens || 0), 0)
    const averageOpenRate = totalSent > 0 ? (totalOpens / totalSent) * 100 : 0

    // Generate insights
    const insights = [
      {
        id: "1",
        title: "Campaign Performance",
        icon: "BarChart3",
        content: latestCampaign && 'totalAudienceCount' in latestCampaign && 'deliveryStats' in latestCampaign
          ? `Your last campaign reached ${latestCampaign.totalAudienceCount?.toLocaleString()} recipients with a ${((latestCampaign.deliveryStats?.sent || 0) / (latestCampaign.totalAudienceCount || 1) * 100).toFixed(1)}% delivery rate. Open rate was ${((latestCampaign.deliveryStats?.opens || 0) / (latestCampaign.deliveryStats?.sent || 1) * 100).toFixed(1)}%, which is ${((latestCampaign.deliveryStats?.opens || 0) / (latestCampaign.deliveryStats?.sent || 1) * 100 - 27.7).toFixed(1)}% higher than industry average.`
          : "No campaigns have been sent yet. Start by creating your first campaign!",
        color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      },
      {
        id: "2",
        title: "Campaign Overview",
        icon: "Tag",
        content: `You've sent ${totalCampaigns} campaigns in total, with ${completedCampaigns} completed successfully. Your campaigns have reached ${totalRecipients[0]?.total?.toLocaleString() || 0} recipients.`,
        color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      },
      {
        id: "3",
        title: "Engagement Metrics",
        icon: "Users",
        content: `Your average open rate across all campaigns is ${averageOpenRate.toFixed(1)}%, which is ${(averageOpenRate - 27.7).toFixed(1)}% higher than the industry average of 27.7%.`,
        color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      },
    ]

    return NextResponse.json({ success: true, insights })
  } catch (error) {
    console.error('Error fetching insights:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
} 