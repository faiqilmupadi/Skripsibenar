import { tx } from "@/lib/db/mysql";
import { qTx } from "@/lib/db/queries";
import { ApiError, handleError, ok } from "@/lib/http/errors";
import { movementSql } from "@/features/stockBarang/api/handlers/movement.sql";

export async function orderQcHandler(req: Request) {
  try {
    const b = await req.json();
    await tx(async (conn) => {
      for (const it of b.items) {
        const plant = it.plant || b.plant || "P1";
        const lockSql = "SELECT freeStock FROM material_stock WHERE partNumber=? AND plant=? FOR UPDATE";
        const locked = await qTx<any[]>(conn, lockSql, [it.itemId, plant]);
        if (!locked[0]) throw new ApiError(404, "Stok tidak ditemukan");
        await conn.execute("UPDATE material_stock SET freeStock=freeStock+?,blocked=blocked+? WHERE partNumber=? AND plant=?", [it.good, it.bad, it.itemId, plant]);
        await conn.execute(movementSql, [plant, "QC", b.orderNo || null, null, it.good + it.bad, b.userName || "admin", it.itemId]);
      }
    });
    return ok({ success: true });
  } catch (e) {
    return handleError(e);
  }
}
