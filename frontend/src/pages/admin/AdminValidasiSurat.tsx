import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Files,
  Search,
  Clock,
  Eye,
  Download,
  ArrowLeft,
  Building2,
  LayoutDashboard,
  AlertTriangle,
  Users,
  BarChart3,
  Settings,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  LogOut,
} from "lucide-react";
import { EASE_SPRING } from "../../constants/animation";

const FADE_UP = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.05, ease: EASE_SPRING },
  }),
};

const getJenisSuratLabel = (jenis: string) => {
  if (jenis === "SKD") return "Surat Keterangan Domisili";
  if (jenis === "SKU") return "Surat Keterangan Usaha";
  if (jenis === "SKTM") return "Surat Keterangan Tidak Mampu";
  return jenis || "Jenis surat tidak diketahui";
};

const getStatusLabel = (status: string) => {
  if (status === "PENDING") return "Menunggu";
  if (status === "SELESAI") return "Selesai";
  if (status === "REJECTED") return "Ditolak";
  return status || "Tidak diketahui";
};

const formatDateTime = (value?: string) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeKeperluan = (text?: string) => {
  if (!text) return "Tidak ada keterangan keperluan.";

  const marker = "[ALASAN PENGAJUAN SURAT]";
  if (text.includes(marker)) {
    return text.split(marker)[1]?.trim() || "Tidak ada keterangan keperluan.";
  }

  return text
    .replace(/\[DATA DOMISILI OTOMATIS DARI DATABASE\]/gi, "")
    .replace(/Nama:.*$/gim, "")
    .replace(/NIK:.*$/gim, "")
    .replace(/Alamat:.*$/gim, "")
    .replace(/RT\/RW:.*$/gim, "")
    .trim() || "Tidak ada keterangan keperluan.";
};

const getStatusBadgeClass = (status: string) => {
  if (status === "SELESAI") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "REJECTED") return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export default function AdminValidasiSurat() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const [suratList, setSuratList] = useState<any[]>([]);
  const [selectedSurat, setSelectedSurat] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const token = localStorage.getItem("token");

  const fetchAntreanSurat = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get("http://localhost:5000/api/v1/surat/admin/antrean", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSuratList(response.data.data);
      }
    } catch (error) {
      console.error("GAGAL FETCHING ANTREAN SURAT ADMIN:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAntreanSurat();
  }, [token]);

  const handleVerifySurat = async (id: number, statusTarget: "SELESAI" | "REJECTED") => {
    if (statusTarget === "REJECTED" && !rejectReason.trim()) {
      alert("Wajib mengisi alasan penolakan berkas surat warga!");
      return;
    }

    setBtnLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/surat/admin/verify/${id}`,
        {
          status: statusTarget,
          alasan_ditolak: statusTarget === "REJECTED" ? rejectReason : "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert(`Sukses! Berkas permohonan berhasil diubah menjadi [${statusTarget}]`);
        setSelectedSurat(null);
        setRejectReason("");
        fetchAntreanSurat();
      }
    } catch (error: any) {
      console.error("ERROR VERIFY SURAT AT FE ADMIN:", error);
      alert(error.response?.data?.message || "Gagal memproses keputusan surat");
    } finally {
      setBtnLoading(false);
    }
  };

  const filteredSurat = suratList.filter((s) => {
    const matchTab =
      tab === "Semua" ||
      (tab === "Pending" && s.status === "PENDING") ||
      (tab === "Selesai" && s.status === "SELESAI") ||
      (tab === "Ditolak" && s.status === "REJECTED");

    const searchLower = searchQuery.toLowerCase();

    const matchSearch =
      s.user?.nama_lengkap?.toLowerCase().includes(searchLower) ||
      s.user?.nik?.includes(searchLower) ||
      s.no_surat?.toLowerCase().includes(searchLower);

    return matchTab && matchSearch;
  });

  const totalPending = suratList.filter((s) => s.status === "PENDING").length;
  const totalSelesai = suratList.filter((s) => s.status === "SELESAI").length;
  const totalDitolak = suratList.filter((s) => s.status === "REJECTED").length;

  const menuItems = [
    { n: "Overview", i: LayoutDashboard, p: "/admin" },
    { n: "Validasi Surat", i: Files, p: "/admin/validasi", active: true },
    { n: "Moderasi Lapor", i: AlertTriangle, p: "/admin/laporan" },
    { n: "Data Penduduk", i: Users, p: "/admin/penduduk" },
    { n: "Keuangan Desa", i: BarChart3, p: "/admin/keuangan" },
    { n: "Pengaturan", i: Settings, p: "/admin/pengaturan" },
  ];

const handleDownloadSurat = (surat: any) => {
  if (!surat || surat.status !== "SELESAI") {
    alert("Surat belum selesai, belum bisa diunduh.");
    return;
  }

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Pop-up diblokir browser. Izinkan pop-up untuk mengunduh surat.");
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>${surat.no_surat || "Surat Resmi"}</title>
        <style>
          body { font-family: "Times New Roman", serif; padding: 40px; }
          .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; }
          .judul { text-align: center; margin-top: 30px; font-weight: bold; text-decoration: underline; }
          .nomor { text-align: center; margin-bottom: 30px; }
          .isi { margin-top: 24px; line-height: 1.7; font-size: 16px; }
          .row { display: flex; margin: 6px 0; }
          .label { width: 160px; }
          .ttd { margin-top: 70px; display: flex; justify-content: flex-end; }
          .ttd-box { width: 240px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="kop">
          <h3>PEMERINTAH DESA DIGITAL</h3>
          <h4>KECAMATAN MAJU BERSAMA</h4>
          <p>Jl. Desa Digital No. 01</p>
        </div>

        <div class="judul">${getJenisSuratLabel(surat.jenis_surat).toUpperCase()}</div>
        <div class="nomor">Nomor: ${surat.no_surat || "-"}</div>

        <div class="isi">
          <p>Yang bertanda tangan di bawah ini menerangkan bahwa:</p>

          <div class="row"><div class="label">Nama</div><div>: ${surat.user?.nama_lengkap || "-"}</div></div>
          <div class="row"><div class="label">NIK</div><div>: ${surat.user?.nik || "-"}</div></div>
          <div class="row"><div class="label">Alamat</div><div>: ${surat.user?.alamat || "-"}</div></div>
          <div class="row"><div class="label">RT/RW</div><div>: ${surat.user?.rt || "-"} / ${surat.user?.rw || "-"}</div></div>

          <p>
            Adalah benar warga yang berdomisili di wilayah tersebut dan surat ini dibuat
            untuk keperluan: <b>${normalizeKeperluan(surat.keperluan)}</b>.
          </p>
          <p>Demikian surat keterangan ini dibuat untuk digunakan sebagaimana mestinya.</p>
        </div>

        <div class="ttd">
          <div class="ttd-box">
            <p>Desa Digital, ${new Date().toLocaleDateString("id-ID")}</p>
            <p>Kepala Desa</p>
            <br/><br/><br/>
            <p><b><u>H. Ahmad Subarjo</u></b></p>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased flex">
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen z-50">
        <div
          className="px-7 py-7 flex items-center gap-3 cursor-pointer border-b border-slate-100"
          onClick={() => navigate("/admin")}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>

          <div>
            <p className="font-bold text-slate-900 tracking-tight leading-none">
              DigiDesa
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Panel Admin Desa
            </p>
          </div>
        </div>

        <nav className="flex-1 px-5 py-6 space-y-1.5">
          <p className="px-3 mb-3 text-xs font-semibold text-slate-400">
            Navigasi
          </p>

          {menuItems.map((item) => {
            const Icon = item.i;

            return (
              <button
                key={item.n}
                onClick={() => item.p !== "#" && navigate(item.p)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  item.active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} strokeWidth={item.active ? 2.6 : 2.2} />
                {item.n}
              </button>
            );
          })}
        </nav>

        <div className="p-5 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Keluar Sistem
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="h-20 bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-40 px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => navigate("/admin")}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-950 tracking-tight truncate">
                Validasi Surat Masuk
              </h1>
              <p className="text-sm text-slate-500 mt-1 truncate">
                Kelola permohonan surat warga, proses persetujuan, dan arsip digital.
              </p>
            </div>
          </div>

          <div className="relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari nama, NIK, atau nomor surat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </header>

        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.button
              type="button"
              onClick={() => setTab("Pending")}
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              custom={0}
              className={`text-left bg-white rounded-2xl border p-6 transition-all ${
                tab === "Pending"
                  ? "border-amber-300 bg-amber-50"
                  : "border-slate-200 hover:border-amber-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Menunggu validasi
                  </p>
                  <h3 className="text-3xl font-bold text-slate-950 mt-2">
                    {totalPending}
                  </h3>
                </div>

                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock size={20} />
                </div>
              </div>

              <p className="text-xs font-medium text-slate-500 mt-4">
                Surat yang belum diproses admin.
              </p>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setTab("Selesai")}
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              custom={1}
              className={`text-left bg-white rounded-2xl border p-6 transition-all ${
                tab === "Selesai"
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200 hover:border-emerald-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Surat selesai
                  </p>
                  <h3 className="text-3xl font-bold text-slate-950 mt-2">
                    {totalSelesai}
                  </h3>
                </div>

                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <p className="text-xs font-medium text-slate-500 mt-4">
                Surat yang sudah diterbitkan.
              </p>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setTab("Ditolak")}
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              custom={2}
              className={`text-left bg-white rounded-2xl border p-6 transition-all ${
                tab === "Ditolak"
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 hover:border-red-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Surat ditolak
                  </p>
                  <h3 className="text-3xl font-bold text-slate-950 mt-2">
                    {totalDitolak}
                  </h3>
                </div>

                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <XCircle size={20} />
                </div>
              </div>

              <p className="text-xs font-medium text-slate-500 mt-4">
                Surat yang perlu diperbaiki warga.
              </p>
            </motion.button>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Daftar Permohonan Surat
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Menampilkan {filteredSurat.length} data dari total {suratList.length} permohonan.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative md:hidden">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari nama atau NIK..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>

                <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
                  {["Semua", "Pending", "Selesai", "Ditolak"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTab(item)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                        tab === item
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-hidden">
              <table className="w-full table-fixed text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="w-[36%] px-5 py-4 text-xs font-semibold text-slate-500">
                      Informasi warga
                    </th>
                    <th className="w-[28%] px-5 py-4 text-xs font-semibold text-slate-500">
                      Jenis surat
                    </th>
                    <th className="w-[16%] px-5 py-4 text-xs font-semibold text-slate-500">
                      Status
                    </th>
                    <th className="w-[20%] px-5 py-4 text-xs font-semibold text-slate-500 text-center">
                      Tindakan
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence mode="popLayout">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                          <p className="text-sm font-semibold text-slate-500 mt-3">
                            Memuat data surat...
                          </p>
                        </td>
                      </tr>
                    ) : filteredSurat.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <p className="text-sm font-semibold text-slate-500">
                            Tidak ada antrean surat ditemukan.
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Coba ubah tab status atau kata kunci pencarian.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredSurat.map((surat) => (
                        <motion.tr
                          key={surat.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                                {(surat.user?.nama_lengkap || "W").charAt(0)}
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-950 truncate">
                                  {surat.user?.nama_lengkap || "Warga Tanpa Nama"}
                                </p>

                                <p className="text-xs text-slate-500 mt-1 truncate">
                                  NIK: {surat.user?.nik || "-"} • RT {surat.user?.rt || "00"}/RW{" "}
                                  {surat.user?.rw || "00"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                {getJenisSuratLabel(surat.jenis_surat)}
                              </p>

                              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 truncate">
                                <Clock size={12} className="shrink-0" />
                                <span className="truncate">
                                  {new Date(surat.tgl_diajukan).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold border ${
                                surat.status === "SELESAI"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                  : surat.status === "REJECTED"
                                    ? "bg-red-50 text-red-700 border-red-100"
                                    : "bg-amber-50 text-amber-700 border-amber-100"
                              }`}
                            >
                              {getStatusLabel(surat.status)}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedSurat(surat)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition-all"
                              >
                                <Eye size={14} />
                                Detail
                              </button>

                              {surat.status === "SELESAI" && (
                                <button
                                  onClick={() => handleDownloadSurat(surat)}
                                  className="w-8 h-8 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                                >
                                  <Download size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Total antrean saat ini: <span className="font-semibold text-slate-900">{filteredSurat.length}</span> surat
              </p>

              <button
                type="button"
                onClick={fetchAntreanSurat}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Refresh data
              </button>
            </div>
          </section>
        </div>
      </main>

      <AnimatePresence>
        {selectedSurat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSurat(null)}
              className="fixed inset-0 bg-slate-950 z-50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-slate-100 shadow-2xl z-50 flex flex-col font-sans text-slate-800"
            >
              <div className="px-6 py-5 border-b border-slate-200 bg-white flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    Preview Surat Resmi
                  </p>
                  <h3 className="text-xl font-bold text-slate-950 tracking-tight mt-1">
                    Detail Permohonan Surat
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    ID Referensi: #{selectedSurat.id}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedSurat(null)}
                  className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 text-slate-950">
                  <div className="flex items-center gap-4 border-b-4 border-slate-900 pb-4">
                    <div className="w-16 h-16 rounded-full border-2 border-blue-700 bg-blue-50 flex items-center justify-center shrink-0">
                      <Building2 className="w-8 h-8 text-blue-700" />
                    </div>

                    <div className="flex-1 text-center">
                      <p className="text-base font-extrabold uppercase tracking-wide">
                        Pemerintah Kabupaten Desa Digital
                      </p>
                      <p className="text-sm font-bold uppercase mt-1">
                        Kecamatan Maju Bersama
                      </p>
                      <p className="text-sm font-bold uppercase mt-1">
                        Desa Makmur Sentosa
                      </p>
                      <p className="text-[11px] text-slate-500 mt-2">
                        Jl. Desa Makmur No. 01, Kec. Maju Bersama, Kab. Desa Digital 12345
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <h2 className="text-lg font-extrabold underline underline-offset-4 uppercase">
                      {getJenisSuratLabel(selectedSurat.jenis_surat)}
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 mt-2">
                      Nomor: {selectedSurat.no_surat || "Belum diterbitkan"}
                    </p>
                  </div>

                  <div className="mt-7 space-y-6 text-sm">
                    <section>
                      <h4 className="font-extrabold uppercase text-slate-900 mb-3">
                        A. Data Pemohon
                      </h4>
                      <div className="grid grid-cols-[140px_12px_1fr] gap-y-2 text-slate-700">
                        <span>Nama Lengkap</span>
                        <span>:</span>
                        <span className="font-semibold text-slate-950">
                          {selectedSurat.user?.nama_lengkap || "Warga Tanpa Nama"}
                        </span>

                        <span>NIK</span>
                        <span>:</span>
                        <span>{selectedSurat.user?.nik || "-"}</span>

                        <span>Alamat</span>
                        <span>:</span>
                        <span>{selectedSurat.user?.alamat || "-"}</span>

                        <span>RT / RW</span>
                        <span>:</span>
                        <span>
                          {selectedSurat.user?.rt || "00"} / {selectedSurat.user?.rw || "00"}
                        </span>
                      </div>
                    </section>

                    <section>
                      <h4 className="font-extrabold uppercase text-slate-900 mb-3">
                        B. Informasi Surat
                      </h4>
                      <div className="grid grid-cols-[140px_12px_1fr] gap-y-2 text-slate-700">
                        <span>Jenis Surat</span>
                        <span>:</span>
                        <span className="font-semibold text-slate-950">
                          {getJenisSuratLabel(selectedSurat.jenis_surat)}
                        </span>

                        <span>Tanggal Pengajuan</span>
                        <span>:</span>
                        <span>{formatDateTime(selectedSurat.tgl_diajukan)}</span>

                        <span>Status</span>
                        <span>:</span>
                        <span>
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusBadgeClass(selectedSurat.status)}`}
                          >
                            {getStatusLabel(selectedSurat.status)}
                          </span>
                        </span>

                        <span>Tanggal Terbit</span>
                        <span>:</span>
                        <span>{formatDateTime(selectedSurat.tgl_disetujui)}</span>
                      </div>
                    </section>

                    <section>
                      <h4 className="font-extrabold uppercase text-slate-900 mb-3">
                        C. Alasan / Keperluan
                      </h4>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 whitespace-pre-line leading-relaxed text-slate-700">
                        {normalizeKeperluan(selectedSurat.keperluan)}
                      </div>
                    </section>

                    {selectedSurat.status === "SELESAI" && (
                      <section>
                        <h4 className="font-extrabold uppercase text-slate-900 mb-3">
                          D. Arsip Digital
                        </h4>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                          <p className="text-xs font-bold uppercase text-emerald-700">
                            Token QR Surat
                          </p>
                          <p className="text-xs font-mono break-all mt-2 text-slate-900">
                            {selectedSurat.token_qr || "Token belum tersedia"}
                          </p>
                        </div>
                      </section>
                    )}

                    {selectedSurat.status === "REJECTED" && (
                      <section>
                        <h4 className="font-extrabold uppercase text-slate-900 mb-3">
                          D. Alasan Penolakan
                        </h4>
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900 leading-relaxed">
                          {selectedSurat.alasan_ditolak || "Tidak ada alasan penolakan tersimpan."}
                        </div>
                      </section>
                    )}

                    {selectedSurat.status === "PENDING" && (
                      <section>
                        <h4 className="font-extrabold uppercase text-slate-900 mb-3">
                          D. Catatan Validasi
                        </h4>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Isi catatan jika surat akan ditolak. Contoh: Keperluan kurang jelas atau data warga belum lengkap."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium h-24 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10 resize-none transition-all text-sm text-slate-800"
                        />
                      </section>
                    )}

                    <section className="pt-3">
                      <div className="flex justify-between gap-8 text-sm text-slate-700">
                        <div className="text-center flex-1">
                          <p>Mengetahui,</p>
                          <p className="font-semibold mt-1">Kepala Desa</p>
                          <div className="h-16" />
                          <p className="font-bold underline underline-offset-4">Mas Bahlil Ganteng</p>
                        </div>

                        <div className="text-center flex-1">
                          <p>Petugas Validasi,</p>
                          <p className="font-semibold mt-1">Admin Desa</p>
                          <div className="h-16" />
                          <p className="font-bold underline underline-offset-4">DigiDesa</p>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-slate-200 bg-white">
                {selectedSurat.status === "PENDING" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      disabled={btnLoading}
                      onClick={() => handleVerifySurat(selectedSurat.id, "REJECTED")}
                      className="w-full py-3 border border-red-200 bg-red-50 text-red-700 font-semibold text-sm rounded-xl hover:bg-red-600 hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {btnLoading ? "Memproses..." : "Tolak Permohonan"}
                    </button>

                    <button
                      disabled={btnLoading}
                      onClick={() => handleVerifySurat(selectedSurat.id, "SELESAI")}
                      className="w-full py-3 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {btnLoading ? "Memproses..." : "Setujui & Terbitkan"}
                    </button>
                  </div>
                ) : (
                  <div className="w-full py-3 text-center bg-slate-100 text-slate-500 text-sm font-semibold rounded-xl">
                    Berkas ini sudah dikunci sistem
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}