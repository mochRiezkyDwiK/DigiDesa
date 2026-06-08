import express, { Request, Response } from "express";
import { AppDataSource } from "../lib/data-source";

const router = express.Router();

const numberValue = (rows: any[], key: string) => Number(rows?.[0]?.[key] ?? 0);

router.get("/dashboard-stats", async (_req: Request, res: Response) => {
  try {
    const [pendudukRows, keluargaRows, suratRows, reportRows, financeRows, recentSuratRows] = await Promise.all([
      AppDataSource.query(`SELECT COUNT(*) AS totalPenduduk, SUM(CASE WHEN role = 'WARGA' THEN 1 ELSE 0 END) AS totalWarga, SUM(CASE WHEN status_akun LIKE 'VERIFIED%' THEN 1 ELSE 0 END) AS wargaTerverifikasi, SUM(CASE WHEN status_akun = 'PENDING' THEN 1 ELSE 0 END) AS wargaPending, SUM(CASE WHEN status_tinggal = 'TETAP' THEN 1 ELSE 0 END) AS wargaTetap, SUM(CASE WHEN status_tinggal = 'PENDATANG' THEN 1 ELSE 0 END) AS wargaPendatang FROM user`),
      AppDataSource.query(`SELECT COUNT(DISTINCT no_kk) AS totalKeluarga FROM user WHERE no_kk IS NOT NULL AND no_kk <> ''`),
      AppDataSource.query(`SELECT COUNT(*) AS totalSurat, SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS suratPending, SUM(CASE WHEN status = 'PROSES' THEN 1 ELSE 0 END) AS suratProses, SUM(CASE WHEN status = 'SELESAI' THEN 1 ELSE 0 END) AS suratSelesai, SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) AS suratDitolak FROM surat`),
      AppDataSource.query(`SELECT COUNT(*) AS totalPengaduan, SUM(CASE WHEN status IN ('BARU','DITUGASKAN','PROSES') THEN 1 ELSE 0 END) AS pengaduanAktif, SUM(CASE WHEN status = 'SELESAI' THEN 1 ELSE 0 END) AS pengaduanSelesai FROM report`),
      AppDataSource.query(`SELECT COUNT(*) AS totalTransaksi, COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END),0) AS totalPemasukan, COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END),0) AS totalPengeluaran, COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE -amount END),0) AS saldo FROM finances`),
      AppDataSource.query(`SELECT s.id, s.no_surat, s.jenis_surat, s.status, s.tgl_diajukan, u.nama_lengkap, u.rt, u.rw FROM surat s LEFT JOIN user u ON u.id = s.user_id WHERE s.status = 'PENDING' ORDER BY s.tgl_diajukan DESC LIMIT 5`),
    ]);

    const totalPemasukan = Number(financeRows?.[0]?.totalPemasukan ?? 0);
    const totalPengeluaran = Number(financeRows?.[0]?.totalPengeluaran ?? 0);
    const persenRealisasi = totalPemasukan > 0 ? Number(((totalPengeluaran / totalPemasukan) * 100).toFixed(1)) : 0;

    return res.status(200).json({
      success: true,
      data: {
        penduduk: {
          totalPenduduk: numberValue(pendudukRows, "totalPenduduk"),
          totalWarga: numberValue(pendudukRows, "totalWarga"),
          wargaTerverifikasi: numberValue(pendudukRows, "wargaTerverifikasi"),
          wargaPending: numberValue(pendudukRows, "wargaPending"),
          wargaTetap: numberValue(pendudukRows, "wargaTetap"),
          wargaPendatang: numberValue(pendudukRows, "wargaPendatang"),
          totalKeluarga: numberValue(keluargaRows, "totalKeluarga"),
        },
        surat: {
          totalSurat: numberValue(suratRows, "totalSurat"),
          suratPending: numberValue(suratRows, "suratPending"),
          suratProses: numberValue(suratRows, "suratProses"),
          suratSelesai: numberValue(suratRows, "suratSelesai"),
          suratDitolak: numberValue(suratRows, "suratDitolak"),
          terbaru: recentSuratRows,
        },
        pengaduan: {
          totalPengaduan: numberValue(reportRows, "totalPengaduan"),
          pengaduanAktif: numberValue(reportRows, "pengaduanAktif"),
          pengaduanSelesai: numberValue(reportRows, "pengaduanSelesai"),
        },
        keuangan: {
          totalTransaksi: numberValue(financeRows, "totalTransaksi"),
          totalPemasukan,
          totalPengeluaran,
          saldo: Number(financeRows?.[0]?.saldo ?? 0),
          persenRealisasi,
        },
      },
    });
  } catch (error: any) {
    console.error("Gagal mengambil statistik dashboard:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil statistik dashboard", error: error?.message });
  }
});

export default router;
