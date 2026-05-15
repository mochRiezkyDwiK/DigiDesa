import { Router } from "express";
import { getAllReports, updateReportStatus } from "../controllers/adminController";
import { getAllPenduduk, createPenduduk, updatePenduduk, deletePenduduk } from "../controllers/pendudukController";
import { getFinanceSummary, createFinance, deleteFinance } from "../controllers/financeController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Pasang middleware di paling atas agar semua rute di bawahnya terlindungi
router.use(authenticateToken);

// Laporan (Reports)
router.get("/reports", getAllReports);
router.patch("/reports/:id/status", updateReportStatus);

// Penduduk
router.get("/penduduk", getAllPenduduk);
router.post("/penduduk", createPenduduk);
router.put("/penduduk/:id", updatePenduduk);
router.delete("/penduduk/:id", deletePenduduk);

// Keuangan (Finance)
router.get("/finance", getFinanceSummary);
router.post("/finance", createFinance);
router.delete("/finance/:id", deleteFinance);

export default router;