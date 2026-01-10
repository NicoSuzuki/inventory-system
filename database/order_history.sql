-- ==========================================
-- Table: order_history
-- Description: Stores order status change history for auditing purposes
-- ==========================================

CREATE TABLE IF NOT EXISTS order_history (
  id_order_history INT NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  old_status ENUM('pending','completed','cancelled') NULL,
  new_status ENUM('pending','completed','cancelled') NOT NULL,
  note VARCHAR(255) NULL,
  changed_by INT NOT NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id_order_history),

  INDEX idx_order_history_order_id (order_id),
  INDEX idx_order_history_changed_by (changed_by),

  CONSTRAINT fk_order_history_orders
    FOREIGN KEY (order_id) REFERENCES orders(id_orders)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_order_history_users
    FOREIGN KEY (changed_by) REFERENCES users(id_users)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
