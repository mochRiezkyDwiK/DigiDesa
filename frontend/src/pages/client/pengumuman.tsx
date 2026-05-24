import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EASE_SPRING, STAGGER_CONTAINER, FADE_UP } from "../../constants/animation";
import {
    Calendar,
    User,
    FileText,
    Search,
    Filter,
    ChevronRight,
    Eye,
    Download,
    AlertCircle,
    CheckCircle,
    Info
} from "lucide-react";
import Navbar from "../../components/Navbar"; 
import Footer from "../../components/Footer";

// Definisi tipe data pengumuman agar TypeScript aman
interface PengumumanItem {
    id: number;
    judul: string;
    kategori: string;
    tanggal: string;
    penulis: string;
    status: string;
    deskripsi: string;
    lampiran: boolean | number;
    prioritas: string;
}

export default function Pengumuman() {
    // 🔥 State untuk menampung data dari database
    const [pengumumanData, setPengumumanData] = useState<PengumumanItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 🔥 Ambil data dari database saat halaman pertama kali dimuat
    useEffect(() => {
        const fetchPengumuman = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/v1/pengumuman");
                const result = await response.json();
                
                if (result.success) {
                    setPengumumanData(result.data);
                }
            } catch (error) {
                console.error("Gagal menyambungkan ke API pengumuman:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPengumuman();
    }, []);

    const getKategoriColor = (kategori: string) => {
        switch (kategori) {
            case 'Infrastruktur': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Pendidikan': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Kesehatan': return 'bg-red-100 text-red-700 border-red-200';
            case 'Pemberdayaan': return 'bg-violet-100 text-violet-700 border-violet-200';
            case 'Administrasi': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getPrioritasIcon = (prioritas: string) => {
        switch (prioritas) {
            case 'tinggi': return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'sedang': return <Info className="w-4 h-4 text-amber-500" />;
            case 'rendah': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            default: return null;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'aktif': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'selesai': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
            {/* 🔥 MENAMPILKAN NAVBAR */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-grow pt-16"> {/* pt-16 mencegah konten tertutup navbar fixed */}
                {/* Header */}
                <section className="relative overflow-hidden bg-white text-slate-900">
                    <div className="absolute inset-0 bg-black/5" />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: EASE_SPRING }}
                        className="relative max-w-7xl mx-auto px-6 py-24"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-slate-300" />
                            <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                                Informasi Resmi
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                            Pengumuman
                            <br />
                            <span className="text-slate-500">Desa Digital</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                            Dapatkan informasi terkini mengenai kegiatan, program, dan pengumuman resmi dari pemerintah desa.
                        </p>
                    </motion.div>
                </section>

                {/* Filter and Search Bar */}
                <section className="max-w-7xl mx-auto px-6 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE_SPRING, delay: 0.2 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6"
                    >
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari pengumuman..."
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <select className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                    <option value="">Semua Kategori</option>
                                    <option value="infrastruktur">Infrastruktur</option>
                                    <option value="pendidikan">Pendidikan</option>
                                    <option value="kesehatan">Kesehatan</option>
                                    <option value="pemberdayaan">Pemberdayaan</option>
                                    <option value="administrasi">Administrasi</option>
                                </select>
                                <select className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                    <option value="">Semua Status</option>
                                    <option value="aktif">Aktif</option>
                                    <option value="selesai">Selesai</option>
                                </select>
                                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold">
                                    <Filter className="w-4 h-4" />
                                    Filter
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Pengumuman Cards */}
                <section className="max-w-7xl mx-auto px-6 py-8">
                    {loading ? (
                        <div className="text-center py-12 text-slate-500 font-medium">Memuat data pengumuman...</div>
                    ) : pengumumanData.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 font-medium">Belum ada pengumuman hari ini.</div>
                    ) : (
                        <motion.div
                            variants={STAGGER_CONTAINER}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                        >
                            {pengumumanData.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={FADE_UP}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="bg-white rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl p-8 transition-all duration-300 relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-blue-500 to-indigo-500" />

                                    {/* Card Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getKategoriColor(item.kategori)}`}>
                                                    {item.kategori}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    {getPrioritasIcon(item.prioritas)}
                                                    <span className="text-xs text-slate-500 capitalize">{item.prioritas}</span>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{item.judul}</h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {item.tanggal}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    {item.penulis}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3">
                                        {item.deskripsi}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {Boolean(item.lampiran) && (
                                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                                    <FileText className="w-4 h-4" />
                                                    <span>Lampiran</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Detail
                                            </motion.button>
                                            {Boolean(item.lampiran) && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Unduh
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </section>

                {/* Load More */}
                <section className="max-w-7xl mx-auto px-6 py-8 mb-12">
                    <div className="text-center">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-lg"
                        >
                            <span>Muat Lebih Banyak</span>
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </section>
            </main>

            {/* 🔥 MENAMPILKAN FOOTER */}
            <Footer />
        </div>
    );
}