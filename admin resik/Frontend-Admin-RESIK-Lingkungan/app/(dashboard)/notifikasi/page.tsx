"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  type AdminNotification,
} from "@/services/notification.service";

interface NotificationItem {
  id: number;
  type: "setoran" | "nasabah" | "sistem" | "peringatan";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export default function NotifikasiPage() {
  // State untuk Tab Filter: 'semua' | 'belum_dibaca'
  const [activeTab, setActiveTab] = useState<"semua" | "belum_dibaca">("semua");
  const [categoryFilter, setCategoryFilter] = useState<string>("Semua");

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getAdminNotifications()
      .then((response) => {
        if (active) {
          setNotifications(response.data.map(toNotificationItem));
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Gagal memuat notifikasi.",
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

  // Filter Data Berdasarkan Tab & Kategori
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesTab = activeTab === "semua" || !item.isRead;
      const matchesCategory =
        categoryFilter === "Semua" ||
        item.type.toLowerCase() === categoryFilter.toLowerCase();

      return matchesTab && matchesCategory;
    });
  }, [notifications, activeTab, categoryFilter]);

  // Total Halaman
  const totalPages =
    Math.ceil(filteredNotifications.length / itemsPerPage) || 1;

  // Potong Data Sesuai Halaman (Slice)
  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNotifications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotifications, currentPage]);

  // Handler tandai semua dibaca
  const markAllAsRead = async () => {
    setError(null);
    try {
      await markAllAdminNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Gagal memperbarui notifikasi.",
      );
    }
  };

  const toggleReadStatus = async (item: NotificationItem) => {
    if (item.isRead) return;
    setError(null);
    try {
      await markAdminNotificationRead(item.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
      );
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Gagal memperbarui notifikasi.",
      );
    }
  };

  // Hitung jumlah yang belum dibaca
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-6 space-y-4">
      {/* Header Halaman */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
            <span>Aplikasi</span>
            <span>&gt;</span>
            <span className="text-emerald-800 font-bold">Notifikasi</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight mt-1 flex items-center gap-2">
            Notifikasi System
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                {unreadCount} Baru
              </span>
            )}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Pantau semua pembaruan aktivitas setoran, nasabah, dan sistem.
          </p>
        </div>

        {/* Tombol Aksion Cepat */}
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-3.5 py-2 bg-white border border-[#E5D7B3] hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Check className="w-3.5 h-3.5 text-emerald-700" />
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {/* Card Utama */}
      <div className="bg-[#EFE4C8] rounded-2xl p-4 border border-[#E5D7B3] space-y-4">
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
            {error}
          </p>
        )}
        {/* Filter & Tab Navigasi */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5D7B3] pb-3 text-xs">
          {/* Tabs: Semua / Belum Dibaca */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab("semua");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === "semua"
                  ? "bg-[#044E3A] text-white shadow-sm"
                  : "bg-white/50 text-gray-700 hover:bg-white"
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("belum_dibaca");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === "belum_dibaca"
                  ? "bg-[#044E3A] text-white shadow-sm"
                  : "bg-white/50 text-gray-700 hover:bg-white"
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
          </div>

          {/* Filter Kategori Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-[#E5D7B3]/60 rounded-xl font-semibold text-gray-700 border-none focus:outline-none cursor-pointer hover:bg-[#E5D7B3]"
            >
              <option value="Semua">Kategori: Semua</option>
              <option value="setoran">Setoran</option>
              <option value="nasabah">Nasabah</option>
              <option value="peringatan">Peringatan</option>
              <option value="sistem">Sistem</option>
            </select>
          </div>
        </div>

        {/* Daftar Notifikasi */}
        <div className="space-y-2">
          {loading ? (
            <p className="rounded-xl bg-white/60 p-8 text-center text-xs text-gray-500">
              Memuat notifikasi...
            </p>
          ) : paginatedNotifications.length > 0 ? (
            paginatedNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => void toggleReadStatus(item)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  item.isRead
                    ? "bg-white/60 border-transparent opacity-80 hover:bg-white/80"
                    : "bg-white border-emerald-300 shadow-sm hover:border-emerald-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon Sesuai Kategori */}
                  <div className="mt-0.5">
                    {item.type === "setoran" && (
                      <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === "nasabah" && (
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                        <Bell className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === "peringatan" && (
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === "sistem" && (
                      <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                        <Info className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Content Teks */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-gray-900">
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium block pt-0.5">
                      {item.time}
                    </span>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white/50 rounded-xl">
              <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-gray-500 font-medium">
                Tidak ada notifikasi yang ditemukan.
              </p>
            </div>
          )}
        </div>

        {/* Control Pagination */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <span>
            Menampilkan{" "}
            {filteredNotifications.length > 0
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}{" "}
            hingga{" "}
            {Math.min(currentPage * itemsPerPage, filteredNotifications.length)}{" "}
            dari {filteredNotifications.length} notifikasi
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#E5D7B3] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  currentPage === page
                    ? "bg-[#044E3A] text-white"
                    : "bg-white/50 hover:bg-white text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#E5D7B3] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function toNotificationItem(item: AdminNotification): NotificationItem {
  const type: NotificationItem["type"] = item.nasabah_id
    ? item.judul.toLowerCase().includes("setoran")
      ? "setoran"
      : "nasabah"
    : item.tipe === "peringatan" || item.tipe === "error"
      ? "peringatan"
      : "sistem";
  return {
    id: item.id,
    type,
    title: item.judul,
    message: item.nasabah
      ? `${item.nasabah}: ${item.pesan}`
      : item.pesan,
    time: new Date(item.created_at).toLocaleString("id-ID"),
    isRead: Boolean(item.sudah_dibaca),
  };
}
