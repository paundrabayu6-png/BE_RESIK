import NasabahForm from "@/components/features/nasabah/nasabah-form";

export default function TambahNasabahPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Lengkapi data nasabah baru Bank Sampah RESIK.</p>
      <NasabahForm />
    </div>
  );
}