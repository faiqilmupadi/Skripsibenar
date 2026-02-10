import { withdrawHandler } from "@/features/stockBarang/api/stock.server";

export const POST = (req: Request) => withdrawHandler(req);
