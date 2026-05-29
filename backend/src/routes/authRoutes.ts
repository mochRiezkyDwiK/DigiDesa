import { Router } from "express";
import multer from "multer";
import path from "path";
import { registerWarga, login, getProfile } from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Konfigurasi Penyimpanan Foto KTP Warga
const storageKtp = multer.diskStorage({
  destination: "uploads/ktp/",
  filename: (req, file, cb) => {
    cb(null, `KTP-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const uploadKtp = multer({ storage: storageKtp });

// Jalur Auth Umum
router.post("/register", registerWarga);
router.post("/login", login);

// Jalur Profile Warga
router.get("/profile", authenticateToken, getProfile);
router.get("/me", authenticateToken, getProfile);

// BARU: Jalur Kirim Formulir Onboarding (Proteksi Token + Upload Single File KTP)
// router.post("/onboarding", authenticateToken, uploadKtp.single("foto_ktp"), submitOnboarding);

export default router;