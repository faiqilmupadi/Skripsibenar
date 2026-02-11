"use client";

import { FormEvent, useState } from "react";
import { useLogin } from "@/features/auth/hooks/useLogin";

export function LoginForm() {
  const { loading, submit } = useLogin();
  const [username, setUsername] = useState("kepala");
  const [password, setPassword] = useState("password123");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(username, password);
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#ececec]">
      <section className="relative hidden w-1/2 items-center justify-center lg:flex">
        <div className="text-center text-slate-500">
          <h1 className="text-4xl font-bold tracking-tight">Warehouse System</h1>
          <p className="mt-4 text-base">Pantau stok, aset, dan pergerakan material secara real-time.</p>
        </div>
      </section>

      <section className="relative z-10 flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
          <h2 className="mb-6 text-center text-3xl font-semibold text-white">Sign in first!</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="h-12 w-full rounded-xl border-0 bg-white px-4 text-sm text-slate-700 outline-none ring-2 ring-transparent focus:ring-blue-300"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="h-12 w-full rounded-xl border-0 bg-white px-4 text-sm text-slate-700 outline-none ring-2 ring-transparent focus:ring-blue-300"
            />
            <button
              disabled={loading}
              className="mt-3 h-12 w-full rounded-xl bg-white font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </section>

      <div className="pointer-events-none absolute -right-[25%] top-1/2 h-[140vh] w-[95vw] -translate-y-1/2 rounded-full bg-blue-700" />
    </main>
  );
}
