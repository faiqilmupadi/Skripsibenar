import { logoutHandler } from "@/features/auth/api/auth.server";

export const POST = (req: Request) => logoutHandler(req);
