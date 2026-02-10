import { z } from "zod";
export const rangeSchema = z.object({ from: z.string().optional(), to: z.string().optional() });
