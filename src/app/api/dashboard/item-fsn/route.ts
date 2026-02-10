import { itemFsnHandler } from "@/features/managerDashboard/api/managerDashboard.server";

export const GET = (req: Request) => itemFsnHandler(req);
