import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, ExternalLink, ArrowUpRight, BarChart3, PieChart, ShieldCheck } from "lucide-react";

interface BudgetItem {
  label: string;
  allocated: number;
  realized: number;
  color: string;
  bgColor: string;
  glowColor: string;
}

interface SectorItem {
  label: string;
  percentage: number;
  amount: string;
  color: string;
  emoji: string;
}

const budgetItems: BudgetItem[] = [
  {
    label: "Pendapatan Desa",
    allocated: 1_650_000_000,
    realized: 1_580_000_000,
    color: "bg-blue-600",
    bgColor: "bg-blue-50",
    glowColor: "shadow-blue-500/20",
  },
  {
    label: "Pengeluaran Desa",
    allocated: 1_650_000_000,
    realized: 1_412_000_000,
    color: "bg-slate-800",
    bgColor: "bg-slate-100",
    glowColor: "shadow-slate-800/20",
  },
];

const sectors: SectorItem[] = [
  {
    label: "Infrastruktur & Digitalisasi",
    percentage: 40,
    amount: "Rp 564.8 Juta",
    color: "bg-blue-600",
    emoji: "🏢",
  },
  {
    label: "Pemberdayaan Warga",
    percentage: 30,
    amount: "Rp 423.6 Juta",
    color: "bg-blue-400",
    emoji: "🤝",
  },
  {
    label: "Kesehatan & Posyandu",
    percentage: 20,
    amount: "Rp 282.4 Juta",
    color: "bg-slate-700",
    emoji: "🏥",
  },
  {
    label: "Operasional & Darurat",
    percentage: 10,
    amount: "Rp 141.2 Juta",
    color: "bg-slate-400",
    emoji: "📋",
  },
];

const EASE_LIQUID = [0.25, 1, 0.5, 1]; // Smooth liquid easing

function DonutChart({ sectors }: { sectors: SectorItem[] }) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 64;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * r;

  // Professional blue & slate palette matching the constants
  const colors = ["#2563eb", "#60a5fa", "#334155", "#94a3b8"];

  let cumulativePercent = 0;
  const slices = sectors.map((s, i) => {
    const offset = circumference * (1 - cumulativePercent / 100);
    const dasharray = (s.percentage / 100) * circumference;
    cumulativePercent += s.percentage;
    return { offset, dasharray, color: colors[i] };
  });

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
          {slices.map((slice, i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circumference}`, strokeDashoffset: circumference }}
              animate={{ 
                strokeDasharray: `${slice.dasharray} ${circumference}`,
                strokeDashoffset: slice.offset 
              }}
              transition={{ duration: 1.8, ease: EASE_LIQUID, delay: i * 0.15 }}
            />
          ))}
        </svg>
        
        {/* Liquid Center Badge */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: EASE_LIQUID, delay: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center m-[26px] bg-white rounded-full shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] border border-slate-50"
        >
          <span className="text-2xl font-black text-slate-900 tracking-tight">85.5%</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider scale-90">
            Realisasi
          </span>
        </motion.div>
      </div>
    </div>
  );
}

function formatRupiah(amount: number): string {
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(2)} M`;
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(0)} Juta`;
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function BudgetTransparency() {
  return (
    <section className="py-20 bg-white w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <p className="text-[11px] font-bold tracking-wider text-blue-700 uppercase">
                Akuntabilitas Publik
              </p>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Transparansi Dana Desa 2026
            </h2>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed">
              Wujud keterbukaan penuh tata kelola keuangan pemerintah desa. Setiap rupiah dialokasikan secara presisi demi kesejahteraan warga.
            </p>
          </div>
          
          <motion.a
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            href="/transparansi-anggaran"
            className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 rounded-xl px-5 py-3 transition-colors w-fit"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analisis Detail Anggaran</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </motion.a>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SISI KIRI: PROGRESS BARS */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-slate-800">Ikhtisar Neraca Keuangan</span>
                </div>
                <span className="text-[11px] bg-slate-100 text-slate-600 font-bold uppercase tracking-wider rounded-md px-2.5 py-1">
                  Live Update Q2 2026
                </span>
              </div>

              <div className="space-y-8">
                {budgetItems.map((item) => {
                  const percentage = Math.round((item.realized / item.allocated) * 100);
                  return (
                    <div key={item.label} className="group">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-2.5 gap-1">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-slate-900">
                            {formatRupiah(item.realized)}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            dari {formatRupiah(item.allocated)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Liquid Track */}
                      <div className={`relative h-5 rounded-full ${item.bgColor} border border-slate-100 p-[2px] overflow-hidden`}>
                        <motion.div
                          className={`h-full rounded-full ${item.color} shadow-sm ${item.glowColor}`}
                          initial={{ width: "0%" }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1.5, ease: EASE_LIQUID }}
                          style={{ position: "relative" }}
                        >
                          {/* Liquid Sheen Animation Effect */}
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                          />
                        </motion.div>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700 mix-blend-difference">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Core Metrics Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 transition-all hover:bg-blue-50/20 hover:border-blue-100">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Silpa / Sisa Kas</p>
                <p className="text-lg font-black text-blue-600">Rp 168.0 Juta</p>
              </div>
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 transition-all hover:bg-blue-50/20 hover:border-blue-100">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Efisiensi Belanja</p>
                <p className="text-lg font-black text-slate-800">14.5%</p>
              </div>
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 transition-all hover:bg-blue-50/20 hover:border-blue-100">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Status Audit</p>
                <p className="text-lg font-black text-slate-700 flex items-center gap-1">
                  WTP <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                </p>
              </div>
            </div>
          </div>

          {/* SISI KANAN: SECTOR BREAKDOWN */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
                <PieChart className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-bold text-slate-800">Alokasi per Sektor</p>
              </div>

              <DonutChart sectors={sectors} />
            </div>

            {/* Custom Interactive Legend List */}
            <div className="space-y-3.5 mt-4">
              {sectors.map((sector) => (
                <div key={sector.label} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/70 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm shadow-sm">
                      {sector.emoji}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-none mb-1">{sector.label}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{sector.amount}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <motion.div
                        className={`h-full rounded-full ${sector.color}`}
                        initial={{ width: "0%" }}
                        animate={{ width: `${sector.percentage}%` }}
                        transition={{ duration: 1.5, ease: EASE_LIQUID, delay: 0.2 }}
                      />
                    </div>
                    <span className="text-xs font-black text-slate-700 w-8 text-right">
                      {sector.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}