import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Sistem Tampilan Pergudangan",
  description: "Warehouse dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
