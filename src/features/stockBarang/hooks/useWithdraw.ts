"use client";
import { stockClient } from "@/features/stockBarang/api/stock.client";
export const useWithdraw = () => ({ submitWithdraw: stockClient.withdraw });
