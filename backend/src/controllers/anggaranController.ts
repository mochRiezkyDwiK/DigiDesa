import pool from "../../database";
import { Request, Response } from "express";

export const getAllAnggaran = async (req: Request, res: Response) => {
  try {
    // Sesuaikan select dengan kolom asli di database Anda
    const [rows] = await pool.execute(`
      SELECT 
        nama_kategori AS kategori, 
        total_anggaran AS anggaran, 
        persentase_terserap AS persentase, 
        status, 
        detail_program AS detail  
      FROM kategori_anggaran
    `);
    
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data kategori anggaran",
      error: (error as Error).message
    });
  }
};