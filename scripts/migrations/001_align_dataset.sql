-- Align old schema with real Excel dataset mapping.
ALTER TABLE material_movement DROP FOREIGN KEY fk_movement_master;
ALTER TABLE material_movement DROP COLUMN movementId;
ALTER TABLE material_movement CHANGE COLUMN material partNumber VARCHAR(40) NOT NULL;
ALTER TABLE material_movement
  ADD CONSTRAINT fk_movement_master FOREIGN KEY (partNumber)
  REFERENCES material_master(partNumber)
  ON UPDATE CASCADE
  ON DELETE RESTRICT;

DROP INDEX idx_movement_material ON material_movement;
CREATE INDEX idx_movement_lookup ON material_movement(partNumber, plant, postingDate);
