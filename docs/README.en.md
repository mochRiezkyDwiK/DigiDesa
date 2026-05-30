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
- Indonesia: [../README.md](../README.md)
- English: [README.en.md](README.en.md)

A web-based village administration platform with two main portals:

- Citizen Portal: onboarding, letter requests, reporting, status dashboard.
- Admin Portal: report moderation, letter verification, population data, finance, settings.

## Project Overview

DigiDesa is organized as a 2-app monorepo:

- Backend API: Express + TypeScript + TypeORM + MySQL/TiDB.
- Frontend Web: React + Vite + TypeScript + Tailwind + Framer Motion.

The main goal is to simplify public service workflows so village administration becomes faster, transparent, and well documented.

## High-Level Architecture

```mermaid
flowchart LR
  C[Citizen Web App] -->|JWT API| B[Backend API]
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
- JWT (jsonwebtoken)
- BcryptJS
- Multer

## Project Structure

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
    |-- WORKLOG.md
    `-- PROMPTCHAT.md
```

## Implemented Features

### Authentication & Session

- Citizen register/login.
- JWT Bearer protection for secured endpoints.
- Active profile endpoints.

### Citizen Onboarding

- Citizen fills in family-card number, relationship status, residency status.
- KTP/document upload.
- Onboarding now requires and stores address + RT + RW.

### Letter Request Workflow

- Citizens can submit supported letter types (SKD, SKU, SKTM).
- Address/RT/RW for letter request is automatically taken from citizen profile in database.
- Admin can review queue and verify (approved/rejected).

### Citizen Report Moderation

- Citizens submit reports with optional visual evidence.
- Admin moderates report status.
- Operational flow simplified to 2 roles: CITIZEN and ADMIN.

### Population Management

- Admin can create/edit/delete citizen records.
- RT/RW filter is dynamic based on real database data.

### Finance Module

- Admin can add income/expense, upload proof, and monitor summaries.

### Admin UX

- Functional logout button is available across all admin pages.

## Active API Endpoints

Base URL: `http://localhost:5000`

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/profile`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/onboarding`

### Letters

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

### Citizen

- `POST /api/v1/user/pengaduan`
- `GET /api/v1/user/pengaduan/riwayat`

## Local Setup

### Prerequisites

- Node.js LTS
- npm
- MySQL/TiDB database

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DBNAME"
JWT_SECRET="your-secure-secret"
PORT=5000
```

Run backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`.

## Scripts

### Backend

- `npm run dev`
- `npm run build`
- `npm run start`

### Frontend

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Recent Completed Work

1. Population flow fixes:
- Restored model relation consistency to stabilize create/list behavior.
- Improved ID/query parsing to prevent silent runtime issues.

2. Dynamic RT/RW filtering:
- Filter options now come from actual database data.
- Invalid options disappear automatically when data is removed.

3. Report moderation simplification:
- Operational workflow simplified to 2 roles (CITIZEN + ADMIN).
- No separate handler assignment dependency for moderation.

4. Letter request hardening:
- Address/RT/RW no longer manually entered in request flow.
- Domicile data now comes from citizen profile in database.

5. Onboarding enhancement:
- Onboarding now requires address + RT + RW.
- Backend persists those fields into user profile.

6. Admin UX improvement:
- Functional logout enabled in all admin pages.

## Development Plan

1. Data hardening and validation:
- Centralized validation (Zod/Joi) in backend.
- Stricter format validation for RT/RW/KK/NIK.

2. Security and authorization:
- Strict RBAC middleware per protected endpoint.
- Session hardening and token lifecycle improvements.

3. API consistency:
- Standardized success/error response format.
- Remove unused legacy endpoints.

4. Production database readiness:
- Introduce TypeORM migrations (replace `synchronize: true`).
- Add indexes and constraints for reliability and performance.

5. Product features:
- Real-time status notifications.
- Export capabilities for reports/finance.
- Admin audit logging.

6. Engineering quality:
- Unit and integration tests for critical modules.
- CI pipeline for lint/build/test gates.

## Prompt Chat to Continue Progress

Use the continuation prompt from:

- [PROMPTCHAT.md](PROMPTCHAT.md)

## Related Documents

- [TRD.md](TRD.md)
- [ERD.md](ERD.md)
- [ROADMAP.md](ROADMAP.md)
- [WORKLOG.md](WORKLOG.md)
- [PROMPTCHAT.md](PROMPTCHAT.md)
