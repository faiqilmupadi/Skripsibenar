"use client";
import { useItemList } from "@/features/itemCatalog/hooks/useItemList";
import { ItemTable } from "@/features/itemCatalog/components/ItemTable";

export function ItemCatalogPage() {
  const { data = [] } = useItemList();
  return <section className="space-y-3"><h1 className="text-xl font-semibold">Katalog Barang</h1><ItemTable data={data} /></section>;
}
