import { Request, Response } from "express";
import pool from "../../database";

export const getPengumuman = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute("SELECT * FROM pengumuman ORDER BY id DESC");
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil data pengumuman" });
  }
};