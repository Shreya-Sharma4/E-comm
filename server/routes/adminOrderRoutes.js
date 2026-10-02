const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

// Mount at /api/admin/orders
router.use(protect, adminOnly);

router.get('/', getAllOrders);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
