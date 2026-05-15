# DigiDesa Project

Platform layanan desa terpadu (warga + RT/RW + admin desa) berbasis web.

## Status saat ini

**Sudah terimplementasi (jalan & build sukses):**
- Frontend: React + Vite + TypeScript + Tailwind, routing halaman dasar, UI Home & Login/Register.
- Backend: Express + TypeScript (CommonJS) + TypeORM (MySQL/TiDB Cloud), autentikasi JWT (`/api/v1/auth`).

**Dokumen lengkap:**
- TRD: `docs/TRD.md`
- ERD: `docs/ERD.md`
- Roadmap & fase pengerjaan: `docs/ROADMAP.md`
- Ringkasan pengerjaan (hari ini): `docs/WORKLOG.md`

---

## Struktur folder

```
.
├─ backend/
│  ├─ src/
│  │  ├─ index.ts                # entry Express + koneksi DB
│  │  ├─ lib/data-source.ts       # TypeORM DataSource (MySQL/TiDB)
│  │  ├─ models/User.ts           # Entity User
│  │  ├─ controllers/authController.ts
│  │  ├─ middleware/authMiddleware.ts
│  │  └─ routes/authRoutes.ts
│  ├─ dist/                       # output build (tsc)
│  ├─ tsconfig.json
│  └─ package.json
└─ frontend/
   ├─ src/
   │  ├─ App.tsx                  # React Router
   │  ├─ pages/                   # halaman warga & admin
   │  └─ components/
   ├─ vite.config.js
   └─ package.json
```

---

## Prasyarat

- Node.js (disarankan LTS terbaru)
- npm
- Akses DB MySQL/TiDB Cloud (punya `DATABASE_URL`)

---

## Menjalankan Backend (API)

Masuk ke folder backend:

```bash
cd backend
npm install
```

Buat file `backend/.env`:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DBNAME"
JWT_SECRET="ganti-dengan-random-string-yang-panjang"
PORT=5000
```

Jalankan mode development:

```bash
npm run dev
```

Jika berhasil, akan muncul log:
- `✅ Database Connected (TiDB Cloud)`
- `🚀 Server running on http://localhost:5000`

### Endpoint yang tersedia

Base URL: `http://localhost:5000`

- `GET /` → health check
- `POST /api/v1/auth/register` → daftar akun warga
- `POST /api/v1/auth/login` → login (mengembalikan JWT)
- `GET /api/v1/auth/me` → profile (butuh `Authorization: Bearer <token>`)

Contoh login via curl:

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"1234567890123456","password":"password"}'
```

---

## Menjalankan Frontend

Masuk ke folder frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend akan jalan di URL Vite (misal `http://localhost:5173`).

Catatan: koneksi API saat ini menggunakan konstanta `API_URL` di `frontend/src/pages/Login.tsx`:

```ts
const API_URL = "http://localhost:5000/api/v1/auth";
```

---

## Catatan implementasi penting

- Backend menggunakan TypeScript dengan `"type": "commonjs"` dan `tsconfig` `module: Node16` + `verbatimModuleSyntax: false`.
- Aplikasi backend baru `listen()` setelah DB berhasil `initialize()`, untuk mengurangi error 500/connection-race.
- Autentikasi memakai JWT 1 hari (`expiresIn: "1d"`).

---

## Next

Kalau kamu mau, aku bisa lanjutkan step berikutnya:
- Rapikan `App.tsx` (ada duplikasi route `/lapor`).
- Tambahkan modul berikutnya di backend (mis. CRUD penduduk / surat) sesuai roadmap.
- Siapkan migrasi TypeORM (matikan `synchronize` untuk production).
