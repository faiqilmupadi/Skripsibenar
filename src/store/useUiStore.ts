"use client";
import { create } from "zustand";
export const useUiStore = create<{ loading: boolean; setLoading: (v: boolean) => void }>((set) => ({ loading: false, setLoading: (loading) => set({ loading }) }));
