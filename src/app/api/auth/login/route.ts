import { loginHandler } from "@/features/auth/api/auth.server";

export const POST = (req: Request) => loginHandler(req);
