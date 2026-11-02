"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { getCurrentAdmin, type AdminUser } from "@/services/auth.service";

export default function Topbar() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAdmin(getCurrentAdmin());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const adminName = admin?.nama ?? "Admin";
  const initials = adminName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-[#f4ecd8]/60 px-6">
      {/* Search Bar */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari sesuatu..."
          className="w-full rounded-xl border border-gray-200/80 bg-white/80 py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-[#025E43]"
        />
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-4">
        {/* Notification Bell - Menuju ke /notifikasi saat diklik */}
        <Link
          href="/notifikasi"
          className="relative p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-black/5 transition-colors cursor-pointer"
          title="Lihat Notifikasi"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Link>

        {/* PROFILE BUTTON - Menuju ke /profil saat diklik */}
        <Link
          href="/profil"
          className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-black/5 transition-colors cursor-pointer"
        >
          <div className="text-right">
            <p className="text-xs font-bold text-gray-800">{adminName}</p>
            <p className="text-[10px] text-gray-500">
              {admin?.role === "superadmin" ? "Super Admin" : "Admin"}
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#025E43] font-bold text-white text-xs">
            {initials || "A"}
          </div>
        </Link>
      </div>
    </header>
  );
}
