import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "@/lib/db/mysql";

export async function q<T extends RowDataPacket[]>(sql: string, params: unknown[] = []) {
  const [rows] = await pool.query<T>(sql, params);
  return rows;
}

export async function exec(sql: string, params: unknown[] = []) {
  const [res] = await pool.execute<ResultSetHeader>(sql, params);
  return res;
}

export async function qTx<T extends RowDataPacket[]>(
  conn: PoolConnection,
  sql: string,
  params: unknown[] = []
) {
  const [rows] = await conn.query<T>(sql, params);
  return rows;
}

export async function execTx(conn: PoolConnection, sql: string, params: unknown[] = []) {
  const [res] = await conn.execute<ResultSetHeader>(sql, params);
  return res;
}
