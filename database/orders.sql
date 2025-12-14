-- ==========================================
-- Table: orders
-- Description: Stores orders information for the inventory system
-- ==========================================


CREATE TABLE IF NOT EXISTS orders (
  id_orders INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_orders),
  CONSTRAINT fk_orders_users
    FOREIGN KEY (user_id) REFERENCES users(id_users)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

