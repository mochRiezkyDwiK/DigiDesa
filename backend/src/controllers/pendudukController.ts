import { Request, Response } from "express";
import { AppDataSource } from "../lib/data-source";
import { User } from "../models/User";
import { Wilayah } from "../models/Wilayah";
import bcrypt from "bcryptjs";
import { Repository } from "typeorm";

// Helper untuk mengambil Repository User
let userRepository: Repository<User> | undefined;
const getUserRepository = () => {
    userRepository ??= AppDataSource.getRepository(User);
    return userRepository;
};

// --- 1. FUNGSI TAMBAH PENDUDUK (CREATE) ---
export const createPenduduk = async (req: Request, res: Response) => {
    try {
        const { nik, no_kk, nama_lengkap, no_hp, password, alamat, rt, rw } = req.body;

        // Validasi Input Wajib
        if (!nik || !no_kk || !nama_lengkap || !no_hp || !alamat || !rt || !rw) {
            return res.status(400).json({ 
                success: false, 
                message: "Semua data (NIK, No KK, Nama, Alamat, RT, RW) wajib diisi!" 
            });
        }

        const repo = getUserRepository();
        const wilayahRepo = AppDataSource.getRepository(Wilayah);

        // Cek apakah NIK sudah terdaftar
        const existingUser = await repo.findOneBy({ nik });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Gagal! NIK tersebut sudah terdaftar di sistem." 
            });
        }

        // LOGIKA WILAYAH: Cari apakah RT/RW tersebut sudah ada di tabel wilayah
        let wilayah = await wilayahRepo.findOneBy({ rt, rw });

        // Jika RT/RW belum terdaftar di tabel wilayah, buat baru otomatis
        if (!wilayah) {
            wilayah = wilayahRepo.create({ rt, rw });
            await wilayahRepo.save(wilayah);
        }

        // Hash Password (Default: pakai NIK kalau password kosong)
        const plainPassword = password || nik; 
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Buat entitas warga baru
        const newWarga = repo.create({
            nik,
            no_kk,
            nama_lengkap,
            username: nik, // Username login otomatis pakai NIK
            password: hashedPassword,
            no_hp,
            alamat,
            rt,
            rw,
            role: "WARGA",
            wilayah: wilayah // Menghubungkan Relasi (otomatis mengisi wilayahId)
        });

        await repo.save(newWarga);

        res.status(201).json({
            success: true,
            message: `Warga baru bernama ${nama_lengkap} berhasil ditambahkan ke RT ${rt} / RW ${rw}!`,
        });

    } catch (error) {
        console.error("Error createPenduduk:", error);
        res.status(500).json({ 
            success: false, 
            message: "Terjadi kesalahan server saat menambah warga" 
        });
    }
};

// --- 2. FUNGSI AMBIL SEMUA PENDUDUK (READ + FILTER) ---
export const getAllPenduduk = async (req: Request, res: Response) => {
    try {
        const { rt, rw, search } = req.query;
        const repo = getUserRepository();

        // Gunakan Query Builder agar filter relasi lebih fleksibel
        const query = repo.createQueryBuilder("user")
            .leftJoinAndSelect("user.wilayah", "wilayah")
            .where("user.role = :role", { role: "WARGA" });

        // Filter berdasarkan RT
        if (rt) {
            query.andWhere("wilayah.rt = :rt", { rt });
        }

        // Filter berdasarkan RW
        if (rw) {
            query.andWhere("wilayah.rw = :rw", { rw });
        }

        // Search berdasarkan Nama atau NIK
        if (search) {
            query.andWhere("(user.nama_lengkap LIKE :search OR user.nik LIKE :search)", { 
                search: `%${search}%` 
            });
        }

        const data = await query.orderBy("user.created_at", "DESC").getMany();

        res.json({ 
            success: true, 
            data 
        });
    } catch (error) {
        console.error("Error getAllPenduduk:", error);
        res.status(500).json({ 
            success: false, 
            message: "Gagal mengambil data penduduk" 
        });
    }
};

// --- 3. FUNGSI UPDATE DATA PENDUDUK (UPDATE) ---
export const updatePenduduk = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nama_lengkap, no_hp, alamat, no_kk } = req.body;
        
        const repo = getUserRepository();
        
        const existing = await repo.findOneBy({ id: Number(id) });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Penduduk tidak ditemukan" });
        }

        // Update data yang diizinkan
        await repo.update(id, {
            nama_lengkap,
            no_hp,
            alamat,
            no_kk
        });

        res.json({ 
            success: true, 
            message: "Data penduduk berhasil diperbarui" 
        });
    } catch (error) {
        console.error("Error updatePenduduk:", error);
        res.status(500).json({ success: false, message: "Gagal memperbarui data" });
    }
};

// --- 4. FUNGSI HAPUS PENDUDUK (DELETE) ---
export const deletePenduduk = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const repo = getUserRepository();

        const result = await repo.delete(id);
        
        if (result.affected === 0) {
            return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
        }

        res.json({ 
            success: true, 
            message: "Data penduduk berhasil dihapus dari sistem" 
        });
    } catch (error) {
        console.error("Error deletePenduduk:", error);
        res.status(500).json({ success: false, message: "Gagal menghapus data" });
    }
};

// --- 5. FUNGSI CARI ANGGOTA KELUARGA ---
export const getAnggotaKeluarga = async (req: Request, res: Response) => {
    try {
        const { no_kk } = req.params;
        const repo = getUserRepository();

        const anggota = await repo.find({
            where: { no_kk },
            order: { nama_lengkap: "ASC" }
        });

        res.json({ 
            success: true, 
            data: anggota 
        });
    } catch (error) {
        console.error("Error getAnggotaKeluarga:", error);
        res.status(500).json({ success: false, message: "Gagal memuat anggota keluarga" });
    }
};