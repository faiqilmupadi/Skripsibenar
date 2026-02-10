"use client";
import { FormEvent, useState } from "react";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm() {
  const { loading, submit } = useLogin();
  const [username, setUsername] = useState("kepala");
  const [password, setPassword] = useState("password123");
  const onSubmit = (e: FormEvent) => { e.preventDefault(); submit(username, password); };
  return (
    <main className="mx-auto mt-24 max-w-md rounded bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-semibold text-blue-700">Login Gudang</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        <Button disabled={loading}>{loading ? "Memproses..." : "Masuk"}</Button>
      </form>
    </main>
  );
}
