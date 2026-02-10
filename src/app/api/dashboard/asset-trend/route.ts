import { assetTrendHandler } from "@/features/managerDashboard/api/managerDashboard.server";

export const GET = (req: Request) => assetTrendHandler(req);
