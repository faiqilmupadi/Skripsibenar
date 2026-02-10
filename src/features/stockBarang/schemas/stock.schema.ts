import { z } from "zod";
import { ALLOWED_MOVEMENT_TYPES } from "@/lib/db/movement";

export const orderSchema = z.object({
  items: z.array(
    z.object({
      itemId: z.string().min(1),
      qty: z.number().positive(),
      plant: z.string().optional(),
      movementType: z.enum(ALLOWED_MOVEMENT_TYPES).optional()
    })
  ),
  plant: z.string().optional(),
  orderNo: z.string().optional(),
  purchaseOrder: z.string().optional(),
  userName: z.string().optional()
});
