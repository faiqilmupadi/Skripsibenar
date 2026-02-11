"use client";

import { AccountTable } from "@/features/accountManagement/components/AccountTable";
import { useAccountList } from "@/features/accountManagement/hooks/useAccountList";

export function AccountManagementPage() {
  const { data = [] } = useAccountList();

  return (
    <section className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          className="rounded-xl bg-blue-50 px-6 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-100"
        >
          Tambah Data
        </button>
      </div>
      <AccountTable data={data} />
    </section>
  );
}
