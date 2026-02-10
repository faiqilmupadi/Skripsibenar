import bcrypt from "bcryptjs";
import { q } from "@/lib/db/queries";
import { handleError, ok } from "@/lib/http/errors";

export async function usersHandler(req: Request) { try {
  if (req.method === "GET") return ok(await q("SELECT id,name,username,role,status FROM users WHERE role='ADMIN_GUDANG'"));
  const body = await req.json();
  if (req.method === "POST") {
    const hash = await bcrypt.hash(body.password || "password123", 10);
    await q("INSERT INTO users(name,username,password_hash,role,status) VALUES(?,?,?,?,?)", [body.name, body.username, hash, "ADMIN_GUDANG", "ACTIVE"]);
  }
  if (req.method === "PUT") await q("UPDATE users SET name=?, username=?, status=? WHERE id=?", [body.name, body.username, body.status, body.id]);
  return ok({ success: true });
} catch (e) { return handleError(e); } }

export async function userStatusHandler(req: Request, id: string) { try { const b = await req.json(); await q("UPDATE users SET status=? WHERE id=?", [b.status, id]); return ok({ success: true }); } catch (e) { return handleError(e); } }
export async function userPasswordHandler(req: Request, id: string) { try { const b = await req.json(); await q("UPDATE users SET password_hash=? WHERE id=?", [await bcrypt.hash(b.password, 10), id]); return ok({ success: true }); } catch (e) { return handleError(e); } }
