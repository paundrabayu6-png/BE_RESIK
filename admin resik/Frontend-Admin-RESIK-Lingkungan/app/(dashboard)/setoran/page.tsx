import SetoranTable from "@/components/features/setoran/setoran-table";

export default function KelolaSetoranPage() {
  return (
    <div className="space-y-4 p-6">
      <div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
          <span>Kelola Setoran</span>
          <span>&gt;</span>
          <span className="font-bold text-emerald-800">Daftar</span>
        </div>
        <h1 className="mt-1 text-xl font-bold leading-tight text-gray-900">
          Kelola Setoran
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Kelola data setoran sampah nasabah.
        </p>
      </div>
      <SetoranTable />
    </div>
  );
}
