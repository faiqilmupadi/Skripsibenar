"use client";
import { mutate } from "swr";
import { accountsClient } from "@/features/accountManagement/api/accounts.client";

export function useAccountMutations() {
  const save = async (payload: any, method = "POST") => { await accountsClient.save(payload, method); mutate("accounts"); };
  return { save, resetPassword: accountsClient.resetPassword };
}
