import { Router } from "express";
import { getPengumuman } from "../controllers/PengumumanController"; 

const router = Router();

router.get("/", getPengumuman);

export default router;