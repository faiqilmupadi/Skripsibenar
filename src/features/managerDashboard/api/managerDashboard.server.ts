import { q } from "@/lib/db/queries";
import { handleError, ok } from "@/lib/http/errors";

const OUTBOUND_TYPES = ["OUTBOUND", "GI", "201", "261"];

export async function adminPerformanceHandler(req: Request) { try {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") || "1970-01-01";
  const to = searchParams.get("to") || "2999-12-31";
  const list = await q<any[]>(`SELECT userName name,COUNT(*) total FROM material_movement
    WHERE postingDate BETWEEN ? AND ? GROUP BY userName`, [from, to]);
  const sum = list.reduce((a, b) => a + Number(b.total), 0) || 1;
  return ok(list.map((x) => ({ ...x, percent: (Number(x.total) / sum) * 100 })));
} catch (e) { return handleError(e); } }

export async function itemFsnHandler() { try {
  const marks = OUTBOUND_TYPES.map(() => "?").join(",");
  const list = await q<any[]>(`SELECT mm.materialDescription name,ms.freeStock,
    COALESCE(SUM(CASE WHEN mv.movementType IN (${marks}) THEN ABS(mv.quantity) ELSE 0 END),0) keluar
    FROM material_master mm JOIN material_stock ms ON ms.partNumber=mm.partNumber
    LEFT JOIN material_movement mv ON mv.partNumber=mm.partNumber AND mv.plant=ms.plant
    GROUP BY mm.partNumber,ms.plant ORDER BY keluar DESC LIMIT 10`, OUTBOUND_TYPES);
  return ok(list.map((x) => ({ name: x.name, ratio: x.keluar ? x.freeStock / x.keluar : 999, status: x.keluar === 0 ? "NON" : x.freeStock / x.keluar < 1 ? "FAST" : "SLOW", percent: x.keluar })));
} catch (e) { return handleError(e); } }

export async function assetTrendHandler() { try {
  const rows = await q<any[]>(`SELECT d.postingDate date,
    SUM(ms.freeStock * COALESCE((SELECT AVG(ABS(m2.amtInLocCur)/NULLIF(ABS(m2.quantity),0))
      FROM material_movement m2 WHERE m2.partNumber=ms.partNumber AND m2.quantity<>0),0)) value
    FROM material_stock ms CROSS JOIN (SELECT DISTINCT postingDate FROM material_movement) d
    LEFT JOIN material_movement m ON m.postingDate=d.postingDate GROUP BY d.postingDate ORDER BY d.postingDate`);
  const totals = await q<any[]>("SELECT SUM(freeStock) freeUnits,SUM(blocked) blockedUnits FROM material_stock");
  return ok({ trend: rows, value: rows.at(-1)?.value || 0, ...totals[0] });
} catch (e) { return handleError(e); } }
