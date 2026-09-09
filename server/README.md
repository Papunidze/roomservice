# RoomCall API

Express 5 + TypeScript + MongoDB. Own package, own `node_modules`, own deploy —
the Next app does not build or lint it.

## Running

```
cp .env.example .env          # then set JWT_SECRET: openssl rand -base64 32
pnpm install
pnpm db:up                    # mongo 8 in docker on 27017
pnpm dev                      # http://localhost:4000
```

`pnpm build && pnpm start` for the compiled server, `pnpm db:down` to stop mongo.

## Auth

| Method | Route                | Body                         | Result                     |
| ------ | -------------------- | ---------------------------- | -------------------------- |
| POST   | `/api/auth/register` | name, hotel, email, password | 201, sets cookie, `{user}` |
| POST   | `/api/auth/login`    | email, password              | 200, sets cookie, `{user}` |
| POST   | `/api/auth/logout`   | —                            | 204, clears cookie         |
| GET    | `/api/auth/me`       | —                            | 200 `{user}` or 401        |

The session is a JWT (HS256, 7 days, `sub` = user id) delivered as
`roomcall_session`: `HttpOnly; Secure; SameSite; Path=/`. HttpOnly means the
browser sends it automatically and no script can read it — a Next client just
needs `credentials: "include"`.

`requireAuth` reads the cookie first and falls back to
`Authorization: Bearer <token>`, so curl, mobile and server-to-server callers
work without a cookie jar.

Errors are uniform: `{ error: { code, message, fields? } }`. `fields` is present
only on 400 and is keyed by input name, so a form can show messages inline.

## Decisions

**Passwords use `node:crypto` scrypt** (N=65536, r=8, p=1, 64-byte key, 16-byte
random salt), stored as `scrypt$N$r$p$salt$key`. OWASP accepts scrypt, it is in
Node core, and it avoids a native build step in CI. Swap in argon2 if you want
the first choice — only `lib/password.ts` changes, and the stored prefix says
which scheme produced each hash.

**Login never reveals whether an email exists.** Both wrong-password and
unknown-email return the same 401, and the unknown-email path still runs a hash
so the two take similar time.

**The JWT is not revocable.** Signing out clears the cookie, but a copied token
stays valid until it expires. Short-lived access tokens plus a rotating refresh
token in Mongo are the fix when you need real revocation.

## Not here yet

Rate limiting on login, email verification, password reset, refresh-token
rotation, and eslint for this package.
