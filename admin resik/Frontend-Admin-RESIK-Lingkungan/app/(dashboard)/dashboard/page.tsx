"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Target,
  Users,
  Wallet,
  ShoppingBag,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StatCard from "@/components/dashboard/stat-card";
import SetoranTerbaru from "@/components/dashboard/setoran-terbaru";
import { getAllNasabah } from "@/services/nasabah.service";
import type { Nasabah } from "@/types/nasabah";
import {
  getAllSetoran,
  getDashboardStats,
  type DashboardStats,
} from "@/services/setoran.service";
import type { Setoran } from "@/types/setoran";

const PAGE_SIZE = 1000;

async function fetchAllSetoran(): Promise<Setoran[]> {
  const firstPage = await getAllSetoran({ page: 1, limit: PAGE_SIZE });
  const deposits = [...firstPage.data];
  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await getAllSetoran({ page, limit: PAGE_SIZE });
    deposits.push(...response.data);
  }
  return deposits;
}

async function fetchAllNasabah(): Promise<Nasabah[]> {
  const firstPage = await getAllNasabah({ page: 1, limit: PAGE_SIZE });
  const customers = [...firstPage.data];
  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await getAllNasabah({ page, limit: PAGE_SIZE });
    customers.push(...response.data);
  }
  return customers;
}

function groupDepositsByMonth(deposits: Setoran[]) {
  const now = new Date();
  const firstMonth = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  return Array.from({ length: 12 }, (_, index) => {
    const month = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + index, 1);
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    const weight = deposits
      .filter((deposit) => {
        const date = new Date(deposit.tanggal);
        return deposit.status === "diterima" && date >= month && date < nextMonth;
      })
      .reduce((total, deposit) => total + Number(deposit.berat_kg), 0);
    return {
      name: month.toLocaleDateString("id-ID", { month: "short" }),
      berat: weight,
    };
  });
}

function groupDepositsByWeek(deposits: Setoran[]) {
  const now = new Date();
  const mondayOffset = (now.getDay() + 6) % 7;
  const currentMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset);
  const firstWeek = new Date(currentMonday);
  firstWeek.setDate(firstWeek.getDate() - 7 * 7);
  return Array.from({ length: 8 }, (_, index) => {
    const start = new Date(firstWeek);
    start.setDate(start.getDate() + index * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const weight = deposits
      .filter((deposit) => {
        const date = new Date(deposit.tanggal);
        return deposit.status === "diterima" && date >= start && date < end;
      })
      .reduce((total, deposit) => total + Number(deposit.berat_kg), 0);
    return {
      name: start.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      berat: weight,
    };
  });
}

function groupNewCustomersByMonth(customers: Nasabah[], year: number) {
  return Array.from({ length: 12 }, (_, month) => ({
    name: new Date(year, month, 1).toLocaleDateString("id-ID", { month: "short" }),
    nasabah: customers.filter((customer) => {
      if (!customer.created_at) return false;
      const createdAt = new Date(customer.created_at);
      return createdAt.getFullYear() === year && createdAt.getMonth() === month;
    }).length,
  }));
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 1,
    notation: value >= 1_000_000 ? "compact" : "standard",
  }).format(value);
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [deposits, setDeposits] = useState<Setoran[]>([]);
  const [customers, setCustomers] = useState<Nasabah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [depositPeriod, setDepositPeriod] = useState<"Bulanan" | "Mingguan">("Bulanan");
  const [customerYear, setCustomerYear] = useState(new Date().getFullYear());

  useEffect(() => {
    let active = true;
    Promise.all([getDashboardStats(), fetchAllSetoran(), fetchAllNasabah()])
      .then(([statsResponse, depositRows, customerRows]) => {
        if (!active) return;
        setStats(statsResponse.data);
        setDeposits(depositRows);
        setCustomers(customerRows);
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Gagal memuat dashboard.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const depositChart = useMemo(
    () =>
      depositPeriod === "Bulanan"
        ? groupDepositsByMonth(deposits)
        : groupDepositsByWeek(deposits),
    [deposits, depositPeriod],
  );
  const customerChart = useMemo(
    () => groupNewCustomersByMonth(customers, customerYear),
    [customers, customerYear],
  );

  const now = new Date();
  const currentMonthDeposits = deposits.filter((deposit) => {
    const date = new Date(deposit.tanggal);
    return date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth();
  });
  const verifiedThisMonth = currentMonthDeposits.filter(
    (deposit) => deposit.status === "diterima",
  ).length;
  const verificationRate = currentMonthDeposits.length
    ? Math.round((verifiedThisMonth / currentMonthDeposits.length) * 100)
    : 0;
  const recentDeposits = [...deposits]
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-1 flex items-center gap-2 text-[10px] text-gray-500">
          <span>Dashboard</span>
          <span aria-hidden="true">›</span>
          <span className="font-semibold text-emerald-800">Overview</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-xs text-gray-500">
          Pantau aktivitas dan kinerja Bank Sampah RESIK secara real-time.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          iconClass="bg-blue-50 text-blue-600"
          label="Total Nasabah"
          value={loading ? "—" : customers.length.toLocaleString("id-ID")}
          caption={stats ? `${stats.total_nasabah.toLocaleString("id-ID")} aktif` : "nasabah"}
        />
        <StatCard
          icon={ShoppingBag}
          iconClass="bg-emerald-50 text-emerald-700"
          label="Total Setoran"
          value={stats ? Number(stats.setoran_bulan_ini.total_kg).toLocaleString("id-ID") : "—"}
          unit="kg"
          caption="bulan ini"
        />
        <StatCard
          icon={Wallet}
          iconClass="bg-teal-50 text-teal-600"
          label="Total Saldo"
          value={loading ? "—" : formatRupiah(
            customers.reduce((total, customer) => total + Number(customer.saldo || 0), 0),
          )}
          caption="saldo nasabah"
        />
        <StatCard
          icon={Target}
          iconClass="bg-orange-50 text-orange-500"
          label="Terverifikasi"
          value={`${verificationRate}%`}
          caption={`${verifiedThisMonth} dari ${currentMonthDeposits.length} setoran`}
          progress={verificationRate}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-forest">Statistik Setoran</h2>
            <div className="flex rounded-lg bg-gray-50 p-0.5 text-[10px]">
              {(["Bulanan", "Mingguan"] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setDepositPeriod(period)}
                  className={`rounded-md px-2.5 py-1 transition-colors ${
                    depositPeriod === period
                      ? "bg-white font-semibold text-forest shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={depositChart} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="depositFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f8b72" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0f8b72" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#edf1ee" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: "#7a8580" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: "#7a8580" }} />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString("id-ID")} kg`, "Berat"]} />
                <Area type="monotone" dataKey="berat" stroke="#087b67" strokeWidth={2} fill="url(#depositFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {loading && <p className="mt-1 text-center text-[10px] text-gray-400">Memuat data...</p>}
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-forest">Statistik Nasabah Baru</h2>
            <div className="flex rounded-lg bg-gray-50 p-0.5 text-[10px]">
              {[customerYear - 1, customerYear].map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setCustomerYear(year)}
                  className={`rounded-md px-2.5 py-1 transition-colors ${
                    customerYear === year
                      ? "bg-white font-semibold text-forest shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerChart} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#edf1ee" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: "#7a8580" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: "#7a8580" }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="nasabah" name="Nasabah baru" fill="#3aa48f" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {loading && <p className="mt-1 text-center text-[10px] text-gray-400">Memuat data...</p>}
        </section>
      </div>

      <SetoranTerbaru items={recentDeposits} loading={loading} />
    </div>
  );
}
