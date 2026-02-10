import { itemActiveHandler } from "@/features/itemCatalog/api/items.server";

export const PATCH = (req: Request, ctx: { params: { id: string } }) => itemActiveHandler(req, ctx.params.id);
