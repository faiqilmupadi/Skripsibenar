import { ok } from '@/lib/http';
import { requireRole } from '@/lib/rbac';
import { getFsn } from '@/server/dashboard';

export async function GET(req: Request) {
  await requireRole(['KEPALA_GUDANG']);
  const windowDays = Number(new URL(req.url).searchParams.get('windowDays') ?? '30');
  return ok(await getFsn(windowDays));
}
