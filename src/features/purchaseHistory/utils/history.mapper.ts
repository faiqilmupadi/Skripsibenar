import { MaterialMovementRow } from "@/features/purchaseHistory/types/history.types";

export function mapHistoryRow(row: MaterialMovementRow) {
  return {
    movementId: Number(row.movementId),
    partNumber: row.partNumber,
    userName: row.userName || "-",
    movementType: row.movementType,
    postingDate: row.postingDate
  };
}

export const formatType = (x: string) => x;
