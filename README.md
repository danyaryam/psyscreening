# PsyScreening

PsyScreening adalah sistem screening awal kondisi kesehatan mental berbasis guided conversation, machine learning klasik, dan dashboard multi-role. Repository ini sekarang berisi:

- frontend React + Vite + Tailwind CSS
- backend Express + Prisma + PostgreSQL + JWT
- integrasi end-to-end dari auth, profile, screening chat, hasil screening, riwayat, dan admin dashboard

## Stack

- Frontend: React, Vite, React Router, Tailwind CSS, Axios, React Hook Form, Zod
- Backend: Express.js, Prisma ORM, PostgreSQL, JWT, bcryptjs, Zod
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

- Register user baru
- Login user/admin
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

## Akun Seed

Setelah database di-seed:

- Admin: `admin@psyscreening.id` / `Admin123!`
- User: `dina@psyscreening.id` / `User123!`
- User lain: `arya@psyscreening.id` / `User123!`

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

## Catatan Verifikasi

Yang sudah saya verifikasi di workspace ini:

- frontend berhasil build production
- backend app module berhasil di-load tanpa error import runtime
- Prisma client berhasil di-generate

Yang belum saya jalankan penuh di workspace ini:

- `prisma migrate dev`
- `db:seed`
- server + database end-to-end live

Dua langkah itu masih memerlukan PostgreSQL aktif dan `DATABASE_URL` yang valid di `backend/.env`.
