const mongoose = require('mongoose');

const suratSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  jenis_surat: {
    type: Number,
    required: true,
    ref: 'JenisSurat'
  },
  nama_lengkap: {
    type: String,
    required: true,
    trim: true
  },
  nik: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{16}$/.test(v);
      },
      message: 'NIK harus 16 digit'
    }
  },
  tempat_lahir: {
    type: String,
    required: true,
    trim: true
  },
  tanggal_lahir: {
    type: Date,
    required: true
  },
  pekerjaan: {
    type: String,
    required: true,
    trim: true
  },
  alamat: {
    type: String,
    required: true,
    trim: true
  },
  keperluan: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'approved', 'rejected'],
    default: 'pending'
  },
  tanggal_pengajuan: {
    type: Date,
    default: Date.now
  },
  nomor_antrian: {
    type: Number,
    required: true
  },
  catatan: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SuratApplication', suratSchema);
