const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

// Customer routes (/api/orders)
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin routes (also accessible via /api/orders/admin)
router.get('/admin', protect, adminOnly, getAllOrders);
router.patch('/admin/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
