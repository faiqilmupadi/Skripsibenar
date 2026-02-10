import { prisma } from '@/lib/prisma';

export async function getSummary(from: Date, to: Date) {
  const [movements, stocks] = await Promise.all([
    prisma.movement.groupBy({
      by: ['userId'],
      _count: { _all: true },
      where: { createdAt: { gte: from, lte: to } }
    }),
    prisma.stock.findMany({ include: { item: true } })
  ]);

  const assetValue = stocks.reduce(
    (acc, s) => acc + Number(s.item.price) * s.freeStock,
    0
  );

  return { movements, assetValue };
}

export async function getFsn(windowDays: number) {
  const from = new Date();
  from.setDate(from.getDate() - windowDays);

  const outs = await prisma.movement.groupBy({
    by: ['itemId'],
    where: { type: 'OUTBOUND', createdAt: { gte: from } },
    _sum: { qtyFreeDelta: true },
    _count: { _all: true }
  });

  const items = await prisma.item.findMany({ where: { isActive: true } });
  const ranked = items
    .map((item) => {
      const metric = outs.find((o) => o.itemId === item.id);
      return {
        itemId: item.id,
        itemName: item.name,
        qty: Math.abs(metric?._sum.qtyFreeDelta ?? 0),
        freq: metric?._count._all ?? 0
      };
    })
    .sort((a, b) => b.qty - a.qty);

  const fastCut = Math.ceil(ranked.length * 0.2);
  const slowCut = Math.ceil(ranked.length * 0.7);

  return ranked.map((r, idx) => ({
    ...r,
    fsn: r.qty === 0 ? 'NON_MOVING' : idx < fastCut ? 'FAST' : idx < slowCut ? 'SLOW' : 'NON_MOVING'
  }));
}
