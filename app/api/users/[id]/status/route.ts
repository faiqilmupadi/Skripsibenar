import { fail, ok } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(['KEPALA_GUDANG']);
    const { status } = await req.json();
    const updated = await prisma.user.update({ where: { id: Number(params.id) }, data: { status } });
    return ok(updated);
  } catch {
    return fail('Unauthorized', 401);
  }
}
