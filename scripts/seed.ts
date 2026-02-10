import path from "node:path";
import XLSX from "xlsx";
import { pool } from "../src/lib/db/mysql";

type Row = Record<string, unknown>;
const file = process.argv[2] || path.join(process.cwd(), "dataset.xlsx");

const toNumber = (x: unknown) => (x == null || x === "" ? 0 : Number(x));
const toDate = (x: unknown) => (x ? new Date(String(x)) : null);

async function upsert(sql: string, values: unknown[][]) {
  for (const row of values) await pool.execute(sql, row);
}

async function run() {
  const wb = XLSX.readFile(file);
  const [usersS, masterS, stockS, plantS, movS] = wb.SheetNames;
  const users = XLSX.utils.sheet_to_json<Row>(wb.Sheets[usersS]);
  const masters = XLSX.utils.sheet_to_json<Row>(wb.Sheets[masterS]);
  const stocks = XLSX.utils.sheet_to_json<Row>(wb.Sheets[stockS]);
  const plants = XLSX.utils.sheet_to_json<Row>(wb.Sheets[plantS]);
  const movements = XLSX.utils.sheet_to_json<Row>(wb.Sheets[movS]);

  await upsert(`INSERT INTO users(userId,username,email,password,role,createdOn,lastChange)
    VALUES(?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE username=VALUES(username),email=VALUES(email),password=VALUES(password),role=VALUES(role),lastChange=VALUES(lastChange)`,
    users.map((x) => [x.user_id, x.username, x.email, x.password, x.role, toDate(x.created_on), toDate(x["Last Change"])]));

  await upsert(`INSERT INTO material_master(partNumber,materialDescription,baseUnitOfMeasure,createdOn,createTime,createdBy,materialGroup)
    VALUES(?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE materialDescription=VALUES(materialDescription),baseUnitOfMeasure=VALUES(baseUnitOfMeasure),createdBy=VALUES(createdBy),materialGroup=VALUES(materialGroup)`,
    masters.map((x) => [x["Part Number"], x["Material description"], x["Base Unit of Measure"], toDate(x["Created On"]), x["Create Time"] || null, x["Created By"], x["Material Group"]]));

  await upsert(`INSERT INTO material_stock(partNumber,plant,freeStock,blocked)
    VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE freeStock=VALUES(freeStock),blocked=VALUES(blocked)`,
    stocks.map((x) => [x["part number"], x["Plant"], toNumber(x["Free Stock"]), toNumber(x.Blocked)]));

  await upsert(`INSERT INTO material_plant_data(partNumber,plant,reorderPoint,safetyStock)
    VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE reorderPoint=VALUES(reorderPoint),safetyStock=VALUES(safetyStock)`,
    plants.map((x) => [x["Part Number"], x.Plant, toNumber(x["Reorder Point"]), toNumber(x["Safety Stock"])]));

  await upsert(`INSERT INTO material_movement(material,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName)
    VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
    movements.map((x) => [x.Material, x.Plant, x["Material Description"], toDate(x["Posting Date"]), x["Movement type"], x.Order || null, x["Purchase order"] || null, toNumber(x.Quantity), x["Base Unit of Measure"], toNumber(x["Amt.in Loc.Cur."]), x["User Name"]]));

  console.log(`Import selesai dari ${file}`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
