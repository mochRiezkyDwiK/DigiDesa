import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  User,
  Bell,
  Search,
  Plus,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Activity,
  ShieldCheck,
  CreditCard,
  LogOut,
  Sparkles,
  CalendarDays,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { EASE_SPRING } from "../../constants/animation";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: EASE_SPRING },
  }),
};

interface UserProfile {
  nama_lengkap: string;
  nik: string;
  rw: string | null;
  is_verified: boolean;
}

interface DashboardStats {
  suratAktif: number;
  laporan: number;
  poinWarga: number;
}

interface SuratItem {
  id: string;
  tipe: string;
  status: string;
  tgl: string;
  progress: number;
}
// ─── DATA STATIS ───────────────────────────────────────────────────────────────

const QUICK_STATS = [];

export default function DashboardWarga() {
  const [activeTab, setActiveTab] = useState("Ringkasan");
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    suratAktif: 0,
    laporan: 0,
    poinWarga: 0,
  });
  const [suratList, setSuratList] = useState<SuratItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const checkAccess = () => {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          console.log("Status dari LocalStorage di Dashboard:", user.status);
          if (user.status && user.status.toUpperCase() === "pending") {
            console.log("Terdeteksi PENDING, mengarahkan ke onboarding...");
            navigate("/onboarding");
            return true;
          }

          const isPending = checkAccess();
          if (isPending) {
            return;
          }
        };

        // 1. Ambil Data Profil
        const profileRes = await fetch("http://localhost:5000/api/v1/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileRes.ok)
          throw new Error(`Profile API Error: Status ${profileRes.status}`);
        const profileData = await profileRes.json();
        if (profileData.success) setUser(profileData.data);

        // 2. Ambil Data Statistik (Gunakan try-catch internal agar jika stats error, halaman tidak blank)
        try {
          const statsRes = await fetch(
            "http://localhost:5000/api/v1/dashboard/stats",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (statsRes.ok) {
            const statsData = await statsRes.json();
            if (statsData.success) {
              // Jika Anda nanti menyimpan data stats ke state, petakan di sini.
              // Contoh: setStats(statsData.data);
            }
          } else {
            console.warn(
              `Statistik API mengembalikan status ${statsRes.status}`,
            );
          }
        } catch (err) {
          console.error("Gagal memuat spesifik data statistik:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFEFF] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Sinkronisasi Data Desa...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FDFEFF] font-sans overflow-hidden">
      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto relative h-screen">
        <header className="h-24 bg-white/40 backdrop-blur-xl border-b border-slate-100/50 sticky top-0 z-40 px-8 sm:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4 w-full justify-between sm:justify-start">
            <div className="hidden sm:block relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari layanan desa..."
                className="bg-slate-100/50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-xs font-medium focus:ring-2 focus:ring-blue-500/10 w-64 transition-all"
              />
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <button className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                <Bell size={20} strokeWidth={2} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="text-right hidden sm:block">
                  <p className="text-[13px] font-black text-slate-900 leading-none">
                    {user?.nama_lengkap}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">
                    RT {user?.rt || "-"} / RW {user?.rw || "-"}
                  </p>
                </div>
                <img
                  className="w-11 h-11 rounded-2xl border-2 border-white shadow-md ring-4 ring-slate-50 cursor-pointer"
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.nama_lengkap}`}
                  alt="Avatar"
                  onClick={handleLogout}
                  title="Klik untuk Logout"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 sm:p-12 space-y-10 max-w-7xl mx-auto">
          <motion.section
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            custom={0}
            className="relative p-10 bg-white rounded-[3rem] border border-slate-100 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.05)]"
          >
            <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-blue-600/10 to-transparent" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <span className="px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                  {user?.is_verified
                    ? "Akun Terverifikasi Sistem ✓"
                    : "Menunggu Verifikasi Wilayah ⚠"}
                </span>
                <h2 className="text-4xl font-black text-slate-900 mt-6 tracking-tighter leading-none">
                  Halo, {user?.nama_lengkap.split(" ")[0]}! <br /> Layanan Publik{" "}
                  <span className="text-blue-600">Serba Instan.</span>
                </h2>
                <p className="text-slate-500 text-sm max-w-sm mt-4 leading-relaxed font-medium">
                  {user?.is_verified
                    ? "Sistem Anda aktif. RT dan RW mendapatkan laporan tembusan otomatis."
                    : "Lengkapi data wilayah atau hubungi RT untuk verifikasi."}
                </p>
              </div>
              <motion.button
                onClick={() => navigate("/layanan")}
                whileHover={{ y: -5 }}
                className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl text-sm shadow-xl shadow-blue-500/25 hover:bg-blue-500 transition-all flex items-center gap-3"
              >
                <Plus size={20} strokeWidth={3} /> Ajukan Surat
              </motion.button>
            </div>
          </motion.section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Surat Aktif",
                value: stats.suratAktif,
                icon: FileText,
                path: "/layanan",
              },
              {
                label: "Laporan",
                value: stats.laporan,
                icon: MessageSquare,
                path: "/lapor",
              },
              {
                label: "Poin Warga",
                value: stats.poinWarga,
                icon: Sparkles,
                path: "#",
              },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial="hidden"
                animate="visible"
                variants={FADE_UP}
                custom={i + 1}
                whileHover={{ y: -5 }}
                onClick={() => {
                  if (s.path !== "#") navigate(s.path);
                }}
                className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <s.icon
                    className="text-slate-400 group-hover:text-blue-600"
                    size={26}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {s.label}
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                    {s.value}
                  </h3>
                </div>
                <ArrowUpRight
                  size={20}
                  className="text-slate-200 group-hover:text-blue-500"
                />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              custom={4}
              className="lg:col-span-2 space-y-6"
            >
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Status Dokumen
                </h3>
                <button
                  onClick={() => navigate("/layanan")}
                  className="text-[13px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  Semua Berkas <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid gap-5">
                {suratList.map((surat) => (
                  <div
                    key={surat.id}
                    className="p-7 bg-white rounded-[2.5rem] border border-slate-100"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-black text-slate-800">
                          {surat.tipe}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Ref: {surat.id} • {surat.tgl}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-xl text-[11px] font-black ${surat.progress === 100 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                      >
                        {surat.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            {/* Widget lainnya tetap sama... */}
          </div>
        </div>
      </main>
    </div>
  );
}
