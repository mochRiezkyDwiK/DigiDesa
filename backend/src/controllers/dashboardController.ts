import { Request, Response } from "express";
import { AppDataSource } from "../lib/data-source";
import { User } from "../models/User";
import { Surat } from "../models/Surat"; // 🔴 Pastikan entitas Surat di-import
import { Not, In } from "typeorm";        // 🔴 Import operator bawaan TypeORM

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // 1. Ambil ID Warga dari token JWT yang sudah diurai middleware
        const userId = (req as any).user?.id; 

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "Sesi habis, silakan login kembali." 
            });
        }

        // 2. Inisialisasi Repository TypeORM
        const suratRepository = AppDataSource.getRepository(Surat);

        // 3. Query hitung Surat Aktif milik warga ini langsung dari DB
        // Menghitung semua surat yang statusnya BUKAN 'Selesai' atau 'Ditolak'
        const suratAktifCount = await suratRepository.count({
            where: {
                user: { id: userId },
                status: Not(In(["Selesai", "Ditolak", "SELESAI", "DITOLAK"])) 
            }
        });

        // 4. Kirim data asli hasil query ke Frontend
        return res.status(200).json({
            success: true,
            data: {
                // Diubah jadi string karena data QUICK_STATS di React Anda bertipe string
                suratAktif: suratAktifCount.toString(), 
                laporan: "0",        // Sementara 0 dulu jika belum ada tabel Lapor
                poinWarga: "1.250"   // Sementara dummy atau sesuaikan dengan field di tabel User Anda jika ada
            }
        });

    } catch (error: any) {
        console.error("Error pada getDashboardStats:", error.message);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil statistik dashboard secara real-time",
            error: error.message
        });
    }
};