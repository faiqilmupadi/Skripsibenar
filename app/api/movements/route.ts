import { MovementType } from '@prisma/client';
import { fail, ok } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { outboundSchema, returnBlockedSchema } from '@/lib/validation';
import { applyStockChange } from '@/server/stock';

export async function GET(req: Request) {
  await requireRole(['KEPALA_GUDANG', 'ADMIN_GUDANG']);
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const userId = searchParams.get('userId');
  const itemId = searchParams.get('itemId');
  const type = searchParams.get('type') as MovementType | null;

  const data = await prisma.movement.findMany({
    where: {
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {})
            }
          }
        : {}),
      ...(userId ? { userId: Number(userId) } : {}),
      ...(itemId ? { itemId: Number(itemId) } : {}),
      ...(type ? { type } : {})
    },
    include: { user: true, item: true },
    orderBy: { createdAt: 'desc' }
  });

  return ok(data);
}

export async function POST(req: Request) {
  try {
    const user = await requireRole(['ADMIN_GUDANG']);
    const body = await req.json();
    const mode = body.mode as 'OUTBOUND' | 'RETURN';

    if (mode === 'OUTBOUND') {
      const parsed = outboundSchema.safeParse(body);
      if (!parsed.success) return fail('Payload outbound tidak valid');
      await prisma.$transaction((tx) =>
        applyStockChange(tx, {
          itemId: parsed.data.itemId,
          userId: user.id,
          freeDelta: -parsed.data.qty,
          blockedDelta: 0,
          type: 'OUTBOUND',
          note: parsed.data.note,
          customerName: parsed.data.customerName
        })
      );
    } else if (mode === 'RETURN') {
      const parsed = returnBlockedSchema.safeParse(body);
      if (!parsed.success) return fail('Payload return tidak valid');
      await prisma.$transaction((tx) =>
        applyStockChange(tx, {
          itemId: parsed.data.itemId,
          userId: user.id,
          freeDelta: 0,
          blockedDelta: -parsed.data.qty,
          type: 'RETURN',
          note: parsed.data.note
        })
      );
    } else {
      return fail('Mode tidak dikenal');
    }

    return ok({ message: 'Movement berhasil dicatat' });
  } catch (e) {
    return fail((e as Error).message, 400);
  }
}
