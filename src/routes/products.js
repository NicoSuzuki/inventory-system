const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// GET /api/products
router.get('/', productsController.getAllProducts);

// GET /api/products/:id
router.get('/:id', productsController.getProductById);

// POST /api/products
router.post('/', authenticateToken, authorizeRole('admin'), productsController.createProduct);

// PUT /api/products/:id/restore
router.put('/:id/restore', authenticateToken, authorizeRole('admin'), productsController.restoreProduct);

// PUT /api/products/:id
router.put('/:id', authenticateToken, authorizeRole('admin'), productsController.updateProduct);

// DELETE /api/products/:id
router.delete('/:id', authenticateToken, authorizeRole('admin'), productsController.deleteProduct);

module.exports = router;