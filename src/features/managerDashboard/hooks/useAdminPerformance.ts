"use client";
import useSWR from "swr";
import { managerDashboardClient } from "@/features/managerDashboard/api/managerDashboard.client";

export function useAdminPerformance() {
  return useSWR("adminPerformance", managerDashboardClient.adminPerformance);
}
