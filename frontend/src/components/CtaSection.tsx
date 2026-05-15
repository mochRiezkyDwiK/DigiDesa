import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { EASE_SPRING } from "../constants/animation";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE_SPRING }}
          className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-[2.5rem] p-12 md:p-16 overflow-hidden text-center shadow-2xl"
        >
          <img
            src="/image/image_kbb.png"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-slate-950/40" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-[80px]" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-violet-500 rounded-full opacity-20 blur-[80px]" />

          <div className="relative z-10">
            <p className="text-blue-400 text-[10px] font-extrabold uppercase tracking-[0.2em] mb-4">
              Portal Warga & Pengurus
            </p>
            <h2 className="text-4xl md:text-[2.6rem] font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Siap mempermudah
              <br />
              birokrasi lingkunganmu?
            </h2>
            <p className="text-slate-300 text-lg max-w-xl mx-auto mb-10 font-medium">
              Gabung sekarang dan nikmati kemudahan akses informasi serta administrasi dalam satu pintu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 bg-blue-600 text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg hover:bg-blue-500 transition-all text-[0.95rem] w-full sm:w-auto justify-center"
              >
                Masuk Portal
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <button className="text-slate-300 font-bold text-sm hover:text-white transition-colors duration-200">
                Lihat Panduan →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
