"use client";
import { mutate } from "swr";
import { itemsClient } from "@/features/itemCatalog/api/items.client";
export const useItemMutations = () => ({ save: async (x: any, m = "POST") => { await itemsClient.save(x, m); mutate("items"); } });
