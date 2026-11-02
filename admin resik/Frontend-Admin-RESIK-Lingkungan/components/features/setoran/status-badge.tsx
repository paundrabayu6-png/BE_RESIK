import type { StatusSetoran } from "@/types/setoran";

const STATUS_STYLE: Record<StatusSetoran, { dot: string; text: string }> = {
  diterima: { dot: "bg-emerald-500", text: "text-emerald-600" },
  menunggu: { dot: "bg-orange-400", text: "text-orange-500" },
  verifikasi: { dot: "bg-orange-400", text: "text-orange-500" },
  ditolak: { dot: "bg-red-500", text: "text-red-600" },
};

export function StatusBadge({ status }: { status: StatusSetoran }) {
  const s = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status === "diterima" ? "Diterima" : status === "ditolak" ? "Ditolak" : status === "verifikasi" ? "Verifikasi" : "Menunggu"}
    </span>
  );
}

const JENIS_STYLE: Record<string, string> = {
  "PLASTIK PET": "bg-blue-50 text-blue-600",
  "KERTAS/KARDUS": "bg-orange-50 text-orange-600",
  "LOGAM/BESI": "bg-purple-50 text-purple-600",
  LAINNYA: "bg-red-50 text-red-600",
};

export function JenisBadge({ jenis }: { jenis: string }) {
  const key = jenis.toUpperCase();
  const style = JENIS_STYLE[key] ?? "bg-gray-100 text-gray-600";
  return <span className={`rounded px-2 py-1 text-[10px] font-bold ${style}`}>{jenis}</span>;
}