"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/features/auth/api/auth.client";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const submit = async (username: string, password: string) => {
    try { setLoading(true); const res = await authClient.login({ username, password }); router.push(res.redirectTo); }
    catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  };
  return { loading, submit };
}
