import { FileText, History, PieChart, Truck, Users } from "lucide-react";

export const MENU = [
  { href: "/dashboard", label: "Dashboard", icon: PieChart },
  { href: "/nasabah", label: "Data Nasabah", icon: Users },
  { href: "/setoran", label: "Kelola Setoran", icon: Truck },
  { href: "/aktivitas", label: "Aktivitas Nasabah", icon: History },
  { href: "/laporan", label: "Laporan", icon: FileText },
];

export const PAGE_META: Record<string, { section: string; crumb: string; title: string }> = {
  "/dashboard": { section: "Dashboard", crumb: "Overview", title: "Dashboard" },
  "/nasabah": { section: "Data Nasabah", crumb: "Daftar", title: "Data Nasabah" },
  "/setoran": { section: "Kelola Setoran", crumb: "Daftar", title: "Kelola Setoran" },
  "/aktivitas": { section: "Aktivitas Nasabah", crumb: "Overview", title: "Aktivitas Nasabah" },
  "/laporan": { section: "Laporan", crumb: "Overview", title: "Laporan" },
  "/profil": { section: "Profil Admin", crumb: "Edit", title: "Profil Admin" },
  "/nasabah/tambah": { section: "Data Nasabah", crumb: "Tambah", title: "Tambah Nasabah" },
};