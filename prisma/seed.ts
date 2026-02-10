import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const kepalaPassword = await bcrypt.hash('kepala123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { username: 'kepala' },
    update: {},
    create: {
      name: 'Kepala Gudang',
      username: 'kepala',
      passwordHash: kepalaPassword,
      role: 'KEPALA_GUDANG'
    }
  });

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Admin Gudang',
      username: 'admin',
      passwordHash: adminPassword,
      role: 'ADMIN_GUDANG'
    }
  });

  const seedItems = [
    { code: 'A-001', name: 'Oli Mesin', unit: 'Botol', price: 120000, rop: 15 },
    { code: 'A-002', name: 'Filter Oli', unit: 'Pcs', price: 45000, rop: 20 },
    { code: 'A-003', name: 'Kampas Rem', unit: 'Set', price: 350000, rop: 8 }
  ];

  for (const it of seedItems) {
    const item = await prisma.item.upsert({
      where: { code: it.code },
      update: {},
      create: it
    });
    await prisma.stock.upsert({
      where: { itemId: item.id },
      update: {},
      create: { itemId: item.id, freeStock: 30, blockedStock: 2 }
    });
  }
}

main().finally(() => prisma.$disconnect());
