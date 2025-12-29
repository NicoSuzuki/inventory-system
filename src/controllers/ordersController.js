const db = require('../config/db');

/**
 * POST /api/orders
 * Body:
 * {
 *   "items": [
 *     { "product_id": 1, "quantity": 2 },
 *     { "product_id": 3, "quantity": 1 }
 *   ]
 * }
 */
exports.createOrder = async (req, res) => {
  let connection;

  try {
    const userId = req.user?.id;
    const { items } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items must be a non-empty array' });
    }

    for (const item of items) {
      const productId = parseInt(item.product_id, 10);
      const quantity = parseInt(item.quantity, 10);

      if (Number.isNaN(productId) || productId <= 0) {
        return res.status(400).json({ error: 'Invalid product_id in items' });
      }

      if (Number.isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity in items' });
      }
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const enrichedItems = [];
    let total = 0;

    for (const item of items) {
      const productId = parseInt(item.product_id, 10);
      const quantity = parseInt(item.quantity, 10);

      const [productRows] = await connection.query(
        'SELECT id_products, name, price, stock FROM products WHERE id_products = ?',
        [productId]
      );

      if (productRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: `Product not found: ${productId}` });
      }

      const product = productRows[0];

      if (product.stock < quantity) {
        await connection.rollback();
        return res.status(409).json({
          error: `Insufficient stock for product ${productId}`,
          available: product.stock
        });
      }

      const priceAtPurchase = Number(product.price);
      const lineTotal = priceAtPurchase * quantity;
      total += lineTotal;

      enrichedItems.push({
        product_id: productId,
        quantity,
        price_at_purchase: priceAtPurchase,
        available_stock: product.stock
      });
    }

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, status, total) VALUES (?, ?, ?)',
      [userId, 'pending', total]
    );

    const orderId = orderResult.insertId;

    for (const item of enrichedItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price_at_purchase]
      );
    }

    for (const item of enrichedItems) {
      const [updateResult] = await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id_products = ? AND stock >= ?',
        [item.quantity, item.product_id, item.quantity]
      );

      if (updateResult.affectedRows === 0) {
        await connection.rollback();
        return res.status(409).json({
        error: `Insufficient stock for product ${item.product_id}`,
        available: item.available_stock
        });
      }
    }

    await connection.commit();

    res.status(201).json({
      message: 'Order created',
      data: {
        id_orders: orderId,
        user_id: userId,
        status: 'pending',
        total,
        items: enrichedItems
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);

    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }

    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
};

exports.getAllOrders = async (req, res) => {
  try {
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
      const offset = (page - 1) * limit;

      const status = req.query.status?.trim();
      const userId = req.query.user_id ? parseInt(req.query.user_id, 10) : null;

      const where = [];
      const params = [];

      if (status) {
        where.push('o.status = ?');
        params.push(status);
      }
      if (userId && !Number.isNaN(userId)) {
        where.push('o.user_id = ?');
        params.push(userId);
      }

      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

      const [countRows] = await db.query(
        `SELECT COUNT(*) AS total
        FROM orders o
        ${whereSql}`,
        params
      );

      const totalRows = countRows[0]?.total ?? 0;
      const totalPages = Math.ceil(totalRows / limit);

      const [rows] = await db.query(
        `SELECT
          o.id_orders,
          o.user_id,
          o.status,
          o.total,
          o.created_at,
          u.name AS user_name,
          u.email AS user_email
        FROM orders o
        JOIN users u ON u.id_users = o.user_id
        ${whereSql}
        ORDER BY o.created_at DESC
        LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      return res.status(200).json({
        meta: {
          page,
          limit,
          totalRows,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        data: rows
      });
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const offset = (page - 1) * limit;

    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total
       FROM orders
       WHERE user_id = ?`,
      [userId]
    );

    const totalRows = countRows[0]?.total ?? 0;
    const totalPages = Math.ceil(totalRows / limit);

    const [rows] = await db.query(
      `SELECT
         id_orders,
         status,
         total,
         created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    return res.status(200).json({
      meta: {
        page,
        limit,
        totalRows,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      data: rows
    });
  } catch (error) {
    console.error('Error fetching my orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getOrderById = async (req, res) => {
try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const orderId = parseInt(req.params.id, 10);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (Number.isNaN(orderId) || orderId <= 0) {
      return res.status(400).json({ error: 'Invalid order id' });
    }

    const [orderRows] = await db.query(
      `SELECT
         o.id_orders,
         o.user_id,
         o.status,
         o.total,
         o.created_at,
         u.name AS user_name,
         u.email AS user_email
       FROM orders o
       JOIN users u ON u.id_users = o.user_id
       WHERE o.id_orders = ?`,
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderRows[0];

    if (role !== 'admin' && order.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const [itemRows] = await db.query(
      `SELECT
         oi.id_order_items,
         oi.product_id,
         p.name AS product_name,
         oi.quantity,
         oi.price_at_purchase,
         (oi.quantity * oi.price_at_purchase) AS line_total
       FROM order_items oi
       JOIN products p ON p.id_products = oi.product_id
       WHERE oi.order_id = ?
       ORDER BY oi.id_order_items ASC`,
      [orderId]
    );

    return res.status(200).json({
      data: {
        ...order,
        items: itemRows
      }
    });
  } catch (error) {
    console.error('Error fetching order by id:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
