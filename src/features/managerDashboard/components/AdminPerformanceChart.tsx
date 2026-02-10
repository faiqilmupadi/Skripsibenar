"use client";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function AdminPerformanceChart({ data }: { data: any[] }) {
  return <div className="h-64 rounded bg-white p-3 shadow"><ResponsiveContainer><BarChart data={data}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="percent" fill="#2563eb" /></BarChart></ResponsiveContainer></div>;
}
