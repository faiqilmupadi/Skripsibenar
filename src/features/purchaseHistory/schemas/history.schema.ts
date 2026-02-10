import { z } from "zod";
import { allowedMovementTypes } from "@/features/stockBarang/utils/movement.constants";

export const historyFilterSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  userName: z.string().optional(),
  material: z.string().optional(),
  movementType: z.enum(allowedMovementTypes).optional(),
  plant: z.string().optional()
});
