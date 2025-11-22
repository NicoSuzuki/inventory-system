const db = require('../config/db');

/**
 * GET /api/products
 */
exports.getAllProducts = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : null;

    let query = 'SELECT * FROM products';
    const params = [];

    if (limit !== null) {
      query += ' LIMIT ?';
      params.push(limit);
      if (offset !== null) {
        query += ' OFFSET ?';
        params.push(offset);
      }
    }

    const [rows] = await db.query(query, params);
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/products/:id
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);
    if (Number.isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product id' });
    }

    const [rows] = await db.query(
      'SELECT * FROM products WHERE id_products = ?',
      [productId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ data: rows[0] });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/products
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, description = null, price, stock } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);

    if (Number.isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ error: 'Price must be a non-negative number' });
    }
    if (Number.isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({ error: 'Stock must be a non-negative number' });
    }

    const [result] = await db.query(
      'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
      [name.trim(), description, priceNum, stockNum]
    );

    res.status(201).json({
      message: 'Product created',
      data: { id: result.insertId, name: name.trim(), description, price: priceNum, stock: stockNum }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PUT /api/products/:id
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);
    if (Number.isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product id' });
    }

    const { name, description, price, stock } = req.body;

    const [exists] = await db.query('SELECT * FROM products WHERE id_products = ?', [productId]);
    if (exists.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
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

    if (description !== undefined) {
      fields.push('description = ?');
      params.push(description);
    }

    if (price !== undefined) {
      const priceNum = parseFloat(price);
      if (Number.isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({ error: 'Price must be a non-negative number' });
      }
      fields.push('price = ?');
      params.push(priceNum);
    }

    if (stock !== undefined) {
      const stockNum = parseInt(stock, 10);
      if (Number.isNaN(stockNum) || stockNum < 0) {
        return res.status(400).json({ error: 'Stock must be a non-negative number' });
      }
      fields.push('stock = ?');
      params.push(stockNum);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id_products = ?`;
    params.push(productId);

    const [result] = await db.query(sql, params);

    res.status(200).json({
      message: 'Product updated',
      data: { id: productId }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * DELETE /api/products/:id
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);
    if (Number.isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product id' });
    }

    const [result] = await db.query(
      'DELETE FROM products WHERE id_products = ?',
      [productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
