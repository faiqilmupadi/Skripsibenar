import { MovementType, Prisma } from '@prisma/client';

export function validateNonNegative(current: number, delta: number) {
  if (current + delta < 0) throw new Error('Stock tidak cukup');
}

export async function applyStockChange(
  tx: Prisma.TransactionClient,
  payload: {
    itemId: number;
    userId: number;
    freeDelta: number;
    blockedDelta: number;
    type: MovementType;
    note?: string;
    customerName?: string;
  }
) {
  const stock = await tx.stock.upsert({
    where: { itemId: payload.itemId },
    update: {},
    create: { itemId: payload.itemId, freeStock: 0, blockedStock: 0 }
  });

  validateNonNegative(stock.freeStock, payload.freeDelta);
  validateNonNegative(stock.blockedStock, payload.blockedDelta);

  await tx.stock.update({
    where: { itemId: payload.itemId },
    data: {
      freeStock: { increment: payload.freeDelta },
      blockedStock: { increment: payload.blockedDelta }
    }
  });

  await tx.movement.create({
    data: {
      itemId: payload.itemId,
      userId: payload.userId,
      type: payload.type,
      qtyFreeDelta: payload.freeDelta,
      qtyBlockedDelta: payload.blockedDelta,
      note: payload.note,
      customerName: payload.customerName
    }
  });
}
