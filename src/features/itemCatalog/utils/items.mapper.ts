export type ItemDbRow = {
  code: string;
  name: string;
  unit: string;
  plant: string;
  rop: number;
  safetyStock: number;
  free_stock: number;
  blocked_stock: number;
};

export function mapItemRow(row: ItemDbRow) {
  return {
    id: row.code,
    code: row.code,
    name: row.name,
    unit: row.unit,
    plant: row.plant,
    rop: Number(row.rop),
    safetyStock: Number(row.safetyStock || 0),
    freeStock: Number(row.free_stock || 0),
    blockedStock: Number(row.blocked_stock || 0)
  };
}
