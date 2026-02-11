import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function KepalaGudangLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#ececec]">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1200px] gap-6 px-4 py-6">
        <Sidebar role="KEPALA_GUDANG" />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
