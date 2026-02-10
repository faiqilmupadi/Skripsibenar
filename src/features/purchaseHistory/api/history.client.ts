import { fetcher } from "@/lib/http/fetcher";
export const historyClient = { list: () => fetcher<any[]>("/api/history"), exportXlsx: () => window.open("/api/export/history.xlsx", "_blank") };
