export type HistoryRow = {
  id: number;
  itemName: string;
  userName: string;
  type: string;
  createdAt: string;
};

export const formatType = (x: string) => x;
