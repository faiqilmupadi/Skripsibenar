import { ok } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';

export async function GET() {
  await requireRole(['KEPALA_GUDANG', 'ADMIN_GUDANG']);
  const stock = await prisma.stock.findMany({ include: { item: true }, orderBy: { itemId: 'asc' } });
  return ok(
    stock.map((s) => ({
      ...s,
      ropAlert: s.freeStock <= s.item.rop
    }))
  );
}
