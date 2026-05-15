import { motion } from "framer-motion";
import { EASE_SPRING, STAGGER_CONTAINER, FADE_UP } from "../../constants/animation";
import {
    Calendar,
    Clock,
    User,
    FileText,
    Search,
    Filter,
    Bell,
    ChevronRight,
    Eye,
    Download,
    AlertCircle,
    CheckCircle,
    Info
} from "lucide-react";

export default function Pengumuman() {
    const pengumumanData = [
        {
            id: 1,
            judul: "Pembangunan Jalan Desa Tahap 2",
            kategori: "Infrastruktur",
            tanggal: "15 Mei 2026",
            penulis: "Admin Desa",
            status: "aktif",
            deskripsi: "Pemberitahuan mengenai dimulainya pembangunan jalan desa tahap 2 yang akan dilaksanakan mulai tanggal 20 Mei 2026.",
            lampiran: true,
            prioritas: "tinggi"
        },
        {
            id: 2,
            judul: "Pendaftaran Beasiswa Pendidikan 2026",
            kategori: "Pendidikan",
            tanggal: "10 Mei 2026",
            penulis: "Kantor Desa",
            status: "aktif",
            deskripsi: "Pembukaan pendaftaran beasiswa pendidikan untuk siswa berprestasi dari keluarga kurang mampu. Persyaratan dan formulir dapat diunduh.",
            lampiran: true,
            prioritas: "tinggi"
        },
        {
            id: 3,
            judul: "Vaksinasi Massal Anak-anak",
            kategori: "Kesehatan",
            tanggal: "8 Mei 2026",
            penulis: "Puskesmas Desa",
            status: "aktif",
            deskripsi: "Pelaksanaan vaksinasi massal untuk anak usia 5-12 tahun di balai desa. Gratis untuk seluruh warga desa.",
            lampiran: false,
            prioritas: "sedang"
        },
        {
            id: 4,
            judul: "Pelatihan UMKM Digital Marketing",
            kategori: "Pemberdayaan",
            tanggal: "5 Mei 2026",
            penulis: "Dinas Pemberdayaan",
            status: "aktif",
            deskripsi: "Pelatihan gratis untuk UMKM desa mengenai pemasaran digital dan media sosial untuk meningkatkan penjualan.",
            lampiran: true,
            prioritas: "sedang"
        },
        {
            id: 5,
            judul: "Pemutihan PBB Tahun 2025",
            kategori: "Administrasi",
            tanggal: "1 Mei 2026",
            penulis: "Admin Desa",
            status: "selesai",
            deskripsi: "Pemberitahuan pemutihan denda PBB tahun 2025 bagi warga yang telat membayar hingga 31 Mei 2026.",
            lampiran: true,
            prioritas: "rendah"
        },
        {
            id: 6,
            judul: "Peresmian Posyandu Baru",
            kategori: "Kesehatan",
            tanggal: "25 April 2026",
            penulis: "Admin Desa",
            status: "selesai",
            deskripsi: "Peresmian gedung posyandu baru yang dilengkapi fasilitas kesehatan modern untuk pelayanan ibu dan anak.",
            lampiran: false,
            prioritas: "rendah"
        }
    ];

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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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

                {/* Decorative Elements */}
                <div className="absolute top-20 right-10 w-32 h-32 bg-slate-100/20 rounded-full blur-2xl" />
                <div className="absolute bottom-10 left-20 w-48 h-48 bg-slate-100/10 rounded-full blur-3xl" />
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
                <motion.div
                    variants={STAGGER_CONTAINER}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {pengumumanData.map((item, i) => (
                        <motion.div
                            key={item.id}
                            variants={FADE_UP}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="bg-white rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl p-8 transition-all duration-300 relative overflow-hidden group"
                        >
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-blue-500 to-indigo-500" />

                            {/* Header */}
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
                                    {item.lampiran && (
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
                                    {item.lampiran && (
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
            </section>

            {/* Load More */}
            <section className="max-w-7xl mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE_SPRING, delay: 0.4 }}
                    className="text-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-3 bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-lg"
                    >
                        <span>Muat Lebih Banyak</span>
                        <ChevronRight className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            </section>
        </div>
    );
}