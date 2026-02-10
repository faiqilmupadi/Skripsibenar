import { fetcher } from "@/lib/http/fetcher";
import { mapHistoryRow } from "@/features/purchaseHistory/utils/history.mapper";

export const historyClient = {
  list: async () => (await fetcher<any[]>("/api/history")).map(mapHistoryRow),
  exportXlsx: () => window.open("/api/export/history.xlsx", "_blank")
};
