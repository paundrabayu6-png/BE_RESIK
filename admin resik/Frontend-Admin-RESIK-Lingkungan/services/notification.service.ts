import { apiFetch } from "./auth.service";

export interface AdminNotification {
  id: number;
  nasabah_id: number | null;
  nasabah: string | null;
  judul: string;
  pesan: string;
  tipe: "info" | "sukses" | "peringatan" | "error";
  sudah_dibaca: number | boolean;
  created_at: string;
}

export async function getAdminNotifications(): Promise<{
  success: boolean;
  data: AdminNotification[];
}> {
  return apiFetch("/notifikasi/admin");
}

export async function markAdminNotificationRead(id: number): Promise<void> {
  await apiFetch(`/notifikasi/admin/${id}/baca`, { method: "PUT" });
}

export async function markAllAdminNotificationsRead(): Promise<void> {
  await apiFetch("/notifikasi/admin/baca-semua", { method: "PUT" });
}
