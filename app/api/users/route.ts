import { hashPassword } from '@/lib/auth';
import { fail, ok } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { userSchema } from '@/lib/validation';

export async function GET() {
  try {
    await requireRole(['KEPALA_GUDANG']);
    const users = await prisma.user.findMany({ orderBy: { id: 'desc' } });
    return ok(users);
  } catch (e) {
    return fail((e as Error).message === 'FORBIDDEN' ? 'Forbidden' : 'Unauthorized', 401);
  }
}

export async function POST(req: Request) {
  try {
    await requireRole(['KEPALA_GUDANG']);
    const parsed = userSchema.safeParse(await req.json());
    if (!parsed.success) return fail('Payload tidak valid');
    if (!parsed.data.password) return fail('Password wajib diisi');
    const created = await prisma.user.create({
      data: {
        name: parsed.data.name,
        username: parsed.data.username,
        passwordHash: await hashPassword(parsed.data.password),
        role: parsed.data.role
      }
    });
    return ok(created);
  } catch {
    return fail('Unauthorized', 401);
  }
}
