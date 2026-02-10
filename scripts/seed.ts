import bcrypt from "bcryptjs";
import { pool } from "@/lib/db/mysql";

async function run() {
  const hash = await bcrypt.hash("password123", 10);
  await pool.query("DELETE FROM movements; DELETE FROM order_items; DELETE FROM orders; DELETE FROM stock; DELETE FROM items; DELETE FROM users;");
  await pool.query("INSERT INTO users(name,username,password_hash,role,status) VALUES (?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?)", [
    "Kepala Gudang", "kepala", hash, "KEPALA_GUDANG", "ACTIVE",
    "Admin A", "admin1", hash, "ADMIN_GUDANG", "ACTIVE",
    "Admin B", "admin2", hash, "ADMIN_GUDANG", "ACTIVE"
  ]);
  await pool.query("INSERT INTO items(code,name,unit,price,rop,is_active) VALUES ('BRG-001','Oli Mesin','botol',50000,10,1),('BRG-002','Kampas Rem','pcs',120000,8,1),('BRG-003','Busi','pcs',25000,12,1)");
  await pool.query("INSERT INTO stock(item_id,free_stock,blocked_stock) VALUES (1,40,2),(2,7,1),(3,20,0)");
  await pool.query("INSERT INTO movements(item_id,user_id,type,qty_free_delta,qty_blocked_delta,note,customer_name) VALUES (1,2,'OUTBOUND',-5,0,'Service','Andi'),(2,3,'QC',2,1,'QC awal',NULL),(3,2,'RETURN',0,-1,'Retur vendor',NULL)");
  console.log("Seed selesai. akun: kepala/admin1/admin2 password: password123");
  process.exit(0);
}
run();
