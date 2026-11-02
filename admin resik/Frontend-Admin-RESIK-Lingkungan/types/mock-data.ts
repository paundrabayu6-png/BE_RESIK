export type MockJenisSampah = "PLASTIK PET" | "KERTAS/KARDUS" | "LOGAM/BESI" | "LAINNYA";
export type MockStatusSetoran = "Verifikasi" | "Berhasil" | "Ditolak";

export interface MockNasabah {
  id: string;
  nama: string;
  telepon: string;
  alamat: string;
  saldo: number;
  totalSetoran: number;
  status: "Aktif" | "Tidak Aktif";
}

export interface MockSetoran {
  id: string;
  nasabahId: string;
  nasabah: string;
  jenis: MockJenisSampah;
  berat: number;
  poin: number;
  status: MockStatusSetoran;
  tanggal: string;
}
