import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EASE_SPRING, STAGGER_CONTAINER, FADE_UP } from "../constants/animation";
import {
  ArrowRight,
  Shield,
  Zap,
  FileText,
  CheckCircle2,
  Clock,
  Bell,
  Users,
  Activity,
  BarChart3,
  Lock,
  MapPin,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────────
   THREE.JS — AMBINET "SERBUK" PARTICLE SYSTEM (HIGH PERFORMANCE)
   Menggunakan THREE.Points & Custom Canvas Texture agar butiran berbentuk bulat lembut
   ────────────────────────────────────────────────────────────────────────── */
function ThreeLogoScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Pembuatan tekstur bulat lembut (soft circle) secara programmatik agar serbuk tidak berbentuk kotak
    const createCircleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
      }
        return new THREE.CanvasTexture(canvas);
    };

    // Konfigurasi Sistem Serbuk
    const particleCount = 1800; // Jumlah butiran serbuk
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Kecepatan dan sudut rotasi acak per partikel
    const speeds = new Float32Array(particleCount);
    const sways = new Float32Array(particleCount);

    const palette = [
      new THREE.Color(0x0b429c), // deep blue
      new THREE.Color(0xff511d), // vibrant orange
      new THREE.Color(0x84cc16), // lime green
      new THREE.Color(0x06b6d4), // teal
      new THREE.Color(0xeab308), // yellow
    ];

    for (let i = 0; i < particleCount; i++) {
      // Sebarkan partikel secara acak dalam ruang virtual
      positions[i * 3] = (Math.random() - 0.5) * 24;     // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z

      // Pengaturan animasi melayang individu
      speeds[i] = 0.01 + Math.random() * 0.02;
      sways[i] = Math.random() * Math.PI * 2;

      // Ambil warna acak dari palet logo DIGI DESA
      const randomColor = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = randomColor.r;
      colors[i * 3 + 1] = randomColor.g;
      colors[i * 3 + 2] = randomColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.14, // Ukuran butiran serbuk
      vertexColors: true,
      map: createCircleTexture(),
      transparent: true,
      opacity: 0.65, // Transparansi serbuk agar tetap estetik di latar belakang
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Parallax interaksi Mouse
    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ty = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);

    const clock = new THREE.Clock();
    let raf = 0;
    
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      
      const posAttr = geometry.attributes.position;
      
      // Animasi pergerakan serbuk (naik perlahan seperti debu tertiup angin)
      for (let i = 0; i < particleCount; i++) {
        // Serbuk bergerak naik secara vertikal (Y)
        posAttr.array[i * 3 + 1] += speeds[i];
        // Efek goyangan halus ke samping (X) memanfaatkan sin/cos
        posAttr.array[i * 3] += Math.sin(t * 0.5 + sways[i]) * 0.003;

        // Jika serbuk keluar batas atas layar, kembalikan ke bawah layar
        if (posAttr.array[i * 3 + 1] > 8) {
          posAttr.array[i * 3 + 1] = -8;
          posAttr.array[i * 3] = (Math.random() - 0.5) * 24;
        }
      }
      posAttr.needsUpdate = true;

      // Easing pergerakan kamera mengikuti mouse secara halus
      mx += (tx - mx) * 0.04;
      my += (ty - my) * 0.04;
      particleSystem.rotation.y = mx * 0.25;
      particleSystem.rotation.x = -my * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

/* ──────────────────────────────────────────────────────────────────────────
   ANIMATED LOGO TITLE — "DIGI DESA" (Unchanged)
   ────────────────────────────────────────────────────────────────────────── */
type LetterSpec = {
  ch: string;
  bg: string;
  shape: string;
  rotate?: number;
};

const LOGO_LETTERS: LetterSpec[] = [
  { ch: "D", bg: "bg-[#0b429c]", shape: "rounded-l-[2rem] rounded-r-md", rotate: -2 },
  { ch: "I", bg: "bg-[#84cc16]", shape: "rounded-full", rotate: 1 },
  { ch: "G", bg: "bg-[#ff511d]", shape: "rounded-full", rotate: -1 },
  { ch: "I", bg: "bg-[#0b429c]", shape: "rounded-t-[2rem] rounded-b-md", rotate: 2 },
  { ch: " ", bg: "", shape: "" },
  { ch: "D", bg: "bg-[#ff511d]", shape: "rounded-l-full rounded-r-md", rotate: -1 },
  { ch: "E", bg: "bg-[#3b2d8f]", shape: "rounded-md", rotate: 1 },
  { ch: "S", bg: "bg-[#6d2828]", shape: "rounded-lg", rotate: -2 },
  { ch: "A", bg: "bg-[#eab308]", shape: "rounded-t-[2rem] rounded-b-md", rotate: 2 },
];

function LogoTitle() {
  return (
    <div className="flex flex-wrap items-end gap-1.5 sm:gap-2">
      {LOGO_LETTERS.map((l, i) =>
        l.ch === " " ? (
          <span key={i} className="w-3 sm:w-5" />
        ) : (
          <motion.span
            key={i}
            initial={{ y: 60, opacity: 0, rotate: (l.rotate ?? 0) * 4 }}
            animate={{ y: 0, opacity: 1, rotate: l.rotate ?? 0 }}
            transition={{
              duration: 0.7,
              delay: 0.25 + i * 0.06,
              ease: EASE_SPRING,
            }}
            whileHover={{ y: -6, rotate: (l.rotate ?? 0) + (i % 2 ? 4 : -4) }}
            className={`${l.bg} ${l.shape} inline-flex items-center justify-center text-white font-black font-sora shadow-md`}
            style={{
              width: "clamp(2.2rem, 5vw, 3.6rem)",
              height: "clamp(2.8rem, 6vw, 4.6rem)",
              fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
              lineHeight: 1,
            }}
          >
            {l.ch}
          </motion.span>
        )
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   "Administrasi" with a dot that hops between the two "i" letters (Unchanged)
   ────────────────────────────────────────────────────────────────────────── */
function AdministrasiHopping() {
  const i1Ref = useRef<HTMLSpanElement>(null);
  const i2Ref = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [pts, setPts] = useState<{ x1: number; x2: number; y: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      if (!i1Ref.current || !i2Ref.current || !wrapRef.current) return;
      const wrap = wrapRef.current.getBoundingClientRect();
      const a = i1Ref.current.getBoundingClientRect();
      const b = i2Ref.current.getBoundingClientRect();
      setPts({
        x1: a.left - wrap.left + a.width / 2,
        x2: b.left - wrap.left + b.width / 2,
        y: a.top - wrap.top - a.height * 0.15,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 500);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  return (
    <span ref={wrapRef} className="relative inline-block lg:mt-6">
      <span className="inline-block">A</span>
      <span className="inline-block">d</span>
      <span className="inline-block">m</span>
      <span ref={i1Ref} className="inline-block">ı</span>
      <span className="inline-block">n</span>
      <span className="inline-block">i</span>
      <span className="inline-block">s</span>
      <span className="inline-block">t</span>
      <span className="inline-block">r</span>
      <span className="inline-block">a</span>
      <span className="inline-block">s</span>

      <span ref={i2Ref} className="inline-block">ı</span>

      {pts && (
        <motion.span
          aria-hidden
          className="absolute rounded-full bg-[#ff511d] shadow-[0_4px_12px_rgba(255,81,29,0.45)]"
          style={{
            width: "0.28em",
            height: "0.28em",
            top: pts.y,
            left: 0,
            translateX: "-50%",
          }}
          initial={{ x: pts.x1 }}
          animate={{
            x: [pts.x1, pts.x1, pts.x2, pts.x2, pts.x1],
            y: [0, -18, 0, -18, 0],
            scale: [1, 0.85, 1.05, 0.85, 1],
          }}
          transition={{
            duration: 2.5,
            times: [0, 0.22, 0.5, 0.72, 1],
            ease: ["easeOut", "easeIn", "easeOut", "easeIn"],
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        />
      )}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   FLOATING CARDS & ASSETS (Unchanged)
   ────────────────────────────────────────────────────────────────────────── */
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.4, delay: 1.2, ease: EASE_SPRING }}
        className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
      />
    </div>
  );
}

function CardStats() {
  const stats = [
    { label: "Warga Terdaftar", value: "4.821", icon: Users },
    { label: "Pengajuan Aktif", value: "138", icon: FileText },
    { label: "Tingkat Selesai", value: "96.4%", icon: Activity },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2.5 }}
      whileHover={{ y: 8, x: 8 }}
      transition={{ duration: 0.9, delay: 0.4, ease: EASE_SPRING }}
      className="absolute -left-8 top-8 w-80 bg-white rounded-2xl border border-slate-200 shadow-lg p-6 z-10 hover:shadow-xl hover:z-50 cursor-pointer transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Dashboard</p>
          <p className="text-xs text-slate-400">Ringkasan Pelayanan</p>
        </div>
      </div>
      <div className="space-y-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <Icon className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className="text-lg font-bold text-slate-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CardLetter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48, x: 16 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.9, delay: 0.55, ease: EASE_SPRING }}
      whileHover={{ y: -12, x: -8 }}
      className="relative w-96 bg-white rounded-2xl border border-slate-200 shadow-lg p-7 z-20 hover:shadow-xl hover:z-50 cursor-pointer transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Pengajuan Terakhir</p>
          <h4 className="text-base font-bold text-slate-900">Surat Keterangan Domisili</h4>
          <p className="text-xs text-slate-500 mt-1">ID: SKD-2026-00841</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-medium text-blue-700">Proses</span>
        </div>
      </div>
      <div className="space-y-4 mb-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pemohon</p>
            <p className="text-sm font-bold text-slate-900">Budi Santoso</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Estimasi Selesai</p>
            <p className="text-sm font-bold text-slate-900">Hari ini 14:00 WIB</p>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-600">Progress Verifikasi</p>
          <p className="text-sm font-bold text-blue-600">65%</p>
        </div>
        <ProgressBar value={65} />
      </div>
      <div className="flex items-center justify-between gap-2">
        {["Terima", "Verifikasi", "TTD", "Selesai"].map((step, i) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 font-semibold text-xs ${
                i < 2 ? "bg-blue-600 text-white" : i === 2 ? "bg-blue-200 text-blue-700" : "bg-slate-100 text-slate-400"
              }`}
            >
              {i < 2 ? "✓" : i}
            </div>
            <p className="text-xs text-center text-slate-600 font-medium">{step}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CardNotification() {
  const items = [
    { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100", text: "SK Usaha dari Dewi R. sudah diterbitkan", time: "2 menit lalu" },
    { icon: Bell, color: "text-orange-600", bg: "bg-orange-100", text: "3 pengajuan menunggu verifikasi RT", time: "11 menit lalu" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, x: 24, y: 16 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      whileHover={{ x: -8, y: -4 }}
      transition={{ duration: 0.8, delay: 0.75, ease: EASE_SPRING }}
      className="absolute -right-8 bottom-12 w-72 bg-white rounded-2xl border border-slate-200 shadow-lg p-5 z-30 hover:shadow-xl hover:z-50 cursor-pointer transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
          <Bell className="w-4 h-4 text-slate-600" />
        </div>
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Notifikasi</span>
        <span className="ml-auto text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      <div className="space-y-3">
        {items.map(({ icon: Icon, color, bg, text, time }) => (
          <div key={text} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 leading-snug">{text}</p>
              <p className="text-xs text-slate-400 mt-1">{time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function FloatingCards() {
  return (
    <div className="relative w-full h-full min-h-[560px] flex items-center justify-center">
      <CardStats />
      <div className="relative z-20 mt-8 mr-0">
        <CardLetter />
      </div>
      <CardNotification />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.5, ease: EASE_SPRING }}
        className="absolute top-4 right-12 bg-white border border-slate-200 rounded-lg px-3.5 py-2 shadow-md z-40 flex items-center gap-2"
      >
        <Lock className="w-4 h-4 text-emerald-600" />
        <span className="text-xs font-semibold text-slate-700">Enkripsi Terjamin</span>
      </motion.div>
    </div>
  );
}

function TrustStrip() {
  const items = [
    { icon: Shield, label: "Keamanan Data Terjamin" },
    { icon: Lock, label: "Enkripsi End-to-End" },
    { icon: Zap, label: "Proses Instan" },
    { icon: MapPin, label: "Solusi Lokal" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.0, duration: 0.6 }}
      className="mt-12 pt-10 border-t border-slate-200"
    >
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">Keunggulan Platform</p>
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-10 gap-y-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 text-slate-600">
            <Icon className="w-4 h-4 text-[#0b429c] flex-shrink-0" />
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   MAIN HERO SECTION
   ────────────────────────────────────────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16 bg-white">
      
      {/* BACKGROUND CANVAS — Efek Serbuk Interaktif */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <ThreeLogoScene />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-12 lg:gap-8 items-center min-h-[calc(100vh-4rem)] py-20">
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="show"
            className="max-w-2xl relative z-10"
          >
            {/* TITLE */}
            <h1 className="font-black tracking-tight leading-[1.15] text-slate-900 mb-8 font-sora">
              <span className="block overflow-hidden py-1">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: EASE_SPRING }}
                  className="block text-slate-800 bg-none text-3xl sm:text-4xl lg:text-5xl"
                >
                  Transformasi Tata Kelola
                </motion.span>
              </span>

              {/* "Administrasi" with hopping dot + "Desa" */}
              <span className="block overflow-hidden py-2">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: EASE_SPRING }}
                  className="block text-slate-900 text-4xl sm:text-5xl lg:text-[3.6rem]"
                >
                  <AdministrasiHopping />
                  <span> Desa</span>
                </motion.span>
              </span>

              {/* DIGI DESA logo-style block */}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: EASE_SPRING }}
                className="block mt-5"
              >
                <LogoTitle />
              </motion.span>
            </h1>

            <motion.p
              variants={FADE_UP}
              className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl mb-10"
            >
              Urus surat keterangan, pantau transparansi sirkulasi anggaran, hingga kembangkan
              potensi komoditas wilayah dalam satu ekosistem interaktif modern terpadu.
            </motion.p>

            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-start gap-3 mb-8">
              <motion.a
                href="/login"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group flex w-full sm:w-auto justify-center items-center gap-2.5 bg-[#0b429c] hover:bg-[#ff511d] text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300 text-xs tracking-wider uppercase"
              >
                Masuk Aplikasi
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.a>
            </motion.div>

            <TrustStrip />
          </motion.div>

          <div className="relative hidden lg:block">
            <FloatingCards />
          </div>
        </div>
      </div>
    </section>
  );
}