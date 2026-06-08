import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../lib/data-source";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import type { Repository } from "typeorm";

type JwtUserPayload = {
    id: number;
    role: string;
    status_akun: string;
};

const jwtSecret = process.env.JWT_SECRET || "SECRET_KEY_KAMU";

let userRepository: Repository<User> | undefined;

const getUserRepository = () => {
    userRepository ??= AppDataSource.getRepository(User);
    return userRepository;
};

export const register = async (req: Request, res: Response) => {
    try {
        const { nik, nama_lengkap, username, password, no_hp } = req.body;
        const userRepository = getUserRepository();

        // Validasi ketersediaan data unik (NIK atau Username)
        const existingUser = await userRepository.findOne({
            where: [{ nik }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "NIK atau Username sudah digunakan!" 
            });
        }

        // Enkripsi password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat user baru dengan status_akun default INCOMPLETE
        const newUser = userRepository.create({
            nik,
            nama_lengkap,
            username,
            password: hashedPassword,
            no_hp,
            role: "WARGA",               // Otomatis diset sebagai warga biasa
            status_akun: "INCOMPLETE"    // Satpam aktif: Wajib melengkapi formulir mandiri dulu
        });

        await userRepository.save(newUser);

        return res.status(201).json({
            success: true,
            message: "Akun warga berhasil didaftarkan! Silakan login untuk melengkapi data.",
            data: { nik, nama_lengkap }
        });
    } catch (error: any) {
        console.error("ERROR REGISTER:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// ─── 2. FUNGSI LOGIN (BISA INPUT NIK ATAU USERNAME) ───
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body; // 'username' di sini bisa berupa teks username atau nomor NIK
        const userRepository = getUserRepository();

        // Cari user berdasarkan kecocokan NIK ataupun Username
        const user = await userRepository.findOne({ 
            where: [{ nik: username }, { username: username }] 
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan!" });
        }

        // Cek kecocokan password hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Password salah!" });
        }

        // Amankan token: Selipkan status_akun ke dalam Payload JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                role: user.role,
                status_akun: user.status_akun 
            },
            jwtSecret,
            { expiresIn: "1d" }
        );

        // Kirim response lengkap ke frontend
        return res.json({
            success: true,
            message: "Login Berhasil!",
            token,
            user: {
                id: user.id,
                nama_lengkap: user.nama_lengkap,
                username: user.username,
                role: user.role,
                status_akun: user.status_akun
            }
        });
    } catch (error: any) {
        console.error("ERROR LOGIN:", error);
        return res.status(500).json({ success: false, message: error.message || "Gagal proses login" });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const payload = (req as any).user as JwtUserPayload | undefined;
        if (!payload?.id) {
            return res.status(401).json({ success: false, message: "Unauthorized Token" });
        }

        const userRepository = getUserRepository();
        const user = await userRepository.findOne({ where: { id: payload.id } });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan!",
            });
        }

        // Kirim seluruh detail kependudukan untuk dibaca di halaman onboarding/dashboard warga
        return res.json({
            success: true,
            data: {
                id: user.id,
                nik: user.nik,
                nama_lengkap: user.nama_lengkap,
                username: user.username,
                no_hp: user.no_hp,
                alamat: user.alamat,
                rt: user.rt,
                rw: user.rw,
                role: user.role,
                status_akun: user.status_akun,
                no_kk: user.no_kk,
                status_hubungan: user.status_hubungan,
                status_tinggal: user.status_tinggal,
                foto_ktp: user.foto_ktp,
                alasan_ditolak: user.alasan_ditolak,
                created_at: user.created_at,
            }
        });
    } catch (error: any) {
        console.error("ERROR PROFILE:", error);
        return res.status(500).json({ success: false, message: error.message || "Gagal mengambil data profile" });
    }
};

// ─── 4. FUNGSI SUBMIT FORMULIR MANDIRI WARGA (ONBOARDING) ───
export const submitOnboarding = async (req: Request, res: Response) => {
    try {
        const payload = (req as any).user as JwtUserPayload | undefined;
        if (!payload?.id) {
            return res.status(401).json({ success: false, message: "Unauthorized Token" });
        }

        const { no_kk, status_hubungan, status_tinggal, alamat, rt, rw } = req.body;
        const normalizedNoKk = typeof no_kk === "string" ? no_kk.trim() : "";
        const normalizedAlamat = typeof alamat === "string" ? alamat.trim() : "";
        const normalizedRt = typeof rt === "string" ? rt.trim() : "";
        const normalizedRw = typeof rw === "string" ? rw.trim() : "";

        if (normalizedNoKk?.length !== 16) {
            return res.status(400).json({ success: false, message: "Nomor KK wajib 16 digit." });
        }

        if (!normalizedAlamat || !normalizedRt || !normalizedRw) {
            return res.status(400).json({ success: false, message: "Alamat, RT, dan RW wajib diisi." });
        }
        
        // Ambil path foto KTP yang diupload via Multer
        const foto_ktp = req.file ? `/uploads/ktp/${req.file.filename}` : null;

        if (!foto_ktp && !req.file) {
            return res.status(400).json({ success: false, message: "Foto KTP wajib diunggah!" });
        }

        const userRepository = getUserRepository();
        const user = await userRepository.findOne({ where: { id: payload.id } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        // Update data kependudukan mandiri
        user.no_kk = normalizedNoKk;
        user.alamat = normalizedAlamat;
        user.rt = normalizedRt;
        user.rw = normalizedRw;
        user.status_hubungan = status_hubungan;
        user.status_tinggal = status_tinggal;
        if (foto_ktp) user.foto_ktp = foto_ktp;
        
        // Ubah status akun menjadi PENDING (Menunggu Validasi Admin)
        user.status_akun = "PENDING";

        await userRepository.save(user);

        return res.json({
            success: true,
            message: "Data formulir berhasil dikirim! Status akun Anda sekarang: PENDING VERIFIKASI.",
            data: user
        });
    } catch (error: any) {
        console.error("ERROR SUBMIT ONBOARDING:", error);
        return res.status(500).json({ success: false, message: error.message || "Gagal mengirim data" });
    }
};