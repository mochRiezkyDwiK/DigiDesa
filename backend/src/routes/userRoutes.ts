import { Router } from "express";
import { createPengaduan, getPengaduanByUser } from "../controllers/pengaduanController";
import { authenticateToken } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: "Ini data rahasia profil kamu", user: (req as any).user });
});

// Submit laporan warga baru
router.post("/pengaduan", authenticateToken, upload.single("bukti_visual"), createPengaduan);

// Ambil riwayat laporan milik warga yang login
router.get("/pengaduan/riwayat", authenticateToken, getPengaduanByUser);

export default router;
