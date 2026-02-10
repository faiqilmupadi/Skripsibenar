"use client";
import { stockClient } from "@/features/stockBarang/api/stock.client";
export const useReturn = () => ({ submitReturn: stockClient.returnStock });
