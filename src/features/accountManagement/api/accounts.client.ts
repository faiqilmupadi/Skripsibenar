import { fetcher } from "@/lib/http/fetcher";
import { mapAccountRow } from "@/features/accountManagement/utils/accounts.mapper";

export const accountsClient = {
  list: async () => (await fetcher<any[]>("/api/users")).map(mapAccountRow),
  save: (payload: any, method = "POST") => fetcher("/api/users", { method, body: JSON.stringify(payload) }),
  resetPassword: (id: number, password: string) => fetcher(`/api/users/${id}/password`, { method: "PATCH", body: JSON.stringify({ password }) })
};
