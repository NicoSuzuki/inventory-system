-- ==========================================
-- Table: users
-- Description: Stores user accounts for the system
-- ==========================================

CREATE TABLE IF NOT EXISTS `users` (
  `id_users` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `role` ENUM('admin','user') NOT NULL DEFAULT 'user',
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id_users`),
  UNIQUE KEY `email_unique` (`email`),
  INDEX idx_users_role (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
