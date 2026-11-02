export function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
const BULAN: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", Mei: "05", Jun: "06",
  Jul: "07", Agu: "08", Sep: "09", Okt: "10", Nov: "11", Des: "12",
};

// "24 Okt 2024" -> "2024-10-24" (untuk filter tanggal)
export function tanggalToISO(t: string) {
  const [d, m, y] = t.split(" ");
  return `${y}-${BULAN[m]}-${d.padStart(2, "0")}`;
}