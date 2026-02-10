import { z } from "zod";
import { allowedMovementTypes } from "@/features/stockBarang/utils/movement.constants";

const decimalField = z.coerce.number().min(0);
const movementTypeSchema = z.enum(allowedMovementTypes);

const orderItemSchema = z.object({
  itemId: z.string().min(1),
  qty: decimalField
});

export const orderSchema = z.object({
  movementType: movementTypeSchema,
  plant: z.string().min(1),
  userName: z.string().min(1),
  orderNo: z.string().min(1).optional(),
  purchaseOrder: z.string().min(1).optional(),
  items: z.array(orderItemSchema).min(1)
});

export const qcSchema = z.object({
  movementType: movementTypeSchema,
  plant: z.string().min(1),
  userName: z.string().min(1),
  orderNo: z.string().optional(),
  items: z.array(z.object({ itemId: z.string().min(1), good: decimalField, bad: decimalField })).min(1)
});

export const withdrawSchema = z.object({
  movementType: movementTypeSchema,
  itemId: z.string().min(1),
  plant: z.string().min(1),
  userName: z.string().min(1),
  qty: decimalField,
  orderNo: z.string().optional(),
  note: z.string().optional()
});
