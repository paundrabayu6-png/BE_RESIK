"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getCurrentAdmin,
  logoutAdmin,
  type AdminUser,
} from "@/services/auth.service";
import {
  LayoutDashboard,
  Users,
  Package,
  History,
  FileText,
  LogOut,
  UserPlus,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAdmin(getCurrentAdmin());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Data Nasabah", href: "/nasabah", icon: Users },
    { name: "Kelola Setoran", href: "/setoran", icon: Package },
    { name: "Aktivitas Nasabah", href: "/aktivitas", icon: History },
    { name: "Laporan", href: "/laporan", icon: FileText },
    { name: "Daftarkan Admin", href: "/register", icon: UserPlus },
  ];
  const adminName = admin?.nama ?? "Admin";
  const adminRole = admin?.role === "superadmin" ? "Super Admin" : "Admin";
  const initials = adminName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-gray-100 bg-[#f4ecd8] p-4 min-h-screen">
      <div className="space-y-6">
        {/* Logo Menggunakan Overlay.png */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="relative h-8 w-8 shrink-0">
            <Image
              src="/Overlay.png"
              alt="RESIK Logo"
              width={32}
              height={32}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <span className="font-bold text-gray-900 text-lg">RESIK Admin</span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-black/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Logout Section */}
      <div className="space-y-2 border-t border-gray-200/50 pt-4">
        {/* PROFILE CARD - Menuju ke /profil saat diklik */}
        <Link
          href="/profil"
          className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-black/5 transition-colors cursor-pointer"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#025E43] font-bold text-white text-xs">
            {initials || "A"}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">{adminName}</p>
            <p className="text-[10px] text-gray-500">{adminRole}</p>
          </div>
        </Link>

        {/* Logout Button */}
        <button
          type="button"
          onClick={() => {
            logoutAdmin();
            window.location.assign("/login");
          }}
          className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
