import { itemsHandler } from "@/features/itemCatalog/api/items.server";

export const GET = (req: Request) => itemsHandler(req);
export const POST = (req: Request) => itemsHandler(req);
export const PUT = (req: Request) => itemsHandler(req);
