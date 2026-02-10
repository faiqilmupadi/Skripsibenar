import * as XLSX from "xlsx";
import { q } from "@/lib/db/queries";
import { handleError, ok } from "@/lib/http/errors";

export async function historyHandler() { try { return ok(await q("SELECT m.id,m.type,m.note,m.customer_name,m.created_at,u.name user_name,i.name item_name FROM movements m JOIN users u ON u.id=m.user_id JOIN items i ON i.id=m.item_id ORDER BY m.created_at DESC")); } catch (e) { return handleError(e); } }

export async function historyExportHandler() { try {
  const rows = await q<any[]>("SELECT m.type,u.name user_name,i.name item_name,m.note,m.customer_name,m.created_at FROM movements m JOIN users u ON u.id=m.user_id JOIN items i ON i.id=m.item_id");
  const wb = XLSX.utils.book_new(); const ws = XLSX.utils.json_to_sheet(rows); XLSX.utils.book_append_sheet(wb, ws, "history");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return new Response(buf, { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" } });
} catch (e) { return handleError(e); } }
