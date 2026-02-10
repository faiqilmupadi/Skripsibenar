import bcrypt from "bcryptjs";
import { exec, q } from "@/lib/db/queries";
import { handleError, ok } from "@/lib/http/errors";
import { accountSchema } from "@/features/accountManagement/schemas/accounts.schema";

export async function usersHandler(req: Request) { try {
  if (req.method === "GET") {
    const rows = await q<any[]>("SELECT userId id,username,email,role,lastChange FROM users WHERE role='ADMIN_GUDANG'");
    return ok(rows.map((x) => ({ ...x, status: "ACTIVE", name: x.username })));
  }
  const body = accountSchema.parse(await req.json());
  if (req.method === "POST") {
    const password = body.password?.startsWith("$2") ? body.password : await bcrypt.hash(body.password || "password123", 10);
    await exec("INSERT INTO users(username,email,password,role) VALUES(?,?,?,?)", [body.username, body.email, password, "ADMIN_GUDANG"]);
  }
  if (req.method === "PUT") {
    await exec("UPDATE users SET username=?,email=?,role=? WHERE userId=?", [body.username, body.email, body.role || "ADMIN_GUDANG", body.id]);
  }
  return ok({ success: true });
} catch (e) { return handleError(e); } }

export async function userStatusHandler() { return ok({ success: true, message: "Status disimpan di role/dataset existing" }); }

export async function userPasswordHandler(req: Request, id: string) { try {
  const b = await req.json();
  const password = String(b.password || "");
  const stored = password.startsWith("$2") ? password : await bcrypt.hash(password, 10);
  await exec("UPDATE users SET password=? WHERE userId=?", [stored, id]);
  return ok({ success: true });
} catch (e) { return handleError(e); } }
