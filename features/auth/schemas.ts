import { z } from "zod";

import { ka } from "@/shared/i18n/ka";

const email = z
  .string()
  .min(1, ka.auth.errors.emailRequired)
  .email(ka.auth.errors.emailInvalid);

const password = z
  .string()
  .min(1, ka.auth.errors.passwordRequired)
  .min(8, ka.auth.errors.passwordShort);

export const loginSchema = z.object({
  email,
  password: z.string().min(1, ka.auth.errors.passwordRequired),
});

export const registerSchema = z.object({
  businessName: z.string().trim().min(1, ka.auth.errors.businessNameRequired),
  email,
  password,
  acceptsTerms: z.literal(true, { message: ka.auth.errors.termsRequired }),
});

export const forgotPasswordSchema = z.object({ email });

export const verifyCodeSchema = z.object({
  email,
  code: z.string().regex(/^\d{6}$/, ka.auth.errors.codeLength),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
