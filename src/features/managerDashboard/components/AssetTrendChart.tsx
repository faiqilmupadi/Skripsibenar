"use client";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function AssetTrendChart({ data }: { data: any[] }) {
  return <div className="h-64 rounded bg-white p-3 shadow"><ResponsiveContainer><LineChart data={data}><XAxis dataKey="date" /><YAxis /><Tooltip /><Line dataKey="value" stroke="#2563eb" /></LineChart></ResponsiveContainer></div>;
}
