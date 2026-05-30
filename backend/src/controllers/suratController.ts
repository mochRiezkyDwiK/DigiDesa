import { Request, Response } from "express";
import { AppDataSource } from "../lib/data-source";
import { Surat, JenisSurat, StatusSurat } from "../models/Surat";
import { User } from "../models/User";
import * as crypto from "crypto";

const suratRepository = AppDataSource.getRepository(Surat);
const userRepository = AppDataSource.getRepository(User);

// ─────────────────────────────────────────────────────────────────────────────
// ─── FUNGSI KHUSUS SIDE WARGA (CLIENT)
// ─────────────────────────────────────────────────────────────────────────────

// 1. Warga Membuat Pengajuan Surat Baru (POST)
export const createSurat = async (req: Request, res: Response) => {
    try {
        const { jenis_surat, keperluan } = req.body;
        const userId = (req as any).user.id; // Comot otomatis dari decrypt Token JWT

        // Validasi apakah enum jenis surat sesuai
        if (!Object.values(JenisSurat).includes(jenis_surat)) {
            return res.status(400).json({ success: false, message: "Jenis surat tidak valid!" });
        }

        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User warga tidak ditemukan!" });
        }

        const alasanKeperluan = typeof keperluan === "string" ? keperluan.trim() : "";
        if (!alasanKeperluan) {
            return res.status(400).json({ success: false, message: "Alasan keperluan surat wajib diisi!" });
        }

        const alamatDb = (user.alamat || "").trim();
        const rtDb = (user.rt || "").trim();
        const rwDb = (user.rw || "").trim();

        if (!alamatDb || !rtDb || !rwDb) {
            return res.status(400).json({
                success: false,
                message: "Data domisili (alamat, RT, RW) belum lengkap di profil. Silakan lengkapi profil warga terlebih dahulu."
            });
        }

        const detailKeperluan = [
            "[DATA DOMISILI OTOMATIS DARI DATABASE]",
            `Nama: ${user.nama_lengkap || "-"}`,
            `NIK: ${user.nik || "-"}`,
            `Alamat: ${alamatDb}`,
            `RT/RW: ${rtDb}/${rwDb}`,
            "",
            "[ALASAN PENGAJUAN SURAT]",
            alasanKeperluan
        ].join("\n");

        // Cetak object surat baru
        const baruSurat = new Surat();
        baruSurat.user = user;
        baruSurat.jenis_surat = jenis_surat;
        baruSurat.keperluan = detailKeperluan;
        baruSurat.status = StatusSurat.PENDING; // Otomatis standby di-review RT

        await suratRepository.save(baruSurat);

        return res.status(201).json({
            success: true,
            message: "Permohonan pengajuan surat berhasil dikunci ke database!",
            data: baruSurat
        });
    } catch (error: any) {
        console.error("ERROR CREATE SURAT:", error);
        return res.status(500).json({ success: false, message: error.message || "Gagal membuat pengajuan surat" });
    }
};

// 2. Warga Mengambil Riwayat Surat Miliknya Sendiri (GET)
export const getSuratByWarga = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // Ambil ID dari token login

        const riwayatSurat = await suratRepository.find({
            where: { user: { id: userId } },
            order: { tgl_diajukan: "DESC" } // Surat terbaru muncul paling atas
        });

        return res.json({
            success: true,
            data: riwayatSurat
        });
    } catch (error: any) {
        console.error("ERROR GET SURAT WARGA:", error);
        return res.status(500).json({ success: false, message: "Gagal memuat riwayat surat" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// ─── FUNGSI KHUSUS SIDE ADMIN (MENARA KONTROL KELURAHAN)
// ─────────────────────────────────────────────────────────────────────────────

// 3. Admin Mengambil Semua Antrean Surat Masuk Desa (GET)
export const getAllSuratAdmin = async (req: Request, res: Response) => {
    try {
        const semuaSurat = await suratRepository.find({
            relations: ["user"], // Muat detail data warga pengaju (Nama, RT, RW)
            order: { tgl_diajukan: "DESC" }
        });

        return res.json({
            success: true,
            data: semuaSurat
        });
    } catch (error: any) {
        console.error("ERROR GET ALL SURAT ADMIN:", error);
        return res.status(500).json({ success: false, message: "Gagal memuat antrean surat admin" });
    }
};

// 4. Admin Mengeksekusi Otoritas Surat (ACC / REJECT)
export const verifySuratAdmin = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { status, alasan_ditolak } = req.body; // status berupa: 'SELESAI' atau 'REJECTED'

        if (!Number.isFinite(id)) {
            return res.status(400).json({ success: false, message: "ID surat tidak valid" });
        }

        const surat = await suratRepository.findOne({
            where: { id },
            relations: ["user"]
        });

        if (!surat) {
            return res.status(404).json({ success: false, message: "Berkas pengajuan surat tidak ditemukan!" });
        }

        if (status === StatusSurat.SELESAI) {
            // 🧠 ENGINE OTOMATISASI GENERATOR NOMOR SURAT RESMI DESA DIGITAL
            const totalSelesai = await suratRepository.countBy({ status: StatusSurat.SELESAI });
            const urutanNomor = String(totalSelesai + 1).padStart(3, "0");
            const bulanRomawi = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][new Date().getMonth()];
            const tahun = new Date().getFullYear();
            
            // Format Output: 001/SKD/RT01/RW10/V/2026
            surat.no_surat = `${urutanNomor}/${surat.jenis_surat}/RT${surat.user.rt || "00"}/RW${surat.user.rw || "00"}/${bulanRomawi}/${tahun}`;
            
            // 🛡️ GENERATOR TOKEN QR CODE AMAN ANTI-PEMALSUAN DOKUMEN
            surat.token_qr = crypto.randomBytes(16).toString("hex");
            surat.tgl_disetujui = new Date();
            surat.alasan_ditolak = ""; // Bersihkan kolom jika sebelumnya pernah direject
        } else if (status === StatusSurat.REJECTED) {
            if (!alasan_ditolak) {
                return res.status(400).json({ success: false, message: "Alasan penolakan surat wajib diisi!" });
            }
            surat.alasan_ditolak = alasan_ditolak;
            surat.no_surat = "";
            surat.token_qr = "";
        }

        surat.status = status;
        await suratRepository.save(surat);

        return res.json({
            success: true,
            message: `Berkas permohonan surat berhasil diperbarui menjadi ${status}!`,
            data: surat
        });
    } catch (error: any) {
        console.error("ERROR VERIFY SURAT ADMIN:", error);
        return res.status(500).json({ success: false, message: "Gagal memproses eksekusi berkas surat" });
    }
};
