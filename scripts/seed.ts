import path from "node:path";
import XLSX from "xlsx";
import { pool } from "../src/lib/db/mysql";
import { ALLOWED_MOVEMENT_TYPES, isAllowedMovementType } from "../src/lib/db/movement";

type Row = Record<string, unknown>;
const file = process.argv[2] || path.join(process.cwd(), "dataset.xlsx");

const cleanText = (v: unknown) => (v == null ? null : String(v).trim() || null);
const normalizeInt = (v: unknown) => Math.round(Number.parseFloat(String(v ?? "0")) || 0);
const normalizeDecimal = (v: unknown) => Number.parseFloat(String(v ?? "0")) || 0;
const normalizeDate = (v: unknown) => (v ? new Date(String(v)) : null);

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
  console.log(`Allowed movementType: ${ALLOWED_MOVEMENT_TYPES.join(",")}`);

  await upsert(`INSERT INTO users(userId,username,email,password,role,createdOn,lastChange)
    VALUES(?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE username=VALUES(username),email=VALUES(email),password=VALUES(password),role=VALUES(role),lastChange=VALUES(lastChange)`,
  users.map((x) => [normalizeInt(x.user_id), cleanText(x.username), cleanText(x.email), cleanText(x.password), cleanText(x.role), normalizeDate(x.created_on), normalizeDate(x["Last Change"])]));

  await upsert(`INSERT INTO material_master(partNumber,materialDescription,baseUnitOfMeasure,createdOn,createTime,createdBy,materialGroup)
    VALUES(?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE materialDescription=VALUES(materialDescription),baseUnitOfMeasure=VALUES(baseUnitOfMeasure),createdBy=VALUES(createdBy),materialGroup=VALUES(materialGroup)`,
  masters.map((x) => [cleanText(x["Part Number"]), cleanText(x["Material description"]), cleanText(x["Base Unit of Measure"]), normalizeDate(x["Created On"]), cleanText(x["Create Time"]), cleanText(x["Created By"]), cleanText(x["Material Group"])]));

  await upsert(`INSERT INTO material_stock(partNumber,plant,freeStock,blocked)
    VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE freeStock=VALUES(freeStock),blocked=VALUES(blocked)`,
  stocks.map((x) => [cleanText(x["part number"]), cleanText(x.Plant), normalizeInt(x["Free Stock"]), normalizeInt(x.Blocked)]));

  await upsert(`INSERT INTO material_plant_data(partNumber,plant,reorderPoint,safetyStock)
    VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE reorderPoint=VALUES(reorderPoint),safetyStock=VALUES(safetyStock)`,
  plants.map((x) => [cleanText(x["Part Number"]), cleanText(x.Plant), normalizeInt(x["Reorder Point"]), normalizeInt(x["Safety Stock"])]));

  const skipped: Row[] = [];
  const allowedRows = movements.filter((x) => {
    const movementType = cleanText(x["Movement type"]);
    const ok = isAllowedMovementType(movementType);
    if (!ok) skipped.push(x);
    return ok;
  });
  await upsert(`INSERT INTO material_movement(partNumber,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName)
    VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
  allowedRows.map((x) => [cleanText(x["Part Number"] ?? x.Material), cleanText(x.Plant), cleanText(x["Material Description"]), normalizeDate(x["Posting Date"]), cleanText(x["Movement type"]), cleanText(x.Order), cleanText(x["Purchase order"]), normalizeDecimal(x.Quantity), cleanText(x["Base Unit of Measure"]), normalizeDecimal(x["Amt.in Loc.Cur."]), cleanText(x["User Name"])]));

  if (skipped.length > 0) console.log(`Skipped ${skipped.length} movement rows due to invalid movementType.`);
  console.log(`Import selesai dari ${file}`);
}

run().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
