import { tx } from "@/lib/db/mysql";
import { qTx } from "@/lib/db/queries";
import { ApiError, handleError, ok } from "@/lib/http/errors";
import { movementSql } from "@/features/stockBarang/api/handlers/movement.sql";

export async function returnHandler(req: Request) {
  try {
    const b = await req.json();
    await tx(async (conn) => {
      const plant = b.plant || "P1";
      const rows = await qTx<any[]>(conn, "SELECT blocked FROM material_stock WHERE partNumber=? AND plant=? FOR UPDATE", [b.itemId, plant]);
      if (!rows[0] || Number(rows[0].blocked) < b.qty) throw new ApiError(400, "Blocked tidak cukup");
      await conn.execute("UPDATE material_stock SET blocked=blocked-? WHERE partNumber=? AND plant=?", [b.qty, b.itemId, plant]);
      await conn.execute(movementSql, [plant, "RETURN", b.orderNo || "VENDOR-CLAIM", null, -Math.abs(b.qty), b.userName || "admin", b.itemId]);
    });
    return ok({ success: true });
  } catch (e) {
    return handleError(e);
  }
}
