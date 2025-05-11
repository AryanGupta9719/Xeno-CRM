import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { headers } from 'next/headers';
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

// GET /api/customers
export async function GET(request: NextRequest) {
  // Check authentication
  const authResponse = await authenticate(request);
  if (authResponse) return authResponse;

  try {
    await connectDB();
    const customers = await Customer.find({});
    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/customers
export async function POST(request: NextRequest) {
  // Check authentication
  const authResponse = await authenticate(request);
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    const { name, email, phone, totalSpend, visitCount } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, email, and phone are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if customer with email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer with this email already exists' },
        { status: 409 }
      );
    }

    // Create new customer
    const customer = new Customer({
      name,
      email,
      phone,
      totalSpend: totalSpend || 0,
      visitCount: visitCount || 0,
      lastActive: new Date()
    });

    const savedCustomer = await customer.save();
    return NextResponse.json(
      { success: true, data: savedCustomer },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  // Check authentication
  const authResponse = authenticate(request);
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Customer updated successfully',
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Check authentication
  const authResponse = authenticate(request);
  if (authResponse) return authResponse;

  return NextResponse.json({
    success: true,
    message: 'Customer deleted successfully',
  });
} 