"use client";

import Link from "next/link";
import { AlertTriangle, Check, FileCheck } from "lucide-react";
import Modal from "@/components/ui/modal";
import Avatar from "@/components/ui/avatar";

export type SavedData = {
  nama: string;
  id: string;
  telepon: string;
  status: "Aktif" | "Tidak Aktif";
  tanggal: string;
};

function StatusPill({ status }: { status: SavedData["status"] }) {
  const cls = status === "Aktif" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600";
  return <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${cls}`}>● {status}</span>;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-xs">
      <span className="text-[10px] uppercase tracking-wide text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900">{children}</span>
    </div>
  );
}

const outlineBtn =
  "flex-1 rounded-lg border-2 border-forest py-2.5 text-xs font-semibold text-forest transition hover:bg-forest/5";
const solidBtn =
  "flex-1 rounded-lg bg-forest py-2.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-60";

/* ---------- Konfirmasi ---------- */
export function ConfirmModal({
  open, data, saving, onCancel, onConfirm,
}: {
  open: boolean;
  data: SavedData;
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onClose={saving ? () => {} : onCancel}>
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sand text-forest">
        <FileCheck size={22} />
      </div>
      <h2 className="text-center text-base font-bold text-forest">Simpan Data Nasabah?</h2>
      <p className="mb-4 mt-2 text-center text-xs text-gray-500">
        Pastikan data yang kamu masukkan sudah benar. Data nasabah akan langsung tersimpan dan akunnya aktif.
      </p>

      <div className="rounded-xl bg-sand/60 px-4 py-2">
        <Row label="Nama Lengkap">{data.nama}</Row>
        <Row label="ID Nasabah"><span className="text-forest">{data.id}</span></Row>
        <Row label="Nomor Telepon">{data.telepon}</Row>
        <Row label="Saldo Awal">Rp 0</Row>
        <Row label="Status"><StatusPill status={data.status} /></Row>
      </div>

      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="my-3 block w-full text-center text-xs font-semibold text-forest"
      >
        Periksa kembali data
      </button>

      <div className="flex gap-3">
        <button type="button" onClick={onCancel} disabled={saving} className={outlineBtn}>
          Batal
        </button>
        <button type="button" onClick={onConfirm} disabled={saving} className={solidBtn}>
          {saving ? "Menyimpan..." : "✓ Ya, Simpan"}
        </button>
      </div>
    </Modal>
  );
}

/* ---------- Berhasil ---------- */
export function SuccessModal({
  open, data, onAgain, onClose,
}: {
  open: boolean;
  data: SavedData;
  onAgain: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <Check size={26} />
      </div>
      <h2 className="text-center text-base font-bold text-forest">Nasabah Berhasil Ditambahkan!</h2>
      <p className="mb-3 mt-2 text-center text-xs text-gray-500">
        Data nasabah baru telah tersimpan dan akun Bank Sampah RESIK sudah aktif.
      </p>

      <p className="mb-4 rounded-full bg-emerald-50 px-3 py-1.5 text-center text-[10px] font-medium text-forest">
        Notifikasi selamat datang telah dikirim melalui SMS/WhatsApp.
      </p>

      <div className="rounded-xl bg-sand/60 p-4">
        <div className="mb-2 flex items-center gap-3 border-b border-black/5 pb-3">
          <Avatar name={data.nama || "N"} size={36} />
          <div className="leading-tight">
            <p className="text-sm font-bold text-gray-900">{data.nama}</p>
            <p className="text-[10px] font-semibold text-forest">{data.id}</p>
          </div>
        </div>
        <Row label="Nomor Telepon">{data.telepon}</Row>
        <Row label="Saldo Awal">Rp 0</Row>
        <Row label="Tanggal Bergabung">{data.tanggal}</Row>
        <Row label="Status"><StatusPill status={data.status} /></Row>
      </div>

      <Link
        href={`/nasabah/${data.id}`}
        className="mt-4 block w-full rounded-lg bg-forest py-2.5 text-center text-xs font-semibold text-white hover:opacity-90"
      >
        Lihat Detail Nasabah
      </Link>
      <div className="mt-3 flex gap-3">
        <button type="button" onClick={onAgain} className={outlineBtn}>
          Tambah Nasabah Lagi
        </button>
        <Link href="/nasabah" className="flex flex-1 items-center justify-center text-xs font-semibold text-gray-600">
          Kembali ke Daftar
        </Link>
      </div>
    </Modal>
  );
}

/* ---------- Gagal ---------- */
export function ErrorModal({
  open, reasons, onRetry, onClose,
}: {
  open: boolean;
  reasons: string[];
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle size={22} />
      </div>
      <h2 className="text-center text-base font-bold text-forest">Gagal Menyimpan Data</h2>
      <p className="mb-4 mt-2 text-center text-xs text-gray-500">
        Data nasabah belum berhasil disimpan. Silakan periksa kembali informasi yang kamu isi lalu coba lagi.
      </p>

      <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-3">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-red-500">Penyebab</p>
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-700">
          {reasons.map((r) => <li key={r}>{r}</li>)}
        </ul>
        <p className="mt-2 border-t border-red-100 pt-2 text-[10px] text-gray-400">Kode: ERR-409</p>
      </div>

      <p className="my-3 text-center text-[11px] text-gray-500">
        Masalah berlanjut? <span className="font-semibold text-forest underline">Hubungi tim dukungan RESIK.</span>
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="block w-full rounded-lg bg-forest py-2.5 text-xs font-semibold text-white hover:opacity-90"
      >
        Periksa &amp; Coba Lagi
      </button>
      <button type="button" onClick={onClose} className="mt-3 block w-full text-center text-xs font-semibold text-forest">
        Tutup
      </button>
    </Modal>
  );
}