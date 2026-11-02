"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Camera,
  ChevronLeft,
  CupSoda,
  Check,
  Package,
  Pencil,
  Printer,
  ShieldAlert,
  Wrench,
  X,
} from "lucide-react";
import Avatar from "@/components/ui/avatar";
import { HARGA_PER_KG } from "@/lib/dummy-data";
import { formatRupiah } from "@/lib/utils";
import type { MockJenisSampah, MockNasabah, MockSetoran, MockStatusSetoran } from "@/types/mock-data";
import { ModalTolak, ModalVerifikasi } from "./modal-setoran";

const JENIS_ICON: Record<MockJenisSampah, { Icon: typeof Box; cls: string }> = {
  "PLASTIK PET": { Icon: CupSoda, cls: "bg-blue-50 text-blue-500" },
  "KERTAS/KARDUS": { Icon: Box, cls: "bg-orange-50 text-orange-500" },
  "LOGAM/BESI": { Icon: Wrench, cls: "bg-purple-50 text-purple-500" },
  LAINNYA: { Icon: Package, cls: "bg-red-50 text-red-500" },
};

const STATUS_PILL: Record<MockStatusSetoran, { label: string; cls: string }> = {
  Verifikasi: { label: "VERIFIKASI", cls: "bg-amber-100 text-amber-700" },
  Berhasil: { label: "BERHASIL", cls: "bg-emerald-100 text-emerald-700" },
  Ditolak: { label: "DITOLAK", cls: "bg-red-100 text-red-600" },
};

type StepState = "done" | "current" | "pending" | "rejected";

function buildSteps(status: MockStatusSetoran, tanggal: string) {
  const steps: { title: string; sub: string; state: StepState }[] = [
    { title: "Setoran Dibuat", sub: tanggal, state: "done" },
    {
      title: "Menunggu Verifikasi",
      sub: status === "Verifikasi" ? "Sedang diperiksa admin" : "Selesai diperiksa",
      state: status === "Verifikasi" ? "current" : "done",
    },
  ];
  if (status === "Berhasil") {
    steps.push({ title: "Setoran Berhasil", sub: "Poin masuk ke nasabah", state: "done" });
  } else if (status === "Ditolak") {
    steps.push({ title: "Setoran Ditolak", sub: "Lihat alasan penolakan", state: "rejected" });
  } else {
    steps.push({ title: "Berhasil", sub: "Belum diverifikasi", state: "pending" });
  }
  return steps;
}

const card = "rounded-2xl bg-white p-5 shadow-sm";
const btnBase =
  "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition";

export default function SetoranDetail({
  setoran,
  nasabah,
}: {
  setoran: MockSetoran;
  nasabah?: MockNasabah;
}) {
  const [status, setStatus] = useState<MockStatusSetoran>(setoran.status);
  const [alasan, setAlasan] = useState<string | null>(null);
  const [verifOpen, setVerifOpen] = useState(false);
  const [tolakOpen, setTolakOpen] = useState(false);

  const hargaPerKg = HARGA_PER_KG[setoran.jenis];
  const estimasiSaldo = setoran.berat * hargaPerKg;
  const { Icon, cls } = JENIS_ICON[setoran.jenis];
  const pill = STATUS_PILL[status];
  const canReview = status === "Verifikasi";
  const steps = buildSteps(status, setoran.tanggal);

  return (
    <div className="space-y-6 pb-10">
      {/* ---------- Header ---------- */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href="/setoran"
            aria-label="Kembali"
            className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </Link>
          <div>
            <p className="text-xs text-gray-500">
              Kelola Setoran <span className="mx-1">&gt;</span>
              <span className="font-medium text-forest">Detail</span>
            </p>
            <div className="mt-1 flex items-center gap-2">
              <h1 className="text-xl font-bold text-forest">{setoran.id}</h1>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${pill.cls}`}>
                {pill.label}
              </span>
            </div>
            <p className="text-[11px] text-gray-500">Dibuat: {setoran.tanggal}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className={`${btnBase} bg-white text-gray-700 shadow-sm hover:bg-gray-50`}
          >
            <Printer size={13} /> Cetak Bukti
          </button>
          <Link
            href={`/setoran/edit/${setoran.id}`}
            className={`${btnBase} bg-white text-gray-700 shadow-sm hover:bg-gray-50`}
          >
            <Pencil size={13} /> Edit
          </Link>
          {canReview && (
            <>
              <button
                type="button"
                onClick={() => setTolakOpen(true)}
                className={`${btnBase} border border-red-300 bg-white text-red-600 hover:bg-red-50`}
              >
                <X size={13} /> Tolak
              </button>
              <button
                type="button"
                onClick={() => setVerifOpen(true)}
                className={`${btnBase} bg-forest text-white hover:opacity-90`}
              >
                <Check size={13} /> Verifikasi Setoran
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        {/* ---------- Kolom kiri ---------- */}
        <div className="space-y-6">
          {/* Informasi Nasabah */}
          <section className={card}>
            <h3 className="mb-4 text-sm font-bold text-forest">Informasi Nasabah</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Avatar name={setoran.nasabah} size={64} />
              <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-gray-400">Nama Lengkap</p>
                    <p className="text-sm font-bold text-gray-900">{setoran.nasabah}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-gray-400">Nomor Telepon</p>
                    <p className="text-xs font-medium text-gray-800">{nasabah?.telepon ?? "-"}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-gray-400">ID Nasabah</p>
                    <p className="text-sm font-bold text-forest">{setoran.nasabahId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-gray-400">Alamat</p>
                    <p className="text-xs font-medium text-gray-800">{nasabah?.alamat ?? "-"}</p>
                  </div>
                </div>
              </div>
              <Link
                href={`/nasabah/${setoran.nasabahId}`}
                className="self-start rounded-md bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-forest hover:bg-emerald-100 print:hidden"
              >
                Lihat Profil
              </Link>
            </div>
          </section>

          {/* Rincian Sampah */}
          <section className={card}>
            <h3 className="mb-4 text-sm font-bold text-forest">Rincian Sampah</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-xs">
                <thead className="text-[10px] uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="pb-3 font-semibold">Jenis Sampah</th>
                    <th className="pb-3 font-semibold">Berat</th>
                    <th className="pb-3 font-semibold">Harga/kg</th>
                    <th className="pb-3 text-right font-semibold">Poin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${cls}`}>
                          <Icon size={15} />
                        </span>
                        <span className="font-semibold text-gray-900">{setoran.jenis}</span>
                      </div>
                    </td>
                    <td className="py-3 font-semibold text-gray-800">{setoran.berat.toFixed(1)} kg</td>
                    <td className="py-3 text-gray-500">{formatRupiah(hargaPerKg)}</td>
                    <td className="py-3 text-right font-bold text-forest">
                      {setoran.poin.toLocaleString("en-US")} pts
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase text-gray-500">
                Total Berat <span className="ml-2 text-sm font-bold text-gray-900">{setoran.berat.toFixed(1)} kg</span>
              </p>
              <p className="text-[10px] font-semibold uppercase text-gray-500">
                Total Poin{" "}
                <span className="ml-2 text-lg font-bold text-forest">
                  {setoran.poin.toLocaleString("en-US")}
                </span>{" "}
                <span className="text-[10px] text-forest">PTS</span>
              </p>
            </div>
          </section>

          {/* Foto & Catatan */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className={card}>
              <h3 className="mb-3 text-sm font-bold text-forest">Foto Bukti Timbangan</h3>
              <div className="flex h-44 flex-col items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-400">
                <Camera size={28} />
                <p className="text-[11px]">Foto belum tersedia</p>
              </div>
            </section>
            <section className={card}>
              <h3 className="mb-3 text-sm font-bold text-forest">Catatan Petugas</h3>
              <div className="rounded-xl bg-gray-50 p-4 text-xs italic leading-relaxed text-gray-600">
                “Nasabah membawa sampah dalam keadaan bersih dan sudah dipilah secara mandiri. Berat sudah sesuai
                dengan timbangan digital di lokasi.”
              </div>
            </section>
          </div>
        </div>

        {/* ---------- Kolom kanan ---------- */}
        <aside className="space-y-6">
          <section className={`${card} border-l-4 border-forest`}>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-wide text-gray-500">
              Ringkasan Setoran
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Berat</span>
                <span className="font-bold text-gray-900">{setoran.berat.toFixed(1)} kg</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-gray-500">Total Poin</span>
                <span className="text-2xl font-bold text-forest">
                  {setoran.poin.toLocaleString("en-US")}
                  <span className="ml-1 text-[10px]">pts</span>
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Estimasi Nilai Saldo</span>
                <span className="font-bold text-gray-900">{formatRupiah(estimasiSaldo)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tanggal Setoran</span>
                <span className="font-semibold text-gray-800">{setoran.tanggal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Petugas Lapangan</span>
                <span className="flex items-center gap-1.5 font-semibold text-gray-800">
                  Andi Wijaya <Avatar name="Andi Wijaya" size={18} />
                </span>
              </div>
            </div>
          </section>

          <section className={card}>
            <h3 className="mb-4 text-sm font-bold text-forest">Riwayat Status</h3>
            <ol className="space-y-5">
              {steps.map((s, i) => {
                const dot =
                  s.state === "done"
                    ? "bg-emerald-600 text-white"
                    : s.state === "current"
                      ? "border-2 border-amber-400 bg-white"
                      : s.state === "rejected"
                        ? "bg-red-500 text-white"
                        : "border-2 border-gray-200 bg-white";
                return (
                  <li key={s.title} className="relative flex gap-3">
                    {i < steps.length - 1 && (
                      <span className="absolute left-[9px] top-5 h-[calc(100%+4px)] w-px bg-gray-200" />
                    )}
                    <span className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${dot}`}>
                      {s.state === "done" && <Check size={11} />}
                      {s.state === "rejected" && <X size={11} />}
                      {s.state === "current" && <span className="h-2 w-2 rounded-full bg-amber-400" />}
                    </span>
                    <div className="leading-tight">
                      <p className={`text-xs font-semibold ${s.state === "pending" ? "text-gray-400" : "text-gray-900"}`}>
                        {s.title}
                      </p>
                      <p className="text-[10px] text-gray-400">{s.sub}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            {status === "Ditolak" && alasan && (
              <p className="mt-4 rounded-lg border-l-4 border-red-400 bg-red-50 p-3 text-[11px] text-red-700">
                Alasan: {alasan}
              </p>
            )}
          </section>

          {canReview && (
            <section className="flex gap-3 rounded-2xl bg-sand p-4">
              <ShieldAlert size={16} className="mt-0.5 shrink-0 text-forest" />
              <div className="text-[11px] leading-relaxed text-gray-700">
                <p className="mb-0.5 text-xs font-bold text-forest">Verifikasi Diperlukan</p>
                Mohon periksa kesesuaian berat sampah dan foto bukti timbangan sebelum menyetujui setoran ini.
              </div>
            </section>
          )}
        </aside>
      </div>

      <ModalVerifikasi
        isOpen={verifOpen}
        onClose={() => setVerifOpen(false)}
        onConfirm={() => {
          setStatus("Berhasil");
          setVerifOpen(false);
        }}
        idSetoran={setoran.id}
        totalPoin={setoran.poin}
        totalBerat={`${setoran.berat.toFixed(1)} kg`}
      />
      <ModalTolak
        isOpen={tolakOpen}
        onClose={() => setTolakOpen(false)}
        onConfirm={(a) => {
          setStatus("Ditolak");
          setAlasan(a);
          setTolakOpen(false);
        }}
        idSetoran={setoran.id}
      />
    </div>
  );
}