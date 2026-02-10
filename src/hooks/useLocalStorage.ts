"use client";
export const useLocalStorage = <T,>(key: string, initial: T) => {
  const get = () => (typeof window === "undefined" ? initial : JSON.parse(localStorage.getItem(key) || JSON.stringify(initial)) as T);
  const set = (val: T) => localStorage.setItem(key, JSON.stringify(val));
  return { get, set };
};
