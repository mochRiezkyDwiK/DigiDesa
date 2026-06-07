import { useState, useEffect } from "react";
import axios from "axios";
import { 
  ShieldAlert, 
  UploadCloud, 
  Clock, 
  XCircle, 
  Loader2, 
  LogOut,
  Home,
  UserCheck,
  MapPin,
  Hash
} from "lucide-react";

interface OnboardingProps {
  userStatus: string;
  onVerified: () => void;
}

export default function WargaOnboarding({ userStatus, onVerified }: OnboardingProps) {
  const [status, setStatus] = useState(userStatus?.toUpperCase() || "");
  const [alasanDitolak, setAlasanDitolak] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  
  const [formData, setFormData] = useState({
    no_kk: "",
    status_hubungan: "Kepala Keluarga",
    alamat: "", 
    rt: "",
    rw: "",
    foto_ktp: null as File | null
  });

  const checkCurrentStatus = async () => {
    setIsFetchingProfile(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/v1/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        // PERBAIKAN: Langsung paksa status dari API menjadi UPPERCASE untuk menghindari bug case-sensitive
        const currentStatus = (res.data.data.status_akun || "PENDING").toUpperCase();
        
        setStatus(currentStatus);
        setAlasanDitolak(res.data.data.alasan_ditolak || "");
        
        // Pengecekan sekarang dijamin akurat karena kedua belah pihak sudah berbentuk UPPERCASE
        if (currentStatus === "VERIFIED_TETAP" || currentStatus === "VERIFIED_PENDATANG") {
          onVerified();
        }
      }
    } catch (error) {
      console.error("Gagal sinkronisasi status:", error);
    } finally {
      setIsFetchingProfile(false);
    }
  };

  useEffect(() => {
    checkCurrentStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const noKK = formData.no_kk;
    const alamatInput = formData.alamat;
    const rtInput = formData.rt;
    const rwInput = formData.rw;
    const statusHubungan = formData.status_hubungan;
    const foto = formData.foto_ktp;

    if (!foto) return alert("Silakan unggah foto KTP/KK!");
    if (noKK.trim().length !== 16) return alert("Nomor KK harus 16 digit!");
    if (!alamatInput.trim()) return alert("Alamat wajib diisi!");
    if (!rtInput.trim() || !rwInput.trim()) return alert("RT dan RW wajib diisi!");

    setIsLoading(true);
    
    const data = new FormData();
    data.append("no_kk", noKK.trim());
    data.append("status_hubungan", statusHubungan);
    data.append("alamat", alamatInput.trim()); 
    data.append("rt", rtInput.trim());
    data.append("rw", rwInput.trim());
    data.append("foto_ktp", foto);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/v1/auth/onboarding", data, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "multipart/form-data" 
        }
      });
      if (res.data.success) {
        alert("Berhasil dikirim!");
        setStatus("PENDING");
      }
    } catch (error: any) {
      console.error("Error Detail dari Backend:", error.response?.data);
      alert(error.response?.data?.message || "Gagal mengirim data onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (isFetchingProfile) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex items-center justify-center p-6">
      <button onClick={handleLogout} className="absolute top-8 right-8 flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold shadow-sm hover:bg-red-50 hover:text-red-600 transition-all">
        <LogOut size={14} /> Keluar
      </button>
      
      <div className="w-full max-w-2xl bg-white rounded-[3rem] border border-slate-100 shadow-xl p-12">
        
        {/* KONDISI 1: FORM (INCOMPLETE/REJECTED) */}
        {(status === "INCOMPLETE" || status === "REJECTED") && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${status === 'REJECTED' ? 'bg-red-500' : 'bg-blue-600'}`}>
                {status === 'REJECTED' ? <XCircle size={26} /> : <ShieldAlert size={26} />}
              </div>
              <h1 className="text-2xl font-black text-slate-900">{status === 'REJECTED' ? 'Verifikasi Ditolak' : 'Verifikasi Akun'}</h1>
            </div>
            
            {status === "REJECTED" && (
              <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">
                Alasan: {alasanDitolak || "Data tidak sesuai."}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* INPUT 1: NO KK */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Hash size={16} className="text-slate-400" /> Nomor Kartu Keluarga (KK)
                </label>
                <input 
                  type="text" 
                  maxLength={16}
                  placeholder="Masukkan 16 digit No. KK" 
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 font-medium transition-all" 
                  value={formData.no_kk}
                  onChange={(e) => setFormData({...formData, no_kk: e.target.value.replace(/\D/g, '')})} 
                  required 
                />
              </div>

              {/* INPUT 2: HUBUNGAN KELUARGA */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <UserCheck size={16} className="text-slate-400" /> Hubungan Keluarga
                </label>
                <select 
                  className="w-full p-4 border border-slate-200 rounded-2xl bg-white focus:outline-none focus:border-blue-600 font-medium"
                  value={formData.status_hubungan}
                  onChange={(e) => setFormData({...formData, status_hubungan: e.target.value})}
                >
                  <option value="Kepala Keluarga">Kepala Keluarga</option>
                  <option value="Suami">Suami</option>
                  <option value="Istri">Istri</option>
                  <option value="Anak">Anak</option>
                  <option value="Anggota Keluarga">Anggota Keluarga Lain</option>
                </select>
              </div>

              {/* INPUT 3: ALAMAT */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-slate-400" /> Alamat Rumah
                </label>
                <textarea 
                  rows={2}
                  placeholder="Nama jalan, nomor rumah, blok, dll." 
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 font-medium transition-all resize-none" 
                  value={formData.alamat}
                  onChange={(e) => setFormData({...formData, alamat: e.target.value})} 
                  required 
                />
              </div>

              {/* INPUT 4 & 5: RT / RW */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">RT</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: 003" 
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 font-medium transition-all" 
                    value={formData.rt}
                    onChange={(e) => setFormData({...formData, rt: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">RW</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: 011" 
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 font-medium transition-all" 
                    value={formData.rw}
                    onChange={(e) => setFormData({...formData, rw: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              {/* INPUT 6: UPLOAD FOTO */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <UploadCloud size={16} className="text-slate-400" /> Unggah Foto KTP / KK
                </label>
                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-all cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({...formData, foto_ktp: e.target.files[0]});
                      }
                    }}
                  />
                  <UploadCloud className="mx-auto text-slate-400 mb-2" size={28} />
                  <p className="text-xs font-bold text-slate-600">
                    {formData.foto_ktp ? `Terpilih: ${formData.foto_ktp.name}` : "Klik atau seret file gambar ke sini"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Format JPG, PNG (Maks. 2MB)</p>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center shadow-lg shadow-blue-100 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Kirim Data Onboarding"}
              </button>
            </form>
          </div>
        )}

        {/* KONDISI 2: PENDING */}
        {status === "PENDING" && (
          <div className="text-center py-8">
            <Clock size={48} className="mx-auto text-amber-500 mb-6 animate-pulse" />
            <h2 className="text-2xl font-black">Menunggu Verifikasi</h2>
            <p className="text-slate-500 mt-2">Data sedang diaudit oleh Admin RT/RW.</p>
            <button onClick={checkCurrentStatus} className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl">Refresh Status</button>
          </div>
        )}

        {/* KONDISI 3: LOADING TRANSISI KETIKA VERIFIED (Mencegah tampilan Fallback) */}
        {(status === "VERIFIED_TETAP" || status === "VERIFIED_PENDATANG") && (
          <div className="text-center py-10">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800">Akun Terverifikasi!</h2>
            <p className="text-slate-500 text-sm mt-1">Mengalihkan Anda ke dashboard...</p>
          </div>
        )}

        {/* FALLBACK: JIKA STATUS DI LUAR 5 PILIHAN UTAMA */}
        {!["INCOMPLETE", "REJECTED", "PENDING", "VERIFIED_TETAP", "VERIFIED_PENDATANG"].includes(status) && (
          <div className="text-center py-10">
            <p className="text-red-500 font-medium">Status tidak dikenali: "{status}"</p>
            <button onClick={checkCurrentStatus} className="mt-4 text-blue-600 underline text-sm">Refresh Halaman</button>
          </div>
        )}
      </div>
    </div>
  );
}