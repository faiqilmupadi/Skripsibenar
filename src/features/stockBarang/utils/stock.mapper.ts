export function mapStockRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    plant: row.plant,
    rop: Number(row.rop),
    freeStock: Number(row.free_stock),
    blockedStock: Number(row.blocked_stock)
  };
}

export const stockDeltaText = (d: number) => (d > 0 ? `+${d}` : `${d}`);
