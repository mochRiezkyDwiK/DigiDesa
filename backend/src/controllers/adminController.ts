import { Request, Response } from "express";
import { AppDataSource } from "../lib/data-source";
import { Report } from "../models/Report";
import { User } from "../models/User"; // ── BARU: Wajib di-import biar gak error ──

const reportRepository = AppDataSource.getRepository(Report);

// Ambil semua laporan untuk dashboard admin
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

// ─── FUNGSI AUDIT VERIFIKASI AKUN WARGA OLEH ADMIN ───
export const verifyWarga = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status_akun, alasan_ditolak } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: parseInt(id) });

        if (!user) {
            return res.status(404).json({ success: false, message: "Data warga tidak ditemukan!" });
        }

        // Jalankan update otoritas status akun
        user.status_akun = status_akun;
        user.alasan_ditolak = alasan_ditolak; // Akan bernilai string jika ditolak, atau null jika di-ACC

        await userRepository.save(user);

        return res.json({
            success: true,
            message: `Akun warga berhasil di-update menjadi ${status_akun}!`,
            data: user
        });
    } catch (error: any) {
        console.error("ERROR VERIFY WARGA:", error);
        return res.status(500).json({ success: false, message: error.message || "Gagal memproses audit" });
    }
};