import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { EASE_SPRING, STAGGER_CONTAINER, FADE_UP } from "../constants/animation";
import {
  ArrowRight,
  Shield,
  Zap,
  FileText,
  CheckCircle2,
  MessageSquare,
  Clock,
  Bell,
  Users,
  ChevronRight,
  BarChart3,
  MapPin,
  Layers,
  Lock,
  TrendingUp,
  Activity,
  ChevronDown,
} from "lucide-react";


// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [layananDropdown, setLayananDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (layananDropdown) {
        setLayananDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [layananDropdown]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_SPRING }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_24px_rgba(30,58,138,0.06)]"
          : "bg-transparent py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight text-[1.1rem]">
            Digi<span className="text-blue-700">Desa</span>
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {/* Dropdown Layanan */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLayananDropdown(!layananDropdown);
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 flex items-center gap-1"
            >
              Layanan
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${layananDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {layananDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-900/10 py-2 z-50"
              >
                <button
                  onClick={() => {
                    navigate('/lapor');
                    setLayananDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200 flex items-center gap-3"
                >
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Pengaduan</div>
                    <div className="text-xs text-slate-500">Laporkan masalah atau keluhan</div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    navigate('/surat');
                    setLayananDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200 flex items-center gap-3"
                >
                  <FileText className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium">Pembuatan Surat</div>
                    <div className="text-xs text-slate-500">SKTM, KTP, dan lainnya</div>
                  </div>
                </button>
              </motion.div>
            )}
          </div>

          {/* Menu lainnya */}
          {[
            { name: "Statistik", path: "/statistik" },
            { name: "Pengumuman", path: "/pengumuman" },
            { name: "Bantuan", path: "/bantuan" }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200">
            Masuk
          </button>
          <motion.button
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm font-bold text-white bg-slate-900 px-5 py-2.5 rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all"
          >
            Portal RW/RT
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── FLOATING CARDS ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
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
    { label: "Warga Terdaftar", value: "4.821", delta: "+12 hari ini", icon: Users },
    { label: "Pengajuan Aktif", value: "138", delta: "23 menunggu", icon: FileText },
    { label: "Tingkat Selesai", value: "96.4%", delta: "↑ 2.1%", icon: TrendingUp },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2.5 }}
      transition={{ duration: 0.9, delay: 0.4, ease: EASE_SPRING }}
      className="absolute -left-8 top-8 w-72 bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/50 ring-1 ring-white/80 shadow-[0_16px_40px_rgba(30,58,138,0.08)] p-5 z-10"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-blue-700" />
        </div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Statistik Desa
        </span>
      </div>
      <div className="space-y-4">
        {stats.map(({ label, value, delta, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Icon className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 leading-none mb-1">{label}</p>
                <p className="text-sm font-extrabold text-slate-800 leading-none">{value}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
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
      initial={{ opacity: 0, y: 48, x: 16 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.9, delay: 0.55, ease: EASE_SPRING }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative w-80 bg-white/90 backdrop-blur-xl rounded-3xl border border-white ring-1 ring-slate-100 shadow-[0_20px_60px_rgba(30,58,138,0.12)] p-6 z-20 transition-shadow"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
            Pengajuan Baru
          </p>
          <h4 className="text-sm font-extrabold text-slate-900">Surat Keterangan Domisili</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Ref: SKD-2026-00841</p>
        </div>
        <StatusBadge status="Diproses" />
      </div>

      <div className="h-px bg-slate-100 mb-5" />

      <div className="space-y-4 mb-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100/50 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-slate-400">Pemohon (RT 01/RW 10)</p>
            <p className="text-xs font-bold text-slate-800">Budi Santoso</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-100/50 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-slate-400">Estimasi Selesai</p>
            <p className="text-xs font-bold text-slate-800">Hari ini 14:00 WIB</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold text-slate-500">Progress Verifikasi</p>
          <p className="text-[11px] font-extrabold text-blue-700">65%</p>
        </div>
        <ProgressBar value={65} />
      </div>

      <div className="flex items-center gap-1.5">
        {["Terima", "Verifikasi", "Ttd", "Selesai"].map((step, i) => (
          <div key={step} className="flex items-center gap-1.5 flex-1">
            <div className={`flex-1 flex items-center gap-1 ${i < 4 ? "min-w-0" : ""}`}>
              <div className={`w-full flex flex-col items-center gap-1 ${i < 2 ? "opacity-100" : "opacity-40"}`}>
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
                <p className="text-[9px] font-bold text-slate-500 text-center leading-tight">{step}</p>
              </div>
            </div>
            {i < 3 && <div className={`h-px flex-1 mb-3 ${i < 1 ? "bg-blue-300" : "bg-slate-200"}`} />}
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
      time: "2m lalu",
    },
    {
      icon: Bell,
      color: "text-blue-600",
      bg: "bg-blue-50",
      text: "3 pengajuan baru butuh verifikasi RT",
      time: "11m lalu",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24, y: 16 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: 0.75, ease: EASE_SPRING }}
      className="absolute -right-8 bottom-12 w-64 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/60 ring-1 ring-white/80 shadow-[0_16px_32px_rgba(30,58,138,0.1)] p-4 z-30"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
          <Activity className="w-3 h-3 text-blue-700" />
        </div>
        <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
          Aktivitas Terkini
        </span>
        <span className="ml-auto text-[10px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded-full">
          2
        </span>
      </div>
      <div className="space-y-3">
        {items.map(({ icon: Icon, color, bg, text, time }) => (
          <div key={text} className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-3.5 h-3.5 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-700 leading-tight line-clamp-2">{text}</p>
              <p className="text-[10px] font-semibold text-slate-400 mt-1">{time}</p>
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
        <div className="w-96 h-96 bg-blue-400 rounded-full opacity-15 blur-[80px]" />
        <div className="absolute w-72 h-72 bg-violet-400 rounded-full opacity-15 blur-[80px] translate-x-12 translate-y-8" />
      </div>

      <CardStats />

      <div className="relative z-20 mt-8 mr-0">
        <CardLetter />
      </div>

      <CardNotification />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.5, ease: EASE_SPRING }}
        className="absolute top-2 right-12 bg-white/90 backdrop-blur-md border border-white ring-1 ring-slate-100 rounded-xl px-3 py-2 shadow-lg z-40 flex items-center gap-2"
      >
        <Lock className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-[11px] font-bold text-slate-700">Akses Aman RW/RT</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
        className="absolute inset-0 pointer-events-none z-20"
      />
    </div>
  );
}

// ─── TRUST STRIP ──────────────────────────────────────────────────────────────

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
      transition={{ delay: 1.0, duration: 0.6 }}
      className="mt-16 pt-8 border-t border-slate-200/60"
    >
      <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-6">
        Standar Pelayanan Prima
      </p>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-slate-500">
            <Icon className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 -z-10 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white/80 to-blue-50/50" />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-blue-300 rounded-full opacity-20 blur-[100px] mix-blend-multiply pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -16, 0], y: [0, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -bottom-60 -left-40 w-[600px] h-[600px] bg-indigo-300 rounded-full opacity-20 blur-[100px] mix-blend-multiply pointer-events-none"
        />
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(30,58,138,1) 1px, transparent 1px), linear-gradient(to right, rgba(30,58,138,1) 1px, transparent 1px)`,
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
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-[0.2em]">
                Platform Administrasi Modern
              </span>
            </motion.div>

            <motion.h1
              variants={FADE_UP}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-6"
            >
              Layanan Desa
              <br />
              Kini Masuk{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent pb-2 inline-block">
                Era Digital
              </span>
            </motion.h1>

            <motion.p
              variants={FADE_UP}
              className="text-lg text-slate-500 leading-relaxed max-w-xl mb-10 font-medium"
            >
              DigiDesa menyederhanakan administrasi menjadi pengalaman yang
              cepat, transparan, dan terstruktur — dari pengajuan surat warga hingga persetujuan RT/RW, semua dalam satu platform.
            </motion.p>

            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-start gap-4 mb-5">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group flex w-full sm:w-auto justify-center items-center gap-2.5 bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl shadow-[0_8px_32px_rgba(29,78,216,0.3)] hover:shadow-[0_12px_48px_rgba(29,78,216,0.4)] transition-all duration-300 text-[0.95rem]"
              >
                Layanan Surat
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex w-full sm:w-auto justify-center items-center gap-2.5 bg-white text-slate-800 font-bold px-8 py-4 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 text-[0.95rem]"
              >
                Lapor Warga
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </motion.button>
            </motion.div>

            <motion.p variants={FADE_UP} className="text-xs text-slate-400 font-semibold">
              Terintegrasi langsung dengan perangkat desa setempat.
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

// ─── FEATURES SECTION ─────────────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "Pengajuan Surat Digital",
      desc: "Warga mengajukan dokumen kapan saja, proses persetujuan RT/RW berjalan otomatis tanpa antre.",
      accent: "blue",
    },
    {
      icon: Users,
      title: "Manajemen Terpusat",
      desc: "Data profil warga dan keluarga tersimpan rapi dan mudah diakses oleh perangkat berwenang.",
      accent: "indigo",
    },
    {
      icon: BarChart3,
      title: "Dashboard Informasi",
      desc: "Statistik real-time mengenai pengajuan surat dan laporan masalah lingkungan sekitar.",
      accent: "violet",
    },
    {
      icon: Shield,
      title: "Keamanan Terjamin",
      desc: "Autentikasi terenkripsi untuk memastikan hanya warga asli dan pengurus yang bisa mengakses.",
      accent: "blue",
    },
    {
      icon: Bell,
      title: "Notifikasi Otomatis",
      desc: "Mendapat pemberitahuan langsung ketika surat selesai diproses atau laporan ditanggapi.",
      accent: "indigo",
    },
    {
      icon: Activity,
      title: "Transparansi Laporan",
      desc: "Pantau tindak lanjut perbaikan fasilitas desa dari laporan yang telah diajukan bersama.",
      accent: "violet",
    },
  ];

  const accentMap = {
    blue: {
      icon: "text-blue-600 bg-blue-50",
      border: "hover:border-blue-200",
      glow: "hover:shadow-[0_8px_32px_rgba(29,78,216,0.08)]",
    },
    indigo: {
      icon: "text-indigo-600 bg-indigo-50",
      border: "hover:border-indigo-200",
      glow: "hover:shadow-[0_8px_32px_rgba(79,70,229,0.08)]",
    },
    violet: {
      icon: "text-violet-600 bg-violet-50",
      border: "hover:border-violet-200",
      glow: "hover:shadow-[0_8px_32px_rgba(124,58,237,0.08)]",
    },
  };

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white -z-10" />
      <motion.div style={{ y }} className="absolute top-20 right-20 w-64 h-64 bg-blue-300 rounded-full opacity-[0.05] blur-[80px] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE_SPRING }}
          className="max-w-2xl mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-6 bg-blue-600" />
            <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-[0.2em]">
              Kapasitas Platform
            </span>
          </div>
          <h2 className="text-4xl md:text-[2.8rem] font-extrabold tracking-tight leading-[1.1] text-slate-900 mb-4">
            Semua yang dibutuhkan
            <br />
            <span className="text-slate-400">untuk pengelolaan lingkungan.</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            Dirancang khusus agar pengurus RW dan RT dapat berkoordinasi dengan mudah melayani warga.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, accent }, i) => {
            const a = accentMap[accent as keyof typeof accentMap];
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: EASE_SPRING }}
                whileHover={{ y: -4 }}
                className={`group bg-white rounded-3xl border border-slate-100 p-8 transition-all duration-300 cursor-pointer ${a.border} ${a.glow} ${
                  i === 1 ? "lg:mt-8" : i === 3 ? "lg:mt-6" : ""
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl ${a.icon} flex items-center justify-center mb-6`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Pelajari <ChevronRight className="w-3 h-3" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CTA SECTION ──────────────────────────────────────────────────────────────

function CtaSection() {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE_SPRING }}
          className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-[2.5rem] p-12 md:p-16 overflow-hidden text-center shadow-2xl"
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-[80px]" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-violet-500 rounded-full opacity-20 blur-[80px]" />

          <div className="relative z-10">
            <p className="text-blue-400 text-[10px] font-extrabold uppercase tracking-[0.2em] mb-4">
              Portal Warga & Pengurus
            </p>
            <h2 className="text-4xl md:text-[2.6rem] font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Siap mempermudah
              <br />
              birokrasi lingkunganmu?
            </h2>
            <p className="text-slate-300 text-lg max-w-xl mx-auto mb-10 font-medium">
              Gabung sekarang dan nikmati kemudahan akses informasi serta administrasi dalam satu pintu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 bg-blue-600 text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg hover:bg-blue-500 transition-all text-[0.95rem] w-full sm:w-auto justify-center"
              >
                Masuk Portal
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <button className="text-slate-300 font-bold text-sm hover:text-white transition-colors duration-200">
                Lihat Panduan →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-slate-100 py-12 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-600 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-extrabold text-slate-800 tracking-tight">
            Digi<span className="text-blue-700">Desa</span>
          </span>
          <span className="text-slate-400 text-sm font-medium ml-1">· Administrasi Terpadu</span>
        </div>
        <p className="text-xs font-medium text-slate-400">
          © {new Date().getFullYear()} DigiDesa Lingkungan. Hak Cipta Dilindungi.
        </p>
        <div className="flex gap-6">
          {["Tentang", "Bantuan", "Privasi"].map((l) => (
            <a key={l} href="#" className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-bold">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── HOME (ROOT EXPORT) ───────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans antialiased overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}