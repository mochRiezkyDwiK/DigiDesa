import { Router } from "express";
import { getPengumuman } from "../controllers/PengumumanController"; 

const router = Router();

// 🔥 DAFTARKAN DI SINI
router.get("/pengumuman", getPengumuman);

export default router;