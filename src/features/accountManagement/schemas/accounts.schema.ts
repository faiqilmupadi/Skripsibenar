import { z } from "zod";
export const accountSchema = z.object({ name: z.string().min(2), username: z.string().min(3), password: z.string().min(6).optional() });
