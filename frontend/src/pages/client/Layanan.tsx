import { useState, useEffect } from "react"; // 1. Tambahkan useEffect
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import { EASE_SPRING } from "../../constants/animation";
import { 
  FileText, 
  Search, 
  ArrowRight, 
  Zap,
  Info,
  Clock,
  CreditCard,
  Users,
  MapPin,
  ArrowLeft 
} from "lucide-react";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.05, ease: EASE_SPRING }
  })
};

// ─── DATA LAYANAN ──────────────────────────────────────────────────────────

const KATEGORI = ["Semua", "Surat Keterangan", "Kependudukan"];

const DAFTAR_LAYANAN = [
  { 
    title: "Surat Keterangan Domisili", 
    desc: "Untuk keperluan pembukaan rekening bank, lamaran kerja, atau administrasi lainnya.",
    category: "Surat Keterangan",
    time: "Instan",
    icon: MapPin,
    color: "blue",
    link: '/buat-surat?type=domisili'
  },
  { 
    title: "Surat Keterangan Usaha (SKU)", 
    desc: "Syarat utama pengajuan kredit usaha atau legalitas usaha mikro di lingkungan desa.",
    category: "Surat Keterangan",
    time: "1 Hari Kerja",
    icon: CreditCard,
    color: "indigo",
    link: '/buat-surat?type=sku'
  },
  { 
    title: "Update Data Kartu Keluarga", 
    desc: "Sinkronisasi data jumlah anggota keluarga atau perubahan status kependudukan.",
    category: "Kependudukan",
    time: "Sistem Terpusat",
    icon: Users,
    color: "violet",
    link: '/buat-surat?type=update-kk'
  }
];

// 2. Definisi Struktur Data User dari Database
interface UserProfile {
  nama: string;
  nik: string;
  is_verified: boolean; // Menentukan apakah user sudah terverifikasi atau belum
}

export default function Layanan() {
  const [filter, setFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); 

  // 3. State untuk menyimpan data user dari Database
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  // 4. Hook useEffect untuk Fetch Data Profil User saat komponen dimuat
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoadingUser(true);
        
        // Ambil token JWT yang tersimpan di localStorage saat login
        const token = localStorage.getItem("token"); 

        const response = await fetch("http://localhost:5000/api/v1/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Kirim token untuk mengidentifikasi user
          }
        });

        const resData = await response.json();
        if (resData.success) {
          setUser(resData.data); // Simpan data profil ke dalam state
        }
      } catch (error) {
        console.error("Gagal mengambil data user kependudukan:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserProfile();
  }, []);

  const filteredServices = DAFTAR_LAYANAN.filter(s => 
    (filter === "Semua" || s.category === filter) &&
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFEFF] font-sans antialiased pb-20">
      
      {/* ── HEADER LAYANAN ── */}
      <section className="bg-white pt-16 pb-20 px-8 relative overflow-hidden border-b border-slate-100">
        <div className="max-w-6xl mx-auto mb-12 relative z-20 flex justify-between items-center">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/dashboard-warga')}
              className="flex items-center gap-3 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all"
            >
              <ArrowLeft size={18} strokeWidth={3} />
              <span className="text-xs font-black uppercase tracking-widest">Kembali ke Dashboard</span>
            </motion.button>

            {/* 5. Tampilkan nama user kecil di pojok kanan atas jika berhasil di-load */}
            {user && (
              <div className="text-right text-xs font-bold text-slate-500">
                Warga: <span className="text-slate-900">{user.nama}</span>
              </div>
            )}
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-40 -mr-20 -mt-20" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" animate="visible" variants={FADE_UP} custom={0}>
            <span className="px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Katalog Layanan Digital</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-6 tracking-tighter leading-none">
              Solusi Administrasi <br/> <span className="text-blue-500 font-serif italic">Satu Pintu.</span>
            </h1>
          </motion.div>

          {/* Search Bar */}
          <motion.div initial="hidden" animate="visible" variants={FADE_UP} custom={1} className="mt-12 max-w-2xl relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari layanan (misal: Domisili, Usaha...)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-[2rem] py-5 pl-14 pr-6 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </motion.div>
        </div>
      </section>

      {/* ── FILTER KATEGORI ── */}
      <section className="max-w-6xl mx-auto px-8 -mt-8 relative z-20">
        <div className="flex flex-wrap gap-3 bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
          {KATEGORI.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-full text-xs font-black transition-all duration-300 ${
                filter === cat 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── GRID LAYANAN ── */}
      <section className="max-w-6xl mx-auto px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, i) => (
            <motion.div
              key={service.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FADE_UP}
              custom={i}
              whileHover={{ y: -10 }}
              onClick={() => navigate(service.link)}
              className="group bg-white p-8 rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.04)] hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl bg-${service.color}-50 flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-all duration-500 shadow-sm`}>
                  <service.icon className={`text-${service.color}-600 group-hover:text-white transition-colors`} size={26} strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md leading-none">{service.category}</span>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                    <Clock size={10} /> {service.time}
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">{service.title}</h3>
                <p className="text-slate-500 text-sm mt-4 leading-relaxed font-medium line-clamp-3">
                  {service.desc}
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                  Gunakan Layanan <ArrowRight size={14} strokeWidth={3} />
                </span>
                <Info size={16} className="text-slate-200 group-hover:text-blue-200 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Layanan tidak ditemukan</h3>
            <p className="text-slate-400 text-sm mt-2">Coba gunakan kata kunci lain atau pilih kategori yang berbeda.</p>
          </div>
        )}
      </section>

      {/* ── FOOTER INFO (TERINTEGRASI DATA USER ASLI) ── */}
      <section className="max-w-4xl mx-auto px-8 mt-24">
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-10 rounded-[3rem] border border-blue-100/50 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
            <Zap className="text-white" size={28} strokeWidth={2.5} />
          </div>
          <div className="grow">
            <h4 className="text-lg font-black text-slate-900 tracking-tight">
              {loadingUser ? "Memeriksa Status Akun..." : user?.is_verified ? "Profil Anda Terverifikasi! ✓" : "Profil Belum Terverifikasi ⚠"}
            </h4>
            <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">
              {user?.is_verified 
                ? `Selamat datang, ${user.nama}. Akun Anda dengan NIK ${user.nik.replace(/(\d{4})$/, '****')} terhubung langsung ke database desa. Anda bisa mengajukan surat secara instan.`
                : "Sistem kami mendeteksi profil Anda belum diverifikasi oleh admin RT/RW. Harap hubungi petugas atau unggah dokumen pendukung untuk mengaktifkan fitur surat otomatis."}
            </p>
          </div>
          
          {/* Mengubah warna tombol secara dinamis berdasarkan database status user */}
          <button 
            onClick={() => navigate('/profil')}
            className={`whitespace-nowrap px-6 py-3 border rounded-xl text-xs font-black transition-all ${
              user?.is_verified 
                ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" 
                : "bg-white border-slate-200 hover:border-blue-500 hover:text-blue-600"
            }`}
          >
            {user?.is_verified ? "Lihat Detail Profil" : "Verifikasi Sekarang"}
          </button>
        </div>
      </section>
    </div>
  );
}