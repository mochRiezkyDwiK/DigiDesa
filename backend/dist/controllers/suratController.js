"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusPengajuan = exports.getAllPengajuan = exports.getStatusPengajuan = exports.ajukanSurat = exports.getJenisSuratById = exports.getJenisSurat = void 0;
const database_1 = __importDefault(require("../database"));
const getJenisSurat = async (req, res) => {
    try {
        const query = 'SELECT * FROM jenis_surat WHERE is_active = true ORDER BY id';
        const result = await database_1.default.query(query);
        res.status(200).json({
            success: true,
            message: 'Daftar jenis surat berhasil dimuat',
            data: result.rows
        });
    }
    catch (error) {
        console.error('Error getting letter types:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        });
    }
};
exports.getJenisSurat = getJenisSurat;
const getJenisSuratById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM jenis_surat WHERE id = $1 AND is_active = true';
        const result = await database_1.default.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Jenis surat tidak ditemukan'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Detail jenis surat berhasil dimuat',
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error getting letter type details:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        });
    }
};
exports.getJenisSuratById = getJenisSuratById;
const ajukanSurat = async (req, res) => {
    try {
        const { jenis_surat, nama_lengkap, nik, tempat_lahir, tanggal_lahir, pekerjaan, alamat, keperluan } = req.body;
        const applicationId = `SR${Date.now()}${Math.floor(Math.random() * 1000)}`;
        const query = `
      INSERT INTO surat_applications
      (application_id, jenis_surat, nama_lengkap, nik, tempat_lahir, tanggal_lahir, pekerjaan, alamat, keperluan, status, tanggal_pengajuan, nomor_antrian)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING application_id, nomor_antrian, status
    `;
        const values = [
            applicationId,
            Number(jenis_surat),
            nama_lengkap,
            nik,
            tempat_lahir,
            tanggal_lahir,
            pekerjaan,
            alamat,
            keperluan,
            'pending',
            new Date(),
            Math.floor(Math.random() * 1000)
        ];
        const result = await database_1.default.query(query, values);
        res.status(201).json({
            success: true,
            message: 'Pengajuan surat berhasil dikirim',
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        });
    }
};
exports.ajukanSurat = ajukanSurat;
const getStatusPengajuan = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const query = 'SELECT * FROM surat_applications WHERE application_id = $1';
        const result = await database_1.default.query(query, [applicationId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pengajuan tidak ditemukan'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Status pengajuan berhasil dimuat',
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error checking application status:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        });
    }
};
exports.getStatusPengajuan = getStatusPengajuan;
const getAllPengajuan = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const status = typeof req.query.status === 'string' ? req.query.status : undefined;
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM surat_applications';
        let countQuery = 'SELECT COUNT(*) FROM surat_applications';
        const values = [];
        if (status) {
            query += ' WHERE status = $1';
            countQuery += ' WHERE status = $1';
            values.push(status);
        }
        query += ' ORDER BY tanggal_pengajuan DESC LIMIT $2 OFFSET $3';
        values.push(limit, offset);
        const [applicationsResult, countResult] = await Promise.all([
            database_1.default.query(query, values),
            database_1.default.query(countQuery, status ? [status] : [])
        ]);
        const total = Number(countResult.rows[0].count);
        res.status(200).json({
            success: true,
            message: 'Daftar pengajuan berhasil dimuat',
            data: {
                applications: applicationsResult.rows,
                pagination: {
                    current_page: page,
                    total_pages: Math.ceil(total / limit),
                    total_items: total,
                    items_per_page: limit
                }
            }
        });
    }
    catch (error) {
        console.error('Error getting applications:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        });
    }
};
exports.getAllPengajuan = getAllPengajuan;
const updateStatusPengajuan = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, catatan } = req.body;
        const query = `
      UPDATE surat_applications
      SET status = $1, catatan = $2, updated_at = $3
      WHERE application_id = $4
      RETURNING *
    `;
        const values = [status, catatan || '', new Date(), id];
        const result = await database_1.default.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pengajuan tidak ditemukan'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Status pengajuan berhasil diperbarui',
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        });
    }
};
exports.updateStatusPengajuan = updateStatusPengajuan;
