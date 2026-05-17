import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Files,
  AlertTriangle,
  Users,
  BarChart3,
  XCircle,
  Search,
  Bell,
  Filter,
  Download,
  Building2,
  Settings,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { EASE_SPRING } from "../../constants/animation";

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: EASE_SPRING },
  }),
};

const SUMMARY_STATS = [
  {
    label: "Total Penduduk",
    value: "4.821",
    sub: "+12 data bulan ini",
    icon: Users,
    tone: "blue",
  },
  {
    label: "Pengajuan Surat",
    value: "42",
    sub: "18 menunggu validasi",
    icon: Files,
    tone: "indigo",
  },
  {
    label: "Aduan Publik",
    value: "7",
    sub: "3 perlu ditindaklanjuti",
    icon: AlertTriangle,
    tone: "amber",
  },
  {
    label: "Realisasi Anggaran",
    value: "92%",
    sub: "periode berjalan",
    icon: BarChart3,
    tone: "emerald",
  },
];

const PENDING_SURAT = [
  {
    id: "SKD-841",
    nama: "Budi Santoso",
    tipe: "Keterangan Domisili",
    tgl: "10 menit lalu",
    wilayah: "RT 01 / RW 10",
  },
  {
    id: "SKU-902",
    nama: "Siti Aminah",
    tipe: "Izin Usaha",
    tgl: "25 menit lalu",
    wilayah: "RT 03 / RW 10",
  },
  {
    id: "SKTM-221",
    nama: "Rahmat Hidayat",
    tipe: "Keterangan Tidak Mampu",
    tgl: "1 jam lalu",
    wilayah: "RT 02 / RW 10",
  },
];

const toneMap: Record<
  string,
  {
    iconBox: string;
    icon: string;
    active: string;
    soft: string;
  }
> = {
  blue: {
    iconBox: "bg-blue-50",
    icon: "text-blue-600",
    active: "text-blue-700",
    soft: "bg-blue-50 text-blue-700 border-blue-100",
  },
  indigo: {
    iconBox: "bg-indigo-50",
    icon: "text-indigo-600",
    active: "text-indigo-700",
    soft: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  amber: {
    iconBox: "bg-amber-50",
    icon: "text-amber-600",
    active: "text-amber-700",
    soft: "bg-amber-50 text-amber-700 border-amber-100",
  },
  emerald: {
    iconBox: "bg-emerald-50",
    icon: "text-emerald-600",
    active: "text-emerald-700",
    soft: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Overview");

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/admin" },
    { name: "Validasi Surat", icon: Files, path: "/admin/validasi" },
    { name: "Moderasi Lapor", icon: AlertTriangle, path: "/admin/laporan" },
    { name: "Data Penduduk", icon: Users, path: "/admin/penduduk" },
    { name: "Keuangan Desa", icon: BarChart3, path: "/admin/keuangan" },
    { name: "Pengaturan", icon: Settings, path: "/admin/pengaturan" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased flex">
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen z-50">
        <div className="px-7 py-7 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <Building2 className="w-5 h-5 text-white" />
          </div>

          <div>
            <p className="font-black text-slate-900 tracking-tight leading-none">
              DigiDesa
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">
              Panel Admin Desa
            </p>
          </div>
        </div>

        <nav className="flex-1 px-5 py-6 space-y-1.5">
          <p className="px-3 mb-3 text-[11px] font-bold text-slate-400">
            Navigasi
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMenu(item.name);
                  navigate(item.path);
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} strokeWidth={isActive ? 2.7 : 2.2} />
                  {item.name}
                </span>

                {isActive && <ChevronRight size={16} strokeWidth={2.5} />}
              </button>
            );
          })}
        </nav>

        <div className="p-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                <ShieldCheck className="text-emerald-600" size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Akses Admin Aktif
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Semua aktivitas validasi dan perubahan data tercatat di sistem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-40 px-6 lg:px-10 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-950">
              Ringkasan Administrasi
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Pantau layanan warga, surat masuk, laporan, dan keuangan desa.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari nama, NIK, atau surat..."
                className="w-72 bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>

            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all">
              <Bell size={19} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">
                  H. Ahmad Subarjo
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Kepala Desa
                </p>
              </div>

              <img
                className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-100"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lurah"
                alt="Admin"
              />
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {SUMMARY_STATS.map((item, index) => {
              const Icon = item.icon;
              const tone = toneMap[item.tone];

              return (
                <motion.div
                  key={item.label}
                  initial="hidden"
                  animate="visible"
                  variants={FADE_UP}
                  custom={index}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tone.iconBox}`}>
                      <Icon className={tone.icon} size={22} strokeWidth={2.5} />
                    </div>

                    <span className="text-[11px] font-semibold text-slate-400">
                      Hari ini
                    </span>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-500">
                      {item.label}
                    </p>
                    <h3 className="text-3xl font-black tracking-tight text-slate-950 mt-1">
                      {item.value}
                    </h3>
                    <p className={`inline-flex mt-3 px-2.5 py-1 rounded-lg border text-xs font-semibold ${tone.soft}`}>
                      {item.sub}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              custom={4}
              className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    Surat Menunggu Validasi
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Pengajuan terbaru dari warga yang perlu diperiksa.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    <Filter size={14} />
                    Filter
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 rounded-xl text-xs font-bold text-white hover:bg-blue-700 transition-all">
                    <Download size={14} />
                    Ekspor
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="text-left bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500">
                        Pemohon
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500">
                        Jenis Surat
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500">
                        Nomor Draft
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {PENDING_SURAT.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-black text-slate-600">
                              {row.nama.charAt(0)}
                            </div>

                            <div>
                              <p className="text-sm font-bold text-slate-950">
                                {row.nama}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {row.wilayah} • {row.tgl}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                            {row.tipe}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold text-slate-700">
                            {row.id}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all">
                              Setujui
                            </button>

                            <button className="w-9 h-9 bg-white text-slate-400 rounded-xl hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-100 transition-all flex items-center justify-center">
                              <XCircle size={18} strokeWidth={2.4} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <p className="text-sm text-slate-500">
                  Menampilkan {PENDING_SURAT.length} pengajuan terbaru.
                </p>

                <button
                  onClick={() => navigate("/admin/validasi")}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  Buka validasi surat
                </button>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              custom={5}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                    <AlertTriangle size={21} className="text-red-600" strokeWidth={2.6} />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-950">
                      Laporan Prioritas
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Aduan warga yang perlu dipantau hari ini.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="inline-flex text-xs font-bold text-red-700 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
                    Prioritas tinggi
                  </span>

                  <h4 className="text-sm font-black text-slate-950 mt-3">
                    Jembatan Blok D Retak
                  </h4>

                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Dilaporkan oleh warga RT 02. Perlu pengecekan lapangan agar status dapat segera diperbarui.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/admin/laporan")}
                  className="w-full mt-5 py-3 bg-slate-950 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                >
                  Buka laporan warga
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <BarChart3 size={21} className="text-emerald-600" strokeWidth={2.6} />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-950">
                      Status Finansial
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Ringkasan kas dan realisasi anggaran.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-500">
                      Penyerapan dana
                    </span>
                    <span className="text-emerald-600">
                      92.4%
                    </span>
                  </div>

                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "92.4%" }}
                      transition={{ duration: 0.8, ease: EASE_SPRING }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="mt-6 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-700">
                    Total kas masuk tahun ini
                  </p>
                  <p className="text-2xl font-black text-slate-950 mt-1">
                    Rp 1.200.000.000
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Data sementara periode 2026.
                  </p>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
}