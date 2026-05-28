import Router from "express";
import { getAllLaporan } from "../controllers/laporanController";
import { getAllAnggaran }  from "../controllers/anggaranController";
import { getRingkasan2026 } from "../controllers/ringkasanController";

const router = Router();

router.get("/laporan", getAllLaporan);
router.get("/anggaran", getAllAnggaran);
router.get("/ringkasan-2026", getRingkasan2026);

export default router;