import { exec, q } from "@/lib/db/queries";
import { handleError, ok } from "@/lib/http/errors";
import { itemSchema } from "@/features/itemCatalog/schemas/items.schema";

const listSql = `SELECT mm.partNumber,mm.materialDescription,mm.baseUnitOfMeasure,
  ms.plant,ms.freeStock,ms.blocked,pd.reorderPoint,pd.safetyStock
  FROM material_master mm
  LEFT JOIN material_stock ms ON ms.partNumber=mm.partNumber
  LEFT JOIN material_plant_data pd ON pd.partNumber=mm.partNumber AND pd.plant=ms.plant`;

export async function itemsHandler(req: Request) {
  try {
    if (req.method === "GET") return ok(await q(listSql));

    const body = itemSchema.parse(await req.json());

    if (req.method === "POST") {
      const createdOn = new Date().toISOString().slice(0, 10);
      const createTime = new Date().toTimeString().slice(0, 8);
      await exec(
        "INSERT INTO material_master(partNumber,materialDescription,baseUnitOfMeasure,createdOn,createTime,createdBy,materialGroup) VALUES(?,?,?,?,?,?,?)",
        [body.code, body.name, body.unit, createdOn, createTime, body.createdBy || null, body.materialGroup || null]
      );
      await exec("INSERT INTO material_stock(partNumber,plant,freeStock,blocked) VALUES(?,?,?,?)", [body.code, body.plant, 0, 0]);
      await exec("INSERT INTO material_plant_data(partNumber,plant,reorderPoint,safetyStock) VALUES(?,?,?,?)", [
        body.code,
        body.plant,
        body.rop,
        body.safetyStock || 0
      ]);
    }

    if (req.method === "PUT") {
      await exec("UPDATE material_master SET materialDescription=?,baseUnitOfMeasure=?,materialGroup=? WHERE partNumber=?", [
        body.name,
        body.unit,
        body.materialGroup || null,
        body.code
      ]);
      await exec("UPDATE material_plant_data SET reorderPoint=?,safetyStock=? WHERE partNumber=? AND plant=?", [
        body.rop,
        body.safetyStock || 0,
        body.code,
        body.plant
      ]);
    }

    return ok({ success: true });
  } catch (e) {
    return handleError(e);
  }
}

export async function itemActiveHandler(_req?: Request, _id?: string) {
  return ok({ success: true });
}
