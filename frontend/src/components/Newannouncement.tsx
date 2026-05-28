"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  ArrowRight,
  Megaphone, // Pastikan penulisan M-e-g-a-p-h-o-n-e konsisten
} from "lucide-react";

interface NewsItem {
  id: string;
  type: "pengumuman" | "berita" | "kegiatan";
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  emoji: string;
  important?: boolean;
  link?: string;
  image?: string;
}

interface PengumumanApiItem {
  id: number;
  judul: string;
  kategori: string;
  tanggal: string;
  deskripsi: string;
  prioritas: string;
  link?: string;
  gambar?: string;
}

const newsData: NewsItem[] = [
  {
    id: "1",
    type: "pengumuman",
    title: "Jadwal Posyandu Balita & Lansia Serentak Juni 2026",
    excerpt:
      "Posyandu akan dilaksanakan pada Rabu, 3 Juni 2026 pukul 08.00–12.00 WIB di Balai Desa. Warga diwajibkan membawa KMS dan buku KIA.",
    date: "28 Mei 2026",
    tag: "Kesehatan",
    emoji: "🏥",
    important: true,
  },
  {
    id: "2",
    type: "pengumuman",
    title: "Pendaftaran Bantuan Sosial BPNT Gelombang II Dibuka",
    excerpt:
      "Warga kurang mampu yang belum terdaftar dapat mengajukan berkas BPNT di loket reguler kantor desa hingga 10 Juni 2026. Bawa KTP & KK asli.",
    date: "25 Mei 2026",
    tag: "Bansos",
    emoji: "🤝",
    important: true,
  },
  {
    id: "3",
    type: "berita",
    title: "Jalan Dusun Kidul Resmi Diaspal, Aktivitas Ekonomi Meningkat",
    excerpt:
      "Setelah lama ditunggu, pengaspalan jalan sepanjang 800m di Dusun Kidul akhirnya rampung. Proyek bersumber dari Dana Desa 2026 ini selesai tepat waktu.",
    date: "20 Mei 2026",
    tag: "Infrastruktur",
    emoji: "🛣️",
  },
  {
    id: "4",
    type: "kegiatan",
    title: "Aksi Gotong Royong Bersih Sungai Diikuti 200 Warga Desa",
    excerpt:
      "Kegiatan resik sungai dalam rangka Hari Lingkungan Hidup berhasil menggerakkan ratusan warga dari seluruh RT untuk normalisasi aliran hulu.",
    date: "17 Mei 2026",
    tag: "Lingkungan",
    emoji: "🌿",
  },
  {
    id: "5",
    type: "pengumuman",
    title: "Pemadaman Listrik Berkala Area Pemeliharaan Blok B & C",
    excerpt:
      "PLN mengonfirmasi adanya pemeliharaan jaringan pada 5 & 6 Juni 2026 pukul 08.00–16.00 WIB. Mohon persiapkan daya cadangan.",
    date: "15 Mei 2026",
    tag: "Utilitas",
    emoji: "⚡",
    important: true,
  },
  {
    id: "6",
    type: "berita",
    title: "Pelantikan Perangkat Desa Baru Oleh Kepala Desa",
    excerpt:
      "Lima pamong perangkat desa baru telah resmi dilantik dalam seremoni khidmat di Balai Pertemuan, disaksikan jajaran BPD dan tokoh masyarakat.",
    date: "13 Mei 2026",
    tag: "Pemerintahan",
    emoji: "🏛️",
  },
];

const typeConfig = {
  pengumuman: {
    label: "Pengumuman",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-blue-600",
  },
  berita: {
    label: "Berita",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-600",
  },
  kegiatan: {
    label: "Kegiatan",
    badge: "bg-slate-50 text-blue-600 border-slate-200",
    dot: "bg-blue-500",
  },
};

const mapPengumumanToNewsItem = (item: PengumumanApiItem): NewsItem => ({
  id: String(item.id),
  type: "pengumuman",
  title: item.judul,
  excerpt: item.deskripsi,
  date: item.tanggal,
  tag: item.kategori,
  emoji: "📢",
  important: item.prioritas === "tinggi",
  link: item.link,
  image: item.gambar,
});

const ITEMS_PER_PAGE = 3;
const EASE_LIQUID = [0.25, 1, 0.5, 1] as const;

export default function NewsAnnouncements() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(newsData);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchPengumuman = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/pengumuman?limit=6",
        );
        const result = await response.json();

        if (result.success) {
          setNewsItems(result.data.map(mapPengumumanToNewsItem));
        }
      } catch (error) {
        console.error("Gagal mengambil data pengumuman:", error);
      }
    };

    fetchPengumuman();
  }, []);

  const totalPages = Math.ceil(newsItems.length / ITEMS_PER_PAGE);
  const visibleItems = newsItems.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
  );
  const importantItems = newsItems.filter((n) => n.important);

  const handlePageChange = (newPage: number) => {
    setDirection(newPage > page ? 1 : -1);
    setPage(newPage);
  };

  return (
    <section className="py-20 bg-white w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
              {/* FIXED: Menggunakan <Megaphone /> sesuai nama import */}
              <Megaphone className="w-3.5 h-3.5 text-blue-600" />
              <p className="text-[11px] font-bold tracking-wider text-blue-700 uppercase">
                Pusat Informasi
              </p>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Berita & Beranda Kabar Desa
            </h2>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed">
              Dapatkan berita aktual, agenda kegiatan masyarakat, dan siaran
              pengumuman resmi langsung dari birokrasi pemerintahan desa.
            </p>
          </div>

          <a
            href="/pengumuman"
            className="group flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors py-2 w-fit"
          >
            <span>Lihat Semua Informasi</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>

        {/* Ticker / Running Text Pengumuman Penting */}
        {importantItems.length > 0 && (
          <div className="mb-10 flex items-center gap-4 bg-rose-50 border border-rose-100 rounded-2xl px-5 py-3.5 overflow-hidden shadow-[0_2px_10px_-4px_rgba(244,63,94,0.1)]">
            <div className="flex items-center gap-2 shrink-0 border-r border-rose-200/60 pr-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <Bell className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-black text-rose-700 uppercase tracking-wider">
                SIARAN DARURAT
              </span>
            </div>

            <div className="flex-1 overflow-hidden relative">
              <div className="flex gap-12 animate-marquee whitespace-nowrap">
                {[...importantItems, ...importantItems].map((item, i) => (
                  <span
                    key={i}
                    className="text-[13px] font-semibold text-rose-900 flex items-center gap-2"
                  >
                    <span>{item.emoji}</span>
                    <span className="hover:underline cursor-pointer">
                      {item.title}
                    </span>
                    {i < importantItems.length * 2 - 1 && (
                      <span className="ml-8 text-rose-300 font-normal">│</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid Box Container with Liquid Animations */}
        <div className="relative overflow-hidden min-h-[380px]">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.5, ease: EASE_LIQUID }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {visibleItems.map((item) => {
                const cfg = typeConfig[item.type];
                return (
                  <a
                    key={item.id}
                    href={item.link || `/pengumuman/${item.id}`}
                    className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 shadow-[0_3px_10px_-4px_rgba(0,0,0,0.03)] hover:border-blue-500/40 hover:shadow-[0_16px_32px_-12px_rgba(37,99,235,0.08)] transition-all duration-300 overflow-hidden no-underline"
                  >
                    {/* Card Media Header */}
                    <div className="relative h-44 bg-gradient-to-br from-blue-50/40 to-slate-100/70 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.12 }}
                          transition={{ duration: 0.4, ease: EASE_LIQUID }}
                          className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center text-4xl select-none"
                        >
                          {item.emoji}
                        </motion.div>
                      )}

                      {/* Type Badge Floating */}
                      {/* <div
                        className={`absolute top-4 left-4 flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border bg-white ${cfg.badge}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                        />
                        {cfg.label}
                      </div> */}

                      {item.important && (
                        <div className="absolute top-4 right-4 bg-rose-600 text-white text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                          PENTING
                        </div>
                      )}
                    </div>

                    {/* Card Body Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Meta Data */}
                        <div className="flex items-center gap-4 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {item.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            {item.tag}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {item.title}
                        </h3>

                        <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-3 font-normal">
                          {item.excerpt}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-50 text-xs font-bold text-blue-600 flex items-center gap-1">
                        <span>Baca Selengkapnya</span>
                        <svg
                          className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Buttons Layout */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12 border-t border-slate-100 pt-6">
            <button
              onClick={() => handlePageChange(Math.max(0, page - 1))}
              disabled={page === 0}
              className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === page
                      ? "bg-blue-600 w-6"
                      : "bg-slate-200 w-2 hover:bg-slate-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages - 1, page + 1))
              }
              disabled={page === totalPages - 1}
              className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Global Style Injector for Marquee effect */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
