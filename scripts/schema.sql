CREATE TABLE IF NOT EXISTS users (
  userId INT NOT NULL,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  createdOn DATETIME NOT NULL,
  lastChange DATETIME NULL,
  PRIMARY KEY (userId),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email)
);

CREATE TABLE IF NOT EXISTS material_master (
  partNumber VARCHAR(50) NOT NULL,
  materialDescription VARCHAR(255) NOT NULL,
  baseUnitOfMeasure VARCHAR(20) NOT NULL,
  createdOn DATE NOT NULL,
  createTime TIME NULL,
  createdBy VARCHAR(100) NULL,
  materialGroup VARCHAR(100) NULL,
  PRIMARY KEY (partNumber)
);

CREATE TABLE IF NOT EXISTS material_stock (
  partNumber VARCHAR(40) NOT NULL,
  freeStock DECIMAL(16,3) NOT NULL DEFAULT 0,
  plant VARCHAR(20) NOT NULL,
  blocked DECIMAL(16,3) NOT NULL DEFAULT 0,
  PRIMARY KEY (partNumber, plant),
  CONSTRAINT fk_stock_master
    FOREIGN KEY (partNumber) REFERENCES material_master(partNumber)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS material_plant_data (
  partNumber VARCHAR(50) NOT NULL,
  plant VARCHAR(20) NOT NULL,
  reorderPoint DECIMAL(10,3) NOT NULL DEFAULT 0,
  safetyStock DECIMAL(10,3) NOT NULL DEFAULT 0,
  PRIMARY KEY (partNumber, plant),
  CONSTRAINT fk_plant_master
    FOREIGN KEY (partNumber) REFERENCES material_master(partNumber)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS material_movement (
  partNumber VARCHAR(40) NOT NULL,
  plant VARCHAR(20) NOT NULL,
  materialDescription VARCHAR(255) NULL,
  postingDate DATE NOT NULL,
  movementType ENUM('101','261','Z48') NOT NULL,
  orderNo VARCHAR(120) NULL,
  purchaseOrder VARCHAR(120) NULL,
  quantity DECIMAL(16,3) NOT NULL DEFAULT 0,
  baseUnitOfMeasure VARCHAR(20) NOT NULL,
  amtInLocCur DECIMAL(18,2) NOT NULL DEFAULT 0,
  userName VARCHAR(120) NOT NULL,
  KEY idx_movement_lookup (partNumber, plant, postingDate),
  CONSTRAINT fk_movement_master FOREIGN KEY (partNumber)
    REFERENCES material_master(partNumber)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);
