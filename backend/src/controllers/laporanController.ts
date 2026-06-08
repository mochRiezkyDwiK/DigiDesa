import pool from "../../database";
import { Request, Response } from "express";

export const getAllLaporan = async (req : Request, res: Response) => {
  try {
    // Mengambil kolom dari tabel laporan_bulanan
    const [rows] = await pool.execute(`
      SELECT 
        periode, 
        pemasukan, 
        pengeluaran, 
        saldo, 
        status,
        file_pdf_url
      FROM laporan_bulanan
      ORDER BY id DESC
    `);
    
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data laporan bulanan",
      error: (error as Error).message
    });
  }
};