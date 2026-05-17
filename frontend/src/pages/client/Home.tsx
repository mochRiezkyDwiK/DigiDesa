import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { EASE_SPRING, STAGGER_CONTAINER, FADE_UP } from "../../constants/animation";
import {
  ArrowRight,
  Shield,
  Zap,
  FileText,
  CheckCircle2,
  Clock,
  Bell,
  Users,
  Building2,
  TrendingUp,
  Activity,
  BarChart3,
  Layers,
  Lock,
  MapPin,
  ChevronRight,
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      {status}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.1, delay: 0.8, ease: EASE_SPRING }}
        className="h-full bg-blue-600 rounded-full"
      />
    </div>
  );
}

function CardStats() {
  const stats = [
    { label: "Warga Terdaftar", value: "4.821", delta: "+12 hari ini", icon: Users },
    { label: "Pengajuan Aktif", value: "138", delta: "23 menunggu", icon: FileText },
    { label: "Tingkat Selesai", value: "96.4%", delta: "Naik 2.1%", icon: TrendingUp },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: -1.5 }}
      transition={{ duration: 0.75, delay: 0.35, ease: EASE_SPRING }}
      className="absolute -left-6 top-10 w-72 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-blue-950/5 p-5 z-10"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-blue-700" />
        </div>
        <span className="text-xs font-semibold text-slate-600">
          Ringkasan Layanan
        </span>
      </div>

      <div className="space-y-4">
        {stats.map(({ label, value, delta, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-slate-500" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 truncate">
                  {label}
                </p>
                <p className="text-sm font-bold text-slate-900 leading-none mt-1">
                  {value}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg shrink-0">
              {delta}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CardLetter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, x: 12 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.75, delay: 0.5, ease: EASE_SPRING }}
      whileHover={{ y: -3 }}
      className="relative w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-blue-950/10 p-6 z-20"
    >
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <p className="text-xs font-semibold text-blue-700 mb-1">
            Pengajuan Baru
          </p>
          <h4 className="text-sm font-bold text-slate-950">
            Surat Keterangan Domisili
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Ref: SKD-2026-00841
          </p>
        </div>

        <StatusBadge status="Diproses" />
      </div>

      <div className="h-px bg-slate-100 mb-5" />

      <div className="space-y-4 mb-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Pemohon</p>
            <p className="text-xs font-bold text-slate-800">Budi Santoso · RT 01/RW 10</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Estimasi selesai</p>
            <p className="text-xs font-bold text-slate-800">Hari ini 14:00 WIB</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-500">
            Progress Verifikasi
          </p>
          <p className="text-xs font-bold text-blue-700">65%</p>
        </div>
        <ProgressBar value={65} />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {["Terima", "Cek", "Ttd", "Selesai"].map((step, i) => (
          <div key={step} className="flex flex-col items-center gap-1">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                i < 2 ? "bg-blue-600" : i === 2 ? "bg-amber-400" : "bg-slate-200"
              }`}
            >
              {i < 2 ? (
                <CheckCircle2 className="w-3 h-3 text-white" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            <p className="text-[10px] font-semibold text-slate-500 text-center">
              {step}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CardNotification() {
  const items = [
    {
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      text: "SK Usaha atas nama Dewi R. diterbitkan",
      time: "2 menit lalu",
    },
    {
      icon: Bell,
      color: "text-blue-600",
      bg: "bg-blue-50",
      text: "3 pengajuan baru butuh verifikasi RT",
      time: "11 menit lalu",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: 12 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.7, delay: 0.65, ease: EASE_SPRING }}
      className="absolute -right-6 bottom-14 w-64 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-blue-950/5 p-4 z-30"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center">
          <Activity className="w-3.5 h-3.5 text-blue-700" />
        </div>

        <span className="text-xs font-bold text-slate-700">
          Aktivitas Terkini
        </span>

        <span className="ml-auto text-[11px] font-semibold text-white bg-blue-600 px-2 py-0.5 rounded-full">
          2
        </span>
      </div>

      <div className="space-y-3">
        {items.map(({ icon: Icon, color, bg, text, time }) => (
          <div key={text} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-700 leading-snug">
                {text}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                {time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function FloatingCards() {
  return (
    <div className="relative w-full h-full min-h-[560px] flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-[90px]" />
        <div className="absolute w-72 h-72 bg-indigo-300 rounded-full opacity-20 blur-[90px] translate-x-12 translate-y-8" />
      </div>

      <CardStats />

      <div className="relative z-20 mt-8">
        <CardLetter />
      </div>

      <CardNotification />

      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.45, ease: EASE_SPRING }}
        className="absolute top-4 right-14 bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-lg shadow-blue-950/5 z-40 flex items-center gap-2"
      >
        <Lock className="w-3.5 h-3.5 text-emerald-600" />
        <span className="text-xs font-semibold text-slate-700">
          Akses aman RT/RW
        </span>
      </motion.div>
    </div>
  );
}

function TrustStrip() {
  const items = [
    { icon: Shield, label: "Sistem Terpusat" },
    { icon: Lock, label: "Data Warga Aman" },
    { icon: Zap, label: "Proses Cepat" },
    { icon: MapPin, label: "Untuk Skala Desa" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.85, duration: 0.55 }}
      className="mt-14 pt-8 border-t border-slate-200"
    >
      <p className="text-xs font-bold text-slate-400 mb-5">
        Standar Pelayanan Digital
      </p>

      <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-slate-500">
            <Icon className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 -z-10 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-blue-50" />
        <motion.div
          animate={{ x: [0, 18, 0], y: [0, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[680px] h-[680px] bg-blue-300 rounded-full opacity-20 blur-[110px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -14, 0], y: [0, 18, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -bottom-60 -left-40 w-[580px] h-[580px] bg-indigo-300 rounded-full opacity-20 blur-[110px] pointer-events-none"
        />
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(30,58,138,1) 1px, transparent 1px), linear-gradient(to right, rgba(30,58,138,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12 lg:gap-8 items-center min-h-[calc(100vh-4rem)] py-20">
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="show"
            className="max-w-2xl relative z-10"
          >
            <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-blue-600" />
              <span className="text-xs font-bold text-blue-700">
                Platform Administrasi Modern
              </span>
            </motion.div>

            <motion.h1
              variants={FADE_UP}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.05] text-slate-950 mb-6"
            >
              Layanan Desa
              <br />
              Kini Lebih{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Tertata
              </span>
            </motion.h1>

            <motion.p
              variants={FADE_UP}
              className="text-lg text-slate-600 leading-relaxed max-w-xl mb-10 font-medium"
            >
              DigiDesa membantu warga dan perangkat desa mengelola pengajuan surat,
              laporan lingkungan, dan informasi layanan dalam satu portal yang sederhana.
            </motion.p>

            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-start gap-4 mb-5">
              <motion.button
                onClick={() => navigate("/layanan")}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group flex w-full sm:w-auto justify-center items-center gap-2.5 bg-blue-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all text-sm"
              >
                Layanan Surat
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                onClick={() => navigate("/lapor")}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full sm:w-auto justify-center items-center gap-2.5 bg-white text-slate-800 font-semibold px-8 py-4 rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all text-sm"
              >
                Lapor Warga
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </motion.button>
            </motion.div>

            <motion.p variants={FADE_UP} className="text-sm text-slate-500 font-medium">
              Terintegrasi dengan alur pelayanan warga dan pengurus desa.
            </motion.p>

            <TrustStrip />
          </motion.div>

          <div className="relative hidden lg:block">
            <FloatingCards />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "Pengajuan Surat Digital",
      desc: "Warga dapat mengajukan dokumen tanpa antre panjang. Admin memproses berkas dari dashboard.",
      accent: "blue",
    },
    {
      icon: Users,
      title: "Data Warga Terpusat",
      desc: "Profil warga, keluarga, dan domisili disimpan lebih rapi untuk kebutuhan administrasi.",
      accent: "indigo",
    },
    {
      icon: BarChart3,
      title: "Transparansi Keuangan",
      desc: "Kas desa dan bukti transaksi dapat ditampilkan agar warga ikut memantau penggunaan dana.",
      accent: "violet",
    },
    {
      icon: Shield,
      title: "Akses Terverifikasi",
      desc: "Setiap akun warga melewati proses verifikasi agar layanan tetap aman dan tertib.",
      accent: "blue",
    },
    {
      icon: Bell,
      title: "Notifikasi Status",
      desc: "Warga dapat mengetahui perkembangan surat atau laporan tanpa harus datang langsung.",
      accent: "indigo",
    },
    {
      icon: Activity,
      title: "Pelaporan Lingkungan",
      desc: "Aduan fasilitas umum dan keamanan bisa diteruskan ke pengurus untuk ditindaklanjuti.",
      accent: "violet",
    },
  ];

  const accentMap = {
    blue: {
      icon: "text-blue-600 bg-blue-50",
      border: "hover:border-blue-200",
      shadow: "hover:shadow-blue-950/5",
    },
    indigo: {
      icon: "text-indigo-600 bg-indigo-50",
      border: "hover:border-indigo-200",
      shadow: "hover:shadow-indigo-950/5",
    },
    violet: {
      icon: "text-violet-600 bg-violet-50",
      border: "hover:border-violet-200",
      shadow: "hover:shadow-violet-950/5",
    },
  };

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={ref} className="relative py-28 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 to-white -z-10" />
      <motion.div
        style={{ y }}
        className="absolute top-20 right-20 w-64 h-64 bg-blue-300 rounded-full opacity-[0.06] blur-[80px] -z-10"
      />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE_SPRING }}
          className="max-w-2xl mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-6 bg-blue-600" />
            <span className="text-xs font-bold text-blue-700">
              Kapasitas Platform
            </span>
          </div>

          <h2 className="text-4xl md:text-[2.8rem] font-bold tracking-tight leading-[1.1] text-slate-950 mb-4">
            Satu tempat untuk
            <br />
            <span className="text-slate-400">layanan administrasi warga.</span>
          </h2>

          <p className="text-lg text-slate-600 font-medium">
            Dirancang agar perangkat desa dan warga bisa berkoordinasi lebih cepat,
            jelas, dan terdokumentasi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, accent }, i) => {
            const a = accentMap[accent as keyof typeof accentMap];

            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: EASE_SPRING }}
                whileHover={{ y: -3 }}
                className={`group bg-white rounded-2xl border border-slate-200 p-7 transition-all duration-300 cursor-pointer hover:shadow-lg ${a.border} ${a.shadow}`}
              >
                <div className={`w-11 h-11 rounded-xl ${a.icon} flex items-center justify-center mb-5`}>
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-bold text-slate-950 mb-2">
                  {title}
                </h3>

                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {desc}
                </p>

                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Pelajari
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE_SPRING }}
          className="relative bg-slate-950 rounded-3xl p-10 md:p-14 overflow-hidden text-center shadow-2xl shadow-slate-950/15"
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-[90px]" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-violet-500 rounded-full opacity-20 blur-[90px]" />

          <div className="relative z-10">
            <p className="text-blue-400 text-xs font-bold mb-4">
              Portal Warga & Pengurus
            </p>

            <h2 className="text-4xl md:text-[2.6rem] font-bold tracking-tight text-white leading-[1.1] mb-6">
              Mulai akses layanan
              <br />
              dalam satu portal.
            </h2>

            <p className="text-slate-300 text-lg max-w-xl mx-auto mb-10 font-medium">
              Masuk ke DigiDesa untuk mengajukan surat, memantau laporan, dan melihat
              informasi layanan warga.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2.5 bg-blue-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:bg-blue-500 transition-all text-sm w-full sm:w-auto justify-center"
              >
                Masuk Portal
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <button className="text-slate-300 font-semibold text-sm hover:text-white transition-colors">
                Lihat Panduan →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-100 py-12 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>

          <span className="font-bold text-slate-800 tracking-tight">
            Digi<span className="text-blue-700">Desa</span>
          </span>

          <span className="text-slate-400 text-sm font-medium ml-1">
            · Administrasi Terpadu
          </span>
        </div>

        <p className="text-xs font-medium text-slate-400">
          © {new Date().getFullYear()} DigiDesa Lingkungan. Hak Cipta Dilindungi.
        </p>

        <div className="flex gap-6">
          {["Tentang", "Bantuan", "Privasi"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-semibold"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans antialiased overflow-hidden">
      <main>
        <Hero />
        <FeaturesSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}