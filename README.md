# Sistem Tampilan Pergudangan (Web)

Aplikasi Next.js App Router + MySQL (`mysql2/promise`) untuk Kepala Gudang dan Admin Gudang.

## Setup Lokal (tanpa Docker)
1. `npm install`
2. Isi env berikut di `.env.local`:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
3. Buat database MySQL kosong.
4. Jalankan migrasi 5 tabel real dataset:
   - `npm run db:migrate`
5. Import dataset excel (idempotent):
   - `npm run db:import -- ./dataset.xlsx`
6. Jalankan aplikasi:
   - `npm run dev`

## Tabel Real Dataset (wajib)
- `users`
- `material_master`
- `material_stock`
- `material_plant_data`
- `material_movement`

Semua kolom menggunakan camelCase sesuai mapping dataset pada script import.

## Arsitektur
- DB pool: `src/lib/db/mysql.ts`
- Query layer parameterized: `src/lib/db/queries.ts`
- Route tipis: `src/app/api/**/route.ts`
- Handler bisnis: `src/features/**/api/*.server.ts`
- Mapping UI: `src/features/**/utils/*mapper.ts`

## Catatan Login Password
Login mendukung dua format pada `users.password`:
- Hash bcrypt (`$2...`) -> `bcrypt.compare`
- Plain text -> dibandingkan langsung

Jadi dataset lama/plain text dan dataset hash tetap kompatibel.
