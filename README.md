# Sistem Tampilan Pergudangan (Web)

Aplikasi fullstack Next.js + MySQL untuk Kepala Gudang dan Admin Gudang.

## Setup cepat
1. `npm install`
2. Salin env: `cp .env.example .env`
3. Buat database MySQL manual, misal `warehouse_db`
4. Jalankan migrasi SQL: `mysql -u root -p warehouse_db < scripts/schema.sql`
5. Seed data demo: `npm run db:seed`
6. Jalankan app: `npm run dev`

## Akun default
- Kepala Gudang: `kepala` / `password123`
- Admin Gudang: `admin1` / `password123`, `admin2` / `password123`

## Struktur
Semua page tipis di `src/app/**/page.tsx` dan route handler tipis di `src/app/api/**/route.ts`.
Logic utama ada di `src/features/**` dan `src/lib/**`.
