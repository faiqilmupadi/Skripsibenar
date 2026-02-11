import { fetcher } from "@/lib/http/fetcher";
import { mapAccountRow } from "@/features/accountManagement/utils/accounts.mapper";
import { UserDbRow } from "@/features/accountManagement/types/accounts.types";

export const accountsClient = {
  list: async () => (await fetcher<UserDbRow[]>("/api/users")).map(mapAccountRow),
  save: (payload: any, method = "POST") => fetcher("/api/users", { method, body: JSON.stringify(payload) }),
  resetPassword: (id: number, password: string) =>
    fetcher(`/api/users/${id}/password`, { method: "PATCH", body: JSON.stringify({ password }) })
};
