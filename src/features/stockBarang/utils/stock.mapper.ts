import { formatDecimal } from "@/lib/utils/number";

export const stockDeltaText = (d: number) => (d > 0 ? `+${d}` : `${d}`);

export function mapStockRow(row: any) {
  return {
    id: row.partNumber,
    name: row.materialDescription,
    plant: row.plant,
    rop: Number(row.reorderPoint),
    freeStock: Number(row.freeStock),
    blockedStock: Number(row.blocked),
    safetyStock: Number(row.safetyStock),
    freeStockLabel: formatDecimal(row.freeStock),
    blockedStockLabel: formatDecimal(row.blocked),
    ropLabel: formatDecimal(row.reorderPoint)
  };
}
