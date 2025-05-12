import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Campaign from '@/models/campaign'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await connectDB()

    const campaign = new Campaign(data)
    await campaign.save()

    return NextResponse.json({ success: true, data: { campaign } })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
} 