"use client";
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`w-full rounded bg-blue-600 px-3 py-2 text-white ${props.className || ""}`} />;
}
