import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, FileText, Calendar, Hash, FileCheck, AlertTriangle, Clock, Download, Printer, MapPin, User, Phone } from "lucide-react";

export default function DetailSuratWarga() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surat, setSurat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const suratRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDetailSurat = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/surat/riwayat`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data?.success) {
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

  const handlePrint = () => {
    const printContent = suratRef.current;
    if (!printContent) return;
    const originalBody = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalBody;
    window.location.reload();
  };

  const handleDownload = () => {
    const printContent = suratRef.current;
    if (!printContent) return;

    const style = `
      <style>
        @page { size: A4; margin: 2cm; }
        body { font-family: 'Times New Roman', serif; color: #000; }
        * { box-sizing: border-box; }
      </style>
    `;

    const html = `<!DOCTYPE html><html><head>${style}</head><body>${printContent.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Surat_${surat?.jenis_surat}_${surat?.no_surat || surat?.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getJenisSurat = (kode: string) => {
    const map: Record<string, string> = {
      SKD: "SURAT KETERANGAN DOMISILI",
      SKU: "SURAT KETERANGAN USAHA",
      SKTM: "SURAT KETERANGAN TIDAK MAMPU",
    };
    return map[kode] || kode;
  };

  const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

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
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Tombol Kembali */}
        <button onClick={() => navigate("/dashboard-warga")} className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} strokeWidth={3} /> Kembali ke Dashboard
        </button>

        {/* Kartu Status */}
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
                  {getJenisSurat(surat.jenis_surat)}
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

          <div className="p-8 sm:p-10 space-y-4 bg-slate-50/40">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-400">
                  <Hash size={16} />
                  <span className="text-xs font-bold">Nomor Surat</span>
                </div>
                <span className="text-xs font-black text-slate-900">{surat.no_surat || "Belum Terbit"}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-400">
                  <Calendar size={16} />
                  <span className="text-xs font-bold">Tanggal Diajukan</span>
                </div>
                <span className="text-xs font-black text-slate-900">
                  {new Date(surat.tgl_diajukan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>

            {surat.status === "REJECTED" && (
              <div className="p-5 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-4">
                <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-xs font-black text-red-900 uppercase tracking-wider">Alasan Penolakan</h4>
                  <p className="text-xs text-red-700 font-medium mt-1 leading-relaxed">{surat.alasan_ditolak || "Data pengajuan tidak sesuai kriteria."}</p>
                </div>
              </div>
            )}

            {surat.status === "SELESAI" ? (
              <div className="p-6 bg-emerald-500 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-emerald-500/10">
                <div className="flex items-center gap-4">
                  <FileCheck size={28} />
                  <div>
                    <h4 className="text-sm font-black">Dokumen Telah Siap!</h4>
                    <p className="text-[11px] text-emerald-100 font-medium mt-0.5">Surat fisik dapat diambil di kantor desa.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-700 rounded-xl text-xs font-black hover:bg-emerald-50 transition-all">
                    <Download size={14} /> Unduh
                  </button>
                  <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white border border-emerald-400 rounded-xl text-xs font-black hover:bg-emerald-700 transition-all">
                    <Printer size={14} /> Cetak
                  </button>
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

        {/* Visual Preview Surat */}
        {surat.status === "SELESAI" && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-700">Preview Dokumen Surat</h3>
              <div className="flex gap-2">
                <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-black hover:bg-blue-100 transition-all">
                  <Download size={12} /> Unduh HTML
                </button>
                <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-black hover:bg-slate-200 transition-all">
                  <Printer size={12} /> Cetak
                </button>
              </div>
            </div>

            {/* Dokumen Surat */}
            <div className="p-6 bg-slate-100">
              <div ref={suratRef} className="bg-white shadow-md mx-auto" style={{ maxWidth: "794px", minHeight: "1123px", padding: "60px 80px", fontFamily: "Times New Roman, serif" }}>

                {/* Kop Surat */}
                <div style={{ borderBottom: "4px double #000", paddingBottom: "12px", marginBottom: "20px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td style={{ width: "80px", verticalAlign: "middle" }}>
                          <div style={{ width: "70px", height: "70px", border: "2px solid #000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", textAlign: "center", fontWeight: "bold" }}>
                            LOGO<br />DESA
                          </div>
                        </td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                          <div style={{ fontSize: "13px", fontWeight: "normal" }}>PEMERINTAH KABUPATEN DAERAH</div>
                          <div style={{ fontSize: "13px", fontWeight: "normal" }}>KECAMATAN SETEMPAT</div>
                          <div style={{ fontSize: "20px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>KANTOR DESA DIGIDESA</div>
                          <div style={{ fontSize: "11px", color: "#333" }}>
                            <MapPin size={10} style={{ display: "inline", marginRight: "4px" }} />
                            Jl. Desa No. 1, Kec. Setempat, Kab. Daerah
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Judul Surat */}
                <div style={{ textAlign: "center", margin: "24px 0 20px" }}>
                  <div style={{ fontSize: "15px", fontWeight: "bold", textDecoration: "underline", textTransform: "uppercase", letterSpacing: "2px" }}>
                    {getJenisSurat(surat.jenis_surat)}
                  </div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>
                    Nomor: {surat.no_surat || "___/___/DESA/___"}
                  </div>
                </div>

                {/* Isi Surat */}
                <div style={{ fontSize: "13px", lineHeight: "2", marginBottom: "20px" }}>
                  <p style={{ marginBottom: "12px" }}>Yang bertanda tangan di bawah ini, Kepala Desa DigiDesa, menerangkan bahwa:</p>

                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <tbody>
                      {[
                        ["Nama Lengkap", surat.nama_lengkap || surat.user?.nama_lengkap || "-"],
                        ["NIK", surat.nik || surat.user?.nik || "-"],
                        ["Tempat/Tgl Lahir", surat.ttl || "-"],
                        ["Jenis Kelamin", surat.jenis_kelamin || "-"],
                        ["Agama", surat.agama || "Islam"],
                        ["Pekerjaan", surat.pekerjaan || "-"],
                        ["Alamat", `RT ${surat.rt || surat.user?.rt || "-"} / RW ${surat.rw || surat.user?.rw || "-"}, Desa DigiDesa`],
                      ].map(([label, value]) => (
                        <tr key={label}>
                          <td style={{ width: "200px", paddingBottom: "2px" }}>{label}</td>
                          <td style={{ width: "20px" }}>:</td>
                          <td style={{ fontWeight: "bold" }}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <p style={{ marginTop: "16px" }}>
                    {surat.jenis_surat === "SKD" && "Adalah benar merupakan warga yang berdomisili dan tercatat sebagai penduduk tetap di wilayah Desa DigiDesa."}
                    {surat.jenis_surat === "SKU" && "Adalah benar merupakan warga yang menjalankan kegiatan usaha di wilayah Desa DigiDesa."}
                    {surat.jenis_surat === "SKTM" && "Adalah benar merupakan warga yang tergolong dalam keluarga tidak mampu dan berhak mendapatkan bantuan sosial."}
                  </p>

                  <p style={{ marginTop: "12px" }}>
                    Surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.
                  </p>
                </div>

                {/* Tanda Tangan */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "40px" }}>
                  <div style={{ textAlign: "center", minWidth: "200px" }}>
                    <div style={{ fontSize: "13px" }}>DigiDesa, {today}</div>
                    <div style={{ fontSize: "13px", marginBottom: "70px" }}>Kepala Desa,</div>
                    <div style={{ fontSize: "13px", fontWeight: "bold", borderTop: "1px solid #000", paddingTop: "4px" }}>
                      NAMA KEPALA DESA
                    </div>
                    <div style={{ fontSize: "11px" }}>NIP. -</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}