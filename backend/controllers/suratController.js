const Surat = require('../models/Surat');
const JenisSurat = require('../models/JenisSurat');

// Get all letter types
exports.getJenisSurat = async (req, res) => {
  try {
    const jenisSurat = await JenisSurat.find({ isActive: true });
    
    res.status(200).json({
      success: true,
      message: 'Daftar jenis surat berhasil dimuat',
      data: jenisSurat
    });
  } catch (error) {
    console.error('Error getting letter types:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
};

// Get details for specific letter type
exports.getJenisSuratById = async (req, res) => {
  try {
    const { id } = req.params;
    const jenisSurat = await JenisSurat.findById(id);
    
    if (!jenisSurat) {
      return res.status(404).json({
        success: false,
        message: 'Jenis surat tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Detail jenis surat berhasil dimuat',
      data: jenisSurat
    });
  } catch (error) {
    console.error('Error getting letter type details:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
};

// Submit letter application
exports.ajukanSurat = async (req, res) => {
  try {
    const { jenis_surat, nama_lengkap, nik, tempat_lahir, tanggal_lahir, pekerjaan, alamat, keperluan } = req.body;
    
    // Generate application ID
    const applicationId = `SR${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Create application record
    const application = new Surat({
      applicationId,
      jenis_surat: parseInt(jenis_surat),
      nama_lengkap,
      nik,
      tempat_lahir,
      tanggal_lahir,
      pekerjaan,
      alamat,
      keperluan,
      status: 'pending',
      tanggal_pengajuan: new Date(),
      nomor_antrian: Math.floor(Math.random() * 1000)
    });

    await application.save();
    
    res.status(201).json({
      success: true,
      message: 'Pengajuan surat berhasil dikirim',
      data: {
        application_id: applicationId,
        nomor_antrian: application.nomor_antrian,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
};

// Get application status
exports.getStatusPengajuan = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await Surat.findOne({ applicationId });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Pengajuan tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Status pengajuan berhasil dimuat',
      data: {
        id: application.applicationId,
        status: application.status,
        jenis_surat: application.jenis_surat,
        nama_lengkap: application.nama_lengkap,
        tanggal_pengajuan: application.tanggal_pengajuan,
        nomor_antrian: application.nomor_antrian
      }
    });
  } catch (error) {
    console.error('Error checking application status:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
};

// Get all applications for admin
exports.getAllPengajuan = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    
    const applications = await Surat.find(query)
      .populate('jenis_surat')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Surat.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Daftar pengajuan berhasil dimuat',
      data: {
        applications,
        pagination: {
          current_page: parseInt(page),
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

// Update application status (admin)
exports.updateStatusPengajuan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan } = req.body;
    
    const application = await Surat.findOneAndUpdate(
      { applicationId: id },
      { 
        status,
        catatan,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Pengajuan tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Status pengajuan berhasil diperbarui',
      data: application
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
};
