import { fetcher } from "@/lib/http/fetcher";
import { mapStockRow } from "@/features/stockBarang/utils/stock.mapper";

export const stockClient = {
  list: async () => (await fetcher<any[]>("/api/stock")).map(mapStockRow),
  order: (x: any) => fetcher("/api/orders", { method: "POST", body: JSON.stringify(x) }),
  qc: (id: number, x: any) => fetcher(`/api/orders/${id}/qc`, { method: "POST", body: JSON.stringify(x) }),
  withdraw: (x: any) => fetcher("/api/stock/withdraw", { method: "POST", body: JSON.stringify(x) }),
  returnStock: (x: any) => fetcher("/api/stock/return", { method: "POST", body: JSON.stringify(x) })
};
