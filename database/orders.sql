-- ==========================================
-- Table: orders
-- Description: Stores orders information for the inventory system
-- ==========================================

CREATE TABLE IF NOT EXISTS orders (
  id_orders INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  status ENUM('pending','completed','cancelled') NOT NULL DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id_orders),

  INDEX idx_orders_user_created (user_id, created_at),
  INDEX idx_orders_status_created (status, created_at),

  CONSTRAINT fk_orders_users
    FOREIGN KEY (user_id) REFERENCES users(id_users)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
