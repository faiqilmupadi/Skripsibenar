import { stockHandler } from "@/features/stockBarang/api/stock.server";

export const GET = (req: Request) => stockHandler(req);
