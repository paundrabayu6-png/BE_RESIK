"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

interface ModalVerifikasiProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  idSetoran: string;
  totalPoin: number;
  totalBerat: string;
}

export function ModalVerifikasi({
  isOpen,
  onClose,
  onConfirm,
  idSetoran,
  totalPoin,
  totalBerat,
}: ModalVerifikasiProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5 relative">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Verifikasi Setoran?
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Apakah Anda yakin ingin menyetujui setoran{" "}
              <span className="font-bold text-gray-800">{idSetoran}</span>?
            </p>
          </div>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Total Berat Sampah</span>
            <span className="font-bold text-gray-900">{totalBerat}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Poin Ditambahkan ke Nasabah</span>
            <span className="font-extrabold text-emerald-700">
              +{totalPoin} PTS
            </span>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 text-center italic">
          *Poin akan secara otomatis ditambahkan ke saldo akun nasabah.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Ya, Verifikasi
          </button>
        </div>
      </div>
    </div>
  );
}

interface ModalTolakProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (alasan: string) => void;
  idSetoran: string;
}

export function ModalTolak({
  isOpen,
  onClose,
  onConfirm,
  idSetoran,
}: ModalTolakProps) {
  const [alasan, setAlasan] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!alasan.trim()) {
      setError("Harap masukkan alasan penolakan.");
      return;
    }
    setError("");
    onConfirm(alasan);
  };

  const opsiAlasanPilihan = [
    "Sampah tidak sesuai kategori",
    "Foto bukti timbangan tidak jelas",
    "Kondisi sampah kotor/terkontaminasi",
    "Berat timbangan tidak sesuai",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5 relative">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Tolak Setoran {idSetoran}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Berikan alasan penolakan agar nasabah dapat mengetahui alasannya.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            PILIH ALASAN CEPAT
          </label>
          <div className="flex flex-wrap gap-1.5">
            {opsiAlasanPilihan.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setAlasan(opt);
                  setError("");
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                  alasan === opt
                    ? "border-red-500 bg-red-50 text-red-700 font-semibold"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            CATATAN ALASAN PENOLAKAN <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={alasan}
            onChange={(e) => {
              setAlasan(e.target.value);
              if (e.target.value.trim()) setError("");
            }}
            placeholder="Tuliskan catatan alasan penolakan secara rinci..."
            className="w-full border border-gray-200 rounded-xl p-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-500 resize-none"
          />
          {error && (
            <p className="text-[10px] font-medium text-red-500">{error}</p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Konfirmasi Tolak
          </button>
        </div>
      </div>
    </div>
  );
}

// Menambahkan default export gabungan untuk menghindari error import default
const ModalSetoran = {
  ModalVerifikasi,
  ModalTolak,
};

export default ModalSetoran;
