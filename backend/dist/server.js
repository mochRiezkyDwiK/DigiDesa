"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./src/lib/data-source");
const authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
const surat_1 = __importDefault(require("./src/routes/surat"));
const adminRoutes_1 = __importDefault(require("./src/routes/adminRoutes"));
const stats_1 = __importDefault(require("./src/routes/stats"));
const userRoutes_1 = __importDefault(require("./src/routes/userRoutes"));
const PengumumanRoutes_1 = __importDefault(require("./src/routes/PengumumanRoutes"));
const TransparansiRoutes_1 = __importDefault(require("./src/routes/TransparansiRoutes"));
if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL tidak ditemukan di .env");
    process.exit(1);
}
if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET tidak ditemukan di .env");
    process.exit(1);
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express_1.default.json());
// Routes
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/admin", adminRoutes_1.default);
app.use("/api/v1/surat", surat_1.default);
app.use("/uploads", express_1.default.static("uploads"));
app.use("/api/v1", stats_1.default);
app.use("/api/v1/user", userRoutes_1.default);
app.use("/api/v1", PengumumanRoutes_1.default);
app.use("/api/v1", TransparansiRoutes_1.default);
app.get("/", (_req, res) => {
    res.send("API DigiDesa Running...");
});
// Start Server setelah DB Connect
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("✅ Database Connected (TiDB Cloud)");
    const PORT = Number(process.env.PORT) || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => console.error("❌ Database Error:", err));
//# sourceMappingURL=server.js.map