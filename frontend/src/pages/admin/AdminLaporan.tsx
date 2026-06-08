import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ChevronRight,
  Filter,
  Activity,
  LayoutDashboard,
  Files,
  Users,
  BarChart3,
  Settings,
  Building2,
  Loader2,
  LogOut,
} from "lucide-react";
import DetailLaporanModal from "../../components/DetailLaporanModal";

interface LaporanData {
  id: number;
  title: string;
  description: string;
  location: string;
  priority: string;
  status: string;
  bukti_visual: string | null;
  catatan_petugas: string | null;
  created_at: string;
  user?: { nama_lengkap?: string };
  petugas?: { id: number; nama_lengkap: string } | null;
}

export default function AdminLaporan() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Semua");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | "LOW" | "MEDIUM" | "HIGH">("ALL");
  const [laporan, setLaporan] = useState<LaporanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLaporan, setSelectedLaporan] = useState<LaporanData | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchLaporan = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/v1/admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setLaporan(res.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const filteredLaporan = laporan.filter((l) => {
    const matchStatus =
      tab === "Semua" || l.status?.toLowerCase() === tab.toLowerCase();

    const priorityValue = (l.priority || "").toUpperCase();
    const normalizedPriority =
      priorityValue === "EASY" || priorityValue === "LOW" || priorityValue === "RENDAH"
        ? "LOW"
        : priorityValue === "MEDIUM" || priorityValue === "SEDANG"
          ? "MEDIUM"
          : priorityValue === "HIGH" || priorityValue === "TINGGI"
            ? "HIGH"
            : priorityValue;

    const matchPriority = priorityFilter === "ALL" || normalizedPriority === priorityFilter;

    return matchStatus && matchPriority;
  });

  const getPriorityCount = (priority: "LOW" | "MEDIUM" | "HIGH") => {
    return laporan.filter((l) => {
      const priorityValue = (l.priority || "").toUpperCase();
      if (priority === "LOW") {
        return priorityValue === "LOW" || priorityValue === "EASY" || priorityValue === "RENDAH";
      }
      if (priority === "MEDIUM") {
        return priorityValue === "MEDIUM" || priorityValue === "SEDANG";
      }
      return priorityValue === "HIGH" || priorityValue === "TINGGI";
    }).length;
  };

  const getStatusIcon = (status: string) => {
    if (status === "BARU") return <Clock className="text-amber-500" size={16} />;
    if (status === "DITUGASKAN") return <Activity className="text-blue-500" size={16} />;
    if (status === "PROSES") return <Activity className="text-violet-500 animate-pulse" size={16} />;
    if (status === "SELESAI") return <CheckCircle2 className="text-emerald-500" size={16} />;
    return null;
  };

  const getStatusStyle = (status: string) => {
    if (status === "BARU") return "bg-amber-50 text-amber-600 border-amber-100";
    if (status === "DITUGASKAN") return "bg-blue-50 text-blue-600 border-blue-100";
    if (status === "PROSES") return "bg-violet-50 text-violet-600 border-violet-100";
    if (status === "SELESAI") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    return "bg-slate-50 text-slate-500 border-slate-100";
  };


  const getPriorityLabel = (priority: string) => {
    const value = (priority || "").toUpperCase();
    if (value === "HIGH" || value === "TINGGI") return "High Priority";
    if (value === "MEDIUM" || value === "SEDANG") return "Medium Priority";
    if (value === "LOW" || value === "EASY" || value === "RENDAH") return "Low Priority";
    return `${priority || "Normal"} Priority`;
  };

  const getPriorityStyle = (priority: string) => {
    const value = (priority || "").toUpperCase();
    if (value === "HIGH" || value === "TINGGI") {
      return "bg-red-50 text-red-600 border-red-100";
    }
    if (value === "MEDIUM" || value === "SEDANG") {
      return "bg-amber-50 text-amber-600 border-amber-100";
    }
    if (value === "LOW" || value === "EASY" || value === "RENDAH") {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }
    return "bg-slate-50 text-slate-500 border-slate-100";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex">
      {/* ── SIDEBAR ── */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen z-50 shadow-sm">
        <div
          className="p-8 flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/admin")}
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 tracking-tighter text-xl leading-none">ADMIN</span>
            <span className="text-[10px] font-black text-blue-600 tracking-[0.3em] mt-1 uppercase">DigiDesa</span>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-1.5 mt-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Navigasi Utama</p>
          {[
            { n: "Overview", i: LayoutDashboard, p: "/admin" },
            { n: "Validasi Surat", i: Files, p: "/admin/validasi" },
            { n: "Moderasi Lapor", i: AlertTriangle, p: "/admin/laporan", active: true },
            { n: "Data Penduduk", i: Users, p: "/admin/penduduk" },
            { n: "Keuangan Desa", i: BarChart3, p: "/admin/keuangan" },
            { n: "Pengaturan", i: Settings, p: "/admin/pengaturan" },
          ].map((item) => (
            <button
              key={item.n}
              onClick={() => navigate(item.p)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all ${
                item.active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.i size={18} strokeWidth={item.active ? 3 : 2.5} />
              {item.n}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 mt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-bold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} strokeWidth={2.5} />
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                Moderasi Laporan Warga
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                Pusat Resolusi Masalah Wilayah
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
            <span className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs">
              {filteredLaporan.length} laporan
            </span>
          </div>
        </header>

        <div className="p-10 space-y-8 max-w-7xl mx-auto w-full">
          {/* Filter Tab */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm">
              {["Semua", "Baru", "Ditugaskan", "Proses", "Selesai"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                    tab === t ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm">
              <Filter size={14} className="ml-3 text-slate-400" />
              {[
                { key: "ALL", label: "Semua", count: laporan.length },
                { key: "LOW", label: "Low", count: getPriorityCount("LOW") },
                { key: "MEDIUM", label: "Medium", count: getPriorityCount("MEDIUM") },
                { key: "HIGH", label: "High", count: getPriorityCount("HIGH") },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setPriorityFilter(item.key as "ALL" | "LOW" | "MEDIUM" | "HIGH")}
                  className={`px-4 py-2.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                    priorityFilter === item.key
                      ? item.key === "HIGH"
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                        : item.key === "MEDIUM"
                          ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                          : item.key === "LOW"
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                            : "bg-slate-900 text-white shadow-lg"
                      : "text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {item.label} ({item.count})
                </button>
              ))}
            </div>
          </div>

          {/* GRID LAPORAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              </div>
            ) : filteredLaporan.length === 0 ? (
              <div className="col-span-full py-20 text-center text-sm font-bold text-slate-400">
                Tidak ada laporan ditemukan.
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredLaporan.map((lapor) => (
                  <motion.div
                    key={lapor.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSelectedLaporan(lapor)}
                    className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all p-7 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <span
                          className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                            getPriorityStyle(lapor.priority)
                          }`}
                        >
                          {getPriorityLabel(lapor.priority)}
                        </span>
                        <span className="text-[10px] font-bold text-slate-300">LPR-00{lapor.id}</span>
                      </div>

                      <h3 className="text-base font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {lapor.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">
                        {lapor.description}
                      </p>

                      <div className="mt-5 space-y-2">
                        <div className="flex items-center gap-2 text-slate-400">
                          <User size={12} />
                          <span className="text-[11px] font-bold">{lapor.user?.nama_lengkap || "Warga Anonim"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin size={12} />
                          <span className="text-[11px] font-bold">{lapor.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar size={12} />
                          <span className="text-[11px] font-bold">
                            {new Date(lapor.created_at).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(lapor.status)}
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(lapor.status)}`}>
                          {lapor.status}
                        </span>
                      </div>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ChevronRight size={16} strokeWidth={3} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      {/* ── DETAIL MODAL ── */}
      <DetailLaporanModal
        laporan={selectedLaporan}
        onClose={() => setSelectedLaporan(null)}
        onUpdated={() => {
          fetchLaporan();
          // Update local selected laporan with new status so timeline refreshes in real-time
          if (selectedLaporan) {
            setSelectedLaporan((prev) =>
              prev ? { ...prev } : null
            );
          }
        }}
      />
    </div>
  );
}
