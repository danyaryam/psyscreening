# PsyScreening

PsyScreening adalah sistem screening awal kondisi kesehatan mental berbasis guided conversation, machine learning klasik, dan dashboard multi-role. Repository ini sekarang berisi:

- frontend React + Vite + Tailwind CSS
- backend Express + Prisma + PostgreSQL + JWT
- integrasi end-to-end dari auth, verifikasi email, Google OAuth, profile, screening chat, hasil screening, riwayat, dan admin dashboard

## Stack

- Frontend: React, Vite, React Router, Tailwind CSS, Axios, React Hook Form, Zod, Google OAuth
- Backend: Express.js, Prisma ORM, PostgreSQL, JWT, bcryptjs, Zod, Nodemailer, Google Auth Library
- ML integration: mock prediction service di backend, siap dihubungkan ke service eksternal

## Struktur Folder

```text
psyscreening/
  backend/
    prisma/
    src/
      config/
      controllers/
      lib/
      middleware/
      routes/
      services/
      utils/
  frontend/
    src/
      components/
      contexts/
      hooks/
      layouts/
      pages/
      routes/
      services/
      utils/
```

## Fitur Utama yang Sudah Terhubung ke API

- Register user baru dengan verifikasi email Mailtrap
- Login user/admin manual dengan pengecekan email verified
- Login/register menggunakan Google OAuth
- Get current user dari JWT
- Logout dengan invalid token handling
- Profile get/update
- Guided screening chat berbasis pertanyaan aktif dari database
- Submit jawaban screening ke backend
- Simpan hasil analisis screening
- Riwayat screening user
- Detail hasil screening
- Admin stats, user list, screening list
- Admin question management CRUD

## Seed Database dan Admin Development

Seed database sekarang dibuat bersih dan idempotent. Saat menjalankan seed di mode development, sistem membersihkan data runtime lokal seperti user non-admin, riwayat screening, jawaban, hasil, chat sessions, chat messages, dan admin logs. Setelah itu seed hanya membuat atau memperbarui data penting berikut:

- Admin utama: `adminganteng@gmail.com` / `Adminganjil13579`
- Daftar pertanyaan aktif untuk guided chat screening

Seed tidak lagi membuat user dummy, user testing, profile dummy, screening dummy, chat dummy, jawaban dummy, riwayat dummy, atau hasil screening dummy. Seed juga tidak menghapus `screening_questions`; daftar pertanyaan hanya dibuat atau diperbarui lewat upsert.

```bash
cd backend
npm run db:seed
```

Admin seed dibuat dengan `emailVerified=true`, `authProvider=local`, dan password selalu disimpan dalam bentuk hash bcrypt. Jika ingin mengganti admin development, isi `ADMIN_EMAIL` dan `ADMIN_PASSWORD` di `backend/.env`.

Jika ingin membersihkan database development secara eksplisit tanpa menjalankan seed, gunakan script cleanup development:

```bash
cd backend
npm run db:clean-dev
```

Script cleanup tidak menghapus `screening_questions`, sehingga daftar pertanyaan guided chat tetap aman. Setelah cleanup, menjalankan `npm run db:seed` juga tidak akan membuat ulang data dummy.

## Menjalankan PostgreSQL

Pilihan termudah adalah Docker:

```bash
docker compose up -d
```

Ini akan menyalakan PostgreSQL di `localhost:5432` dengan database `psyscreening`.

## Setup Backend

```bash
cd backend
npm install
copy .env.example .env
```

Jika memakai PowerShell:

```powershell
Copy-Item .env.example .env
```

Lalu jalankan:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Isi konfigurasi auth baru di `backend/.env` sebelum mencoba register manual atau Google OAuth:

```env
FRONTEND_URL="http://localhost:5173"
MAILTRAP_HOST="sandbox.smtp.mailtrap.io"
MAILTRAP_PORT=2525
MAILTRAP_USER="username_mailtrap_anda"
MAILTRAP_PASS="password_mailtrap_anda"
MAIL_FROM="PsyScreening <no-reply@psyscreening.local>"
GOOGLE_CLIENT_ID="google_client_id_anda"
ADMIN_EMAIL=adminganteng@gmail.com
ADMIN_PASSWORD=Adminganjil13579
```

Jangan taruh `DATABASE_URL`, `JWT_SECRET`, `MAILTRAP_USER`, atau `MAILTRAP_PASS` di frontend.

Untuk membersihkan data dummy/testing pada database lokal development:

```bash
cd backend
npm run db:clean-dev
```

Script ini hanya boleh berjalan ketika `NODE_ENV` bukan `production`.

Backend akan berjalan di:

- [http://localhost:5000](http://localhost:5000)
- health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

## Setup Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Jika memakai PowerShell:

```powershell
Copy-Item .env.example .env
```

Frontend akan berjalan di:

- [http://localhost:5173](http://localhost:5173)

Pastikan `VITE_USE_MOCK_API=false` agar frontend memakai API asli.

Untuk tombol Google, isi `frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=google_client_id_anda
```

Nilai Google Client ID di frontend harus sama dengan `GOOGLE_CLIENT_ID` di backend.

## Menjalankan dari Root

Script root yang tersedia:

```bash
npm install
npm run setup
npm run db:migrate
npm run db:seed
npm run dev
```

Atau jika ingin menjalankan satuan:

```bash
npm run install:backend
npm run install:frontend
npm run stop:dev
npm run dev:fresh
npm run dev:backend
npm run dev:frontend
npm run build:frontend
npm run prisma:generate
npm run db:migrate
npm run db:seed
```

Membersihkan database development dari root bisa dilakukan dengan:

```bash
npm --prefix backend run db:clean-dev
```

Setelah cleanup, cek hasilnya dengan login admin:

```text
Email: adminganteng@gmail.com
Password: Adminganjil13579
```

Hal yang seharusnya terlihat setelah cleanup:

- daftar user testing dan dummy kosong
- riwayat screening, chat sessions, chat messages, answers, results kosong
- hanya ada satu akun admin utama
- pertanyaan screening di halaman admin tetap tersedia
- register/login manual tetap berjalan untuk user baru
- login Google tetap berjalan jika `GOOGLE_CLIENT_ID` sudah dikonfigurasi

Dengan ini Anda tidak perlu masuk manual ke folder `frontend` atau `backend` hanya untuk menjalankan perintah harian.

Jika muncul error port seperti `EADDRINUSE` atau Vite pindah ke `5174`, biasanya masih ada server lama yang belum berhenti. Jalankan:

```bash
npm run dev
```

Script `npm run dev` sekarang otomatis membersihkan proses dev PsyScreening lama sebelum menyalakan backend dan frontend lagi.

## Endpoint Backend

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/verify-email?token=...`
- `POST /api/auth/resend-verification`
- `POST /api/auth/google`
- `GET /api/auth/me`

### User

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users/history`

### Screening

- `POST /api/screenings/start`
- `POST /api/screenings/answer`
- `POST /api/screenings/submit`
- `GET /api/screenings`
- `GET /api/screenings/:id`

### Admin

- `GET /api/admin/users`
- `GET /api/admin/users/:id`
- `GET /api/admin/screenings`
- `GET /api/admin/stats`
- `GET /api/admin/questions`
- `POST /api/admin/questions`
- `PUT /api/admin/questions/:id`
- `DELETE /api/admin/questions/:id`

## Integrasi ML

Backend memiliki `mlService` dengan dua mode:

- `mock`: scoring dan insight dihasilkan langsung di backend
- `remote`: siap memanggil prediction service eksternal melalui `ML_SERVICE_URL`

## Alur Auth Email dan Google

Register manual:

1. User mengisi nama, email, dan password.
2. Backend membuat user dengan `emailVerified=false`.
3. Backend mengirim link verifikasi ke Mailtrap.
4. User membuka link `/verify-email?token=...` dari email.
5. Frontend memanggil `GET /api/auth/verify-email`.
6. Setelah berhasil, backend mengembalikan JWT dan frontend langsung mengarahkan user ke dashboard.
7. Jika link tidak valid atau sudah pernah dipakai, user dapat meminta link baru dari halaman verifikasi atau login.

Google OAuth:

1. Frontend mengambil credential Google memakai `@react-oauth/google`.
2. Credential dikirim ke `POST /api/auth/google`.
3. Backend memvalidasi ID token dengan `google-auth-library`.
4. Jika email Google verified, user dibuat atau dihubungkan ke email yang sudah ada.
5. Backend mengembalikan JWT yang dipakai protected routes seperti login manual.

## Testing Manual Auth Baru

1. Register manual dengan email baru.
2. Cek inbox Mailtrap untuk link verifikasi.
3. Coba login sebelum verifikasi dan pastikan ditolak.
4. Klik link verifikasi dan pastikan user otomatis masuk dashboard.
5. Jika link kedaluwarsa atau sudah pernah digunakan, coba tombol kirim ulang verifikasi dari halaman login atau verify email.
6. Isi `GOOGLE_CLIENT_ID` dan `VITE_GOOGLE_CLIENT_ID`, lalu coba login/register Google.

## Catatan Verifikasi

Yang sudah saya verifikasi di workspace ini:

- frontend berhasil build production
- backend app module berhasil di-load tanpa error import runtime
- Prisma client berhasil di-generate
- migration Prisma lokal berhasil dijalankan
