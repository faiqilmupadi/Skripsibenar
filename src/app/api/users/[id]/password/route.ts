import { userPasswordHandler } from "@/features/accountManagement/api/accounts.server";

export const PATCH = (req: Request, ctx: { params: { id: string } }) => userPasswordHandler(req, ctx.params.id);
