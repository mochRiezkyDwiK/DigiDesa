import { useState, useEffect } from "react"; // Tambahkan useEffect
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Tambahkan axios
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
} from "lucide-react";

export default function AdminLaporan() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Semua");
  const [laporan, setLaporan] = useState([]); // State untuk data dari backend
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fungsi Ambil Data dari Backend
  const fetchLaporan = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/v1/admin/reports",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
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

  // Tambahkan fungsi ini di dalam function AdminLaporan, sebelum return
  const handleUpdateStatus = async (id: number, currentStatus: string) => {
    let nextStatus = "";

    // Logika rotasi status
    if (currentStatus === "BARU") nextStatus = "PROSES";
    else if (currentStatus === "PROSES") nextStatus = "SELESAI";
    else return; // Kalau sudah selesai, tidak bisa diubah lagi (atau balik ke BARU)

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/api/v1/admin/reports/${id}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        // Refresh data lokal supaya tampilan langsung berubah
        fetchLaporan();
      }
    } catch (error) {
      alert("Gagal memperbarui status");
    }
  };

  // 2. Filter data berdasarkan tab
  const filteredLaporan = laporan.filter((l) => {
    if (tab === "Semua") return true;
    // Sesuaikan casing karena backend pakai uppercase (BARU, PROSES, SELESAI)
    return l.status.toLowerCase() === tab.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex">
      {/* ── SIDEBAR (Tetap Sama) ── */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen z-50 shadow-sm">
        <div
          className="p-8 flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/admin")}
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 tracking-tighter text-xl leading-none">
              ADMIN
            </span>
            <span className="text-[10px] font-black text-blue-600 tracking-[0.3em] mt-1 uppercase">
              DigiDesa
            </span>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-1.5 mt-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">
            Navigasi Utama
          </p>
          {[
            { n: "Overview", i: LayoutDashboard, p: "/admin" },
            { n: "Validasi Surat", i: Files, p: "/admin/validasi" },
            {
              n: "Moderasi Lapor",
              i: AlertTriangle,
              p: "/admin/laporan",
              active: true,
            },
            { n: "Data Penduduk", i: Users, p: "/admin/penduduk" },
            { n: "Keuangan Desa", i: BarChart3, p: "/admin/keuangan" },
            { n: "Pengaturan", i: Settings, p: "/admin/pengaturan" },
          ].map((item) => (
            <button
              key={item.n}
              onClick={() => navigate(item.p)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all ${
                item.active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.i size={18} strokeWidth={item.active ? 3 : 2.5} />
              {item.n}
            </button>
          ))}
        </nav>
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
        </header>

        <div className="p-10 space-y-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm">
              {["Semua", "Baru", "Proses", "Selesai"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-6 py-2.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                    tab === t
                      ? "bg-slate-900 text-white shadow-lg"
                      : "text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600">
              <Filter size={14} /> FILTER PRIORITAS
            </button>
          </div>

          {/* GRID LAPORAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
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
                    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all p-8 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span
                          className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            lapor.priority === "HIGH"
                              ? "bg-red-50 text-red-600 border border-red-100"
                              : "bg-slate-50 text-slate-500 border border-slate-100"
                          }`}
                        >
                          {lapor.priority} Priority
                        </span>
                        <span className="text-[10px] font-bold text-slate-300">
                          LPR-00{lapor.id}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {lapor.title}
                      </h3>

                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-3 text-slate-500">
                          <User size={14} />{" "}
                          <span className="text-[11px] font-bold">
                            {lapor.user?.nama_lengkap || "Warga Anonim"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                          <MapPin size={14} />{" "}
                          <span className="text-[11px] font-bold">
                            {lapor.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                          <Calendar size={14} />{" "}
                          <span className="text-[11px] font-bold">
                            {new Date(lapor.created_at).toLocaleDateString(
                              "id-ID",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {lapor.status === "BARU" && (
                          <Clock className="text-amber-500" size={16} />
                        )}
                        {lapor.status === "PROSES" && (
                          <Activity
                            className="text-blue-500 animate-pulse"
                            size={16}
                          />
                        )}
                        {lapor.status === "SELESAI" && (
                          <CheckCircle2
                            className="text-emerald-500"
                            size={16}
                          />
                        )}
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
                          {lapor.status}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleUpdateStatus(lapor.id, lapor.status)
                        } // Tambahkan ini
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          lapor.status === "SELESAI"
                            ? "bg-emerald-50 text-emerald-500 cursor-not-allowed"
                            : "bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white"
                        }`}
                        disabled={lapor.status === "SELESAI"}
                      >
                        <ChevronRight size={18} strokeWidth={3} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
