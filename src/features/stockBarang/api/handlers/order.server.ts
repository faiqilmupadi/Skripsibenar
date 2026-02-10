import { exec } from "@/lib/db/queries";
import { handleError, ok } from "@/lib/http/errors";
import { movementSql } from "@/features/stockBarang/api/handlers/movement.sql";

export async function orderHandler(req: Request) {
  try {
    const b = await req.json();
    for (const it of b.items) {
      await exec(movementSql, [
        it.plant || b.plant || "P1", "ORDER", b.orderNo || `ORDER-${Date.now()}`,
        b.purchaseOrder || null, it.qty, b.userName || "admin", it.itemId
      ]);
    }
    return ok({ orderId: b.orderNo || Date.now() });
  } catch (e) {
    return handleError(e);
  }
}
