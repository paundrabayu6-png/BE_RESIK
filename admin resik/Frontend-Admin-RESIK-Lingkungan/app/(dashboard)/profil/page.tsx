"use client";

import React, { useEffect, useState } from "react";
import { getCurrentAdmin, type AdminUser } from "@/services/auth.service";
import {
  Camera,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  User,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";

export default function ProfilAdminPage() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAdmin(getCurrentAdmin());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const adminName = admin?.nama ?? "Admin";
  const adminRole = admin?.role === "superadmin" ? "SUPER ADMIN" : "ADMIN";

  return (
    <div className="space-y-6">
      {/* Top Header / Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span className="text-[#064e3b] font-medium">Edit</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Kelola Profil</h1>
        <p className="text-xs text-gray-500 mt-1">
          Kelola informasi profil dan keamanan akun Anda.
        </p>
      </div>

      {/* Form Card Container */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs space-y-8">
        {/* Profile Avatar & Header Info */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
              alt={adminName}
              className="w-20 h-20 rounded-2xl object-cover"
            />
            <button className="absolute -bottom-1 -right-1 p-2 bg-[#064e3b] text-white rounded-xl shadow-md hover:bg-[#04382a] transition-colors cursor-pointer">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{adminName}</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                {adminRole}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" /> Akun Terverifikasi
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Terdaftar sejak: 12 Januari 2023
            </p>
          </div>
        </div>

        {/* Section 1: Informasi Profil */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-l-4 border-[#064e3b] pl-3">
            <h3 className="text-sm font-bold text-gray-900">
              Informasi Profil
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  key={`admin-name-${admin?.id ?? "loading"}`}
                  type="text"
                  defaultValue={admin?.nama ?? ""}
                  className="w-full bg-gray-50/70 border border-gray-200 rounded-xl text-xs pl-10 pr-4 py-3 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  key={`admin-email-${admin?.id ?? "loading"}`}
                  type="email"
                  defaultValue={admin?.email ?? ""}
                  className="w-full bg-gray-50/70 border border-gray-200 rounded-xl text-xs pl-10 pr-4 py-3 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Nomor Telepon
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  defaultValue="0812-3456-7890"
                  className="w-full bg-gray-50/70 border border-gray-200 rounded-xl text-xs pl-10 pr-4 py-3 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Ubah Password */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-l-4 border-[#064e3b] pl-3">
            <h3 className="text-sm font-bold text-gray-900">Ubah Password</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Password Lama
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showOldPassword ? "text" : "password"}
                  defaultValue="12345678"
                  className="w-full bg-gray-50/70 border border-gray-200 rounded-xl text-xs pl-10 pr-10 py-3 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showOldPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="hidden md:block"></div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Password Baru
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Buat password baru"
                  className="w-full bg-gray-50/70 border border-gray-200 rounded-xl text-xs pl-10 pr-10 py-3 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password baru"
                  className="w-full bg-gray-50/70 border border-gray-200 rounded-xl text-xs pl-10 pr-10 py-3 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#04382a] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
