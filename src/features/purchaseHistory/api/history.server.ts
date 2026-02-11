import * as XLSX from "xlsx";
import { q } from "@/lib/db/queries";
import { handleError, ok } from "@/lib/http/errors";

function where(req: Request) {
  const params = new URL(req.url).searchParams;
  const clauses = ["1=1"];
  const values: unknown[] = [];
  const map = {
    from: "postingDate>=?",
    to: "postingDate<=?",
    userName: "userName=?",
    material: "partNumber=?",
    movementType: "movementType=?",
    plant: "plant=?"
  } as const;

  for (const [key, clause] of Object.entries(map)) {
    const value = params.get(key);
    if (!value) continue;
    clauses.push(clause);
    values.push(value);
  }

  return { sql: clauses.join(" AND "), values };
}

export async function historyHandler(req: Request) {
  try {
    const filters = where(req);
    const sql = `SELECT movementId,partNumber,userName,movementType,postingDate,orderNo,
      plant,purchaseOrder,quantity,amtInLocCur FROM material_movement WHERE ${filters.sql}
      ORDER BY postingDate DESC,partNumber DESC`;
    return ok(await q<any[]>(sql, filters.values));
  } catch (e) {
    return handleError(e);
  }
}

export async function historyExportHandler(req: Request) {
  try {
    const filters = where(req);
    const rows = await q<any[]>(`SELECT movementId,partNumber,plant,materialDescription,postingDate,movementType,
      orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName
      FROM material_movement WHERE ${filters.sql}`,
    filters.values);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "history");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new Response(buf, {
      headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
    });
  } catch (e) {
    return handleError(e);
  }
}
