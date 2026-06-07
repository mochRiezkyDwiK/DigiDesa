import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EASE_SPRING, STAGGER_CONTAINER, FADE_UP } from "../../constants/animation";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Calendar, 
  Eye, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight
} from "lucide-react";

// 🔥 Import Komponen Navbar dan Footer Baru
import Navbar from "../../components/Navbar"; 
import Footer from "../../components/Footer";

// Sesuai dengan hasil Query SQL SELECT ... AS ...
interface Anggaran {
  kategori: string;
  anggaran: number; // Menggunakan number karena tipe DECIMAL di database
  persentase: number;
  status: string;
  detail: string;
}

interface LaporanKeuangan {
  periode: string;
  pemasukan: number; // Menggunakan number karena tipe DECIMAL di database
  pengeluaran: number; // Menggunakan number karena tipe DECIMAL di database
  saldo: number; // Menggunakan number dari kolom virtual database
  status: string;
}

export default function TransparansiAnggaran() {
  const navigate = useNavigate();
  const [anggaranData, setAnggaranData] = useState<Anggaran[]>([]);
  const [laporanKeuangan, setLaporanKeuangan] = useState<LaporanKeuangan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Anda harus login terlebih dahulu untuk mengakses halaman ini.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const resAnggaran = await fetch("http://localhost:5000/api/v1/anggaran", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataAnggaran = await resAnggaran.json();
        const resLaporan = await fetch("http://localhost:5000/api/v1/laporan");
        const dataLaporan = await resLaporan.json();

        if (dataAnggaran.success) setAnggaranData(dataAnggaran.data);
        if (dataLaporan.success) setLaporanKeuangan(dataLaporan.data);
      } catch (error) {
        console.error("Gagal mengambil data transparansi anggaran:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Fungsi Utility untuk memformat angka murni menjadi Format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka);
  };

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'on-track': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'delayed': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'on-track': return <CheckCircle className="w-4 h-4" />;
      case 'delayed': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat data transparansi...</p>
        </div>
      </div>
    );
  }

  // Akumulasi data keuangan secara dinamis berdasarkan database Anda
  const totalAnggaran = anggaranData.reduce((acc, curr) => acc + Number(curr.anggaran), 0);
  const totalRealisasi = anggaranData.reduce((acc, curr) => {
    const nilai = Number(curr.anggaran) || 0;
    const persen = Number(curr.persentase) || 0;
    return acc + (nilai * (persen / 100));
  }, 0);
  const sisaAnggaran = totalAnggaran - totalRealisasi;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col justify-between">
      
      {/* 🧭 Komponen Navbar */}
      <Navbar />

      {/* 📦 Konten Utama */}
      <main className="flex-grow">
        {/* Header */}
        <section className="relative overflow-hidden bg-white text-slate-900">
          <div className="absolute inset-0 bg-slate-50/50" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_SPRING }}
            className="relative max-w-7xl mx-auto px-6 py-20"
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
        </section>

        {/* Summary Cards */}
        <section className="max-w-7xl mx-auto px-6 -mt-8">
          <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: DollarSign, label: "Total Anggaran", value: formatRupiah(totalAnggaran), change: "Berdasarkan Kategori", color: "blue", bgGradient: "from-blue-500 to-blue-600" },
              { icon: TrendingUp, label: "Realisasi", value: formatRupiah(totalRealisasi), change: `${totalAnggaran > 0 ? Math.round((totalRealisasi / totalAnggaran) * 100) : 0}% terserap`, color: "emerald", bgGradient: "from-emerald-500 to-emerald-600" },
              { icon: PieChart, label: "Sisa Anggaran", value: formatRupiah(sisaAnggaran), change: `${totalAnggaran > 0 ? Math.round((sisaAnggaran / totalAnggaran) * 100) : 0}% tersedia`, color: "amber", bgGradient: "from-amber-500 to-amber-600" },
              { icon: FileText, label: "Laporan Bulanan", value: laporanKeuangan.length.toString(), change: `Update: ${laporanKeuangan[0]?.periode || "-"}`, color: "violet", bgGradient: "from-violet-500 to-violet-600" }
            ].map((item) => (
              <motion.div key={item.label} variants={FADE_UP} whileHover={{ y: -4, scale: 1.02 }} className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 transition-all relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.bgGradient} opacity-5 rounded-full blur-2xl`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.bgGradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">{item.label}</p>
                <p className="text-xl font-black text-slate-900 mb-3 leading-tight">{item.value}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
                  <p className="text-sm font-medium text-slate-500">{item.change}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Distribusi Anggaran Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Distribusi Anggaran <br /><span className="text-slate-400">per Kategori</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {anggaranData.map((item, i) => (
              <motion.div key={item.kategori} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1, ease: EASE_SPRING }} whileHover={{ y: -8, scale: 1.02 }} className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 transition-all overflow-hidden" >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-900 mb-2">{item.kategori}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.detail}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                    <span className="flex items-center gap-1.5 capitalize">{getStatusIcon(item.status)}{item.status}</span>
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">Anggaran</p>
                      <p className="text-xl font-black text-slate-900 leading-tight">{formatRupiah(Number(item.anggaran))}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-600 mb-1">Terserap</p>
                      <p className="text-xl font-black text-slate-900">{item.persentase}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.persentase}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE_SPRING }} className={`h-full rounded-full ${item.status === 'completed' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : item.status === 'on-track' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-amber-500 to-amber-600'}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tabel Rekapitulasi Section */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-20 pb-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                Rekapitulasi <span className="text-slate-400">Bulanan</span>
              </h2>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden">
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
                    {laporanKeuangan.map((laporan) => (
                      <tr key={laporan.periode} className="hover:bg-slate-50/50 transition-all duration-300">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Calendar className="w-5 h-5 text-blue-600" /></div>
                            <span className="font-bold text-slate-900 block">{laporan.periode}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right font-black text-emerald-700">{formatRupiah(Number(laporan.pemasukan))}</td>
                        <td className="px-8 py-6 text-right font-black text-red-700">{formatRupiah(Number(laporan.pengeluaran))}</td>
                        <td className="px-8 py-6 text-right">
                          <span className={`inline-flex items-center px-4 py-2 rounded-xl font-black ${laporan.status?.toLowerCase() === 'surplus' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            {formatRupiah(Number(laporan.saldo))}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${laporan.status?.toLowerCase() === 'surplus' ? 'bg-emerald-100/80 text-emerald-800 border-emerald-300' : 'bg-red-100/80 text-red-800 border-red-300'}`}>
                            {laporan.status?.toLowerCase() === 'surplus' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            <span className="capitalize">{laporan.status}</span>
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-semibold text-sm">
                            <Eye className="w-4 h-4" /> Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 🗺️ Komponen Footer */}
      <Footer />

    </div>
  );
}