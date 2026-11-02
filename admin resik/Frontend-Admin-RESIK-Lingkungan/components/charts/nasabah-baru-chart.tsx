"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Segmented from "@/components/ui/segmented";
import { NASABAH_BARU } from "@/lib/dummy-data";

type Year = "2023" | "2024";

export default function NasabahBaruChart() {
  const [year, setYear] = useState<Year>("2024");

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-forest">Statistik Nasabah Baru</h3>
        <Segmented options={["2023", "2024"]} value={year} onChange={setYear} />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={NASABAH_BARU[year]} margin={{ left: -20, right: 8, top: 8 }}>
            <CartesianGrid stroke="#eee" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [`${v} orang`, "Nasabah baru"]} cursor={{ fill: "#f3f4f6" }} />
            <Bar dataKey="jumlah" fill="#3fa58a" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}