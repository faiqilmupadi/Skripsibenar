import { q } from "@/lib/db/queries";
import { handleError, ok } from "@/lib/http/errors";

export async function adminPerformanceHandler(req: Request) { try {
  const list = await q<any[]>("SELECT u.name,COUNT(m.id) total FROM users u LEFT JOIN movements m ON m.user_id=u.id GROUP BY u.id");
  const sum = list.reduce((a, b) => a + b.total, 0) || 1;
  return ok(list.map((x) => ({ ...x, percent: (x.total / sum) * 100 })));
} catch (e) { return handleError(e); } }

export async function itemFsnHandler() { try {
  const list = await q<any[]>("SELECT i.name,s.free_stock,COALESCE(SUM(CASE WHEN m.type='OUTBOUND' THEN ABS(m.qty_free_delta) END),0) keluar FROM items i JOIN stock s ON s.item_id=i.id LEFT JOIN movements m ON m.item_id=i.id GROUP BY i.id ORDER BY keluar DESC LIMIT 10");
  return ok(list.map((x) => ({ name: x.name, ratio: x.keluar ? x.free_stock / x.keluar : 999, status: x.keluar === 0 ? "NON" : x.free_stock / x.keluar < 1 ? "FAST" : "SLOW", percent: x.keluar })));
} catch (e) { return handleError(e); } }

export async function assetTrendHandler() { try {
  const now = await q<any[]>("SELECT SUM(s.free_stock*i.price) value,SUM(s.free_stock) freeUnits,SUM(s.blocked_stock) blockedUnits FROM stock s JOIN items i ON i.id=s.item_id");
  return ok({ trend: [{ date: new Date().toISOString().slice(0, 10), value: now[0].value || 0 }], ...now[0] });
} catch (e) { return handleError(e); } }
