import { Router } from "express";
import { 
  createSurat, 
  getSuratByWarga, 
  getAllSuratAdmin, 
  verifySuratAdmin 
} from "../controllers/suratController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Pasang satpam token di paling atas agar semua rute surat di bawah aman terlindungi
router.use(authenticateToken);

// ─── KORIDOR AKSES SISI WARGA (CLIENT) ───
// Jalur warga buat surat baru
router.post("/ajukan", createSurat); 
// Jalur warga ngeliat daftar surat milik sendiri
router.get("/riwayat", getSuratByWarga); 

// ─── KORIDOR AKSES SISI ADMIN (MENARA KONTROL) ───
// Jalur admin narik semua antrean surat masuk se-desa
router.get("/admin/antrean", getAllSuratAdmin); 
// Jalur admin ngetok palu ACC atau REJECT surat warga
router.put("/admin/verify/:id", verifySuratAdmin); 

export default router;