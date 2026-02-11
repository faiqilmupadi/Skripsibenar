"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/features/auth/api/auth.client";

// 1) daftar route yang diizinkan (Typed Routes friendly)
type AppRoute =
  | "/admin/stok-barang"
  | "/kepala-gudang/dashboard-analisis";

type UserRole = "admin" | "kepala_gudang";

// 2) mapping role -> route (hasilnya literal union AppRoute)
const ROLE_REDIRECT: Record<UserRole, AppRoute> = {
  admin: "/admin/stok-barang",
  kepala_gudang: "/kepala-gudang/dashboard-analisis",
};

const DEFAULT_REDIRECT: AppRoute = "/admin/stok-barang";

// 3) tipe response login (sesuaikan dengan backend kamu)
type LoginResponse = {
  redirectTo?: string;
  role?: string; // backend bisa beda penulisan, kita normalize
};

// 4) guard supaya router.replace cuma terima AppRoute
function isAppRoute(v: unknown): v is AppRoute {
  return (
    v === "/admin/stok-barang" ||
    v === "/kepala-gudang/dashboard-analisis"
  );
}

function normalizeRole(role: unknown): UserRole | null {
  if (role === "admin") return "admin";
  if (role === "kepala_gudang") return "kepala_gudang";

  // variasi umum kalau backend pakai spasi / kapital
  if (role === "kepala gudang") return "kepala_gudang";
  if (role === "Kepala Gudang") return "kepala_gudang";

  return null;
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (username: string, password: string) => {
    try {
      setLoading(true);

      // NOTE: cast ke LoginResponse supaya TS tidak mengunci ke {redirectTo: string}
      const res = (await authClient.login({ username, password })) as LoginResponse;

      // Prioritas 1: redirectTo kalau memang salah satu route yang valid
      if (isAppRoute(res.redirectTo)) {
        router.replace(res.redirectTo);
        return;
      }

      // Prioritas 2: route berdasarkan role
      const role = normalizeRole(res.role);
      const roleRedirect = role ? ROLE_REDIRECT[role] : null;

      router.replace(roleRedirect ?? DEFAULT_REDIRECT);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Login gagal. Coba lagi.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, submit };
}
