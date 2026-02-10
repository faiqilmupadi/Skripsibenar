import { q } from "@/lib/db/queries";
import { handleError, ok } from "@/lib/http/errors";

export async function itemsHandler(req: Request) { try {
  if (req.method === "GET") return ok(await q("SELECT i.*,s.free_stock,s.blocked_stock FROM items i LEFT JOIN stock s ON s.item_id=i.id"));
  const b = await req.json();
  if (req.method === "POST") { await q("INSERT INTO items(code,name,unit,price,rop,is_active) VALUES(?,?,?,?,?,1)", [b.code, b.name, b.unit, b.price, b.rop]); await q("INSERT INTO stock(item_id,free_stock,blocked_stock) VALUES(LAST_INSERT_ID(),0,0)"); }
  if (req.method === "PUT") await q("UPDATE items SET name=?,unit=?,price=?,rop=?,is_active=? WHERE id=?", [b.name, b.unit, b.price, b.rop, b.is_active, b.id]);
  return ok({ success: true });
} catch (e) { return handleError(e); } }
export async function itemActiveHandler(req: Request, id: string) { try { const b = await req.json(); await q("UPDATE items SET is_active=? WHERE id=?", [b.is_active, id]); return ok({ success: true }); } catch (e) { return handleError(e); } }
