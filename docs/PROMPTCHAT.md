# Prompt Chat Lanjutan DigiDesa

Gunakan prompt berikut untuk melanjutkan progres pengembangan:

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

## Versi Fokus Backend

```text
Fokus sesi ini hanya backend DigiDesa.

Tugas:
1) Audit endpoint auth, onboarding, surat, laporan, penduduk.
2) Samakan format response API (success, message, data, errorCode opsional).
3) Tambahkan validasi input terpusat untuk endpoint yang paling sering dipakai.
4) Pastikan build backend sukses.

Output yang diminta:
- Ringkasan bug yang diperbaiki.
- File yang diubah.
- Hasil build backend.
```

## Versi Fokus Frontend

```text
Fokus sesi ini hanya frontend DigiDesa.

Tugas:
1) Audit halaman admin dan warga untuk regression UX.
2) Rapikan warning lint yang berdampak ke maintainability.
3) Pastikan flow onboarding dan pengajuan surat konsisten dengan API terbaru.
4) Pastikan build frontend sukses.

Output yang diminta:
- Ringkasan perubahan UI/UX.
- File yang diubah.
- Hasil build frontend.
```
