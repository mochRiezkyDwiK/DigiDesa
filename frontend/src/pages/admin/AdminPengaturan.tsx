import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  User,
  ShieldCheck,
  Bell,
  Globe,
  Building2,
  ArrowLeft,
  Save,
  Camera,
  LayoutDashboard,
  Files,
  AlertTriangle,
  Users,
  BarChart3,
  LogOut,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Lock,
  Smartphone,
  Languages,
} from "lucide-react";

export default function AdminPengaturan() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profil Desa");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { n: "Profil Desa", i: Building2 },
    { n: "Akun Admin", i: User },
    { n: "Keamanan", i: ShieldCheck },
    { n: "Notifikasi", i: Bell },
    { n: "Bahasa & Wilayah", i: Globe },
  ];

  const sidebarMenu = [
    { n: "Overview", i: LayoutDashboard, p: "/admin" },
    { n: "Validasi Surat", i: Files, p: "/admin/validasi" },
    { n: "Moderasi Lapor", i: AlertTriangle, p: "/admin/laporan" },
    { n: "Data Penduduk", i: Users, p: "/admin/penduduk" },
    { n: "Keuangan Desa", i: BarChart3, p: "/admin/keuangan" },
    { n: "Pengaturan", i: Settings, p: "/admin/pengaturan", active: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased flex">
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen z-50">
        <div
          className="px-7 py-7 flex items-center gap-3 cursor-pointer border-b border-slate-100"
          onClick={() => navigate("/admin")}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>

          <div>
            <p className="font-bold text-slate-900 tracking-tight leading-none">
              DigiDesa
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Panel Admin Desa
            </p>
          </div>
        </div>

        <nav className="flex-1 px-5 py-6 space-y-1.5">
          <p className="px-3 mb-3 text-xs font-semibold text-slate-400">
            Navigasi
          </p>

          {sidebarMenu.map((item) => {
            const Icon = item.i;

            return (
              <button
                key={item.n}
                onClick={() => item.p !== "#" && navigate(item.p)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  item.active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} strokeWidth={item.active ? 2.6 : 2.2} />
                {item.n}
              </button>
            );
          })}
        </nav>

        <div className="p-5 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Keluar Sistem
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="h-20 bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-40 px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => navigate("/admin")}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-950 tracking-tight truncate">
                Konfigurasi Sistem
              </h1>
              <p className="text-sm text-slate-500 mt-1 truncate">
                Kelola profil desa, akun admin, keamanan, dan preferensi aplikasi.
              </p>
            </div>
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shrink-0">
            <Save size={17} strokeWidth={2.5} />
            Simpan perubahan
          </button>
        </header>

        <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
            <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/60 p-4">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.i;
                  const isActive = activeTab === item.n;

                  return (
                    <button
                      key={item.n}
                      onClick={() => setActiveTab(item.n)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-white text-blue-700 shadow-sm"
                          : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                      }`}
                    >
                      <Icon size={17} strokeWidth={isActive ? 2.6 : 2.2} />
                      {item.n}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Sistem aktif
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Pengaturan tersimpan secara lokal untuk kebutuhan demo aplikasi.
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            <section className="flex-1 p-6 lg:p-10">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {activeTab === "Profil Desa" && (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
                        Profil Desa
                      </h2>
                      <p className="text-sm text-slate-500 mt-2">
                        Informasi ini digunakan sebagai identitas utama pada layanan administrasi dan dokumen warga.
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 overflow-hidden">
                          <Building2 size={32} />
                        </div>

                        <button className="absolute -bottom-2 -right-2 w-9 h-9 bg-white border border-slate-200 rounded-xl shadow-sm text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center">
                          <Camera size={16} />
                        </button>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-950">
                          Logo Instansi
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                          Gunakan gambar PNG atau JPG dengan ukuran maksimal 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                          Nama Instansi / Desa
                        </label>
                        <input
                          type="text"
                          defaultValue="Desa Cisaladah"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                          Kode Pos
                        </label>
                        <input
                          type="text"
                          defaultValue="40512"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                          Alamat Kantor
                        </label>
                        <textarea
                          defaultValue="Jl. Cisaladah No. 01, RT 01 RW 10, Bandung"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all min-h-[100px] resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                          Email Resmi
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="email"
                            defaultValue="kontak@cisaladah.desa.id"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                          Telepon
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="text"
                            defaultValue="(022) 8765 4321"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "Akun Admin" && (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
                        Akun Admin
                      </h2>
                      <p className="text-sm text-slate-500 mt-2">
                        Atur profil administrator yang mengelola layanan DigiDesa.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                          Nama Admin
                        </label>
                        <input
                          type="text"
                          defaultValue="H. Ahmad Subarjo"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                          Jabatan
                        </label>
                        <input
                          type="text"
                          defaultValue="Kepala Desa"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                          Email Admin
                        </label>
                        <input
                          type="email"
                          defaultValue="admin@digidesa.id"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                          Nomor WhatsApp
                        </label>
                        <input
                          type="text"
                          defaultValue="0812-3456-7890"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "Keamanan" && (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
                        Keamanan
                      </h2>
                      <p className="text-sm text-slate-500 mt-2">
                        Pengaturan dasar untuk menjaga akses admin tetap aman.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          title: "Verifikasi admin aktif",
                          desc: "Akses admin memerlukan token autentikasi sebelum membuka fitur inti.",
                          icon: ShieldCheck,
                          active: true,
                        },
                        {
                          title: "Proteksi perubahan data",
                          desc: "Aksi penting seperti hapus data tetap meminta konfirmasi pengguna.",
                          icon: Lock,
                          active: true,
                        },
                        {
                          title: "Notifikasi keamanan",
                          desc: "Tampilkan peringatan saat ada aktivitas akun yang perlu diperiksa.",
                          icon: Bell,
                          active: false,
                        },
                      ].map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.title}
                            className="flex items-start justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5"
                          >
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
                                <Icon size={19} />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-950">
                                  {item.title}
                                </p>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                            </div>

                            <button
                              className={`w-11 h-6 rounded-full p-1 transition-all shrink-0 ${
                                item.active ? "bg-blue-600" : "bg-slate-300"
                              }`}
                            >
                              <span
                                className={`block w-4 h-4 bg-white rounded-full transition-all ${
                                  item.active ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {activeTab === "Notifikasi" && (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
                        Notifikasi
                      </h2>
                      <p className="text-sm text-slate-500 mt-2">
                        Tentukan jenis pemberitahuan yang ingin ditampilkan untuk admin.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        {
                          title: "Surat baru",
                          desc: "Beritahu admin ketika warga mengajukan surat.",
                          icon: Files,
                        },
                        {
                          title: "Laporan warga",
                          desc: "Tampilkan notifikasi saat ada aduan publik baru.",
                          icon: AlertTriangle,
                        },
                        {
                          title: "Perubahan kas",
                          desc: "Catat pemberitahuan untuk aktivitas keuangan.",
                          icon: BarChart3,
                        },
                        {
                          title: "Verifikasi akun",
                          desc: "Peringatan untuk akun warga yang menunggu ACC.",
                          icon: User,
                        },
                      ].map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.title}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center">
                              <Icon size={19} />
                            </div>

                            <p className="text-sm font-semibold text-slate-950 mt-4">
                              {item.title}
                            </p>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {activeTab === "Bahasa & Wilayah" && (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
                        Bahasa & Wilayah
                      </h2>
                      <p className="text-sm text-slate-500 mt-2">
                        Sesuaikan format bahasa, zona waktu, dan cakupan wilayah administrasi.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                          Bahasa Sistem
                        </label>
                        <div className="relative">
                          <Languages className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all">
                            <option>Bahasa Indonesia</option>
                            <option>English</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                          Zona Waktu
                        </label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all">
                          <option>WIB - Asia/Jakarta</option>
                          <option>WITA - Asia/Makassar</option>
                          <option>WIT - Asia/Jayapura</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                          Wilayah Layanan
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                          <textarea
                            defaultValue="RT 01 - RT 03 / RW 10 - RW 11, Desa Cisaladah"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all min-h-[100px] resize-none"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shrink-0">
                            <Smartphone size={19} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-blue-950">
                              Format data Indonesia aktif
                            </p>
                            <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                              Format tanggal, mata uang, dan nomor wilayah akan mengikuti standar lokal Indonesia.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-slate-500">
                      Sistem dalam kondisi optimal
                    </span>
                  </div>

                  <span className="text-sm text-slate-400">
                    Terakhir diubah: 2 jam yang lalu
                  </span>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}