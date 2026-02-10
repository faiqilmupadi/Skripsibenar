import { fetcher } from "@/lib/http/fetcher";
export const accountsClient = {
  list: () => fetcher<any[]>("/api/users"),
  save: (payload: any, method = "POST") => fetcher("/api/users", { method, body: JSON.stringify(payload) }),
  resetPassword: (id: number, password: string) => fetcher(`/api/users/${id}/password`, { method: "PATCH", body: JSON.stringify({ password }) })
};
