"use client";
import { useStock } from "@/features/stockBarang/hooks/useStock";
import { StockTable } from "@/features/stockBarang/components/StockTable";
import { RopAlertsPanel } from "@/features/stockBarang/components/RopAlertsPanel";

export function StockBarangPage() {
  const { data = [] } = useStock();
  return <section className="space-y-3"><h1 className="text-xl font-semibold">Stok Barang</h1><RopAlertsPanel data={data} /><StockTable data={data} /></section>;
}
