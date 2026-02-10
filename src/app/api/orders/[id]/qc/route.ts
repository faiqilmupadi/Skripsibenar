import { orderQcHandler } from "@/features/stockBarang/api/stock.server";

export const POST = (req: Request) => orderQcHandler(req);
