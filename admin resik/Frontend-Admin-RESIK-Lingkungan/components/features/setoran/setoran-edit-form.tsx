"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronLeft, HelpCircle, Loader2, Trash2 } from "lucide-react";
import Avatar from "@/components/ui/avatar";
import Modal from "@/components/ui/modal";
import { POIN_PER_KG } from "@/lib/dummy-data";
import type { MockJenisSampah, MockNasabah, MockSetoran, MockStatusSetoran } from "@/types/mock-data";

const JENIS_OPTIONS: MockJenisSampah[] = ["PLASTIK PET", "KERTAS/KARDUS", "LOGAM/BESI", "LAINNYA"];

const STATUS_OPTIONS: { value: MockStatusSetoran; label: string }[] = [
  { value: "Verifikasi", label: "Menunggu Verifikasi" },
  { value: "Berhasil", label: "Berhasil" },
  { value: "Ditolak", label: "Ditolak" },
];

const card = "rounded-2xl bg-white p-6 shadow-sm";
const labelCls = "mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500";
const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-forest";
const readonlyCls =
  "w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm text-gray-500";

export default function SetoranEditForm({
  setoran,
  nasabah,
}: {
  setoran: MockSetoran;
  nasabah?: MockNasabah;
}) {
  const router = useRouter();
  const [jenis, setJenis] = useState<MockJenisSampah>(setoran.jenis);
  const [berat, setBerat] = useState(String(setoran.berat));
  const [status, setStatus] = useState<MockStatusSetoran>(setoran.status);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const beratNum = parseFloat(berat.replace(",", ".")) || 0;
  const poinBaru = Math.round(beratNum * POIN_PER_KG[jenis]);
  const selisih = poinBaru - setoran.poin;
  const berubah = beratNum !== setoran.berat || poinBaru !== setoran.poin;

  async function handleSave() {
    if (beratNum <= 0) {
      setError("Berat harus lebih dari 0");
      return;
    }
    setError(null);
    setSaving(true);
    // TODO: ganti dengan pemanggilan API (services/setoran.service.ts)
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    router.push(`/setoran/detail/${setoran.id}`);
  }

  return (
    <div className="space-y-6 pb-10">
      {/* ---------- Header ---------- */}
      <div className="flex items-start gap-3">
        <Link
          href={`/setoran/detail/${setoran.id}`}
          aria-label="Kembali"
          className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:bg-gray-50"
        >
          <ChevronLeft size={16} />
        </Link>
        <div>
          <p className="text-xs text-gray-500">
            Kelola Setoran <span className="mx-1">&gt;</span>
            <span className="font-medium text-forest">Edit</span>
          </p>
          <h1 className="mt-1 text-xl font-bold text-forest">Edit Setoran</h1>
          <p className="text-[11px] text-gray-500">Perbarui data setoran {setoran.id}</p>
        </div>
      </div>

      {/* ---------- Banner peringatan ---------- */}
      <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        <AlertTriangle size={14} className="shrink-0" />
        Perubahan berat atau jenis sampah akan menghitung ulang poin nasabah secara otomatis.
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
        {/* ---------- Kolom kiri ---------- */}
        <div className="space-y-6">
          <section className={card}>
            <h3 className="mb-4 text-sm font-bold text-forest">Informasi Nasabah</h3>
            <div className="flex items-center gap-4">
              <Avatar name={setoran.nasabah} size={48} />
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase text-gray-400">Nama Nasabah</p>
                  <p className="text-sm font-bold text-gray-900">{setoran.nasabah}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase text-gray-400">ID Nasabah</p>
                  <p className="text-sm font-bold text-forest">{setoran.nasabahId}</p>
                </div>
              </div>
            </div>
            {nasabah && (
              <p className="mt-3 text-[11px] text-gray-500">
                {nasabah.telepon} · {nasabah.alamat}
              </p>
            )}
          </section>

          <section className={card}>
            <h3 className="mb-4 text-sm font-bold text-forest">Rincian Sampah</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Jenis Sampah</label>
                <select
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value as MockJenisSampah)}
                  className={inputCls}
                >
                  {JENIS_OPTIONS.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Berat (kg)</label>
                <input
                  inputMode="decimal"
                  value={berat}
                  onChange={(e) => {
                    setBerat(e.target.value.replace(/[^0-9.,]/g, ""));
                    setError(null);
                  }}
                  className={`${inputCls} ${error ? "border-red-400" : "border-forest/40 ring-1 ring-forest/20"}`}
                />
                {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
              </div>
              <div>
                <label className={labelCls}>Poin</label>
                <input
                  readOnly
                  value={`${poinBaru.toLocaleString("en-US")} pts`}
                  className={readonlyCls}
                />
              </div>
            </div>
          </section>

          <section className={card}>
            <h3 className="mb-4 text-sm font-bold text-forest">Pengaturan Setoran</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>ID Setoran</label>
                <input readOnly value={setoran.id} className={readonlyCls} />
              </div>
              <div>
                <label className={labelCls}>Status Setoran</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MockStatusSetoran)}
                  className={inputCls}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ---------- Tombol aksi ---------- */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600"
            >
              <Trash2 size={13} /> Hapus Setoran
            </button>
            <div className="flex items-center gap-3">
              <Link
                href={`/setoran/detail/${setoran.id}`}
                className="rounded-lg border-2 border-forest px-5 py-2.5 text-xs font-semibold text-forest hover:bg-forest/5"
              >
                Batal
              </Link>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-forest px-5 py-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-70"
              >
                {saving && <Loader2 size={13} className="animate-spin" />}
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>

        {/* ---------- Kolom kanan ---------- */}
        <aside className="space-y-6">
          <section className={`${card} border-l-4 border-forest`}>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-wide text-gray-500">
              Estimasi Ringkasan
            </p>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total Berat</span>
                <span className="flex items-baseline gap-2">
                  {berubah && (
                    <span className="text-[10px] text-gray-400 line-through">
                      {setoran.berat.toFixed(1)}
                    </span>
                  )}
                  <span className="text-lg font-bold text-forest">{beratNum.toFixed(1)} kg</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total Poin</span>
                <span className="flex items-baseline gap-2">
                  {berubah && (
                    <span className="text-[10px] text-gray-400 line-through">
                      {setoran.poin.toLocaleString("en-US")}
                    </span>
                  )}
                  <span className="text-xl font-bold text-forest">
                    {poinBaru.toLocaleString("en-US")}
                    <span className="ml-1 text-[10px]">pts</span>
                  </span>
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Selisih Poin</span>
                <span className={`font-bold ${selisih >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {selisih >= 0 ? "+" : ""}
                  {selisih.toLocaleString("en-US")} PTS
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Terakhir Diperbarui</span>
                <span className="font-semibold text-gray-800">{setoran.tanggal}</span>
              </div>
            </div>
          </section>

          <section className={card}>
            <h3 className="mb-3 text-sm font-bold text-forest">Aktivitas Terakhir</h3>
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
              <Avatar name="Andi Wijaya" size={26} />
              <div className="leading-tight">
                <p className="text-xs font-semibold text-gray-900">Andi Wijaya</p>
                <p className="text-[11px] text-gray-500">Mengubah berat sampah</p>
                <p className="mt-1 text-[10px] text-gray-400">{setoran.tanggal}</p>
              </div>
            </div>
          </section>

          <section className="flex gap-3 rounded-2xl bg-sand p-4">
            <HelpCircle size={16} className="mt-0.5 shrink-0 text-forest" />
            <div className="text-[11px] leading-relaxed text-gray-700">
              <p className="mb-0.5 text-xs font-bold text-forest">Butuh Bantuan?</p>
              Perubahan data setoran akan tercatat di riwayat aktivitas dan dapat dilihat oleh admin lain.
            </div>
          </section>
        </aside>
      </div>

      {/* ---------- Modal hapus ---------- */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <Trash2 size={20} />
        </div>
        <h2 className="text-center text-base font-bold text-forest">Hapus Setoran?</h2>
        <p className="mb-5 mt-2 text-center text-xs text-gray-500">
          Setoran <b>{setoran.id}</b> atas nama {setoran.nasabah} akan dihapus dan tidak bisa dikembalikan.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setDeleteOpen(false)}
            className="flex-1 rounded-lg border-2 border-forest py-2.5 text-xs font-semibold text-forest hover:bg-forest/5"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => router.push("/setoran")}
            className="flex-1 rounded-lg bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-700"
          >
            Ya, Hapus
          </button>
        </div>
      </Modal>
    </div>
  );
}