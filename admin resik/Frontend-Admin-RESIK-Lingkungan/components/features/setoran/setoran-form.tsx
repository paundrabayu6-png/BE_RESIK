"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  User,
  Plus,
  UploadCloud,
  Edit2,
  Calendar,
  Info,
  CheckCircle2,
  Box,
  Package,
  CupSoda,
  Droplet,
  X,
  Loader2,
  Check,
} from "lucide-react";

interface TrashItem {
  id: string;
  type: string;
  weight: number;
  pricePerKg: number;
  points: number;
}

const CATEGORIES = [
  {
    key: "plastik",
    label: "Plastik",
    icon: CupSoda,
    iconBg: "bg-blue-500",
    activeText: "text-blue-600",
  },
  {
    key: "kardus",
    label: "Kardus",
    icon: Box,
    iconBg: "bg-orange-500",
    activeText: "text-orange-600",
  },
  {
    key: "minyak",
    label: "Minyak Jelantah",
    icon: Droplet,
    iconBg: "bg-cyan-500",
    activeText: "text-cyan-600",
  },
] as const;

function itemIconStyle(type: string) {
  if (type.startsWith("Kardus")) {
    return { wrap: "bg-orange-50 text-orange-500", Icon: Box };
  }
  if (type.startsWith("Minyak")) {
    return { wrap: "bg-cyan-50 text-cyan-500", Icon: Droplet };
  }
  return { wrap: "bg-blue-50 text-blue-500", Icon: CupSoda };
}

export default function TambahSetoranForm() {
  // State Informasi Nasabah
  const [selectedNasabah] = useState({
    id: "NSB-0421",
    name: "Budi Santoso",
    phone: "08123456789",
    saldo: 150000,
  });

  // State Rincian Sampah
  const [selectedCategory, setSelectedCategory] = useState<
    "plastik" | "kardus" | "minyak"
  >("plastik");
  const [items, setItems] = useState<TrashItem[]>([
    {
      id: "1",
      type: "Plastik (Botol PET)",
      weight: 5.0,
      pricePerKg: 3000,
      points: 1250,
    },
  ]);

  const [inputWeight, setInputWeight] = useState<number>(0);
  const [depositId] = useState("STR-9926");
  const [depositDate, setDepositDate] = useState("2023-11-24");
  const [status] = useState("Verifikasi");
  const [notes, setNotes] = useState("");

  // State Modal (Pop-up)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Upload Foto Bukti Timbangan
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Perhitungan Ringkasan
  const totalBerat = items.reduce((acc, curr) => acc + curr.weight, 0);
  const totalPoin = items.reduce((acc, curr) => acc + curr.points, 0);
  const estimasiNilaiSaldo = items.reduce(
    (acc, curr) => acc + curr.weight * curr.pricePerKg,
    0,
  );

  // Handler Upload Foto
  const handleFileChange = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Harap unggah file gambar (JPG, PNG, JPEG)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddItem = () => {
    if (inputWeight <= 0) return;

    let typeName = "Plastik (Botol PET)";
    let price = 3000;
    if (selectedCategory === "kardus") {
      typeName = "Kardus Bekas";
      price = 2000;
    } else if (selectedCategory === "minyak") {
      typeName = "Minyak Jelantah";
      price = 5000;
    }

    const newItem: TrashItem = {
      id: Date.now().toString(),
      type: typeName,
      weight: inputWeight,
      pricePerKg: price,
      points: Math.round(inputWeight * 250),
    };

    setItems([...items, newItem]);
    setInputWeight(0);
  };

  // Process Simpan Data (dengan loading simulation)
  const handleConfirmSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    }, 1200);
  };

  // Reset Form setelah Tambah Setoran Lagi
  const handleResetForm = () => {
    setShowSuccessModal(false);
    setItems([]);
    setInputWeight(0);
    handleRemoveImage();
    setNotes("");
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <Link href="/setoran" className="hover:underline">
            Kelola Setoran
          </Link>
          <span>&gt;</span>
          <span className="font-medium text-gray-800">Tambah</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Tambah Setoran</h1>
        <p className="text-sm text-gray-500 mt-1">
          Catat setoran sampah nasabah ke Bank Sampah RESIK.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri - Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Informasi Nasabah */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <User className="w-5 h-5 text-emerald-600" />
              <span>Informasi Nasabah</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Nasabah*
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={`${selectedNasabah.name} - ${selectedNasabah.id}`}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Selected Nasabah Info Box */}
            <div className="bg-gray-50/80 rounded-lg p-4 flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                  BS
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">
                    {selectedNasabah.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    ID: {selectedNasabah.id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">{selectedNasabah.phone}</p>
                <p className="text-xs font-semibold text-emerald-600">
                  Saldo: Rp {selectedNasabah.saldo.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Rincian Sampah */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <Package className="w-5 h-5 text-emerald-600" />
              <span>Rincian Sampah</span>
            </div>

            {/* Kategori Selector */}
            <div className="grid grid-cols-3 gap-4">
              {CATEGORIES.map(
                ({ key, label, icon: Icon, iconBg, activeText }) => {
                  const active = selectedCategory === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedCategory(key)}
                      className={`flex flex-col items-center justify-center gap-3 rounded-xl px-4 py-5 text-sm font-semibold transition-all ${
                        active
                          ? `border-2 border-blue-500 bg-white shadow-[0_4px_14px_rgba(59,130,246,0.25)] ${activeText}`
                          : "border border-gray-200 bg-gray-50 text-gray-700 shadow-sm hover:bg-white hover:shadow-md"
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-lg text-white shadow-md ${iconBg}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      {label}
                    </button>
                  );
                },
              )}
            </div>

            {/* Input Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Berat (kg)*
                </label>
                <input
                  type="number"
                  value={inputWeight || ""}
                  onChange={(e) =>
                    setInputWeight(parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    inputWeight <= 0
                      ? "border-red-400 focus:ring-1 focus:ring-red-400"
                      : "border-gray-200"
                  }`}
                />
                {inputWeight <= 0 && (
                  <span className="text-[10px] text-red-500 mt-0.5 block">
                    Berat harus lebih dari 0
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Harga per kg
                </label>
                <input
                  type="text"
                  disabled
                  value="Rp 3.000/kg"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Poin
                </label>
                <input
                  type="text"
                  disabled
                  value={`${Math.round(inputWeight * 250)} pts`}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500"
                />
              </div>
            </div>

            {/* Tambah Item Button */}
            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Item Sampah</span>
            </button>

            {/* Table Added Items */}
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                    <th className="py-3 px-4 uppercase font-semibold">
                      Jenis Sampah
                    </th>
                    <th className="py-3 px-4 uppercase font-semibold">
                      Berat (KG)
                    </th>
                    <th className="py-3 px-4 uppercase font-semibold">Poin</th>
                    <th className="py-3 px-4 uppercase font-semibold text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => {
                    const { wrap, Icon } = itemIconStyle(item.type);
                    return (
                      <tr key={item.id} className="text-gray-700">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded flex items-center justify-center ${wrap}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          <span>{item.type}</span>
                        </td>
                        <td className="py-3 px-4">
                          {item.weight.toFixed(1)} kg
                        </td>
                        <td className="py-3 px-4 text-emerald-600 font-semibold">
                          +{item.points} pts
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 3: Detail Setoran */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <Package className="w-5 h-5 text-emerald-600" />
              <span>Detail Setoran</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  ID Setoran
                </label>
                <input
                  type="text"
                  disabled
                  value={depositId}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tanggal & Waktu*
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={depositDate}
                    onChange={(e) => setDepositDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status*
                </label>
                <input
                  type="text"
                  disabled
                  value={status}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600"
                />
              </div>
            </div>

            {/* File Upload Box */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Foto Bukti Timbangan*
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors cursor-pointer ${
                    isDragging
                      ? "border-emerald-500 bg-emerald-50/50"
                      : "border-gray-200 bg-gray-50/50 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">
                    Pilih berkas atau tarik ke sini
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    JPG, PNG, atau JPEG (Maks. 5MB)
                  </p>
                </div>
              ) : (
                <div className="relative border border-gray-200 rounded-xl p-3 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0 relative bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Bukti Timbangan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {imageFile?.name}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {imageFile
                          ? (imageFile.size / (1024 * 1024)).toFixed(2)
                          : "0"}{" "}
                        MB
                      </p>
                      <span className="inline-block mt-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                        Siap diunggah
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus foto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Catatan
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan jika diperlukan..."
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Sidebar Ringkasan */}
        <div className="space-y-6">
          {/* Card Ringkasan Setoran */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-emerald-700 text-white p-4 font-semibold text-xs tracking-wider uppercase">
              Ringkasan Setoran
            </div>

            <div className="p-5 space-y-4">
              {/* Profile Card Mini */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">
                    BS
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-gray-800">
                      {selectedNasabah.name}
                    </h5>
                    <p className="text-[10px] text-gray-400">
                      ID: {selectedNasabah.id}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">
                  VERIFIKASI
                </span>
              </div>

              {/* Detail Ringkasan */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>ID Setoran</span>
                  <span className="font-medium text-gray-800">{depositId}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Item ({items.length} Jenis)</span>
                  <span className="font-medium text-gray-800">
                    {items.length > 0
                      ? items.map((i) => i.type.split(" ")[0]).join(", ")
                      : "-"}
                  </span>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Total Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Berat</span>
                  <span className="font-bold text-gray-800">
                    {totalBerat.toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Poin</span>
                  <span className="font-bold text-emerald-600">
                    +{totalPoin.toLocaleString("id-ID")} pts
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center text-sm font-semibold text-gray-800">
                <span>Estimasi Nilai Saldo</span>
                <span>Rp {estimasiNilaiSaldo.toLocaleString("id-ID")}</span>
              </div>

              <p className="text-[10px] text-gray-400 italic text-center">
                *Nilai saldo akan masuk setelah diverifikasi admin.
              </p>
            </div>
          </div>

          {/* Card Tips */}
          <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 flex gap-3">
            <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
              💡
            </div>
            <div className="text-xs text-amber-800 space-y-1">
              <span className="font-bold block">Tips:</span>
              <p className="text-amber-700 leading-relaxed">
                Timbang sampah di depan nasabah dan unggah foto bukti agar mudah
                diverifikasi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Link
          href="/setoran"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Batal
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg text-sm font-medium transition-colors"
          >
            Simpan & Tambah Lagi
          </button>
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan Setoran</span>
          </button>
        </div>
      </div>

      {/* ==================== POP-UP MODAL 1: KONFIRMASI SIMPAN SETORAN ==================== */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 relative">
            {/* Header Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-gray-800">
                Konfirmasi Simpan Setoran
              </h3>
              <p className="text-xs text-gray-500">
                Pastikan data setoran sudah benar sebelum disimpan.
              </p>
            </div>

            {/* Detail Box */}
            <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 space-y-3">
              <div className="flex justify-between items-start text-xs border-b border-gray-200/60 pb-2.5">
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase block">
                    NASABAH
                  </span>
                  <span className="font-bold text-gray-800">
                    {selectedNasabah.name}{" "}
                    <span className="text-gray-400 font-normal">
                      ({selectedNasabah.id})
                    </span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase block">
                    ID SETORAN
                  </span>
                  <span className="font-bold text-gray-800">{depositId}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase block">
                    Jenis Sampah
                  </span>
                  <span className="font-medium text-gray-700">
                    {items.length > 0
                      ? items.map((i) => i.type).join(", ")
                      : "-"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase block">
                    Total Berat
                  </span>
                  <span className="font-medium text-gray-700">
                    {totalBerat.toFixed(1).replace(".", ",")} kg
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase block">
                    Total Poin
                  </span>
                  <span className="font-bold text-emerald-600">
                    +{totalPoin.toLocaleString("id-ID")} pts
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase block">
                    Estimasi Saldo
                  </span>
                  <span className="font-bold text-gray-800">
                    Rp {estimasiNilaiSaldo.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] pt-2 border-t border-gray-200/60">
                <span className="text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  24/11/2023
                </span>
                <span className="bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded text-[10px]">
                  VERIFIKASI
                </span>
              </div>
            </div>

            {/* Alert Box Info */}
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-3 flex gap-2.5 items-start">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-800 leading-snug">
                Data yang sudah disimpan akan masuk ke antrean verifikasi dan
                saldo nasabah akan diperbarui setelah disetujui.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
              >
                Periksa Lagi
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-80"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ya, Simpan Setoran</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== POP-UP MODAL 2: SETORAN BERHASIL DISIMPAN ==================== */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Icon */}
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-gray-800">
                Setoran Berhasil Disimpan!
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Setoran sampah atas nama{" "}
                <span className="font-semibold text-gray-700">
                  {selectedNasabah.name}
                </span>{" "}
                telah tercatat dan masuk ke antrean verifikasi.
              </p>
            </div>

            {/* Summary Details */}
            <div className="space-y-2 py-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase font-semibold text-[10px]">
                  ID SETORAN
                </span>
                <span className="font-bold text-gray-800">{depositId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase font-semibold text-[10px]">
                  TOTAL BERAT
                </span>
                <span className="font-medium text-gray-700">
                  {totalBerat.toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase font-semibold text-[10px]">
                  POIN DIPEROLEH
                </span>
                <span className="font-bold text-emerald-600">
                  +{totalPoin.toLocaleString("id-ID")} pts
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase font-semibold text-[10px]">
                  ESTIMASI SALDO
                </span>
                <span className="font-bold text-gray-800">
                  Rp {estimasiNilaiSaldo.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Link
                href="/setoran"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center transition-colors"
              >
                Kembali ke Kelola Setoran
              </Link>

              <button
                type="button"
                onClick={handleResetForm}
                className="w-full py-2.5 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-semibold transition-colors"
              >
                + Tambah Setoran Lagi
              </button>

              <div className="text-center pt-1">
                <Link
                  href={`/setoran/detail/${depositId}`}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"
                >
                  Lihat Detail Setoran &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}