import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowLeft,
  LayoutDashboard,
  Files,
  AlertTriangle,
  Users,
  Settings,
  Building2,
  Download,
  Calendar,
  PieChart,
  Loader2,
  Plus,
  ArrowUpRight
} from "lucide-react";

export default function AdminKeuangan() {
  const navigate = useNavigate();
  const [financeData, setFinanceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fungsi Ambil Data Real dari Backend
  const fetchFinanceData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/v1/admin/finance", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Data dari Backend:", res.data);

      if (res.data.success) {
        setFinanceData(res.data.data);
      }
    } catch (error) {
      console.error("Gagal ambil data keuangan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  useEffect(() => {
  const token = localStorage.getItem("token");
  
  // Jika tidak ada token, langsung lempar ke login
  if (!token) {
    navigate("/login"); 
    return;
  }

  fetchFinanceData();
}, []);

  // Format Rupiah (Ditambah Math.abs agar tanda minus bawaan DB hilang, kita atur manual nanti)
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(Math.abs(val) || 0); 
  };

  // Fungsi Hapus Transaksi
  const handleDelete = async (id: number) => {
  if (window.confirm("Yakin ingin menghapus riwayat transaksi ini?")) {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/v1/admin/finance/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh data setelah hapus
      fetchFinanceData();
    } catch (error) {
      alert("Gagal menghapus data");
    }
  }
};

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Memuat Anggaran Desa...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex">
      
      {/* ── SIDEBAR ── */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen z-50 shadow-sm">
        <div className="p-8 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/admin')}>
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
            { n: "Moderasi Lapor", i: AlertTriangle, p: "/admin/laporan" },
            { n: "Data Penduduk", i: Users, p: "/admin/penduduk" },
            { n: "Keuangan Desa", i: BarChart3, p: "/admin/keuangan", active: true },
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
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-h-screen">
        
        {/* HEADER */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">Transparansi Keuangan</h1>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1.5">Pusat Konsolidasi Anggaran Wilayah</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all">
                <Download size={16} /> Export CSV
             </button>
             <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-blue-600 transition-all">
                <Plus size={16} strokeWidth={3} /> Tambah Transaksi
             </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-10 space-y-10 max-w-7xl mx-auto w-full">
          
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Saldo Utama */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-[2.5rem] bg-blue-600 text-white shadow-xl shadow-blue-600/20 flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 opacity-80">Total Saldo Desa</p>
                <h3 className="text-2xl font-black mt-2 tracking-tight">{formatIDR(financeData?.summary?.balance)}</h3>
              </div>
              <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-blue-200">
                <ArrowUpRight size={14} /> Performa Kas Stabil
              </div>
            </motion.div>

            {/* Pemasukan */}
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pemasukan</p>
                  <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><TrendingUp size={18} /></div>
                </div>
                <h3 className="text-2xl font-black mt-2 text-slate-900 tracking-tight">{formatIDR(financeData?.summary?.total_income)}</h3>
              </div>
              <div className="mt-6 text-[11px] font-bold text-emerald-500">Bulan Ini</div>
            </div>

            {/* Pengeluaran */}
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengeluaran</p>
                  <div className="p-2 bg-red-50 text-red-500 rounded-lg"><TrendingDown size={18} /></div>
                </div>
                <h3 className="text-2xl font-black mt-2 text-slate-900 tracking-tight">{formatIDR(financeData?.summary?.total_expense)}</h3>
              </div>
              <div className="mt-6 text-[11px] font-bold text-red-500">Terserap Optimal</div>
            </div>

            {/* Dana Siaga */}
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dana Siaga</p>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Wallet size={18} /></div>
                </div>
                <h3 className="text-2xl font-black mt-2 text-slate-900 tracking-tight">{formatIDR(financeData?.summary?.balance * 0.2)}</h3>
              </div>
              <div className="mt-6 text-[11px] font-bold text-blue-600">Alokasi Darurat</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ── TABEL RIWAYAT KAS ── */}
            <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Log Transaksi Real-time</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest italic text-blue-600">Sinkronisasi TiDB Cloud</p>
                </div>
                <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all"><Calendar size={20} /></button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail Transaksi</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Kategori</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence>
                      {financeData?.transactions.map((t: any) => {
                        // Perbaikan: Pastikan type di-uppercase dulu biar aman pencocokannya
                        const isIncome = t.type?.toUpperCase() === 'INCOME';

                        return (
                          <motion.tr 
                            key={t.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="group hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-10 py-6">
                                <p className="text-sm font-black text-slate-900 leading-none">{t.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase">
                                  {new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </td>
                            <td className="px-10 py-6 text-center">
                                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                  {t.category || 'Lainnya'}
                                </span>
                            </td>
                            <td className={`px-10 py-6 text-[13px] font-black text-right ${isIncome ? 'text-emerald-600' : 'text-red-500'}`}>
                              {/* Tambah tanda +/- secara dinamis */}
                              {isIncome ? '+ ' : '- '} {formatIDR(t.amount)}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── ANALISIS ALOKASI ── */}
            <div className="space-y-8">
                <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm">
                    <h3 className="font-black text-slate-900 mb-8 flex items-center gap-3">
                        <PieChart size={20} className="text-blue-600" strokeWidth={3} /> Alokasi Belanja
                    </h3>
                    <div className="space-y-6">
                        {[
                            { label: "Infrastruktur", val: 45, color: "blue" },
                            { label: "Bantuan Sosial", val: 30, color: "emerald" },
                            { label: "Operasional", val: 25, color: "amber" },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-[11px] font-black mb-2 uppercase tracking-widest">
                                    <span className="text-slate-400">{item.label}</span>
                                    <span className="text-slate-900">{item.val}%</span>
                                </div>
                                <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${item.color === 'blue' ? 'bg-blue-500' : item.color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                      style={{ width: `${item.val}%` }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Target Penyerapan */}
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/40 transition-all" />
                    <h4 className="text-[11px] font-black uppercase tracking-widest mb-2 text-slate-400">Penyerapan Anggaran</h4>
                    <p className="text-4xl font-black tracking-tight leading-none">94.2%</p>
                    <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[94.2%]" />
                    </div>
                    <p className="text-[10px] font-medium mt-4 text-slate-400 italic leading-relaxed">
                      Laporan keuangan ini diperbarui secara otomatis berdasarkan transaksi terakhir di database desa.
                    </p>
                </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}