"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Camera, Check, Lightbulb, MapPin, User, Wallet } from "lucide-react";
import { NIK_TERDAFTAR, WILAYAH } from "@/lib/dummy-data";
import { ConfirmModal, ErrorModal, SuccessModal, type SavedData } from "./nasabah-modals";

const NEXT_ID = "NSB-1241";

type Status = "Aktif" | "Tidak Aktif";
type FormState = {
  nama: string;
  nik: string;
  telepon: string;
  email: string;
  gender: "Laki-laki" | "Perempuan";
  lahir: string;
  alamat: string;
  kota: string;
  kecamatan: string;
  kodePos: string;
  status: Status;
  catatan: string;
};
type Errors = Partial<Record<keyof FormState | "foto", string>>;

const EMPTY: FormState = {
  nama: "", nik: "", telepon: "", email: "", gender: "Laki-laki", lahir: "",
  alamat: "", kota: "", kecamatan: "", kodePos: "", status: "Aktif", catatan: "",
};

const inputCls = (err?: string) =>
  `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-forest ${
    err ? "border-red-400" : "border-gray-200"
  }`;
const readonlyCls =
  "w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm text-gray-700";

function Field({
  label, required, error, className = "", children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-semibold text-gray-800">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

function Section({
  icon: Icon, title, children,
}: {
  icon: typeof User;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-5 flex items-center gap-2 text-sm font-bold text-forest">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest text-white">
          <Icon size={11} />
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export default function NasabahForm() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  const [mode, setMode] = useState<"single" | "again">("single");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [saved, setSaved] = useState<SavedData | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
  const teleponFull = form.telepon ? `+62 ${form.telepon}` : "+62 812xxxx";

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  }

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setErrors((p) => ({ ...p, foto: "Format harus PNG atau JPG" }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((p) => ({ ...p, foto: "Ukuran foto maksimal 2MB" }));
      return;
    }
    if (fotoUrl) URL.revokeObjectURL(fotoUrl);
    setFotoUrl(URL.createObjectURL(file));
    setErrors((p) => ({ ...p, foto: undefined }));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (form.nama.trim().length < 3) e.nama = "Nama lengkap wajib diisi (minimal 3 karakter)";
    if (!/^\d{16}$/.test(form.nik)) e.nik = "NIK harus 16 digit angka";
    const phone = form.telepon.replace(/^0/, "");
    if (!/^8\d{8,11}$/.test(phone)) e.telepon = "Nomor telepon tidak valid";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Format email tidak valid";
    if (!form.alamat.trim()) e.alamat = "Alamat lengkap wajib diisi";
    return e;
  }

  function handleSubmit(m: "single" | "again") {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setMode(m);
    setSaved({
      nama: form.nama.trim(),
      id: NEXT_ID,
      telepon: `+62 ${form.telepon.replace(/^0/, "")}`,
      status: form.status,
      tanggal: today,
    });
    setConfirmOpen(true);
  }

  function resetForm() {
    if (fotoUrl) URL.revokeObjectURL(fotoUrl);
    setForm(EMPTY);
    setFotoUrl(null);
    setErrors({});
    setResult(null);
  }

  async function handleConfirm() {
    setSaving(true);
    // TODO: ganti dengan pemanggilan API (services/nasabah.service.ts)
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setConfirmOpen(false);

    const problems: string[] = [];
    if (NIK_TERDAFTAR.includes(form.nik)) {
      problems.push(`NIK ${form.nik.slice(0, 4)}xxxxxxxxxxxx sudah terdaftar atas nama nasabah lain.`);
    }
    if (problems.length > 0) {
      setReasons(problems);
      setResult("error");
      return;
    }

    if (mode === "again") {
      const nama = form.nama.trim();
      resetForm();
      setNotice(`Nasabah ${nama} berhasil disimpan. Silakan isi data nasabah berikutnya.`);
      setTimeout(() => setNotice(null), 4000);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setResult("success");
    }
  }

  return (
    <>
      {notice && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
          <Check size={14} /> {notice}
        </div>
      )}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit("single");
        }}
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
          <div className="space-y-6">
            {/* ---------- Informasi Pribadi ---------- */}
            <Section icon={User} title="Informasi Pribadi">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-100 text-gray-400">
                  {fotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fotoUrl} alt="Foto nasabah" className="h-full w-full object-cover" />
                  ) : (
                    <Camera size={22} />
                  )}
                </div>
                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleFoto}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="rounded-lg bg-forest px-4 py-2 text-xs font-semibold text-white"
                  >
                    Unggah Foto
                  </button>
                  <p className="mt-1 text-[10px] text-gray-500">PNG, JPG atau JPEG. Maksimal 2MB.</p>
                  {errors.foto && <p className="text-[11px] text-red-500">{errors.foto}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nama Lengkap" required error={errors.nama}>
                  <input
                    value={form.nama}
                    onChange={(e) => set("nama", e.target.value)}
                    placeholder="Contoh: Muhammad Rafli"
                    className={inputCls(errors.nama)}
                  />
                </Field>

                <Field label="NIK" required error={errors.nik}>
                  <input
                    inputMode="numeric"
                    maxLength={16}
                    value={form.nik}
                    onChange={(e) => set("nik", e.target.value.replace(/\D/g, ""))}
                    placeholder="16 digit NIK sesuai KTP"
                    className={inputCls(errors.nik)}
                  />
                </Field>

                <Field label="Nomor Telepon" required error={errors.telepon}>
                  <div className="flex">
                    <span
                      className={`flex items-center rounded-l-lg border border-r-0 bg-gray-50 px-3 text-xs text-gray-500 ${
                        errors.telepon ? "border-red-400" : "border-gray-200"
                      }`}
                    >
                      +62
                    </span>
                    <input
                      inputMode="numeric"
                      maxLength={13}
                      value={form.telepon}
                      onChange={(e) => set("telepon", e.target.value.replace(/\D/g, ""))}
                      placeholder="812xxxx"
                      className={`${inputCls(errors.telepon)} rounded-l-none`}
                    />
                  </div>
                </Field>

                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="email@contoh.com"
                    className={inputCls(errors.email)}
                  />
                </Field>

                <Field label="Jenis Kelamin">
                  <div className="flex items-center gap-5 py-2 text-xs text-gray-700">
                    {(["Laki-laki", "Perempuan"] as const).map((g) => (
                      <label key={g} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          checked={form.gender === g}
                          onChange={() => set("gender", g)}
                          className="accent-forest"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label="Tanggal Lahir">
                  <input
                    type="date"
                    value={form.lahir}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => set("lahir", e.target.value)}
                    className={inputCls()}
                  />
                </Field>
              </div>
            </Section>

            {/* ---------- Alamat ---------- */}
            <Section icon={MapPin} title="Alamat">
              <Field label="Alamat Lengkap" required error={errors.alamat}>
                <textarea
                  rows={3}
                  value={form.alamat}
                  onChange={(e) => set("alamat", e.target.value)}
                  placeholder="Masukkan nama jalan, nomor rumah, RT/RW..."
                  className={inputCls(errors.alamat)}
                />
              </Field>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Kota/Kabupaten">
                  <select
                    value={form.kota}
                    onChange={(e) => {
                      set("kota", e.target.value);
                      set("kecamatan", "");
                    }}
                    className={inputCls()}
                  >
                    <option value="">Pilih Kota</option>
                    {Object.keys(WILAYAH).map((k) => <option key={k}>{k}</option>)}
                  </select>
                </Field>
                <Field label="Kecamatan">
                  <select
                    value={form.kecamatan}
                    onChange={(e) => set("kecamatan", e.target.value)}
                    disabled={!form.kota}
                    className={`${inputCls()} disabled:bg-gray-50`}
                  >
                    <option value="">Pilih Kecamatan</option>
                    {(WILAYAH[form.kota] ?? []).map((k) => <option key={k}>{k}</option>)}
                  </select>
                </Field>
                <Field label="Kode Pos">
                  <input
                    inputMode="numeric"
                    maxLength={5}
                    value={form.kodePos}
                    onChange={(e) => set("kodePos", e.target.value.replace(/\D/g, ""))}
                    placeholder="30xxx"
                    className={inputCls()}
                  />
                </Field>
              </div>
            </Section>

            {/* ---------- Pengaturan Akun ---------- */}
            <Section icon={Wallet} title="Pengaturan Akun Bank Sampah">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="ID Nasabah">
                  <input value={NEXT_ID} readOnly className={`${readonlyCls} font-semibold`} />
                </Field>
                <Field label="Saldo Awal">
                  <input value="Rp 0" readOnly className={readonlyCls} />
                </Field>
                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => set("status", e.target.value as Status)}
                    className={inputCls()}
                  >
                    <option>Aktif</option>
                    <option>Tidak Aktif</option>
                  </select>
                </Field>
                <Field label="Tanggal Bergabung">
                  <input value={today} readOnly suppressHydrationWarning className={readonlyCls} />
                </Field>
              </div>
              <Field label="Catatan" className="mt-4">
                <textarea
                  rows={3}
                  value={form.catatan}
                  onChange={(e) => set("catatan", e.target.value)}
                  placeholder="Catatan tambahan tentang nasabah..."
                  className={inputCls()}
                />
              </Field>
            </Section>
          </div>

          {/* ---------- Kolom kanan: pratinjau ---------- */}
          <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-wide text-gray-600">
                Pratinjau Nasabah
              </p>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-sand text-gray-400">
                  {fotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fotoUrl} alt="Pratinjau foto" className="h-full w-full object-cover" />
                  ) : (
                    <User size={32} />
                  )}
                </div>
                <p className="mt-3 text-sm font-bold text-forest">{form.nama || "Nama Nasabah"}</p>
                <p className="text-[11px] text-gray-500">{NEXT_ID}</p>
                <span
                  className={`mt-2 rounded px-2 py-0.5 text-[9px] font-bold uppercase ${
                    form.status === "Aktif" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                  }`}
                >
                  {form.status}
                </span>
              </div>
              <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nomor Telepon</span>
                  <span className="font-semibold text-gray-900">{teleponFull}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Poin Sampah</span>
                  <span className="font-semibold text-gray-900">0 pts</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 rounded-2xl bg-sand p-4 text-[11px] text-gray-700">
              <Lightbulb size={14} className="mt-0.5 shrink-0 text-orange-500" />
              <p>
                <b>Tips:</b> Pastikan data NIK dan nomor telepon benar agar nasabah dapat menerima
                notifikasi setoran otomatis melalui SMS/WhatsApp.
              </p>
            </div>
          </aside>
        </div>

        {/* ---------- Tombol aksi ---------- */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-black/5 pt-5">
          <Link href="/nasabah" className="px-4 py-2.5 text-xs font-semibold text-gray-700">
            Batal
          </Link>
          <button
            type="button"
            onClick={() => handleSubmit("again")}
            className="rounded-lg border-2 border-forest px-5 py-2.5 text-xs font-semibold text-forest hover:bg-forest/5"
          >
            Simpan &amp; Tambah Lagi
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-forest px-5 py-2.5 text-xs font-semibold text-white hover:opacity-90"
          >
            <Check size={14} />
            Simpan Nasabah
          </button>
        </div>
      </form>

      {saved && (
        <>
          <ConfirmModal
            open={confirmOpen}
            data={saved}
            saving={saving}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={handleConfirm}
          />
          <SuccessModal
            open={result === "success"}
            data={saved}
            onAgain={resetForm}
            onClose={() => setResult(null)}
          />
        </>
      )}
      <ErrorModal
        open={result === "error"}
        reasons={reasons}
        onRetry={() => setResult(null)}
        onClose={() => setResult(null)}
      />
    </>
  );
}