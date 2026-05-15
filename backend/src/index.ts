import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./lib/data-source";
import authRoutes from "./routes/authRoutes";

import adminRoutes from "./routes/adminRoutes";

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