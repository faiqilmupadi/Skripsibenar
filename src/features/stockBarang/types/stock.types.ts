export type StockRow = {
  partNumber: string;
  materialDescription: string;
  plant: string;
  freeStock: number;
  blocked: number;
  reorderPoint: number;
};

export const stockDeltaText = (delta: number) => (delta > 0 ? `+${delta}` : `${delta}`);
