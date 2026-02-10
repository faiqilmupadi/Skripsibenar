"use client";
export function Modal({ open, title, children }: { open: boolean; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return <div className="fixed inset-0 bg-black/30 p-4"><div className="mx-auto max-w-lg rounded bg-white p-4"><h3>{title}</h3>{children}</div></div>;
}
