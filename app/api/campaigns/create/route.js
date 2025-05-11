import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Campaign } from '@/models/Campaign';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, objective, segment, messageVariants, audienceRules } = body;

    // Validate required fields
    if (!name || !objective || !segment) {
      return NextResponse.json(
        { success: false, error: 'Name, objective, and segment are required' },
        { status: 400 }
      );
    }

    // Validate audience rules
    if (!audienceRules || Object.keys(audienceRules).length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one audience rule is required' },
        { status: 400 }
      );
    }

    // Validate message variants
    if (!messageVariants || messageVariants.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one message variant is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const campaign = await Campaign.create({
      name,
      objective,
      segment,
      messageVariants,
      audienceRules,
      status: 'pending'
    });

    return NextResponse.json(
      { 
        success: true, 
        campaign,
        message: 'Campaign created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create campaign' },
      { status: 500 }
    );
  }
} 