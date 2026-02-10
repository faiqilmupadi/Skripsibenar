# Sistem Tampilan Pergudangan (Web)

Aplikasi Next.js App Router + React + TypeScript + MySQL (`mysql2/promise`) untuk Kepala Gudang dan Admin Gudang.

## Setup Lokal (tanpa Docker)
1. `npm install`
2. Buat `.env.local`:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
3. Buat database MySQL kosong, lalu jalankan schema exact:
   - `npm run db:migrate`
4. Import data Excel real dataset:
   - `npm run db:import -- ./dataset.xlsx`
5. Jalankan aplikasi:
   - `npm run dev`

## Exact schema (5 tabel wajib)
- `users`
- `material_master`
- `material_stock`
- `material_plant_data`
- `material_movement`

Schema SQL tersedia di:
- `scripts/schema.sql`
- `scripts/migrations/001_exact_schema.sql`

## Validasi import Excel
Script `scripts/seed.ts` menerapkan aturan berikut:
- `movementType` hanya boleh `{101,261,Z48}`. Nilai lain akan di-skip dan di-log.
- Normalisasi integer untuk `freeStock`, `blocked`, `reorderPoint`, `safetyStock` dengan parse float lalu `Math.round` (`2.000 -> 2`).
- Semua insert menggunakan nama kolom exact schema (`partNumber`, `freeStock`, dll).

## Arsitektur
- DB pool: `src/lib/db/mysql.ts`
- Query layer parameterized: `src/lib/db/queries.ts`
- Thin routes: `src/app/api/**/route.ts`
- Server handlers: `src/features/**/api/*.server.ts`
- Zod schemas: `src/features/**/schemas/*.ts`

## Catatan autentikasi
Login kompatibel dengan dua format `users.password`:
- bcrypt hash (`$2...`) -> `bcrypt.compare`
- plain text -> direct compare
