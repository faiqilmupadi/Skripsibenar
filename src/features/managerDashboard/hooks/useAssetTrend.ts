"use client";
import useSWR from "swr";
import { managerDashboardClient } from "@/features/managerDashboard/api/managerDashboard.client";

export function useAssetTrend() {
  return useSWR("assetTrend", managerDashboardClient.assetTrend);
}
