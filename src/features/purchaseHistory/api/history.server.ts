import * as XLSX from "xlsx";
import { q } from "@/lib/db/queries";
import { ALLOWED_MOVEMENT_TYPES } from "@/lib/db/movement";
import { handleError, ok } from "@/lib/http/errors";

function where(req: Request) {
  const p = new URL(req.url).searchParams;
  const sql = ["movementType IN (?,?,?)"];
  const vals: unknown[] = [...ALLOWED_MOVEMENT_TYPES];
  const map = { from: "postingDate>=?", to: "postingDate<=?", userName: "userName=?", material: "partNumber=?", movementType: "movementType=?", plant: "plant=?" };
  for (const [k, col] of Object.entries(map)) {
    const v = p.get(k);
    if (v) {
      sql.push(col);
      vals.push(v);
    }
  }
  return { sql: sql.join(" AND "), vals };
}

export async function historyHandler(req: Request) {
  try {
    const f = where(req);
    const sql = `SELECT movementId id,partNumber item_name,userName user_name,movementType type,
      postingDate created_at,orderNo note,plant,purchaseOrder,quantity,amtInLocCur
      FROM material_movement WHERE ${f.sql} ORDER BY postingDate DESC,movementId DESC`;
    return ok(await q<any[]>(sql, f.vals));
  } catch (e) {
    return handleError(e);
  }
}

export async function historyExportHandler(req: Request) {
  try {
    const f = where(req);
    const rows = await q<any[]>(`SELECT partNumber,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName FROM material_movement WHERE ${f.sql}`, f.vals);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "history");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return new Response(buf, { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" } });
  } catch (e) {
    return handleError(e);
  }
}
