import { adminPerformanceHandler } from "@/features/managerDashboard/api/managerDashboard.server";

export const GET = (req: Request) => adminPerformanceHandler(req);
