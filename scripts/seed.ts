import path from "node:path";
import XLSX from "xlsx";
import { pool } from "../src/lib/db/mysql";
import { isAllowedMovementType } from "../src/features/stockBarang/utils/movement.constants";

type Row = Record<string, unknown>;
const file = process.argv[2] || path.join(process.cwd(), "dataset.xlsx");
const toDecimal = (x: unknown) => (x == null || x === "" ? "0.000" : Number(x).toFixed(3));
const toDate = (x: unknown) => (x ? new Date(String(x)) : null);

async function upsert(sql: string, values: unknown[][]) { for (const row of values) await pool.execute(sql, row); }

function getValue<T>(row: Row, ...keys: string[]) { return (keys.find((k) => row[k] != null) ? row[keys.find((k) => row[k] != null)!] : null) as T; }

async function run() {
  const wb = XLSX.readFile(file);
  const [usersS, masterS, stockS, plantS, movS] = wb.SheetNames;
  const users = XLSX.utils.sheet_to_json<Row>(wb.Sheets[usersS]);
  const masters = XLSX.utils.sheet_to_json<Row>(wb.Sheets[masterS]);
  const stocks = XLSX.utils.sheet_to_json<Row>(wb.Sheets[stockS]);
  const plants = XLSX.utils.sheet_to_json<Row>(wb.Sheets[plantS]);
  const movements = XLSX.utils.sheet_to_json<Row>(wb.Sheets[movS]).filter((x) => isAllowedMovementType(String(getValue(x, "movementType", "Movement type", "Movement Type") || "")));

  await upsert(`INSERT INTO users(userId,username,email,password,role,createdOn,lastChange) VALUES(?,?,?,?,?,?,?)
    ON DUPLICATE KEY UPDATE username=VALUES(username),email=VALUES(email),password=VALUES(password),role=VALUES(role),lastChange=VALUES(lastChange)`,
    users.map((x) => [getValue(x, "userId", "user_id"), getValue(x, "username"), getValue(x, "email"), getValue(x, "password"), getValue(x, "role"), toDate(getValue(x, "createdOn", "created_on")), toDate(getValue(x, "lastChange", "Last Change"))]));

  await upsert(`INSERT INTO material_master(partNumber,materialDescription,baseUnitOfMeasure,createdOn,createTime,createdBy,materialGroup) VALUES(?,?,?,?,?,?,?)
    ON DUPLICATE KEY UPDATE materialDescription=VALUES(materialDescription),baseUnitOfMeasure=VALUES(baseUnitOfMeasure),createdBy=VALUES(createdBy),materialGroup=VALUES(materialGroup)`,
    masters.map((x) => [getValue(x, "partNumber", "Part Number"), getValue(x, "materialDescription", "Material description"), getValue(x, "baseUnitOfMeasure", "Base Unit of Measure"), toDate(getValue(x, "createdOn", "Created On")), getValue(x, "createTime", "Create Time") || null, getValue(x, "createdBy", "Created By"), getValue(x, "materialGroup", "Material Group")]));

  await upsert(`INSERT INTO material_stock(partNumber,plant,freeStock,blocked) VALUES(?,?,?,?)
    ON DUPLICATE KEY UPDATE freeStock=VALUES(freeStock),blocked=VALUES(blocked)`,
    stocks.map((x) => [getValue(x, "partNumber", "part number", "Part Number"), getValue(x, "plant", "Plant"), toDecimal(getValue(x, "freeStock", "Free Stock")), toDecimal(getValue(x, "blocked", "Blocked"))]));

  await upsert(`INSERT INTO material_plant_data(partNumber,plant,reorderPoint,safetyStock) VALUES(?,?,?,?)
    ON DUPLICATE KEY UPDATE reorderPoint=VALUES(reorderPoint),safetyStock=VALUES(safetyStock)`,
    plants.map((x) => [getValue(x, "partNumber", "Part Number"), getValue(x, "plant", "Plant"), toDecimal(getValue(x, "reorderPoint", "Reorder Point")), toDecimal(getValue(x, "safetyStock", "Safety Stock"))]));

  await upsert(`INSERT INTO material_movement(material,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName) VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
    movements.map((x) => [getValue(x, "material", "Material"), getValue(x, "plant", "Plant"), getValue(x, "materialDescription", "Material Description"), toDate(getValue(x, "postingDate", "Posting Date")), getValue(x, "movementType", "Movement type"), getValue(x, "orderNo", "Order") || null, getValue(x, "purchaseOrder", "Purchase order") || null, toDecimal(getValue(x, "quantity", "Quantity")), getValue(x, "baseUnitOfMeasure", "Base Unit of Measure"), Number(getValue(x, "amtInLocCur", "Amt.in Loc.Cur.") || 0), getValue(x, "userName", "User Name") ]));

  console.log(`Import selesai dari ${file}`);
}

run().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
