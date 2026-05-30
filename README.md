# DigiDesa

![Status](https://img.shields.io/badge/Status-Active%20Development-2563eb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=0b1f2a)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-111827?logo=express&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3-e83524)
![MySQL](https://img.shields.io/badge/MySQL-TiDB%2FMySQL-4479A1?logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-16a34a)

Language:
- Indonesia: [README.md](README.md)
- English: [docs/README.en.md](docs/README.en.md)

Platform layanan administrasi desa berbasis web dengan dua sisi utama:

- Portal Warga: onboarding, pengajuan surat, pelaporan, dashboard status.
- Portal Admin: moderasi laporan, validasi surat, data penduduk, keuangan, pengaturan.

## Ringkasan Proyek

DigiDesa dibangun sebagai monorepo 2 aplikasi:

- Backend API: Express + TypeScript + TypeORM + MySQL/TiDB.
- Frontend Web: React + Vite + TypeScript + Tailwind + Framer Motion.

Tujuan utama proyek adalah menyederhanakan layanan warga agar proses administrasi lebih cepat, transparan, dan terdokumentasi.

## Arsitektur Tingkat Tinggi

```mermaid
flowchart LR
  W[Warga Web App] -->|JWT API| B[Backend API]
  A[Admin Web App] -->|JWT API| B
  B --> DB[(MySQL/TiDB)]
  B --> FS[(uploads/)]
```

## Tech Stack

### Frontend

- React 19
- Vite 8
- TypeScript
- TailwindCSS
- Axios
- Framer Motion
- React Router DOM

### Backend

- Express 5
- TypeScript
- TypeORM 0.3
- MySQL2
- JWT (`jsonwebtoken`)
- BcryptJS
- Multer (upload berkas)

## Struktur Proyek

```text
digidesa-project/
|-- backend/
|   |-- server.ts
|   |-- src/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   `-- lib/data-source.ts
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   `-- routes/
|   `-- package.json
`-- docs/
    |-- TRD.md
    |-- ERD.md
    |-- ROADMAP.md
    `-- WORKLOG.md
```

## Fitur yang Sudah Berjalan

### Auth & Session

- Register/login warga.
- Proteksi endpoint dengan JWT Bearer.
- Endpoint profile aktif.

### Onboarding Warga

- Warga mengisi data KK, status hubungan, status tinggal.
- Upload foto KTP/berkas.
- Data onboarding sekarang mencakup alamat + RT + RW (wajib) dan tersimpan ke database.

### Pengajuan Surat

- Warga ajukan surat berdasarkan jenis yang tersedia (SKD, SKU, SKTM).
- Domisili (alamat/RT/RW) pengajuan surat diambil otomatis dari database profil warga.
- Admin bisa melihat antrean dan memverifikasi (selesai/ditolak).

### Moderasi Laporan Warga

- Warga kirim laporan + bukti visual.
- Admin moderasi status laporan.
- Alur disederhanakan ke 2 role operasional: WARGA dan ADMIN.

### Data Penduduk

- Admin bisa tambah/edit/hapus data warga.
- Filter RT/RW dinamis berdasarkan data aktual di database.

### Keuangan

- Admin bisa mencatat pemasukan/pengeluaran, upload bukti, melihat ringkasan saldo.

### UX Admin

- Tombol logout tersedia dan aktif di seluruh halaman admin.

## API Utama (Aktif)

Base URL default: `http://localhost:5000`

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/profile`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/onboarding`

### Surat

- `POST /api/v1/surat/ajukan`
- `GET /api/v1/surat/riwayat`
- `GET /api/v1/surat/admin/antrean`
- `PUT /api/v1/surat/admin/verify/:id`

### Admin

- `GET /api/v1/admin/reports`
- `PATCH /api/v1/admin/reports/:id/status`
- `PATCH /api/v1/admin/reports/:id/progres`
- `GET /api/v1/admin/penduduk`
- `POST /api/v1/admin/penduduk`
- `PUT /api/v1/admin/penduduk/:id`
- `DELETE /api/v1/admin/penduduk/:id`
- `PUT /api/v1/admin/penduduk/verify/:id`
- `GET /api/v1/admin/finance`
- `POST /api/v1/admin/finance`
- `PUT /api/v1/admin/finance/:id`
- `DELETE /api/v1/admin/finance/:id`

### User (Warga)

- `POST /api/v1/user/pengaduan`
- `GET /api/v1/user/pengaduan/riwayat`

## Setup Lokal

### 1) Prasyarat

- Node.js LTS
- npm
- Database MySQL/TiDB

### 2) Konfigurasi Backend

Masuk folder backend dan install dependency:

```bash
cd backend
npm install
```

Buat file `.env` di folder backend:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DBNAME"
JWT_SECRET="ganti-dengan-secret-yang-aman"
PORT=5000
```

Jalankan backend:

```bash
npm run dev
```

### 3) Konfigurasi Frontend

Masuk folder frontend dan install dependency:

```bash
cd frontend
npm install
npm run dev
```

Frontend default di `http://localhost:5173`.

## Scripts

### Backend

- `npm run dev` - dev server dengan ts-node-dev
- `npm run build` - compile TypeScript
- `npm run start` - jalankan hasil build

### Frontend

- `npm run dev` - Vite dev server
- `npm run build` - build production
- `npm run preview` - preview hasil build
- `npm run lint` - linting

## Pengerjaan Terbaru (Yang Sudah Dikerjakan)

Bagian ini merangkum pekerjaan teknis terbaru yang sudah diterapkan pada proyek ini:

1. Perbaikan alur penduduk:
- Sinkronisasi relasi model user agar alur create/list penduduk stabil.
- Perbaikan parsing ID dan query param untuk menghindari error silent.

2. Perbaikan filter penduduk:
- Filter RT/RW dibuat dinamis dari data aktual database.
- Opsi filter otomatis hilang jika data wilayah sudah tidak ada.

3. Moderasi laporan disederhanakan:
- Alur operasional disederhanakan menjadi 2 role (WARGA + ADMIN).
- Penangan laporan tidak lagi bergantung pada pemilihan petugas terpisah.

4. Pengajuan surat diperketat:
- Alamat, RT, RW tidak diinput manual saat ajukan surat.
- Data domisili diambil otomatis dari profil warga di database.

5. Onboarding warga ditingkatkan:
- Form onboarding sekarang mewajibkan alamat, RT, dan RW.
- Backend onboarding menyimpan ketiga field tersebut ke data user.

6. UX admin:
- Tombol logout aktif ditambahkan/diaktifkan di semua halaman admin.

## Rencana Pengembangan (Roadmap Lanjutan)

1. Hardening data dan validasi:
- Centralized schema validation (Zod/Joi) di backend.
- Validasi format RT/RW/KK/NIK yang lebih ketat.

2. Keamanan dan role enforcement:
- Middleware RBAC per endpoint berbasis role final.
- Refresh token/session hardening.

3. Konsistensi API:
- Standarisasi bentuk response dan error code.
- Hilangkan endpoint legacy yang tidak terpakai.

4. Database production readiness:
- Migrasi TypeORM (gantikan `synchronize: true`).
- Penambahan index dan constraint untuk performa.

5. Fitur produk:
- Notifikasi status real-time (surat/laporan).
- Export data laporan/keuangan.
- Audit log aktivitas admin.

6. Kualitas pengembangan:
- Unit test + integration test untuk modul kritikal.
- CI pipeline (lint, build, test) sebelum merge.

## Prompt Chat Untuk Melanjutkan Progres

Copy prompt berikut untuk melanjutkan pengembangan secara terstruktur:

```text
Lanjutkan proyek DigiDesa dari kondisi terbaru.

Konteks penting:
- Stack: React + Vite + TypeScript (frontend), Express + TypeORM + MySQL/TiDB (backend).
- Fitur yang sudah beres: auth, onboarding warga (alamat/RT/RW wajib), pengajuan surat auto domisili dari DB, moderasi laporan 2 role, filter RT/RW dinamis, logout admin di semua halaman.

Tujuan sesi ini:
1) Audit bug/regresi terbaru dan perbaiki sampai build backend/frontend sukses.
2) Rapikan warning penting yang mempengaruhi maintainability.
3) Implement satu fitur prioritas berikut (pilih berdasarkan impact tertinggi):
   - RBAC middleware per endpoint admin
   - Validasi input terpusat (Zod/Joi)
   - Migrasi TypeORM awal (hapus ketergantungan synchronize)

Aturan kerja:
- Lakukan perubahan langsung pada kode, bukan hanya rencana.
- Setelah edit, jalankan build dan laporkan hasil ringkas.
- Berikan daftar file yang diubah + alasan perubahan.
- Jika ada blocker, jelaskan akar masalah dan solusi alternatif.
```

## Dokumen Pendukung

- [docs/TRD.md](docs/TRD.md)
- [docs/ERD.md](docs/ERD.md)
- [docs/ROADMAP.md](docs/ROADMAP.md)
- [docs/WORKLOG.md](docs/WORKLOG.md)
- [docs/PROMPTCHAT.md](docs/PROMPTCHAT.md)
- [docs/README.en.md](docs/README.en.md)
