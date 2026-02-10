"use client";
import useSWR from "swr";
import { itemsClient } from "@/features/itemCatalog/api/items.client";
export const useItemList = () => useSWR("items", itemsClient.list);
