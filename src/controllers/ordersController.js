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
        price_at_purchase: priceAtPurchase
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
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id_products = ?',
        [item.quantity, item.product_id]
      );
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
  return res.status(501).json({ error: 'Not implemented yet' });
};

exports.getMyOrders = async (req, res) => {
  return res.status(501).json({ error: 'Not implemented yet' });
};

exports.getOrderById = async (req, res) => {
  return res.status(501).json({ error: 'Not implemented yet' });
};
