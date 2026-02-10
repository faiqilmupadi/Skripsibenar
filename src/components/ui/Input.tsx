"use client";
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded border px-3 py-2 ${props.className || ""}`} />;
}
