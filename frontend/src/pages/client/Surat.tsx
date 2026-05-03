import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { EASE_SPRING } from "../../constants/animation";
import { 
  FileText, 
  ArrowLeft,
  Send,
  CheckCircle2,
  User,
  MapPin,
  Phone,
  Calendar,
  Building,
  Info,
  Download
} from "lucide-react";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE_SPRING }
  })
};

export default function Surat() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jenisSurat: "",
    namaLengkap: "",
    nik: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    rt: "",
    rw: "",
    keperluan: "",
    noHp: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2); // Pindah ke screen "Berhasil"
  };

  const jenisSuratOptions = [
    { value: "sktm", label: "Surat Keterangan Tidak Mampu (SKTM)", desc: "Untuk keperluan bantuan sosial" },
    { value: "skd", label: "Surat Keterangan Domisili", desc: "Bukti tempat tinggal" },
    { value: "skck", label: "Surat Pengantar SKCK", desc: "Untuk keperluan kepolisian" },
    { value: "sku", label: "Surat Keterangan Usaha", desc: "Bukti kepemilikan usaha" },
    { value: "skp", label: "Surat Keterangan Penghasilan", desc: "Bukti penghasilan" },
    { value: "skn", label: "Surat Keterangan Kelahiran", desc: "Bukti kelahiran" },
    { value: "skw", label: "Surat Keterangan Wali", desc: "Untuk keperluan wali hukum" },
    { value: "lainnya", label: "Lainnya", desc: "Jenis surat lainnya" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased pb-20">
      
      {/* ── HEADER ── */}
      <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/layanan')}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Pembuatan Surat</h1>
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
            
            {/* Kiri: Informasi Layanan */}
            <motion.div initial="hidden" animate="visible" variants={FADE_UP} custom={0} className="lg:col-span-2">
              <div className="mb-6">
                <span className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-md">Layanan Surat-Menyurat</span>
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                Ajukan Pembuatan Surat
              </h2>
              <p className="text-gray-600 text-base mb-8 leading-relaxed">
                Permohonan surat keterangan dari pemerintah desa dapat diajukan secara online. Proses verifikasi akan dilakukan maksimal 3-5 hari kerja.
              </p>
              
              <div className="space-y-4">
                {[
                  { t: "Pilih Jenis Surat", d: "Pilih jenis surat yang dibutuhkan", i: FileText, c: "blue" },
                  { t: "Lengkapi Data", d: "Isi form dengan data yang valid", i: User, c: "green" },
                  { t: "Tunggu Verifikasi", d: "Proses oleh admin desa", i: CheckCircle2, c: "blue" },
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

            {/* Kanan: Form Permohonan */}
            <motion.div initial="hidden" animate="visible" variants={FADE_UP} custom={1} className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
                
                {/* Jenis Surat */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Jenis Surat *</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.jenisSurat}
                    onChange={(e) => setFormData({...formData, jenisSurat: e.target.value})}
                    required
                  >
                    <option value="">Pilih jenis surat</option>
                    {jenisSuratOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Data Pemohon */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Data Pemohon</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Nama Lengkap *</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={formData.namaLengkap}
                        onChange={(e) => setFormData({...formData, namaLengkap: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">NIK *</label>
                      <input 
                        type="text" 
                        maxLength={16}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={formData.nik}
                        onChange={(e) => setFormData({...formData, nik: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Tempat Lahir *</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={formData.tempatLahir}
                        onChange={(e) => setFormData({...formData, tempatLahir: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Tanggal Lahir *</label>
                      <input 
                        type="date" 
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={formData.tanggalLahir}
                        onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">No. HP *</label>
                      <input 
                        type="tel" 
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={formData.noHp}
                        onChange={(e) => setFormData({...formData, noHp: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Alamat Lengkap *</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      value={formData.alamat}
                      onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">RT *</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={formData.rt}
                        onChange={(e) => setFormData({...formData, rt: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">RW *</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={formData.rw}
                        onChange={(e) => setFormData({...formData, rw: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Keperluan */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Keperluan *</label>
                  <textarea 
                    rows={4}
                    placeholder="Jelaskan keperluan pembuatan surat..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    value={formData.keperluan}
                    onChange={(e) => setFormData({...formData, keperluan: e.target.value})}
                    required
                  />
                </div>

                {/* Submit */}
                <button 
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={16} /> 
                  Ajukan Permohonan
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Permohonan Terkirim</h2>
            <p className="text-gray-600 text-base mb-8 leading-relaxed">
              Permohonan pembuatan surat telah diterima. Proses verifikasi akan dilakukan dalam 3-5 hari kerja. Anda akan menerima notifikasi setelah surat selesai.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/layanan')}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Kembali ke Layanan
              </button>
              <button 
                onClick={() => setStep(1)}
                className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Buat Permohonan Baru
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
