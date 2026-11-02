import type { MockJenisSampah, MockNasabah, MockSetoran } from "@/types/mock-data";

export const SETORAN_BULANAN = [
  { label: "Jan", kg: 450 }, { label: "Feb", kg: 620 }, { label: "Mar", kg: 580 },
  { label: "Apr", kg: 740 }, { label: "Mei", kg: 890 }, { label: "Jun", kg: 810 },
  { label: "Jul", kg: 950 }, { label: "Agu", kg: 1050 }, { label: "Sep", kg: 1200 },
  { label: "Okt", kg: 1150 },
];

export const SETORAN_MINGGUAN = [
  { label: "M1", kg: 210 }, { label: "M2", kg: 260 }, { label: "M3", kg: 240 },
  { label: "M4", kg: 310 }, { label: "M5", kg: 290 }, { label: "M6", kg: 340 },
  { label: "M7", kg: 320 }, { label: "M8", kg: 380 },
];

export const NASABAH_BARU: Record<"2023" | "2024", { label: string; jumlah: number }[]> = {
  "2024": [
    { label: "Jan", jumlah: 45 }, { label: "Feb", jumlah: 52 }, { label: "Mar", jumlah: 68 },
    { label: "Apr", jumlah: 40 }, { label: "Mei", jumlah: 85 }, { label: "Jun", jumlah: 75 },
    { label: "Jul", jumlah: 92 }, { label: "Agu", jumlah: 105 }, { label: "Sep", jumlah: 98 },
    { label: "Okt", jumlah: 120 },
  ],
  "2023": [
    { label: "Jan", jumlah: 30 }, { label: "Feb", jumlah: 38 }, { label: "Mar", jumlah: 44 },
    { label: "Apr", jumlah: 35 }, { label: "Mei", jumlah: 50 }, { label: "Jun", jumlah: 58 },
    { label: "Jul", jumlah: 61 }, { label: "Agu", jumlah: 70 }, { label: "Sep", jumlah: 66 },
    { label: "Okt", jumlah: 80 },
  ],
};

export const SETORAN_TERBARU: MockSetoran[] = [
  { id: "STR-9921", nasabahId: "NSB-0421", nasabah: "Siti Aminah", jenis: "PLASTIK PET", berat: 12.5, poin: 1250, status: "Berhasil", tanggal: "24 Okt 2024" },
  { id: "STR-9922", nasabahId: "NSB-0512", nasabah: "Budi Santoso", jenis: "KERTAS/KARDUS", berat: 28.0, poin: 2800, status: "Verifikasi", tanggal: "24 Okt 2024" },
  { id: "STR-9923", nasabahId: "NSB-0318", nasabah: "Rendi Wijaya", jenis: "LOGAM/BESI", berat: 5.2, poin: 3120, status: "Berhasil", tanggal: "23 Okt 2024" },
  { id: "STR-9924", nasabahId: "NSB-0489", nasabah: "Maya Lestari", jenis: "PLASTIK PET", berat: 8.5, poin: 850, status: "Berhasil", tanggal: "23 Okt 2024" },
  { id: "STR-9925", nasabahId: "NSB-0622", nasabah: "Diana Putri", jenis: "LAINNYA", berat: 2.0, poin: 400, status: "Verifikasi", tanggal: "23 Okt 2024" },
];

export const DAFTAR_NASABAH: MockNasabah[] = [
  { id: "NSB-0421", nama: "Siti Aminah", telepon: "0812-3456-7890", alamat: "Jl. Merdeka No. 12, Jakarta", saldo: 450000, totalSetoran: 124.5, status: "Aktif" },
  { id: "NSB-0512", nama: "Budi Santoso", telepon: "0856-9876-5432", alamat: "Jl. Mawar Gg. 3 No. 45, Bandung", saldo: 120500, totalSetoran: 88.2, status: "Aktif" },
  { id: "NSB-0318", nama: "Rendi Wijaya", telepon: "0821-2233-4455", alamat: "Perum Hijau Lestari Blok C2, Depok", saldo: 15000, totalSetoran: 15.0, status: "Tidak Aktif" },
  { id: "NSB-0489", nama: "Maya Lestari", telepon: "0819-0909-1212", alamat: "Kavling Harapan Indah No. 9, Bekasi", saldo: 825400, totalSetoran: 210.5, status: "Aktif" },
  { id: "NSB-0622", nama: "Diana Putri", telepon: "0852-1111-2222", alamat: "Apartment Green View Tower A-02, Jakarta Selatan", saldo: 0, totalSetoran: 2.0, status: "Aktif" },
  { id: "NSB-0701", nama: "Agus Pratama", telepon: "0813-7000-1111", alamat: "Jl. Kenanga No. 7, Bogor", saldo: 230000, totalSetoran: 64.0, status: "Aktif" },
  { id: "NSB-0702", nama: "Lina Marlina", telepon: "0857-2222-3333", alamat: "Jl. Cempaka Raya No. 21, Tangerang", saldo: 98000, totalSetoran: 41.3, status: "Aktif" },
  { id: "NSB-0703", nama: "Hendra Gunawan", telepon: "0878-4444-5555", alamat: "Jl. Pahlawan No. 5, Depok", saldo: 5000, totalSetoran: 6.8, status: "Tidak Aktif" },
  { id: "NSB-0704", nama: "Rina Susanti", telepon: "0811-6666-7777", alamat: "Komplek Melati Blok B4, Bekasi", saldo: 342500, totalSetoran: 97.1, status: "Aktif" },
  { id: "NSB-0705", nama: "Yoga Permana", telepon: "0822-8888-9999", alamat: "Jl. Sudirman No. 88, Jakarta", saldo: 76000, totalSetoran: 28.4, status: "Aktif" },
  { id: "NSB-0706", nama: "Fitri Handayani", telepon: "0838-1212-3434", alamat: "Jl. Anggrek No. 3, Bandung", saldo: 0, totalSetoran: 0, status: "Tidak Aktif" },
  { id: "NSB-0707", nama: "Dewi Anggraini", telepon: "0896-5656-7878", alamat: "Perum Griya Asri No. 14, Depok", saldo: 510000, totalSetoran: 156.9, status: "Aktif" },
];
export const DAFTAR_SETORAN: MockSetoran[] = [
  ...SETORAN_TERBARU,
  { id: "STR-9926", nasabahId: "NSB-0701", nasabah: "Agus Pratama", jenis: "KERTAS/KARDUS", berat: 15.0, poin: 1500, status: "Berhasil", tanggal: "22 Okt 2024" },
  { id: "STR-9927", nasabahId: "NSB-0702", nasabah: "Lina Marlina", jenis: "PLASTIK PET", berat: 6.4, poin: 640, status: "Berhasil", tanggal: "22 Okt 2024" },
  { id: "STR-9928", nasabahId: "NSB-0704", nasabah: "Rina Susanti", jenis: "LOGAM/BESI", berat: 9.8, poin: 5880, status: "Verifikasi", tanggal: "21 Okt 2024" },
  { id: "STR-9929", nasabahId: "NSB-0705", nasabah: "Yoga Permana", jenis: "LAINNYA", berat: 3.2, poin: 640, status: "Ditolak", tanggal: "21 Okt 2024" },
  { id: "STR-9930", nasabahId: "NSB-0707", nasabah: "Dewi Anggraini", jenis: "PLASTIK PET", berat: 20.0, poin: 2000, status: "Berhasil", tanggal: "20 Okt 2024" },
  { id: "STR-9931", nasabahId: "NSB-0421", nasabah: "Siti Aminah", jenis: "KERTAS/KARDUS", berat: 11.0, poin: 1100, status: "Berhasil", tanggal: "19 Okt 2024" },
  { id: "STR-9932", nasabahId: "NSB-0489", nasabah: "Maya Lestari", jenis: "LOGAM/BESI", berat: 4.5, poin: 2700, status: "Berhasil", tanggal: "18 Okt 2024" },
];
export const NIK_TERDAFTAR = ["3578012345670001"];

export const WILAYAH: Record<string, string[]> = {
  "Jakarta": ["Menteng", "Tebet", "Kebayoran Baru", "Cengkareng"],
  "Bandung": ["Coblong", "Cicendo", "Lengkong", "Sukajadi"],
  "Depok": ["Beji", "Cimanggis", "Sukmajaya", "Pancoran Mas"],
  "Bekasi": ["Bekasi Barat", "Bekasi Selatan", "Jatiasih", "Pondok Gede"],
  "Bogor": ["Bogor Tengah", "Bogor Barat", "Tanah Sareal", "Cibinong"],
  "Tangerang": ["Ciledug", "Karawaci", "Cipondoh", "Pinang"],
};
export const HARGA_PER_KG: Record<MockJenisSampah, number> = {
  "PLASTIK PET": 3000,
  "KERTAS/KARDUS": 2000,
  "LOGAM/BESI": 6000,
  LAINNYA: 1500,
};

export const POIN_PER_KG: Record<MockJenisSampah, number> = {
  "PLASTIK PET": 100,
  "KERTAS/KARDUS": 100,
  "LOGAM/BESI": 600,
  LAINNYA: 200,
};

export function getSetoranById(id: string) {
  return DAFTAR_SETORAN.find((s) => s.id === id);
}

export function getNasabahById(id: string) {
  return DAFTAR_NASABAH.find((n) => n.id === id);
}