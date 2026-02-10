export type StockRow = {
  id: string;
  name: string;
  plant: string;
  freeStock: number;
  blockedStock: number;
  rop: number;
};

export const stockDeltaText = (d: number) => (d > 0 ? `+${d}` : `${d}`);
