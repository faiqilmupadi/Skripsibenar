import { NextRequest } from 'next/server';
import { comparePassword, createSession } from '@/lib/auth';
import { fail, ok } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { loginSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  if (!checkRateLimit(`login:${ip}`, 5)) return fail('Terlalu banyak percobaan login', 429);

  const parsed = loginSchema.safeParse(await req.json());
  if (!parsed.success) return fail(parsed.error.errors[0]?.message ?? 'Payload tidak valid');

  const user = await prisma.user.findUnique({ where: { username: parsed.data.username } });
  if (!user || user.status !== 'ACTIVE') return fail('User tidak ditemukan', 401);

  const valid = await comparePassword(parsed.data.password, user.passwordHash);
  if (!valid) return fail('Password salah', 401);

  await createSession(user);
  return ok({ id: user.id, name: user.name, role: user.role });
}
