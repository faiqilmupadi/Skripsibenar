import { orderHandler } from "@/features/stockBarang/api/stock.server";

export const POST = (req: Request) => orderHandler(req);
