import { historyExportHandler } from "@/features/purchaseHistory/api/history.server";

export const GET = (req: Request) => historyExportHandler(req);
