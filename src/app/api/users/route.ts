import { usersHandler } from "@/features/accountManagement/api/accounts.server";

export const GET = (req: Request) => usersHandler(req);
export const POST = (req: Request) => usersHandler(req);
export const PUT = (req: Request) => usersHandler(req);
