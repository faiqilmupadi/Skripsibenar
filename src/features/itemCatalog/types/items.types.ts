export type MaterialMasterRow = {
  partNumber: string;
  materialDescription: string;
  baseUnitOfMeasure: string;
  createdOn: string;
  createTime: string | null;
  createdBy: string | null;
  materialGroup: string | null;
};

export type MaterialStockRow = {
  partNumber: string;
  plant: string;
  freeStock: number;
  blocked: number;
};

export type MaterialPlantDataRow = {
  partNumber: string;
  plant: string;
  reorderPoint: number;
  safetyStock: number;
};

export type Item = {
  partNumber: string;
  materialDescription: string;
  baseUnitOfMeasure: string;
  plant: string;
  freeStock: number;
  blocked: number;
  reorderPoint: number;
  safetyStock: number;
};

export const itemLabel = (item: Item) => `${item.partNumber} - ${item.materialDescription}`;
