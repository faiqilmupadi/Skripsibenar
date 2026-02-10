"use client";
import useSWR from "swr";
import { historyClient } from "@/features/purchaseHistory/api/history.client";
export const useHistory = () => useSWR("history", historyClient.list);
