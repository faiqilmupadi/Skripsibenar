CREATE TABLE IF NOT EXISTS users (
  userId INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(60) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('KEPALA_GUDANG','ADMIN_GUDANG') NOT NULL,
  createdOn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastChange DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS material_master (
  partNumber VARCHAR(40) PRIMARY KEY,
  materialDescription VARCHAR(255) NOT NULL,
  baseUnitOfMeasure VARCHAR(20) NOT NULL,
  createdOn DATE NULL,
  createTime TIME NULL,
  createdBy VARCHAR(80) NULL,
  materialGroup VARCHAR(80) NULL
);

CREATE TABLE IF NOT EXISTS material_stock (
  partNumber VARCHAR(40) NOT NULL,
  plant VARCHAR(20) NOT NULL,
  freeStock DECIMAL(10,3) NOT NULL DEFAULT 0,
  blocked DECIMAL(10,3) NOT NULL DEFAULT 0,
  PRIMARY KEY (partNumber, plant),
  CONSTRAINT fk_stock_master FOREIGN KEY (partNumber) REFERENCES material_master(partNumber)
);

CREATE TABLE IF NOT EXISTS material_plant_data (
  partNumber VARCHAR(40) NOT NULL,
  plant VARCHAR(20) NOT NULL,
  reorderPoint DECIMAL(10,3) NOT NULL DEFAULT 0,
  safetyStock DECIMAL(10,3) NOT NULL DEFAULT 0,
  PRIMARY KEY (partNumber, plant),
  CONSTRAINT fk_plant_master FOREIGN KEY (partNumber) REFERENCES material_master(partNumber)
);

CREATE TABLE IF NOT EXISTS material_movement (
  movementId BIGINT PRIMARY KEY AUTO_INCREMENT,
  material VARCHAR(40) NOT NULL,
  plant VARCHAR(20) NOT NULL,
  materialDescription VARCHAR(255) NOT NULL,
  postingDate DATE NOT NULL,
  movementType ENUM('101','261','Z48') NOT NULL,
  orderNo VARCHAR(120) NULL,
  purchaseOrder VARCHAR(120) NULL,
  quantity DECIMAL(16,3) NOT NULL DEFAULT 0,
  baseUnitOfMeasure VARCHAR(20) NOT NULL,
  amtInLocCur DECIMAL(18,2) NOT NULL DEFAULT 0,
  userName VARCHAR(120) NOT NULL,
  KEY idx_movement_material (material, plant, postingDate),
  CONSTRAINT fk_movement_master FOREIGN KEY (material) REFERENCES material_master(partNumber)
);
