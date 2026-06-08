import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Proteksi token untuk semua rute dashboard
router.use(authenticateToken);

router.get("/stats", (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data: {
                suratAktif: "2",
                laporan: "0",
                poinWarga: "1.250"
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Gagal memuat statistik dashboard" 
        });
    }
});

export default router;