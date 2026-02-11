import { StockRow } from "@/features/stockBarang/types/stock.types";

export function mapStockRow(row: StockRow) {
  return {
    partNumber: row.partNumber,
    materialDescription: row.materialDescription,
    plant: row.plant,
    reorderPoint: Number(row.reorderPoint),
    freeStock: Number(row.freeStock),
    blocked: Number(row.blocked)
  };
}

export const stockDeltaText = (d: number) => (d > 0 ? `+${d}` : `${d}`);
