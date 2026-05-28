import { Routes, Route, useLocation } from "react-router-dom";

// Global Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WargaOnboarding from "./components/WargaOnboarding";
import ProtectedRoute from "./components/protectRoute";

// Client pages
import Home from "./pages/client/Home";
import Login from "./pages/Login";
import DashboardWarga from "./pages/client/DashboardWarga";
import Layanan from "./pages/client/Layanan";
import Lapor from "./routes/lapor";
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

function App() {
  const location = useLocation();

  // Logika: Navbar & Footer hanya muncul di Landing Page ("/")
  const isLandingPage = location.pathname === "/";

  return (
    <div className="font-sans text-slate-900 antialiased bg-slate-50 min-h-screen flex flex-col">
      {/* Navbar hanya muncul di Landing Page */}
      {isLandingPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Rute Utama */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* onborading */}
          {/* <Route path="/onboarding" element={<WargaOnboarding />} /> */}

          {/* Rute Warga (Client Area) */}
          <Route path="/dashboard-warga" element={<DashboardWarga />} />
          <Route path="/layanan" element={<Layanan />} />
          <Route path="/lapor" element={<Lapor />} />
          
          {/* ── DISINI DIUBAH MENJADI /buat-surat BIAR SINKRON SAMA KATALOG Ky ── */}
          <Route path="/buat-surat" element={<Surat />} /> 
          
          <Route path="/finansial" element={<Finansial />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/transparansi-anggaran" element={<TransparansiAnggaran />} />
          <Route path="/pengumuman" element={<Pengumuman />} />
          <Route path="/bantuan" element={<Bantuan />} />

          {/* Rute Admin (Control Panel Area) */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/validasi" element={<AdminValidasiSurat />} />
          <Route path="/admin/laporan" element={<AdminLaporan />} />
          <Route path="/admin/penduduk" element={<AdminPenduduk />} />
          <Route path="/admin/keuangan" element={<AdminKeuangan />} />
          <Route path="/admin/pengaturan" element={<AdminPengaturan />} />
          </Route>
        </Routes>
      </main>

      {/* Footer juga hanya muncul di Landing Page */}
      {isLandingPage && <Footer />}
    </div>
  );
}

export default App;