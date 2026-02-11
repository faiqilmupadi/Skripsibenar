"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const color = (s: string) => (s === "FAST" ? "#ef4444" : s === "NON" ? "#22c55e" : "#f59e0b");

export function ItemFsnBarChart({ data, compact = false }: { data: any[]; compact?: boolean }) {
  return (
    <div className={compact ? "h-56" : "h-64 rounded-2xl bg-white p-3 shadow"}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="ratio" radius={[4, 4, 0, 0]}>
            {data.map((x, i) => (
              <Cell key={i} fill={color(x.status)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
