import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EASE_SPRING } from "../constants/animation";
import { ShieldCheck, MapPin, Users } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Keamanan & Kepatuhan",
    description:
      "Semua data diproses sesuai standar keamanan dan kebijakan privasi untuk memastikan kepercayaan warga.",
    color: "from-blue-600 to-blue-700",
    lightColor: "bg-blue-600",
    number: "01",
  },
  {
    icon: MapPin,
    title: "Akses Mudah untuk Semua",
    description:
      "Tampilan intuitif dan navigasi sederhana membuat platform mudah digunakan oleh semua kalangan.",
    color: "from-indigo-600 to-indigo-700",
    lightColor: "bg-indigo-600",
    number: "02",
  },
  {
    icon: Users,
    title: "Partisipasi Warga",
    description:
      "Warga terlibat aktif dengan layanan desa melalui pelaporan dan informasi yang terbuka.",
    color: "from-violet-600 to-violet-700",
    lightColor: "bg-violet-600",
    number: "03",
  },
];

export default function ValueSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-slate-950 py-32">
      {/* Textured background image */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.07]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1600&q=80')",
          }}
        />
      </motion.div>

      {/* Radial gradient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-[100px] -z-10" />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — Sticky large text */}
          <motion.div
            style={{ y: textY }}
            className="lg:sticky lg:top-32"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE_SPRING }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-400 mb-6">
                Nilai Utama
              </p>
              <h2 className="text-6xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8">
                Prinsip
                <br />
                <span className="text-slate-600">kami</span>
                <br />
                untuk desa
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  digital.
                </span>
              </h2>
              <p className="text-slate-500 text-base leading-relaxed max-w-sm">
                Menjaga keamanan, kemudahan, dan keterlibatan warga sebagai landasan setiap layanan yang kami bangun.
              </p>

              {/* Decorative element */}
              <div className="mt-12 flex items-center gap-3">
                <div className="h-px flex-1 max-w-[60px] bg-slate-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <div className="h-px flex-1 max-w-[60px] bg-slate-700" />
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Value cards stacked */}
          <div className="flex flex-col gap-4">
            {values.map(({ icon: Icon, title, description, number, lightColor }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE_SPRING }}
                className="group relative rounded-3xl border border-white/5 bg-white/[0.03] p-7 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* Number watermark */}
                <span className="absolute top-4 right-6 text-6xl font-black text-white/[0.03] select-none">
                  {number}
                </span>

                <div className="flex items-start gap-5">
                  <div
                    className={`w-12 h-12 rounded-2xl ${lightColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full ${lightColor} transition-all duration-500 rounded-b-3xl`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}