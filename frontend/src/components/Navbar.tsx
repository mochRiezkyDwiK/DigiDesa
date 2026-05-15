import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronDown, FileText, Building2, MessageSquare } from "lucide-react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [layananDropdown, setLayananDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {23
    const handleClickOutside = (event: MouseEvent) => {
      if (layananDropdown) {
        setLayananDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [layananDropdown]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white border-b border-gray-300 shadow-sm"
          : "bg-white border-b border-gray-300"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 flex items-center justify-center border border-gray-300">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <a href="/" className="hidden sm:block">
            <span className="font-bold text-gray-900 tracking-wide text-base">
              DigiDesa
            </span>
            <div className="text-xs text-gray-600 font-medium">Pemerintah Desa</div>
          <span className="font-extrabold text-slate-900 tracking-tight text-[1.1rem]">
            Digi<span className="text-blue-700">Desa</span>
          </span>
          <a href="/" className="font-extrabold text-slate-900 tracking-tight text-[1.1rem]">
            Digi<span className="text-blue-700">Desa</span>
          </a>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {/* Dropdown Layanan */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLayananDropdown(!layananDropdown);
              }}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              Layanan
              <ChevronDown className={`w-4 h-4 transition-transform ${layananDropdown ? 'rotate-180' : ''}`} />
            </button>

            {layananDropdown && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 shadow-md py-2 z-50"
              >
                <button
                  onClick={() => {
                    navigate('/lapor');
                    setLayananDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3 border-b border-gray-200"
                >
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Layanan Pengaduan</div>
                    <div className="text-xs text-gray-500">Laporan dan keluhan warga</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigate('/surat');
                    setLayananDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <FileText className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Pembuatan Surat</div>
                    <div className="text-xs text-gray-500">Administrasi kependudukan</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Menu lainnya */}
          {[
            { name: "Transparansi", path: "/transparansi-anggaran" },
            { name: "Pengumuman", path: "/pengumuman" },
            { name: "Bantuan", path: "/bantuan" }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* <button
            type="button"
            onClick={() => navigate('/login')}
            className="hidden sm:block text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Masuk
          </button> */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-white bg-slate-800 px-5 py-2 hover:bg-slate-900 transition-colors"
          >
            Portal Warga
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;