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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS material_master (
  partNumber VARCHAR(50) NOT NULL,
  materialDescription VARCHAR(255) NOT NULL,
  baseUnitOfMeasure VARCHAR(20) NOT NULL,
  createdOn DATE NOT NULL,
  createTime TIME NULL,
  createdBy VARCHAR(100) NULL,
  materialGroup VARCHAR(100) NULL,
  PRIMARY KEY (partNumber)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS material_stock (
  partNumber VARCHAR(50) NOT NULL,
  plant VARCHAR(20) NOT NULL,
  freeStock DECIMAL(10,3) NOT NULL DEFAULT 0,
  blocked DECIMAL(10,3) NOT NULL DEFAULT 0,
  PRIMARY KEY (partNumber, plant),
  CONSTRAINT fk_stock_master
    FOREIGN KEY (partNumber) REFERENCES material_master(partNumber)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS material_plant_data (
  partNumber VARCHAR(50) NOT NULL,
  plant VARCHAR(20) NOT NULL,
  reorderPoint DECIMAL(10,3) NOT NULL DEFAULT 0,
  safetyStock DECIMAL(10,3) NOT NULL DEFAULT 0,
  PRIMARY KEY (partNumber, plant),
  CONSTRAINT fk_plant_master
    FOREIGN KEY (partNumber) REFERENCES material_master(partNumber)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS material_movement (
  movementId BIGINT NOT NULL AUTO_INCREMENT,
  partNumber VARCHAR(50) NOT NULL,
  plant VARCHAR(20) NOT NULL,
  materialDescription VARCHAR(255) NULL,
  postingDate DATE NOT NULL,
  movementType VARCHAR(50) NOT NULL,
  orderNo VARCHAR(50) NULL,
  purchaseOrder VARCHAR(50) NULL,
  quantity DECIMAL(18,3) NOT NULL,
  baseUnitOfMeasure VARCHAR(20) NULL,
  amtInLocCur DECIMAL(18,2) NULL,
  userName VARCHAR(100) NULL,
  PRIMARY KEY (movementId),

  CONSTRAINT fk_movement_partNumber
    FOREIGN KEY (partNumber) REFERENCES material_master(partNumber)
    ON UPDATE CASCADE ON DELETE RESTRICT,

  KEY idx_mv_postingDate (postingDate),
  KEY idx_mv_userName (userName),
  KEY idx_mv_partNumber (partNumber),
  KEY idx_mv_movementType (movementType),
  KEY idx_mv_plant (plant)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
