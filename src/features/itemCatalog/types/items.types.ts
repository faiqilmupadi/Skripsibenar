export type Item = {
  id: string;
  code: string;
  name: string;
  unit: string;
  plant: string;
  freeStock: number;
  blockedStock: number;
  rop: number;
};

export const itemLabel = (x: Item) => `${x.code} - ${x.name}`;
