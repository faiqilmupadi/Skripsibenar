import { tx } from "@/lib/db/mysql";
import { exec, q, qTx } from "@/lib/db/queries";
import { handleError, ok, ApiError } from "@/lib/http/errors";

export async function stockHandler() { try {
  const rows = await q<any[]>(`SELECT mm.partNumber id,mm.materialDescription name,pd.reorderPoint rop,
    ms.freeStock free_stock,ms.blocked blocked_stock,ms.plant FROM material_master mm
    JOIN material_stock ms ON ms.partNumber=mm.partNumber
    JOIN material_plant_data pd ON pd.partNumber=ms.partNumber AND pd.plant=ms.plant`);
  return ok(rows);
} catch (e) { return handleError(e); } }

export async function orderHandler(req: Request) { try {
  const b = await req.json();
  for (const it of b.items) await exec(`INSERT INTO material_movement(material,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName)
    SELECT partNumber,?,materialDescription,CURDATE(),'ORDER',?,?,?,baseUnitOfMeasure,0,? FROM material_master WHERE partNumber=?`, [(it.plant||b.plant||"P1"), b.orderNo || `ORDER-${Date.now()}`, b.purchaseOrder || null, it.qty, b.userName || "admin", it.itemId]);
  return ok({ orderId: b.orderNo || Date.now() });
} catch (e) { return handleError(e); } }

export async function orderQcHandler(req: Request) { try { const b = await req.json(); await tx(async (conn) => {
  for (const it of b.items) {
    const stock = await qTx<any[]>(conn, "SELECT freeStock,blocked FROM material_stock WHERE partNumber=? AND plant=? FOR UPDATE", [it.itemId, (it.plant||b.plant||"P1")]);
    if (!stock[0]) throw new ApiError(404, "Stok tidak ditemukan");
    await conn.execute("UPDATE material_stock SET freeStock=freeStock+?,blocked=blocked+? WHERE partNumber=? AND plant=?", [it.good, it.bad, it.itemId, (it.plant||b.plant||"P1")]);
    await conn.execute(`INSERT INTO material_movement(material,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName)
      SELECT partNumber,?,materialDescription,CURDATE(),'QC',?,?,?,baseUnitOfMeasure,0,? FROM material_master WHERE partNumber=?`, [(it.plant||b.plant||"P1"), b.orderNo || null, null, it.good + it.bad, b.userName || "admin", it.itemId]);
  }
  }); return ok({ success: true });
} catch (e) { return handleError(e); } }

export async function withdrawHandler(req: Request) { try { const b = await req.json(); await tx(async (conn) => {
  const rows = await qTx<any[]>(conn, "SELECT freeStock FROM material_stock WHERE partNumber=? AND plant=? FOR UPDATE", [b.itemId, (b.plant||"P1")]);
  if (!rows[0] || Number(rows[0].freeStock) < b.qty) throw new ApiError(400, "Stok tidak cukup");
  await conn.execute("UPDATE material_stock SET freeStock=freeStock-? WHERE partNumber=? AND plant=?", [b.qty, b.itemId, (b.plant||"P1")]);
  await conn.execute(`INSERT INTO material_movement(material,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName)
    SELECT partNumber,?,materialDescription,CURDATE(),'OUTBOUND',?,NULL,?,baseUnitOfMeasure,0,? FROM material_master WHERE partNumber=?`, [(b.plant||"P1"), b.orderNo || `WD|${b.customerName}|${b.note || ""}`, -Math.abs(b.qty), b.userName || "admin", b.itemId]);
}); return ok({ success: true }); } catch (e) { return handleError(e); } }

export async function returnHandler(req: Request) { try { const b = await req.json(); await tx(async (conn) => {
  const rows = await qTx<any[]>(conn, "SELECT blocked FROM material_stock WHERE partNumber=? AND plant=? FOR UPDATE", [b.itemId, (b.plant||"P1")]);
  if (!rows[0] || Number(rows[0].blocked) < b.qty) throw new ApiError(400, "Blocked tidak cukup");
  await conn.execute("UPDATE material_stock SET blocked=blocked-? WHERE partNumber=? AND plant=?", [b.qty, b.itemId, (b.plant||"P1")]);
  await conn.execute(`INSERT INTO material_movement(material,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName)
    SELECT partNumber,?,materialDescription,CURDATE(),'RETURN',?,NULL,?,baseUnitOfMeasure,0,? FROM material_master WHERE partNumber=?`, [(b.plant||"P1"), b.orderNo || "VENDOR-CLAIM", -Math.abs(b.qty), b.userName || "admin", b.itemId]);
}); return ok({ success: true }); } catch (e) { return handleError(e); } }
