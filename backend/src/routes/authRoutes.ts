import { Router } from "express";
import { registerWarga, login, getProfile } from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Endpoint: POST http://localhost:5000/api/v1/auth/register
router.post("/register", registerWarga);

// Endpoint: POST http://localhost:5000/api/v1/auth/login
router.post("/login", login);

// Endpoint: GET http://localhost:5000/api/v1/auth/me
router.get("/me", authenticateToken, getProfile);

export default router;