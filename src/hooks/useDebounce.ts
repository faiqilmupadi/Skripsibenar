"use client";
import { useEffect, useState } from "react";
export function useDebounce<T>(value: T, delay = 400) { const [state, setState] = useState(value); useEffect(() => { const t = setTimeout(() => setState(value), delay); return () => clearTimeout(t); }, [value, delay]); return state; }
