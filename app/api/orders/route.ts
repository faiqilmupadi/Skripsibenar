import { fail, ok } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { createOrderSchema } from '@/lib/validation';

export async function GET(req: Request) {
  await requireRole(['KEPALA_GUDANG', 'ADMIN_GUDANG']);
  const status = new URL(req.url).searchParams.get('status') as 'PENDING' | 'RECEIVED' | 'CANCELLED' | null;
  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { creator: true, items: { include: { item: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return ok(orders);
}

export async function POST(req: Request) {
  try {
    const user = await requireRole(['ADMIN_GUDANG']);
    const parsed = createOrderSchema.safeParse(await req.json());
    if (!parsed.success) return fail('Payload tidak valid');
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({ data: { createdBy: user.id, status: 'PENDING' } });
      await tx.orderItem.createMany({
        data: parsed.data.items.map((i) => ({ orderId: created.id, itemId: i.itemId, qtyOrdered: i.qtyOrdered }))
      });
      await tx.movement.createMany({
        data: parsed.data.items.map((i) => ({
          itemId: i.itemId,
          userId: user.id,
          type: 'ORDER_CREATED',
          qtyFreeDelta: 0,
          qtyBlockedDelta: 0,
          note: `Order #${created.id} dibuat qty ${i.qtyOrdered}`
        }))
      });
      return created;
    });
    return ok(order);
  } catch {
    return fail('Unauthorized', 401);
  }
}
