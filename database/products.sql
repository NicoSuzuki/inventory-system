-- ==========================================
-- Table: products
-- Description: Stores product information for the inventory system
-- ==========================================

CREATE TABLE IF NOT EXISTS `products` (
  `id_products` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(255) NULL,
  `price` FLOAT NOT NULL,
  `stock` INT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_products`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
