import { motion } from "framer-motion";
import { EASE_SPRING } from "../../constants/animation";
import { ShieldCheck, Layout, Globe2 } from "lucide-react";

export default function KebijakanPrivasi() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-6 py-20">
      <div className="max-w-5xl mx-auto space-y-10">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_SPRING }}
          className="rounded-[2rem] bg-white shadow-xl border border-slate-200 p-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-3xl bg-blue-600 text-white grid place-items-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold">Kebijakan Privasi</p>
              <h1 className="text-4xl font-extrabold text-slate-950 mt-3">Perlindungan Data Warga</h1>
            </div>
          </div>
          <p className="text-slate-600 text-lg leading-relaxed">
            Kami menghargai privasi Anda. Sistem ini dirancang untuk mengelola data warga sesuai dengan prinsip keamanan, transparansi, dan kepatuhan terhadap peraturan yang berlaku.
          </p>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: Globe2,
              title: "Akses Data",
              description: "Akses informasi hanya diberikan kepada pihak yang berwenang dan sesuai peran masing-masing.",
            },
            {
              icon: Layout,
              title: "Penggunaan Data",
              description: "Data digunakan semata untuk layanan administrasi desa dan komunikasi resmi.",
            },
            {
              icon: ShieldCheck,
              title: "Keamanan",
              description: "Kami menjaga keamanan data dengan infrastruktur dan kontrol akses yang ketat.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_SPRING }}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mb-6">
                <item.icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h2>
              <p className="text-slate-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_SPRING, delay: 0.1 }}
          className="rounded-[2rem] bg-white shadow-xl border border-slate-200 p-10"
        >
          <h2 className="text-2xl font-bold text-slate-950 mb-4">Prinsip utama:</h2>
          <ul className="space-y-4 text-slate-600 leading-relaxed list-disc list-inside">
            <li>Informasi digunakan hanya untuk keperluan administrasi desa dan pelayanan warga.</li>
            <li>Data dilindungi dengan protokol keamanan dan hak akses terbatas.</li>
            <li>Warga berhak mengetahui bagaimana data mereka dikelola.</li>
          </ul>
        </motion.section>
      </div>
    </div>
  );
}
