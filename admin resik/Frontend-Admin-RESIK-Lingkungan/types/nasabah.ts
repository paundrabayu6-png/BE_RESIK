export type StatusNasabah = "aktif" | "nonaktif";

export interface Nasabah {
  id: number;
  nama: string;
  telepon: string;
  email?: string;
  alamat?: string;
  saldo: number;
  total_setoran: number; // kg
  status: StatusNasabah;
  jumlah_setoran?: number;
  created_at?: string;
}