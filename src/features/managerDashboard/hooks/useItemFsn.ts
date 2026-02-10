"use client";
import useSWR from "swr";
import { managerDashboardClient } from "@/features/managerDashboard/api/managerDashboard.client";

export function useItemFsn() {
  return useSWR("itemFsn", managerDashboardClient.itemFsn);
}
