import { Router } from "express";
import { createPengaduan } from "../controllers/pengaduanController";
import { authenticateToken } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

// Rute ini sekarang "terkunci"
router.get("/profile", authenticateToken, (req, res) => {
    // Data user yang login ada di (req as any).user
    res.json({ message: "Ini data rahasia profil kamu", user: (req as any).user });
});

    router.post("/pengaduan", upload.single("bukti_visual"), createPengaduan);

    export default router;