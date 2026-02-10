"use client";
import { historyClient } from "@/features/purchaseHistory/api/history.client";
export const useHistoryExport = () => ({ exportXlsx: historyClient.exportXlsx });
