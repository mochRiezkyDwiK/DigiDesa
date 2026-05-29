import { Request, Response } from "express";
import { AppDataSource } from "../lib/data-source";
import { Report } from "../models/Report";
import { User } from "../models/User";

const reportRepository = AppDataSource.getRepository(Report);   
export const getAllReports = async (req: Request, res: Response) => {
    try {
        const reports = await reportRepository.find({
            relations: ["user"],
            order: { created_at: "DESC" }
        });
        res.json({ success: true, data: reports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal ambil laporan" });
    }
};

// Update status laporan (Contoh: dari BARU ke PROSES)
export const updateReportStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "ID parameter is required" });
        const { status } = req.body as { status: string };
        await reportRepository.update(id as any, { status });
        res.json({ success: true, message: "Status laporan diperbarui" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal update status" });
    }
};

// --- FUNGSI VERIFY WARGA (Admin) ---
export const verifyWarga = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Mengambil ID dari URL
        const userRepository = AppDataSource.getRepository(User);

        // Cari user berdasarkan ID
        const user = await userRepository.findOneBy({ id: Number(id) });

        if (!user) {
            return res.status(404).json({ success: false, message: "Warga tidak ditemukan" });
        }

        // Update status verifikasi
        user.is_verified = true;
        await userRepository.save(user);

        res.json({ 
            success: true, 
            message: `Warga dengan NIK ${user.nik} berhasil diverifikasi!` 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal memverifikasi warga" });
    }
};
