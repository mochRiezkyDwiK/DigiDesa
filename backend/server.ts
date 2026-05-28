import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./src/lib/data-source";
import authRoutes from "./src/routes/authRoutes";
import surat from "./src/routes/surat";
import adminRoutes from "./src/routes/adminRoutes";
import statsRoutes from "./src/routes/stats";
import userRoutes from "./src/routes/userRoutes";
import PengumumanRoutes from "./src/routes/PengumumanRoutes";
import TransparansiRoutes from "./src/routes/TransparansiRoutes";
import dashboardRoutes from "./src/routes/dashboardRoutes";

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
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/surat", surat);
app.use("/uploads", express.static("uploads"));
app.use("/api/v1", statsRoutes); 
app.use("/api/v1/user", userRoutes);
app.use("/api/v1",PengumumanRoutes);
app.use("/api/v1", TransparansiRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

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