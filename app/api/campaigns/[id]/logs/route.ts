import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Campaign } from '@/models/campaign'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Campaign ID is required' },
        { status: 400 }
      )
    }

    await connectDB()

    const campaign = await Campaign.findById(id)
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, logs: campaign.logs || [] })
  } catch (error) {
    console.error('Error fetching campaign logs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaign logs' },
      { status: 500 }
    )
  }
} 