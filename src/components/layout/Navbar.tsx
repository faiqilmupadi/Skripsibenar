"use client";
import { authClient } from "@/features/auth/api/auth.client";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const logout = async () => { await authClient.logout(); router.push("/login"); };
  return <header className="bg-blue-700 p-3 text-white"><div className="mx-auto flex max-w-7xl justify-between"><b>Warehouse</b><button onClick={logout}>Logout</button></div></header>;
}
