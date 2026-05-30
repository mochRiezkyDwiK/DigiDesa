import { useState, useEffect } from "react";
import { motion } from "framer-motion"; 
import { useNavigate, useLocation } from "react-router-dom";
import { EASE_SPRING } from "../../constants/animation";
import axios from "axios"; 
import { 
  ArrowLeft, Send, CheckCircle2, User, 
  MapPin, Fingerprint
} from "lucide-react";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE_SPRING }
  })
};

export default function Surat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); 
  const [pageLoading, setPageLoading] = useState(true); 

  const token = localStorage.getItem("token");
  
  // ── BARU: State khusus untuk mencatat data asli bawaan dari database ──
  const [dbUser, setDbUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    jenisSurat: location.state?.jenisSurat || "", 
    namaLengkap: "",
    nik: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    agama: "",
    pekerjaan: "",
    statusPerkawinan: "",
    alamat: "",
    rt: "",
    rw: "",
    keperluan: "", 
    noHp: ""
  });

  // ── SINKRONISASI ASLI DARI DATABASE MYSQL ──
  useEffect(() => {
    const fetchLiveProfile = async () => {
      if (!token) {
        alert("Sesi login tidak ditemukan. Silakan login kembali!");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/v1/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const user = response.data.data;
          setDbUser(user); // Amankan data asli server ke state pembanding Ky
          
          setFormData(prev => ({
            ...prev,
            namaLengkap: user.nama_lengkap || "",
            nik: user.nik || "",
            tempatLahir: user.tempat_lahir || "",
            tanggalLahir: user.tanggal_lahir ? user.tanggal_lahir.split("T")[0] : "",
            jenisKelamin: user.jenis_kelamin || "Laki-laki",
            agama: user.agama || "Islam",
            pekerjaan: user.pekerjaan || "Swasta",
            statusPerkawinan: user.status_perkawinan || "Belum Kawin",
            alamat: user.alamat || "",
            rt: user.rt || "",
            rw: user.rw || "",
            noHp: user.no_hp || ""
          }));
        }
      } catch (error: any) {
        console.error("GAGAL AMBIL PROFILE LIVE DARI DB:", error);
        alert("Gagal sinkronisasi profil resmi warga.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchLiveProfile();
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const alasanKeperluan = formData.keperluan.trim();
      if (!alasanKeperluan) {
        alert("Alasan pengajuan surat wajib diisi.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/v1/surat/ajukan",
        {
          jenis_surat: formData.jenisSurat, 
          keperluan: alasanKeperluan
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setStep(2);
      }
    } catch (error: any) {
      console.error("ERROR SUBMIT SURAT FE:", error);
      alert(error.response?.data?.message || "Gagal mengirim permohonan");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans font-bold text-slate-500 text-xs uppercase tracking-widest">
        <span>Sinkronisasi Data Database Kelurahan...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased pb-20">
      <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-50 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/layanan')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Formulir Layanan Desa</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Digitalisasi Administrasi</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        {step === 1 ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* PANEL KIRI */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div initial="hidden" animate="visible" variants={FADE_UP} custom={0} className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-30" />
                <h2 className="text-2xl font-black mb-4 tracking-tight">Deteksi Data Pintar</h2>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">Sistem DigiDesa mendeteksi profil Anda. Kolom yang sudah terekam di database kelurahan akan otomatis terkunci demi integritas data, sedangkan kolom yang masih kosong terbuka untuk Anda lengkapi.</p>
                <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-wider bg-white/5 p-3 rounded-xl border border-white/10 text-blue-400">
                    <CheckCircle2 size={16} /> Gating Kondisional Aktif
                </div>
              </motion.div>
            </div>

            {/* PANEL KANAN */}
            <motion.div initial="hidden" animate="visible" variants={FADE_UP} custom={1} className="lg:col-span-2 space-y-6">
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                
                {/* IDENTITAS DASAR */}
                <section className="space-y-5">
                  <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Fingerprint size={16} /> Identitas Dasar Warga
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Jenis Surat *</label>
                      <select name="jenisSurat" value={formData.jenisSurat} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none text-slate-800">
                        <option value="">Pilih Jenis Surat</option>
                        <option value="SKD">Surat Keterangan Domisili (SKD)</option>
                        <option value="SKU">Surat Keterangan Usaha (SKU)</option>
                        <option value="SKTM">Surat Keterangan Tidak Mampu (SKTM)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">NIK KTP Warga</label>
                      {/* ── BARU: Hanya lock jika NIK beneran ada isinya di DB MySQL ── */}
                      <input 
                        type="text" 
                        name="nik" 
                        value={formData.nik} 
                        onChange={handleChange} 
                        disabled={!!dbUser?.nik} 
                        required
                        placeholder="Ketik 16 digit NIK Anda..."
                        className={`w-full border rounded-2xl py-4 px-5 text-sm font-bold outline-none transition-all ${
                          dbUser?.nik ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" : "bg-slate-50 border-slate-100 text-slate-900 focus:border-blue-500 focus:bg-white"
                        }`} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Nama Lengkap Sesuai Akun</label>
                    <input 
                      type="text" 
                      name="namaLengkap" 
                      value={formData.namaLengkap} 
                      onChange={handleChange} 
                      disabled={!!dbUser?.nama_lengkap} 
                      required
                      placeholder="Ketik Nama Lengkap Anda..."
                      className={`w-full border rounded-2xl py-4 px-5 text-sm font-bold outline-none transition-all ${
                        dbUser?.nama_lengkap ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" : "bg-slate-50 border-slate-100 text-slate-900 focus:border-blue-500 focus:bg-white"
                      }`} 
                    />
                  </div>
                </section>

                {/* BIODATA TAMBAHAN */}
                <section className="space-y-5 pt-4 border-t border-gray-50">
                  <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <User size={16} /> Biodata Tambahan
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Jenis Kelamin</label>
                      <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} disabled={!!dbUser?.jenis_kelamin} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none text-slate-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Agama</label>
                      <select name="agama" value={formData.agama} onChange={handleChange} disabled={!!dbUser?.agama} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none text-slate-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                        <option value="Islam">Islam</option>
                        <option value="Kristen">Kristen</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Budha">Budha</option>
                        <option value="Konghucu">Konghucu</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* DOMISILI LINGKUNGAN */}
                <section className="space-y-5 pt-4 border-t border-gray-50">
                  <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <MapPin size={16} /> Domisili Lingkungan
                  </h3>

                  <p className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                    Alamat, RT, dan RW otomatis diambil dari database profil warga.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Alamat Rumah Lengkap</label>
                    <textarea 
                      name="alamat" 
                      rows={2} 
                      value={formData.alamat} 
                      readOnly
                      disabled
                      placeholder="Ketik Alamat Rumah Sekarang..."
                      className="w-full border rounded-2xl py-4 px-5 text-sm font-bold outline-none transition-all resize-none bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">RT</label>
                      <input 
                        type="text" 
                        name="rt" 
                        value={formData.rt} 
                        readOnly
                        disabled
                        placeholder="00"
                        className="w-full border rounded-2xl py-4 px-5 text-sm font-bold outline-none transition-all bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">RW</label>
                      <input 
                        type="text" 
                        name="rw" 
                        value={formData.rw} 
                        readOnly
                        disabled
                        placeholder="00"
                        className="w-full border rounded-2xl py-4 px-5 text-sm font-bold outline-none transition-all bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* FORM INPUT MANUAL UTAMA */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-blue-600 ml-1">Alasan Pengajuan Surat (Wajib Diisi) *</label>
                    <textarea name="keperluan" rows={4} value={formData.keperluan} onChange={handleChange} required placeholder="Contoh: Syarat kelengkapan berkas administrasi pembukaan rekening Bank Mandiri..." className="w-full bg-blue-50/20 border border-blue-100 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-white outline-none transition-all resize-none text-slate-900" />
                  </div>
                </section>

                <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:bg-blue-400">
                  {loading ? "Memproses Data..." : <><Send size={18} /> Kirim Permohonan Resmi</>}
                </button>
              </div>
            </motion.div>
          </form>
        ) : (
          /* SCREEN SUKSES */
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md mx-auto text-center py-20">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Berhasil Terkirim!</h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed">Permohonan Anda sudah berhasil tersimpan di sistem desa.</p>
            <div className="space-y-4">
              <button type="button" onClick={() => navigate('/dashboard-warga')} className="w-full py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-black transition-all">Lihat Status Surat</button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}