import { apiFetch } from './auth.service';
import type { Nasabah } from '../types/nasabah';

export interface NasabahListResponse {
  success: boolean;
  data: Nasabah[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NasabahQueryParams {
  status?: 'aktif' | 'nonaktif';
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Ambil semua nasabah (admin)
 */
export async function getAllNasabah(params: NasabahQueryParams = {}): Promise<NasabahListResponse> {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  return apiFetch(`/nasabah?${query.toString()}`);
}

/**
 * Ambil detail nasabah by ID
 */
export async function getNasabahById(id: string | number): Promise<{ success: boolean; data: Nasabah }> {
  return apiFetch(`/nasabah/${id}`);
}

/**
 * Update status nasabah
 */
export async function updateStatusNasabah(
  id: string | number,
  status: 'aktif' | 'nonaktif'
): Promise<{ success: boolean; message: string }> {
  return apiFetch(`/nasabah/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

/**
 * Riwayat setoran nasabah
 */
export async function getRiwayatNasabah(id: string | number) {
  return apiFetch(`/nasabah/${id}/riwayat`);
}
