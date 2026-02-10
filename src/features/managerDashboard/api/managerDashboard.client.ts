import { fetcher } from "@/lib/http/fetcher";

export const managerDashboardClient = {
  adminPerformance: () => fetcher<any[]>("/api/dashboard/admin-performance"),
  itemFsn: () => fetcher<any[]>("/api/dashboard/item-fsn"),
  assetTrend: () => fetcher<any>("/api/dashboard/asset-trend")
};
