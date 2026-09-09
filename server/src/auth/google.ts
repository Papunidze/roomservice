import { z } from "zod";

import { env } from "../env.js";
import { googleNotConfigured } from "../lib/http-error.js";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

const redirectUri = `${env.API_ORIGIN}/api/auth/google/callback`;

const tokenSchema = z.object({ access_token: z.string() });

const profileSchema = z.object({
  sub: z.string(),
  email: z.email(),
  email_verified: z.boolean(),
  name: z.string().default(""),
});

export type GoogleProfile = z.infer<typeof profileSchema>;

export const isGoogleConfigured = () =>
  Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);

function credentials() {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET)
    throw googleNotConfigured();
  return { id: env.GOOGLE_CLIENT_ID, secret: env.GOOGLE_CLIENT_SECRET };
}

export function googleAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: credentials().id,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return `${AUTH_URL}?${params}`;
}

export async function fetchGoogleProfile(code: string) {
  const { id, secret } = credentials();

  const tokenResponse = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: id,
      client_secret: secret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenResponse.ok) return null;
  const token = tokenSchema.parse(await tokenResponse.json());

  const profileResponse = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!profileResponse.ok) return null;
  const profile = profileSchema.parse(await profileResponse.json());

  return profile.email_verified ? profile : null;
}
