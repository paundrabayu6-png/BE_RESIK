import { apiFetch } from './auth.service';
import type { Setoran } from '../types/setoran';

export interface SetoranListResponse {
  success: boolean;
  data: Setoran[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SetoranQueryParams {
  status?: string;
  nasabah_id?: string | number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminTransaksi {
  id: number;
  nasabah: string;
  nasabah_id: number;
  tipe: "masuk" | "keluar";
  jumlah: number;
  metode: string | null;
  nomor_tujuan: string | null;
  status: string;
  keterangan: string | null;
  created_at: string;
}

export interface AdminTransaksiListResponse {
  success: boolean;
  data: AdminTransaksi[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  total_nasabah: number;
  setoran_bulan_ini: {
    jumlah: number;
    total_kg: number;
    total_nilai: number;
  };
  menunggu_verifikasi: number;
  total_saldo_terdistribusi: number;
  grafik_6_bulan: Array<{
    bulan: string;
    bulan_no: number;
    tahun: number;
    total_kg: number;
    total_nilai: number;
    jumlah_setoran: number;
  }>;
  distribusi_jenis: Array<{ nama: string; total_kg: number }>;
  setoran_terbaru: Array<{
    id: number;
    nasabah: string;
    jenis: string;
    berat_kg: number;
    total_saldo: number;
    status: string;
    tanggal: string;
  }>;
}

export interface LaporanSetoranResponse {
  success: boolean;
  data: Array<{
    id: number;
    nasabah: string;
    telepon: string;
    jenis: string;
    berat_kg: number;
    harga_per_kg: number;
    total_saldo: number;
    status: string;
    tanggal: string;
  }>;
  summary: {
    total_setoran: number;
    total_kg: number;
    total_nilai: number;
    total_nasabah_aktif: number;
  };
}

/**
 * Ambil semua setoran (admin)
 */
export async function getAllSetoran(params: SetoranQueryParams = {}): Promise<SetoranListResponse> {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.nasabah_id) query.set('nasabah_id', String(params.nasabah_id));
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  return apiFetch(`/setoran?${query.toString()}`);
}

/**
 * Detail setoran
 */
export async function getSetoranById(id: string | number) {
  return apiFetch(`/setoran/${id}`);
}

/**
 * Verifikasi / tolak setoran
 */
export async function verifikasiSetoran(
  id: string | number,
  status: 'diterima' | 'ditolak',
  catatan?: string
): Promise<{ success: boolean; message: string }> {
  return apiFetch(`/setoran/${id}/verifikasi`, {
    method: 'PUT',
    body: JSON.stringify({ status, catatan }),
  });
}

/**
 * Ambil statistik dashboard
 */
export async function getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
  return apiFetch('/stats');
}

/**
 * Ambil laporan setoran
 */
export async function getLaporanSetoran(bulan?: number, tahun?: number): Promise<LaporanSetoranResponse> {
  const query = new URLSearchParams();
  if (bulan) query.set('bulan', String(bulan));
  if (tahun) query.set('tahun', String(tahun));
  return apiFetch(`/laporan/setoran?${query.toString()}`);
}

export async function getAllTransaksi(limit = 1000, page = 1): Promise<AdminTransaksiListResponse> {
  return apiFetch(`/transaksi?page=${page}&limit=${limit}`);
}

/**
 * Ambil daftar jenis sampah (termasuk harga)
 */
export async function getJenisSampah() {
  return apiFetch('/jenis-sampah');
}

/**
 * Update harga jenis sampah
 */
export async function updateHargaJenis(id: string | number, harga_per_kg: number) {
  return apiFetch(`/jenis-sampah/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ harga_per_kg }),
  });
}
