import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { headers } from 'next/headers';
import Order from '@/models/Order';
import Customer from '@/models/Customer';

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-crm', {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Authentication middleware
async function authenticate(request: NextRequest) {
  const apiKey = request.nextUrl.searchParams.get('apiKey') || request.headers.get('x-api-key');

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  return null;
}

// POST /api/orders
export async function POST(request: NextRequest) {
  // Check authentication
  const authResponse = await authenticate(request);
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    const { customerId, orderValue } = body;

    // Validate required fields
    if (!customerId || orderValue === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: customerId and orderValue are required' },
        { status: 400 }
      );
    }

    // Validate order value
    if (orderValue < 0) {
      return NextResponse.json(
        { success: false, error: 'Order value cannot be negative' },
        { status: 400 }
      );
    }

    await connectDB();

    // Validate if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Create new order
    const order = new Order({
      customerId,
      orderValue,
      orderDate: new Date()
    });

    const savedOrder = await order.save();

    // Update customer's total spend
    await Customer.findByIdAndUpdate(
      customerId,
      { 
        $inc: { totalSpend: orderValue },
        lastActive: new Date()
      }
    );

    return NextResponse.json(
      { success: true, data: savedOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 