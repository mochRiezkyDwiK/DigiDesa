"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  Plus,
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { EASE_SPRING } from "../../constants/animation";
import LayoutWarga from "./layoutWarga"; // Pastikan path sesuai dengan lokasi file Layout Anda

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
  rt: string | null;
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

export default function DashboardWarga() {
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
          const userLocal = JSON.parse(localStorage.getItem("user") || "{}");
          if (userLocal.status && userLocal.status.toUpperCase() === "PENDING") {
            navigate("/onboarding");
            return true;
          }
          return false;
        };

        if (checkAccess()) return;

        // 1. Data Profil
        const profileRes = await fetch("http://localhost:5000/api/v1/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileRes.ok) throw new Error(`Profile API Error: Status ${profileRes.status}`);
        const profileData = await profileRes.json();
        if (profileData.success) setUser(profileData.data);

        // 2. Data Statistik
        try {
          const statsRes = await fetch("http://localhost:5000/api/v1/dashboard/stats", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (statsRes.ok) {
            const statsData = await statsRes.json();
            if (statsData.success) {
              // Hubungkan ke state jika struktur payload dari backend sudah sesuai
              setStats({
                suratAktif: statsData.data.suratAktif || 0,
                laporan: statsData.data.laporan || 0,
                poinWarga: statsData.data.poinWarga || 0,
              });
            }
          }
        } catch (err) {
          console.error("Gagal memuat spesifik data statistik:", err);
        }
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFEFF] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Sinkronisasi Data Desa...
          </p>
        </div>
      </div>
    );
  }

  return (
    <LayoutWarga user={user}>
      <div className="space-y-10">
        
        {/* BANNER WELCOME */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={FADE_UP}
          custom={0}
          className="relative p-10 bg-white rounded-[3rem] border border-slate-100 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.05)] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <span className="px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                {user?.is_verified
                  ? "Akun Terverifikasi Sistem ✓"
                  : "Menunggu Verifikasi Wilayah ⚠"}
              </span>
              <h2 className="text-4xl font-bold text-slate-900 mt-6 tracking-tighter leading-none">
                Halo, {user?.nama_lengkap ? user.nama_lengkap.split(" ")[0] : "Warga"}! <br /> Layanan Publik{" "}
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
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl text-sm shadow-xl shadow-blue-500/25 hover:bg-blue-500 transition-all flex items-center gap-3"
            >
              <Plus size={20} strokeWidth={3} /> Ajukan Surat
            </motion.button>
          </div>
        </motion.section>

        {/* GRID WIDGET STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Surat Hack",
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
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
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

        {/* STATUS DOKUMEN TABLE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            custom={4}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Status Dokumen
              </h3>
              <button
                onClick={() => navigate("/layanan")}
                className="text-[13px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Semua Berkas <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid gap-5">
              {suratList.length === 0 ? (
                <div className="p-8 bg-white border border-dashed border-slate-200 text-center rounded-[2.5rem] text-xs font-bold text-slate-400">
                  Belum ada pengajuan surat aktif.
                </div>
              ) : (
                suratList.map((surat) => (
                  <div
                    key={surat.id}
                    className="p-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-800">
                          {surat.tipe}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Ref: {surat.id} • {surat.tgl}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-xl text-[11px] font-bold ${
                          surat.progress === 100 
                            ? "bg-emerald-50 text-emerald-600" 
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {surat.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </LayoutWarga>
  );
}