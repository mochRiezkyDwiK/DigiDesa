"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserCheck, 
  ClipboardList, 
  ShieldCheck, 
  Download, 
  ChevronDown, 
  HelpCircle, 
  ArrowRight 
} from "lucide-react";

interface StepDetail {
  point: string;
  subText: string;
}

interface Step {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  summary: string;
  expandedDetails: StepDetail[];
  badgeColor: string;
  iconColor: string;
}

const stepsData: Step[] = [
  {
    number: 1,
    icon: <UserCheck className="w-5 h-5" />,
    title: "Daftar / Masuk ke Sistem",
    description: "Tahap Validasi Kependudukan",
    summary: "Sistem akan mencocokkan data Anda langsung dengan database kependudukan desa.",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
    iconColor: "bg-blue-600 text-white",
    expandedDetails: [
      { point: "Siapkan NIK KTP", subText: "Pastikan nomor identitas Anda sudah terdaftar di database SIAK desa." },
      { point: "Input Tanggal Lahir", subText: "Gunakan kombinasi tanggal lahir sebagai pengaman otentikasi lapis pertama." },
      { point: "Tanpa Password Rumit", subText: "Sistem menggunakan jalur masuk instan berbasis data riil tanpa perlu menghafal sandi." }
    ]
  },
  {
    number: 2,
    icon: <ClipboardList className="w-5 h-5" />,
    title: "Isi Formulir Permohonan",
    description: "Pilih Jenis Surat & Unggah Berkas",
    summary: "Pilih format dokumen administrasi dan lengkapi formulir sesuai kebutuhan.",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    iconColor: "bg-slate-800 text-white",
    expandedDetails: [
      { point: "Pilih Kategori Surat", subText: "Tersedia opsi SKU (Usaha), SKTM (Kurang Mampu), SK Domisili, dan lainnya." },
      { point: "Lengkapi Data Parameter", subText: "Isi alasan pembuatan surat dan data penunjang secara objektif." },
      { point: "Unggah Dokumen Syarat", subText: "Foto atau scan berkas pendukung (seperti KK/KTP) langsung lewat ponsel." }
    ]
  },
  {
    number: 3,
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Proses Verifikasi Internal",
    description: "Pemeriksaan Validitas oleh Perangkat Desa",
    summary: "Tim fasilitator desa akan meninjau kelayakan dan keaslian berkas yang Anda kirim.",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
    iconColor: "bg-blue-600 text-white",
    expandedDetails: [
      { point: "Pemeriksaan Berkas", subText: "Perangkat desa memvalidasi kesesuaian data yang diinput dengan berkas unggahan." },
      { point: "Pantau Status Real-Time", subText: "Status berubah berkala dari 'Diajukan', 'Diproses', hingga 'Disetujui'." },
      { point: "Sistem Revisi Mandiri", subText: "Jika berkas ditolak, Anda akan mendapat catatan perbaikan via sistem tanpa perlu ke kantor desa." }
    ]
  },
  {
    number: 4,
    icon: <Download className="w-5 h-5" />,
    title: "Penerbitan & Pengambilan Dokumen",
    description: "Tanda Tangan Elektronik & Notifikasi",
    summary: "Surat resmi diterbitkan lengkap dengan pengamanan digital yang sah.",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    iconColor: "bg-slate-800 text-white",
    expandedDetails: [
      { point: "Proteksi TTE (Tanda Tangan Elektronik)", subText: "Dokumen disahkan menggunakan kode QR barcode resmi yang valid secara hukum." },
      { point: "Notifikasi Otomatis WhatsApp", subText: "Sistem mengirimkan pemberitahuan instan begitu surat selesai ditandatangani." },
      { point: "Unduh Mandiri", subText: "Cetak dokumen secara mandiri dari rumah atau tunjukkan file digital saat diperlukan." }
    ]
  }
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number | null>(1);

  const toggleStep = (stepNumber: number) => {
    setActiveStep(activeStep === stepNumber ? null : stepNumber);
  };

  return (
    <section className="py-24 bg-white w-full border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <p className="text-[11px] font-bold tracking-wider text-blue-700 uppercase">
              Alur Panduan Digital
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
            Tahapan Mengajukan Layanan Online
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
            Ikuti petunjuk langkah demi langkah di bawah ini untuk menyelesaikan pengajuan dokumen administrasi Anda dengan benar.
          </p>
        </div>

        {/* Vertical Step-by-Step Timeline */}
        <div className="relative border-l-2 border-slate-100 pl-6 ml-4 md:pl-8 md:ml-8 space-y-8">
          {stepsData.map((step) => {
            const isExpanded = activeStep === step.number;
            
            return (
              <div key={step.number} className="relative group">
                
                {/* Timeline Node Indicator */}
                <div className="absolute -left-[43px] md:-left-[51px] top-0.5 transition-transform duration-300 group-hover:scale-105">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-300 ${
                    isExpanded ? "bg-blue-600 text-white shadow-blue-100" : "bg-slate-50 text-slate-600 border-slate-100"
                  }`}>
                    {step.icon}
                  </div>
                </div>

                {/* Step Main Container */}
                <div className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 bg-white ${
                  isExpanded 
                    ? "border-blue-500/30 shadow-[0_12px_24px_-10px_rgba(37,99,235,0.06)]" 
                    : "border-slate-200/80 hover:border-slate-300 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.02)]"
                }`}>
                  
                  {/* Interactive Header Row */}
                  <button
                    onClick={() => toggleStep(step.number)}
                    className="w-full flex items-start justify-between text-left gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-md border text-[9px] font-black tracking-wide ${step.badgeColor}`}>
                          TAHAP 0{step.number}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {step.description}
                        </span>
                      </div>
                      <h3 className={`text-base md:text-lg font-black tracking-tight transition-colors duration-200 ${
                        isExpanded ? "text-blue-600" : "text-slate-900 group-hover:text-blue-600"
                      }`}>
                        {step.title}
                      </h3>
                    </div>
                    
                    <div className={`p-1.5 rounded-lg border border-slate-100 bg-slate-50/50 text-slate-400 mt-1 transition-transform duration-300 ${
                      isExpanded ? "rotate-180 text-blue-600 bg-blue-50/50 border-blue-100" : ""
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Summary (Always Visible) */}
                  <p className="mt-2 text-slate-500 text-[13px] leading-relaxed">
                    {step.summary}
                  </p>

                  {/* Accordion Content (Step Details Breakdown) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 pt-5 border-t border-slate-100 space-y-4">
                          <p className="text-[11px] font-black tracking-wider text-slate-400 uppercase">
                            Detail Sub-Proses:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {step.expandedDetails.map((detail, idx) => (
                              <div key={idx} className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-100">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                  <h4 className="text-xs font-bold text-slate-900">
                                    {detail.point}
                                  </h4>
                                </div>
                                <p className="text-slate-500 text-[11px] leading-relaxed pl-3.5">
                                  {detail.subText}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Action CTA Banner */}
        <div className="mt-20 relative bg-white border border-slate-200 rounded-2xl p-8 md:p-10 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50/20 to-slate-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="relative z-10">
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block mb-2">
              Layanan Mandiri 24 Jam
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-2">
              Sudah Memahami Seluruh Alur Pengajuan?
            </h3>
            <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto leading-relaxed font-normal">
              Mulai pengisian data sekarang. Tim fasilitator dinas siap melakukan peninjauan berkas secara berkala selama jam kerja operasional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="/layanan/surat"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-[0_8px_20px_-6px_rgba(37,99,235,0.3)] active:scale-98"
              >
                <span>Mulai Buat Surat Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="/panduan"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs px-6 py-3.5 rounded-xl transition-all active:scale-98"
              >
                Pelajari Regulasi Lengkap
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}