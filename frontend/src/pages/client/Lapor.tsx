import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { EASE_SPRING } from "../../constants/animation";
import {
  Camera,
  MapPin,
  Send,
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  Flag,
  Info
} from "lucide-react";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE_SPRING }
  })
};

const infoItems = [
  {
    title: "Pilih Kategori",
    detail: "Infrastruktur, Sosial, Keamanan",
    Icon: Flag,
    bgClass: "bg-slate-100",
    iconClass: "text-slate-700"
  },
  {
    title: "Unggah Bukti",
    detail: "Foto lokasi atau dokumen pendukung",
    Icon: Camera,
    bgClass: "bg-slate-100",
    iconClass: "text-slate-700"
  },
  {
    title: "Pantau Progres",
    detail: "Lihat status penanganan secara berkala",
    Icon: CheckCircle2,
    bgClass: "bg-slate-100",
    iconClass: "text-slate-700"
  }
];

export default function Lapor() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "Infrastruktur",
    deskripsi: "",
    lokasi: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased mt-16 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 ">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard-warga')}
              className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition"
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 font-semibold">Sistem Pengaduan</p>
              <h1 className="text-xl font-semibold text-slate-900">Pemerintah Desa</h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700">
            <Info size={16} className="text-slate-600" />
            <span>Estimasi penanganan 3-5 hari kerja</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {step === 1 ? (
          <div className="grid gap-14 lg:grid-cols-[1.05fr_1.45fr]">
            <motion.section
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              custom={0}
              className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm"
            >
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
                Layanan Pengaduan
              </span>
              <h2 className="mt-6 text-3xl font-semibold leading-tight text-slate-900">
                Buat Laporan Pengaduan
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Sampaikan keluhan atau aspirasi Anda secara formal. Setiap laporan akan ditindaklanjuti oleh petugas desa dalam waktu maksimal 3x24 jam.
              </p>

              <div className="mt-10 space-y-4">
                {infoItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className={`${item.bgClass} flex h-11 w-11 items-center justify-center rounded-2xl`}>
                      <item.Icon className={`${item.iconClass} h-5 w-5`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 leading-6">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              custom={1}
              className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Judul Laporan</label>
                  <input
                    required
                    type="text"
                    placeholder="Contoh: Lampu Jalan Mati di Gang 3"
                    className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Kategori</label>
                    <select
                      className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 appearance-none"
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    >
                      <option>Infrastruktur</option>
                      <option>Keamanan</option>
                      <option>Sosial</option>
                      <option>Lingkungan</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Lokasi</label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="RT 01 / RW 10"
                        className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 pl-12 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        value={formData.lokasi}
                        onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Deskripsi Aduan</label>
                  <textarea
                    rows={5}
                    placeholder="Jelaskan secara detail kendala yang dialami..."
                    className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 resize-none"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Unggah Bukti Foto (Opsional)</label>
                  <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:border-slate-300 hover:bg-slate-100 cursor-pointer">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <ImageIcon className="h-6 w-6 text-slate-500" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Klik untuk unggah atau seret file</p>
                    <p className="mt-2 text-xs text-slate-500">PNG, JPG maks. 10MB</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
                >
                  <Send size={18} />
                  Kirim Laporan
                </button>
              </form>
            </motion.section>
          </div>
        ) : (
          <motion.section
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-12 shadow-sm"
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-sm">
              <CheckCircle2 size={44} strokeWidth={2.5} />
            </div>
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-semibold text-slate-900">Laporan Terkirim</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Terima kasih atas partisipasi Anda. Laporan sedang diproses oleh petugas desa dan Anda akan menerima pembaruan status secara berkala.
              </p>
            </div>
            <div className="mt-10 grid gap-4">
              <button
                onClick={() => navigate('/dashboard-warga')}
                className="w-full rounded-[1.5rem] bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Kembali ke Dashboard
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Buat Laporan Lain
              </button>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
