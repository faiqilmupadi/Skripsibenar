import { fetcher } from "@/lib/http/fetcher";

export const authClient = {
  login: (payload: { username: string; password: string }) => fetcher<{ redirectTo: string }>("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => fetcher<{ success: boolean }>("/api/auth/logout", { method: "POST" })
};
