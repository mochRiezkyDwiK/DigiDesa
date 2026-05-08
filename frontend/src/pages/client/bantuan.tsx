import { motion } from "framer-motion";
import { EASE_SPRING, STAGGER_CONTAINER, FADE_UP } from "../../constants/animation";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    MessageCircle,
    HelpCircle,
    Send,
    ChevronRight,
    Users,
    FileText,
    Shield,
    Headphones,
    BookOpen,
    AlertTriangle,
    CheckCircle
} from "lucide-react";

export default function Bantuan() {
    const bantuanCategories = [
        {
            icon: HelpCircle,
            title: "Bantuan Umum",
            description: "Panduan lengkap penggunaan sistem dan fitur yang tersedia",
            items: [
                "Cara membuat akun warga",
                "Panduan pengajuan surat",
                "Tutorial transparansi anggaran",
                "Cara melihat pengumuman"
            ]
        },
        {
            icon: FileText,
            title: "Layanan Administrasi",
            description: "Bantuan untuk pengurusan surat dan dokumen desa",
            items: [
                "Pengajuan surat keterangan",
                "Pembuatan KTP desa",
                "Surat domisili",
                "Laporan kehilangan"
            ]
        },
        {
            icon: Shield,
            title: "Keamanan & Privasi",
            description: "Informasi perlindungan data dan keamanan akun",
            items: [
                "Kebijakan privasi",
                "Keamanan akun",
                "Lapor masalah keamanan",
                "Verifikasi identitas"
            ]
        }
    ];

    const faqData = [
        {
            question: "Bagaimana cara mendaftar sebagai warga desa?",
            answer: "Anda dapat mendaftar dengan mengunjungi kantor desa atau melalui website resmi. Siapkan KTP, KK, dan foto diri untuk proses verifikasi.",
            category: "Registrasi"
        },
        {
            question: "Apakah layanan surat online gratis?",
            answer: "Ya, pengajuan surat online gratis untuk seluruh warga desa yang sudah terdaftar. Biaya cetak dan materai tetap berlaku sesuai ketentuan.",
            category: "Layanan"
        },
        {
            question: "Bagaimana cara melihat transparansi anggaran?",
            answer: "Transparansi anggaran dapat diakses melalui menu 'Transparansi Anggaran' di website. Semua data realisasi dan laporan keuangan update setiap bulan.",
            category: "Informasi"
        },
        {
            question: "Siapa yang bisa mengakses layanan desa?",
            answer: "Layanan desa hanya dapat diakses oleh warga yang sudah terdaftar dan terverifikasi. Pastikan data Anda valid dan status akun aktif.",
            category: "Akses"
        }
    ];

    const kontakData = [
        {
            icon: Phone,
            label: "Telepon Darurat",
            value: "(021) 1234-5678",
            description: "Untuk keadaan darurat 24 jam"
        },
        {
            icon: Mail,
            label: "Email Resmi",
            value: "bantuan@digidesa.desa.id",
            description: "Respon dalam 1x24 jam"
        },
        {
            icon: MapPin,
            label: "Alamat Kantor",
            value: "Jl. Merdeka No. 123, Desa Maju Jaya",
            description: "Senin - Jumat, 08:00 - 16:00"
        },
        {
            icon: Clock,
            label: "Jam Layanan",
            value: "Senin - Jumat: 08:00 - 16:00",
            description: "Sabtu & Minggu: Tutup"
        }
    ];

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
                            Pusat Bantuan
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                        Pusat Bantuan
                        <br />
                        <span className="text-slate-500">Desa Digital</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                        Temukan jawaban untuk pertanyaan umum dan dapatkan bantuan teknis untuk layanan desa digital.
                    </p>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-20 right-10 w-32 h-32 bg-slate-100/20 rounded-full blur-2xl" />
                <div className="absolute bottom-10 left-20 w-48 h-48 bg-slate-100/10 rounded-full blur-3xl" />
            </section>

            {/* Quick Help Categories */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE_SPRING }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="h-px w-8 bg-gradient-to-r from-slate-300 to-slate-400" />
                        <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                            Kategori Bantuan
                        </span>
                        <div className="h-px w-8 bg-gradient-to-r from-slate-300 to-slate-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                        Bantuan Cepat
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Pilih kategori bantuan yang Anda butuhkan
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {bantuanCategories.map((category, i) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_SPRING }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="bg-white rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl p-8 transition-all duration-300 relative overflow-hidden group"
                        >
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-blue-500 to-indigo-500" />

                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-600/25">
                                <category.icon className="w-8 h-8 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-black text-slate-900 mb-3">{category.title}</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">{category.description}</p>

                            {/* Items List */}
                            <div className="space-y-2">
                                {category.items.map((item, j) => (
                                    <div key={j} className="flex items-center gap-3 text-sm text-slate-600">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-slate-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: EASE_SPRING }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="h-px w-8 bg-gradient-to-r from-slate-300 to-slate-400" />
                            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                Pertanyaan Umum
                            </span>
                            <div className="h-px w-8 bg-gradient-to-r from-slate-300 to-slate-400" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                            Frequently Asked
                            <br />
                            <span className="text-slate-500">Questions</span>
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Jawaban untuk pertanyaan yang sering diajukan warga
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {faqData.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_SPRING }}
                                className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-bold text-blue-700">{faq.category}</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight">{faq.question}</h3>
                                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE_SPRING }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="h-px w-8 bg-gradient-to-r from-slate-300 to-slate-400" />
                        <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                            Hubungi Kami
                        </span>
                        <div className="h-px w-8 bg-gradient-to-r from-slate-300 to-slate-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                        Butuh Bantuan
                        <br />
                        <span className="text-slate-500">Langsung?</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                        Tim support siap membantu Anda 24/7 untuk semua kebutuhan teknis dan administrasi.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: EASE_SPRING, delay: 0.2 }}
                        className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8"
                    >
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Kirim Pesan</h3>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Masukkan nama lengkap Anda"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Pesan</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                    placeholder="Jelaskan masalah atau pertanyaan Anda..."
                                />
                            </div>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                            >
                                <Send className="w-5 h-5" />
                                Kirim Pesan
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: EASE_SPRING, delay: 0.3 }}
                        className="bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-100 shadow-xl p-8"
                    >
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Informasi Kontak</h3>
                        <div className="space-y-6">
                            {kontakData.map((kontak, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.1, ease: EASE_SPRING }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <kontak.icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-700 mb-1">{kontak.label}</p>
                                        <p className="text-base font-bold text-slate-900 mb-1">{kontak.value}</p>
                                        <p className="text-sm text-slate-500">{kontak.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-gradient-to-b from-slate-50 to-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: EASE_SPRING }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-3 mb-8">
                            <div className="h-px w-8 bg-gradient-to-r from-slate-300 to-slate-400" />
                            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                Aksi Cepat
                            </span>
                            <div className="h-px w-8 bg-gradient-to-r from-slate-300 to-slate-400" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white border-2 border-slate-200 text-slate-700 p-6 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all group"
                            >
                                <BookOpen className="w-6 h-6 mb-3 text-blue-600 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold">Panduan</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white border-2 border-slate-200 text-slate-700 p-6 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all group"
                            >
                                <MessageCircle className="w-6 h-6 mb-3 text-emerald-600 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold">Live Chat</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white border-2 border-slate-200 text-slate-700 p-6 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all group"
                            >
                                <Headphones className="w-6 h-6 mb-3 text-violet-600 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold">Call Center</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white border-2 border-slate-200 text-slate-700 p-6 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all group"
                            >
                                <AlertTriangle className="w-6 h-6 mb-3 text-amber-600 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold">Lapor Masalah</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}