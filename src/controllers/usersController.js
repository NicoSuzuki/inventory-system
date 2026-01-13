const db = require('../config/db');
const bcrypt = require('bcryptjs');

// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id_users, name, role, email, created_at FROM users'
    );
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const [rows] = await db.query(
      'SELECT id_users, name, role, email, created_at FROM users WHERE id_users = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ data: rows[0] });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const { name, role, email, password } = req.body;

    const [existing] = await db.query(
      'SELECT * FROM users WHERE id_users = ?',
      [userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const fields = [];
    const params = [];

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Name must be a non-empty string' });
      }
      fields.push('name = ?');
      params.push(name.trim());
    }

    if (role !== undefined) {
      if (typeof role !== 'string' || role.trim() === '') {
        return res.status(400).json({ error: 'Role must be a non-empty string' });
      }
      fields.push('role = ?');
      params.push(role.trim());
    }

    if (email !== undefined) {
      if (typeof email !== 'string' || email.trim() === '') {
        return res.status(400).json({ error: 'Email must be a non-empty string' });
      }
      fields.push('email = ?');
      params.push(email.trim());
    }

    if (password !== undefined) {
      if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push('password = ?');
      params.push(hashedPassword);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id_users = ?`;
    params.push(userId);

    const [result] = await db.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated',
      data: { id: userId }
    });
  } catch (error) {
    console.error('Error updating user:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already in use' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const [result] = await db.query(
      'DELETE FROM users WHERE id_users = ?',
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
