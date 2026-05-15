# Roadmap & Fase Pengerjaan (DigiDesa)

Roadmap ini memetakan pengerjaan bertahap dari MVP sampai siap produksi.

## Fase 0 — Fondasi (selesai / sudah berjalan)

Deliverables:
- Setup frontend (React + Vite + TS + Tailwind)
- Setup backend (Express + TS CommonJS)
- Koneksi DB (TypeORM + TiDB/MySQL) dan bootstrap yang aman
- Auth JWT + middleware `Bearer`

Kriteria selesai:
- API `POST /auth/register`, `POST /auth/login`, `GET /auth/me` berjalan stabil
- Frontend bisa register/login dan menyimpan token

## Fase 1 — RBAC + Struktur API

Deliverables:
- Standarisasi response API & error handling
- Role-based access control (middleware/guard per role)
- Konvensi penamaan endpoint untuk modul-modul berikutnya
- Konfigurasi CORS yang lebih terkontrol (origin whitelist)

Kriteria selesai:
- Endpoint admin tidak bisa diakses user non-admin

## Fase 2 — Layanan Surat (workflow dasar)

Deliverables:
- CRUD `letter_types`
- Create & list `letter_requests` oleh warga
- Validasi/approval berjenjang (RT → RW → Admin)
- Status tracking + catatan penolakan

Kriteria selesai:
- Warga bisa mengajukan, RT/RW/Admin bisa memproses, status terbaca di dashboard

## Fase 3 — Laporan Warga + Pengumuman

Deliverables:
- CRUD `reports` (warga) + status tindak lanjut (RT/RW/Admin)
- Attachment upload (opsional, bisa fase 4)
- CRUD `announcements` (admin) + publikasi

Kriteria selesai:
- Ada alur end-to-end: warga melapor, admin menindak, warga melihat status

## Fase 4 — Keuangan/Finansial

Deliverables:
- CRUD `finance_entries`
- Rekap periodik + export (opsional)
- Hak akses berdasarkan scope (RT/RW/DESA)

Kriteria selesai:
- Data keuangan bisa dicatat dan ditampilkan ringkas per periode

## Fase 5 — Hardening & Production Readiness

Deliverables:
- Migrations TypeORM (matikan `synchronize`)
- Validasi input (Zod/Joi) di backend
- Rate limiting + security headers
- Audit log untuk aksi penting
- CI (lint/build) + deployment plan

Kriteria selesai:
- Deployable, aman, dan mudah di-maintain
