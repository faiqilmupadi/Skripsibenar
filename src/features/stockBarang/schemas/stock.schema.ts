import { z } from "zod";
export const orderSchema = z.object({ items: z.array(z.object({ itemId: z.number(), qty: z.number().positive() })) });
