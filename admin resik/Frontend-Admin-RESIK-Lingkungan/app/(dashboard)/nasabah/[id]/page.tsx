"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getNasabahById, getRiwayatNasabah } from "@/services/nasabah.service";
import type { Nasabah } from "@/types/nasabah";
import { formatRupiah } from "@/lib/utils";

type DepositHistory = {
  id: number;
  jenis: string;
  berat_kg: number;
  total_saldo: number;
  status: string;
  tanggal: string;
};

export default function NasabahDetailPage() {
  const params = useParams<{ id: string }>();
  const [nasabah, setNasabah] = useState<Nasabah | null>(null);
  const [history, setHistory] = useState<DepositHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
        getNasabahById(params.id),
        getRiwayatNasabah(params.id),
      ])
      .then(([profile, activity]) => {
        if (!active) return;
        setNasabah(profile.data);
        setHistory(activity.data as DepositHistory[]);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Gagal memuat detail nasabah.");
      });
    return () => { active = false; };
  }, [params.id]);

  if (error) return <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>;
  if (!nasabah) return <p className="text-sm text-gray-500">Memuat detail nasabah...</p>;

  return (
    <div className="space-y-5">
      <Link href="/nasabah" className="inline-flex items-center gap-2 text-sm font-semibold text-forest"><ArrowLeft size={16} /> Kembali ke nasabah</Link>
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-forest">{nasabah.nama}</h1>
        <p className="mt-1 text-sm text-gray-500">ID #{nasabah.id} · {nasabah.telepon}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <p><span className="text-xs text-gray-500">Email</span><br />{nasabah.email || "—"}</p>
          <p><span className="text-xs text-gray-500">Alamat</span><br />{nasabah.alamat || "—"}</p>
          <p><span className="text-xs text-gray-500">Saldo</span><br /><strong>{formatRupiah(Number(nasabah.saldo))}</strong></p>
          <p><span className="text-xs text-gray-500">Total setoran</span><br /><strong>{Number(nasabah.total_setoran).toLocaleString("id-ID")} kg</strong></p>
        </div>
      </section>
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-forest">Riwayat setoran</h2>
        {history.length === 0 ? <p className="text-sm text-gray-500">Belum ada riwayat setoran.</p> : (
          <div className="space-y-3">
            {history.map((deposit) => (
              <div key={deposit.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 text-sm">
                <div><p className="font-semibold">{deposit.jenis}</p><p className="text-xs text-gray-500">{Number(deposit.berat_kg).toLocaleString("id-ID")} kg · {new Date(deposit.tanggal).toLocaleDateString("id-ID")}</p></div>
                <div className="text-right"><p className="font-semibold text-forest">{formatRupiah(Number(deposit.total_saldo))}</p><p className="text-xs capitalize text-gray-500">{deposit.status}</p></div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
