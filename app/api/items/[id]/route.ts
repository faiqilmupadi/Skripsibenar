import { fail, ok } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { itemSchema } from '@/lib/validation';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(['KEPALA_GUDANG']);
    const parsed = itemSchema.safeParse(await req.json());
    if (!parsed.success) return fail('Payload tidak valid');
    const item = await prisma.item.update({ where: { id: Number(params.id) }, data: parsed.data });
    return ok(item);
  } catch {
    return fail('Unauthorized', 401);
  }
}
