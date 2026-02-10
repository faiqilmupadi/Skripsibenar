import { fetcher } from "@/lib/http/fetcher";
export const itemsClient = { list: () => fetcher<any[]>("/api/items"), save: (x: any, m = "POST") => fetcher("/api/items", { method: m, body: JSON.stringify(x) }) };
