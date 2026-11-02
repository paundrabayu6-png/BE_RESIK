"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye, Plus, Search } from "lucide-react";
import Avatar from "@/components/ui/avatar";
import { getAllNasabah, updateStatusNasabah } from "@/services/nasabah.service";
import type { Nasabah } from "@/types/nasabah";
import { formatRupiah } from "@/lib/utils";

const PER_PAGE = 5;

export default function NasabahTable() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Nasabah[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getAllNasabah({ search: query, page, limit: PER_PAGE })
      .then((response) => {
        if (!active) return;
        setRows(response.data);
        setTotal(response.pagination.total);
        setTotalPages(Math.max(1, response.pagination.totalPages));
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Gagal memuat data nasabah.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [page, query]);

  async function toggleStatus(nasabah: Nasabah) {
    setLoading(true);
    setError(null);
    try {
      await updateStatusNasabah(nasabah.id, nasabah.status === "aktif" ? "nonaktif" : "aktif");
      const response = await getAllNasabah({ search: query, page, limit: PER_PAGE });
      setRows(response.data);
      setTotal(response.pagination.total);
      setTotalPages(Math.max(1, response.pagination.totalPages));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Status nasabah gagal diperbarui.");
    } finally {
      setLoading(false);
    }
  }

  const start = (page - 1) * PER_PAGE;

  return (
    <div className="rounded-2xl bg-sand p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
              setLoading(true);
              setError(null);
            }}
            placeholder="Cari nama atau nomor telepon..."
            className="w-full rounded-lg bg-white/80 py-2.5 pl-9 pr-3 text-xs outline-none placeholder:text-gray-400"
          />
        </div>
        <Link href="/nasabah/tambah" className="flex items-center gap-2 rounded-lg bg-forest px-4 py-2.5 text-xs font-semibold text-white">
          <Plus size={14} />
          Tambah Nasabah
        </Link>
      </div>

      {error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
      <div className="overflow-x-auto rounded-xl bg-white/60">
        <table className="w-full min-w-[820px] text-left text-xs">
          <thead className="bg-white text-[10px] uppercase tracking-wide text-gray-500">
            <tr>
              {["ID Nasabah", "Nama Nasabah", "Nomor Telepon", "Alamat", "Saldo", "Total Setoran", "Status", "Aksi"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-500">Memuat data nasabah...</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-500">Nasabah tidak ditemukan.</td></tr>}
            {!loading && rows.map((nasabah) => (
              <tr key={nasabah.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-semibold text-forest">{nasabah.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2"><Avatar name={nasabah.nama} size={30} /><span className="font-semibold text-gray-900">{nasabah.nama}</span></div>
                </td>
                <td className="px-4 py-3 text-gray-600">{nasabah.telepon}</td>
                <td className="max-w-48 px-4 py-3 text-gray-600">{nasabah.alamat || "—"}</td>
                <td className="px-4 py-3 font-bold text-gray-900">{formatRupiah(Number(nasabah.saldo))}</td>
                <td className="px-4 py-3 text-gray-800">{Number(nasabah.total_setoran).toLocaleString("id-ID")} kg</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => void toggleStatus(nasabah)}
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold ${nasabah.status === "aktif" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}
                    aria-label={`Ubah status ${nasabah.nama}`}
                    title="Klik untuk mengubah status"
                  >
                    {nasabah.status === "aktif" ? "Aktif" : "Nonaktif"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/nasabah/${nasabah.id}`} aria-label={`Lihat detail ${nasabah.nama}`} className="text-gray-600"><Eye size={15} /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
        <p>Menampilkan {total === 0 ? 0 : start + 1} hingga {Math.min(start + rows.length, total)} dari {total} nasabah</p>
        <div className="flex items-center gap-1">
          <button onClick={() => { setPage((current) => Math.max(1, current - 1)); setLoading(true); }} disabled={page === 1 || loading} className="rounded-lg p-2 disabled:opacity-40" aria-label="Sebelumnya"><ChevronLeft size={14} /></button>
          <span className="px-2">{page} / {totalPages}</span>
          <button onClick={() => { setPage((current) => Math.min(totalPages, current + 1)); setLoading(true); }} disabled={page === totalPages || loading} className="rounded-lg p-2 disabled:opacity-40" aria-label="Berikutnya"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
