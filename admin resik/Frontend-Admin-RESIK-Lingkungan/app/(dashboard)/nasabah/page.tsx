import NasabahStats from "@/components/features/nasabah/nasabah-stats";
import NasabahTable from "@/components/features/nasabah/nasabah-table";

export default function NasabahPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Kelola data nasabah Bank Sampah RESIK.</p>
      <NasabahStats />
      <NasabahTable />
    </div>
  );
}