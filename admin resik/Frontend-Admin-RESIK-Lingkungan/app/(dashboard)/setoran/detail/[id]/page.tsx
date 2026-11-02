"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  Printer,
  Edit3,
  ChevronRight,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

import {
  ModalVerifikasi,
  ModalTolak,
} from "@/components/features/setoran/modal-setoran";

export default function DetailSetoranPage() {
  const params = useParams();
  const idSetoran = (params.id as string) || "STR-9922";

  const [statusSetoran, setStatusSetoran] = useState<
    "VERIFIKASI" | "BERHASIL" | "DITOLAK"
  >("VERIFIKASI");
  const [isVerifikasiOpen, setIsVerifikasiOpen] = useState(false);
  const [isTolakOpen, setIsTolakOpen] = useState(false);
  const [alasanPenolakan, setAlasanPenolakan] = useState("");

  const handleVerifikasiSuccess = () => {
    setStatusSetoran("BERHASIL");
    setIsVerifikasiOpen(false);
  };

  const handleTolakSuccess = (alasan: string) => {
    setStatusSetoran("DITOLAK");
    setAlasanPenolakan(alasan);
    setIsTolakOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 text-gray-800">
      {/* BREADCRUMB & HEADER ACTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
            <Link href="/setoran" className="hover:underline">
              Kelola Setoran
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-medium text-gray-700">Detail</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/setoran"
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {idSetoran}
                </h1>
                {statusSetoran === "VERIFIKASI" && (
                  <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    VERIFIKASI
                  </span>
                )}
                {statusSetoran === "BERHASIL" && (
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    BERHASIL
                  </span>
                )}
                {statusSetoran === "DITOLAK" && (
                  <span className="bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    DITOLAK
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Dibuat 24 Okt 2023, 11:30
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 text-gray-600" />
            <span>Cetak Bukti</span>
          </button>

          {statusSetoran === "VERIFIKASI" && (
            <>
              <Link
                href={`/setoran/edit/${idSetoran}`}
                className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 className="w-4 h-4 text-gray-600" />
                <span>Edit</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsTolakOpen(true)}
                className="px-3.5 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Tolak
              </button>

              <button
                type="button"
                onClick={() => setIsVerifikasiOpen(true)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>Verifikasi Setoran</span>
              </button>
            </>
          )}
        </div>
      </div>

      {statusSetoran === "DITOLAK" && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-900 space-y-1">
          <h4 className="font-bold text-red-700">Setoran Ini Telah Ditolak</h4>
          <p className="text-gray-700">
            <span className="font-semibold">Alasan Penolakan:</span>{" "}
            {alasanPenolakan || "Sampah tidak sesuai ketentuan."}
          </p>
        </div>
      )}

      {/* GRID UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KOLOM KIRI */}
        <div className="lg:col-span-2 space-y-6">
          {/* INFORMASI NASABAH */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">
              Informasi Nasabah
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                    alt="Budi Santoso"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    NAMA LENGKAP
                  </span>
                  <h4 className="text-base font-bold text-gray-900">
                    Budi Santoso
                  </h4>
                  <div className="mt-1 space-y-0.5 text-xs text-gray-500">
                    <p>
                      <span className="font-medium text-gray-400">
                        NOMOR TELEPON:
                      </span>{" "}
                      0812 3456 7890
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end justify-between space-y-2">
                <Link
                  href="/nasabah/NSB-0512"
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold self-start sm:self-auto transition-colors"
                >
                  Lihat Profil
                </Link>
                <div className="text-xs text-gray-500 sm:text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    ID NASABAH
                  </p>
                  <p className="font-bold text-emerald-700">NSB-0512</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Jl. Mawar No. 12, Jakarta Selatan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RINCIAN SAMPAH */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Rincian Sampah</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">JENIS SAMPAH</th>
                    <th className="pb-3 text-center">BERAT</th>
                    <th className="pb-3 text-center">HARGA/KG</th>
                    <th className="pb-3 text-right">POIN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Plastik PET</p>
                          <p className="text-[10px] text-gray-400">
                            Kategori Plastik
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-center font-bold text-gray-800">
                      3.2 kg
                    </td>
                    <td className="py-3.5 text-center text-gray-500">
                      Rp 3.000
                    </td>
                    <td className="py-3.5 text-right font-bold text-emerald-700">
                      320 pts
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            Kertas Karton
                          </p>
                          <p className="text-[10px] text-gray-400">
                            Kategori Kertas
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-center font-bold text-gray-800">
                      2.0 kg
                    </td>
                    <td className="py-3.5 text-center text-gray-500">
                      Rp 2.000
                    </td>
                    <td className="py-3.5 text-right font-bold text-emerald-700">
                      200 pts
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold bg-gray-50/50 p-3 rounded-xl">
              <span className="text-gray-500 uppercase text-[10px]">
                TOTAL BERAT:{" "}
                <span className="text-gray-900 text-xs ml-1">5.2 kg</span>
              </span>
              <span className="text-gray-500 uppercase text-[10px]">
                TOTAL POIN:{" "}
                <span className="text-emerald-700 text-sm ml-1">520 PTS</span>
              </span>
            </div>
          </div>

          {/* BUKTI TIMBANGAN & CATATAN PETUGAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
              <h3 className="text-sm font-bold text-gray-900">
                Foto Bukti Timbangan
              </h3>
              <div className="h-44 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500"
                  alt="Bukti Timbangan"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  Catatan Petugas
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-xs italic text-gray-600 leading-relaxed">
                  &ldquo;Nasabah membawa sampah dalam keadaan bersih dan sudah
                  dipilah secara mandiri. Berat sudah sesuai dengan timbangan
                  digital di lokasi.&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="space-y-6">
          {/* RINGKASAN SETORAN */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              RINGKASAN SETORAN
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Total Berat</span>
                <span className="font-bold text-gray-900">5.2 kg</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Total Poin</span>
                <span className="text-base font-extrabold text-emerald-700">
                  520 <span className="text-xs font-normal">pts</span>
                </span>
              </div>
              <div className="flex justify-between text-gray-600 pt-2 border-t border-gray-50">
                <span>Estimasi Nilai Saldo</span>
                <span className="font-bold text-gray-900">Rp 15.600</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tanggal Setoran</span>
                <span className="font-medium text-gray-900">24 Okt 2023</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Petugas Lapangan</span>
                <span className="font-medium text-gray-900 flex items-center gap-1.5">
                  Andi Wijaya
                </span>
              </div>
            </div>
          </div>

          {/* RIWAYAT STATUS */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Riwayat Status
            </h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white ring-4 ring-white">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Setoran Dibuat
                  </p>
                  <p className="text-[10px] text-gray-400">
                    24 Okt 2023, 11:30
                  </p>
                </div>
              </div>

              <div className="relative">
                <div
                  className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full ${statusSetoran === "VERIFIKASI" ? "bg-amber-500 ring-4 ring-amber-100" : "bg-emerald-600 ring-4 ring-white"} flex items-center justify-center text-white`}
                >
                  <Clock className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Menunggu Verifikasi
                  </p>
                  <p className="text-[10px] text-amber-600 italic">
                    Sedang dalam antrian admin
                  </p>
                </div>
              </div>

              <div className="relative">
                <div
                  className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full ${statusSetoran === "BERHASIL" ? "bg-emerald-600 ring-4 ring-white" : "bg-gray-200"} flex items-center justify-center text-white`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div>
                  <p
                    className={`text-xs font-bold ${statusSetoran === "BERHASIL" ? "text-emerald-700" : "text-gray-400"}`}
                  >
                    Berhasil
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {statusSetoran === "BERHASIL"
                      ? "Setoran telah diverifikasi"
                      : "Belum selesai"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* WARNING INFO */}
          {statusSetoran === "VERIFIKASI" && (
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 text-xs space-y-1 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900">
                  Verifikasi Diperlukan
                </h4>
                <p className="text-amber-800 text-[11px] leading-relaxed mt-0.5">
                  Harap pastikan semua rincian sampah dan berat telah sesuai
                  dengan bukti foto sebelum menyetujui setoran ini.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DIALOGS */}
      <ModalVerifikasi
        isOpen={isVerifikasiOpen}
        onClose={() => setIsVerifikasiOpen(false)}
        onConfirm={handleVerifikasiSuccess}
        idSetoran={idSetoran}
        totalBerat="5.2 kg"
        totalPoin={520}
      />

      <ModalTolak
        isOpen={isTolakOpen}
        onClose={() => setIsTolakOpen(false)}
        onConfirm={handleTolakSuccess}
        idSetoran={idSetoran}
      />
    </div>
  );
}
