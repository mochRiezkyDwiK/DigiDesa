import { Request, Response } from "express";
import { AppDataSource } from "../lib/data-source";
import { Report } from "../models/Report";
import { User } from "../models/User";

// Gunakan lazy getter agar repository tidak dipanggil sebelum DB initialized
const getReportRepo = () => AppDataSource.getRepository(Report);
const getUserRepo = () => AppDataSource.getRepository(User);

export const createPengaduan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { judul, deskripsi, lokasi } = req.body;

    if (!judul || !deskripsi || !lokasi) {
      res.status(400).json({ 
        success: false, 
        message: "Kolom subjek, kronologi, dan lokasi wajib diisi!" 
      });
      return;
    }

    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Akses ditolak, token tidak valid." });
      return;
    }

    const user = await getUserRepo().findOneBy({ id: userId });
    if (!user) {
      res.status(404).json({ success: false, message: "User tidak ditemukan." });
      return;
    }

    const buktiVisual = req.file as Express.Multer.File | undefined; 
    const namaFileBukti: string | null = buktiVisual ? buktiVisual.filename : null;

    const newReport = new Report();
    newReport.title = judul;
    newReport.description = deskripsi;
    newReport.location = lokasi;
    newReport.priority = "HIGH";
    newReport.status = "BARU";
    newReport.bukti_visual = namaFileBukti;
    newReport.user = user;

    await getReportRepo().save(newReport);

    console.log(`[TypeORM] Laporan ID: ${newReport.id} | Judul: ${newReport.title}`);

    res.status(201).json({
      success: true,
      message: "Laporan pengaduan berhasil disimpan ke database desa.",
      no_tiket: `LPR-00${newReport.id}`,
      data: {
        id: newReport.id,
        judul: newReport.title,
        deskripsi: newReport.description,
        lokasi: newReport.location,
        status: newReport.status,
        bukti_visual: newReport.bukti_visual
      }
    });

  } catch (error: any) {
    console.error("Error createPengaduan:", error);
    res.status(500).json({ 
      success: false, 
      message: "Terjadi kesalahan pada sistem server internal." 
    });
  }
};

export const createReport = createPengaduan;

// ─── UPDATE PROGRESS LAPORAN (ADMIN & PETUGAS) ───
export const updateProgresLaporan = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { status, catatan_petugas } = req.body;
    const adminId = Number((req as any).user?.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ success: false, message: "ID laporan diperlukan." });
      return;
    }

    const report = await getReportRepo().findOne({
      where: { id },
      relations: ["user", "petugas"],
    });

    if (!report) {
      res.status(404).json({ success: false, message: "Laporan tidak ditemukan." });
      return;
    }

    if (!Number.isFinite(adminId)) {
      res.status(401).json({ success: false, message: "Sesi admin tidak valid." });
      return;
    }

    const currentAdmin = await getUserRepo().findOneBy({ id: adminId });
    if (!currentAdmin) {
      res.status(404).json({ success: false, message: "Admin tidak ditemukan." });
      return;
    }

    if (status) {
      const validStatuses = ["BARU", "DITUGASKAN", "PROSES", "SELESAI"];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ success: false, message: "Status tidak valid." });
        return;
      }
      report.status = status;

      // Flow 2 role: setiap progres selain BARU ditangani admin aktif
      report.petugas = status === "BARU" ? null : currentAdmin;
    }

    if (catatan_petugas !== undefined) {
      report.catatan_petugas = catatan_petugas;
      if (!report.petugas) {
        report.petugas = currentAdmin;
      }
    }

    await getReportRepo().save(report);

    res.json({
      success: true,
      message: "Progres laporan berhasil diperbarui.",
      data: {
        id: report.id,
        status: report.status,
        catatan_petugas: report.catatan_petugas,
        petugas: report.petugas ? { id: report.petugas.id, nama_lengkap: report.petugas.nama_lengkap } : null,
      },
    });
  } catch (error: any) {
    console.error("Error updateProgresLaporan:", error);
    res.status(500).json({ 
      success: false, 
      message: "Gagal memperbarui progres laporan." 
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
    res.status(500).json({ 
      success: false, 
      message: "Gagal mengambil riwayat laporan warga." 
    });
  }
};