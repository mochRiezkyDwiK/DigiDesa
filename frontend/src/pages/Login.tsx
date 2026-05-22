import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
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
  // TAMBAHAN IMPORT ICON UNTUK NAVBAR
  ChevronDown,
  MessageSquare,
  FileText
} from "lucide-react";

// IMBAL/IMPORT KOMPONEN STATS YANG BARU DI SINI
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

const features = [
  "Pengajuan surat online 24/7",
  "Notifikasi status real-time",
  "Arsip dokumen digital",
  "Laporan transparan & akuntabel",
];

// ==========================================
// FIX: KOMPONEN NAVBAR DI निकाला KE LUAR LOGIN
// ==========================================
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900 border-b border-gray-800 shadow-sm"
          : "bg-gray-900 border-b border-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 flex items-center justify-center border border-gray-500">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <a href="/" className="flex flex-col">
            <span className="font-extrabold text-slate-100 tracking-tight text-[1.1rem] leading-none">
              Digi<span className="text-blue-700">Desa</span>
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pemerintah Desa</span>
          </a>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {/* Dropdown Layanan */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLayananDropdown(!layananDropdown);
              }}
              className="text-sm font-medium text-gray-300 hover:text-blue-900 transition-colors flex items-center gap-1"
            >
              Layanan
              <ChevronDown className={`w-4 h-4 transition-transform ${layananDropdown ? 'rotate-180' : ''}`} />
            </button>

            {layananDropdown && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-gray-500 shadow-md py-2 z-50"
              >
                <button
                  onClick={() => {
                    navigate('/lapor');
                    setLayananDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-blue-900 transition-colors flex items-center gap-3 border-b border-gray-200"
                >
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Layanan Pengaduan</div>
                    <div className="text-xs text-gray-500">Laporan dan keluhan warga</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigate('/create-surat');
                    setLayananDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-blue-900 transition-colors flex items-center gap-3"
                >
                  <FileText className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Pembuatan Surat</div>
                    <div className="text-xs text-gray-500">Administrasi kependudukan</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Menu lainnya */}
          {[
            { name: "Transparansi", path: "/transparansi-anggaran" },
            { name: "Pengumuman", path: "/pengumuman" },
            { name: "Bantuan", path: "/bantuan" }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="text-sm font-medium text-gray-300 hover:text-blue-900 transition-colors"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-white bg-slate-800 px-5 py-2 hover:bg-blue-900 transition-colors"
          >
            Portal Warga
          </button>
        </div>
      </div>
    </nav>
  );
}

// ==========================================
// UTAMA: KOMPONEN LOGIN
// ==========================================
export default function Login() {
  const navigate = useNavigate();
  
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [noHp, setNoHp] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

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
          password: password
        });

        if (response.data.success) {
          alert("Akun warga berhasil didaftarkan! Silakan masuk untuk melengkapi berkas.");
          toggleMode();
        }
      } else {
        const response = await axios.post("http://localhost:5000/api/v1/auth/login", {
          username: nik,
          password: password
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
      alert(error.response?.data?.message || "Gagal memproses permohonan, cek koneksi server Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080C14", fontFamily: "'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif", color: "#F8FAFC", overflow: "hidden", position: "relative" }}>
      <Navbar />
      
      {/* Background Decor */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-20%", left: "55%", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      </div>

      {/* Main Content Layout */}
      <main style={{ position: "relative", zIndex: 5, display: "grid", gridTemplateColumns: "1fr 480px", gap: 0, minHeight: "calc(100vh - 73px)", maxWidth: "1400px", margin: "0 auto", padding: "0 40px" }}>
        
        {/* SISI KIRI: INFOGRAFIS */}
        <motion.section variants={stagger} initial="hidden" animate="visible" style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "80px", paddingTop: "40px", paddingBottom: "40px" }}>
          <motion.h1 variants={fadeUp} style={{ fontSize: "clamp(42px, 4.5vw, 64px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, margin: 0, marginBottom: "20px" }}>
            Administrasi desa <br />
            <span style={{ background: "linear-gradient(135deg, #60A5FA 0%, #818CF8 50%, #A78BFA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {isRegister ? "selangkah lebih dekat." : "kini digital."}
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} style={{ fontSize: "17px", color: "#64748B", lineHeight: 1.7, maxWidth: "480px", marginBottom: "80px", margin: 0 }}>
            Satu portal untuk seluruh layanan administrasi — dari pengajuan surat hingga laporan kependudukan, semua tersedia secara real-time.
          </motion.p>

          {/* MEMANGGIL WIDGET STATISTIK SECARA INSTAN DI SINI */}
          <motion.div variants={fadeUp}>
            <StatsWidget />
          </motion.div>

          <motion.div variants={fadeUp} style={{ marginTop: "28px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#334155" }}>
            <MapPin size={14} /> Melayani seluruh wilayah desa
          </motion.div>
        </motion.section>

        {/* SISI KANAN: FORM CARD */}
        <section style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0", borderLeft: "1px solid rgba(255,255,255,0.05)", paddingLeft: "60px" }}>
          <motion.div initial={{ opacity: 0, x: 30, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.2 }} style={{ width: "100%", maxWidth: "400px", background: "rgba(15,20,30,0.8)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "28px", padding: "36px", boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "200px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }} />
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "120px", height: "60px", background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />

            <div style={{ marginBottom: "28px", position: "relative" }}>
              <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #2563EB, #4F46E5)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", boxShadow: "0 8px 24px rgba(79,70,229,0.35)" }}>
                {isRegister ? <UserPlus size={22} color="white" /> : <Fingerprint size={24} color="white" />}
              </div>
              <h2 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em", margin: 0, marginBottom: "6px" }}>{isRegister ? "Buat Akun" : "Masuk Portal"}</h2>
              <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, margin: 0 }}>{isRegister ? "Lengkapi nomor KTP dan WhatsApp aktif Anda." : "Gunakan NIK atau username untuk akses layanan DigiDesa."}</p>
            </div>

            <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <AnimatePresence>
                {isRegister && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#94A3B8" }}>Nama Lengkap (Sesuai KTP)</label>
                    <div style={{ position: "relative" }}>
                      <UserPlus size={16} color={focused === "nama" ? "#818CF8" : "#334155"} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", transition: "color 0.2s" }} />
                      <input type="text" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} onFocus={() => setFocused("nama")} onBlur={() => setFocused(null)} required placeholder="Contoh: Uzumaki Bayu" style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 42px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", color: "#F1F5F9", fontSize: "14px", outline: "none", transition: "all 0.2s", fontFamily: "inherit" }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#94A3B8" }}>NIK KTP / Username</label>
                <div style={{ position: "relative" }}>
                  <User size={16} color={focused === "nik" ? "#818CF8" : "#334155"} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", transition: "color 0.2s" }} />
                  <input type="text" value={nik} onChange={(e) => setNik(e.target.value)} onFocus={() => setFocused("nik")} onBlur={() => setFocused(null)} required placeholder="Masukkan NIK 16 digit..." style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 42px", background: focused === "nik" ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${focused === "nik" ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: "14px", color: "#F1F5F9", fontSize: "14px", outline: "none", transition: "all 0.2s", fontFamily: "inherit" }} />
                </div>
              </div>

              <AnimatePresence>
                {isRegister && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#94A3B8" }}>No WhatsApp Aktif</label>
                    <div style={{ position: "relative" }}>
                      <Phone size={16} color={focused === "hp" ? "#818CF8" : "#334155"} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", transition: "color 0.2s" }} />
                      <input type="tel" value={noHp} onChange={(e) => setNoHp(e.target.value)} onFocus={() => setFocused("hp")} onBlur={() => setFocused(null)} required placeholder="Contoh: 08xxxxxxxxxx" style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 42px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", color: "#F1F5F9", fontSize: "14px", outline: "none", transition: "all 0.2s", fontFamily: "inherit" }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#94A3B8" }}>Kata Sandi</label>
                  {!isRegister && <button type="button" onClick={() => alert("Pemulihan akun silakan lapor RT setempat.")} style={{ fontSize: "12px", fontWeight: 600, color: "#6366F1", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>Lupa sandi?</button>}
                </div>
                <div style={{ position: "relative" }}>
                  <Lock size={16} color={focused === "password" ? "#818CF8" : "#334155"} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", transition: "color 0.2s" }} />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} required placeholder={isRegister ? "Buat kata sandi aman..." : "Masukkan kata sandi..."} style={{ width: "100%", boxSizing: "border-box", padding: "12px 44px 12px 42px", background: focused === "password" ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${focused === "password" ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: "14px", color: "#F1F5F9", fontSize: "14px", outline: "none", transition: "all 0.2s", fontFamily: "inherit" }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 0, display: "flex", transition: "color 0.2s" }}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>

              {!isRegister && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                  <input type="checkbox" id="remember" style={{ width: "15px", height: "15px", accentColor: "#6366F1", cursor: "pointer" }} />
                  <label htmlFor="remember" style={{ fontSize: "12px", color: "#475569", cursor: "pointer" }}>Ingat perangkat ini selama 30 hari</label>
                </div>
              )}

              <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} style={{ marginTop: "8px", width: "100%", padding: "14px", border: "none", borderRadius: "14px", color: "white", fontSize: "14px", fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", background: isLoading ? "rgba(79,70,229,0.5)" : "linear-gradient(135deg, #3B82F6 0%, #4F46E5 50%, #7C3AED 100%)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", letterSpacing: "-0.01em", boxShadow: isLoading ? "none" : "0 8px 24px rgba(79,70,229,0.3)", transition: "all 0.3s", fontFamily: "inherit" }}>
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Loader2 size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                      {isRegister ? "Mendaftarkan..." : "Memverifikasi Kredensial..."}
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {isRegister ? "Daftar Akun Baru" : "Masuk ke Portal"} <ArrowRight size={16} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "18px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
              <span style={{ fontSize: "12px", color: "#334155" }}>atau</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            </div>

            <motion.button type="button" onClick={toggleMode} whileHover={{ borderColor: "rgba(99,102,241,0.35)", background: "rgba(99,102,241,0.06)" }} style={{ width: "100%", padding: "13px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", color: "#94A3B8", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s", fontFamily: "inherit" }}>
              {isRegister ? "Sudah punya akun? Masuk sekarang" : "Belum punya akun? Daftar sekarang"} <ChevronRight size={14} />
            </motion.button>

            <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#475569" }}><ShieldCheck size={12} color="#4F46E5" /> SSL 256-bit</div>
              <div style={{ width: "1px", height: "10px", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#475569" }}><Lock size={12} color="#4F46E5" /> Terenkripsi</div>
              <div style={{ width: "1px", height: "10px", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#475569" }}><CheckCircle2 size={12} color="#4F46E5" /> Secure BSrE</div>
            </div>
          </motion.div>
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: #475569 !important; font-weight: 500; }
        input:focus { box-shadow: 0 0 0 3px rgba(99,102,241,0.25) !important; }
        * { -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  );
}