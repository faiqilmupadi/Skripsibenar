"use client";
import { stockClient } from "@/features/stockBarang/api/stock.client";
export const useQc = () => ({ submitQc: stockClient.qc });
