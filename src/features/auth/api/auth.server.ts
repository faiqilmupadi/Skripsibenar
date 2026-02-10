import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { ApiError, handleError, ok } from "@/lib/http/errors";
import { env } from "@/lib/env/env";
import { q } from "@/lib/db/queries";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import { SESSION_COOKIE, loginRedirectByRole } from "@/features/auth/utils/auth.constants";

const secret = new TextEncoder().encode(env.jwtSecret);

async function passwordMatch(input: string, stored: string) {
  if (stored.startsWith("$2")) return bcrypt.compare(input, stored);
  return input === stored;
}

export async function loginHandler(req: Request) { try {
  const payload = loginSchema.parse(await req.json());
  const users = await q<any[]>("SELECT userId,username,password,role FROM users WHERE username=? LIMIT 1", [payload.username]);
  const user = users[0];
  if (!user || !(await passwordMatch(payload.password, user.password))) throw new ApiError(401, "Login gagal");
  const token = await new SignJWT({ sub: String(user.userId), role: user.role, name: user.username }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("8h").sign(secret);
  cookies().set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/" });
  return ok({ redirectTo: loginRedirectByRole[user.role as keyof typeof loginRedirectByRole] });
} catch (e) { return handleError(e); } }

export async function logoutHandler() { cookies().delete(SESSION_COOKIE); return ok({ success: true }); }

export async function verifySessionToken(token: string) {
  try { const { payload } = await jwtVerify(token, secret); return { id: Number(payload.sub), role: String(payload.role), name: String(payload.name) }; }
  catch { return null; }
}
