import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  Loader2,
  X,
  Trash2
} from "lucide-react";

export default function AdminPenduduk() {
  const navigate = useNavigate();
  const [penduduk, setPenduduk] = useState<any[]>([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nik: "",
    no_kk: "",
    nama_lengkap: "",
    alamat: "",
    rt: "",
    rw: "",
    no_hp: "",
    password: ""
  });

  // 1. Ambil Data Warga
  const fetchPenduduk = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/v1/admin/penduduk", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setPenduduk(res.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data penduduk:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPenduduk();
  }, []);

  // 2. Tambah Warga
  const handleTambahWarga = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/v1/admin/penduduk", 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert(res.data.message);
        setIsModalOpen(false);
        setFormData({ nik: "", no_kk: "", nama_lengkap: "", no_hp: "", password: "", alamat: "", rt: "", rw: "" });
        fetchPenduduk();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal menambah warga");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Hapus Warga
  const handleDelete = async (id: number) => {
    if (window.confirm("Yakin ingin menghapus data warga ini?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/v1/admin/penduduk/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Warga berhasil dihapus!");
        fetchPenduduk();
      } catch (error) {
        alert("Gagal menghapus warga.");
      }
    }
  };

  // 4. Filter Data
  const filteredPenduduk = penduduk.filter(p => 
    p.nama_lengkap?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.nik?.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex">
      
      {/* ── SIDEBAR ── */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen z-40 shadow-sm">
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
      <main className="flex-1 flex flex-col min-h-screen relative">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Database Kependudukan</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Total: {penduduk.length} Warga Terdaftar</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
             >
                <UserPlus size={16} strokeWidth={3} /> Tambah Warga
             </button>
          </div>
        </header>

        <div className="p-10 space-y-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari Nama atau NIK..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-600/10 transition-all outline-none"
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

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-slate-50/50 border-b border-slate-100">
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identitas Warga</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kontak</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Wilayah (Alamat/RT/RW)</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {filteredPenduduk.map((warga) => (
                        <motion.tr 
                          key={warga.id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="group hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="px-10 py-7">
                            <div className="flex items-center gap-5">
                              <img 
                                className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200" 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${warga.nama_lengkap}`} 
                                alt="Avatar" 
                              />
                              <div>
                                <p className="text-sm font-black text-slate-900 tracking-tight">{warga.nama_lengkap}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">NIK: {warga.nik}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-7">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-slate-600">
                                <Mail size={12} className="text-slate-400" />
                                <span className="text-[11px] font-bold">{warga.nik}@digidesa.id</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <span className="text-[11px] font-bold text-blue-600">{warga.no_hp || "-"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-7">
                            <div className="flex items-center gap-3 text-slate-700">
                              <MapPin size={16} className="text-blue-500 shrink-0" />
                              <div className="flex flex-col">
                                <span className="text-[12px] font-black">{warga.alamat || "Alamat belum diisi"}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">RT {warga.rt || "--"} / RW {warga.rw || "--"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-7 text-center">
                            <div className="flex items-center justify-center gap-2">
                               <button className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md">
                                 Profil
                               </button>
                               <button onClick={() => handleDelete(warga.id)} className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all">
                                  <Trash2 size={16} />
                               </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* ── MODAL TAMBAH WARGA ── */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl relative my-8"
              >
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                
                <h2 className="text-2xl font-black text-slate-900 mb-1">Tambah Warga Desa</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Data Alamat & Kependudukan</p>

                <form onSubmit={handleTambahWarga} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">NIK KTP</label>
                      <input 
                        required type="text" value={formData.nik}
                        onChange={(e) => setFormData({...formData, nik: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                        placeholder="16 Digit NIK"
                      />
                    </div>
                    <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Nomor KK</label>
                    <input 
                      type="text" 
                      value={formData.no_kk}
                      onChange={(e) => setFormData({...formData, no_kk: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                      placeholder="16 Digit Nomor KK"
                    />
                  </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Nama Lengkap</label>
                      <input 
                        required type="text" value={formData.nama_lengkap}
                        onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                        placeholder="Sesuai KTP"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Alamat Rumah (Nama Jalan/Blok)</label>
                    <input 
                      required type="text" value={formData.alamat}
                      onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                      placeholder="Contoh: Jl. Cisaladah No. 10 atau Blok C"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">RT</label>
                      <input 
                        required type="text" value={formData.rt}
                        onChange={(e) => setFormData({...formData, rt: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                        placeholder="001"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">RW</label>
                      <input 
                        required type="text" value={formData.rw}
                        onChange={(e) => setFormData({...formData, rw: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                        placeholder="010"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">No WhatsApp</label>
                      <input 
                        required type="text" value={formData.no_hp}
                        onChange={(e) => setFormData({...formData, no_hp: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                        placeholder="08xxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Password Login</label>
                      <input 
                        type="text" value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                        placeholder="Default pakai NIK"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" disabled={isSubmitting}
                    className="w-full py-4 mt-6 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-70 flex justify-center items-center"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Data Warga"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}