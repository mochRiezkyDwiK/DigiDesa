import { Request, Response } from "express";
import { AppDataSource } from "../lib/data-source";
import { Report } from "../models/Report";
import { User } from "../models/User";
import pool from "../../database";

// Lazy getters agar repository tidak dipanggil sebelum DB initialized
const getReportRepo = () => AppDataSource.getRepository(Report);
const getUserRepo = () => AppDataSource.getRepository(User);

// Ambil semua laporan untuk dashboard admin
export const getAllReports = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, no_tiket, judul, kategori, deskripsi, lokasi,
             bukti_visual, status, created_at
      FROM pengaduan
      ORDER BY created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("[AdminController] getAllReports error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data laporan" });
  }
};

// Update status laporan (legacy, bisa diganti updateProgresLaporan)
export const updateReportStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "ID parameter is required" });
        const { status } = req.body as { status: string };
        await getReportRepo().update(id as any, { status });
        res.json({ success: true, message: "Status laporan diperbarui" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal update status" });
    }
};

// ─── FUNGSI AUDIT VERIFIKASI AKUN WARGA OLEH ADMIN ───
export const verifyWarga = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { status_akun, alasan_ditolak } = req.body;

        if (!Number.isFinite(id)) {
            return res.status(400).json({ success: false, message: "ID warga tidak valid" });
        }

        const user = await getUserRepo().findOneBy({ id });

        if (!user) {
            return res.status(404).json({ success: false, message: "Data warga tidak ditemukan!" });
        }

        user.status_akun = status_akun;
        user.alasan_ditolak = alasan_ditolak;

        await getUserRepo().save(user);

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

// Ambil semua user selain role WARGA untuk ditugaskan sebagai petugas
export const getAllPetugas = async (req: Request, res: Response) => {
    try {
        const users = await getUserRepo().find({
            select: ["id", "nama_lengkap", "role", "username"]
        });
        
        const petugas = users.filter(u => u.role !== "WARGA");
        return res.json({ success: true, data: petugas });
    } catch (error: any) {
        console.error("Error pada getAllPetugas:", error);
        return res.status(500).json({ success: false, message: "Gagal mengambil daftar petugas." });
    }
};