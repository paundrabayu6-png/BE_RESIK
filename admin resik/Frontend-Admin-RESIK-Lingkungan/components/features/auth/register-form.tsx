"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard, inputClass } from "./auth-card";
import SuccessModal from "./success-modal";
import {
  isAdminLoggedIn,
  logoutAdmin,
  registerAdmin,
  saveRememberedAdminLogin,
} from "@/services/auth.service";

function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0 - 3
}

const strengthLabel = ["", "LEMAH", "SEDANG", "PASSWORD KUAT"];
const strengthColor = ["bg-gray-300", "bg-red-500", "bg-yellow-500", "bg-green-500"];

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getStrength(form.password);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama lengkap wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    if (!form.phone.trim()) e.phone = "Nomor telepon wajib diisi";
    if (form.password.length < 8) e.password = "Password harus minimal 8 karakter";
    if (form.confirm !== form.password) e.confirm = "Konfirmasi password tidak sama";
    if (!agree) e.agree = "Anda harus menyetujui syarat & ketentuan";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (!isAdminLoggedIn()) {
      setErrors({
        form: "Masuk sebagai admin terlebih dahulu untuk membuat akun admin baru.",
      });
      return;
    }

    setLoading(true);
    try {
      await registerAdmin({
        nama: form.name.trim(),
        email: form.email.trim(),
        telepon: form.phone.trim(),
        password: form.password,
      });
      saveRememberedAdminLogin(form.email.trim(), true);
      logoutAdmin();
      setSuccess(true);
    } catch (error) {
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : "Pendaftaran gagal. Coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  }

  const errorText = (key: string) =>
    errors[key] ? <p className="mt-1 text-[11px] text-red-500">{errors[key]}</p> : null;

  const errBorder = (key: string) => (errors[key] ? "border-red-400" : "");

  return (
    <>
      <AuthCard
        title="Daftar Akun Admin RESIK"
        subtitle="Buat akun untuk mengelola sistem Bank Sampah RESIK."
      >
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          {errors.form ? (
            <p className="text-xs text-red-500">{errors.form}</p>
          ) : (
            <p className="text-xs text-forest/70">
              Masuk sebagai admin terlebih dahulu untuk membuat akun admin baru.
            </p>
          )}

          <div>
            <input
              placeholder="Nama Lengkap"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={`${inputClass} ${errBorder("name")}`}
            />
            {errorText("name")}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={`${inputClass} ${errBorder("email")}`}
            />
            {errorText("email")}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Nomor Telepon"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={`${inputClass} ${errBorder("phone")}`}
            />
            {errorText("phone")}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className={`${inputClass} ${errBorder("password")}`}
            />
            {errorText("password")}
            {form.password && (
              <>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${
                        strength >= i ? strengthColor[strength] : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[10px] font-bold text-forest/70">
                  {strengthLabel[strength]}
                </p>
              </>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Konfirmasi Password"
              value={form.confirm}
              onChange={(e) => update("confirm", e.target.value)}
              className={`${inputClass} ${errBorder("confirm")}`}
            />
            {errorText("confirm")}
          </div>

          <div>
            <label className="flex items-start gap-2 text-[11px] text-forest/80">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Saya setuju dengan <b>Syarat &amp; Ketentuan</b> dan <b>Kebijakan Privasi</b>
              </span>
            </label>
            {errorText("agree")}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-forest/80">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-brand">
            Masuk
          </Link>
        </p>
      </AuthCard>

      {success && <SuccessModal />}
    </>
  );
}