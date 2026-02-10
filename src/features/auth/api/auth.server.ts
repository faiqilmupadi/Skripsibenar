import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { ApiError, handleError, ok } from "@/lib/http/errors";
import { env } from "@/lib/env/env";
import { q } from "@/lib/db/queries";
import { SESSION_COOKIE, loginRedirectByRole } from "@/features/auth/utils/auth.constants";

const secret = new TextEncoder().encode(env.jwtSecret);

export async function loginHandler(req: Request) { try {
  const { username, password } = await req.json();
  const users = await q<any[]>("SELECT * FROM users WHERE username=? LIMIT 1", [username]);
  const user = users[0];
  if (!user || user.status !== "ACTIVE") throw new ApiError(401, "Login gagal");
  if (!(await bcrypt.compare(password, user.password_hash))) throw new ApiError(401, "Login gagal");
  const token = await new SignJWT({ sub: String(user.id), role: user.role, name: user.name }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("8h").sign(secret);
  cookies().set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/" });
  return ok({ redirectTo: loginRedirectByRole[user.role as keyof typeof loginRedirectByRole] });
} catch (e) { return handleError(e); } }

export async function logoutHandler() { cookies().delete(SESSION_COOKIE); return ok({ success: true }); }

export async function verifySessionToken(token: string) {
  try { const { payload } = await jwtVerify(token, secret); return { id: Number(payload.sub), role: String(payload.role), name: String(payload.name) }; }
  catch { return null; }
}
