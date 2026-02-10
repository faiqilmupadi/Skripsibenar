export function mapHistoryRow(row: any) {
  return {
    id: Number(row.id),
    itemName: row.item_name,
    userName: row.user_name,
    type: row.type,
    createdAt: row.created_at,
    note: row.note
  };
}

export const formatType = (x: string) => x;
