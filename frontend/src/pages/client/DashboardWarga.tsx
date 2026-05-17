import { useState, useEffect } from "react";
import WargaOnboarding from "../../components/WargaOnboarding";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; // ── BARU: Import Axios untuk sinkronisasi database ──
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
  TrendingDown,
  Activity,
  ShieldCheck,
  CreditCard,
  LogOut,
  Sparkles,
  ArrowUpRight,
  Zap
} from "lucide-react";
import { EASE_SPRING } from "../../constants/animation";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: EASE_SPRING }
  })
};

// ─── DUMMY DANA TRANSPARANSI KAS KESUKAANMU ───────────────────────────────────
const KAS_TRANSPARANSI = [
  { id: 1, tgl: "15 Mei 2026", ket: "Perbaikan Penerangan Jalan RT 01", tipe: "PENGELUARAN", jumlah: "1.450.000" },
  { id: 2, tgl: "12 Mei 2026", ket: "Pemasukan Iuran Kebersihan & Keamanan", tipe: "PEMASUKAN", jumlah: "4.200.000" },
  { id: 3, tgl: "01 Mei 2026", ket: "Fogging Massal Antisipasi DBD Wilayah", tipe: "PENGELUARAN", jumlah: "850.000" },
];

export default function DashboardWarga() {
  const [activeTab, setActiveTab] = useState("Ringkasan");
  const navigate = useNavigate(); 
  
  // ── BARU: State Dinamis Penampung Data Riwayat Surat dari Database ──
  const [suratList, setSuratList] = useState<any[]>([]);

  // ── SINKRONISASI SESSION USER & GATE PEMBATAS ──
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  const userSession = userJson ? JSON.parse(userJson) : null;
  const [statusAkun, setStatusAkun] = useState(userSession?.status_akun || "INCOMPLETE");

  // ── BARU: Fetching Riwayat Surat Menggunakan useEffect ──
  useEffect(() => {
    const fetchRiwayatSurat = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/surat/riwayat", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setSuratList(response.data.data);
        }
      } catch (error) {
        console.error("GAGAL FETCHING SURAT DI DASHBOARD:", error);
      }
    };

    if (statusAkun === "VERIFIED_TETAP" || statusAkun === "VERIFIED_PENDATANG") {
      fetchRiwayatSurat();
    }
  }, [statusAkun, token]);

  // GATING LOGIC: Jika belum verified, kunci total dashboard & oper ke Onboarding
  if (statusAkun !== "VERIFIED_TETAP" && statusAkun !== "VERIFIED_PENDATANG") {
    return (
      <WargaOnboarding 
        userStatus={statusAkun} 
        onVerified={() => {
          const updatedUser = { ...userSession, status_akun: "VERIFIED_TETAP" };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setStatusAkun("VERIFIED_TETAP");
        }} 
      />
    );
  }

  // ── BARU: Otomatisasi Perhitungan Anggota Quick Stats Berdasarkan Data Asli DB ──
  const jumlahSuratAktif = suratList.filter(s => s.status === "PENDING" || s.status === "PROSES").length;

  const QUICK_STATS = [
    { label: "Surat Aktif", value: String(jumlahSuratAktif), icon: FileText, trend: "Real-time", color: "blue", path: "/layanan" },
    { label: "Laporan", value: "0", icon: MessageSquare, trend: "Clear", color: "indigo", path: "/lapor" },
    { label: "Poin Warga", value: "1.250", icon: Sparkles, trend: "Top 5%", color: "violet", path: "#" },
  ];

  // ── BARU: Fungsi Rumus Pembagi Persentase Progress Bar di Frontend ──
  const dapatkanProgressLayanan = (status: string) => {
    if (status === "PENDING") return 30;
    if (status === "PROSES") return 65;
    return 100; // Untuk status 'SELESAI' atau 'REJECTED'
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] font-sans antialiased flex w-full">
      
      {/* ── 1. SIDEBAR NAVIGASI WARGA (KIRI) ── */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-100 flex-col sticky top-0 h-screen z-40 shadow-sm flex-shrink-0">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 tracking-tighter text-xl leading-none">WARGA</span>
            <span className="text-[10px] font-black text-blue-600 tracking-[0.3em] mt-1 uppercase">DigiDesa</span>
          </div>
        </div>

        {/* Menu Navigasi Mix: Tab Internal & Link External Halaman Lama */}
        <nav className="flex-1 px-6 space-y-1.5 mt-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Layanan Warga</p>
          {[
            { n: "Ringkasan Dashboard", i: LayoutDashboard, p: "/dashboard-warga", isTab: true, tabTarget: "Ringkasan" },
            { n: "Transparansi Kas", i: CreditCard, p: "/dashboard-warga", isTab: true, tabTarget: "Transparansi" },
            { n: "Ajukan E-Surat", i: FileText, p: "/layanan", isTab: false },
            { n: "Lapor Keluhan", i: MessageSquare, p: "/lapor", isTab: false },
            { n: "Profil Saya", i: User, p: "/profile", isTab: false },
          ].map((item) => {
            const isActive = item.isTab ? activeTab === item.tabTarget : false;
            return (
              <button
                key={item.n}
                onClick={() => {
                  if (item.isTab) {
                    setActiveTab(item.tabTarget!);
                  } else {
                    navigate(item.p); 
                  }
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all ${
                  isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.i size={18} strokeWidth={isActive ? 3 : 2.5} />
                {item.n}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={() => { localStorage.clear(); navigate("/login"); }}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl text-[13px] font-bold transition-all"
          >
            <LogOut size={18} strokeWidth={2.5} /> Keluar Aplikasi
          </button>
        </div>
      </aside>

      {/* ── 2. AREA UTAMA CONTEN (KANAN) ── */}
      <main className="flex-1 overflow-y-auto relative h-screen flex flex-col">
        <header className="h-24 bg-white/40 backdrop-blur-xl border-b border-slate-100/50 sticky top-0 z-40 px-8 sm:px-12 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
              <input type="text" placeholder="Cari layanan desa..." className="bg-slate-100/50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-xs font-medium focus:ring-2 focus:ring-blue-500/10 w-64 transition-all" />
            </div>
            <button className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
              <Bell size={20} strokeWidth={2} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-black text-slate-900 leading-none">{userSession?.nama_lengkap || "User Warga"}</p>
                <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-wider">{statusAkun === "VERIFIED_TETAP" ? "Warga Tetap" : "Warga Pendatang"}</p>
              </div>
              <img className="w-11 h-11 rounded-2xl border-2 border-white shadow-md ring-4 ring-slate-50" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userSession?.username || 'Budi'}`} alt="Avatar" />
            </div>
          </div>
        </header>

        {/* CONTAINER DINAMIS AREA SWITCH TAB */}
        <div className="p-8 sm:p-12 space-y-10 max-w-7xl mx-auto w-full flex-1">
          <AnimatePresence mode="wait">
            
            {/* KONDISI TAB 1: RINGKASAN DATA DATABASE UTAMANYA */}
            {activeTab === "Ringkasan" && (
              <motion.div key="bento" initial="hidden" animate="visible" exit="hidden" variants={FADE_UP} className="space-y-10">
                {/* WELCOME SECTION */}
                <section className="relative p-10 bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(15,23,42,0.3)]">
                  <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-blue-600/30 to-transparent" />
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                      <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Automasi Desa Digital</span>
                      <h2 className="text-4xl font-black text-white mt-6 tracking-tighter leading-none">Layanan Publik <br/> <span className="text-blue-500">Serba Instan.</span></h2>
                      <p className="text-slate-400 text-sm max-w-sm mt-4 leading-relaxed font-medium">RT dan RW kini otomatis mendapatkan laporan tembusan. Anda tidak perlu lagi meminta validasi fisik secara manual.</p>
                    </div>
                    <div className="flex gap-4">
                      <motion.button onClick={() => navigate('/layanan')} whileHover={{ y: -5 }} className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl text-sm shadow-xl shadow-blue-500/25 hover:bg-blue-500 transition-all flex items-center gap-3">
                        <Plus size={20} strokeWidth={3} /> Ajukan Surat
                      </motion.button>
                    </div>
                  </div>
                </section>

                {/* QUICK STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {QUICK_STATS.map((s, i) => (
                    <motion.div key={s.label} whileHover={{ y: -5, transition: { duration: 0.2 } }} onClick={() => { if(s.path !== "#") navigate(s.path) }} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.03)] flex items-center gap-6 group cursor-pointer">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 transition-colors"><s.icon className="text-slate-400 group-hover:text-blue-600 transition-colors" size={26} strokeWidth={2.5} /></div>
                      <div className="flex-1">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight">{s.value}</h3>
                      </div>
                      <ArrowUpRight size={20} className="text-slate-200 group-hover:text-blue-500" />
                    </motion.div>
                  ))}
                </div>

                {/* MAIN BENTO LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  
                  {/* LEFT: PROGRESS SURAT DINAMIS MYSQL */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Status Dokumen</h3>
                      <button onClick={() => navigate('/layanan')} className="text-[13px] font-black text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">Semua Berkas <ChevronRight size={16} strokeWidth={3}/></button>
                    </div>
                    
                    <div className="grid gap-5">
                      {suratList.length === 0 ? (
                        <div className="p-10 text-center bg-white rounded-[2.5rem] border border-slate-100 text-sm font-bold text-slate-400">Belum ada riwayat pengajuan surat kependudukan.</div>
                      ) : (
                        suratList.map((surat) => (
                          <div key={surat.id} className="p-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                              <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-500 text-slate-400 group-hover:text-white"><FileText size={24} /></div>
                                <div>
                                  <h4 className="font-black text-slate-800 text-base tracking-tight">
                                    {surat.jenis_surat === "SKD" && "Surat Keterangan Domisili (SKD)"}
                                    {surat.jenis_surat === "SKU" && "Surat Keterangan Usaha (SKU)"}
                                    {surat.jenis_surat === "SKTM" && "Surat Keterangan Tidak Mampu (SKTM)"}
                                  </h4>
                                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    Ref: {surat.no_surat || "No Belum Terbit"} • {new Date(surat.tgl_diajukan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </p>
                                  {surat.status === "REJECTED" && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1">Alasan Tolak: {surat.alasan_ditolak}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-8">
                                <div className="text-right hidden sm:block">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Progress Sistem</p>
                                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }} 
                                      animate={{ width: `${dapatkanProgressLayanan(surat.status)}%` }} 
                                      className={`h-full rounded-full ${surat.status === "REJECTED" ? "bg-red-500" : "bg-blue-600"}`} 
                                    />
                                  </div>
                                </div>
                                <span className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-tight ${
                                  surat.status === "SELESAI" ? "bg-emerald-50 text-emerald-600" : 
                                  surat.status === "REJECTED" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                }`}>
                                  {surat.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* RIGHT: WARTA WIDGET */}
                  <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative shadow-2xl shadow-blue-900/20 overflow-hidden h-fit">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[60px] opacity-30" />
                    <h3 className="text-xl font-black mb-8 tracking-tight flex items-center gap-3"><Activity size={22} className="text-blue-400" strokeWidth={3} /> Warta Desa</h3>
                    <div className="space-y-8">
                      <div className="relative pl-6 border-l-2 border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group">
                        <span className="text-[10px] font-black text-blue-400 tracking-[0.2em]">INFO</span>
                        <h4 className="text-sm font-black mt-1 group-hover:text-blue-300 transition-colors">Pembangunan Taman Bermain</h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Lokasi Blok C, mulai minggu depan.</p>
                      </div>
                      <div className="relative pl-6 border-l-2 border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group">
                        <span className="text-[10px] font-black text-blue-400 tracking-[0.2em]">TECH</span>
                        <h4 className="text-sm font-black mt-1 group-hover:text-blue-300 transition-colors">Update Sistem E-Iuran</h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Pembayaran via QRIS kini tersedia.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* KONDISI TAB 2: INTERACTIVE READ-ONLY KAS DESA */}
            {activeTab === "Transparansi" && (
              <motion.div key="transparansi" initial="hidden" animate="visible" exit="hidden" variants={FADE_UP} className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Transparansi Keuangan Wilayah</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-1">Laporan Arus Kas Terbuka Real-time Bagi Masyarakat</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-emerald-600 rounded-[2.5rem] text-white shadow-lg shadow-emerald-600/10 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">Total Alokasi Pemasukan</p>
                      <h3 className="text-3xl font-black mt-2 tracking-tight">Rp 12.450.000</h3>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><TrendingUp size={24} /></div>
                  </div>
                  <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-lg flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Realisasi Pengeluaran</p>
                      <h3 className="text-3xl font-black mt-2 tracking-tight">Rp 4.120.000</h3>
                    </div>
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center"><TrendingDown size={24} /></div>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="px-8 py-5">Tanggal Nota</th>
                        <th className="px-8 py-5">Keterangan Aktivitas</th>
                        <th className="px-8 py-5">Jenis Aliran</th>
                        <th className="px-8 py-5 text-right">Nominal Anggaran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                      {KAS_TRANSPARANSI.map((kas) => (
                        <tr key={kas.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-8 py-5 text-slate-400 font-medium">{kas.tgl}</td>
                          <td className="px-8 py-5 text-slate-900 font-black">{kas.ket}</td>
                          <td className="px-8 py-5"><span className={`px-2 py-0.5 rounded text-[9px] font-black ${kas.tipe === 'PEMASUKAN' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{kas.tipe}</span></td>
                          <td className={`px-8 py-5 text-right font-black text-base ${kas.tipe === 'PEMASUKAN' ? 'text-emerald-600' : 'text-slate-900'}`}>{kas.tipe === 'PEMASUKAN' ? '+' : '-'} Rp {kas.jumlah}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}