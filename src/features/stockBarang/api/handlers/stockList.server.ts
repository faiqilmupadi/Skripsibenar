import { q } from "@/lib/db/queries";
import { handleError, ok } from "@/lib/http/errors";

export async function stockHandler() {
  try {
    const sql = `SELECT mm.partNumber,mm.materialDescription,pd.reorderPoint,
      ms.freeStock,ms.blocked,ms.plant FROM material_master mm
      JOIN material_stock ms ON ms.partNumber=mm.partNumber
      JOIN material_plant_data pd ON pd.partNumber=ms.partNumber AND pd.plant=ms.plant`;
    return ok(await q<any[]>(sql));
  } catch (e) {
    return handleError(e);
  }
}
