import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Campaign } from '@/models/Campaign';

export async function GET(request) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Filter parameters
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query = {};
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Validate sort parameters
    const validSortFields = ['createdAt', 'status', 'totalAudienceCount', 'name'];
    const validSortOrders = ['asc', 'desc'];
    
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const finalSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : 'desc';

    // Get total count for pagination
    const total = await Campaign.countDocuments(query);

    // Fetch campaigns with pagination and filters
    const campaigns = await Campaign.find(query)
      .sort({ [finalSortBy]: finalSortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .select('campaignId name createdAt status totalAudienceCount deliveryStats messageVariants audienceRules')
      .lean();

    // Format response
    const formattedCampaigns = campaigns.map(campaign => ({
      _id: campaign._id,
      name: campaign.name || 'Unnamed Campaign',
      createdAt: campaign.createdAt || new Date(),
      status: campaign.status || 'draft',
      totalAudienceCount: campaign.totalAudienceCount || 0,
      messageVariants: campaign.messageVariants || [],
      audienceRules: campaign.audienceRules || {},
      deliveryStats: {
        sent: campaign.deliveryStats?.sent || 0,
        failed: campaign.deliveryStats?.failed || 0
      }
    }));

    return NextResponse.json({ 
      success: true,
      data: {
        campaigns: formattedCampaigns,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        filters: {
          status,
          startDate,
          endDate,
          sortBy: finalSortBy,
          sortOrder: finalSortOrder
        }
      }
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch campaigns',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 