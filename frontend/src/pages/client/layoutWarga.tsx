import { useState } from "react";
import { Menu, Bell, Search } from "lucide-react";
import SidebarWarga from "../../components/sidebarWarga"; // Sesuaikan path import

interface LayoutWargaProps {
  children: React.ReactNode;
  user?: {
    nama_lengkap: string;
    rt: string | null;
    rw: string | null;
  } | null;
}

export default function LayoutWarga({ children, user }: LayoutWargaProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      {/* Panggil Sidebar Terpisah */}
      <SidebarWarga isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative h-screen">
        
        {/* HEADER BERSAMA */}
        <header className="h-24 bg-[#F8F9FA]/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 px-6 sm:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4 w-full justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:block relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari layanan..."
                className="bg-white border border-slate-200 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-medium focus:outline-none focus:border-blue-500 w-64 transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <button className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm">
                <Bell size={20} strokeWidth={2} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-[13px] font-bold text-slate-800 leading-none">
                    {user?.nama_lengkap || "Memuat..."}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-1">
                    RT {user?.rt || "-"} / RW {user?.rw || "-"}
                  </p>
                </div>
                <img
                  className="w-10 h-10 rounded-2xl border-2 border-white shadow-sm bg-slate-100"
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.nama_lengkap || "default"}`}
                  alt="Avatar"
                />
              </div>
            </div>
          </div>
        </header>

        {/* INJEKSI KONTEN HALAMAN DI SINI */}
        <div className="p-6 sm:p-10 max-w-7xl mx-auto">
          {children}
        </div>

      </main>
    </div>
  );
}