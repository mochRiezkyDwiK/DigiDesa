import { Routes, Route } from "react-router-dom";
// Client pages
import Home from "./pages/client/Home";
import Login from "./pages/client/Login";
import DashboardWarga from "./pages/client/DashboardWarga";
import Layanan from "./pages/client/Layanan";
import Lapor from "./pages/client/Lapor";
import Finansial from "./pages/client/Finansial";
import Profil from "./pages/client/Profil";
import Surat from "./pages/client/Surat";
import TransparansiAnggaran from "./pages/client/TransparansiAnggaran";
import Pengumuman from "./pages/client/pengumuman";
import Bantuan from "./pages/client/bantuan";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminValidasiSurat from "./pages/admin/AdminValidasiSurat";
import AdminLaporan from "./pages/admin/AdminLaporan";
import AdminPenduduk from "./pages/admin/AdminPenduduk";
import AdminKeuangan from "./pages/admin/AdminKeuangan";
import AdminPengaturan from "./pages/admin/AdminPengaturan";

// Halaman Dummy Sementara (Hanya yang benar-benar belum ada filenya)
const LaporDummy = () => <div className="p-10 text-center text-2xl font-bold text-slate-800">Halaman Lapor (Sedang Dibangun)</div>;

function App() {
  return (
    <div className="font-sans text-slate-900 antialiased bg-slate-50 min-h-screen">
      <Routes>
          {/* Rute Utama */}
          <Route path="/" element={<Home />} />
          
          {/* Rute Login - Pastikan merujuk ke file Login.tsx yang premium tadi */}
          <Route path="/login" element={<Login />} />
          
          {/* Rute Dashboard - Pastikan file DashboardWarga.tsx sudah di-save */}
          <Route path="/dashboard-warga" element={<DashboardWarga />} />

          <Route path="/layanan" element={<Layanan />} />

          <Route path="/lapor" element={<Lapor />} />

          <Route path="/surat" element={<Surat />} />

          <Route path="/finansial" element={<Finansial />} />

          <Route path="/profil" element={<Profil />} />

          <Route path="/transparansi-anggaran" element={<TransparansiAnggaran />} />

          <Route path="/pengumuman" element={<Pengumuman />} />

          <Route path="/bantuan" element={<Bantuan />} />

          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/admin/validasi" element={<AdminValidasiSurat />} />

          <Route path="/admin/laporan" element={<AdminLaporan />} />

          <Route path="/admin/penduduk" element={<AdminPenduduk />} />

          <Route path="/admin/keuangan" element={<AdminKeuangan />} />

          <Route path="/admin/pengaturan" element={<AdminPengaturan />} />
          
          {/* Rute Lainnya */}
          <Route path="/lapor" element={<LaporDummy />} />
        </Routes>
    </div>
  );
}

export default App;