import { Role } from '@prisma/client';
import { getSession } from './auth';

export async function requireRole(roles: Role[]) {
  const user = await getSession();
  if (!user) throw new Error('UNAUTHORIZED');
  if (!roles.includes(user.role)) throw new Error('FORBIDDEN');
  return user;
}
