import { Router } from "express";
import multer from "multer";
import path from "path";
// KUNCIAN: verifyWarga di-import dari adminController di sini
import { getAllReports, updateReportStatus, verifyWarga, getAllPetugas } from "../controllers/adminController";
import { updateProgresLaporan } from "../controllers/pengaduanController";
import { getAllPenduduk, createPenduduk, updatePenduduk, deletePenduduk, getAnggotaKeluarga } from "../controllers/pendudukController";import { getFinanceSummary, createFinance, updateFinance, deleteFinance } from "../controllers/financeController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

const storage = multer.diskStorage({
  destination: "uploads/evidence/",
  filename: (req, file, cb) => {
    cb(null, `NOTA-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Proteksi token global
router.use(authenticateToken);

// Laporan (Reports)
router.get("/reports", getAllReports);
router.patch("/reports/:id/status", updateReportStatus);
router.patch("/reports/:id/progres", updateProgresLaporan);
router.get("/petugas", getAllPetugas);

// Penduduk (Data Warga)
router.get("/penduduk", getAllPenduduk);
router.put("/penduduk/verify/:id", verifyWarga); // Jalur audit beres!
router.post("/penduduk", createPenduduk);
router.put("/penduduk/:id", updatePenduduk);
router.delete("/penduduk/:id", deletePenduduk);
router.get("/penduduk/keluarga/:no_kk", getAnggotaKeluarga);

// Keuangan (Finance)
router.get("/finance", getFinanceSummary);
router.post("/finance", upload.single("evidence"), createFinance);
router.put("/finance/:id", upload.single("evidence"), updateFinance);
router.delete("/finance/:id", deleteFinance);

export default router;