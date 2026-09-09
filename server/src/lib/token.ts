import { jwtVerify, SignJWT } from "jose";

import { env } from "../env.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);
const ISSUER = "roomcall";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function signSessionToken(userId: string) {
  return new SignJWT()
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secret);
}

export async function readSessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret, { issuer: ISSUER });
  return payload.sub ?? null;
}
