"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function AssetTrendChart({ data, compact = false }: { data: any[]; compact?: boolean }) {
  return (
    <div className={compact ? "h-56" : "h-64 rounded-2xl bg-white p-3 shadow"}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line dataKey="value" stroke="#2563eb" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
