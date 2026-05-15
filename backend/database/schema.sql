-- PostgreSQL Schema for DigiDesa Backend

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS digidesa;

-- Use the database
\c digidesa;

-- Create jenis_surat table
CREATE TABLE IF NOT EXISTS jenis_surat (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    persyaratan TEXT[] NOT NULL,
    biaya DECIMAL(10,2) DEFAULT 0,
    waktu_proses VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create surat_applications table
CREATE TABLE IF NOT EXISTS surat_applications (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(50) UNIQUE NOT NULL,
    jenis_surat INTEGER REFERENCES jenis_surat(id),
    nama_lengkap VARCHAR(255) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    tempat_lahir VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    pekerjaan VARCHAR(100) NOT NULL,
    alamat TEXT NOT NULL,
    keperluan VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected')),
    tanggal_pengajuan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nomor_antrian INTEGER NOT NULL,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'warga' CHECK (role IN ('warga', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    jenis VARCHAR(20) NOT NULL CHECK (jenis IN ('info', 'success', 'warning', 'error', 'progress')),
    judul VARCHAR(255) NOT NULL,
    pesan TEXT NOT NULL,
    poin INTEGER DEFAULT 0,
    dibaca BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days')
);

-- Insert sample data for jenis_surat
INSERT INTO jenis_surat (nama, deskripsi, persyaratan, biaya, waktu_proses) VALUES 
('Surat Keterangan Usaha', 'Surat keterangan untuk keperluan usaha dan bisnis', ARRAY['KTP', 'KK', 'Surat Nikah', 'Pas Foto'], 0, '3 hari kerja'),
('Surat Keterangan Belum Menikah', 'Surat keterangan untuk warga yang belum menikah', ARRAY['KTP', 'KK', 'Surat Kelahiran', 'Pas Foto'], 0, '2 hari kerja'), 
('Akte Kelahiran', 'Salinan akte kelahiran resmi', ARRAY['KTP Ayah', 'KTP Ibu', 'KK', 'Surat Nikah Orang Tua', 'Surat Kelahiran Asli'], 15000, '5 hari kerja'),
('Surat Keterangan Pindah', 'Surat keterangan untuk keperluan pindah domisili', ARRAY['KTP', 'KK', 'Surat Pindah', 'Surat Keterangan RT/RW'], 0, '2 hari kerja'),
('Surat Keterangan Kematian', 'Surat keterangan untuk keperluan administrasi kematian', ARRAY['KTP', 'KK', 'Surat Kematian', 'Surat Keterangan Rumah Sakit'], 0, '1 hari kerja');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_surat_applications_application_id ON surat_applications(application_id);
CREATE INDEX IF NOT EXISTS idx_surat_applications_status ON surat_applications(status);
CREATE INDEX IF NOT EXISTS idx_surat_applications_tanggal ON surat_applications(tanggal_pengajuan);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_dibaca ON notifications(dibaca);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_jenis_surat_updated_at BEFORE UPDATE ON jenis_surat
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_surat_applications_updated_at BEFORE UPDATE ON surat_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
