import { z } from "zod";
export const itemSchema = z.object({ code: z.string().min(2), name: z.string().min(2), price: z.number().nonnegative(), rop: z.number().nonnegative() });
