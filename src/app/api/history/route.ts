import { historyHandler } from "@/features/purchaseHistory/api/history.server";

export const GET = (req: Request) => historyHandler(req);
