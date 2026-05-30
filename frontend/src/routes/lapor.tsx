"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Camera,
  MapPin,
  Send,
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  Flag,
  Info,
  ChevronDown,
  Loader2,
  X,
  RefreshCw,
  LogIn,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/lapor")({
  component: LaporPage,
});

const FADE_UP = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] },
  }),
};

const infoItems = [
  {
    title: "Klasifikasi Pengaduan",
    detail: "Infrastruktur, Keamanan, atau Sosial",
    Icon: Flag,
    accentClass: "border-l-blue-600",
    iconColor: "text-[#0b429c]",
  },
  {
    title: "Lampiran Bukti Fisik",
    detail: "Foto lokasi kejadian atau berkas pendukung",
    Icon: Camera,
    accentClass: "border-l-orange-500",
    iconColor: "text-[#ff511d]",
  },
  {
    title: "Validasi & Tindak Lanjut",
    detail: "Laporan diverifikasi admin desa < 3x24 jam",
    Icon: CheckCircle2,
    accentClass: "border-l-lime-500",
    iconColor: "text-[#84cc16]",
  },
];

export default function LaporPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState("");

  // State Baru untuk kontrol Pop-up Login
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [formData, setFormData] = useState({
    judul: "",
    kategori: "Infrastruktur",
    deskripsi: "",
    lokasi: "",
  });

  const [buktiVisual, setBuktiVisual] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Cek status login saat halaman pertama kali dibuka
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true); // Langsung munculkan pop-up jika tidak ada token
    }
  }, []);

  useEffect(() => {
    if (!buktiVisual) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(buktiVisual);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [buktiVisual]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("Mohon unggah file gambar (PNG, JPG, JPEG).");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran file maksimal adalah 10MB!");
        return;
      }
      setBuktiVisual(file);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBuktiVisual(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Proteksi tambahan saat tombol kirim ditekan
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    setIsSubmitting(true);
    setErrorApi(null);

    const dataToSend = new FormData();
    dataToSend.append("judul", formData.judul);
    dataToSend.append("kategori", formData.kategori);
    dataToSend.append("deskripsi", formData.deskripsi);
    dataToSend.append("lokasi", formData.lokasi);
    if (buktiVisual) {
      dataToSend.append("bukti_visual", buktiVisual);
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/user/pengaduan",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Selipkan token JWT
          },
          body: dataToSend,
        },
      );

      const result = await response.json();

      // Jika backend merespon 401 karena token kedaluwarsa / tidak valid
      if (response.status === 401) {
        localStorage.removeItem("token"); // Bersihkan token usang
        setShowLoginModal(true);
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengirimkan laporan.");
      }

      setTicketNumber(result.no_tiket || "#TKT-ADU-001");
      setStep(2);
    } catch (err: any) {
      setErrorApi(
        err.message || "Terjadi kesalahan sistem. Sila coba lagi nanti.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50/30 font-sans antialiased mt-16 text-slate-900 overflow-x-hidden">
      <Navbar />

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute top-[40%] -left-[15%] w-[500px] h-[500px] rounded-full bg-orange-50/50 blur-[100px]" />
        <div className="absolute -bottom-[10%] right-[15%] w-[450px] h-[450px] rounded-full bg-lime-50/40 blur-[90px]" />
      </div>

      {/* HEADER BAR */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20 shadow-sm shadow-slate-100/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate({ to: "/dashboard-warga" })}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition active:scale-95"
            >
              <ArrowLeft size={19} strokeWidth={2.5} />
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#0b429c] font-black">
                Sistem Layanan Mandiri
              </p>
              <h1 className="text-lg font-extrabold text-slate-950 font-sora leading-tight">
                Pengaduan Warga Desa
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-2 text-xs text-[#0b429c] font-semibold">
            <Info size={15} className="text-[#0b429c] flex-shrink-0" />
            <span>Respon awal admin maksimal 3 hari kerja</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative max-w-7xl mx-auto px-6 py-16 z-10">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="form-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-10 lg:grid-cols-[1fr_1.4fr] items-start"
            >
              {/* SISI KIRI */}
              <motion.section
                variants={FADE_UP}
                custom={0}
                className="rounded-[1.5rem] border border-slate-100 bg-white/90 backdrop-blur-sm p-9 shadow-lg shadow-slate-100/30 lg:sticky lg:top-32"
              >
                <span className="inline-flex items-center rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#0b429c]">
                  Panduan Pelaporan
                </span>
                <h2 className="mt-5 text-2xl font-black leading-snug text-slate-950 font-sora">
                  Formulir Aduan Respon Cepat
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Mohon isi formulir di samping dengan data yang valid dan
                  objektif. Partisipasi Anda sangat berharga untuk perbaikan
                  pelayanan desa kami.
                </p>

                <div className="mt-9 space-y-3.5">
                  {infoItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 rounded-xl border border-slate-100 ${item.accentClass} border-l-4 bg-white p-4 shadow-sm shadow-slate-100/50 transition hover:bg-slate-50`}
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100`}
                      >
                        <item.Icon className={`${item.iconColor} h-5 w-5`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-950">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 leading-5">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* SISI KANAN: Formulir */}
              <motion.section
                variants={FADE_UP}
                custom={1}
                className="rounded-[1.5rem] border border-slate-100 bg-white p-10 shadow-xl shadow-slate-200/20"
              >
                {errorApi && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 font-medium overflow-hidden">
                    {errorApi}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 font-inter">
                      Subjek Laporan
                    </label>
                    <input
                      required
                      type="text"
                      disabled={isSubmitting}
                      placeholder="Misal: Perbaikan Jalan Berlubang di RT 03"
                      className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm text-slate-900 outline-none transition duration-150 focus:border-[#0b429c] focus:ring-4 focus:ring-blue-100 disabled:opacity-60 placeholder:text-slate-300"
                      value={formData.judul}
                      onChange={(e) =>
                        setFormData({ ...formData, judul: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 font-inter">
                        Klasifikasi Aduan
                      </label>
                      <div className="relative">
                        <select
                          disabled={isSubmitting}
                          className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm text-slate-900 outline-none transition focus:border-[#0b429c] focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer disabled:opacity-60 placeholder:text-slate-300"
                          value={formData.kategori}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              kategori: e.target.value,
                            })
                          }
                        >
                          <option>Infrastruktur</option>
                          <option>Keamanan & Ketertiban</option>
                          <option>Pelayanan Sosial</option>
                          <option>Kebersihan Lingkungan</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 font-inter">
                        Lokasi Kejadian
                      </label>
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-4.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-300" />
                        <input
                          required
                          type="text"
                          disabled={isSubmitting}
                          placeholder="Nama Jalan, Blok, atau No. Rumah"
                          className="w-full rounded-xl border border-slate-200 bg-white px-5 pl-12 py-3.5 text-sm text-slate-900 outline-none transition duration-150 focus:border-[#0b429c] focus:ring-4 focus:ring-blue-100 disabled:opacity-60 placeholder:text-slate-300"
                          value={formData.lokasi}
                          onChange={(e) =>
                            setFormData({ ...formData, lokasi: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 font-inter">
                      Kronologi Detail
                    </label>
                    <textarea
                      required
                      rows={6}
                      disabled={isSubmitting}
                      placeholder="Jelaskan secara kronologis kendala yang dialami, waktu kejadian, dan dampak yang ditimbulkan..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm text-slate-900 outline-none transition focus:border-[#0b429c] focus:ring-4 focus:ring-blue-100 resize-none disabled:opacity-60 placeholder:text-slate-300"
                      value={formData.deskripsi}
                      onChange={(e) =>
                        setFormData({ ...formData, deskripsi: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 font-inter">
                      Lampiran Bukti Visual (Opsional)
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleFileChange}
                      disabled={isSubmitting}
                    />

                    <AnimatePresence mode="wait">
                      {!previewUrl ? (
                        <motion.div
                          key="dropzone"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() =>
                            !isSubmitting && fileInputRef.current?.click()
                          }
                          className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/30 p-8 text-center transition hover:border-[#0b429c] hover:bg-blue-50/10 cursor-pointer group"
                        >
                          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                            <ImageIcon className="h-5 w-5 text-slate-400 group-hover:text-[#0b429c]" />
                          </div>
                          <p className="text-sm font-bold text-slate-700 group-hover:text-slate-900">
                            Pilih berkas foto atau seret ke sini
                          </p>
                          <p className="mt-1 text-[11px] text-slate-400 font-medium">
                            Format: PNG, JPG, JPEG (Maks. 10MB)
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="preview"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="relative group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-inner cursor-pointer"
                          onClick={() =>
                            !isSubmitting && fileInputRef.current?.click()
                          }
                        >
                          <img
                            src={previewUrl}
                            alt="Preview Bukti Laporan"
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <RefreshCw className="w-8 h-8 text-white" />
                            <p className="text-xs font-bold text-white tracking-wide">
                              Klik untuk Impor Ulang
                            </p>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex items-center justify-between">
                            <div className="overflow-hidden pr-2">
                              <p className="text-xs font-bold text-white truncate">
                                {buktiVisual?.name}
                              </p>
                              <p className="text-[10px] text-slate-200">
                                {(buktiVisual!.size / (1024 * 1024)).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={removeFile}
                              className="h-7 w-7 flex items-center justify-center rounded-md bg-white/20 hover:bg-rose-500 text-white backdrop-blur-sm transition shadow-sm flex-shrink-0"
                              title="Hapus Gambar"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    whileHover={!isSubmitting ? { scale: 1.01, y: -2 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#0b429c] hover:bg-[#ff511d] px-6 py-4 text-[13px] font-black uppercase tracking-wider text-white shadow-xl shadow-blue-900/10 hover:shadow-orange-500/20 transition-all duration-300 ease-[0.25,1,0.5,1] disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sedang Memproses Database...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Validasi & Kirim Laporan
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.section>
            </motion.div>
          ) : (
            <motion.section
              key="success-step"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              className="max-w-xl mx-auto rounded-[1.5rem] border border-slate-100 bg-white p-12 shadow-2xl shadow-slate-100/50"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-sm border border-emerald-100 animate-pulse">
                <CheckCircle2 size={38} strokeWidth={2.5} />
              </div>
              <div className="mt-8 text-center">
                <h2 className="text-2xl font-black text-slate-950 font-sora">
                  Aduan Berhasil Terkirim
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-500 font-medium">
                  Terima kasih atas laporan Anda. Pengaduan telah kami catat
                  dengan nomor tiket{" "}
                  <span className="text-[#0b429c] font-black">
                    {ticketNumber}
                  </span>
                  . Admin desa akan segera memverifikasi laporan Anda dalam
                  jam kerja operasional.
                </p>
              </div>
              <div className="mt-10 grid gap-3.5">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate({ to: "/dashboard-warga" })}
                  className="w-full rounded-xl bg-[#0b429c] hover:bg-[#ff511d] px-6 py-3.5 text-[13px] font-black uppercase tracking-wider text-white shadow-lg shadow-blue-900/10 transition duration-300"
                >
                  Kembali ke Dashboard
                </motion.button>
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setFormData({
                      judul: "",
                      kategori: "Infrastruktur",
                      deskripsi: "",
                      lokasi: "",
                    });
                    setBuktiVisual(null);
                    setStep(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-[13px] font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition"
                >
                  Buat Pengaduan Lainnya
                </motion.button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
      <Footer />

      {/* POP-UP MODAL MULTI-FUNGSI: WAJIB LOGIN */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed top-0 left-0 w-screen h-screen z-[999] flex items-center justify-center px-4">
            {/* Backdrop Gelap Blurry */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full bg-slate-900/50 backdrop-blur-sm cursor-pointer"
              // ✅ PERBAIKAN: Hanya mengubah state menjadi false agar modal tertutup tanpa pindah halaman
              onClick={() => setShowLoginModal(false)}
            />

            {/* Kotak Konten Modal Pop-up */}
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl border border-slate-100 z-10"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500 border border-orange-100 mb-5">
                <AlertTriangle size={26} />
              </div>

              <h3 className="text-lg font-black text-slate-950 font-sora">
                Akses Terbatas: Sila Login
              </h3>
              <p className="mt-3 text-xs leading-6 text-slate-500 font-medium">
                Sistem internal DigiDesa memerlukan verifikasi identitas Anda
                untuk mencatat laporan aduan secara resmi ke sistem kelurahan.
              </p>

              <div className="mt-7 flex flex-col gap-2.5">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate({ to: "/login" })}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b429c] hover:bg-[#ff511d] px-5 py-3 text-[13px] font-black uppercase tracking-wider text-white shadow-md shadow-blue-900/10 transition-colors duration-300"
                >
                  <LogIn size={15} />
                  Masuk Akun Warga
                </motion.button>

                <button
                  // ✅ PERBAIKAN: Tombol ini juga diubah agar menutup modal saja jika ingin tetap di halaman form
                  onClick={() => setShowLoginModal(false)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-[12px] font-bold text-slate-500 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
