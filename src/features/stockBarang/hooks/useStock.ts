"use client";
import useSWR from "swr";
import { stockClient } from "@/features/stockBarang/api/stock.client";
export const useStock = () => useSWR("stock", stockClient.list);
