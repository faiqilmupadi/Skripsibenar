import { orderQcHandler } from "@/features/stockBarang/api/stock.server";

export const POST = (req: Request, ctx: { params: { id: string } }) => orderQcHandler(req, ctx.params.id);
