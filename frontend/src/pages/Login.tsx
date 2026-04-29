import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // Tambahkan useNavigate di sini
import { 
  Layers, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  ChevronLeft,
  Loader2,
  Globe
} from "lucide-react";

// ─── ANIMATION CONFIG ─────────────────────────────────────────────────────────

const EASE_SPRING = [0.16, 1, 0.3, 1];

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: EASE_SPRING }
  })
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Inisialisasi navigasi

  // Simulasi proses login untuk interaksi UI
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Logika pindah halaman diletakkan di sini setelah loading selesai
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard-warga'); 
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden font-sans antialiased">
      
      {/* ── BACKGROUND MESH GRADIENT ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-100/40 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-100/40 blur-[120px]"
        />
      </div>

      {/* ── MAIN LOGIN CONTAINER ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE_SPRING }}
        className="relative w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white ring-1 ring-slate-900/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden"
      >
        
        {/* ── LEFT SIDE: VISUAL BRANDING ── */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-[-20%] right-[-20%] w-96 h-96 border-[40px] border-white rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 border-[20px] border-white rounded-full" />
          </div>

          <motion.div custom={0} variants={FADE_UP} initial="hidden" animate="visible">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                <ChevronLeft className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-white/80">Kembali ke Beranda</span>
            </Link>
          </motion.div>

          <div className="relative z-10">
            <motion.div custom={1} variants={FADE_UP} initial="hidden" animate="visible" className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-8 shadow-2xl">
              <Layers className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h2 custom={2} variants={FADE_UP} initial="hidden" animate="visible" className="text-4xl font-extrabold text-white leading-tight mb-6">
              Portal Layanan <br /> Desa Terpadu.
            </motion.h2>
            <motion.p custom={3} variants={FADE_UP} initial="hidden" animate="visible" className="text-blue-100/70 text-lg font-medium leading-relaxed max-w-xs">
              Masuk untuk mengelola administrasi, pengumuman, dan laporan warga secara real-time.
            </motion.p>
          </div>

          <motion.div custom={4} variants={FADE_UP} initial="hidden" animate="visible" className="flex items-center gap-4 py-4 px-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl w-fit">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-white/90 tracking-wide uppercase">Enkripsi Data Standar Nasional</span>
          </motion.div>
        </div>

        {/* ── RIGHT SIDE: LOGIN FORM ── */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white/60">
          
          <div className="mb-10">
            <motion.h3 custom={1} variants={FADE_UP} initial="hidden" animate="visible" className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Selamat Datang <span className="text-blue-600">.</span>
            </motion.h3>
            <motion.p custom={2} variants={FADE_UP} initial="hidden" animate="visible" className="text-slate-500 font-medium mt-2">
              Silakan masuk dengan kredensial perangkat desa Anda.
            </motion.p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Input NIK/Username */}
            <motion.div custom={3} variants={FADE_UP} initial="hidden" animate="visible" className="space-y-2">
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest ml-1">
                NIK / Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm"
                  placeholder="Masukkan NIK atau Username"
                  required
                />
              </div>
            </motion.div>

            {/* Input Password */}
            <motion.div custom={4} variants={FADE_UP} initial="hidden" animate="visible" className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                  Kata Sandi
                </label>
                <a href="#" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors">Lupa sandi?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="block w-full pl-11 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div custom={5} variants={FADE_UP} initial="hidden" animate="visible" className="pt-2">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyambungkan...
                  </>
                ) : (
                  <>
                    Masuk ke Portal
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Footer Form */}
          <motion.div 
            custom={6} 
            variants={FADE_UP} 
            initial="hidden" 
            animate="visible" 
            className="mt-10 pt-8 border-t border-slate-100 text-center"
          >
            <p className="text-xs font-medium text-slate-400">
              Butuh bantuan akses? <a href="#" className="text-blue-600 font-bold hover:underline">Hubungi Admin Desa</a>
            </p>
            <div className="mt-6 flex items-center justify-center gap-6 opacity-30 grayscale">
              <Globe className="w-5 h-5" />
              <ShieldCheck className="w-5 h-5" />
              <Lock className="w-5 h-5" />
            </div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}