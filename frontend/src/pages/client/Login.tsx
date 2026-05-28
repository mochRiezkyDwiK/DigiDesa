import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, User, Lock, Card, UserCheck } from "lucide-react";

// Mengimpor komponen global dari folder aslinya
import Navbar from "../../components/Navbar"; 
import StatsWidget from "../../components/StatsWidgets";

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
  const [isLoading, setIsLoading] = useState(false);

  // State Pengendali Form Kontrol
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isRegister ? "/api/v1/auth/register" : "/api/v1/auth/login";
      const payload = isRegister ? { nik, password, namaLengkap } : { nik, password };

      const response = await axios.post(`http://localhost:5000${endpoint}`, payload, {
        headers: { "Content-Type": "application/json" }
      });

      const resData = response.data;

      if (resData.success && resData.token && resData.user) {
        localStorage.setItem("token", resData.token);
        localStorage.setItem("user", JSON.stringify(resData.user));

        const userRole = resData.user.role?.toUpperCase();

        if (userRole === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/dashboard-warga");
        }
      } else {
        alert(resData.message || "Gagal memproses otentikasi akun.");
      }

    } catch (error: any) {
      console.error("Auth Error:", error);
      alert(error.response?.data?.message || "Terjadi kesalahan pada jaringan server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Navbar Global */}
      <Navbar />
      
      {/* Layout Grid Utama */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Sisi Kiri: Hero Banner Informasi */}
        <motion.section 
          variants={stagger} 
          initial="hidden" 
          animate="visible"
          className="lg:col-span-7 space-y-6 text-center lg:text-left"
        >
          <motion.h1 
            variants={fadeUp} 
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none"
          >
            Administrasi desa <br />
            <span className="text-blue-600 mt-2 block">
              {isRegister ? "selangkah lebih dekat." : "kini digital."}
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeUp} 
            className="text-base sm:text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 font-medium"
          >
            Satu portal terintegrasi untuk seluruh layanan mandiri administrasi warga. Cepat, aman, dan transparan.
          </motion.p>
          
          <motion.div variants={fadeUp} className="pt-4">
            <StatsWidget />
          </motion.div>
        </motion.section>

        {/* Sisi Kanan: Card Form Autentikasi */}
        <section className="lg:col-span-5 w-full max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-100/50 space-y-6"
          >
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {isRegister ? "Buat Akun Warga" : "Masuk ke Portal"}
              </h2>
              <p className="text-sm text-slate-400 font-medium mt-1">
                {isRegister ? "Lengkapi data diri Anda untuk mendaftar." : "Gunakan kredensial terdaftar untuk akses layanan."}
              </p>
            </div>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegister && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Nama Lengkap" 
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all" 
                    required
                  />
                </div>
              )}
              
              <div className="relative">
                <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="NIK / Username" 
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all" 
                  required
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="password" 
                  placeholder="Kata Sandi" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all" 
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <span>{isRegister ? "Daftar Akun Sekarang" : "Masuk Aplikasi"}</span>
                )}
              </button>
            </form>

            <div className="pt-2 text-center">
              <button 
                onClick={() => setIsRegister(!isRegister)} 
                className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer"
              >
                {isRegister ? "Sudah memiliki akun? Masuk" : "Belum terdaftar? Hubungi RT atau Daftar Mandiri"}
              </button>
            </div>
          </motion.div>
        </section>
        
      </main>
    </div>
  );
}