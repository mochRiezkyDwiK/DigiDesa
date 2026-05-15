import { Request, Response } from "express";
import { AppDataSource } from "../lib/data-source";
import { Report } from "../models/Report";

const reportRepository = AppDataSource.getRepository(Report);

// Ambil semua laporan untuk dashboard admin
export const getAllReports = async (req: Request, res: Response) => {
    try {
        const reports = await reportRepository.find({
            relations: ["user"], // Pastikan di model Report.ts relasi ini namanya "user"
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
