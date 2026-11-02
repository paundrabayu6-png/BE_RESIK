"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  Check,
} from "lucide-react";

export default function EditSetoranAdminPage() {
  const params = useParams();
  const router = useRouter();
  const idSetoran = (params.id as string) || "STR-9922";

  const [berat, setBerat] = useState<number>(6.0);
  const [selectedJenis, setSelectedJenis] = useState("Kertas Karton");
  const [status, setStatus] = useState("Menunggu Verifikasi");

  // Perhitungan Poin Dinamis
  const totalPoinBaru = Math.round(berat * 100);
  const selisihPoin = totalPoinBaru - 520;

  return (
    <div className="space-y-6 pb-12 text-gray-800">
      {/* Top Header Navigation */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <Link href="/setoran" className="hover:underline">
            Kelola Setoran
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-medium text-gray-700">Edit</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/setoran/detail/${idSetoran}`}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Setoran</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Perbarui data setoran {idSetoran}.
            </p>
          </div>
        </div>
      </div>

      {/* Alert Info Banner */}
      <div className="bg-amber-100/70 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0 text-xs font-bold">
          📦
        </div>
        <p className="text-xs font-semibold text-amber-900">
          Perubahan berat atau jenis sampah akan menghitung ulang poin nasabah
          secara otomatis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Form Edit */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Informasi Nasabah */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-900">
                Informasi Nasabah
              </h3>
              <button className="text-gray-400 hover:text-gray-600">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden relative shrink-0 border-2 border-emerald-500">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Budi Santoso"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-x-8 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">
                    NAMA NASABAH
                  </span>
                  <span className="font-bold text-gray-900 text-sm">
                    Budi Santoso
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">
                    ID NASABAH
                  </span>
                  <span className="font-bold text-emerald-700 text-sm">
                    NSB-0512
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Rincian Sampah Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              Rincian Sampah
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  JENIS SAMPAH
                </label>
                <select
                  value={selectedJenis}
                  onChange={(e) => setSelectedJenis(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-3 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="Kertas Karton">Kertas Karton</option>
                  <option value="Plastik PET">Plastik PET</option>
                  <option value="Minyak Jelantah">Minyak Jelantah</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  BERAT (KG)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={berat}
                  onChange={(e) => setBerat(parseFloat(e.target.value) || 0)}
                  className="w-full border-2 border-emerald-600 rounded-xl px-3 py-2 text-sm text-gray-900 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  POIN
                </label>
                <div className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs text-gray-400 font-bold flex justify-between items-center">
                  <span>{totalPoinBaru}</span>
                  <span className="text-[10px]">PTS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Pengaturan Setoran */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              Pengaturan Setoran
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  ID SETORAN
                </label>
                <input
                  type="text"
                  disabled
                  value={`+ ${idSetoran}`}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  STATUS SETORAN
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="Menunggu Verifikasi">
                    Menunggu Verifikasi
                  </option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <span>✕</span>
              <span>Hapus Setoran</span>
            </button>

            <div className="flex items-center gap-3">
              <Link
                href={`/setoran/detail/${idSetoran}`}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Batal
              </Link>
              <button
                type="button"
                onClick={() => router.push(`/setoran/detail/${idSetoran}`)}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Sidebar Estimasi */}
        <div className="space-y-6">
          {/* Estimasi Ringkasan Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                ESTIMASI RINGKASAN
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Berat</span>
                <div className="text-right">
                  <span className="text-gray-300 line-through text-[11px] mr-1.5">
                    5.2 kg
                  </span>
                  <span className="font-bold text-gray-900 text-sm">
                    {berat.toFixed(1)} kg
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Poin</span>
                <div className="text-right">
                  <span className="text-gray-300 line-through text-[11px] block">
                    520 pts
                  </span>
                  <span className="font-extrabold text-emerald-800 text-xl">
                    {totalPoinBaru}
                    <span className="text-xs font-bold ml-0.5">pts</span>
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Selisih Poin</span>
                <span className="font-bold text-emerald-600">
                  +{selisihPoin} PTS
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Terakhir Diperbarui</span>
                <span className="font-bold text-gray-900">Hari ini, 12:45</span>
              </div>
            </div>
          </div>

          {/* Aktivitas Terakhir */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
            <h4 className="text-xs font-bold text-gray-900">
              Aktivitas Terakhir
            </h4>

            <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-100 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                  alt="Andi Wijaya"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h5 className="text-xs font-bold text-gray-900">Andi Wijaya</h5>
                <p className="text-[11px] text-gray-500">
                  Mengubah berat sampah
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  🕒 24 Okt 2023, 11:45
                </p>
              </div>
            </div>
          </div>

          {/* Card Bantuan */}
          <div className="bg-amber-100/60 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <div className="w-6 h-6 rounded-lg bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0 text-xs font-bold">
              🔔
            </div>
            <div className="text-xs text-amber-900 space-y-1">
              <h5 className="font-bold">Butuh Bantuan?</h5>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Perubahan data setoran yang sudah diverifikasi akan tercatat di
                log aktivitas sistem demi keamanan data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
