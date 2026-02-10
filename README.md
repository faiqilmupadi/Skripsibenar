# Sistem Tampilan Pergudangan (Web)

Aplikasi Next.js App Router + MySQL (`mysql2/promise`) untuk Kepala Gudang dan Admin Gudang.

## Setup Lokal (tanpa Docker)
1. `npm install`
2. Isi `.env.local`:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
3. Buat database MySQL kosong.
4. Jalankan schema utama: `npm run db:migrate`
5. Jika DB lama sudah ada, jalankan alter alignment:
   - `mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME < scripts/migration_20260210_align_dataset.sql`
6. Import Excel idempotent: `npm run db:import -- ./dataset.xlsx`
7. Jalankan aplikasi: `npm run dev`

## Tabel dataset (wajib, tanpa tabel tambahan)
- `users`
- `material_master`
- `material_stock`
- `material_plant_data`
- `material_movement`

## Aturan data penting
- Kolom DB camelCase.
- `movementType` hanya boleh: `101`, `261`, `Z48`.
- Import Excel akan skip row movement selain tiga nilai itu.
- Kolom desimal presisi 3 digit:
  - `material_stock.freeStock`, `material_stock.blocked`
  - `material_plant_data.reorderPoint`, `material_plant_data.safetyStock`
- UI menggunakan mapper layer, tidak memakai raw DB column langsung.

## Arsitektur
- DB pool: `src/lib/db/mysql.ts`
- Query layer: `src/lib/db/queries.ts`
- Route tipis: `src/app/api/**/route.ts`
- Handler bisnis: `src/features/**/api/*.server.ts`
- Validation schema: `src/features/**/schemas/*.ts`

## Catatan login password
Login mendukung dua format pada `users.password`:
- Hash bcrypt (`$2...`) -> `bcrypt.compare`
- Plain text -> dibandingkan langsung
