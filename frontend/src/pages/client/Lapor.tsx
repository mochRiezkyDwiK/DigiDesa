import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { EASE_SPRING } from "../../constants/animation";
import { 
  MessageSquare, 
  Camera, 
  MapPin, 
  Send, 
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Flag,
  Info,
  FileText
} from "lucide-react";
const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE_SPRING }
  })
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

export default function Lapor() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "Infrastruktur",
    deskripsi: "",
    lokasi: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2); // Pindah ke screen "Berhasil"
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] font-sans antialiased">
      <div className="flex lg:pl-72">
        {/* ── HEADER ── */}
        <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-50 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard-warga')}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Sistem Pengaduan</h1>
              <p className="text-sm text-gray-500">Pemerintah Desa</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <Info size={16} className="text-blue-600" />
            <p className="text-xs font-medium text-blue-800">Proses 3-5 hari kerja</p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-8 pt-16">
          {step === 1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
              <motion.div initial="hidden" animate="visible" variants={FADE_UP} custom={0} className="lg:col-span-2">
                <div className="mb-6">
                  <span className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-md">Layanan Pengaduan</span>
                </div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                  Buat Laporan Pengaduan
                </h2>
                <p className="text-gray-600 text-base mb-8 leading-relaxed">
                  Sampaikan keluhan atau aspirasi Anda kepada pemerintah desa. Setiap laporan akan ditindaklanjuti dalam waktu maksimal 3x24 jam.
                </p>
                
                <div className="space-y-4">
                  {[
                    { t: "Pilih Kategori", d: "Infrastruktur, Sosial, Keamanan", i: Flag, c: "red" },
                    { t: "Unggah Bukti", d: "Foto lokasi atau dokumen pendukung", i: Camera, c: "blue" },
                    { t: "Pantau Real-time", d: "Cek progres penanganan via dashboard", i: CheckCircle2, c: "emerald" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-${item.c}-50 flex items-center justify-center shrink-0`}>
                        <item.i className={`text-${item.c}-600`} size={18} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-black text-slate-900">{item.t}</h4>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Kanan: Form Laporan */}
              <motion.div initial="hidden" animate="visible" variants={FADE_UP} custom={1} className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl border border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] space-y-8">
                  
                  {/* Judul Laporan */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Laporan</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Contoh: Lampu Jalan Mati di Gang 3"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-red-500/20 transition-all"
                      value={formData.judul}
                      onChange={(e) => setFormData({...formData, judul: e.target.value})}
                    />
                  </div>

                  {/* Kategori & Lokasi */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                      <select 
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-red-500/20 transition-all appearance-none"
                        value={formData.kategori}
                        onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                      >
                        <option>Infrastruktur</option>
                        <option>Keamanan</option>
                        <option>Sosial</option>
                        <option>Lingkungan</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Lokasi</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                        <input 
                          type="text" 
                          placeholder="RT 01 / RW 10"
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-red-500/20 transition-all"
                          value={formData.lokasi}
                          onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Aduan</label>
                    <textarea 
                      rows={4}
                      placeholder="Jelaskan secara detail kendala yang dialami..."
                      className="w-full bg-slate-50 border-none rounded-[2rem] py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                    />
                  </div>

                  {/* Upload Foto */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Unggah Bukti Foto (Opsional)</label>
                    <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-8 flex flex-col items-center justify-center hover:border-red-200 transition-all cursor-pointer group">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-red-50 group-hover:scale-110 transition-all">
                        <ImageIcon className="text-slate-300 group-hover:text-red-500" size={24} />
                      </div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-tight">Klik untuk unggah atau seret file</p>
                      <p className="text-[9px] font-bold text-slate-300 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>

                  {/* Submit */}
                  <button 
                    type="submit"
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl text-sm shadow-xl shadow-slate-900/20 hover:bg-red-600 transition-all flex items-center justify-center gap-3"
                  >
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                    Kirim Laporan
                  </button>
                </form>
              </motion.div>
            </div>
          ) : (
            /* SUCCESS SCREEN */
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Laporan Terkirim!</h2>
              <p className="text-slate-500 text-sm mt-4 leading-relaxed font-medium">
                Terima kasih atas partisipasi Anda. Laporan sedang diulas oleh petugas desa dan Anda akan menerima notifikasi setiap ada perubahan status.
              </p>
              <div className="mt-12 space-y-4">
                <button 
                  onClick={() => navigate('/dashboard-warga')}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl text-sm"
                >
                  Kembali ke Dashboard
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="w-full py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-2xl text-sm hover:bg-slate-50 transition-colors"
                >
                  Buat Laporan Lain
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}