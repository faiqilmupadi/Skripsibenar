"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function AdminPerformanceChart({ data, compact = false }: { data: any[]; compact?: boolean }) {
  return (
    <div className={compact ? "h-56" : "h-64 rounded-2xl bg-white p-3 shadow"}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="percent" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
