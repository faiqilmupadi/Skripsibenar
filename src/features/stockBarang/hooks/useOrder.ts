"use client";
import { stockClient } from "@/features/stockBarang/api/stock.client";
export const useOrder = () => ({ submitOrder: stockClient.order });
