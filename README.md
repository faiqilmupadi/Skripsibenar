# Sistem Tampilan Pergudangan (Web)

Aplikasi Next.js App Router + React + TypeScript + MySQL (`mysql2/promise`) tanpa Docker.

## Setup Lokal
1. Install dependency:
   - `npm install`
2. Buat file `.env.local`:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
3. Buat database MySQL kosong, lalu buat struktur tabel:
   - `npm run db:migrate`
4. Jika database lama masih pakai kolom `material`/`movementId`, jalankan migration alignment:
   - `mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME < scripts/migrations/001_align_dataset.sql`
5. Import Excel real dataset:
   - `npm run db:import -- ./dataset.xlsx`
5. Jalankan aplikasi:
   - `npm run dev`

## Tabel Wajib (5 tabel)
- `users`
- `material_master`
- `material_stock`
- `material_plant_data`
- `material_movement`

## Mapping Dataset ke Kolom MySQL (camelCase)
- `users`: `userId`, `username`, `email`, `password`, `role`, `createdOn`, `lastChange`
- `material_master`: `partNumber`, `materialDescription`, `baseUnitOfMeasure`, `createdOn`, `createTime`, `createdBy`, `materialGroup`
- `material_stock`: `partNumber`, `freeStock`, `plant`, `blocked`
- `material_plant_data`: `partNumber`, `plant`, `reorderPoint`, `safetyStock`
- `material_movement`: `partNumber`, `plant`, `materialDescription`, `postingDate`, `movementType`, `orderNo`, `purchaseOrder`, `quantity`, `baseUnitOfMeasure`, `amtInLocCur`, `userName`

## Arsitektur Inti
- Pool MySQL: `src/lib/db/mysql.ts`
- Query helper ter-parameter: `src/lib/db/queries.ts`
- API route tipis: `src/app/api/**/route.ts`
- Handler server: `src/features/**/api/**/*.server.ts`
- UI mapper: `src/features/**/utils/*.mapper.ts`

## Catatan Login Password
`users.password` mendukung dua format:
- bcrypt hash (`$2...`) -> `bcrypt.compare`
- plaintext -> dibandingkan langsung
