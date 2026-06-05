# PsyScreening Frontend

Frontend aplikasi **PsyScreening** dibangun menggunakan React, Vite, dan Tailwind CSS. Folder ini sudah disiapkan agar bisa berjalan dalam 2 mode:

- `real API mode`: frontend memakai REST API backend melalui `VITE_API_BASE_URL`.
- `mock mode`: opsional untuk fallback pengembangan bila `VITE_USE_MOCK_API=true`.

## Menjalankan

```bash
cd frontend
npm install
npm run dev
```

## Build Production

```bash
npm run build
npm run preview
```

## Environment

Salin `.env.example` menjadi `.env` lalu sesuaikan:

```bash
cp .env.example .env
```

- `VITE_API_BASE_URL`: base URL backend Express
- `VITE_USE_MOCK_API`: `false` untuk backend asli, `true` jika ingin fallback ke mock mode

## Akun Mock

- Admin: `admin@psyscreening.id` / `Admin123!`
- User: `dina@psyscreening.id` / `User123!`

## Fitur Utama Frontend

- Landing page health-tech modern
- Login dan register
- Protected routes berbasis role
- Dashboard user dan admin
- Guided screening chat
- Riwayat dan detail hasil screening
- Manajemen pertanyaan screening untuk admin
- Dark mode

## Deploy

### Vercel

- Import folder `frontend`
- Framework preset: `Vite`
- Tambahkan environment variables sesuai file `.env`
- File `vercel.json` sudah disiapkan untuk SPA routing

### Netlify

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- File `netlify.toml` sudah disiapkan untuk SPA routing

## Catatan

Frontend ini sudah disiapkan untuk integrasi backend sesuai kontrak endpoint REST. Saat backend selesai, cukup nonaktifkan mock mode.
