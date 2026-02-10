import { z } from "zod";

export const accountSchema = z.object({
  id: z.number().optional(),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: z.string().optional()
});
