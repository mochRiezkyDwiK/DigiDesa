import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
  User,
  Building2,
  Fingerprint,
  MapPin,
  ChevronRight,
  UserPlus,
  Phone,
  CheckCircle2,
  ChevronDown,
  MessageSquare,
  FileText
} from "lucide-react";

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

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [layananDropdown, setLayananDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-200" : "bg-white border-b border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <a href="/" className="flex flex-col">
            <span className="font-extrabold text-slate-900 tracking-tight text-[1.1rem] leading-none">
              Digi<span className="text-blue-600">Desa</span>
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pemerintah Desa</span>
          </a>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => setLayananDropdown(!layananDropdown)} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1">
            Layanan <ChevronDown className="w-4 h-4" />
          </button>
          {['Transparansi', 'Pengumuman', 'Bantuan'].map((item) => (
            <button key={item} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">{item}</button>
          ))}
        </div>

        <button onClick={() => navigate('/login')} className="text-sm font-semibold text-white bg-slate-900 px-5 py-2 rounded-full hover:bg-blue-600 transition-all">
          Portal Warga
        </button>
      </div>
    </nav>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [noHp, setNoHp] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // ... logik axios tetap sama
    setTimeout(() => setIsLoading(false), 2000); // Simulasi
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Inter', sans-serif", color: "#0F172A" }}>
      <Navbar />
      
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "120px 40px", display: "grid", gridTemplateColumns: "1fr 450px", gap: "60px" }}>
        <motion.section variants={stagger} initial="hidden" animate="visible">
          <motion.h1 variants={fadeUp} style={{ fontSize: "64px", fontWeight: 800, marginBottom: "20px", lineHeight: 1.1 }}>
            Administrasi desa <br />
            <span style={{ color: "#2563EB" }}>{isRegister ? "selangkah lebih dekat." : "kini digital."}</span>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontSize: "18px", color: "#64748B", maxWidth: "480px", marginBottom: "40px" }}>
            Satu portal untuk seluruh layanan administrasi warga. Cepat, mudah, dan transparan.
          </motion.p>
          <motion.div variants={fadeUp}><StatsWidget /></motion.div>
        </motion.section>

        <section>
          <motion.div style={{ background: "white", padding: "40px", borderRadius: "24px", border: "1px solid #E2E8F0", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>{isRegister ? "Buat Akun" : "Masuk ke Portal"}</h2>
            <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "24px" }}>Gunakan kredensial yang terdaftar untuk akses layanan.</p>
            
            <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {isRegister && (
                <input type="text" placeholder="Nama Lengkap" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", background: "#F9FAFB" }} />
              )}
              <input type="text" placeholder="NIK / Username" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", background: "#F9FAFB" }} />
              <input type="password" placeholder="Kata Sandi" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0", background: "#F9FAFB" }} />
              
              <button type="submit" style={{ background: "#2563EB", color: "white", padding: "12px", borderRadius: "12px", border: "none", fontWeight: 600, cursor: "pointer" }}>
                {isLoading ? <Loader2 className="animate-spin" /> : (isRegister ? "Daftar" : "Masuk")}
              </button>
            </form>

            <button onClick={() => setIsRegister(!isRegister)} style={{ marginTop: "20px", background: "none", border: "none", color: "#64748B", fontSize: "14px", cursor: "pointer" }}>
              {isRegister ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
            </button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}