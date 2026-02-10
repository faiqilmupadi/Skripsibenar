import { ok } from '@/lib/http';
import { requireRole } from '@/lib/rbac';
import { getSummary } from '@/server/dashboard';

export async function GET(req: Request) {
  await requireRole(['KEPALA_GUDANG']);
  const { searchParams } = new URL(req.url);
  const from = new Date(searchParams.get('from') ?? new Date(Date.now() - 30 * 86400000));
  const to = new Date(searchParams.get('to') ?? new Date());
  return ok(await getSummary(from, to));
}
