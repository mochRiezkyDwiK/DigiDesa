import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  // Kita ubah kondisinya agar menerima string umum atau format kapital/kecil
  allowedRole?: "admin" | "warga" | "ADMIN" | "WARGA";
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // Membersihkan dan menyamakan format ke huruf kecil (lowercase)
  const currentUserRole = user?.role ? user.role.trim().toLowerCase() : "";
  const requiredRole = allowedRole ? allowedRole.trim().toLowerCase() : "";

  // 🛠️ PRINT KE KONSOL UNTUK INVESTIGASI DEVELOPER
  console.log("=== ISI GUARD SATPAM ===");
  console.log("Token ditemukan:", !!token);
  console.log("Data User Lengkap:", user);
  console.log("Role User (Normalized):", currentUserRole);
  console.log("Role Yang Diminta (Normalized):", requiredRole);

  // 1. Jika token TIDAK ADA, kosong, atau string "undefined"/"null", blokir!
  if (!token || token === "undefined" || token === "null") {
    console.warn("Akses ditolak: Token tidak valid atau kosong!");
    return <Navigate to="/login" replace />;
  }

  // 2. Jika rute meminta role spesifik (misal: admin)
  if (requiredRole) {
    // Pengecekan dilakukan dengan membandingkan versi lowercase yang sudah aman
    if (!user || currentUserRole !== requiredRole) {
      console.warn(`Akses ditolak: Role Anda (${user?.role}) tidak diizinkan masuk ke area ${allowedRole}`);
      return <Navigate to="/login" replace />;
    }
  }

  // 3. Lolos
  return <Outlet />;
}