"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Segmented from "@/components/ui/segmented";
import { SETORAN_BULANAN, SETORAN_MINGGUAN } from "@/lib/dummy-data";

type Mode = "Bulanan" | "Mingguan";

export default function SetoranChart() {
  const [mode, setMode] = useState<Mode>("Bulanan");
  const data = mode === "Bulanan" ? SETORAN_BULANAN : SETORAN_MINGGUAN;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-forest">Statistik Setoran</h3>
        <Segmented options={["Bulanan", "Mingguan"]} value={mode} onChange={setMode} />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [`${v} kg`, "Setoran"]} />
            <Area
              type="monotone"
              dataKey="kg"
              stroke="#0f6b4f"
              strokeWidth={2}
              fill="#0f6b4f"
              fillOpacity={0.08}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}