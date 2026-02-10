import { tx } from "@/lib/db/mysql";
import { ApiError } from "@/lib/http/errors";
import { exec, qTx } from "@/lib/db/queries";
import type { AllowedMovementType } from "@/features/stockBarang/utils/movement.constants";

type MovementInput = {
  itemId: string;
  plant: string;
  movementType: AllowedMovementType;
  quantity: number;
  userName: string;
  orderNo?: string;
  purchaseOrder?: string;
};

async function createMovement(conn: any, input: MovementInput) {
  await conn.execute(
    `INSERT INTO material_movement(material,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName)
     SELECT partNumber,?,materialDescription,CURDATE(),?,?,?, ?,baseUnitOfMeasure,0,?
     FROM material_master WHERE partNumber=?`,
    [input.plant, input.movementType, input.orderNo || null, input.purchaseOrder || null, input.quantity, input.userName, input.itemId]
  );
}

export async function createOrderMovements(input: MovementInput[]) {
  for (const item of input) await exec(
    `INSERT INTO material_movement(material,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName)
     SELECT partNumber,?,materialDescription,CURDATE(),?,?,?, ?,baseUnitOfMeasure,0,?
     FROM material_master WHERE partNumber=?`,
    [item.plant, item.movementType, item.orderNo || null, item.purchaseOrder || null, item.quantity, item.userName, item.itemId]
  );
}

export async function mutateStock(input: MovementInput, stockField: "freeStock" | "blocked", delta: number) {
  await tx(async (conn) => {
    const rows = await qTx<any[]>(conn, `SELECT freeStock,blocked FROM material_stock WHERE partNumber=? AND plant=? FOR UPDATE`, [input.itemId, input.plant]);
    if (!rows[0]) throw new ApiError(404, "Stok tidak ditemukan");
    if (Number(rows[0][stockField === "freeStock" ? "freeStock" : "blocked"]) + delta < 0) throw new ApiError(400, "Stok tidak cukup");
    await conn.execute(`UPDATE material_stock SET ${stockField}=${stockField}+? WHERE partNumber=? AND plant=?`, [delta, input.itemId, input.plant]);
    await createMovement(conn, input);
  });
}
