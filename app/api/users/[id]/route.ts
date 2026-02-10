import { hashPassword } from '@/lib/auth';
import { fail, ok } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { userSchema } from '@/lib/validation';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(['KEPALA_GUDANG']);
    const parsed = userSchema.safeParse(await req.json());
    if (!parsed.success) return fail('Payload tidak valid');
    const updated = await prisma.user.update({
      where: { id: Number(params.id) },
      data: {
        name: parsed.data.name,
        username: parsed.data.username,
        role: parsed.data.role,
        ...(parsed.data.password ? { passwordHash: await hashPassword(parsed.data.password) } : {})
      }
    });
    return ok(updated);
  } catch {
    return fail('Unauthorized', 401);
  }
}
