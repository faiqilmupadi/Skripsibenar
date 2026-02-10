"use client";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const color = (s: string) => (s === "FAST" ? "#ef4444" : s === "NON" ? "#22c55e" : "#f59e0b");
export function ItemFsnBarChart({ data }: { data: any[] }) {
  return <div className="h-64 rounded bg-white p-3 shadow"><ResponsiveContainer><BarChart data={data}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="ratio">{data.map((x, i) => <Cell key={i} fill={color(x.status)} />)}</Bar></BarChart></ResponsiveContainer></div>;
}
