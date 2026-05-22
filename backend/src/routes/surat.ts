import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import pool from "../../database";

interface Surat {
  id: number;
  jenis: string;
  nama: string;
  deskripsi: string;
  persyaratan: string[];
  biaya: number;
  waktu_proses: string;
}

interface ApplicationResponse {
  id: string;
  jenis_surat: number;
  nama_lengkap: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  pekerjaan: string;
  alamat: string;
  keperluan: string;
  status: string;
  tanggal_pengajuan: string;
  nomor_antrian: number;
}

const router = express.Router();

const suratDatabase: Surat[] = [
  {
    id: 1,
    jenis: "keterangan",
    nama: "Surat Keterangan Usaha",
    deskripsi: "Surat keterangan untuk keperluan usaha dan bisnis",
    persyaratan: ["KTP", "KK", "Surat Nikah", "Pas Foto"],
    biaya: 0,
    waktu_proses: "3 hari kerja",
  },
  {
    id: 2,
    jenis: "domisili",
    nama: "Surat Keterangan Belum Menikah",
    deskripsi: "Surat keterangan untuk warga yang belum menikah",
    persyaratan: ["KTP", "KK", "Surat Kelahiran", "Pas Foto"],
    biaya: 0,
    waktu_proses: "2 hari kerja",
  },
  {
    id: 3,
    jenis: "kelahiran",
    nama: "Akte Kelahiran",
    deskripsi: "Salinan akte kelahiran resmi",
    persyaratan: [
      "KTP Ayah",
      "KTP Ibu",
      "KK",
      "Surat Nikah Orang Tua",
      "Surat Kelahiran Asli",
    ],
    biaya: 15000,
    waktu_proses: "5 hari kerja",
  },
  {
    id: 4,
    jenis: "pindah",
    nama: "Surat Keterangan Pindah",
    deskripsi: "Surat keterangan untuk keperluan pindah domisili",
    persyaratan: ["KTP", "KK", "Surat Pindah", "Surat Keterangan RT/RW"],
    biaya: 0,
    waktu_proses: "2 hari kerja",
  },
  {
    id: 5,
    jenis: "kematian",
    nama: "Surat Keterangan Kematian",
    deskripsi: "Surat keterangan untuk keperluan administrasi kematian",
    persyaratan: [
      "KTP",
      "KK",
      "Surat Kematian",
      "Surat Keterangan Rumah Sakit",
    ],
    biaya: 0,
    waktu_proses: "1 hari kerja",
  },
];

const validationRules = [
  body("nama_lengkap").notEmpty().isLength({ min: 3, max: 100 }),
  body("nik").notEmpty().isLength({ min: 16, max: 16 }).isNumeric(),
  body("tempat_lahir").notEmpty(),
  body("tanggal_lahir").notEmpty(),
  body("pekerjaan").notEmpty(),
  body("alamat").notEmpty().isLength({ min: 10, max: 200 }),
  body("keperluan").notEmpty().isLength({ min: 5, max: 100 }),
  body("jenis_surat").notEmpty().isInt({ min: 1 }),
];

router.get("/dashboard-stats", async (req: Request, res: Response) => {
  try {
    // 1. Hitung pengajuan aktif ('pending' atau 'processing') dari database asli
    const [suratRows]: any = await pool.execute(
      "SELECT COUNT(*) as total FROM pengajuan_surat WHERE status IN ('pending', 'processing')"
    );

    // 2. Hitung total warga unik berdasarkan NIK dari database asli
    const [wargaRows]: any = await pool.execute(
      "SELECT COUNT(DISTINCT nik) as total FROM pengajuan_surat"
    );

    const pengajuanAktif = suratRows[0]?.total || 0;
    const wargaTerdata = wargaRows[0]?.total || 0;

    return res.status(200).json({
      success: true,
      message: "Data statistik dashboard berhasil dimuat",
      data: {
        pengajuanAktif: pengajuanAktif.toString(),
        wargaTerdata: wargaTerdata.toLocaleString("id-ID"),
        tingkatKepuasan: "97%",
      },
    });
  } catch (error) {
    console.error("Gagal memuat data statistik database:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil statistik dari server",
    });
  }
});

router.get("/jenis", (req: Request, res: Response) => {
  try {
    const availableLetters = suratDatabase.map((surat) => ({
      id: surat.id,
      jenis: surat.jenis,
      nama: surat.nama,
      deskripsi: surat.deskripsi,
      persyaratan: surat.persyaratan,
      biaya: surat.biaya,
      waktu_proses: surat.waktu_proses,
    }));

    res.json({
      success: true,
      message: "Daftar jenis surat berhasil dimuat",
      data: availableLetters,
    });
  } catch (error) {
    console.error("Error getting letter types:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});

router.get("/jenis/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const surat = suratDatabase.find((s) => s.id === Number(id));

    if (!surat) {
      return res.status(404).json({
        success: false,
        message: "Jenis surat tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Detail surat berhasil dimuat",
      data: surat,
    });
  } catch (error) {
    console.error("Error getting letter details:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});

router.post("/ajukan", validationRules, async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validasi gagal",
      errors: errors.array(),
    });
  }

  try {
    const {
      jenis_surat,
      nama_lengkap,
      nik,
      tempat_lahir,
      tanggal_lahir,
      pekerjaan,
      alamat,
      keperluan,
    } = req.body;
    const applicationId = `SR${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const nomorAntrian = Math.floor(Math.random() * 100) + 1;

    const query = `
  INSERT INTO pengajuan_surat 
  (id, jenis_surat, nama_lengkap, nik, tempat_lahir, tanggal_lahir, pekerjaan, alamat, keperluan, status, nomor_antrian) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
`;

    await pool.execute(query, [
      applicationId, // ? ke-1  -> mengisi kolom 'id'
      Number(jenis_surat), // ? ke-2  -> mengisi kolom 'jenis_surat'
      nama_lengkap, // ? ke-3  -> mengisi kolom 'nama_lengkap'
      nik, // ? ke-4  -> mengisi kolom 'nik'
      tempat_lahir, // ? ke-5  -> mengisi kolom 'tempat_lahir'
      tanggal_lahir, // ? ke-6  -> mengisi kolom 'tanggal_lahir'
      pekerjaan, // ? ke-7  -> mengisi kolom 'pekerjaan'
      alamat, // ? ke-8  -> mengisi kolom 'alamat'
      keperluan, // ? ke-9  -> mengisi kolom 'keperluan'
      nomorAntrian, // ? ke-10 -> mengisi kolom 'nomor_antrian'
    ]);

    const detailSurat = suratDatabase.find((s) => s.id === Number(jenis_surat));

    if (!detailSurat) {
      return res.status(404).json({
        success: false,
        message: "Jenis surat tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Pengajuan surat berhasil dikirim",
      data: {
        application_id: applicationId,
        nomor_antrian: nomorAntrian,
        status: "pending",
        estimated_time: detailSurat.waktu_proses || "3 hari kerja",
      },
    });
  } catch (error: any) {
    console.log("=== DETAIL ERROR MYSQL ===");
    console.error(error);
    console.log("==========================");

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});

router.get("/status/:applicationId", (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const mockStatus = {
      id: applicationId,
      status: "processing",
      message: "Pengajuan sedang diproses",
      progress: 25,
    };

    res.json({
      success: true,
      message: "Status pengajuan berhasil dimuat",
      data: mockStatus,
    });
  } catch (error) {
    console.error("Error checking application status:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});

router.get("/admin/applications", (req: Request, res: Response) => {
  try {
    const applications = [
      {
        id: "SR1234567890123",
        jenis_surat: "keterangan",
        nama_lengkap: "Ahmad Wijaya",
        nik: "1234567890123456",
        status: "pending",
        tanggal_pengajuan: "2026-05-08T10:30:00Z",
        nomor_antrian: 15,
      },
      {
        id: "SR1234567890124",
        jenis_surat: "domisili",
        nama_lengkap: "Siti Nurhaliza",
        nik: "1234567890123457",
        status: "processing",
        tanggal_pengajuan: "2026-05-07T09:15:00Z",
        nomor_antrian: 16,
      },
    ];

    res.json({
      success: true,
      message: "Daftar pengajuan berhasil dimuat",
      data: applications,
    });
  } catch (error) {
    console.error("Error getting applications:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});

router.put(
  "/admin/applications/:id",
  [
    body("status")
      .notEmpty()
      .isIn(["pending", "processing", "approved", "rejected"]),
    body("catatan").optional(),
  ],
  (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, catatan } = req.body;

      console.log(`Updating application ${id} to status: ${status}`);

      res.json({
        success: true,
        message: "Status pengajuan berhasil diperbarui",
        data: {
          id,
          status,
          updated_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }
);

export default router;