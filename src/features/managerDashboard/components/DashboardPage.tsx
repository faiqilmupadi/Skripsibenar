"use client";

import { useAdminPerformance } from "@/features/managerDashboard/hooks/useAdminPerformance";
import { useAssetTrend } from "@/features/managerDashboard/hooks/useAssetTrend";
import { useItemFsn } from "@/features/managerDashboard/hooks/useItemFsn";
import { AdminPerformanceChart } from "@/features/managerDashboard/components/AdminPerformanceChart";
import { ItemFsnBarChart } from "@/features/managerDashboard/components/ItemFsnBarChart";
import { AssetTrendChart } from "@/features/managerDashboard/components/AssetTrendChart";

const rangeMenus = ["24H", "7D", "1M", "3M", "CUSTOM"];

export function ManagerDashboardPage() {
  const adminPerformance = useAdminPerformance();
  const itemFsn = useItemFsn();
  const assetTrend = useAssetTrend();

  return (
    <section className="space-y-6">
      <div className="inline-flex rounded-full bg-blue-300 p-1 text-xs font-semibold text-white shadow">
        {rangeMenus.map((menu, index) => (
          <button
            key={menu}
            type="button"
            className={`rounded-full px-4 py-1 ${index === 0 ? "bg-blue-600" : "hover:bg-blue-400"}`}
          >
            {menu}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-4xl font-medium text-slate-600">Top Barang</h2>
          <button type="button" className="rounded bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600">View Detail</button>
        </div>
        <ItemFsnBarChart data={itemFsn.data || []} compact />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-4xl font-medium text-slate-600">Asset Gudang</h2>
            <button type="button" className="text-xs font-semibold text-blue-600">View Detail</button>
          </div>
          <AssetTrendChart data={assetTrend.data?.trend || []} compact />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-4xl font-medium text-slate-600">Kinerja Admin</h2>
            <button type="button" className="text-xs font-semibold text-blue-600">View Detail</button>
          </div>
          <AdminPerformanceChart data={adminPerformance.data || []} compact />
        </div>
      </div>
    </section>
  );
}
