import Link from "next/link";

const menus = [
  ["Analisis", "/dashboard/kepala-gudang/dashboard-analisis"],
  ["Manajemen Akun", "/dashboard/kepala-gudang/manajemen-akun"],
  ["Katalog", "/dashboard/kepala-gudang/katalog-barang"],
  ["History", "/dashboard/kepala-gudang/history-belanja"],
  ["Stok Admin", "/dashboard/admin/stok-barang"]
];

export function Sidebar() {
  return <aside className="w-64 rounded bg-white p-3 shadow">{menus.map(([l,h]) => <Link key={h} href={h} className="block rounded p-2 hover:bg-blue-50">{l}</Link>)}</aside>;
}
