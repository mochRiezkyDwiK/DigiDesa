import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
  UserPlus,
  Phone,
  Fingerprint,
  MapPin,
} from "lucide-react";

// Mengimpor komponen dari folder komponen
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatsWidget from "../components/StatsWidgets";

const EASE = [0.22, 1, 0.36, 1];

const stagger = {
  hidden: {},

  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },

  visible: {
    opacity: 1,

    y: 0,

    filter: "blur(0px)",

    transition: { duration: 0.6, ease: EASE },
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<"nama" | "nik" | "hp" | "password" | null>(null);

  const [nik, setNik] = useState("");

  const [password, setPassword] = useState("");

  const [namaLengkap, setNamaLengkap] = useState("");

  const [noHp, setNoHp] = useState("");

  const toggleMode = () => {
    setIsRegister(!isRegister);

    setNik("");

    setPassword("");

    setNamaLengkap("");

    setNoHp("");

    setShowPassword(false);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      if (isRegister) {
        const response = await axios.post("http://localhost:5000/api/v1/auth/register", {
          nama_lengkap: namaLengkap,
          nik: nik,
          username: nik,
          no_hp: noHp,
          password: password,
        });

        if (response.data.success) {
          alert("Akun warga berhasil didaftarkan! Silakan masuk.");
          toggleMode();
        }
      } else {
        const response = await axios.post("http://localhost:5000/api/v1/auth/login", {
          username: nik,
          password: password,
        });

        if (response.data.success) {
          localStorage.clear();
          localStorage.setItem("token", response.data.token);

          localStorage.setItem("user", JSON.stringify(response.data.user));

          localStorage.setItem("role", response.data.user.role || "");

          alert("Login Berhasil!");
          if (response.data.user.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/dashboard-warga");
          }
        }
      }
    } catch (error: any) {
      console.error("ERROR PADA MESIN AUTH SYSTEM FE:", error);
      alert(error.response?.data?.message || "Gagal memproses permohonan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col justify-between overflow-x-hidden relative selection:bg-blue-500 selection:text-white">
      {/* Diambil dari Component */}
      <Navbar />

      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-60" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />

      {/* Main Content Layout */}
      <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 md:px-16 pt-32 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* SISI KIRI: INFOGRAFIS */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col justify-center lg:pr-16 text-center lg:text-left"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-950 mb-6"
          >
            Administrasi desa <span className="text-blue-600">{isRegister ? "selangkah lebih dekat." : "kini digital."}</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10"
          >
            Satu portal untuk seluruh layanan administrasi — dari pengajuan surat hingga laporan kependudukan, semua tersedia secara real-time.
          </motion.p>

          <motion.div variants={fadeUp} className="w-full max-w-xl mx-auto lg:mx-0">
            <StatsWidget />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider"
          >
            <MapPin size={14} className="text-blue-600" /> Melayani seluruh wilayah desa
          </motion.div>
        </motion.section>

        {/* SISI KANAN: FORM CARD */}
        <section className="lg:col-span-5 w-full flex justify-center items-center lg:pl-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
          >
            {/* Header Tab Pilihan Atas */}
            <div className="grid grid-cols-3 gap-2 mb-8 text-center border-b border-slate-100 pb-4">
              <button 
                type="button"
                onClick={() => isRegister && toggleMode()}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${!isRegister ? 'bg-slate-50 text-blue-600' : 'text-slate-400 hover:text-slate-800'}`}
              >
                <User size={18} className="mb-1" />
                <span className="text-[11px] font-bold">User name</span>
              </button>
              <button 
                type="button"
                onClick={() => !isRegister && toggleMode()}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${isRegister ? 'bg-slate-50 text-blue-600' : 'text-slate-400 hover:text-slate-800'}`}
              >
                <UserPlus size={18} className="mb-1" />
                <span className="text-[11px] font-bold">UserPlus</span>
              </button>
              <button 
                type="button" 
                onClick={() => alert("Login sidik jari terintegrasi perangkat keras.")}
                className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <Fingerprint size={18} className="mb-1" />
                <span className="text-[11px] font-bold">Fingerprint</span>
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5">
              <AnimatePresence mode="popLayout">
                {isRegister && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block mb-1.5 text-xs font-semibold text-slate-600 tracking-wide">
                      Nama Lengkap (Sesuai KTP)
                    </label>
                    <div className="relative">
                      <UserPlus
                        size={16}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === "nama" ? "text-blue-600" : "text-slate-400"}`}
                      />
                      <input
                        type="text"
                        value={namaLengkap}
                        onChange={(e) => setNamaLengkap(e.target.value)}
                        onFocus={() => setFocused("nama")}
                        onBlur={() => setFocused(null)}
                        required
                        placeholder="Contoh: Uzumaki Bayu"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block mb-1.5 text-xs font-semibold text-slate-600 tracking-wide">
                  NIK KTP / Username
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === "nik" ? "text-blue-600" : "text-slate-400"}`}
                  />
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    onFocus={() => setFocused("nik")}
                    onBlur={() => setFocused(null)}
                    required
                    placeholder="Masukkan NIK 16 digit..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                  />
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {isRegister && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block mb-1.5 text-xs font-semibold text-slate-600 tracking-wide">
                      No WhatsApp Aktif
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === "hp" ? "text-blue-600" : "text-slate-400"}`}
                      />
                      <input
                        type="tel"
                        value={noHp}
                        onChange={(e) => setNoHp(e.target.value)}
                        onFocus={() => setFocused("hp")}
                        onBlur={() => setFocused(null)}
                        required
                        placeholder="Contoh: 08xxxxxxxxxx"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-600 tracking-wide">
                    Kata Sandi
                  </label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => alert("Pemulihan akun silakan lapor RT setempat.")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-transparent cursor-pointer"
                    >
                      Lupa sandi?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Lock
                    size={16}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === "password" ? "text-blue-600" : "text-slate-400"}`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    required
                    placeholder={isRegister ? "Buat kata sandi aman..." : "Masukkan kata sandi..."}
                    className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0 flex items-center cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {!isRegister && (
                <div className="flex items-center gap-2.5 mt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-slate-300 bg-slate-50 accent-blue-600 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs font-medium text-slate-500 cursor-pointer select-none">
                    Ingat perangkat ini selama 30 hari
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/10 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all flex justify-center items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    {isRegister ? "Mendaftarkan..." : "Memverifikasi..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    {isRegister ? "Submit Pendaftaran" : "Submit"}
                    <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-slate-100" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">atau</span>
              <div className="flex-1 h-[1px] bg-slate-100" />
            </div>

            <button
              type="button"
              onClick={toggleMode}
              className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium text-xs tracking-wide transition-all cursor-pointer"
            >
              {isRegister ? "Sudah Punya Akun? Masuk Portal" : "Daftar Akun Baru"}
            </button>
          </motion.div>
        </section>
      </div>

      {/* Diambil dari Component */}
      {/* <Footer /> */}
    </div>
  );
}
