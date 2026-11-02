"use client";

import React, { useState } from "react";
import { Download, X } from "lucide-react";

interface ExportLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportLogModal({
  isOpen,
  onClose,
}: ExportLogModalProps) {
  const [format, setFormat] = useState<"excel" | "pdf">("excel");
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">
            Eksport Log Aktivitas
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleExport} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Pilih Format File
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as "excel" | "pdf")}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="excel">Excel (.xlsx)</option>
              <option value="pdf">PDF (.pdf)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Mengunduh..." : "Unduh Berkas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
