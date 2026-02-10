import { fail, ok } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { receiveQcSchema } from '@/lib/validation';
import { receiveQcOrder } from '@/server/orders';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(['ADMIN_GUDANG']);
    const parsed = receiveQcSchema.safeParse(await req.json());
    if (!parsed.success) return fail('Payload tidak valid');
    await prisma.$transaction((tx) =>
      receiveQcOrder(tx, { orderId: Number(params.id), userId: user.id, lines: parsed.data.lines })
    );
    return ok({ message: 'QC berhasil' });
  } catch (e) {
    return fail((e as Error).message, 400);
  }
}
