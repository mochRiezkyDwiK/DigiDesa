import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EASE_SPRING, STAGGER_CONTAINER, FADE_UP } from "../constants/animation";
import { useEffect, useState } from "react";
import { ChevronDown, FileText, Layers, MessageSquare } from "lucide-react";



function Navbar() {
  const [scrolled, setScrolled] = useState(false); 
  const [layananDropdown, setLayananDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (layananDropdown) {
        setLayananDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [layananDropdown]);
  
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_SPRING }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_24px_rgba(30,58,138,0.06)]"
          : "bg-transparent py-2"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <a href="/" className="font-extrabold text-slate-900 tracking-tight text-[1.1rem]">
            Digi<span className="text-blue-700">Desa</span>
          </a>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {/* Dropdown Layanan */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLayananDropdown(!layananDropdown);
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 flex items-center gap-1"
            >
              Layanan
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${layananDropdown ? 'rotate-180' : ''}`} />
            </button>

            {layananDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-900/10 py-2 z-50"
              >
                <button
                  onClick={() => {
                    navigate('/lapor');
                    setLayananDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200 flex items-center gap-3"
                >
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Pengaduan</div>
                    <div className="text-xs text-slate-500">Laporkan masalah atau keluhan</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigate('/surat');
                    setLayananDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200 flex items-center gap-3"
                >
                  <FileText className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium">Pembuatan Surat</div>
                    <div className="text-xs text-slate-500">SKTM, KTP, dan lainnya</div>
                  </div>
                </button>
              </motion.div>
            )}
          </div>

          {/* Menu lainnya */}
          {[
            { name: "Transparansi Anggaran", path: "/transparansi-anggaran" },
            { name: "Pengumuman", path: "/pengumuman" },
            { name: "Bantuan", path: "/bantuan" }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200">
            Masuk
          </button>
          <motion.button
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm font-bold text-white bg-slate-900 px-5 py-2.5 rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all"
          >
            Portal RW/RT
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;