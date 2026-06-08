import { Request, Response } from "express";
import crypto from "crypto";
import pool from "../../database";

// 1. Konfigurasi Koneksi Database (Sesuaikan dengan XAMPP / Laragon Anda)


export const createPengaduan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { judul, kategori, deskripsi, lokasi } = req.body;

    // 2. Validasi input wajib
    if (!judul || !deskripsi || !lokasi) {
      res.status(400).json({ 
        success: false, 
        message: "Kolom subjek, kronologi, dan lokasi wajib diisi!" 
      });
      return;
    }

    // 3. Mengambil file gambar (Gunakan type casting agar TypeScript aman)
    const buktiVisual = req.file as Express.Multer.File | undefined; 
    let namaFileBukti: string | null = null;

    if (buktiVisual) {
      // PERBAIKAN: Mengisi variabel utama, bukan membuat let baru di dalam scope
      namaFileBukti = buktiVisual.filename; 
    }

    // 4. Generator Nomor Tiket Otomatis (Format: TKT-2026-XXXXXX)
    const tahunSekarang = new Date().getFullYear();
    const angkaAcak = crypto.randomInt(100000, 999999);
    const noTiket = `TKT-${tahunSekarang}-${angkaAcak}`;

    // 5. EKSEKUSI QUERY KE MYSQL
    // Menyelipkan tanda '?' untuk menghindari celah keamanan SQL Injection
    const queryText = `
      INSERT INTO pengaduan (no_tiket, judul, kategori, deskripsi, lokasi, bukti_visual)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [noTiket, judul, kategori, deskripsi, lokasi, namaFileBukti];
    
    // Menjalankan query ke database MySQL
    await pool.execute(queryText, values);

    // Tampilkan log di terminal server backend
    console.log(`[MySQL] Berhasil menyimpan! Tiket: ${noTiket} | Judul: ${judul}`);

    // 6. Kirim respon balik ke frontend DigiDesa
    res.status(201).json({
      success: true,
      message: "Laporan pengaduan berhasil disimpan ke database desa.",
      no_tiket: noTiket,
      data: {
        judul,
        kategori,
        deskripsi,
        lokasi,
        bukti_visual: namaFileBukti
      }
    });

  } catch (error: any) {
    console.error("Error pada pengaduanController:", error);
    res.status(500).json({ 
      success: false, 
      message: "Terjadi kesalahan pada sistem server internal." 
    });
  }
};
// ─── AMBIL RIWAYAT LAPORAN WARGA (KHUSUS WARGA YANG LOGIN) ───
export const getPengaduanByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Akses ditolak, token tidak valid." });
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
