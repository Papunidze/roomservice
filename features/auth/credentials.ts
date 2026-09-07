import { z } from "zod";

export const MIN_PASSWORD = 8;

const signInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(MIN_PASSWORD, `At least ${MIN_PASSWORD} characters`),
});

const signUpSchema = signInSchema.extend({
  name: z.string().trim().min(2, "Enter your name"),
  hotel: z.string().trim().min(2, "Enter your hotel name"),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;

export interface SignInErrors {
  email?: string;
  password?: string;
}

export interface SignUpErrors extends SignInErrors {
  name?: string;
  hotel?: string;
}

function firstErrorPerField(result: z.ZodSafeParseResult<unknown>) {
  const errors: Record<string, string> = {};
  if (result.success) return errors;

  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in errors))
      errors[field] = issue.message;
  }

  return errors;
}

export function checkSignIn(values: SignInValues): SignInErrors {
  return firstErrorPerField(signInSchema.safeParse(values));
}

export function checkSignUp(values: SignUpValues): SignUpErrors {
  return firstErrorPerField(signUpSchema.safeParse(values));
}

export function hasErrors(errors: SignUpErrors) {
  return Object.keys(errors).length > 0;
}

export function displayName(email: string) {
  const name = (email.split("@")[0] ?? "")
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return name || email;
}
