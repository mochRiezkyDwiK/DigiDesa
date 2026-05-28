import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../lib/data-source";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import type { Repository } from "typeorm";

type JwtUserPayload = {
    id: number;
    role: string;
};

// Definisikan repository di level atas agar bisa dipakai semua fungsi
let userRepository: Repository<User> | undefined;

const getUserRepository = () => {
    userRepository ??= AppDataSource.getRepository(User);
    return userRepository;
};

// --- FUNGSI REGISTER ---
export const registerWarga = async (req: Request, res: Response) => {
    try {
        const { nik, nama_lengkap, username, password, no_hp } = req.body;

        if (!nik || !nama_lengkap || !username || !password || !no_hp) {
            return res.status(400).json({
                success: false,
                message: "Data tidak lengkap. Pastikan nik, nama_lengkap, username, password, no_hp terisi.",
            });
        }

        const userRepository = getUserRepository();

        // Validasi keberadaan user
        const existingUser = await userRepository.findOne({
            where: [{ nik }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "NIK atau Username sudah digunakan!" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({
            nik,
            nama_lengkap,
            username,
            password: hashedPassword,
            no_hp
        });

        await userRepository.save(newUser);

        res.status(201).json({
            success: true,
            message: "Akun warga berhasil didaftarkan!",
            data: { nik, nama_lengkap: nama_lengkap }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// --- FUNGSI LOGIN ---
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username/NIK dan password wajib diisi",
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({
                success: false,
                message: "Konfigurasi server belum lengkap (JWT_SECRET belum di-set)",
            });
        }

        const userRepository = getUserRepository();

        // 1. Cari user berdasarkan username (Bisa NIK atau Username)
        const user = await userRepository.findOne({ 
            where: [{ nik: username }, { username: username }] 
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan!" });
        }

        // 2. Cek password (bandingkan dengan hash di DB)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Password salah!" });
        }

        // 3. Buat JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            jwtSecret,
            { expiresIn: "1d" } // Token berlaku 1 hari
        );

        // 4. Kirim Response ke Frontend (Kirim nama_lengkap agar sinkron)
        res.json({
            success: true,
            message: "Login Berhasil!",
            token,
            user: {
                nama_lengkap: user.nama_lengkap,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal login" });
    }
};

// --- FUNGSI GET PROFILE (protected) ---
// --- FUNGSI GET PROFILE (protected) ---
export const getProfile = async (req: Request, res: Response) => {
    try {
        const payload = (req as any).user as JwtUserPayload | undefined;
        if (!payload?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const userRepository = getUserRepository();
        const user = await userRepository.findOne({ where: { id: payload.id } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan",
            });
        }

        return res.json({
            success: true,
            data: {
                id: user.id,
                nik: user.nik,
                // 🔴 DISESUAIKAN: Petakan nama_lengkap dari DB ke key 'nama' agar dibaca oleh React
                nama: user.nama_lengkap, 
                username: user.username,
                no_hp: user.no_hp,
                role: user.role,
                // 🔴 TAMBAHAN: Pastikan kolom is_verified dikirim ke frontend
                // Jika di model TypeORM belum ada, pastikan Anda menambahkannya di entitas User.ts
                is_verified: (user as any).is_verified !== undefined ? Boolean((user as any).is_verified) : false,
                created_at: user.created_at,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal mengambil profile" });
    }
};