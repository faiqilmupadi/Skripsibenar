"use client";
import { AccountTable } from "@/features/accountManagement/components/AccountTable";
import { useAccountList } from "@/features/accountManagement/hooks/useAccountList";

export function AccountManagementPage() {
  const { data = [] } = useAccountList();
  return <section className="space-y-3"><h1 className="text-xl font-semibold">Manajemen Akun</h1><AccountTable data={data} /></section>;
}
