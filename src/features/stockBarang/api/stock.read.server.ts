import { q } from "@/lib/db/queries";

export async function listStockRows() {
  return q<any[]>(`
    SELECT
      mm.partNumber,
      mm.materialDescription,
      ms.plant,
      ms.freeStock,
      ms.blocked,
      pd.reorderPoint,
      pd.safetyStock
    FROM material_master mm
    JOIN material_stock ms ON ms.partNumber = mm.partNumber
    JOIN material_plant_data pd ON pd.partNumber = ms.partNumber AND pd.plant = ms.plant
    ORDER BY mm.partNumber, ms.plant
  `);
}
