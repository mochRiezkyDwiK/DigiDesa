import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Rute ini sekarang "terkunci"
router.get("/profile", authenticateToken, (req, res) => {
    // Data user yang login ada di (req as any).user
    res.json({ message: "Ini data rahasia profil kamu", user: (req as any).user });
});

export default router;