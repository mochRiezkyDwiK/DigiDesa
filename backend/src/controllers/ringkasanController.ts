import pool from "../../database";
import { Request, Response } from "express";

export const getRingkasan2026 = async (req: Request, res: Response) => {
  try {
    // Ambil baris data khusus untuk tahun 2026
    const [rows] = await pool.execute(
      'SELECT total_anggaran_tahunan, total_realisasi FROM ringkasan_tahunan WHERE tahun = 2026'
    );

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ success: false, message: "Data tahun 2026 tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil data ringkasan tahun 2026", error: (error as Error).message });
  }
};