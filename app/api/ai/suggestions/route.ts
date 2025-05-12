import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Campaign from '@/models/campaign'

export async function GET() {
  try {
    await connectDB()

    // Get campaign statistics for suggestions
    const inactiveThreshold = new Date()
    inactiveThreshold.setDate(inactiveThreshold.getDate() - 30)

    const inactiveSubscribers = await Campaign.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $lt: inactiveThreshold }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: '$totalAudienceCount' }
        }
      }
    ])

    // Get best performing time
    const campaignsByDay = await Campaign.aggregate([
      {
        $match: {
          status: 'completed',
          'deliveryStats.opens': { $gt: 0 }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          avgOpenRate: {
            $avg: {
              $divide: ['$deliveryStats.opens', '$deliveryStats.sent']
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { avgOpenRate: -1 }
      }
    ])

    const bestDay = campaignsByDay[0]?._id
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const bestDayName = dayNames[bestDay - 1] || 'Tuesday'

    // Generate suggestions
    const suggestions = [
      {
        id: "1",
        title: "Optimal Send Time",
        icon: "Clock",
        content: `Based on past engagement, ${bestDayName} at 10:00 AM is the optimal time to send your next campaign to maximize open rates.`,
        action: "Schedule Campaign",
        color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
      },
      {
        id: "2",
        title: "Re-engagement Campaign",
        icon: "MessageSquare",
        content: `We've detected ${inactiveSubscribers[0]?.count?.toLocaleString() || 0} inactive subscribers. Consider sending a re-engagement campaign with a special offer.`,
        action: "Create Campaign",
        color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
      },
      {
        id: "3",
        title: "Segment Opportunity",
        icon: "Users",
        content: "Create a new segment for customers who purchased in the last 30 days but haven't subscribed to your newsletter.",
        action: "Create Segment",
        color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
      },
    ]

    return NextResponse.json({ success: true, suggestions })
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch suggestions' },
      { status: 500 }
    )
  }
} 