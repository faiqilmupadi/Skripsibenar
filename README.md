# Warehouse Display System - PT Auto2000 Yasmin Bogor

Aplikasi dashboard inventory berbasis Next.js + Prisma + MySQL untuk:
- FSN classification
- ROP alert
- history movement/order
- analytics dashboard

## Quick Start

```bash
cp .env.example .env
docker compose up -d
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Login awal (seed)
- Kepala Gudang: `kepala` / `kepala123`
- Admin Gudang: `admin` / `admin123`

## Struktur
- `app/`: halaman dan API route handler
- `components/`: komponen UI
- `lib/`: auth, prisma, validasi, utilities
- `server/`: business logic domain
- `prisma/`: schema dan seed
- `tests/`: unit tests

## Endpoint utama
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET/POST /api/users`
- `GET/POST /api/items`
- `GET /api/stock`
- `GET/POST /api/orders`
- `POST /api/orders/:id/receive-qc`
- `GET/POST /api/movements`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/fsn`
- `GET /api/export/movements.xlsx`

## Konfigurasi MySQL
Ubah `DATABASE_URL` di `.env` sesuai host/user/password database Anda.
