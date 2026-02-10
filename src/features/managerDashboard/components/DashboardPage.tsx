"use client";
import { useAdminPerformance } from "@/features/managerDashboard/hooks/useAdminPerformance";
import { useAssetTrend } from "@/features/managerDashboard/hooks/useAssetTrend";
import { useItemFsn } from "@/features/managerDashboard/hooks/useItemFsn";
import { AdminPerformanceChart } from "@/features/managerDashboard/components/AdminPerformanceChart";
import { ItemFsnBarChart } from "@/features/managerDashboard/components/ItemFsnBarChart";
import { AssetTrendChart } from "@/features/managerDashboard/components/AssetTrendChart";
import { DashboardKpiCards } from "@/features/managerDashboard/components/DashboardKpiCards";

export function ManagerDashboardPage() {
  const a = useAdminPerformance(); const f = useItemFsn(); const t = useAssetTrend();
  return <section className="space-y-3"><DashboardKpiCards {...(t.data || {})} /><AdminPerformanceChart data={a.data || []} /><ItemFsnBarChart data={f.data || []} /><AssetTrendChart data={t.data?.trend || []} /></section>;
}
