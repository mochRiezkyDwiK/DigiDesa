# Worklog (Ringkasan Pengerjaan)

## Hari ini

### Frontend
- Membereskan error TypeScript/lint yang membuat file "merah".
- Menyesuaikan typing Framer Motion v12 (easing/variants) agar build aman.
- Memperbaiki halaman login agar benar-benar terhubung ke backend:
  - Register → `POST /api/v1/auth/register`
  - Login → `POST /api/v1/auth/login` (simpan JWT ke `localStorage`)

### Backend
- Menstandarkan konfigurasi TypeScript agar aman dengan CommonJS:
  - `module: Node16`, `moduleResolution: Node16`
  - `verbatimModuleSyntax: false`
- Implementasi autentikasi end-to-end:
  - Controller register/login/me
  - Middleware JWT Bearer
  - Routing `/api/v1/auth/*`
- Membuat server hanya berjalan setelah koneksi DB berhasil (mengurangi error runtime).

### Catatan teknis
- Environment wajib:
  - `DATABASE_URL` (MySQL/TiDB Cloud)
  - `JWT_SECRET`
- Endpoint utama untuk pengecekan: `GET /` mengembalikan "API DigiDesa Running..."
