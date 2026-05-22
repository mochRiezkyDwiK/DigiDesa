import { Request, Response } from 'express';
import pool from '../../database';

export const getJenisSurat = async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM jenis_surat WHERE is_active = true ORDER BY id';
    const [result] = await pool.query(query);

    res.status(200).json({
      success: true,
      message: 'Daftar jenis surat berhasil dimuat',
      data: result
    });
  } catch (error) {
    console.error('Error getting letter types:' , error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
};

export const getJenisSuratById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM jenis_surat WHERE id = ? AND is_active = true';
    const [result] = await pool.query(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Jenis surat tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Detail jenis surat berhasil dimuat',
      data: result[0]
    });
  } catch (error) {
    console.error('Error getting letter type details:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
};

export const ajukanSurat = async (req: Request, res: Response) => {
  try {
    const { jenis_surat, nama_lengkap, nik, tempat_lahir, tanggal_lahir, pekerjaan, alamat, keperluan } = req.body;
    const applicationId = `SR${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const nomorAntrian = Math.floor(Math.random() * 1000);
    const query = `
      INSERT INTO surat_applications
      (application_id, jenis_surat, nama_lengkap, nik, tempat_lahir, tanggal_lahir, pekerjaan, alamat, keperluan, status, tanggal_pengajuan, nomor_antrian)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      nomorAntrian
    ];

    await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Pengajuan surat berhasil dikirim',
      data: { application_id: applicationId, nomor_antrian: nomorAntrian, status: 'pending' }
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
};

export const getStatusPengajuan = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const query = 'SELECT * FROM surat_applications WHERE application_id = ?';
    const [result] = await pool.query(query, [applicationId]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengajuan tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status pengajuan berhasil dimuat',
      data: result[0]
    });
  } catch (error) {
    console.error('Error checking application status:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
};

export const getAllPengajuan = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM surat_applications';
    let countQuery = 'SELECT COUNT(*) as count FROM surat_applications';
    const values: (string | number)[] = [];

    if (status) {
      query += ' WHERE status = ?';
      countQuery += ' WHERE status = ?';
      values.push(status);
    }

    query += ' ORDER BY tanggal_pengajuan DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [applicationsResult] = await pool.query(query, values);
    const [countResult] = await pool.query(countQuery, status ? [status] : []);

    const total = Number(countResult[0].count);

    res.status(200).json({
      success: true,
      message: 'Daftar pengajuan berhasil dimuat',
      data: {
        applications: applicationsResult,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit
        }
      }
    });
  } catch (error) {
    console.error('Error getting applications:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
};

export const updateStatusPengajuan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, catatan } = req.body;

    const query = `
      UPDATE surat_applications
      SET status = ?, catatan = ?, updated_at = ?
      WHERE application_id = ?
    `;

    const values = [status, catatan || '', new Date(), id];
    await pool.query(query, values);

    // Fetch the updated record
    const selectQuery = 'SELECT * FROM surat_applications WHERE application_id = ?';
    const [result] = await pool.query(selectQuery, [id]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengajuan tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status pengajuan berhasil diperbarui',
      data: result[0]
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
};
