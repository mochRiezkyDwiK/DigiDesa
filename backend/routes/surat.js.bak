const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Mock database for development
const suratDatabase = [
  {
    id: 1,
    jenis: 'keterangan',
    nama: 'Surat Keterangan Usaha',
    deskripsi: 'Surat keterangan untuk keperluan usaha dan bisnis',
    persyaratan: ['KTP', 'KK', 'Surat Nikah', 'Pas Foto'],
    biaya: 0,
    waktu_proses: '3 hari kerja'
  },
  {
    id: 2,
    jenis: 'domisili',
    nama: 'Surat Keterangan Belum Menikah',
    deskripsi: 'Surat keterangan untuk warga yang belum menikah',
    persyaratan: ['KTP', 'KK', 'Surat Kelahiran', 'Pas Foto'],
    biaya: 0,
    waktu_proses: '2 hari kerja'
  },
  {
    id: 3,
    jenis: 'kelahiran',
    nama: 'Akte Kelahiran',
    deskripsi: 'Salinan akte kelahiran resmi',
    persyaratan: ['KTP Ayah', 'KTP Ibu', 'KK', 'Surat Nikah Orang Tua', 'Surat Kelahiran Asli'],
    biaya: 15000,
    waktu_proses: '5 hari kerja'
  },
  {
    id: 4,
    jenis: 'pindah',
    nama: 'Surat Keterangan Pindah',
    deskripsi: 'Surat keterangan untuk keperluan pindah domisili',
    persyaratan: ['KTP', 'KK', 'Surat Pindah', 'Surat Keterangan RT/RW'],
    biaya: 0,
    waktu_proses: '2 hari kerja'
  },
  {
    id: 5,
    jenis: 'kematian',
    nama: 'Surat Keterangan Kematian',
    deskripsi: 'Surat keterangan untuk keperluan administrasi kematian',
    persyaratan: ['KTP', 'KK', 'Surat Kematian', 'Surat Keterangan Rumah Sakit'],
    biaya: 0,
    waktu_proses: '1 hari kerja'
  }
];

// Validation rules
const suratValidationRules = {
  keterangan: {
    nama_lengkap: {
      notEmpty: {
        errorMessage: 'Nama lengkap harus diisi',
      },
      isLength: {
        options: { min: 3, max: 100 },
        errorMessage: 'Nama lengkap minimal 3 karakter, maksimal 100 karakter'
      }
    },
    nik: {
      notEmpty: {
        errorMessage: 'NIK harus diisi',
      },
      isLength: {
        options: { min: 16, max: 16 },
        errorMessage: 'NIK harus 16 digit'
      },
      isNumeric: {
        errorMessage: 'NIK harus berupa angka'
      }
    },
    tempat_lahir: {
      notEmpty: {
        errorMessage: 'Tempat lahir harus diisi',
      }
    },
    tanggal_lahir: {
      notEmpty: {
        errorMessage: 'Tanggal lahir harus diisi',
      }
    },
    pekerjaan: {
      notEmpty: {
        errorMessage: 'Pekerjaan harus diisi',
      }
    },
    alamat: {
      notEmpty: {
        errorMessage: 'Alamat harus diisi',
      },
      isLength: {
        options: { min: 10, max: 200 },
        errorMessage: 'Alamat minimal 10 karakter, maksimal 200 karakter'
      }
    },
    keperluan: {
      notEmpty: {
        errorMessage: 'Keperluan harus diisi',
      },
      isLength: {
        options: { min: 5, max: 100 },
        errorMessage: 'Keperluan minimal 5 karakter, maksimal 100 karakter'
      }
    }
  }
};

// GET all available letter types
router.get('/jenis', (req, res) => {
  try {
    const availableLetters = suratDatabase.map(surat => ({
      id: surat.id,
      jenis: surat.jenis,
      nama: surat.nama,
      deskripsi: surat.deskripsi,
      persyaratan: surat.persyaratan,
      biaya: surat.biaya,
      waktu_proses: surat.waktu_proses
    }));

    res.json({
      success: true,
      message: 'Daftar jenis surat berhasil dimuat',
      data: availableLetters
    });
  } catch (error) {
    console.error('Error getting letter types:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
});

// GET details for specific letter type
router.get('/jenis/:id', (req, res) => {
  try {
    const { id } = req.params;
    const surat = suratDatabase.find(s => s.id === parseInt(id));
    
    if (!surat) {
      return res.status(404).json({
        success: false,
        message: 'Jenis surat tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Detail surat berhasil dimuat',
      data: surat
    });
  } catch (error) {
    console.error('Error getting letter details:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
});

// POST submit letter application
router.post('/ajukan', [
  body('nama_lengkap').notEmpty().isLength({ min: 3, max: 100 }),
  body('nik').notEmpty().isLength({ min: 16, max: 16 }).isNumeric(),
  body('tempat_lahir').notEmpty(),
  body('tanggal_lahir').notEmpty(),
  body('pekerjaan').notEmpty(),
  body('alamat').notEmpty().isLength({ min: 10, max: 200 }),
  body('keperluan').notEmpty().isLength({ min: 5, max: 100 }),
  body('jenis_surat').notEmpty().isInt({ min: 1 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { jenis_surat, nama_lengkap, nik, tempat_lahir, tanggal_lahir, pekerjaan, alamat, keperluan } = req.body;
      
      // Generate application ID
      const applicationId = `SR${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      // Create application record
      const application = {
        id: applicationId,
        jenis_surat: parseInt(jenis_surat),
        nama_lengkap,
        nik,
        tempat_lahir,
        tanggal_lahir,
        pekerjaan,
        alamat,
        keperluan,
        status: 'pending',
        tanggal_pengajuan: new Date().toISOString(),
        nomor_antrian: Math.floor(Math.random() * 100)
      };

      // In real implementation, save to database
      console.log('New application:', application);
      
      res.json({
        success: true,
        message: 'Pengajuan surat berhasil dikirim',
        data: {
          application_id: applicationId,
          nomor_antrian: application.nomor_antrian,
          status: 'pending',
          estimated_time: suratDatabase.find(s => s.id === parseInt(jenis_surat))?.waktu_proses || '3 hari kerja'
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
});

// GET application status
router.get('/status/:applicationId', (req, res) => {
  try {
    const { applicationId } = req.params;
    
    // Mock status check - in real implementation, query from database
    const mockStatus = {
      id: applicationId,
      status: 'processing',
      message: 'Pengajuan sedang diproses',
      progress: 25
    };
    
    res.json({
      success: true,
      message: 'Status pengajuan berhasil dimuat',
      data: mockStatus
    });
  } catch (error) {
    console.error('Error checking application status:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
});

// GET all applications for admin
router.get('/admin/applications', (req, res) => {
  try {
    // Mock data - in real implementation, query from database
    const applications = [
      {
        id: 'SR1234567890123',
        jenis_surat: 'keterangan',
        nama_lengkap: 'Ahmad Wijaya',
        nik: '1234567890123456',
        status: 'pending',
        tanggal_pengajuan: '2026-05-08T10:30:00Z',
        nomor_antrian: 15
      },
      {
        id: 'SR1234567890124',
        jenis_surat: 'domisili',
        nama_lengkap: 'Siti Nurhaliza',
        nik: '1234567890123457',
        status: 'processing',
        tanggal_pengajuan: '2026-05-07T09:15:00Z',
        nomor_antrian: 16
      }
    ];
    
    res.json({
      success: true,
      message: 'Daftar pengajuan berhasil dimuat',
      data: applications
    });
  } catch (error) {
    console.error('Error getting applications:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
});

// PUT update application status (admin)
router.put('/admin/applications/:id', [
  body('status').notEmpty().isIn(['pending', 'processing', 'approved', 'rejected']),
  body('catatan').optional()
], (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan } = req.body;
    
    // In real implementation, update database
    console.log(`Updating application ${id} to status: ${status}`);
    
    res.json({
      success: true,
      message: 'Status pengajuan berhasil diperbarui',
      data: {
        id,
        status,
        updated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
});

module.exports = router;
