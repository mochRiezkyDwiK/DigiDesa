const mongoose = require('mongoose');

const jenisSuratSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    trim: true
  },
  deskripsi: {
    type: String,
    required: true,
    trim: true
  },
  persyaratan: [{
    type: String,
    required: true,
    trim: true
  }],
  biaya: {
    type: Number,
    default: 0
  },
  waktu_proses: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('JenisSurat', jenisSuratSchema);
