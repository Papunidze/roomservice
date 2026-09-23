# RoomCall

A multilingual guest-request system for hotels. A QR plate in each room opens
a web page where the guest picks a language and asks for what they need. The
front desk reads every request in its own language, answers in seconds, and
the guest reads the reply in theirs.

Three surfaces:

- **Guest** — `/r/[room]?t=<token>`: language picker, request screens, live
  tracking with a reply thread and a rating when the request is done.
- **Console** — `/desk`: inbox, history, rooms and QR plates, team, analytics,
  guest preview, settings and billing.
- **Public** — `/`, `/sign-in`, `/sign-up`, plus `/admin` for the RoomCall
  operator.

## Stack

Next.js (App Router) · TypeScript strict · Tailwind v4 · Zod · Vitest · pnpm.
The API in `server/` is Express 5 + MongoDB with its own `package.json`; see
[`server/README.md`](server/README.md) for its routes and decisions.

## Running locally

```bash
pnpm install
cp server/.env.example server/.env    # set JWT_SECRET, optionally the API keys
(cd server && pnpm install && pnpm db:up && pnpm dev)   # API on :4000
pnpm dev                                                # app on :3000
```

`next.config.ts` proxies `/api/*` to `API_ORIGIN` (default
`http://localhost:4000`), so the session cookie is first-party.

## Scripts

| Script           | What it does                              |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Dev server                                |
| `pnpm build`     | Production build                          |
| `pnpm typecheck` | `next typegen` then `tsc --noEmit`        |
| `pnpm lint`      | ESLint, including feature-boundary rules  |
| `pnpm test`      | Vitest once (`test:watch` to watch)       |
| `pnpm format`    | Prettier write (`format:check` to verify) |

Run `pnpm typecheck && pnpm lint && pnpm test` before declaring work done.
The server has its own `pnpm typecheck`.

## Deployment

The app deploys to Vercel from `main` and needs `API_ORIGIN`. The API deploys
to Render and needs the variables in `server/.env.example`; `OWNER_EMAILS`
lists the accounts that may open `/admin`.

## Architecture

Code is organised by feature under `features/`, with thin route files in
`app/` and framework-free helpers in `shared/`. The rules live in
[`CLAUDE.md`](CLAUDE.md).
