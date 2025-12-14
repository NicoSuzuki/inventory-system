-- ==========================================
-- Table: order_items
-- Description: Stores information of the items in the orders for the inventory system
-- ==========================================


CREATE TABLE IF NOT EXISTS order_items (
  id_order_items INT NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id_order_items),
  CONSTRAINT fk_items_orders
    FOREIGN KEY (order_id) REFERENCES orders(id_orders)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_items_products
    FOREIGN KEY (product_id) REFERENCES products(id_products)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;
