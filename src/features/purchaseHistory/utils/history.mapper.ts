export const formatType = (x: string) => ({ "101": "Order/QC Inbound", "261": "Withdraw Bengkel", Z48: "Claim Vendor" }[x] || x);

export function mapHistoryRow(row: any) {
  return {
    id: Number(row.movementId),
    itemName: row.material,
    userName: row.userName,
    type: formatType(row.movementType),
    movementType: row.movementType,
    createdAt: row.postingDate,
    note: row.orderNo
  };
}
