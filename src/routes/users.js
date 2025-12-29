const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');
const {authenticateToken, authorizeRole} = require('../middleware/authMiddleware');

// GET /api/users
router.get('/', authenticateToken, authorizeRole('admin'), usersController.getAllUsers);

// GET /api/users/:id
router.get('/:id', authenticateToken, authorizeRole('admin'), usersController.getUserById);

// POST /api/users
router.post('/', usersController.createUser);

// PUT /api/users/:id
router.put('/:id', authenticateToken, authorizeRole('admin'), usersController.updateUser);

// DELETE /api/users/:id
router.delete('/:id', authenticateToken, authorizeRole('admin'), usersController.deleteUser);

module.exports = router;
