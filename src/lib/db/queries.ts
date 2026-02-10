import { pool } from "@/lib/db/mysql";

export async function q<T>(sql: string, params: unknown[] = []) {
  const [rows] = await pool.query(sql, params);
  return rows as T;
}

export const sql = {
  users: "SELECT id,name,username,role,status,created_at FROM users",
  items: "SELECT i.*,s.free_stock,s.blocked_stock FROM items i LEFT JOIN stock s ON s.item_id=i.id",
  history: "SELECT m.*,u.name user_name,i.name item_name FROM movements m JOIN users u ON u.id=m.user_id JOIN items i ON i.id=m.item_id"
};
