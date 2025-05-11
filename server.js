const express = require('express');
const connectDB = require('./db');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-crm')
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Mini CRM API' });
})

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 