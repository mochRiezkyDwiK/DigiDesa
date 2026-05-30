import React from "react";
import { FileText, MessageSquare, Clock, Heart } from "lucide-react";

interface ServiceItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
}

const services: ServiceItem[] = [
  {
    id: "surat",
    icon: <FileText className="w-6 h-6" />,
    label: "Pembuatan Surat",
    description: "Ajukan SKU, SKTM, SK Domisili & lainnya secara online tanpa antre.",
    href: "/buat-surat",
  },
  {
    id: "pengaduan",
    icon: <MessageSquare className="w-6 h-6" />,
    label: "Pengaduan Warga",
    description: "Sampaikan keluhan, aspirasi, atau laporan fasilitas rusak secara langsung.",
    href: "/lapor",
  },
  {
    id: "status",
    icon: <Clock className="w-6 h-6" />,
    label: "Cek Status Surat",
    description: "Pantau proses verifikasi, validasi, dan tanda tangan digital surat Anda.",
    href: "/layanan/cek-status",
  },
  {
    id: "bantuan",
    icon: <Heart className="w-6 h-6" />,
    label: "Informasi Bantuan",
    description: "Cek penerima program bantuan sosial, bansos, BLT, dan PKH terbaru.",
    href: "https://cekbansos.kemensos.go.id/"
  },
];

export default function QuickAccessGrid() {
  return (
    <section className="py-16 bg-white w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Section Header */}
        <div className="mb-12 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <p className="text-[11px] font-bold tracking-wider text-blue-700 uppercase">
              Layanan Administrasi
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Akses Cepat Layanan Utama
          </h2>
          <p className="mt-2 text-slate-500 text-sm leading-relaxed">
            Efisiensi birokrasi kependudukan dalam satu pintu. Pilih layanan yang Anda butuhkan untuk memulai pengajuan dokumen resmi.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <a
              key={service.id}
              href={service.href}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200 transition-all duration-300 cursor-pointer no-underline shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:border-blue-500/50 hover:shadow-[0_12px_24px_-8px_rgba(37,99,235,0.12)] hover:-translate-y-1"
            >
              <div>
                {/* Header Card: Icon & Badge Number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100/50 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                    {service.icon}
                  </div>
                 
                </div>

                {/* Text Content */}
                <div className="mb-6">
                  <h3 className="font-bold text-base text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors duration-200">
                    {service.label}
                  </h3>
                  <p className="text-slate-500 text-[13px] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Action Link Indicator */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 pt-3 border-t border-slate-50">
                <span>Buka Layanan</span>
                <svg
                  className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
        
      </div>
    </section>
  );
}