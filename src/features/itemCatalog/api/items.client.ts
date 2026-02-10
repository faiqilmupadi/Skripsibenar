import { fetcher } from "@/lib/http/fetcher";
import { mapItemRow } from "@/features/itemCatalog/utils/items.mapper";

export const itemsClient = {
  list: async () => (await fetcher<any[]>("/api/items")).map(mapItemRow),
  save: (x: any, m = "POST") => fetcher("/api/items", { method: m, body: JSON.stringify(x) })
};
