"use client";

import { useEffect, useState } from "react";
import { RefreshCw, UserCheck, UserPlus, Users } from "lucide-react";
import { getAllNasabah } from "@/services/nasabah.service";
import { getAllSetoran } from "@/services/setoran.service";

type Stats = { total: number; active: number; awaiting: number; deposits: number };

const cards = [
  { key: "total", label: "Total Nasabah", icon: Users, cls: "bg-blue-50 text-blue-600" },
  { key: "active", label: "Nasabah Aktif", icon: UserCheck, cls: "bg-emerald-50 text-emerald-600" },
  { key: "awaiting", label: "Menunggu Verifikasi", icon: UserPlus, cls: "bg-orange-50 text-orange-500" },
  { key: "deposits", label: "Total Setoran", icon: RefreshCw, cls: "bg-purple-50 text-purple-600" },
] as const;

export default function NasabahStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getAllNasabah({ limit: 1 }),
      getAllNasabah({ status: "aktif", limit: 1 }),
      getAllSetoran({ status: "menunggu", limit: 1 }),
      getAllSetoran({ limit: 1 }),
    ])
      .then(([all, active, waiting, deposits]) => setStats({
        total: all.pagination.total,
        active: active.pagination.total,
        awaiting: waiting.pagination.total,
        deposits: deposits.pagination.total,
      }))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Gagal memuat statistik nasabah."));
  }, []);

  return (
    <div>
      {error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ key, label, icon: Icon, cls }) => (
          <div key={key} className="flex items-center gap-3 rounded-2xl bg-sand p-4">
            <div className={`rounded-xl p-2.5 ${cls}`}><Icon size={18} /></div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
              <p className="text-xl font-bold text-forest">{stats ? stats[key].toLocaleString("id-ID") : "—"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
