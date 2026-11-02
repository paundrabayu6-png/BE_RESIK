"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { AuthCard, inputClass } from "./auth-card";
import {
  getRememberedAdminLogin,
  loginAdmin,
  saveRememberedAdminLogin,
} from "@/services/auth.service";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const remembered = getRememberedAdminLogin();
      setRemember(remembered.remember);
      setEmail(remembered.email);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const normalizedEmail = email.trim();
      await loginAdmin({ email: normalizedEmail, password });
      saveRememberedAdminLogin(normalizedEmail, remember);
      router.replace("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Gagal masuk. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Login Admin RESIK"
      subtitle="Silakan masuk ke akun Anda untuk mengelola sistem manajemen sampah."
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

        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-semibold text-forest">
            Password
          </label>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputClass} px-9`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-forest/80">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => {
                const checked = e.target.checked;
                setRemember(checked);
                saveRememberedAdminLogin(email, checked);
              }}
            />
            Ingat saya
          </label>
          <Link href="/forgot-password" className="font-semibold text-forest">
            Lupa Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Masuk"}
          {!loading && <ArrowRight size={14} />}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-forest/80">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-brand hover:underline">
          Daftar di sini
        </Link>
      </p>
    </AuthCard>
  );
}