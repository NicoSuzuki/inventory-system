async function recordOrderStatusChange(connection, {
  orderId,
  oldStatus,
  newStatus,
  changedBy,
  note = null
}) {
  await connection.query(
    `INSERT INTO order_history (order_id, old_status, new_status, changed_by, note)
     VALUES (?, ?, ?, ?, ?)`,
    [orderId, oldStatus, newStatus, changedBy, note]
  );
}

module.exports = { recordOrderStatusChange };
