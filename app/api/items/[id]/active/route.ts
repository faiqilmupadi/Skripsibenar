import { fail, ok } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(['KEPALA_GUDANG']);
    const { isActive } = await req.json();
    const item = await prisma.item.update({ where: { id: Number(params.id) }, data: { isActive } });
    return ok(item);
  } catch {
    return fail('Unauthorized', 401);
  }
}
