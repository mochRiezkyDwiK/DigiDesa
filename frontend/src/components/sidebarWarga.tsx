import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  User,
  LogOut,
  X
} from "lucide-react";

interface SidebarWargaProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function SidebarWarga({ isOpen, setIsOpen }: SidebarWargaProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Ringkasan", icon: LayoutDashboard, path: "/dashboard-warga" },
    { name: "Pengajuan Surat", icon: FileText, path: "/layanan" },
    { name: "Lapor Keluhan", icon: MessageSquare, path: "/lapor" },
    { name: "Profil Saya", icon: User, path: "/profile" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-[#F8F9FA] border-r border-slate-200/60 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-24 px-8 flex items-center justify-between border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight">Portal Warga</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            // Deteksi apakah path saat ini cocok dengan menu (termasuk sub-path)
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? "text-blue-600" : "text-slate-400"}
                />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Footer Sidebar (Logout) */}
        <div className="p-4 border-t border-slate-200/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={20} />
            Keluar Sesi
          </button>
        </div>
      </aside>
    </>
  );
}