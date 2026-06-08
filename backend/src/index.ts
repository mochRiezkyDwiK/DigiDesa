import "reflect-metadata";
import "dotenv/config";
console.log("DEBUG DATABASE_URL:", process.env.DATABASE_URL); // Tambahin ini
import express from "express";
import path from "path";
import cors from "cors";
import { AppDataSource } from "./lib/data-source";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import suratRoutes from "./routes/suratRoutes"; // ── BARU: Rute khusus untuk pengajuan surat ──
import userRoutes from "./routes/userRoutes";
import statsRoutes from "./routes/stats";
import pengumumanRoutes from "./routes/PengumumanRoutes";
import anggaranRoutes from "./routes/TransparansiRoutes";

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL tidak ditemukan di .env");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET tidak ditemukan di .env");
    process.exit(1);
}

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // URL Vite kamu
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/surat", suratRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/pengumuman", pengumumanRoutes);
app.use("/api/v1", anggaranRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (_req, res) => {
    res.send("API DigiDesa Running...");

});

// Start Server setelah DB Connect
AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database Connected (TiDB Cloud)");
        const PORT = Number(process.env.PORT) || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => console.error("❌ Database Error:", err));