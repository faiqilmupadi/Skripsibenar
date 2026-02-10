"use client";
import useSWR from "swr";
import { stockClient } from "@/features/stockBarang/api/stock.client";
export const useRopAlerts = () => useSWR("stock", stockClient.list);
