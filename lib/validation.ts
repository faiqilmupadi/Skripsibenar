import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

export const userSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3),
  password: z.string().min(6).optional(),
  role: z.enum(['KEPALA_GUDANG', 'ADMIN_GUDANG'])
});

export const itemSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  unit: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  rop: z.coerce.number().int().nonnegative()
});

export const createOrderSchema = z.object({
  items: z.array(z.object({ itemId: z.number().int().positive(), qtyOrdered: z.number().int().positive() })).min(1)
});

export const receiveQcSchema = z.object({
  lines: z.array(
    z.object({
      orderItemId: z.number().int().positive(),
      qtyGood: z.number().int().nonnegative(),
      qtyBad: z.number().int().nonnegative()
    })
  )
});

export const outboundSchema = z.object({
  itemId: z.number().int().positive(),
  qty: z.number().int().positive(),
  customerName: z.string().min(2),
  note: z.string().optional()
});

export const returnBlockedSchema = z.object({
  itemId: z.number().int().positive(),
  qty: z.number().int().positive(),
  note: z.string().optional()
});
