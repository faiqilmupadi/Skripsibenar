-- CreateTable
CREATE TABLE `users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `username` VARCHAR(191) NOT NULL,
  `password_hash` VARCHAR(191) NOT NULL,
  `role` ENUM('KEPALA_GUDANG', 'ADMIN_GUDANG') NOT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  UNIQUE INDEX `users_username_key`(`username`),
  PRIMARY KEY (`id`)
);

CREATE TABLE `items` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `unit` VARCHAR(191) NOT NULL,
  `price` DECIMAL(14, 2) NOT NULL,
  `rop` INTEGER NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  UNIQUE INDEX `items_code_key`(`code`),
  PRIMARY KEY (`id`)
);

CREATE TABLE `stock` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `item_id` INTEGER NOT NULL,
  `free_stock` INTEGER NOT NULL DEFAULT 0,
  `blocked_stock` INTEGER NOT NULL DEFAULT 0,
  `updated_at` DATETIME(3) NOT NULL,
  UNIQUE INDEX `stock_item_id_key`(`item_id`),
  PRIMARY KEY (`id`)
);

CREATE TABLE `movements` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `item_id` INTEGER NOT NULL,
  `user_id` INTEGER NOT NULL,
  `type` ENUM('INBOUND', 'OUTBOUND', 'ORDER_CREATED', 'QC', 'RETURN', 'ADJUSTMENT') NOT NULL,
  `qty_free_delta` INTEGER NOT NULL,
  `qty_blocked_delta` INTEGER NOT NULL,
  `note` VARCHAR(191) NULL,
  `customer_name` VARCHAR(191) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
);

CREATE TABLE `orders` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `created_by` INTEGER NOT NULL,
  `status` ENUM('PENDING', 'RECEIVED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `order_items` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `order_id` INTEGER NOT NULL,
  `item_id` INTEGER NOT NULL,
  `qty_ordered` INTEGER NOT NULL,
  `qty_received_good` INTEGER NOT NULL DEFAULT 0,
  `qty_received_bad` INTEGER NOT NULL DEFAULT 0,
  UNIQUE INDEX `order_items_order_id_item_id_key`(`order_id`, `item_id`),
  PRIMARY KEY (`id`)
);

ALTER TABLE `stock` ADD CONSTRAINT `stock_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `movements` ADD CONSTRAINT `movements_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `movements` ADD CONSTRAINT `movements_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `orders` ADD CONSTRAINT `orders_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
