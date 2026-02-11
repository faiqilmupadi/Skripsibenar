import { z } from "zod";

export const accountSchema = z.object({
  userId: z.number().optional(),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: z.string().optional()
});
