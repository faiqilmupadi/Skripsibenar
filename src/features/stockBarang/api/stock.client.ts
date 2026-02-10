import { fetcher } from "@/lib/http/fetcher";
export const stockClient = {
  list: () => fetcher<any[]>("/api/stock"),
  order: (x: any) => fetcher("/api/orders", { method: "POST", body: JSON.stringify(x) }),
  qc: (id: number, x: any) => fetcher(`/api/orders/${id}/qc`, { method: "POST", body: JSON.stringify(x) }),
  withdraw: (x: any) => fetcher("/api/stock/withdraw", { method: "POST", body: JSON.stringify(x) }),
  returnStock: (x: any) => fetcher("/api/stock/return", { method: "POST", body: JSON.stringify(x) })
};
