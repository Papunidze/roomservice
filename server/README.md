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

| Method | Route                       | Body                         | Result                                     |
| ------ | --------------------------- | ---------------------------- | ------------------------------------------ |
| POST   | `/api/auth/register`        | name, hotel, email, password | 201, sets cookie, `{user}`                 |
| POST   | `/api/auth/login`           | email, password              | 200, sets cookie, `{user}`                 |
| POST   | `/api/auth/logout`          | —                            | 204, clears cookie                         |
| GET    | `/api/auth/me`              | —                            | 200 `{user}` or 401                        |
| GET    | `/api/auth/google`          | —                            | 302 to Google consent                      |
| GET    | `/api/auth/google/callback` | code, state (query)          | 302 to `{CLIENT_ORIGIN}/desk`, sets cookie |
| POST   | `/api/auth/forgot-password` | email                        | 204 always                                 |
| POST   | `/api/auth/reset-password`  | token, password              | 200, sets cookie, `{user}`                 |

The session is a JWT (HS256, 7 days, `sub` = user id) delivered as
`roomcall_session`: `HttpOnly; Secure; SameSite; Path=/`. HttpOnly means the
browser sends it automatically and no script can read it — a Next client just
needs `credentials: "include"`.

`requireAuth` reads the cookie first and falls back to
`Authorization: Bearer <token>`, so curl, mobile and server-to-server callers
work without a cookie jar.

Errors are uniform: `{ error: { code, message, fields? } }`. `fields` is present
only on 400 and is keyed by input name, so a form can show messages inline.

## Console API

Every route below needs the session cookie and is scoped to the caller's
hotel. Responses wrap their payload (`{ settings }`, `{ rooms }`, `{ request }`,
…) and errors keep the `{ error: { code, message, fields? } }` shape.

| Method | Route                     | Body / query                             | Result                                               |
| ------ | ------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| GET    | `/api/settings`           | —                                        | `{settings}`                                         |
| PATCH  | `/api/settings`           | any top-level Settings keys              | `{settings}`                                         |
| GET    | `/api/rooms`              | —                                        | `{rooms}` with the guest URL per room                |
| POST   | `/api/rooms`              | `numbers: string[]`                      | 201 `{rooms}` (existing numbers skipped)             |
| POST   | `/api/rooms/printed`      | `numbers: string[]`                      | `{rooms}`                                            |
| PATCH  | `/api/rooms/:no`          | `printed?`, `session?: {lang} \| null`   | `{room}`                                             |
| POST   | `/api/rooms/:no/token`    | —                                        | `{room}` with a new QR token                         |
| POST   | `/api/rooms/:no/close`    | —                                        | `{room, archived}`                                   |
| GET    | `/api/requests`           | `?since=<iso>` for deltas                | `{requests}` newest first, max 500                   |
| GET    | `/api/requests/events`    | —                                        | SSE stream of hotel events                           |
| POST   | `/api/requests/:id/reply` | text, lang, translations?, photo?        | `{request}`                                          |
| POST   | `/api/requests/:id/notes` | text                                     | `{request}`                                          |
| PATCH  | `/api/requests/:id`       | `status?`, `assignee?`                   | `{request}`                                          |
| GET    | `/api/team`               | —                                        | `{team: {members, routing, autoAssign, escalation}}` |
| PATCH  | `/api/team`               | `routing?`, `autoAssign?`, `escalation?` | `{config}`                                           |
| POST   | `/api/team/members`       | name, email, role, lang?                 | 201 `{member}`, emails a set-password link           |
| PATCH  | `/api/team/members/:id`   | name?, role?, lang?, telegram?, onShift? | `{member}`                                           |
| DELETE | `/api/team/members/:id`   | —                                        | 204                                                  |
| GET    | `/api/analytics`          | `?range=today\|7d\|30d`                  | `{analytics}` computed from requests                 |

**Roles.** Every signed-in member can read settings, rooms, team and
requests and can work the inbox (reply, note, assign, status). Everything that
changes the hotel — settings, rooms, team, plus the analytics page — needs the
`Manager` role (`requireManager`) and answers 403 otherwise. Registration
creates a Manager; invited members get the role chosen in the invite.

| DELETE | `/api/rooms` | `numbers: string[]` | `{rooms}`; open requests of those rooms are archived |

## Guest API

No account: the QR plate's URL carries the room token,
`{CLIENT_ORIGIN}/r/{no}?t={token}`. Regenerating a room's token invalidates the
old plate.

| Method | Route                                     | Body                                                     | Result                                               |
| ------ | ----------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------- |
| GET    | `/api/guest/:token`                       | —                                                        | room, hotel name, languages, info, categories, items |
| POST   | `/api/guest/:token/session`               | lang                                                     | opens the room's guest session                       |
| GET    | `/api/guest/:token/requests`              | —                                                        | open requests for that room                          |
| POST   | `/api/guest/:token/requests`              | category, urgency, language, text, translations?, photo? | 201 `{request}`                                      |
| POST   | `/api/guest/:token/requests/:id/messages` | text, lang                                               | `{request}`                                          |
| GET    | `/api/guest/:token/events`                | —                                                        | SSE, only that room's events                         |

Requests come back in the shape the console already uses: numeric `id` per
hotel, `room`, `assignee` as a name, `minutesAgo` computed at read time, and
the full `thread`. The guest app must keep rendering only `guest` and `staff`
lines.

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

**Google sign-in** is plain OAuth 2.0 with `fetch` — no SDK. `/google` stores a
random `state` in a 10-minute HttpOnly cookie and redirects to Google;
`/google/callback` checks the state, swaps the code for an access token, reads
the OpenID userinfo endpoint and only accepts verified emails. A matching
`googleId` or email signs into the existing user (linking the Google id);
otherwise a user is created with an empty hotel name and no password. Needs
`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`; without them the route answers 503.

**Two-factor authentication** is TOTP (RFC 6238, SHA-1, 6 digits, 30 s,
±1 step) implemented in `lib/totp.ts` with `node:crypto` — no library. The
secret is stored on the user with `enabledAt: null` until the first code is
confirmed. With it on, `/login` answers `{secondFactor}`: a five-minute JWT
ticket with audience `second-factor`, exchanged at `/2fa/verify` together with
a code for the real session cookie. Google sign-in does not ask for the code —
Google's own second factor covers it.

**Password reset** never reveals whether an email exists: `/forgot-password`
is always 204. When the user exists, a 32-byte random token is generated, its
SHA-256 stored on the user with a one-hour expiry, and the plain token mailed
as `{CLIENT_ORIGIN}/reset-password?token=…`. `/reset-password` matches the hash,
replaces the password hash, clears the token and signs the user in. Mail goes
through Resend's HTTP API when `RESEND_API_KEY` is set and is printed to the
server log otherwise.

**Tenancy.** Registration creates a hotel and its first Manager; Google
first-sign-ins get an unnamed hotel to fill in under Settings. Team members
are users of the same hotel. Legacy users without a hotel are attached to a
fresh one on startup (`jobs/migrate.ts`).

**Server-side desk rules.** A staff reply marks first response, takes the
ticket when unassigned and moves `new → progress`; assigning does the same;
`done` stamps `resolvedAt`. Creating a request applies the hotel's per-category
urgency and, when auto-assign is on, hands it to the most recently active
on-shift member of the routed role. A one-minute job appends an escalation
line to requests still `new` past the configured minutes.

**Live updates** are Server-Sent Events fanned out per hotel from an in-process
emitter, so they work on one instance; put a broker (Redis pub/sub) behind
`lib/events.ts` before running several.

## Not here yet

Rate limiting, email verification, refresh-token rotation, photo upload for
requests, Telegram delivery (the settings are stored, nothing is sent), and
eslint for this package.
