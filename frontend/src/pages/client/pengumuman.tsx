import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  EASE_SPRING,
  STAGGER_CONTAINER,
  FADE_UP,
} from "../../constants/animation";
import {
  Calendar,
  User,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Definisi tipe data pengumuman
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
  gambar?: string;
  link?: string;
}

interface KategoriItem {
  label: string;
  slug: string;
  link: string;
}

export default function Pengumuman() {
  const [pengumumanData, setPengumumanData] = useState<PengumumanItem[]>([]);
  const [kategoriData, setKategoriData] = useState<KategoriItem[]>([]);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPengumuman = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedKategori) params.set("category", selectedKategori);

        const response = await fetch(
          `http://localhost:5000/api/v1/pengumuman?${params.toString()}`,
        );
        const result = await response.json();

        if (result.success) {
          setPengumumanData(result.data);
          setKategoriData(result.categories || []);
        }
      } catch (error) {
        console.error("Gagal menyambungkan ke API pengumuman:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPengumuman();
  }, [selectedKategori]);

  const filteredPengumuman = pengumumanData.filter(
    (item) =>
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case "Infrastruktur":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Pendidikan":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Kesehatan":
        return "bg-red-50 text-red-700 border-red-200";
      case "Pemberdayaan":
        return "bg-violet-50 text-violet-700 border-violet-200";
      case "Administrasi":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16 pb-16">
        {/* Header Section */}
        <div className="max-w-full mx-auto px-6 mb-12 h-64 flex items-center justify-center border z-[-1]" style={{ backgroundImage: "url('/image/kbb-vector.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="max-w-full border relative">
            {/* <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
              Pengumuman Desa
            </h1>
            <p className="text-slate-600 text-lg">
              Informasi terkini dari Pemerintah Desa Digital.
            </p> */}
          </div>
        </div>

        {/* Filter Section */}
        <section className="max-w-7xl mx-auto px-6 mb-10">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <select
              value={selectedKategori}
              onChange={(event) => setSelectedKategori(event.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700"
            >
              <option value="">Semua Kategori</option>
              {kategoriData.map((kategori) => (
                <option key={kategori.slug} value={kategori.slug}>
                  {kategori.label}
                </option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </section>

        {/* Grid Section */}
        {/* Grid Section */}
        <section className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-20 text-slate-500">
              Memuat data...
            </div>
          ) : (
            <motion.div
              variants={STAGGER_CONTAINER}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPengumuman.length === 0 ? (
                <div className="col-span-full text-center py-20 text-slate-500">
                  Berita tidak ditemukan.
                </div>
              ) : (
                // Hapus fragmen <> dan gunakan kurung kurawal langsung untuk .map
                filteredPengumuman.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={FADE_UP}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Isi komponen card tetap sama seperti kode Anda sebelumnya */}
                    <div className="aspect-video w-full bg-slate-200 overflow-hidden">
                      <img
                        src={item.gambar || "/api/placeholder/800/450"}
                        alt={item.judul}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <span
                        className={`self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-4 ${getKategoriColor(item.kategori)}`}
                      >
                        {item.kategori}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                        {item.judul}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                        {item.deskripsi}
                      </p>

                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {item.tanggal}
                        </div>
                        <a
                          href={item.link || `/pengumuman/${item.id}`}
                          className="text-blue-600 font-semibold text-xs hover:underline"
                        >
                          Detail
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
