"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { AuthCard, inputClass } from "./auth-card";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // TODO: ganti dengan pemanggilan API (services/auth.service.ts)
      // await authService.forgotPassword({ email });
      setSent(true);
    } catch {
      setError("Gagal mengirim tautan reset. Periksa email dan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <AuthCard
        title="Email Terkirim!"
        subtitle="Kami telah mengirimkan tautan reset password ke email Anda. Silakan cek kotak masuk (atau folder spam)."
      >
        <div className="flex justify-center py-2">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>

        <Link
          href="/login"
          className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-forest hover:underline"
        >
          <ArrowLeft size={14} />
          Kembali ke Login
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Lupa Password?"
      subtitle="Masukkan alamat email akun Anda, kami akan mengirimkan tautan untuk mengatur ulang password."
    >
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border-l-4 border-red-500 bg-red-100 p-3 text-xs text-red-600">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-semibold text-forest">
            Alamat Email
          </label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Mengirim..." : "Kirim Tautan Reset"}
          {!loading && <ArrowRight size={14} />}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-5 flex items-center justify-center gap-1.5 text-xs font-semibold text-forest hover:underline"
      >
        <ArrowLeft size={14} />
        Kembali ke Login
      </Link>
    </AuthCard>
  );
}