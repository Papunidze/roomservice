import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email());

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  hotel: z.string().trim().min(2, "Enter your hotel name").max(120),
  email,
  password: z.string().min(8, "At least 8 characters").max(200),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
