# TRD — Technical Requirements Document (DigiDesa)

Dokumen ini merangkum kebutuhan fungsional & non-fungsional, scope fitur, serta arahan teknis implementasi.

## 1) Tujuan

- Menyediakan portal layanan desa yang cepat, mudah, dan terstruktur untuk:
  - Warga: pengajuan layanan/surat, pelaporan, melihat info/pengumuman, profil.
  - RT/RW: verifikasi/validasi, rekap, monitoring.
  - Admin Desa: manajemen data penduduk, surat, laporan, keuangan, pengaturan.

## 2) Peran (Role)

Role yang sudah ada di backend (enum):
- `WARGA`
- `RT`
- `RW`
- `ADMIN_DESA`

Aturan umum akses (arah desain):
- WARGA: membuat pengajuan surat/laporan, melihat status, mengelola profil.
- RT/RW: memverifikasi pengajuan warga di wilayahnya, memberi catatan.
- ADMIN_DESA: final approval, manajemen master data, konfigurasi & pelaporan.

## 3) Modul & kebutuhan fungsional

### 3.1 Autentikasi & Akun (sudah MVP)

- Registrasi warga:
  - Input minimal: `nik`, `nama_lengkap`, `username`, `password`, `no_hp`.
  - Validasi: `nik` dan `username` unik.
- Login:
  - Input: `username` + `password`.
  - Output: JWT token + ringkas profil.
- Profile:
  - Endpoint `/me` untuk mengambil data user dari token.

Catatan implementasi saat ini:
- Frontend menyederhanakan login: `username` disamakan dengan NIK untuk sementara.

### 3.2 Layanan Surat (direncanakan)

- Warga membuat permohonan surat (contoh: domisili, pengantar, keterangan usaha).
- Sistem menyimpan status proses (contoh): `DIAJUKAN → DIVERIFIKASI_RT → DIVERIFIKASI_RW → DISETUJUI_ADMIN → SELESAI`.
- RT/RW/Admin dapat memberi catatan / alasan penolakan.
- Dokumen surat (PDF) bisa dihasilkan setelah disetujui (fase lanjutan).

### 3.3 Laporan Warga (direncanakan)

- Warga dapat melapor kategori (keamanan, kebersihan, fasilitas, dll) + deskripsi + foto (opsional).
- RT/RW/Admin dapat mengubah status tindak lanjut.

### 3.4 Keuangan/Finansial (direncanakan)

- Transparansi laporan pemasukan/pengeluaran (mis. kas RT/RW/desa).
- Rekap per periode, export (fase lanjutan).

### 3.5 Manajemen Penduduk (direncanakan)

- Admin mengelola data penduduk, alamat, KK (opsional), wilayah RT/RW.
- Sinkronisasi dengan akun user (jika diperlukan).

### 3.6 Pengumuman (direncanakan)

- Admin membuat pengumuman.
- Warga dapat melihat daftar & detail.

## 4) Kebutuhan non-fungsional

- Keamanan:
  - Password di-hash (`bcrypt`).
  - JWT dengan secret dari environment.
  - Role-based access control (RBAC) pada endpoint admin.
  - Audit log (fase lanjutan) untuk aktivitas sensitif.
- Reliability:
  - Backend hanya start setelah DB connect.
  - Error handling konsisten (format JSON `success`, `message`).
- Maintainability:
  - Pisahkan controller, routes, middleware, models.
  - Hindari duplikasi logic (mis. repository getter).
- Observability:
  - Logging error di server.
  - (Rencana) request logging + correlation id.

## 5) Constraint teknis (yang sudah dipilih)

- Frontend:
  - React + Vite + TypeScript
  - TailwindCSS
  - Framer Motion v12 (animasi)
  - Axios (HTTP)
- Backend:
  - Express + TypeScript
  - CommonJS (`package.json` type commonjs)
  - TypeORM + MySQL/TiDB Cloud
  - JWT + bcrypt
- Database:
  - TiDB Cloud / MySQL compatible
  - Saat ini `synchronize: true` (MVP). Untuk production: harus migrasi ke migrations.

## 6) Definisi “MVP berhasil”

- Backend berjalan tanpa error 404/500 untuk auth.
- Frontend dapat register & login, menyimpan token, dan navigasi ke dashboard warga.
- Endpoint `/me` dapat diakses dengan token valid.
