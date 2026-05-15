import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EASE_SPRING } from "../constants/animation";
import {
  FileText,
  Users,
  BarChart3,
  Shield,
  Bell,
  Activity,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Pengajuan Surat Online",
    desc: "Warga dapat mengajukan surat resmi kapan saja tanpa antre, langsung diproses oleh RT/RW terkait.",
    size: "large",
    bg: "bg-[#0F2744]",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-300",
    tag: "Administrasi",
  },
  {
    icon: Bell,
    title: "Notifikasi Pintar",
    desc: "Pemberitahuan otomatis di setiap status pengajuan.",
    size: "small",
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    tag: "Otomasi",
  },
  {
    icon: BarChart3,
    title: "Laporan Anggaran Transparan",
    desc: "Informasi penggunaan anggaran tampil real-time untuk semua pihak.",
    size: "medium",
    bg: "bg-[#0F2744]",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-300",
    tag: "Keuangan",
  },
  {
    icon: Shield,
    title: "Keamanan Data",
    desc: "Proteksi standar tinggi untuk setiap data warga.",
    size: "small",
    bg: "bg-slate-100",
    iconBg: "bg-slate-200",
    iconColor: "text-slate-600",
    tag: "Keamanan",
  },
  {
    icon: Users,
    title: "Profil Warga Terpadu",
    desc: "Data keluarga dan identitas warga tersimpan dalam satu sistem terintegrasi yang mudah dicari kapan pun dibutuhkan.",
    size: "large-wide",
    bg: "bg-blue-600",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    tag: "Data",
  },
  {
    icon: Activity,
    title: "Pemantauan Proses",
    desc: "Lacak setiap permintaan dari pengajuan hingga selesai.",
    size: "small",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    tag: "Monitoring",
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-[#060F1E]">
      {/* Background image with parallax */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -z-10"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060F1E] via-transparent to-[#060F1E]" />
      </motion.div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#4a90d9 1px, transparent 1px), linear-gradient(90deg, #4a90d9 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE_SPRING }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full mb-5">
              Kapasitas Platform
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight">
              Fitur
              <br />
              <span className="text-blue-400">Lengkap</span>
              <br />
              <span className="text-slate-500">Desa Modern</span>
            </h2>
          </div>
          <p className="text-slate-400 text-base max-w-xs leading-relaxed md:text-right">
            Semua alat yang dibutuhkan perangkat desa untuk mengelola pengajuan, data, dan layanan secara efisien.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px]">
          {/* Large card - spans 2 cols 2 rows */}
          <BentoCard feature={features[0]} className="col-span-2 row-span-2" delay={0} />
          {/* Small */}
          <BentoCard feature={features[1]} className="col-span-1 row-span-1" delay={0.08} />
          {/* Medium */}
          <BentoCard feature={features[2]} className="col-span-1 row-span-2" delay={0.12} />
          {/* Small */}
          <BentoCard feature={features[3]} className="col-span-1 row-span-1" delay={0.16} />
          {/* Wide */}
          <BentoCard feature={features[4]} className="col-span-2 row-span-1" delay={0.2} />
          {/* Small */}
          <BentoCard feature={features[5]} className="col-span-1 row-span-1" delay={0.24} />
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  feature,
  className,
  delay,
}: {
  feature: (typeof features)[0];
  className: string;
  delay: number;
}) {
  const { icon: Icon, title, desc, bg, iconBg, iconColor, tag } = feature;
  const isDark = bg.includes("[#0F2744]") || bg.includes("blue-600");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: EASE_SPRING }}
      whileHover={{ scale: 1.02 }}
      className={`${className} ${bg} rounded-3xl p-6 flex flex-col justify-between overflow-hidden relative group cursor-pointer transition-shadow duration-300 hover:shadow-2xl`}
    >
      {/* Decorative circle */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-500" />

      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span
          className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-full ${
            isDark
              ? "bg-white/10 text-white/60"
              : "bg-black/8 text-slate-500"
          }`}
        >
          {tag}
        </span>
      </div>

      <div>
        <h3
          className={`font-black text-base leading-tight mb-1.5 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-xs leading-relaxed ${
            isDark ? "text-white/50" : "text-slate-500"
          }`}
        >
          {desc}
        </p>
      </div>
    </motion.div>
  );
}