import ExcelJS from 'exceljs';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';

export async function GET() {
  await requireRole(['KEPALA_GUDANG']);
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Movements');
  ws.columns = [
    { header: 'Tanggal', key: 'createdAt', width: 24 },
    { header: 'Item', key: 'item', width: 24 },
    { header: 'User', key: 'user', width: 24 },
    { header: 'Tipe', key: 'type', width: 18 },
    { header: 'Delta Free', key: 'free', width: 14 },
    { header: 'Delta Blocked', key: 'blocked', width: 14 },
    { header: 'Catatan', key: 'note', width: 28 }
  ];
  const moves = await prisma.movement.findMany({ include: { item: true, user: true }, orderBy: { createdAt: 'desc' } });
  moves.forEach((m) =>
    ws.addRow({
      createdAt: m.createdAt.toISOString(),
      item: m.item.name,
      user: m.user.name,
      type: m.type,
      free: m.qtyFreeDelta,
      blocked: m.qtyBlockedDelta,
      note: m.note
    })
  );

  const buffer = await wb.xlsx.writeBuffer();
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="movements.xlsx"'
    }
  });
}
