import { userStatusHandler } from "@/features/accountManagement/api/accounts.server";

export const PATCH = (req: Request, ctx: { params: { id: string } }) => userStatusHandler(req, ctx.params.id);
