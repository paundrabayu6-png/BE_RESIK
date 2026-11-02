"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Plus,
  Search,
} from "lucide-react";
import Avatar from "@/components/ui/avatar";
import { JenisBadge, StatusBadge } from "./status-badge";
import { getAllSetoran, verifikasiSetoran } from "@/services/setoran.service";
import type { Setoran, StatusSetoran } from "@/types/setoran";

const PER_PAGE = 5;
const JENIS = [
  "Semua",
  "Plastik",
  "Kertas",
  "Logam",
  "Lainnya",
] as const;
const STATUS: ("Semua" | StatusSetoran)[] = ["Semua", "menunggu", "verifikasi", "diterima", "ditolak"];

const filterCls =
  "rounded-lg bg-white/80 px-3 py-2.5 text-xs text-gray-700 outline-none";

export default function SetoranTable() {
  const [query, setQuery] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jenis, setJenis] = useState<(typeof JENIS)[number]>("Semua");
  const [status, setStatus] = useState<"Semua" | StatusSetoran>("Semua");
  const [page, setPage] = useState(1);
  const [deposits, setDeposits] = useState<Setoran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getAllSetoran({ search: query, status: status === "Semua" ? undefined : status, limit: 100 })
      .then((response) => {
        if (active) setDeposits(response.data);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Gagal memuat data setoran.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [query, status]);

  const filtered = useMemo(() => {
    return deposits.filter(
      (s) => (jenis === "Semua" || s.jenis.toLowerCase().includes(jenis.toLowerCase())) &&
        (!tanggal || new Date(s.tanggal).toISOString().slice(0, 10) === tanggal),
    );
  }, [deposits, tanggal, jenis]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PER_PAGE;
  const rows = filtered.slice(start, start + PER_PAGE);

  async function verifyDeposit(deposit: Setoran, decision: "diterima" | "ditolak") {
    setLoading(true);
    setError(null);
    try {
      await verifikasiSetoran(deposit.id, decision);
      const response = await getAllSetoran({ search: query, status: status === "Semua" ? undefined : status, limit: 100 });
      setDeposits(response.data);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Setoran gagal diverifikasi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-sand p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
              setLoading(true);
              setError(null);
            }}
            placeholder="Cari nasabah atau ID setoran..."
            className="w-full rounded-lg bg-white/80 py-2.5 pl-9 pr-3 text-xs outline-none placeholder:text-gray-400"
          />
        </div>
        <input
          type="date"
          value={tanggal}
          onChange={(e) => {
            setTanggal(e.target.value);
            setPage(1);
          }}
          className={filterCls}
          aria-label="Filter tanggal"
        />
        <select
          value={jenis}
          onChange={(e) => {
            setJenis(e.target.value as (typeof JENIS)[number]);
            setPage(1);
          }}
          className={filterCls}
        >
          {JENIS.map((j) => (
            <option key={j} value={j}>
              Jenis: {j}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as typeof status);
            setPage(1);
            setLoading(true);
            setError(null);
          }}
          className={filterCls}
        >
          {STATUS.map((s) => (
            <option key={s} value={s}>
              Status: {s === "Semua" ? s : s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <Link
          href="/setoran/tambah"
          className="flex items-center gap-2 rounded-lg bg-forest px-4 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={14} />
          Tambah Setoran
        </Link>
      </div>

      {error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
      <div className="overflow-x-auto rounded-xl bg-white/60">
        <table className="w-full min-w-[820px] text-left text-xs">
          <thead className="bg-white text-[10px] uppercase tracking-wide text-gray-500">
            <tr>
              {[
                "ID Setoran",
                "Nasabah",
                "Jenis Sampah",
                "Berat (Kg)",
                "Poin",
                "Tanggal",
                "Status",
                "Aksi",
              ].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-500">Memuat data setoran...</td></tr>}
            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  Setoran tidak ditemukan.
                </td>
              </tr>
            )}
            {!loading && rows.map((s) => (
              <tr key={s.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-semibold text-forest">{s.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={s.nasabah} size={30} />
                    <div className="leading-tight">
                      <p className="font-semibold text-gray-900">{s.nasabah}</p>
                      <p className="text-[10px] text-gray-400">ID #{s.nasabah_id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <JenisBadge jenis={s.jenis} />
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">
                  {Number(s.berat_kg).toFixed(1)} kg
                </td>
                <td className="px-4 py-3 font-bold text-forest">
                  {Number(s.total_saldo).toLocaleString("id-ID")} Rp
                </td>
                <td className="px-4 py-3 text-gray-600">{new Date(s.tanggal).toLocaleDateString("id-ID")}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Link
                      href={`/setoran/detail/${s.id}`}
                      aria-label="Lihat detail"
                      className="hover:text-forest"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      href={`/setoran/edit/${s.id}`}
                      aria-label="Edit"
                      className="hover:text-forest"
                    >
                      <Edit size={15} />
                    </Link>
                    {(s.status === "menunggu" || s.status === "verifikasi") && (
                      <>
                        <button type="button" onClick={() => void verifyDeposit(s, "diterima")} className="font-semibold text-emerald-700" aria-label="Terima setoran">✓</button>
                        <button type="button" onClick={() => void verifyDeposit(s, "ditolak")} className="font-semibold text-red-600" aria-label="Tolak setoran">×</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
        <p>
          Menampilkan {filtered.length === 0 ? 0 : start + 1} hingga{" "}
          {start + rows.length} dari {filtered.length} setoran
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, current - 1))}
            disabled={current === 1}
            className="rounded-lg p-2 disabled:opacity-40"
            aria-label="Sebelumnya"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-lg font-semibold ${p === current ? "bg-forest text-white" : "text-gray-600"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, current + 1))}
            disabled={current === totalPages}
            className="rounded-lg p-2 disabled:opacity-40"
            aria-label="Berikutnya"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}