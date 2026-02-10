import bcrypt from "bcryptjs";
import { exec, q } from "@/lib/db/queries";
import { handleError, ok } from "@/lib/http/errors";
import { accountSchema } from "@/features/accountManagement/schemas/accounts.schema";

async function nextUserId() {
  const rows = await q<any[]>("SELECT COALESCE(MAX(userId),0)+1 AS nextId FROM users");
  return Number(rows[0]?.nextId || 1);
}

export async function usersHandler(req: Request) {
  try {
    if (req.method === "GET") {
      const sql = "SELECT userId id,username,email,role,lastChange FROM users WHERE role='ADMIN_GUDANG'";
      const rows = await q<any[]>(sql);
      return ok(rows.map((x) => ({ ...x, status: "ACTIVE", name: x.username })));
    }
    const body = accountSchema.parse(await req.json());
    if (req.method === "POST") {
      const id = await nextUserId();
      const raw = body.password || "password123";
      const password = raw.startsWith("$2") ? raw : await bcrypt.hash(raw, 10);
      const sql = "INSERT INTO users(userId,username,email,password,role,createdOn,lastChange) VALUES(?,?,?,?,?,?,?)";
      await exec(sql, [id, body.username, body.email, password, "ADMIN_GUDANG", new Date(), new Date()]);
    }
    if (req.method === "PUT") {
      await exec("UPDATE users SET username=?,email=?,role=?,lastChange=? WHERE userId=?", [body.username, body.email, body.role || "ADMIN_GUDANG", new Date(), body.id]);
    }
    return ok({ success: true });
  } catch (e) {
    return handleError(e);
  }
}

export async function userStatusHandler(_req?: Request, _id?: string) {
  return ok({ success: true, message: "Status disimpan di role/dataset existing" });
}

export async function userPasswordHandler(req: Request, id: string) {
  try {
    const b = await req.json();
    const raw = String(b.password || "");
    const password = raw.startsWith("$2") ? raw : await bcrypt.hash(raw, 10);
    await exec("UPDATE users SET password=?,lastChange=? WHERE userId=?", [password, new Date(), id]);
    return ok({ success: true });
  } catch (e) {
    return handleError(e);
  }
}
