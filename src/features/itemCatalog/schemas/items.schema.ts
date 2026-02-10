import { z } from "zod";

export const itemSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  unit: z.string().min(1),
  plant: z.string().min(1),
  rop: z.number().nonnegative(),
  safetyStock: z.number().nonnegative().optional(),
  createdBy: z.string().optional(),
  materialGroup: z.string().optional()
});
