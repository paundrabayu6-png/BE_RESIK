import Link from "next/link";
import { MoreVertical } from "lucide-react";
import Avatar from "@/components/ui/avatar";
import { JenisBadge, StatusBadge } from "@/components/features/setoran/status-badge";

type RecentDeposit = {
  id: number;
  nasabah: string;
  jenis: string;
  berat_kg: number;
  total_saldo: number;
  status: string;
  tanggal: string;
};

export default function SetoranTerbaru({
  items,
  loading,
}: {
  items: RecentDeposit[];
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white shadow-sm">
      <div className="flex items-center justify-between p-5">
        <div>
          <h3 className="text-sm font-bold text-forest">Setoran Terbaru</h3>
          <p className="text-[11px] text-gray-500">Menampilkan 6 aktivitas setoran sampah terakhir.</p>
        </div>
        <Link href="/setoran" className="text-xs font-semibold text-forest">
          Lihat Semua
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500">
            <tr>
              {["Nasabah", "Jenis Sampah", "Berat", "Poin", "Status", "Tanggal", "Aksi"].map((h) => (
                <th key={h} className="px-5 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-t border-gray-100">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.nasabah} size={30} />
                    <p className="font-semibold text-gray-900">{s.nasabah}</p>
                  </div>
                </td>
                <td className="px-5 py-3"><JenisBadge jenis={s.jenis} /></td>
                <td className="px-5 py-3 text-gray-800">{Number(s.berat_kg).toFixed(1)} kg</td>
                <td className="px-5 py-3 font-bold text-forest">{Number(s.total_saldo).toLocaleString("id-ID")} Rp</td>
                <td className="px-5 py-3"><StatusBadge status={s.status as "menunggu" | "verifikasi" | "diterima" | "ditolak"} /></td>
                <td className="px-5 py-3 text-gray-500">{new Date(s.tanggal).toLocaleDateString("id-ID")}</td>
                <td className="px-5 py-3 text-gray-500"><MoreVertical size={14} /></td>
              </tr>
            ))}
            {!loading && items.length === 0 && <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-500">Belum ada data setoran.</td></tr>}
            {loading && <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-500">Memuat data setoran...</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}