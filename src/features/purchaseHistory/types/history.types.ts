export type HistoryRow = {
  id: number;
  itemName: string;
  userName: string;
  type: string;
  movementType: "101" | "261" | "Z48";
  createdAt: string;
  note?: string;
};

export const formatType = (x: string) => x;
