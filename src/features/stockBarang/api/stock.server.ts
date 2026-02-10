import { tx } from "@/lib/db/mysql";
import { exec, q, qTx } from "@/lib/db/queries";
import { ApiError, handleError, ok } from "@/lib/http/errors";
import { orderSchema } from "@/features/stockBarang/schemas/stock.schema";

export async function stockHandler(_req?: Request) {
  try {
    const sql = `SELECT mm.partNumber id,mm.materialDescription name,pd.reorderPoint rop,
      ms.freeStock free_stock,ms.blocked blocked_stock,ms.plant FROM material_master mm
      JOIN material_stock ms ON ms.partNumber=mm.partNumber
      JOIN material_plant_data pd ON pd.partNumber=ms.partNumber AND pd.plant=ms.plant`;
    return ok(await q<any[]>(sql));
  } catch (e) {
    return handleError(e);
  }
}

export async function orderHandler(req: Request) {
  try {
    const b = orderSchema.parse(await req.json());
    for (const it of b.items) {
      const sql = `INSERT INTO material_movement(partNumber,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName)
        SELECT partNumber,?,materialDescription,CURDATE(),?,?,?,ABS(?),baseUnitOfMeasure,NULL,?
        FROM material_master WHERE partNumber=?`;
      await exec(sql, [it.plant || b.plant || "P1", it.movementType || "101", b.orderNo || `ORDER-${Date.now()}`, b.purchaseOrder || null, it.qty, b.userName || "admin", it.itemId]);
    }
    return ok({ orderId: b.orderNo || Date.now() });
  } catch (e) {
    return handleError(e);
  }
}

export async function orderQcHandler(req: Request, _orderId?: string) {
  try {
    const b = await req.json();
    await tx(async (conn) => {
      for (const it of b.items || []) {
        const plant = it.plant || b.plant || "P1";
        const rows = await qTx<any[]>(conn, "SELECT freeStock,blocked FROM material_stock WHERE partNumber=? AND plant=? FOR UPDATE", [it.itemId, plant]);
        if (!rows[0]) throw new ApiError(404, "Stok tidak ditemukan");
        await conn.execute("UPDATE material_stock SET freeStock=freeStock+?,blocked=blocked+? WHERE partNumber=? AND plant=?", [Math.round(it.good || 0), Math.round(it.bad || 0), it.itemId, plant]);
        const sql = `INSERT INTO material_movement(partNumber,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName)
          SELECT partNumber,?,materialDescription,CURDATE(),'101',?,?,ABS(?),baseUnitOfMeasure,NULL,?
          FROM material_master WHERE partNumber=?`;
        await conn.execute(sql, [plant, b.orderNo || null, null, Number(it.good || 0) + Number(it.bad || 0), b.userName || "admin", it.itemId]);
      }
    });
    return ok({ success: true });
  } catch (e) {
    return handleError(e);
  }
}

export async function withdrawHandler(req: Request) {
  try {
    const b = await req.json();
    await tx(async (conn) => {
      const plant = b.plant || "P1";
      const rows = await qTx<any[]>(conn, "SELECT freeStock FROM material_stock WHERE partNumber=? AND plant=? FOR UPDATE", [b.itemId, plant]);
      if (!rows[0] || Number(rows[0].freeStock) < b.qty) throw new ApiError(400, "Stok tidak cukup");
      await conn.execute("UPDATE material_stock SET freeStock=freeStock-? WHERE partNumber=? AND plant=?", [Math.round(b.qty), b.itemId, plant]);
      const sql = `INSERT INTO material_movement(partNumber,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName)
        SELECT partNumber,?,materialDescription,CURDATE(),'261',?,NULL,-ABS(?),baseUnitOfMeasure,NULL,?
        FROM material_master WHERE partNumber=?`;
      await conn.execute(sql, [plant, b.orderNo || `WD|${b.customerName}|${b.note || ""}`, b.qty, b.userName || "admin", b.itemId]);
    });
    return ok({ success: true });
  } catch (e) {
    return handleError(e);
  }
}

export async function returnHandler(req: Request) {
  try {
    const b = await req.json();
    await tx(async (conn) => {
      const plant = b.plant || "P1";
      const rows = await qTx<any[]>(conn, "SELECT blocked FROM material_stock WHERE partNumber=? AND plant=? FOR UPDATE", [b.itemId, plant]);
      if (!rows[0] || Number(rows[0].blocked) < b.qty) throw new ApiError(400, "Blocked tidak cukup");
      await conn.execute("UPDATE material_stock SET blocked=blocked-? WHERE partNumber=? AND plant=?", [Math.round(b.qty), b.itemId, plant]);
      const sql = `INSERT INTO material_movement(partNumber,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName)
        SELECT partNumber,?,materialDescription,CURDATE(),'Z48',?,NULL,-ABS(?),baseUnitOfMeasure,NULL,?
        FROM material_master WHERE partNumber=?`;
      await conn.execute(sql, [plant, b.orderNo || "VENDOR-CLAIM", b.qty, b.userName || "admin", b.itemId]);
    });
    return ok({ success: true });
  } catch (e) {
    return handleError(e);
  }
}
