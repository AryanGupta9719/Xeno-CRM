const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all order routes
router.use(authMiddleware);

// Get all orders
router.get('/', (req, res) => {
  res.json({ message: 'Get all orders' });
});

// Get order by ID
router.get('/:id', (req, res) => {
  res.json({ message: `Get order ${req.params.id}` });
});

// Create new order
router.post('/', (req, res) => {
  res.json({ message: 'Create new order' });
});

// Update order
router.put('/:id', (req, res) => {
  res.json({ message: `Update order ${req.params.id}` });
});

// Delete order
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete order ${req.params.id}` });
});

module.exports = router; 