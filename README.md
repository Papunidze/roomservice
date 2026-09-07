# Tanda

SaaS for small local businesses in Georgia (salons, dental clinics, auto
services, cafés). A business signs up, enters services, prices, hours and
photos, and gets an AI assistant for Instagram/WhatsApp DMs, an online booking
system, and a public website on a subdomain.

UI language is Georgian. Currency is GEL (₾), stored as integer tetri.

## Stack

Next.js (App Router) · TypeScript strict · Tailwind · Supabase (Postgres, Auth,
Storage, Realtime) · Claude API · Meta Graph / WhatsApp Cloud API · Vercel ·
Zod · Vitest · pnpm.

## Requirements

- Node — version pinned in [`.nvmrc`](.nvmrc) (`nvm use`)
- pnpm 10+ (`corepack enable`)
- Docker, for the local Supabase stack

## Running locally

```bash
pnpm install
cp .env.example .env.local

pnpm db:start        # boots local Supabase, applies migrations, runs seed.sql
pnpm db:types        # regenerates shared/types/supabase.ts

pnpm dev             # http://localhost:3000
```

`pnpm db:start` prints the local `API_URL`, `ANON_KEY` and `SERVICE_ROLE_KEY` —
copy them into `.env.local`. Supabase Studio runs at http://127.0.0.1:54323.

The seed creates one demo hair salon in Tbilisi (`სილამაზის სალონი ნათელი`,
slug `natela`) with services, staff, clients, bookings and one Instagram
conversation. Its owner logs in as `owner@natela.ge` / `password123`.

## Scripts

| Script            | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `pnpm dev`        | Dev server                                       |
| `pnpm build`      | Production build                                 |
| `pnpm start`      | Serve a production build                         |
| `pnpm typecheck`  | `next typegen` then `tsc --noEmit`               |
| `pnpm lint`       | ESLint, including the feature-boundary rules     |
| `pnpm format`     | Prettier write (`format:check` to verify only)   |
| `pnpm test`       | Vitest once (`test:watch` to watch)              |
| `pnpm db:start`   | Start local Supabase (`db:stop` to stop)         |
| `pnpm db:reset`   | Drop, re-run every migration, re-seed            |
| `pnpm db:migrate` | Apply pending migrations locally                 |
| `pnpm db:types`   | Regenerate `shared/types/supabase.ts` from local |

## Migrations

Schema changes are always a **new** file in `supabase/migrations/` — never an
edit to an existing one.

```bash
pnpm supabase migration new add_something   # creates the file
pnpm db:reset                               # verify from scratch, re-seeds
pnpm db:types                               # regenerate types, commit them
```

Commit the regenerated `shared/types/supabase.ts` alongside the migration —
CI typechecks without a database and relies on that file.

On push to `main`, `.github/workflows/db-migrate.yml` runs `supabase db push`
against production whenever anything under `supabase/` changed. It can also be
triggered manually from the Actions tab.

## Deployment

Vercel builds and hosts the app; `main` is the production branch. Database
migrations are _not_ applied by Vercel — they go through the `db-migrate`
workflow above.

### GitHub secrets

Used by `.github/workflows/db-migrate.yml` (repository or `production`
environment secrets):

| Secret                  | Where to get it                               |
| ----------------------- | --------------------------------------------- |
| `SUPABASE_ACCESS_TOKEN` | Supabase account → Access Tokens              |
| `SUPABASE_DB_PASSWORD`  | Supabase project → Settings → Database        |
| `SUPABASE_PROJECT_ID`   | Supabase project ref (from the dashboard URL) |

CI itself needs no secrets — the build step uses placeholder public values.

### Vercel environment variables

Every variable in [`.env.example`](.env.example) with real production values:

- `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`
- `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL_DEFAULT`, `ANTHROPIC_MODEL_PRO`
- `META_APP_ID`, `META_APP_SECRET`, `META_WEBHOOK_VERIFY_TOKEN`, `INSTAGRAM_PAGE_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
- `SMS_API_URL`, `SMS_API_KEY`, `SMS_SENDER_ID`
- `CRON_SECRET`

`shared/lib/env.ts` validates these with Zod and throws on startup if any is
missing or malformed, so a bad deploy fails immediately instead of at the first
request.

## Branching

- `main` is production. It is always deployable; pushes to it deploy.
- Everything else is a short-lived feature branch off `main`
  (`feat/bookings-calendar`, `fix/webhook-signature`), merged back through a PR.
- One feature or one bug per branch. CI must be green before merge.
- Conventional Commits (`feat:`, `fix:`, `chore:`).

## Architecture

Code is organised by feature, not by technical layer — see
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). The rules there are enforced by
ESLint, not just documented.
