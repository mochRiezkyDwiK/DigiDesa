import { motion } from "framer-motion";
import { EASE_SPRING, STAGGER_CONTAINER, FADE_UP } from "../../constants/animation";
import { 
  TrendingUp, 
  DollarSign, 
  Receipt, 
  PieChart, 
  Calendar, 
  Download,
  Eye,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function TransparansiAnggaran() {
  const anggaranData = [
    {
      kategori: "Infrastruktur Desa",
      anggaran: "Rp 450.000.000",
      persentase: 45,
      status: "on-track",
      detail: "Jalan, Drainase, Jembatan"
    },
    {
      kategori: "Pendidikan",
      anggaran: "Rp 200.000.000", 
      persentase: 20,
      status: "on-track",
      detail: "Beasiswa, Fasilitas Sekolah"
    },
    {
      kategori: "Kesehatan",
      anggaran: "Rp 150.000.000",
      persentase: 15,
      status: "delayed",
      detail: "Posyandu, Ambulans"
    },
    {
      kategori: "Pemberdayaan Masyarakat",
      anggaran: "Rp 100.000.000",
      persentase: 10,
      status: "on-track",
      detail: "Pelatihan UMKM, Koperasi"
    },
    {
      kategori: "Administrasi",
      anggaran: "Rp 100.000.000",
      persentase: 10,
      status: "completed",
      detail: "Operasional Kantor"
    }
  ];

  const laporanKeuangan = [
    {
      periode: "Januari 2026",
      pemasukan: "Rp 85.000.000",
      pengeluaran: "Rp 72.500.000",
      saldo: "Rp 12.500.000",
      status: "surplus"
    },
    {
      periode: "Februari 2026", 
      pemasukan: "Rp 85.000.000",
      pengeluaran: "Rp 89.200.000",
      saldo: "-Rp 4.200.000",
      status: "defisit"
    },
    {
      periode: "Maret 2026",
      pemasukan: "Rp 85.000.000", 
      pengeluaran: "Rp 78.300.000",
      saldo: "Rp 6.700.000",
      status: "surplus"
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'on-track': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'delayed': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'on-track': return <CheckCircle className="w-4 h-4" />;
      case 'delayed': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <section className="relative overflow-hidden bg-white text-slate-900">
        <div className="absolute inset-0 bg-black/10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_SPRING }}
          className="relative max-w-7xl mx-auto px-6 py-24"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-slate-300" />
            <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Transparansi Keuangan Desa
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Anggaran & Realisasi
            <br />
            <span className="text-slate-500">Tahun Anggaran 2026</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
            Pantau secara real-time penggunaan anggaran desa untuk transparansi dan akuntabilitas yang lebih baik.
          </p>
        </motion.div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
      </section>

      {/* Summary Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              icon: DollarSign,
              label: "Total Anggaran",
              value: "Rp 1.000.000.000",
              change: "+12% dari 2025",
              color: "blue",
              bgGradient: "from-blue-500 to-blue-600"
            },
            {
              icon: TrendingUp,
              label: "Realisasi",
              value: "Rp 680.000.000",
              change: "68% terserap",
              color: "emerald",
              bgGradient: "from-emerald-500 to-emerald-600"
            },
            {
              icon: PieChart,
              label: "Sisa Anggaran",
              value: "Rp 320.000.000",
              change: "32% tersedia",
              color: "amber",
              bgGradient: "from-amber-500 to-amber-600"
            },
            {
              icon: FileText,
              label: "Laporan Bulanan",
              value: "3",
              change: "Terbaru Maret",
              color: "violet",
              bgGradient: "from-violet-500 to-violet-600"
            }
          ].map((item, i) => (
            <motion.div
              key={item.label}
              variants={FADE_UP}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl p-8 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.bgGradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />
              
              {/* Icon container */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.bgGradient} flex items-center justify-center mb-6 shadow-lg shadow-${item.color}-500/25`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <p className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">{item.label}</p>
                <p className="text-3xl font-black text-slate-900 mb-3 leading-tight">{item.value}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
                  <p className="text-sm font-medium text-slate-500">{item.change}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Anggaran per Kategori */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_SPRING }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">
              Program Prioritas
            </span>
            <div className="h-px w-8 bg-gradient-to-r from-blue-600 to-indigo-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Distribusi Anggaran
            <br />
            <span className="text-slate-400">per Kategori</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Rincian alokasi anggaran untuk setiap program prioritas desa dengan monitoring real-time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {anggaranData.map((item, i) => (
            <motion.div
              key={item.kategori}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE_SPRING }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl p-8 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Background gradient decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity ${
                item.status === 'completed' ? 'bg-blue-500' :
                item.status === 'on-track' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
              
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-900 mb-2">{item.kategori}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.detail}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-xs font-bold border backdrop-blur-sm ${
                  item.status === 'completed' ? 'bg-blue-50/80 text-blue-700 border-blue-200' :
                  item.status === 'on-track' ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200' : 
                  'bg-amber-50/80 text-amber-700 border-amber-200'
                }`}>
                  <span className="flex items-center gap-1.5">
                    {getStatusIcon(item.status)}
                    {item.status}
                  </span>
                </span>
              </div>
              
              {/* Budget Info */}
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Anggaran</p>
                    <p className="text-3xl font-black text-slate-900 leading-tight">{item.anggaran}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-600 mb-1">Terserap</p>
                    <p className="text-2xl font-black text-slate-900">{item.persentase}%</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.persentase}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3, ease: EASE_SPRING }}
                      className={`h-full rounded-full relative ${
                        item.status === 'completed' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        item.status === 'on-track' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 
                        'bg-gradient-to-r from-amber-500 to-amber-600'
                      }`}
                    >
                      {/* Progress indicator dot */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Laporan Keuangan Bulanan */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_SPRING }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-gradient-to-r from-blue-600 to-indigo-600" />
              <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">
                Laporan Keuangan
              </span>
              <div className="h-px w-8 bg-gradient-to-r from-blue-600 to-indigo-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Rekapitulasi
              <br />
              <span className="text-slate-400">Bulanan</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Monitoring pemasukan dan pengeluaran desa dengan transparansi penuh.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all font-semibold"
            >
              <Download className="w-5 h-5" />
              Download Laporan Lengkap
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_SPRING, delay: 0.2 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-8 py-6 text-sm font-bold text-slate-700 uppercase tracking-wider">Periode</th>
                    <th className="text-right px-8 py-6 text-sm font-bold text-slate-700 uppercase tracking-wider">Pemasukan</th>
                    <th className="text-right px-8 py-6 text-sm font-bold text-slate-700 uppercase tracking-wider">Pengeluaran</th>
                    <th className="text-right px-8 py-6 text-sm font-bold text-slate-700 uppercase tracking-wider">Saldo</th>
                    <th className="text-center px-8 py-6 text-sm font-bold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="text-center px-8 py-6 text-sm font-bold text-slate-700 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {laporanKeuangan.map((laporan, i) => (
                    <motion.tr
                      key={laporan.periode}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_SPRING }}
                      className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/30 transition-all duration-300 group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{laporan.periode}</span>
                            <span className="text-xs text-slate-500">Bulan ke-{i + 1}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-black text-emerald-700">{laporan.pemasukan}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="font-black text-red-700">{laporan.pengeluaran}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black ${
                          laporan.status === 'surplus' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {laporan.saldo}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border backdrop-blur-sm ${
                          laporan.status === 'surplus' 
                            ? 'bg-emerald-100/80 text-emerald-800 border-emerald-300' 
                            : 'bg-red-100/80 text-red-800 border-red-300'
                        }`}>
                          {laporan.status === 'surplus' ? (
                            <>
                              <ArrowUpRight className="w-4 h-4" />
                              Surplus
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="w-4 h-4" />
                              Defisit
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Detail
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Download Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_SPRING }}
          className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-4xl p-16 text-center text-white overflow-hidden shadow-2xl"
        >
          {/* Background decorations */}
          <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-white/60" />
              <span className="text-sm font-bold text-white/90 uppercase tracking-wider">
                Dokumen Resmi
              </span>
              <div className="h-px w-12 bg-white/60" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Unduh Dokumen
              <br />
              <span className="text-blue-100">Lengkap</span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-12 leading-relaxed max-w-2xl mx-auto">
              Dapatkan akses ke semua dokumen anggaran dan laporan keuangan desa dalam format PDF yang dapat diunduh kapan saja.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 bg-white text-blue-600 px-10 py-4 rounded-2xl hover:bg-blue-50 transition-all font-bold text-lg shadow-xl hover:shadow-2xl"
              >
                <Download className="w-6 h-6 group-hover:animate-bounce" />
                <span>Laporan Tahunan 2026</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 bg-blue-500/20 backdrop-blur-sm text-white px-10 py-4 rounded-2xl hover:bg-blue-400/30 transition-all font-bold text-lg border border-white/20"
              >
                <FileText className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span>RAPB Desa</span>
              </motion.button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>Update Real-time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span>Tersedia 24/7</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
