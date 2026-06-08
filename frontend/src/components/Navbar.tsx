"use client";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  ChevronDown, 
  FileText, 
  MessageSquare, 
  Search, 
  Bell, 
  User, 
  LogOut 
} from "lucide-react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [layananDropdown, setLayananDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();

  // 1. Ambil data profil jika token ditemukan (Sudah Login)
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        // 🔄 PERBAIKAN: Samakan endpoint dengan halaman Surat (/auth/me)
        const res = await axios.get("http://localhost:5000/api/v1/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 🔄 PERBAIKAN: Sesuaikan dengan res.data.success dan res.data.data dari MySQL
        if (res.data && res.data.success) {
          setUser(res.data.data);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Gagal sinkronisasi sesi di navbar:", error);
        // Jika token expired atau tidak valid, hapus token demi keamanan
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setLayananDropdown(false);
      setUserDropdown(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white border-b border-gray-300 shadow-sm"
          : "bg-white border-b border-gray-300"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 bg-transparent border-none p-0 cursor-pointer">
            <img className="h-12 w-auto" src="/image/logo_digidesa.png" alt="Logo" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {/* Dropdown Layanan */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserDropdown(false);
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
                className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 shadow-md py-2 z-50 rounded-xl"
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
                    navigate('/buat-surat');
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
            { name: "Bantuan", link: "https://cekbansos.kemensos.go.id/" }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => item.link ? window.open(item.link, "_blank") : item.path && navigate(item.path)}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Actions / Autentikasi User */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-white bg-slate-800 px-5 py-2 hover:bg-slate-900 transition-colors rounded-xl shadow-sm"
            >
              Portal Warga
            </button>
          ) : (
            <div className="relative flex items-center gap-3 pl-4 border-l border-gray-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLayananDropdown(false);
                  setUserDropdown(!userDropdown);
                }}
                className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  {/* 🔄 PERBAIKAN: Antisipasi kalau field di DB bernama 'nama' atau 'nama_lengkap' */}
                  <p className="text-xs font-black text-gray-900 leading-none group-hover:text-blue-600 transition-colors">
                    {user?.nama || user?.nama_lengkap || "Warga Digital"}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1">
                    RT {user?.rt || "00"} / RW {user?.rw || "00"}
                  </p>
                </div>
                <img
                  className="w-9 h-9 rounded-xl border border-gray-200 shadow-sm ring-2 ring-gray-50 group-hover:ring-blue-100 transition-all"
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.nama || user?.nama_lengkap || "default"}`}
                  alt="Avatar"
                />
              </button>

              {/* Dropdown Menu Akun Warga */}
              {userDropdown && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg py-1 z-50 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                  >
                    <User size={14} className="text-gray-400" />
                    Profil Saya
                  </button>
                  <hr className="border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                  >
                    <LogOut size={14} />
                    Keluar Sesi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;