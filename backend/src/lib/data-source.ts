import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Wilayah } from "../models/Wilayah";
import { Finance } from "../models/Finance";
import { Keluarga } from "../models/Keluarga";
import { Report } from "../models/Report";
import dotenv from "dotenv";

dotenv.config();

// Cek apakah kita pakai localhost atau bukan
const DATABASE_URL = process.env.DATABASE_URL || "";
const isLocal = DATABASE_URL.includes("localhost") || DATABASE_URL.includes("127.0.0.1");

export const AppDataSource = new DataSource({
    type: "mysql",
    url: DATABASE_URL,
    synchronize: false, // Biar tabel otomatis dibuat di HeidiSQL
    logging: false,
    entities: [User, Finance, Report, Wilayah, Keluarga ],
    // LOGIC MATIKAN SSL JIKA LOKAL:
    ssl: isLocal ? false : {
        rejectUnauthorized: true
    }
});

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database Connected (Local MySQL)");
    })
    .catch((error) => console.log("❌ Database Error:", error));