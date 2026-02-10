import { OrderStatus, Prisma } from '@prisma/client';
import { applyStockChange } from './stock';

export async function receiveQcOrder(
  tx: Prisma.TransactionClient,
  params: {
    orderId: number;
    userId: number;
    lines: { orderItemId: number; qtyGood: number; qtyBad: number }[];
  }
) {
  const order = await tx.order.findUnique({
    where: { id: params.orderId },
    include: { items: true }
  });
  if (!order) throw new Error('Order tidak ditemukan');
  if (order.status === OrderStatus.CANCELLED) throw new Error('Order dibatalkan');

  for (const line of params.lines) {
    const item = order.items.find((i) => i.id === line.orderItemId);
    if (!item) throw new Error('Item order tidak valid');
    const remaining = item.qtyOrdered - item.qtyReceivedGood - item.qtyReceivedBad;
    if (line.qtyGood + line.qtyBad > remaining) throw new Error('Qty QC melebihi sisa');

    await tx.orderItem.update({
      where: { id: line.orderItemId },
      data: {
        qtyReceivedGood: { increment: line.qtyGood },
        qtyReceivedBad: { increment: line.qtyBad }
      }
    });

    await applyStockChange(tx, {
      itemId: item.itemId,
      userId: params.userId,
      freeDelta: line.qtyGood,
      blockedDelta: line.qtyBad,
      type: 'QC',
      note: `QC order #${order.id}`
    });
  }

  const updated = await tx.orderItem.findMany({ where: { orderId: order.id } });
  const fullyReceived = updated.every((i) => i.qtyReceivedGood + i.qtyReceivedBad >= i.qtyOrdered);

  await tx.order.update({
    where: { id: order.id },
    data: { status: fullyReceived ? 'RECEIVED' : 'PENDING' }
  });
}
