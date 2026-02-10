import { ApiError, handleError, ok } from "@/lib/http/errors";
import { listStockRows } from "@/features/stockBarang/api/stock.read.server";
import { createOrderMovements, mutateStock } from "@/features/stockBarang/api/stock.mutations.server";
import { orderSchema, qcSchema, withdrawSchema } from "@/features/stockBarang/schemas/stock.schema";
import { movementTypeByAction } from "@/features/stockBarang/utils/movement.constants";

export async function stockHandler() {
  try { return ok(await listStockRows()); }
  catch (e) { return handleError(e); }
}

export async function orderHandler(req: Request) {
  try {
    const b = orderSchema.parse(await req.json());
    if (b.movementType !== movementTypeByAction.order) throw new ApiError(400, "movementType tidak valid");
    const items = b.items.map((it) => ({ ...it, plant: b.plant, userName: b.userName, movementType: b.movementType, orderNo: b.orderNo, purchaseOrder: b.purchaseOrder, quantity: it.qty }));
    await createOrderMovements(items);
    return ok({ success: true });
  } catch (e) { return handleError(e); }
}

export async function orderQcHandler(req: Request) {
  try {
    const b = qcSchema.parse(await req.json());
    if (b.movementType !== movementTypeByAction.qc) throw new ApiError(400, "movementType tidak valid");
    for (const it of b.items) {
      if (it.good > 0) await mutateStock({ itemId: it.itemId, plant: b.plant, movementType: b.movementType, quantity: it.good, userName: b.userName, orderNo: b.orderNo }, "freeStock", it.good);
      if (it.bad > 0) await mutateStock({ itemId: it.itemId, plant: b.plant, movementType: b.movementType, quantity: it.bad, userName: b.userName, orderNo: b.orderNo }, "blocked", it.bad);
    }
    return ok({ success: true });
  } catch (e) { return handleError(e); }
}

export async function withdrawHandler(req: Request) {
  try {
    const b = withdrawSchema.parse(await req.json());
    if (b.movementType !== movementTypeByAction.withdraw) throw new ApiError(400, "movementType tidak valid");
    await mutateStock({ itemId: b.itemId, plant: b.plant, movementType: b.movementType, quantity: b.qty * -1, userName: b.userName, orderNo: b.orderNo || b.note }, "freeStock", -b.qty);
    return ok({ success: true });
  } catch (e) { return handleError(e); }
}

export async function returnHandler(req: Request) {
  try {
    const b = withdrawSchema.parse(await req.json());
    if (b.movementType !== movementTypeByAction.claimVendor) throw new ApiError(400, "movementType tidak valid");
    await mutateStock({ itemId: b.itemId, plant: b.plant, movementType: b.movementType, quantity: b.qty * -1, userName: b.userName, orderNo: b.orderNo || "VENDOR-CLAIM" }, "blocked", -b.qty);
    return ok({ success: true });
  } catch (e) { return handleError(e); }
}
