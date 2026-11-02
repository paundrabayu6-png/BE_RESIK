export type StatusSetoran = "menunggu" | "verifikasi" | "diterima" | "ditolak";
export type JenisSampah = "PLASTIK_PET" | "KERTAS" | "LOGAM" | "ORGANIK" | "MINYAK" | "LAINNYA";

export interface Setoran {
  id: number;
  nasabah_id: number;
  nasabah: string;        // nama nasabah
  jenis: string;          // nama jenis sampah
  jenis_kode: JenisSampah;
  berat_kg: number;
  harga_per_kg: number;
  total_saldo: number;
  status: StatusSetoran;
  catatan?: string;
  tanggal: string;
  diverifikasi_oleh?: string;
}

export interface JenisSampahItem {
  id: number;
  nama: string;
  kode: JenisSampah;
  harga_per_kg: number;
  satuan: string;
  keterangan?: string;
  aktif: number;
}