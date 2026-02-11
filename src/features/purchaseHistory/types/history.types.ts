export type MaterialMovementRow = {
  movementId: number;
  partNumber: string;
  plant: string;
  materialDescription: string | null;
  postingDate: string;
  movementType: string;
  orderNo: string | null;
  purchaseOrder: string | null;
  quantity: number;
  baseUnitOfMeasure: string | null;
  amtInLocCur: number | null;
  userName: string | null;
};

export type HistoryRow = {
  movementId: number;
  partNumber: string;
  userName: string;
  movementType: string;
  postingDate: string;
};

export const formatType = (x: string) => x;
