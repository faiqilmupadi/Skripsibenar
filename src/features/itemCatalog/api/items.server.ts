import { exec, q } from "@/lib/db/queries";
import { handleError, ok } from "@/lib/http/errors";
import { itemSchema } from "@/features/itemCatalog/schemas/items.schema";

const listSql = `SELECT mm.partNumber code,mm.materialDescription name,mm.baseUnitOfMeasure unit,
  ms.plant,ms.freeStock free_stock,ms.blocked blocked_stock,pd.reorderPoint rop,pd.safetyStock
  FROM material_master mm
  LEFT JOIN material_stock ms ON ms.partNumber=mm.partNumber
  LEFT JOIN material_plant_data pd ON pd.partNumber=mm.partNumber AND pd.plant=ms.plant`;

export async function itemsHandler(req: Request) {
  try {
    if (req.method === "GET") return ok(await q(listSql));
    const b = itemSchema.parse(await req.json());
    if (req.method === "POST") {
      const createdOn = new Date().toISOString().slice(0, 10);
      const createTime = new Date().toTimeString().slice(0, 8);
      await exec("INSERT INTO material_master(partNumber,materialDescription,baseUnitOfMeasure,createdOn,createTime,createdBy,materialGroup) VALUES(?,?,?,?,?,?,?)", [b.code, b.name, b.unit, createdOn, createTime, b.createdBy || null, b.materialGroup || null]);
      await exec("INSERT INTO material_stock(partNumber,plant,freeStock,blocked) VALUES(?,?,?,?)", [b.code, b.plant, 0, 0]);
      await exec("INSERT INTO material_plant_data(partNumber,plant,reorderPoint,safetyStock) VALUES(?,?,?,?)", [b.code, b.plant, Math.round(b.rop), Math.round(b.safetyStock || 0)]);
    }
    if (req.method === "PUT") {
      await exec("UPDATE material_master SET materialDescription=?,baseUnitOfMeasure=?,materialGroup=? WHERE partNumber=?", [b.name, b.unit, b.materialGroup || null, b.code]);
      await exec("UPDATE material_plant_data SET reorderPoint=?,safetyStock=? WHERE partNumber=? AND plant=?", [Math.round(b.rop), Math.round(b.safetyStock || 0), b.code, b.plant]);
    }
    return ok({ success: true });
  } catch (e) {
    return handleError(e);
  }
}

export async function itemActiveHandler(_req?: Request, _id?: string) {
  return ok({ success: true });
}
