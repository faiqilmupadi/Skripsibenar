export const movementSql = `INSERT INTO material_movement(
  partNumber,plant,materialDescription,postingDate,movementType,orderNo,
  purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName
) SELECT partNumber,?,materialDescription,CURDATE(),?,?,?, ?,baseUnitOfMeasure,0,?
  FROM material_master WHERE partNumber=?`;
