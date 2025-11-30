const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

// GET /api/users
router.get('/', usersController.getAllUsers);

// GET /api/users/:id
router.get('/:id', usersController.getUserById);

// POST /api/users
router.post('/', usersController.createUser);

// PUT /api/users/:id
router.put('/:id', usersController.updateUser);

// DELETE /api/users/:id
router.delete('/:id', usersController.deleteUser);

module.exports = router;
