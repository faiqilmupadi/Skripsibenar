import { Item, MaterialPlantDataRow, MaterialStockRow, MaterialMasterRow } from "@/features/itemCatalog/types/items.types";

type ItemDbRow = MaterialMasterRow & MaterialStockRow & MaterialPlantDataRow;

export function mapItemRow(row: ItemDbRow): Item {
  return {
    partNumber: row.partNumber,
    materialDescription: row.materialDescription,
    baseUnitOfMeasure: row.baseUnitOfMeasure,
    plant: row.plant,
    reorderPoint: Number(row.reorderPoint || 0),
    safetyStock: Number(row.safetyStock || 0),
    freeStock: Number(row.freeStock || 0),
    blocked: Number(row.blocked || 0)
  };
}
