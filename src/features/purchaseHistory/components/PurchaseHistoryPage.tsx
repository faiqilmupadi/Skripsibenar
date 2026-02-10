"use client";
import { useHistory } from "@/features/purchaseHistory/hooks/useHistory";
import { HistoryTable } from "@/features/purchaseHistory/components/HistoryTable";
import { HistoryFilters } from "@/features/purchaseHistory/components/HistoryFilters";
import { ExportButton } from "@/features/purchaseHistory/components/ExportButton";

export function PurchaseHistoryPage() {
  const { data = [] } = useHistory();
  return <section className="space-y-3"><h1 className="text-xl font-semibold">History Belanja</h1><HistoryFilters /><ExportButton /><HistoryTable data={data} /></section>;
}
