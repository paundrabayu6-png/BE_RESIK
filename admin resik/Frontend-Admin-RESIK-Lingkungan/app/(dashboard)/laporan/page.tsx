"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  PackageCheck,
  Download,
  ArrowRight,
  Scale,
  Coins,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  UserCheck,
  UserPlus,
  UserX,
  PieChart as PieIcon,
  X,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Calendar,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAllNasabah } from "@/services/nasabah.service";
import type { Nasabah } from "@/types/nasabah";
import {
  getAllTransaksi,
  getDashboardStats,
  getLaporanSetoran,
} from "@/services/setoran.service";
import type {
  AdminTransaksi,
  DashboardStats,
  LaporanSetoranResponse,
} from "@/services/setoran.service";

type TabLaporan = "overview" | "setoran" | "saldo" | "nasabah";
type ReportData = {
  dashboard: DashboardStats;
  monthlyDeposits: LaporanSetoranResponse;
  nasabah: Nasabah[];
  transaksi: AdminTransaksi[];
};

async function fetchAllNasabah(): Promise<Nasabah[]> {
  const limit = 1000;
  const firstPage = await getAllNasabah({ page: 1, limit });
  const customers = [...firstPage.data];
  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await getAllNasabah({ page, limit });
    customers.push(...response.data);
  }
  return customers;
}

async function fetchAllTransaksi(): Promise<AdminTransaksi[]> {
  const limit = 1000;
  const firstPage = await getAllTransaksi(limit, 1);
  const transactions = [...firstPage.data];
  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await getAllTransaksi(limit, page);
    transactions.push(...response.data);
  }
  return transactions;
}

const formatNumber = (value: number) =>
  Number(value || 0).toLocaleString("id-ID");
const formatRupiah = (value: number) => `Rp ${formatNumber(value)}`;

interface EksporItem {
  id: string;
  namaFile: string;
  tipeLaporan: string;
  dibuatOleh: string;
  avatar: string;
  tanggal: string;
  status: "SELESAI" | "PROSES" | "GAGAL";
  format: "pdf" | "xlsx";
}

export default function LaporanPage() {
  const [activeTab, setActiveTab] = useState<TabLaporan>("overview");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const now = new Date();
    Promise.all([
      getDashboardStats(),
      getLaporanSetoran(now.getMonth() + 1, now.getFullYear()),
      fetchAllNasabah(),
      fetchAllTransaksi(),
    ])
      .then(([dashboard, monthlyDeposits, nasabah, transaksi]) => {
        if (active) {
          setReportData({
            dashboard: dashboard.data,
            monthlyDeposits,
            nasabah,
            transaksi,
          });
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setLoadError(
            reason instanceof Error ? reason.message : "Gagal memuat laporan.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Sub-Navigasi Tab Laporan */}
      <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#025E43] text-white shadow-xs"
                : "bg-white/80 text-gray-600 hover:bg-white"
            }`}
          >
            Ringkasan
          </button>
          <button
            onClick={() => setActiveTab("setoran")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "setoran"
                ? "bg-[#025E43] text-white shadow-xs"
                : "bg-white/80 text-gray-600 hover:bg-white"
            }`}
          >
            Laporan Setoran
          </button>
          <button
            onClick={() => setActiveTab("saldo")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "saldo"
                ? "bg-[#025E43] text-white shadow-xs"
                : "bg-white/80 text-gray-600 hover:bg-white"
            }`}
          >
            Laporan Saldo
          </button>
          <button
            onClick={() => setActiveTab("nasabah")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "nasabah"
                ? "bg-[#025E43] text-white shadow-xs"
                : "bg-white/80 text-gray-600 hover:bg-white"
            }`}
          >
            Laporan Nasabah
          </button>
        </div>
      </div>

      {/* RENDER KONTEN TAB */}
      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">
          Memuat data laporan dari backend...
        </div>
      ) : loadError ? (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {loadError}
        </div>
      ) : reportData ? (
        <>
          {activeTab === "overview" && (
            <OverviewTab setActiveTab={setActiveTab} data={reportData} />
          )}
          {activeTab === "setoran" && <SetoranTab data={reportData} />}
          {activeTab === "saldo" && <SaldoTab data={reportData} />}
          {activeTab === "nasabah" && <NasabahTab data={reportData} />}
        </>
      ) : null}
    </div>
  );
}

/* ========================================================= */
/* 1. RINGKASAN LAPORAN (OVERVIEW TAB) */
/* ========================================================= */
function OverviewTab({
  setActiveTab,
  data,
}: {
  setActiveTab: (tab: TabLaporan) => void;
  data: ReportData;
}) {
  // State Modal
  const [isEksporModalOpen, setIsEksporModalOpen] = useState(false);
  const [isRiwayatModalOpen, setIsRiwayatModalOpen] = useState(false);

  // Data Riwayat Ekspor
  const [riwayatList, setRiwayatList] = useState<EksporItem[]>([]);

  // Fungsionalitas Download Aksi
  const handleDownload = (item: EksporItem) => {
    const fileContent = [
      "Laporan RESIK",
      `Nama File: ${item.namaFile}`,
      `Tipe: ${item.tipeLaporan}`,
      `Tanggal: ${item.tanggal}`,
      `Jumlah setoran bulan ini: ${formatNumber(data.monthlyDeposits.summary.total_setoran)}`,
      `Berat setoran bulan ini: ${formatNumber(data.monthlyDeposits.summary.total_kg)} kg`,
      `Nilai saldo setoran bulan ini: ${formatRupiah(data.monthlyDeposits.summary.total_nilai)}`,
      `Nasabah terdaftar: ${formatNumber(data.nasabah.length)}`,
      `Transaksi tercatat: ${formatNumber(data.transaksi.length)}`,
    ].join("\n");
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.namaFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Fungsionalitas Ekspor Baru
  const handleProsesEkspor = (format: "pdf" | "xlsx", periode: string) => {
    const fileBaru: EksporItem = {
      id: Date.now().toString(),
      namaFile: `Laporan_Lengkap_RESIK_${periode}_${Date.now().toString().slice(-4)}.${format}`,
      tipeLaporan: "Semua Laporan",
      dibuatOleh: "Andi Wijaya",
      avatar: "",
      tanggal:
        "Hari Ini, " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      status: "SELESAI",
      format: format,
    };

    setRiwayatList([fileBaru, ...riwayatList]);
    setIsEksporModalOpen(false);
    handleDownload(fileBaru);
  };

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Ringkasan Laporan — Akses laporan operasional Bank Sampah RESIK.
          </p>
        </div>
        <button
          onClick={() => setIsEksporModalOpen(true)}
          className="bg-[#025E43] hover:bg-[#024a35] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor Semua Laporan</span>
        </button>
      </div>

      {/* Grid Card 3 Laporan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F6ECDB] p-6 rounded-2xl border border-[#E8DABF] flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Laporan Setoran</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Laporan detail mengenai setoran sampah, berat, dan jenis sampah
              yang terkumpul secara periodik.
            </p>
            <p className="text-xs font-bold text-gray-800">
              {formatNumber(data.monthlyDeposits.summary.total_setoran)} setoran berhasil bulan ini
            </p>
          </div>
          <div className="pt-4 border-t border-[#E0D0B3] space-y-3">
            <div className="flex justify-between text-[11px] text-gray-500 font-medium">
              <span>Update Terakhir:</span>
              <span className="text-gray-800 font-semibold">
                {new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
            <button
              onClick={() => setActiveTab("setoran")}
              className="w-full bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Lihat Laporan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="bg-[#F6ECDB] p-6 rounded-2xl border border-[#E8DABF] flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Laporan Saldo</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Laporan mengenai saldo nasabah, perubahan saldo, dan distribusi
              nilai ekonomi sampah kepada warga.
            </p>
            <p className="text-xs font-bold text-gray-800">
              Total saldo nasabah {formatRupiah(data.nasabah.reduce((sum, customer) => sum + Number(customer.saldo || 0), 0))}
            </p>
          </div>
          <div className="pt-4 border-t border-[#E0D0B3] space-y-3">
            <div className="flex justify-between text-[11px] text-gray-500 font-medium">
              <span>Update Terakhir:</span>
              <span className="text-gray-800 font-semibold">
                {new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
            <button
              onClick={() => setActiveTab("saldo")}
              className="w-full bg-blue-50/80 hover:bg-blue-100 text-blue-800 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Lihat Laporan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="bg-[#F6ECDB] p-6 rounded-2xl border border-[#E8DABF] flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Laporan Nasabah</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Laporan pertumbuhan nasabah, keaktifan, dan demografi wilayah
              nasabah terdaftar.
            </p>
            <p className="text-xs font-bold text-gray-800">
              {formatNumber(data.nasabah.length)} nasabah terdaftar, {formatNumber(data.nasabah.filter((customer) => customer.status === "aktif").length)} aktif
            </p>
          </div>
          <div className="pt-4 border-t border-[#E0D0B3] space-y-3">
            <div className="flex justify-between text-[11px] text-gray-500 font-medium">
              <span>Update Terakhir:</span>
              <span className="text-gray-800 font-semibold">
                {new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
            <button
              onClick={() => setActiveTab("nasabah")}
              className="w-full bg-purple-50/80 hover:bg-purple-100 text-purple-800 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Lihat Laporan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Riwayat Ekspor Terbaru */}
      <div className="bg-[#F6ECDB] rounded-2xl border border-[#E8DABF] overflow-hidden">
        <div className="p-5 border-b border-[#E0D0B3] flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900">
            Riwayat Ekspor Terbaru
          </h3>
          <button
            onClick={() => setIsRiwayatModalOpen(true)}
            className="text-emerald-800 hover:underline text-xs font-bold cursor-pointer"
          >
            Lihat Semua Riwayat
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E0D0B3] text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">Nama File</th>
                <th className="py-3 px-5">Tipe Laporan</th>
                <th className="py-3 px-5">Dibuat Oleh</th>
                <th className="py-3 px-5">Tanggal</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0D0B3]/60 font-medium">
              {riwayatList.slice(0, 2).map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-black/5 transition-colors"
                >
                  <td className="py-3.5 px-5 font-bold text-gray-900">
                    {item.namaFile}
                  </td>
                  <td className="py-3.5 px-5 text-gray-600">
                    {item.tipeLaporan}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.avatar}
                        className="w-5 h-5 rounded-full object-cover"
                        alt={item.dibuatOleh}
                      />
                      <span>{item.dibuatOleh}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-gray-600">{item.tanggal}</td>
                  <td className="py-3.5 px-5">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => handleDownload(item)}
                      title="Unduh File"
                      className="p-1.5 text-gray-600 hover:text-emerald-800 hover:bg-emerald-100/50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: EKSPOR SEMUA LAPORAN */}
      {isEksporModalOpen && (
        <ModalEksporSemua
          onClose={() => setIsEksporModalOpen(false)}
          onEkspor={handleProsesEkspor}
        />
      )}

      {/* MODAL 2: LIHAT SEMUA RIWAYAT */}
      {isRiwayatModalOpen && (
        <ModalLihatSemuaRiwayat
          riwayatList={riwayatList}
          onClose={() => setIsRiwayatModalOpen(false)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* MODAL EKSPOR SEMUA LAPORAN */
/* ========================================================= */
function ModalEksporSemua({
  onClose,
  onEkspor,
}: {
  onClose: () => void;
  onEkspor: (format: "pdf" | "xlsx", periode: string) => void;
}) {
  const [periode, setPeriode] = useState("Bulan Ini");
  const [format, setFormat] = useState<"pdf" | "xlsx">("pdf");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#025E43] flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-gray-900">
              Ekspor Semua Laporan
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5">
              Pilih Periode Laporan
            </label>
            <div className="relative">
              <select
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800 font-medium focus:outline-none focus:border-[#025E43]"
              >
                <option value="Bulan Ini">Bulan Ini (Oktober 2023)</option>
                <option value="Bulan Lalu">Bulan Lalu (September 2023)</option>
                <option value="Triwulan3">Triwulan 3 (Jul - Sep)</option>
                <option value="Tahun2023">Tahun 2023</option>
              </select>
              <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1.5">
              Format Dokumen
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat("pdf")}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                  format === "pdf"
                    ? "border-[#025E43] bg-emerald-50/50 text-[#025E43] font-bold"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FileText className="w-5 h-5 text-red-500" />
                <div className="text-left">
                  <div className="text-xs">Format PDF</div>
                  <div className="text-[10px] text-gray-400 font-normal">
                    Siap Cetak
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat("xlsx")}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                  format === "xlsx"
                    ? "border-[#025E43] bg-emerald-50/50 text-[#025E43] font-bold"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <div className="text-left">
                  <div className="text-xs">Excel (.xlsx)</div>
                  <div className="text-[10px] text-gray-400 font-normal">
                    Data Olah
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 leading-relaxed">
            * Paket laporan ini akan mencakup gabungan Rekap Setoran Sampah,
            Mutasi Saldo, dan Ringkasan Nasabah.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={() => onEkspor(format, periode)}
            className="bg-[#025E43] hover:bg-[#024a35] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Laporan</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* MODAL LIHAT SEMUA RIWAYAT EKSPOR */
/* ========================================================= */
function ModalLihatSemuaRiwayat({
  riwayatList,
  onClose,
  onDownload,
}: {
  riwayatList: EksporItem[];
  onClose: () => void;
  onDownload: (item: EksporItem) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-2xl space-y-4 relative max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-gray-900">
              Semua Riwayat Ekspor
            </h3>
            <p className="text-xs text-gray-500">
              Daftar seluruh berkas laporan yang telah di-generate sebelumnya.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Nama File</th>
                <th className="py-3 px-4">Tipe Laporan</th>
                <th className="py-3 px-4">Dibuat Oleh</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {riwayatList.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2">
                    {item.format === "pdf" ? (
                      <FileText className="w-4 h-4 text-red-500 shrink-0" />
                    ) : (
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <span className="truncate max-w-[200px]">
                      {item.namaFile}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {item.tipeLaporan}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.avatar}
                        className="w-5 h-5 rounded-full object-cover"
                        alt={item.dibuatOleh}
                      />
                      <span>{item.dibuatOleh}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.tanggal}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDownload(item)}
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#025E43] font-bold rounded-lg text-[11px] flex items-center gap-1 ml-auto transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-gray-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* TAB LAINNYA (Setoran, Saldo, Nasabah) */
/* ========================================================= */
function SetoranTab({ data }: { data: ReportData }) {
  const acceptedDeposits = data.monthlyDeposits.data.filter(
    (deposit) => deposit.status === "diterima",
  );
  const totalWeight = Number(data.monthlyDeposits.summary.total_kg);
  const totalValue = Number(data.monthlyDeposits.summary.total_nilai);
  const chartDataTrend = data.dashboard.grafik_6_bulan.map((month) => ({
    name: month.bulan,
    val: Number(month.total_kg),
  }));
  const colors = ["#2563EB", "#EA580C", "#94A3B8", "#A855F7", "#059669", "#DC2626"];
  const pieDataKomposisi = data.dashboard.distribusi_jenis.map((item, index) => ({
    name: item.nama,
    value: Number(item.total_kg),
    color: colors[index % colors.length],
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Setoran</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Analisis data penyetoran sampah secara berkala.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">
              Total Setoran
            </span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {formatNumber(acceptedDeposits.length)}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">
              Total Berat
            </span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {formatNumber(totalWeight)}{" "}
              <span className="text-xs font-normal text-gray-500">kg</span>
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">
              Total Poin
            </span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {formatNumber(totalValue)}{" "}
              <span className="text-xs font-normal text-gray-500">pts</span>
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">
              Rata-rata Berat
            </span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {(acceptedDeposits.length ? totalWeight / acceptedDeposits.length : 0).toLocaleString("id-ID", { maximumFractionDigits: 2 })}{" "}
              <span className="text-xs font-normal text-gray-500">kg</span>
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
          <h3 className="font-bold text-sm text-gray-900">
            Tren Berat Setoran
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataTrend}>
                <defs>
                  <linearGradient id="colorSetoran" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#025E43" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#025E43" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "#64748B" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "#64748B" }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#025E43"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSetoran)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 flex flex-col justify-between">
          <h3 className="font-bold text-sm text-gray-900">Komposisi Jenis</h3>
          <div className="h-48 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieDataKomposisi}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieDataKomposisi.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-2 border-t border-gray-100">
            {pieDataKomposisi.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SaldoTab({ data }: { data: ReportData }) {
  const totalBalance = data.nasabah.reduce(
    (total, customer) => total + Number(customer.saldo || 0),
    0,
  );
  const successfulTransactions = data.transaksi.filter(
    (transaction) => transaction.status === "berhasil",
  );
  const totalIncome = successfulTransactions
    .filter((transaction) => transaction.tipe === "masuk")
    .reduce((total, transaction) => total + Number(transaction.jumlah || 0), 0);
  const totalExpense = successfulTransactions
    .filter((transaction) => transaction.tipe === "keluar")
    .reduce((total, transaction) => total + Number(transaction.jumlah || 0), 0);
  const now = new Date();
  const barDataSaldo = Array.from({ length: 5 }, (_, index) => {
    const week = index + 1;
    const weekTransactions = successfulTransactions.filter((transaction) => {
      const date = new Date(transaction.created_at);
      return date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        Math.ceil(date.getDate() / 7) === week;
    });
    return {
      name: `M${week}`,
      masuk: weekTransactions
        .filter((transaction) => transaction.tipe === "masuk")
        .reduce((sum, transaction) => sum + Number(transaction.jumlah || 0), 0) / 1_000_000,
      keluar: weekTransactions
        .filter((transaction) => transaction.tipe === "keluar")
        .reduce((sum, transaction) => sum + Number(transaction.jumlah || 0), 0) / 1_000_000,
    };
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Saldo</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Rekapitulasi perputaran keuangan dan saldo nasabah.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">
              Total Saldo Nasabah
            </span>
            <h3 className="text-xl font-black text-gray-900 mt-1">
              {formatRupiah(totalBalance)}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">
              Saldo Masuk
            </span>
            <h3 className="text-xl font-black text-gray-900 mt-1">
              {formatRupiah(totalIncome)}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">
              Saldo Keluar
            </span>
            <h3 className="text-xl font-black text-gray-900 mt-1">
              {formatRupiah(totalExpense)}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">
              Rata-rata Saldo
            </span>
            <h3 className="text-xl font-black text-gray-900 mt-1">
              {formatRupiah(data.nasabah.length ? totalBalance / data.nasabah.length : 0)}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <PieIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
        <h3 className="font-bold text-sm text-gray-900">
          Saldo Masuk vs Keluar (juta rupiah)
        </h3>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barDataSaldo}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
              />
              <Tooltip />
              <Bar dataKey="masuk" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="keluar" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function NasabahTab({ data }: { data: ReportData }) {
  const now = new Date();
  const activeCustomers = data.nasabah.filter(
    (customer) => customer.status === "aktif",
  ).length;
  const newCustomersThisMonth = data.nasabah.filter((customer) => {
    if (!customer.created_at) return false;
    const createdAt = new Date(customer.created_at);
    return createdAt.getFullYear() === now.getFullYear() &&
      createdAt.getMonth() === now.getMonth();
  }).length;
  const inactiveCustomers = data.nasabah.length - activeCustomers;
  const lineDataPertumbuhan = Array.from({ length: 6 }, (_, index) => {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
    return {
      name: monthStart.toLocaleDateString("id-ID", { month: "short" }),
      val: data.nasabah.filter((customer) => {
        if (!customer.created_at) return false;
        const createdAt = new Date(customer.created_at);
        return createdAt < monthEnd;
      }).length,
    };
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Nasabah</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Analisis data pertumbuhan dan aktivitas nasabah bank sampah.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">
              Total Nasabah
            </span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {formatNumber(data.nasabah.length)}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">
              Nasabah Aktif
            </span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {formatNumber(activeCustomers)}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">
              Nasabah Baru
            </span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {formatNumber(newCustomersThisMonth)}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">
              Tidak Aktif
            </span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {formatNumber(inactiveCustomers)}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
        <h3 className="font-bold text-sm text-gray-900">Pertumbuhan Nasabah</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineDataPertumbuhan}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="val"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
