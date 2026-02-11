"use client";

import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BarChart3, Clock3, LogOut, Package, UserRound } from "lucide-react";
import { authClient } from "@/features/auth/api/auth.client";

type SidebarRole = "KEPALA_GUDANG" | "ADMIN_GUDANG";

const menuByRole: Record<SidebarRole, { label: string; href: Route; icon: ReactNode }[]> = {
  KEPALA_GUDANG: [
    { label: "Dashboard Real Time", href: "/kepala-gudang/dashboard-analisis", icon: <BarChart3 size={16} /> },
    { label: "Manajemen Akun", href: "/kepala-gudang/manajemen-akun", icon: <UserRound size={16} /> },
    { label: "Katalog Barang", href: "/kepala-gudang/katalog-barang", icon: <Package size={16} /> },
    { label: "History Belanja", href: "/kepala-gudang/history-belanja", icon: <Clock3 size={16} /> }
  ],
  ADMIN_GUDANG: [
    { label: "Stok Barang", href: "/admin/stok-barang", icon: <Package size={16} /> },
    { label: "History Belanja", href: "/kepala-gudang/history-belanja", icon: <Clock3 size={16} /> }
  ]
};

export function Sidebar({ role = "KEPALA_GUDANG" }: { role?: SidebarRole }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-[calc(100vh-4rem)] w-64 flex-col rounded-2xl bg-blue-700 p-4 text-blue-50 shadow-xl">
      <nav className="space-y-2">
        {menuByRole[role].map((menu) => {
          const isActive = pathname.startsWith(menu.href);
          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-600"
              }`}
            >
              {menu.icon}
              <span>{menu.label}</span>
            </Link>
          );
        })}
      </nav>

      <form
        className="mt-auto"
        action={async () => {
          await authClient.logout();
          window.location.href = "/login";
        }}
      >
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-500 px-3 py-2 text-sm hover:bg-blue-600"
        >
          <LogOut size={16} /> Logout
        </button>
      </form>
    </aside>
  );
}
