import { fail, ok } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { itemSchema } from '@/lib/validation';

export async function GET() {
  await requireRole(['KEPALA_GUDANG']);
  const items = await prisma.item.findMany({ orderBy: { id: 'desc' } });
  return ok(items);
}

export async function POST(req: Request) {
  try {
    await requireRole(['KEPALA_GUDANG']);
    const parsed = itemSchema.safeParse(await req.json());
    if (!parsed.success) return fail('Payload tidak valid');
    const item = await prisma.item.create({ data: parsed.data });
    await prisma.stock.create({ data: { itemId: item.id } });
    return ok(item);
  } catch {
    return fail('Unauthorized', 401);
  }
}
