import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EASE_SPRING } from "../constants/animation";
import { Clock, MessageCircle, Users, ArrowRight } from "lucide-react";

const stats = [
  { value: "24/7", label: "Layanan aktif tanpa henti" },
  { value: "< 2m", label: "Rata-rata waktu respons" },
  { value: "99%", label: "Tingkat kepuasan warga" },
];

const items = [
  {
    icon: Clock,
    number: "01",
    title: "Layanan Siap 24 Jam",
    description:
      "Platform selalu tersedia untuk kebutuhan administrasi desa, kapan pun warga atau pengurus membutuhkannya.",
  },
  {
    icon: MessageCircle,
    number: "02",
    title: "Koordinasi RT/RW Lebih Lancar",
    description:
      "Pesan dan notifikasi membantu pengurus desa merespons warga secara cepat dan terstruktur.",
  },
  {
    icon: Users,
    number: "03",
    title: "Keterlibatan Warga",
    description:
      "Membuka jalur komunikasi yang jelas agar warga dapat ikut serta dalam proses pelayanan.",
  },
];

export default function PlatformSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.7, 0.8, 0.8, 0.7]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Full-bleed background image with zoom parallax */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          style={{ scale: imgScale, opacity: imgOpacity }}
          className="absolute inset-0"
        >
        </motion.div>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-28 w-full flex flex-col justify-between flex-1 relative z-10">
        {/* Top: Label + Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_SPRING }}
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-20"
        >
          <div className="max-w-lg">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-4">
              Keunggulan Platform
            </p>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1] tracking-tighter">
              Operasi desa
              <br />
              <em className="not-italic text-slate-300">yang lebih</em>
              <br />
              terkoordinasi.
            </h2>
          </div>

          {/* Stats */}
          <div className="flex gap-10 md:gap-16 pt-2">
            {stats.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_SPRING }}
              >
                <p className="text-4xl md:text-5xl font-black text-blue-600 leading-none mb-1">
                  {value}
                </p>
                <p className="text-xs text-slate-400 font-medium max-w-[80px] leading-tight">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom: Horizontal numbered list */}
        <div className="border-t border-slate-100">
          {items.map(({ icon: Icon, number, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: EASE_SPRING }}
              className="group flex items-start gap-8 py-8 border-b border-slate-100 cursor-pointer"
            >
              <span className="text-[11px] font-black text-slate-300 tracking-widest pt-1 w-6 flex-shrink-0">
                {number}
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-lg">{description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200 mt-1 flex-shrink-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}