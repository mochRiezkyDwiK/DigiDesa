import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  X,
  MapPin,
  Calendar,
  User,
  Image as ImageIcon,
  FileText,
  Loader2,
  Save,
  AlertCircle,
} from "lucide-react";
import StatusTimeline from "./StatusTimeline";

const STATUS_OPTIONS = ["BARU", "DITUGASKAN", "PROSES", "SELESAI"];

interface LaporanData {
  id: number;
  title: string;
  description: string;
  location: string;
  priority: string;
  status: string;
  bukti_visual: string | null;
  catatan_petugas: string | null;
  created_at: string;
  user?: { nama_lengkap?: string; username?: string };
  petugas?: { id: number; nama_lengkap: string } | null;
}

interface DetailLaporanModalProps {
  laporan: LaporanData | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function DetailLaporanModal({
  laporan,
  onClose,
  onUpdated,
}: DetailLaporanModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [catatan, setCatatan] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!laporan) return;
    setSelectedStatus(laporan.status);
    setCatatan(laporan.catatan_petugas || "");
    setSaveError(null);
    setSaveSuccess(false);
  }, [laporan]);

  const handleSave = async () => {
    if (!laporan) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const payload: Record<string, any> = {
        status: selectedStatus,
        catatan_petugas: catatan,
      };

      const res = await axios.patch(
        `http://localhost:5000/api/v1/admin/reports/${laporan.id}/progres`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSaveSuccess(true);
        onUpdated();
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || "Gagal menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {laporan && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-white rounded-[2rem] shadow-2xl shadow-slate-900/20 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 flex-shrink-0">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em]">
                  Detail Laporan Warga
                </p>
                <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                  {laporan.title}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    laporan.priority === "HIGH"
                      ? "bg-red-50 text-red-600 border-red-100"
                      : "bg-slate-50 text-slate-500 border-slate-100"
                  }`}
                >
                  {laporan.priority} Priority
                </span>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1">
              <div className="grid lg:grid-cols-[1fr_320px] h-full">
                {/* ── Kolom Kiri: Info + Foto + Form Petugas ── */}
                <div className="p-8 space-y-7 border-r border-slate-100">
                  {/* Meta info */}
                  <div className="flex flex-wrap gap-4 text-[11px] font-bold text-slate-500">
                    <div className="flex items-center gap-2">
                      <User size={13} />
                      <span>{laporan.user?.nama_lengkap || "Warga Anonim"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} />
                      <span>{laporan.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={13} />
                      <span>
                        {new Date(laporan.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Kronologi Laporan
                    </p>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-sm leading-relaxed text-slate-700 font-medium">
                        {laporan.description}
                      </p>
                    </div>
                  </div>

                  {/* Foto bukti */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Bukti Visual
                    </p>
                    {laporan.bukti_visual ? (
                      <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                        <img
                          src={`http://localhost:5000/public/uploads/${laporan.bukti_visual}`}
                          alt="Bukti laporan"
                          className="w-full max-h-64 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400">
                        <ImageIcon size={28} strokeWidth={1.5} />
                        <p className="text-xs font-bold">Tidak ada foto terlampir</p>
                      </div>
                    )}
                  </div>

                  {/* ── ADMIN FORM: Ubah Status & Catatan ── */}
                  <div className="pt-4 border-t border-slate-100 space-y-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
                      Panel Admin — Kelola Laporan
                    </p>

                    <div className="grid md:grid-cols-1 gap-4">
                      {/* Select Status */}
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-2">
                          Ubah Status
                        </label>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* ── PETUGAS FORM: Catatan Progres ── */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-2 flex items-center gap-2">
                        <FileText size={11} />
                        Catatan Progres Admin
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tuliskan perkembangan penanganan laporan ini secara detail..."
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-800 font-medium leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition placeholder:text-slate-300"
                      />
                    </div>

                    {/* Feedback messages */}
                    <AnimatePresence mode="wait">
                      {saveError && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600"
                        >
                          <AlertCircle size={14} />
                          {saveError}
                        </motion.div>
                      )}
                      {saveSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-600"
                        >
                          ✅ Perubahan berhasil disimpan!
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tombol Simpan */}
                    <motion.button
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-4 text-[13px] font-black uppercase tracking-wider text-white shadow-lg shadow-blue-600/20 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save size={15} />
                          Simpan Perubahan
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* ── Kolom Kanan: Status Timeline ── */}
                <div className="p-8 bg-slate-50/40">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                    Progres Penanganan
                  </p>
                  <StatusTimeline status={selectedStatus} />

                  {laporan.petugas && (
                    <div className="mt-10 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                        Admin Penangan
                      </p>
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${laporan.petugas.nama_lengkap}`}
                          className="w-10 h-10 rounded-xl border border-slate-100"
                          alt={laporan.petugas.nama_lengkap}
                        />
                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {laporan.petugas.nama_lengkap}
                          </p>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                            Admin Aktif
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {laporan.catatan_petugas && (
                    <div className="mt-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                        Catatan Terakhir
                      </p>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {laporan.catatan_petugas}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
