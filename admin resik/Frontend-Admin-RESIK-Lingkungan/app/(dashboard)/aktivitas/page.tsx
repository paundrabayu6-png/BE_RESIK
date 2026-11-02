"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Download,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Truck,
  UserPlus,
  AlertTriangle,
  Coins,
  X,
  FileText,
  FileSpreadsheet,
  Filter,
} from "lucide-react";
import { getAllNasabah } from "@/services/nasabah.service";
import { getAllSetoran, getAllTransaksi } from "@/services/setoran.service";

async function fetchAllSetoran() {
  const limit = 1000;
  const firstPage = await getAllSetoran({ page: 1, limit });
  const deposits = [...firstPage.data];
  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await getAllSetoran({ page, limit });
    deposits.push(...response.data);
  }
  return deposits;
}

async function fetchAllNasabah() {
  const limit = 1000;
  const firstPage = await getAllNasabah({ page: 1, limit });
  const customers = [...firstPage.data];
  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await getAllNasabah({ page, limit });
    customers.push(...response.data);
  }
  return customers;
}

async function fetchAllTransaksi() {
  const limit = 1000;
  const firstPage = await getAllTransaksi(limit, 1);
  const transactions = [...firstPage.data];
  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await getAllTransaksi(limit, page);
    transactions.push(...response.data);
  }
  return transactions;
}

export default function AktivitasNasabahPage() {
  const [activeTab, setActiveTab] = useState<
    "Hari Ini" | "Minggu Ini" | "Bulan Ini"
  >("Hari Ini");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"CSV" | "Excel" | "PDF">(
    "CSV",
  );

  type ActivityRow = {
    id: number;
    nama: string;
    level: string;
    levelColor: string;
    deskripsiPref: string;
    boldText: string;
    deskripsiSuf: string;
    tanggal: string;
    waktu: string;
    status: string;
    statusColor: string;
    actionText: string;
    occurredAt: Date;
    category: "setoran" | "transaksi" | "nasabah";
  };
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchAllSetoran(),
      fetchAllNasabah(),
      fetchAllTransaksi(),
    ])
      .then(([setoranResponse, nasabahResponse, transaksiResponse]) => {
        if (!active) return;
        const rows: ActivityRow[] = [];
        for (const deposit of setoranResponse) {
          const date = new Date(deposit.tanggal);
          const pending = ["menunggu", "verifikasi"].includes(deposit.status);
          rows.push({
            id: Number(deposit.id),
            nama: deposit.nasabah,
            level: "Nasabah",
            levelColor: "bg-emerald-100 text-emerald-700",
            deskripsiPref: "Melakukan setoran ",
            boldText: `${deposit.jenis} (${Number(deposit.berat_kg).toLocaleString("id-ID")} kg)`,
            deskripsiSuf: ".",
            tanggal: date.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            waktu: `${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`,
            status: pending
              ? "MENUNGGU"
              : deposit.status === "ditolak"
                ? "DITOLAK"
                : "BERHASIL",
            statusColor: pending
              ? "bg-amber-100 text-amber-700"
              : deposit.status === "ditolak"
                ? "bg-rose-100 text-rose-600"
                : "bg-emerald-100 text-emerald-700",
            actionText: pending ? "Verifikasi Sekarang" : "Detail Setoran",
            occurredAt: date,
            category: "setoran",
          });
        }
        for (const transaction of transaksiResponse) {
          const date = new Date(transaction.created_at);
          const isFailed = transaction.status === "gagal";
          rows.push({
            id: 1_000_000 + Number(transaction.id),
            nama: transaction.nasabah,
            level: "Nasabah",
            levelColor: "bg-emerald-100 text-emerald-700",
            deskripsiPref: transaction.tipe === "keluar"
              ? "Melakukan penarikan saldo "
              : "Menerima saldo ",
            boldText: `Rp ${Number(transaction.jumlah).toLocaleString("id-ID")}`,
            deskripsiSuf: transaction.metode ? ` via ${transaction.metode}.` : ".",
            tanggal: date.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            waktu: `${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`,
            status: isFailed ? "GAGAL" : transaction.status.toUpperCase(),
            statusColor: isFailed
              ? "bg-rose-100 text-rose-600"
              : "bg-blue-100 text-blue-700",
            actionText: "Cek Transaksi",
            occurredAt: date,
            category: "transaksi",
          });
        }
        for (const customer of nasabahResponse) {
          if (!customer.created_at) continue;
          const date = new Date(customer.created_at);
          rows.push({
            id: 2_000_000 + Number(customer.id),
            nama: customer.nama,
            level: "Nasabah Baru",
            levelColor: "bg-purple-100 text-purple-700",
            deskripsiPref: "Mendaftar sebagai ",
            boldText: "nasabah RESIK",
            deskripsiSuf: ".",
            tanggal: date.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            waktu: `${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`,
            status: customer.status === "aktif" ? "BERHASIL" : "MENUNGGU",
            statusColor: customer.status === "aktif"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700",
            actionText: "Profil Nasabah",
            occurredAt: date,
            category: "nasabah",
          });
        }
        rows.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());
        setActivities(rows);
      })
      .catch((reason: unknown) => {
        if (active) {
          setLoadError(
            reason instanceof Error
              ? reason.message
              : "Gagal memuat aktivitas nasabah.",
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

  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = `${activity.nama} ${activity.boldText} ${activity.status}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const daysAgo = (startToday.getTime() - new Date(
      activity.occurredAt.getFullYear(),
      activity.occurredAt.getMonth(),
      activity.occurredAt.getDate(),
    ).getTime()) / 86_400_000;
    const matchesPeriod = activeTab === "Hari Ini"
      ? daysAgo === 0
      : activeTab === "Minggu Ini"
        ? daysAgo >= 0 && daysAgo < 7
        : activity.occurredAt.getMonth() === now.getMonth() &&
          activity.occurredAt.getFullYear() === now.getFullYear();
    return matchesSearch && matchesPeriod &&
      (!statusFilter || activity.status === statusFilter) &&
      (!categoryFilter || activity.category === categoryFilter);
  });
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / itemsPerPage));
  const currentActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const todayActivities = activities.filter(
    (activity) => activity.occurredAt >= startToday,
  );
  const setoranToday = todayActivities.filter((activity) => activity.category === "setoran").length;
  const nasabahToday = todayActivities.filter((activity) => activity.category === "nasabah").length;
  const pendingToday = todayActivities.filter((activity) => activity.status === "MENUNGGU").length;
  const distributedToday = todayActivities
    .filter((activity) => activity.category === "setoran" && activity.status === "BERHASIL")
    .length;

  // Logika langsung mengunduh berkas tanpa alert
  const handleDownload = () => {
    if (filteredActivities.length === 0) {
      setIsExportOpen(false);
      return;
    }
    const dataToExport = filteredActivities.map((act) => ({
      Nama: act.nama,
      Level: act.level,
      Aktivitas: `${act.deskripsiPref}${act.boldText}${act.deskripsiSuf}`,
      Tanggal: act.tanggal,
      Waktu: act.waktu,
      Status: act.status,
    }));

    const filename = `log-aktivitas-${selectedFormat.toLowerCase()}`;

    if (selectedFormat === "CSV") {
      const headers = Object.keys(dataToExport[0]).join(",");
      const rows = dataToExport
        .map((row) =>
          Object.values(row)
            .map((value) => `"${value}"`)
            .join(","),
        )
        .join("\n");
      const csvContent =
        "data:text/csv;charset=utf-8,\uFEFF" + `${headers}\n${rows}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (selectedFormat === "Excel") {
      const headers = Object.keys(dataToExport[0])
        .map((h) => `<th>${h}</th>`)
        .join("");
      const rows = dataToExport
        .map(
          (row) =>
            `<tr>${Object.values(row)
              .map((v) => `<td>${v}</td>`)
              .join("")}</tr>`,
        )
        .join("");
      const tableHTML = `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
      const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (selectedFormat === "PDF") {
      const content = dataToExport
        .map(
          (item) =>
            `[${item.Tanggal} ${item.Waktu}] - ${item.Nama} (${item.Level})\nStatus: ${item.Status}\nAktivitas: ${item.Aktivitas}\n----------------------------------------`,
        )
        .join("\n\n");
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    setIsExportOpen(false);
  };

  return (
    <div className="space-y-6 relative">
      {/* 1. MAIN CARD CONTAINER */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-6">
        {/* Filter & Action Toolbar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Left: Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nasabah atau aktivitas..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 text-xs pl-9 pr-4 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20"
            />
          </div>

          {/* Right: Date Tabs, Filter Button, Export Button */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Filter Time Tabs */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold text-gray-500">
              {(["Hari Ini", "Minggu Ini", "Bulan Ini"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-white text-[#064e3b] font-bold shadow-xs"
                      : "hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tombol Filter Lanjutan */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter Lanjutan</span>
            </button>

            {/* Tombol Ekspor Log */}
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 bg-emerald-100/80 hover:bg-emerald-100 text-[#064e3b] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Log</span>
            </button>
          </div>
        </div>

        {/* Activity List Timeline Container (Beige Box) */}
        <div className="bg-[#F8F4E8] rounded-xl border border-[#EBE3D0] divide-y divide-[#EBE3D0] transition-all">
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500">Memuat aktivitas dari backend...</div>
          ) : loadError ? (
            <div role="alert" className="p-8 text-center text-sm text-rose-700">{loadError}</div>
          ) : currentActivities.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">Tidak ada aktivitas untuk filter ini.</div>
          ) : currentActivities.map((item) => (
            <div
              key={item.id}
              className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative hover:bg-[#f4efe0]/60 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 ring-2 ring-white">
                  {item.nama.slice(0, 1).toUpperCase()}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">
                      {item.nama}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.levelColor}`}
                    >
                      {item.level}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 font-medium">
                    {item.deskripsiPref}
                    <span className="font-bold text-gray-900">
                      {item.boldText}
                    </span>
                    {item.deskripsiSuf}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.tanggal}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.waktu}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2">
                <span
                  className={`text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-md uppercase ${item.statusColor}`}
                >
                  • {item.status}
                </span>

                <button className="text-xs font-bold text-[#064e3b] hover:underline cursor-pointer">
                  {item.actionText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs font-medium text-gray-500">
          <span>
            Menampilkan {filteredActivities.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            {"–"}
            {Math.min(currentPage * itemsPerPage, filteredActivities.length)} dari{" "}
            <strong className="text-gray-900">{filteredActivities.length}</strong>
            {" aktivitas"}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Buttons */}
            {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => {
              const page = Math.max(1, Math.min(currentPage - 1, totalPages - 2)) + index;
              return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-[#064e3b] text-white shadow-xs"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUMMARY BOTTOM CARDS (4 STATS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-semibold">
              Total Setoran Hari Ini
            </p>
            <h4 className="text-base font-black text-gray-900">{setoranToday} Setoran</h4>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-semibold">
              Nasabah Baru
            </p>
            <h4 className="text-base font-black text-gray-900">{nasabahToday} Orang</h4>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-semibold">
              Butuh Verifikasi
            </p>
            <h4 className="text-base font-black text-gray-900">{pendingToday} Aktivitas</h4>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-semibold">
              Setoran Berhasil Hari Ini
            </p>
            <h4 className="text-base font-black text-gray-900">{distributedToday} Setoran</h4>
          </div>
        </div>
      </div>

      {/* MODAL 1: EKSPOR LOG AKTIVITAS (Desain Sesuai Gambar + Unduh Langsung) */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-in fade-in zoom-in duration-150">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Ekspor Log Aktivitas
              </h3>
              <button
                onClick={() => setIsExportOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Label Subtitle */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-600">
                Pilih Format Berkas:
              </label>

              {/* Option Grid (3 Kotak) */}
              <div className="grid grid-cols-3 gap-3">
                {/* Opsi CSV */}
                <button
                  type="button"
                  onClick={() => setSelectedFormat("CSV")}
                  className={`flex flex-col items-center justify-center py-5 px-3 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedFormat === "CSV"
                      ? "border-emerald-600 bg-emerald-50/50 text-[#064e3b]"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 bg-white"
                  }`}
                >
                  <FileText
                    className={`w-7 h-7 mb-2 ${
                      selectedFormat === "CSV"
                        ? "text-emerald-600"
                        : "text-emerald-700"
                    }`}
                  />
                  <span className="text-xs font-bold">CSV</span>
                </button>

                {/* Opsi Excel */}
                <button
                  type="button"
                  onClick={() => setSelectedFormat("Excel")}
                  className={`flex flex-col items-center justify-center py-5 px-3 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedFormat === "Excel"
                      ? "border-emerald-600 bg-emerald-50/50 text-[#064e3b]"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 bg-white"
                  }`}
                >
                  <FileSpreadsheet
                    className={`w-7 h-7 mb-2 ${
                      selectedFormat === "Excel"
                        ? "text-emerald-600"
                        : "text-emerald-700"
                    }`}
                  />
                  <span className="text-xs font-bold">Excel (.xlsx)</span>
                </button>

                {/* Opsi PDF */}
                <button
                  type="button"
                  onClick={() => setSelectedFormat("PDF")}
                  className={`flex flex-col items-center justify-center py-5 px-3 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedFormat === "PDF"
                      ? "border-emerald-600 bg-emerald-50/50 text-[#064e3b]"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 bg-white"
                  }`}
                >
                  <FileText
                    className={`w-7 h-7 mb-2 ${
                      selectedFormat === "PDF"
                        ? "text-emerald-600"
                        : "text-emerald-700"
                    }`}
                  />
                  <span className="text-xs font-bold">PDF</span>
                </button>
              </div>
            </div>

            {/* Action Buttons (Batal & Unduh Berkas) */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIsExportOpen(false)}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDownload}
                className="w-full py-3 rounded-xl bg-[#064e3b] hover:bg-[#04382a] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Unduh Berkas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FILTER LANJUTAN */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setIsFilterOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064e3b] flex items-center justify-center">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Filter Lanjutan
                </h3>
                <p className="text-xs text-gray-500">
                  Saring data berdasarkan parameter tertentu.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Status Aktivitas
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20"
                >
                  <option value="">Semua Status</option>
                  <option value="MENUNGGU">MENUNGGU</option>
                  <option value="GAGAL">GAGAL</option>
                  <option value="BERHASIL">BERHASIL</option>
                  <option value="DITOLAK">DITOLAK</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Kategori Nasabah
                </label>
                <select
                  value={categoryFilter}
                  onChange={(event) => {
                    setCategoryFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20"
                >
                  <option value="">Semua Kategori</option>
                  <option value="setoran">Setoran</option>
                  <option value="transaksi">Transaksi saldo</option>
                  <option value="nasabah">Pendaftaran nasabah</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setStatusFilter("");
                    setCategoryFilter("");
                    setSearchQuery("");
                    setCurrentPage(1);
                    setIsFilterOpen(false);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 bg-[#064e3b] hover:bg-[#04382a] text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
