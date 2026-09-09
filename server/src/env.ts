import { z } from "zod";

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1),
  MONGODB_DB: z.string().min(1).default("roomcall"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  CLIENT_ORIGIN: z.string().min(1).default("http://localhost:3000"),
  COOKIE_SAMESITE: z.enum(["lax", "strict", "none"]).default("lax"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    `Invalid environment — copy .env.example to .env\n${z.prettifyError(parsed.error)}`,
  );
  process.exit(1);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
