'use client';

import { useRouter } from 'next/navigation';

export function Topbar({ title }: { title: string }) {
  const router = useRouter();
  return (
    <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
      <h1 className="text-2xl font-semibold text-primary">{title}</h1>
      <button
        className="rounded-lg border border-slate-300 px-3 py-2"
        onClick={async () => {
          await fetch('/api/auth/logout', { method: 'POST' });
          router.push('/login');
        }}
      >
        Logout
      </button>
    </div>
  );
}
