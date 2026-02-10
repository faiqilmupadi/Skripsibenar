'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="card w-full space-y-3">
        <h1 className="text-center text-2xl font-semibold text-primary">Login Gudang</h1>
        <input className="input" placeholder="Username" onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} />
        <input className="input" placeholder="Password" type="password" onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
        <button
          className="btn-primary w-full"
          onClick={async () => {
            const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(form) });
            const json = await res.json();
            if (!res.ok) return toast.error(json.error ?? 'Login gagal');
            toast.success('Login berhasil');
            router.push(json.data.role === 'KEPALA_GUDANG' ? '/manager' : '/admin');
          }}
        >
          Masuk
        </button>
      </div>
    </main>
  );
}
