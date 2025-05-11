const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Customer = require('../models/Customer');

// Apply auth middleware to all customer routes
router.use(authMiddleware);

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching customers',
      details: error.message
    });
  }
});

// Get customer by ID
router.get('/:id', (req, res) => {
  res.json({ message: `Get customer ${req.params.id}` });
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, totalSpend, visitCount } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and phone are required'
      });
    }

    // Check if customer with email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        error: 'Customer with this email already exists'
      });
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

    // Save customer to database
    const savedCustomer = await customer.save();

    res.status(201).json({
      success: true,
      data: savedCustomer
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating customer',
      details: error.message
    });
  }
});

// Update customer
router.put('/:id', (req, res) => {
  res.json({ message: `Update customer ${req.params.id}` });
});

// Delete customer
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete customer ${req.params.id}` });
});

module.exports = router; 