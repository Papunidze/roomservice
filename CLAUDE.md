# CLAUDE.md — [PROJECT_NAME] (SaaS for local businesses in Georgia)

Project-level instructions. These take precedence over ~/.claude/CLAUDE.md
wherever they conflict.

## What this product is

A self-serve SaaS for small local businesses in Georgia (salons, dental
clinics, auto services, cafés). A business signs up, enters services, prices,
hours and photos, and automatically gets:

1. An AI assistant answering Instagram / WhatsApp DMs and taking bookings
2. An online booking system (calendar, staff, reminders)
3. A template-based public website on a subdomain (custom domain on Pro)

UI language: Georgian only (for now). Currency: GEL (₾).
Plans: Start 99 ₾ / Business 249 ₾ / Pro 399 ₾ per month, 14-day trial.

## Stack (do not change without asking)

- Next.js (App Router) + TypeScript strict + Tailwind + shadcn/ui
- Supabase: Postgres, Auth (email + Google), Storage, Realtime
- Claude API (Haiku/Sonnet) for the AI assistant
- Meta Graph API (Instagram DM), WhatsApp Cloud API
- Vercel for hosting
- Zod for all runtime validation at boundaries
- Vitest for tests, Playwright for e2e (later)
- pnpm

## Architecture: feature-based

Code is organized by **feature**, not by technical layer. Everything a
feature needs (UI, server actions, queries, schemas, tests) lives in one
folder. `app/` contains only thin route files that import from `features/`.

```
app/                          routes only — no business logic here
  (marketing)/                landing, pricing, legal
  (auth)/                     login, register, forgot-password, verify
  (app)/                      authenticated shell (sidebar)
    dashboard/page.tsx        -> imports from features/dashboard
    bookings/page.tsx         -> features/bookings
    messages/page.tsx         -> features/messages
    ...
  (sites)/[slug]/             tenant public websites -> features/site
  api/
    webhooks/instagram/       -> features/channels
    webhooks/whatsapp/
    cron/reminders/           -> features/bookings

features/
  auth/
  onboarding/
  dashboard/
  bookings/
    components/               BookingCalendar, BookingRow, BookingSheet...
    actions.ts                server actions (create/cancel/confirm)
    queries.ts                data access — the only place that queries DB
    schemas.ts                Zod schemas + inferred types
    availability.ts           pure slot/conflict logic (no IO)
    availability.test.ts
    index.ts                  public API of the feature
  messages/
  clients/
  assistant/                  AI settings UI + prompt builder + tools
  channels/                   instagram/, whatsapp/ adapters + webhook parsers
  site/                       website builder + templates/
  services/
  staff/
  billing/
  settings/

shared/
  ui/                         design-system primitives (button, input, card...)
  layout/                     Sidebar, AppShell, PageHeader
  lib/
    supabase/                 server / browser / admin clients
    ai/                       Claude client wrapper only
    dates.ts, money.ts, phone.ts
  i18n/ka.ts                  all Georgian strings
  types/                      generated Supabase types

supabase/
  migrations/
  seed.sql
```

Rules:

- A feature exports only through its `index.ts`. Other features import from
  that, never from internal files.
- Features may import from `shared/` and from other features' `index.ts`.
  `shared/` never imports from `features/`.
- `queries.ts` is the only file in a feature that touches Supabase.
- Pure logic (availability, pricing, prompt building) goes in its own file
  with no IO so it can be unit-tested.
- A route file in `app/` should be < 30 lines: fetch via feature query,
  render feature component.
- Do not create new top-level folders. New capability = new folder in
  `features/`.

## Multi-tenancy — the most important rule

Every business is a tenant (`businesses` table). Every tenant-owned table has
`business_id` and **Row Level Security enabled**. Never write a query that can
read another tenant's data. Never disable RLS "temporarily". Server-side
admin client (`service_role`) is used only in webhooks/cron and must always
filter by `business_id` explicitly.

## Conventions

- Strict TypeScript. No `any`. No `@ts-ignore`. Types inferred from Zod.
- Server Components by default; `"use client"` only when needed.
- Server Actions for mutations from the UI; route handlers only for
  webhooks, cron and external callers.
- Validate every external input with Zod (forms, webhooks, API).
- Typed errors: `{ ok: true, data } | { ok: false, error: { code, message } }`.
  Never throw across a server/client boundary.
- Small components, no file over ~250 lines — split.
- No comments explaining _what_; only _why_ when non-obvious.
- Dates stored in UTC, displayed in `Asia/Tbilisi`. Use `date-fns-tz`.
- Money stored as integer tetri (1 ₾ = 100 tetri). Never floats.
- Phone numbers stored E.164 (`+995...`).
- All user-facing strings in Georgian, in `shared/i18n/ka.ts` — no hardcoded
  Georgian strings inside components.
- Tests for: availability/slot logic, billing logic, webhook parsers,
  AI tool handlers. UI tests are optional for now.

## UI / design rules

- Design comes from the Claude Design export in `design/` — match it, don't
  reinvent. Sidebar shell, light theme, one violet accent, solid white content
  cards with light border. Glass effect only on the sidebar.
- Owners are non-technical. Every screen: one primary action, plain Georgian
  labels, no jargon. Status = text + color, never color alone.
- Mobile-first for the app (owners use phones). Landing is desktop-first.
- Font: Noto Sans Georgian for all Georgian text.
- UI primitives: shadcn/ui, installed into `shared/ui` via the CLI
  (`pnpm dlx shadcn@latest add ...`). Customize them there; do not add another
  component library.

## AI assistant rules

- System prompt built in `features/assistant/prompt.ts` from business data (services,
  prices, hours, FAQ, tone: formal | friendly). Never hardcode business facts.
- Assistant answers only from business data. If unsure → hand off to human
  and create a `handoff` event; never invent prices or availability.
- Booking is done through a tool call that checks real availability in
  `features/bookings/availability.ts` — the model never decides a slot on its own.
- Log every conversation (`conversations`, `messages`) with channel and
  token usage so we can track cost per tenant.
- Default model Haiku; Sonnet only where configured per plan.

## Channels (Meta)

- One adapter per channel in `features/channels/`, same interface:
  `receive(webhook) -> NormalizedMessage`, `send(business, to, text)`.
- Webhook handlers must verify signatures, respond 200 fast, and enqueue
  work — never call the AI synchronously inside the webhook.
- Never store Meta access tokens in plain text; use Supabase Vault.

## Workflow for Claude Code

- Before implementing a feature, read the relevant `features/<name>/` folder and the
  migration files. Do not guess the schema.
- Schema changes = new migration file in `supabase/migrations`, never edit
  old ones.
- Run `pnpm typecheck && pnpm lint && pnpm test` before declaring done.
- Prefer small PRs: one feature or one bug per branch.
- If a task touches billing, auth, RLS or Meta webhooks — stop and confirm
  the plan with me first.
- Don't add dependencies without a one-line justification.
- Don't write marketing copy; I provide it.

## Commands

```
pnpm dev            # local
pnpm typecheck
pnpm lint
pnpm test
pnpm db:migrate     # supabase migration up
pnpm db:types       # regenerate Supabase types
```

## Current phase

MVP. In scope: auth, onboarding, dashboard, bookings, Instagram assistant,
pricing/billing. Out of scope for now: WhatsApp, website builder, loyalty,
analytics, multi-branch. Do not build out-of-scope features even if stubs
exist in the layout.

## Overrides of global CLAUDE.md

- [add here anything from your ~/.claude/CLAUDE.md that must NOT apply to
  this project, e.g. "ignore Python preferences", "do not use tabs"]
