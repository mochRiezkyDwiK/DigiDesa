import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  ChevronRight,
  ArrowUpRight,
  PieChart
} from "lucide-react";

// ─── DUMMY DATA KEUANGAN ─────────────────────────────────────────────────────

const STATS_KEUANGAN = [
  { label: "Total Saldo Desa", value: "Rp 1.280.000.000", trend: "+12%", type: "main" },
  { label: "Pemasukan (Bulan Ini)", value: "Rp 45.200.000", icon: TrendingUp, color: "emerald" },
  { label: "Pengeluaran (Bulan Ini)", value: "Rp 28.150.000", icon: TrendingDown, color: "red" },
  { label: "Dana Siaga", value: "Rp 150.000.000", icon: Wallet, color: "blue" },
];

const ALOKASI_RT = [
  { wilayah: "RW 10 / RT 01", pemasukan: "Rp 8.500.000", pengeluaran: "Rp 3.200.000", status: "Sehat" },
  { wilayah: "RW 10 / RT 02", pemasukan: "Rp 7.200.000", pengeluaran: "Rp 6.800.000", status: "Waspada" },
  { wilayah: "RW 10 / RT 03", pemasukan: "Rp 9.100.000", pengeluaran: "Rp 2.100.000", status: "Sehat" },
  { wilayah: "RW 10 / RT 04", pemasukan: "Rp 5.500.000", pengeluaran: "Rp 1.500.000", status: "Sehat" },
];

export default function AdminKeuangan() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex">
      
      {/* ── SIDEBAR (Consistent) ── */}
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
              onClick={() => item.p !== "#" && navigate(item.p)}
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
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Laporan Transparansi Keuangan</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Konsolidasi Anggaran Seluruh Wilayah</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all">
            <Download size={16} /> Unduh Laporan Tahunan
          </button>
        </header>

        {/* CONTENT AREA */}
        <div className="p-10 space-y-10 max-w-7xl mx-auto w-full">
          
          {/* TOP STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS_KEUANGAN.map((s, i) => (
              <motion.div 
                key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between ${s.type === 'main' ? 'bg-blue-600 text-white border-none' : 'bg-white text-slate-900'}`}
              >
                <div>
                    <div className="flex justify-between items-start">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${s.type === 'main' ? 'text-blue-100' : 'text-slate-400'}`}>{s.label}</p>
                        {s.icon && <s.icon className={`text-${s.color}-500`} size={20} />}
                    </div>
                    <h3 className="text-2xl font-black mt-2 tracking-tight">{s.value}</h3>
                </div>
                <div className={`mt-6 text-[11px] font-bold ${s.type === 'main' ? 'text-blue-200' : 'text-emerald-500'}`}>
                    {s.type === 'main' ? 'Performa Positif' : s.trend}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* ── ALOKASI DANA PER RT ── */}
            <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Kesehatan Finansial Wilayah</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Monitoring Kas RT / RW</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2.5 bg-slate-50 rounded-xl text-slate-500 hover:text-blue-600 transition-all"><Calendar size={18} /></button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Wilayah</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pemasukan</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pengeluaran</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {ALOKASI_RT.map((item, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-6">
                            <p className="text-sm font-black text-slate-900 leading-none">{item.wilayah}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Periode April</p>
                        </td>
                        <td className="px-10 py-6 text-[13px] font-bold text-emerald-600">{item.pemasukan}</td>
                        <td className="px-10 py-6 text-[13px] font-bold text-red-500">{item.pengeluaran}</td>
                        <td className="px-10 py-6">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                item.status === 'Sehat' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                                {item.status}
                            </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── QUICK ANALYSIS ── */}
            <div className="space-y-8">
                <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm">
                    <h3 className="font-black text-slate-900 mb-8 flex items-center gap-3">
                        <PieChart size={20} className="text-blue-600" strokeWidth={3} /> Alokasi Pengeluaran
                    </h3>
                    <div className="space-y-6">
                        {[
                            { label: "Infrastruktur", val: "45%", color: "blue" },
                            { label: "Bantuan Sosial", val: "30%", color: "emerald" },
                            { label: "Operasional Kantor", val: "25%", color: "amber" },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-[11px] font-black mb-2">
                                    <span className="text-slate-400 uppercase tracking-widest">{item.label}</span>
                                    <span className="text-slate-900">{item.val}</span>
                                </div>
                                <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                    <div className={`h-full bg-${item.color}-500`} style={{ width: item.val }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-emerald-600 rounded-[3rem] p-10 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                    <h4 className="text-[11px] font-black uppercase tracking-widest mb-2 opacity-80">Target Iuran Warga</h4>
                    <p className="text-3xl font-black tracking-tight leading-none">94.2%</p>
                    <p className="text-[10px] font-bold mt-4 opacity-70 italic leading-relaxed">Tingkat kesadaran iuran warga bulan ini meningkat pesat dibanding bulan lalu.</p>
                </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}