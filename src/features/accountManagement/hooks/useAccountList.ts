"use client";
import useSWR from "swr";
import { accountsClient } from "@/features/accountManagement/api/accounts.client";
export const useAccountList = () => useSWR("accounts", accountsClient.list);
