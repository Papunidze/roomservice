import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email());
const password = z.string().min(8, "At least 8 characters").max(200);

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  hotel: z.string().trim().min(2, "Enter your hotel name").max(120),
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().max(200).default(""),
  newPassword: password,
});

const code = z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code");

export const twoFactorCodeSchema = z.object({ code });

export const secondFactorSchema = z.object({ ticket: z.string().min(1), code });

export const googleCallbackSchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
