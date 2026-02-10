import { z } from "zod";
export const historyFilterSchema = z.object({ from: z.string().optional(), to: z.string().optional(), type: z.string().optional() });
