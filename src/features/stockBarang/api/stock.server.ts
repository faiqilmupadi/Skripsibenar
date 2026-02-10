import { tx } from "@/lib/db/mysql";
import { q } from "@/lib/db/queries";
import { handleError, ok, ApiError } from "@/lib/http/errors";

export async function stockHandler() { try { return ok(await q("SELECT i.id,i.name,i.rop,s.free_stock,s.blocked_stock FROM items i JOIN stock s ON s.item_id=i.id")); } catch (e) { return handleError(e); } }

export async function orderHandler(req: Request) { try { const b = await req.json(); const r: any = await q("INSERT INTO orders(created_by) VALUES(?)", [b.userId || 1]); const id = r.insertId; for (const it of b.items) await q("INSERT INTO order_items(order_id,item_id,qty_ordered,qty_good,qty_bad) VALUES(?,?,?,?,?)", [id, it.itemId, it.qty, 0, 0]); return ok({ orderId: id }); } catch (e) { return handleError(e); } }

export async function orderQcHandler(req: Request, id: string) { try { const b = await req.json(); await tx(async (conn) => {
  for (const it of b.items) { if (it.good + it.bad !== it.ordered) throw new ApiError(400, "QC tidak valid");
    await conn.query("UPDATE order_items SET qty_good=?,qty_bad=? WHERE order_id=? AND item_id=?", [it.good, it.bad, id, it.itemId]);
    await conn.query("UPDATE stock SET free_stock=free_stock+?,blocked_stock=blocked_stock+? WHERE item_id=?", [it.good, it.bad, it.itemId]);
    await conn.query("INSERT INTO movements(item_id,user_id,type,qty_free_delta,qty_blocked_delta,note) VALUES(?,?,?,?,?,?)", [it.itemId, b.userId || 1, "QC", it.good, it.bad, "QC barang"]) }
  }); return ok({ success: true });
} catch (e) { return handleError(e); } }

export async function withdrawHandler(req: Request) { try { const b = await req.json(); await tx(async (conn) => {
  const [rows]: any = await conn.query("SELECT free_stock FROM stock WHERE item_id=?", [b.itemId]); if (rows[0].free_stock < b.qty) throw new ApiError(400, "Stok tidak cukup");
  await conn.query("UPDATE stock SET free_stock=free_stock-? WHERE item_id=?", [b.qty, b.itemId]);
  await conn.query("INSERT INTO movements(item_id,user_id,type,qty_free_delta,qty_blocked_delta,note,customer_name) VALUES(?,?,?,?,?,?,?)", [b.itemId, b.userId || 1, "OUTBOUND", -b.qty, 0, b.note, b.customerName]);
}); return ok({ success: true }); } catch (e) { return handleError(e); } }

export async function returnHandler(req: Request) { try { const b = await req.json(); await tx(async (conn) => {
  const [rows]: any = await conn.query("SELECT blocked_stock FROM stock WHERE item_id=?", [b.itemId]); if (rows[0].blocked_stock < b.qty) throw new ApiError(400, "Blocked tidak cukup");
  await conn.query("UPDATE stock SET blocked_stock=blocked_stock-? WHERE item_id=?", [b.qty, b.itemId]);
  await conn.query("INSERT INTO movements(item_id,user_id,type,qty_free_delta,qty_blocked_delta,note) VALUES(?,?,?,?,?,?)", [b.itemId, b.userId || 1, "RETURN", 0, -b.qty, "Return vendor"]);
}); return ok({ success: true }); } catch (e) { return handleError(e); } }
