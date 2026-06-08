import { Request, Response } from "express";
import { AppDataSource } from "../lib/data-source";
import { Report } from "../models/Report";
import { User } from "../models/User";

const getReportRepo = () => AppDataSource.getRepository(Report);
const getUserRepo = () => AppDataSource.getRepository(User);

export const createPengaduan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { judul, deskripsi, lokasi } = req.body;
    if (!judul || !deskripsi || !lokasi) {
      res.status(400).json({ success: false, message: "Judul, deskripsi, dan lokasi wajib diisi." });
      return;
    }
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Akses ditolak." });
      return;
    }
    const user = await getUserRepo().findOneBy({ id: userId });
    if (!user) {
      res.status(404).json({ success: false, message: "User tidak ditemukan." });
      return;
    }
    const buktiVisual = req.file as Express.Multer.File | undefined;
    const newReport = new Report();
    newReport.title = judul;
    newReport.description = deskripsi;
    newReport.location = lokasi;
    newReport.priority = "HIGH";
    newReport.status = "BARU";
    newReport.bukti_visual = buktiVisual ? buktiVisual.filename : null;
    newReport.user = user;
    await getReportRepo().save(newReport);
    res.status(201).json({ success: true, message: "Laporan berhasil disimpan.", no_tiket: `LPR-00${newReport.id}` });
  } catch (error: any) {
    console.error("Error createPengaduan:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
};

export const createReport = createPengaduan;

export const getPengaduanByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Akses ditolak." });
      return;
    }
    const reports = await getReportRepo().find({
      where: { user: { id: userId } },
      relations: ["petugas"],
      order: { created_at: "DESC" }
    });
    res.json({ success: true, data: reports });
  } catch (error: any) {
    console.error("Error getPengaduanByUser:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil riwayat laporan." });
  }
};
