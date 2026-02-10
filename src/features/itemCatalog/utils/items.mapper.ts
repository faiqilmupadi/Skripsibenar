import { formatDecimal } from "@/lib/utils/number";

export type ItemDbRow = {
  code: string;
  name: string;
  unit: string;
  plant: string;
  reorderPoint: number;
  safetyStock: number;
  freeStock: number;
  blocked: number;
};

export function mapItemRow(row: ItemDbRow) {
  return {
    id: row.code,
    code: row.code,
    name: row.name,
    unit: row.unit,
    plant: row.plant,
    rop: Number(row.reorderPoint),
    safetyStock: Number(row.safetyStock || 0),
    freeStock: Number(row.freeStock || 0),
    blockedStock: Number(row.blocked || 0),
    freeStockLabel: formatDecimal(row.freeStock || 0)
  };
}
