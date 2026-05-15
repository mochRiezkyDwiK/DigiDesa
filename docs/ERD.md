# ERD — Entity Relationship Diagram (DigiDesa)

Dokumen ini memuat ERD **current (sudah ada)** dan **target (rencana)**.

> Catatan: bagian **Target (Rencana)** adalah proposal desain agar mudah dikembangkan sesuai halaman yang sudah ada di frontend. Ini belum semua terimplementasi di backend.

---

## A) Current (Sudah ada di backend)

### Entity: `User`

```mermaid
erDiagram
  User {
    int id PK
    string nik "unique"
    string nama_lengkap
    string username "unique"
    string password "bcrypt hash"
    string no_hp
    string role "WARGA|RT|RW|ADMIN_DESA"
    datetime created_at
  }
```

---

## B) Target (Rencana keseluruhan)

Tujuan rancangan:
- Memisahkan “akun login” (`users`) dari data kependudukan (`residents`) bila dibutuhkan.
- Menyediakan workflow surat (approval RT/RW/Admin) dan pelacakan status.
- Mendukung modul laporan warga, keuangan, pengumuman, dan audit.

```mermaid
erDiagram
  users {
    int id PK
    string nik "unique"
    string nama_lengkap
    string username "unique"
    string password
    string no_hp
    string role
    datetime created_at
  }

  residents {
    int id PK
    string nik "unique"
    string nama_lengkap
    string alamat
    string rt
    string rw
    string dusun
    string desa
    string kecamatan
    string kabupaten
    string provinsi
    datetime created_at
  }

  letter_types {
    int id PK
    string code "unique"
    string name
    bool is_active
  }

  letter_requests {
    int id PK
    int user_id FK
    int letter_type_id FK
    string status "DIAJUKAN|VERIF_RT|VERIF_RW|APPROVE_ADMIN|DITOLAK|SELESAI"
    string note_warga
    string note_verifikator
    datetime created_at
    datetime updated_at
  }

  letter_approvals {
    int id PK
    int letter_request_id FK
    int approver_user_id FK
    string approver_role
    string decision "APPROVE|REJECT"
    string note
    datetime created_at
  }

  reports {
    int id PK
    int user_id FK
    string category
    string title
    string description
    string status "OPEN|IN_PROGRESS|RESOLVED|REJECTED"
    datetime created_at
    datetime updated_at
  }

  report_attachments {
    int id PK
    int report_id FK
    string url
    string mime
    int size
    datetime created_at
  }

  finance_entries {
    int id PK
    string scope "RT|RW|DESA"
    string type "INCOME|EXPENSE"
    string title
    decimal amount
    date trx_date
    string note
    int created_by_user_id FK
    datetime created_at
  }

  announcements {
    int id PK
    string title
    string content
    string audience "WARGA|RT|RW|ALL"
    bool is_published
    int created_by_user_id FK
    datetime created_at
  }

  audit_logs {
    int id PK
    int user_id FK
    string action
    string entity
    int entity_id
    string metadata_json
    datetime created_at
  }

  users ||--o| residents : "optional link"
  users ||--o{ letter_requests : submits
  letter_types ||--o{ letter_requests : defines
  letter_requests ||--o{ letter_approvals : has
  users ||--o{ letter_approvals : approves

  users ||--o{ reports : creates
  reports ||--o{ report_attachments : has

  users ||--o{ finance_entries : creates
  users ||--o{ announcements : creates
  users ||--o{ audit_logs : writes
```

### Catatan desain

- `users` sudah ada (implemented). Tabel lain adalah target implementasi.
- Untuk produksi:
  - Tambahkan index pada kolom FK (`user_id`, `letter_type_id`, dst.).
  - Pertimbangkan soft delete untuk entitas penting.
  - Pertimbangkan normalisasi wilayah (master RT/RW) bila skala besar.
