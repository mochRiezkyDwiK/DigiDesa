import { motion } from "framer-motion";
import { CheckCircle2, Clock, Zap, BadgeCheck } from "lucide-react";

const STEPS = [
  {
    key: "BARU",
    label: "Laporan Masuk",
    desc: "Laporan diterima sistem",
    icon: Clock,
    color: "text-slate-400",
    bg: "bg-slate-100",
    activeBg: "bg-amber-500",
    activeColor: "text-white",
    activeRing: "ring-amber-200",
    line: "bg-slate-200",
    activeLine: "bg-amber-400",
  },
  {
    key: "DITUGASKAN",
    label: "Ditugaskan",
    desc: "Petugas sedang ditentukan",
    icon: Zap,
    color: "text-slate-400",
    bg: "bg-slate-100",
    activeBg: "bg-blue-500",
    activeColor: "text-white",
    activeRing: "ring-blue-200",
    line: "bg-slate-200",
    activeLine: "bg-blue-400",
  },
  {
    key: "PROSES",
    label: "Diproses",
    desc: "Petugas sedang menangani",
    icon: BadgeCheck,
    color: "text-slate-400",
    bg: "bg-slate-100",
    activeBg: "bg-violet-500",
    activeColor: "text-white",
    activeRing: "ring-violet-200",
    line: "bg-slate-200",
    activeLine: "bg-violet-400",
  },
  {
    key: "SELESAI",
    label: "Selesai",
    desc: "Laporan telah ditangani",
    icon: CheckCircle2,
    color: "text-slate-400",
    bg: "bg-slate-100",
    activeBg: "bg-emerald-500",
    activeColor: "text-white",
    activeRing: "ring-emerald-200",
    line: "bg-slate-200",
    activeLine: "bg-emerald-400",
  },
];

interface StatusTimelineProps {
  status: string;
  className?: string;
}

export default function StatusTimeline({ status, className = "" }: StatusTimelineProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      {STEPS.map((step, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = step.icon;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.key} className="flex items-start gap-4">
            {/* Kolom kiri: lingkaran + garis vertikal */}
            <div className="flex flex-col items-center flex-shrink-0">
              <motion.div
                initial={false}
                animate={
                  isActive
                    ? { backgroundColor: "#000", scale: 1 }
                    : { backgroundColor: "#e2e8f0", scale: 1 }
                }
                className={`w-9 h-9 rounded-full flex items-center justify-center ring-4 transition-all duration-500 ${
                  isActive
                    ? `${step.activeBg} ${step.activeRing} ring-opacity-50`
                    : `${step.bg} ring-transparent`
                } ${isCurrent ? "shadow-lg" : ""}`}
                style={{ backgroundColor: undefined }} // Let Tailwind classes take over
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0.4 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <Icon
                    size={16}
                    className={isActive ? step.activeColor : step.color}
                    strokeWidth={2.5}
                  />
                </motion.div>
              </motion.div>

              {/* Garis vertikal antara langkah */}
              {!isLast && (
                <div className="w-0.5 flex-1 my-1 min-h-[28px] overflow-hidden relative">
                  <div className={`absolute inset-0 ${step.line}`} />
                  <motion.div
                    initial={{ scaleY: 0, originY: 0 }}
                    animate={{ scaleY: isActive ? 1 : 0, originY: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    className={`absolute inset-0 ${step.activeLine}`}
                    style={{ transformOrigin: "top" }}
                  />
                </div>
              )}
            </div>

            {/* Kolom kanan: teks */}
            <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
              <motion.p
                animate={
                  isCurrent
                    ? { color: "#0f172a", fontWeight: 800 }
                    : isActive
                    ? { color: "#334155", fontWeight: 700 }
                    : { color: "#94a3b8", fontWeight: 600 }
                }
                transition={{ duration: 0.3 }}
                className="text-sm leading-none"
              >
                {step.label}
              </motion.p>
              <p
                className={`text-[11px] mt-1 leading-relaxed transition-colors duration-300 ${
                  isActive ? "text-slate-500" : "text-slate-300"
                }`}
              >
                {step.desc}
              </p>
              {isCurrent && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mt-1.5 inline-block px-2 py-0.5 rounded text-[9px] font-black tracking-widest bg-blue-50 text-blue-600 border border-blue-100"
                >
                  STATUS SAAT INI
                </motion.span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
