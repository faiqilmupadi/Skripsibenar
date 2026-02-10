"use client";
import { create } from "zustand";
export const useSessionStore = create<{ role?: string; setRole: (role: string) => void }>((set) => ({ setRole: (role) => set({ role }) }));
