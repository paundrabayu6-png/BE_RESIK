"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  FileText,
  FileSpreadsheet,
  FileCode,
  Calendar,
  Clock,
} from "lucide-react";

interface ModalEksporLogProps {
  isOpen: boolean;
  onClose: () => void;
  onUnduh?: (data: {
    format: "csv" | "xlsx" | "pdf";
    periode: string;
    tanggalMulai?: string;
    tanggalSelesai?: string;
  }) => void;
}

export default function ModalEksporLogAktivitas({
  isOpen,
  onClose,
  onUnduh,
}: ModalEksporLogProps) {
  const [periode, setPeriode] = useState<string>("30_hari");
  const [format, setFormat] = useState<"csv" | "xlsx" | "pdf">("csv");
  const [tanggalMulai, setTanggalMulai] = useState<string>("");
  const [tanggalSelesai, setTanggalSelesai] = useState<string>("");
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    if (onUnduh) {
      await onUnduh({
        format,
        periode,
        tanggalMulai: periode === "custom" ? tanggalMulai : undefined,
        tanggalSelesai: periode === "custom" ? tanggalSelesai : undefined,
      });
    } else {
      // Simulasi proses unduh
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setIsExporting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#025E43]/10 text-[#025E43] flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Ekspor Log Aktivitas
              </h3>
              <p className="text-[11px] text-gray-500">
                Unduh rekam jejak aktivitas nasabah
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="space-y-4 text-xs">
          {/* Pilih Periode / Filter Tanggal */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5">
              Pilih Rentang Waktu / Tanggal
            </label>
            <div className="relative">
              <select
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800 font-medium focus:outline-none focus:border-[#025E43] cursor-pointer appearance-none"
              >
                <option value="7_hari">7 Hari Terakhir</option>
                <option value="30_hari">30 Hari Terakhir</option>
                <option value="bulan_ini">Bulan Ini</option>
                <option value="bulan_lalu">Bulan Lalu</option>
                <option value="custom">Pilih Tanggal Manual (Kustom)</option>
              </select>
              <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Form Tanggal Kustom */}
          {periode === "custom" && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div>
                <label className="block text-[11px] text-gray-600 font-medium mb-1">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 focus:outline-none focus:border-[#025E43]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 font-medium mb-1">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  value={tanggalSelesai}
                  onChange={(e) => setTanggalSelesai(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 focus:outline-none focus:border-[#025E43]"
                />
              </div>
            </div>
          )}

          {/* Pilih Format Berkas (3 Format) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5">
              Format Dokumen
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Option 1: CSV */}
              <button
                type="button"
                onClick={() => setFormat("csv")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  format === "csv"
                    ? "border-[#025E43] bg-emerald-50/60 text-[#025E43] font-bold shadow-xs"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FileCode
                  className={`w-5 h-5 ${format === "csv" ? "text-[#025E43]" : "text-gray-500"}`}
                />
                <span className="text-xs">CSV</span>
                <span className="text-[9px] text-gray-400 font-normal">
                  Data Mentah
                </span>
              </button>

              {/* Option 2: Excel */}
              <button
                type="button"
                onClick={() => setFormat("xlsx")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  format === "xlsx"
                    ? "border-[#025E43] bg-emerald-50/60 text-[#025E43] font-bold shadow-xs"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FileSpreadsheet
                  className={`w-5 h-5 ${format === "xlsx" ? "text-emerald-600" : "text-gray-500"}`}
                />
                <span className="text-xs">Excel (.xlsx)</span>
                <span className="text-[9px] text-gray-400 font-normal">
                  Tabel Olah
                </span>
              </button>

              {/* Option 3: PDF */}
              <button
                type="button"
                onClick={() => setFormat("pdf")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  format === "pdf"
                    ? "border-[#025E43] bg-emerald-50/60 text-[#025E43] font-bold shadow-xs"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FileText
                  className={`w-5 h-5 ${format === "pdf" ? "text-red-500" : "text-gray-500"}`}
                />
                <span className="text-xs">PDF</span>
                <span className="text-[9px] text-gray-400 font-normal">
                  Siap Cetak
                </span>
              </button>
            </div>
          </div>

          {/* Catatan Info */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-[11px] text-emerald-900 leading-relaxed flex items-start gap-2">
            <Clock className="w-4 h-4 text-[#025E43] shrink-0 mt-0.5" />
            <span>
              Berkas akan mencakup waktu aktivitas, nama nasabah, jenis
              tindakan, dan lokasi/perangkat.
            </span>
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="bg-[#025E43] hover:bg-[#024a35] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? "Memproses..." : "Unduh Berkas"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
