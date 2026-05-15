import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // Tambahkan useNavigate di sini
import { EASE_SPRING } from "../../constants/animation";
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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans antialiased">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE_SPRING }}
        className="relative w-full max-w-[960px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden"
      >
        <div className="p-8 sm:p-12 lg:p-16 bg-slate-50">
          <div className="mb-10">
            <motion.h3 custom={3} variants={FADE_UP} initial="hidden" animate="visible" className="text-3xl font-semibold text-slate-900 tracking-tight">
              Selamat Datang
            </motion.h3>
            <motion.p custom={4} variants={FADE_UP} initial="hidden" animate="visible" className="text-slate-600 mt-3 max-w-md leading-relaxed">
              Masuk menggunakan akun resmi perangkat desa untuk melanjutkan ke dashboard layanan dan dokumentasi.
            </motion.p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div custom={5} variants={FADE_UP} initial="hidden" animate="visible" className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">NIK / Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 pl-12 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                  placeholder="Masukkan NIK atau Username"
                  required
                />
              </div>
            </motion.div>

            <motion.div custom={6} variants={FADE_UP} initial="hidden" animate="visible" className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Kata Sandi</label>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Lupa sandi?</a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 pl-12 pr-12 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div custom={7} variants={FADE_UP} initial="hidden" animate="visible">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
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
              </button>
            </motion.div>
          </form>

          <motion.div custom={8} variants={FADE_UP} initial="hidden" animate="visible" className="mt-10 border-t border-slate-200 pt-8 text-center">
            <p className="text-sm text-slate-500">
              Perlu bantuan? <a href="#" className="font-semibold text-slate-900 hover:text-blue-600">Hubungi Admin Desa</a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}