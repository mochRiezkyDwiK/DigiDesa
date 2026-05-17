import { motion } from "framer-motion";
import { EASE_SPRING, STAGGER_CONTAINER, FADE_UP } from "../constants/animation";
import {
  ArrowRight,
  Shield,
  Zap,
  FileText,
  CheckCircle2,
  Clock,
  Bell,
  Users,
  ChevronDown,
  ChevronRight,
  Activity,
  BarChart3,
  Layers,
  Lock,
  MapPin,
} from "lucide-react";

// ─── FLOATING CARDS ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
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
        transition={{ duration: 1.4, delay: 1.2, ease: EASE_SPRING }}
        className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
      />
    </div>
  );
}

function CardStats() {
  const stats = [
    { label: "Warga Terdaftar", value: "4.821", icon: Users },
    { label: "Pengajuan Aktif", value: "138", icon: FileText },
    { label: "Tingkat Selesai", value: "96.4%", icon: Activity },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2.5 }}
      whileHover={{ y: 8, x: 8 }}
      transition={{ duration: 0.9, delay: 0.4, ease: EASE_SPRING }}
      className="absolute -left-8 top-8 w-80 bg-white rounded-2xl border border-slate-200 shadow-lg p-6 z-10 hover:shadow-xl hover:z-50 cursor-pointer transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Dashboard</p>
          <p className="text-xs text-slate-400">Ringkasan Pelayanan</p>
        </div>
      </div>
      <div className="space-y-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <Icon className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className="text-lg font-bold text-slate-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CardLetter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48, x: 16 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.9, delay: 0.55, ease: EASE_SPRING }}
      whileHover={{ y: -12, x: -8 }}
      className="relative w-96 bg-white rounded-2xl border border-slate-200 shadow-lg p-7 z-20 hover:shadow-2xl hover:z-50 cursor-pointer transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            Pengajuan Terakhir
          </p>
          <h4 className="text-base font-bold text-slate-900">Surat Keterangan Domisili</h4>
          <p className="text-xs text-slate-500 mt-1">ID: SKD-2026-00841</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-medium text-blue-700">Proses</span>
        </div>
      </div>

      <div className="space-y-4 mb-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pemohon</p>
            <p className="text-sm font-bold text-slate-900">Budi Santoso</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Estimasi Selesai</p>
            <p className="text-sm font-bold text-slate-900">Hari ini 14:00 WIB</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-600">Progress Verifikasi</p>
          <p className="text-sm font-bold text-blue-600">65%</p>
        </div>
        <ProgressBar value={65} />
      </div>

      <div className="flex items-center justify-between gap-2">
        {["Terima", "Verifikasi", "TTD", "Selesai"].map((step, i) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 font-semibold text-xs ${
              i < 2 ? "bg-blue-600 text-white" : i === 2 ? "bg-blue-200 text-blue-700" : "bg-slate-100 text-slate-400"
            }`}>
              {i < 2 ? "✓" : i}
            </div>
            <p className="text-xs text-center text-slate-600 font-medium">{step}</p>
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
      bg: "bg-emerald-100",
      text: "SK Usaha dari Dewi R. sudah diterbitkan",
      time: "2 menit lalu",
    },
    {
      icon: Bell,
      color: "text-orange-600",
      bg: "bg-orange-100",
      text: "3 pengajuan menunggu verifikasi RT",
      time: "11 menit lalu",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24, y: 16 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      whileHover={{ x: -8, y: -4 }}
      transition={{ duration: 0.8, delay: 0.75, ease: EASE_SPRING }}
      className="absolute -right-8 bottom-12 w-72 bg-white rounded-2xl border border-slate-200 shadow-lg p-5 z-30 hover:shadow-xl hover:z-50 cursor-pointer transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
          <Bell className="w-4 h-4 text-slate-600" />
        </div>
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Notifikasi
        </span>
        <span className="ml-auto text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      <div className="space-y-3">
        {items.map(({ icon: Icon, color, bg, text, time }) => (
          <div key={text} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 leading-snug">{text}</p>
              <p className="text-xs text-slate-400 mt-1">{time}</p>
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
      <CardStats />
      <div className="relative z-20 mt-8 mr-0">
        <CardLetter />
      </div>
      <CardNotification />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.5, ease: EASE_SPRING }}
        className="absolute top-4 right-12 bg-white border border-slate-200 rounded-lg px-3.5 py-2 shadow-md z-40 flex items-center gap-2"
      >
        <Lock className="w-4 h-4 text-emerald-600" />
        <span className="text-xs font-semibold text-slate-700">Enkripsi Terjamin</span>
      </motion.div>
    </div>
  );
}

// ─── TRUST STRIP ──────────────────────────────────────────────────────────────

function TrustStrip() {
  const items = [
    { icon: Shield, label: "Keamanan Data Terjamin" },
    { icon: Lock, label: "Enkripsi End-to-End" },
    { icon: Zap, label: "Proses Instan" },
    { icon: MapPin, label: "Solusi Lokal" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.0, duration: 0.6 }}
      className="mt-12 pt-10 border-t border-slate-200"
    >
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
        Keunggulan Platform
      </p>
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-10 gap-y-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 text-slate-600">
            <Icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50" />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-blue-400 rounded-full opacity-10 blur-[100px] mix-blend-multiply pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -16, 0], y: [0, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -bottom-60 -left-40 w-[600px] h-[600px] bg-indigo-400 rounded-full opacity-10 blur-[100px] mix-blend-multiply pointer-events-none"
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
            <motion.div variants={FADE_UP} className="inline-flex items-center gap-3 mb-8">
              <div className="h-0.5 w-8 bg-gradient-to-r from-blue-600 to-indigo-600" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Platform Digital Terpercaya
              </span>
            </motion.div>

            <motion.h1
              variants={FADE_UP}
              className="text-5xl sm:text-6xl lg:text-[3.75rem] font-bold tracking-tight leading-[1.15] text-slate-900 mb-8"
            >
              Sistem Administrasi Desa
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent pb-1 inline-block">
                Modern & Terpercaya
              </span>
            </motion.h1>

            <motion.p
              variants={FADE_UP}
              className="text-base text-slate-600 leading-relaxed max-w-xl mb-10 font-normal"
            >
              Platform terintegrasi untuk mengelola administrasi desa secara efisien. Dari pengajuan surat warga hingga pengelolaan anggaran, semua proses dapat diakses dengan mudah dan transparan.
            </motion.p>

            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-start gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="group flex w-full sm:w-auto justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm"
              >
                Mulai Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full sm:w-auto justify-center items-center gap-2 bg-white text-slate-700 font-semibold px-7 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 text-sm"
              >
                Pelajari Lebih Lanjut
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </motion.button>
            </motion.div>

            <motion.p variants={FADE_UP} className="text-xs text-slate-500 font-medium">
              Dukungan penuh dari perangkat desa setempat.
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
