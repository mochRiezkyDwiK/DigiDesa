import { useState, useEffect } from "react";
import axios from "axios";
import { 
  ShieldAlert, 
  UploadCloud, 
  Clock, 
  XCircle, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  LogOut
} from "lucide-react";

interface OnboardingProps {
  userStatus: string;
  onVerified: () => void;
}

export default function WargaOnboarding({ userStatus, onVerified }: OnboardingProps) {
  // Gunakan toUpperCase agar konsisten
  const [status, setStatus] = useState(userStatus?.toUpperCase() || "");
  const [alasanDitolak, setAlasanDitolak] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  const [formData, setFormData] = useState({
    no_kk: "",
    status_hubungan: "Kepala Keluarga",
    status_tinggal: "TETAP",
    foto_ktp: null as File | null
  });

  const checkCurrentStatus = async () => {
    setIsFetchingProfile(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/v1/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Data dari API:", res.data); 
      console.log("Status dari API:", res.data?.data?.status_akun);

      if (res.data.success) {
        const currentStatus = res.data.data.status_akun || "PENDING";
        setStatus(currentStatus.toUpperCase());
        setAlasanDitolak(res.data.data.alasan_ditolak || "");
        
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
    if (!formData.foto_ktp) return alert("Silakan unggah foto KTP/KK!");
    if (formData.no_kk.length !== 16) return alert("Nomor KK harus 16 digit!");

    setIsLoading(true);
    const data = new FormData();
    data.append("no_kk", formData.no_kk);
    data.append("status_hubungan", formData.status_hubungan);
    data.append("status_tinggal", formData.status_tinggal);
    data.append("foto_ktp", formData.foto_ktp);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/v1/auth/onboarding", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        alert("Berhasil dikirim!");
        setStatus("PENDING");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengirim formulir");
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
        
        {/* KONDISI: FORM (INCOMPLETE/REJECTED) */}
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
              {/* INPUT FORM DI SINI */}
              <input type="number" placeholder="Nomor KK (16 digit)" className="w-full p-4 border rounded-2xl" onChange={(e) => setFormData({...formData, no_kk: e.target.value})} required />
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">
                {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Kirim Data"}
              </button>
            </form>
          </div>
        )}

        {/* KONDISI: PENDING */}
        {status === "PENDING" && (
          <div className="text-center py-8">
            <Clock size={48} className="mx-auto text-amber-500 mb-6 animate-pulse" />
            <h2 className="text-2xl font-black">Menunggu Verifikasi</h2>
            <p className="text-slate-500 mt-2">Data sedang diaudit oleh Admin RT/RW.</p>
            <button onClick={checkCurrentStatus} className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl">Refresh Status</button>
          </div>
        )}

        {/* FALLBACK: Jika status tidak dikenal */}
        {!["INCOMPLETE", "REJECTED", "PENDING"].includes(status) && (
          <div className="text-center py-10">
            <p>Status tidak valid: {status}</p>
            <button onClick={checkCurrentStatus} className="text-blue-600 underline">Refresh Halaman</button>
          </div>
        )}
      </div>
    </div>
  );
}