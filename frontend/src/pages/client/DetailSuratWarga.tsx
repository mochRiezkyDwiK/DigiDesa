import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, FileText, Calendar, Hash, FileCheck, AlertTriangle, Clock } from "lucide-react";

export default function DetailSuratWarga() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surat, setSurat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDetailSurat = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/surat/riwayat`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data?.success) {
          // Mencari data surat yang spesifik sesuai ID rute
          const dataSpesifik = response.data.data.find((s: any) => String(s.id) === String(id));
          setSurat(dataSpesifik);
        }
      } catch (error) {
        console.error("Gagal mengambil data detail surat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailSurat();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <p className="text-sm font-black text-slate-400 animate-pulse">Memuat Detail Berkas...</p>
      </div>
    );
  }

  if (!surat) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans p-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center max-w-sm border border-slate-100">
          <AlertTriangle className="mx-auto text-amber-500 mb-4" size={40} />
          <h2 className="text-xl font-black text-slate-900">Berkas Tidak Ditemukan</h2>
          <p className="text-xs text-slate-400 mt-2">Data pengajuan surat tidak terdaftar atau telah dihapus dari sistem.</p>
          <button onClick={() => navigate("/dashboard-warga")} className="mt-6 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-blue-700 transition-all">
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased p-6 sm:p-12">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate("/dashboard-warga")} 
          className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={3} /> Kembali ke Dashboard
        </button>

        {/* Kartu Utama Detail Surat */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 sm:p-10 border-b border-slate-50 flex items-start justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <FileText size={26} strokeWidth={2.5} />
              </div>
              <div>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-wider">
                  ID Pengajuan: #{surat.id}
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1.5">
                  {surat.jenis_surat === "SKD" && "Surat Keterangan Domisili (SKD)"}
                  {surat.jenis_surat === "SKU" && "Surat Keterangan Usaha (SKU)"}
                  {surat.jenis_surat === "SKTM" && "Surat Keterangan Tidak Mampu (SKTM)"}
                </h2>
              </div>
            </div>

            <span className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-tight flex-shrink-0 ${
              surat.status === "SELESAI" ? "bg-emerald-50 text-emerald-600" : 
              surat.status === "REJECTED" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
            }`}>
              {surat.status}
            </span>
          </div>

          <div className="p-8 sm:p-10 space-y-6 bg-slate-50/40">
            {/* Detail Informasi */}
            <div className="grid gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-400">
                  <Hash size={18} />
                  <span className="text-xs font-bold">Nomor Surat</span>
                </div>
                <span className="text-xs font-black text-slate-900">{surat.no_surat || "Belum Terbit (Menunggu Validasi)"}</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-400">
                  <Calendar size={18} />
                  <span className="text-xs font-bold">Tanggal Diajukan</span>
                </div>
                <span className="text-xs font-black text-slate-900">
                  {new Date(surat.tgl_diajukan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Blok Kondisional Jika Ditolak */}
            {surat.status === "REJECTED" && (
              <div className="p-5 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-4">
                <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-xs font-black text-red-900 uppercase tracking-wider">Alasan Penolakan</h4>
                  <p className="text-xs text-red-700 font-medium mt-1 leading-relaxed">{surat.alasan_ditolak || "Data pengajuan tidak sesuai kriteria."}</p>
                </div>
              </div>
            )}

            {/* Blok Kondisional Jika Selesai */}
            {surat.status === "SELESAI" ? (
              <div className="p-6 bg-emerald-500 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-emerald-500/10">
                <div className="flex items-center gap-4">
                  <FileCheck size={28} />
                  <div>
                    <h4 className="text-sm font-black">Dokumen Telah Siap!</h4>
                    <p className="text-[11px] text-emerald-100 font-medium mt-0.5">Surat fisik Anda sudah dicetak dan dapat diambil di kantor desa.</p>
                  </div>
                </div>
              </div>
            ) : surat.status !== "REJECTED" && (
              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                <Clock className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">Sedang Diproses</h4>
                  <p className="text-xs text-amber-700 font-medium mt-1 leading-relaxed">Pengajuan Anda sedang divalidasi oleh jajaran pengurus RT/RW setempat.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}