import { useState, type SyntheticEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { EASE_SPRING, FADE_UP } from "../constants/animation";
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
  Phone,
  UserPlus
} from "lucide-react";

const API_URL = "http://localhost:5000/api/v1/auth";
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: EASE_SPRING }
  })
};

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nik: "",
    nama_lengkap: "",
    username: "", 
    password: "",
    no_hp: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = { ...formData, [e.target.id]: e.target.value };
    console.log("handleChange ->", e.target.id, e.target.value, next);
    setFormData(next);
  };

  const copy = isRegister
    ? {
        heroTitle: "Bergabung dengan Komunitas Digital.",
        heroDesc: "Daftarkan diri Anda untuk akses layanan surat menyurat dan laporan warga secara instan.",
        title: "Buat Akun",
        subtitle: "Lengkapi data diri Anda di bawah ini.",
        submitIdle: "Daftar Akun",
        submitLoading: "Mendaftarkan...",
        switchPrompt: "Sudah punya akun?",
        switchAction: "Masuk Sekarang",
      }
    : {
        heroTitle: "Portal Layanan Desa Terpadu.",
        heroDesc: "Masuk untuk mengelola administrasi, pengumuman, dan laporan warga secara real-time.",
        title: "Selamat Datang",
        subtitle: "Silakan masuk dengan kredensial Anda.",
        submitIdle: "Masuk ke Portal",
        submitLoading: "Menyambungkan...",
        switchPrompt: "Belum punya akun?",
        switchAction: "Daftar Sekarang",
      };

  const handleAuth = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("handleAuth start -> isRegister:", isRegister, "formData:", formData);

      if (isRegister) {
        console.log("About to POST /register with:", {
          nik: formData.nik,
          nama_lengkap: formData.nama_lengkap,
          username: formData.nik,
          password: formData.password,
          no_hp: formData.no_hp,
        });

        const res = await axios.post(`${API_URL}/register`, {
          nik: formData.nik,
          nama_lengkap: formData.nama_lengkap,
          username: formData.nik,
          password: formData.password,
          no_hp: formData.no_hp,
        });

        console.log("Response Register:", res?.data);

        if (res?.data?.success) {
          setIsRegister(false);
          alert("Pendaftaran berhasil! Silakan masuk.");
        } else {
          console.warn("Register returned success:false ->", res?.data);
          alert(res?.data?.message || "Pendaftaran gagal, silakan periksa data Anda.");
        }
      } else {
        console.log("About to POST /login with:", { username: formData.nik, password: formData.password });

        const res = await axios.post(`${API_URL}/login`, {
          username: formData.nik,
          password: formData.password,
        });

        console.log("Response Login:", res?.data);

        if (res?.data?.success) {
          const { token, user } = res.data;

          localStorage.clear();
          localStorage.setItem("token", token);
          localStorage.setItem("role", user?.role || "");

          alert(`Selamat Datang, ${user?.nama_lengkap || "User"}`);

          const userRole = (user?.role || "").toUpperCase().trim();
          console.log("ROLE DARI DATABASE:", userRole);

          if (userRole === "ADMIN") {
            navigate("/admin/keuangan");
          } else {
            navigate("/dashboard-warga");
          }
        } else {
          console.warn("Login returned success:false ->", res?.data);
          alert(res?.data?.message || "Kredensial tidak valid. Silakan coba lagi.");
        }
      }
    } catch (error: any) {
      console.error("API Error Caught:", error);
      console.error("error.response:", error?.response);
      alert(error?.response?.data?.message || "Gagal menyambung ke server. Periksa koneksi backend.");
    } finally {
      setIsLoading(false);
      console.log("handleAuth finished, isLoading set to false");
    }
  };

  const handleForgotPassword = () => {
    alert("Fitur lupa sandi belum tersedia.");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden font-sans antialiased">
      
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

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE_SPRING }}
        className="relative w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white ring-1 ring-slate-900/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden"
      >
        
        <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-[-20%] right-[-20%] w-96 h-96 border-[40px] border-white rounded-full" />
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
            <motion.h2 key={isRegister ? "reg-h2" : "log-h2"} initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} className="text-4xl font-extrabold text-white leading-tight mb-6">
              {copy.heroTitle}
            </motion.h2>
            <motion.p key={isRegister ? "reg-p" : "log-p"} initial={{opacity:0}} animate={{opacity:1}} className="text-blue-100/70 text-lg font-medium leading-relaxed max-w-xs">
              {copy.heroDesc}
            </motion.p>
          </div>

          <motion.div custom={4} variants={FADE_UP} initial="hidden" animate="visible" className="flex items-center gap-4 py-4 px-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl w-fit">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-white/90 tracking-wide uppercase">Enkripsi Data Standar Nasional</span>
          </motion.div>
        </div>

        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white/60">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isRegister ? "register" : "login"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-10">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {copy.title} <span className="text-blue-600">.</span>
                </h3>
                <p className="text-slate-500 font-medium mt-2">
                  {copy.subtitle}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-5">
                {isRegister && (
                  <div className="space-y-2">
                    <label htmlFor="nama_lengkap" className="text-xs font-extrabold text-slate-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserPlus className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input id="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} type="text" className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm" placeholder="Nama Sesuai KTP" required />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="nik" className="text-xs font-extrabold text-slate-500 uppercase tracking-widest ml-1">NIK</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input id="nik" value={formData.nik} onChange={handleChange} type="text" className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm" placeholder="Masukkan NIK Anda" required />
                  </div>
                </div>

                {isRegister && (
                  <div className="space-y-2">
                    <label htmlFor="no_hp" className="text-xs font-extrabold text-slate-500 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input id="no_hp" value={formData.no_hp} onChange={handleChange} type="tel" className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm" placeholder="08xx xxxx xxxx" required />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label htmlFor="password" className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Kata Sandi</label>
                    {!isRegister && (
                      <button type="button" onClick={handleForgotPassword} className="text-[11px] font-bold text-blue-600">
                        Lupa sandi?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input 
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"} 
                      className="block w-full pl-11 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 py-4 mt-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all disabled:opacity-70"
                >
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> {copy.submitLoading}</>
                  ) : (
                    <>{copy.submitIdle} <ArrowRight className="w-5 h-5" /></>
                  )}
                </motion.button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm font-medium text-slate-500">
                  {copy.switchPrompt}{" "}
                  <button 
                    onClick={() => setIsRegister(!isRegister)} 
                    className="text-blue-600 font-bold hover:underline ml-1"
                  >
                    {copy.switchAction}
                  </button>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}