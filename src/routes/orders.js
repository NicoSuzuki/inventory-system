const express = require('express');
const router = express.Router();

const ordersController = require('../controllers/ordersController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// POST /api/orders  -> create a new order (logged-in users)
router.post('/', authenticateToken, ordersController.createOrder);

// GET /api/orders -> list all orders (admin only)
router.get('/', authenticateToken, authorizeRole('admin'), ordersController.getAllOrders);

// GET /api/orders/my -> list my orders (logged-in user)
router.get('/my', authenticateToken, ordersController.getMyOrders);

// GET /api/orders/:id -> get order by id (admin or owner)
router.get('/:id', authenticateToken, ordersController.getOrderById);

module.exports = router;
