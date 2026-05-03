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
    <div className="min-h-screen bg-[#FDFEFF] font-sans antialiased pb-20">
      
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
          <p className="text-xs font-medium text-blue-800">Data Anda terlindungi</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 pt-16">
        {step === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            
            {/* Kiri: Informasi Layanan */}
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
                  { t: "Isi Formulir", d: "Lengkapi data pengaduan dengan benar", i: FileText, c: "blue" },
                  { t: "Lampirkan Bukti", d: "Tambahkan foto atau dokumen pendukung", i: Camera, c: "green" },
                  { t: "Pantau Status", d: "Ikuti perkembangan penanganan laporan", i: CheckCircle2, c: "blue" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${item.c}-50 flex items-center justify-center shrink-0`}>
                      <item.i className={`text-${item.c}-600`} size={18} strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{item.t}</h4>
                      <p className="text-xs text-gray-500">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Kanan: Form Laporan */}
            <motion.div initial="hidden" animate="visible" variants={FADE_UP} custom={1} className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
                
                {/* Judul Laporan */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Judul Laporan *</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Contoh: Lampu jalan mati di RT 01"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.judul}
                    onChange={(e) => setFormData({...formData, judul: e.target.value})}
                  />
                </div>

                {/* Kategori & Lokasi */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Kategori *</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.kategori}
                      onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                    >
                      <option>Infrastruktur</option>
                      <option>Keamanan</option>
                      <option>Sosial</option>
                      <option>Lingkungan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Lokasi *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="RT 01 / RW 10"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={formData.lokasi}
                        onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Deskripsi Aduan *</label>
                  <textarea 
                    rows={4}
                    placeholder="Jelaskan secara detail masalah yang dilaporkan..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  />
                </div>

                {/* Upload Foto */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Lampiran Foto (Opsional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-400 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-3 hover:bg-blue-50 transition-colors">
                      <ImageIcon className="text-gray-400 hover:text-blue-500" size={24} />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Klik untuk unggah atau seret file</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG maksimal 10MB</p>
                  </div>
                </div>

                {/* Submit */}
                <button 
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={16} /> 
                  Kirim Laporan
                </button>
              </form>
            </motion.div>
          </div>
        ) : (
          /* SUCCESS SCREEN */
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Laporan Terkirim</h2>
            <p className="text-gray-600 text-base mb-8 leading-relaxed">
              Terima kasih atas pengaduan Anda. Laporan sedang ditinjau oleh petugas dan akan ditindaklanjuti sesuai prosedur yang berlaku.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/dashboard-warga')}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Kembali ke Dashboard
              </button>
              <button 
                onClick={() => setStep(1)}
                className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Buat Laporan Baru
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}