import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Wilayah } from "../models/Wilayah";
import { Finance } from "../models/Finance";
import { Keluarga } from "../models/Keluarga";
import { Report } from "../models/Report";
import dotenv from "dotenv";
import { Surat } from "../models/Surat";

dotenv.config();

// Cek apakah kita pakai localhost atau bukan
const DATABASE_URL = process.env.DATABASE_URL || "";
const isLocal = DATABASE_URL.includes("localhost") || DATABASE_URL.includes("127.0.0.1");

export const AppDataSource = new DataSource({
    type: "mysql",
    url: DATABASE_URL,
    synchronize: false, // Auto-create/alter columns — set false setelah kolom terbentuk
    logging: false,
    entities: [User, Finance, Report, Wilayah, Keluarga, Surat ],
    // LOGIC MATIKAN SSL JIKA LOKAL:
    ssl: isLocal ? false : {
        rejectUnauthorized: true
    }
});
// NOTE: initialize() dipanggil HANYA dari index.ts, tidak di sini