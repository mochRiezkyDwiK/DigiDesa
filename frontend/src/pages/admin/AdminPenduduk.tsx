import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Search, 
  UserPlus, 
  Filter, 
  MoreVertical, 
  ArrowLeft,
  LayoutDashboard,
  Files,
  AlertTriangle,
  BarChart3,
  Settings,
  Building2,
  Download,
  Mail,
  MapPin,
  ChevronRight
} from "lucide-react";

// ─── DUMMY DATA PENDUDUK ──────────────────────────────────────────────────────

const DATA_PENDUDUK = [
  { id: 1, nama: "Budi Santoso", nik: "3273012903100004", rt: "01", rw: "10", status: "Tetap", email: "budi.s@email.com" },
  { id: 2, nama: "Siti Aminah", nik: "3273012903100112", rt: "03", rw: "10", status: "Tetap", email: "siti.a@email.com" },
  { id: 3, nama: "Rahmat Hidayat", nik: "3273012903100782", rt: "02", rw: "10", status: "Kontrak", email: "rahmat.h@email.com" },
  { id: 4, nama: "Dewi Lestari", nik: "3273012903100991", rt: "01", rw: "10", status: "Tetap", email: "dewi.l@email.com" },
];

export default function AdminPenduduk() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPenduduk = DATA_PENDUDUK.filter(p => 
    p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.nik.includes(searchQuery)
  );

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
            { n: "Data Penduduk", i: Users, p: "/admin/penduduk", active: true },
            { n: "Keuangan Desa", i: BarChart3, p: "/admin/keuangan" },
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
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Database Kependudukan</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Total: {DATA_PENDUDUK.length} Warga Terdaftar</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                <UserPlus size={16} strokeWidth={3} /> Tambah Warga
             </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-10 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* SEARCH & FILTER BAR */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari Nama atau NIK..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-600/10 transition-all"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 rounded-xl text-[11px] font-black text-slate-600 hover:bg-slate-100 transition-all uppercase tracking-widest">
                    <Filter size={14} /> Filter RT/RW
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 rounded-xl text-[11px] font-black text-slate-600 hover:bg-slate-100 transition-all uppercase tracking-widest">
                    <Download size={14} /> Export CSV
                </button>
            </div>
          </div>

          {/* RESIDENTIAL TABLE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-slate-50/50 border-b border-slate-100">
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identitas Warga</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Wilayah</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {filteredPenduduk.map((warga) => (
                      <motion.tr 
                        key={warga.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="group hover:bg-blue-50/30 transition-colors cursor-pointer"
                      >
                        <td className="px-10 py-7">
                          <div className="flex items-center gap-5">
                            <img className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${warga.nama}`} alt="Avatar" />
                            <div>
                              <p className="text-sm font-black text-slate-900 tracking-tight">{warga.nama}</p>
                              <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400 uppercase">
                                <span className="flex items-center gap-1"><Mail size={10} /> {warga.email}</span>
                                <span>NIK: {warga.nik}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-7">
                          <div className="flex items-center gap-2 text-slate-700">
                            <MapPin size={14} className="text-blue-500" />
                            <span className="text-[12px] font-black">RT {warga.rt} / RW {warga.rw}</span>
                          </div>
                        </td>
                        <td className="px-10 py-7">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                            warga.status === 'Tetap' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {warga.status}
                          </span>
                        </td>
                        <td className="px-10 py-7 text-center">
                          <div className="flex items-center justify-center gap-2">
                             <button className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                                Profil
                             </button>
                             <button className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-slate-900 transition-all">
                                <MoreVertical size={16} />
                             </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}