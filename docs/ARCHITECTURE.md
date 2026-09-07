# Architecture

## Feature-based layout

Code is organised by **feature**, not by technical layer. Everything a feature
needs — UI, server actions, queries, schemas, pure logic, tests — lives in one
folder. There is no global `components/`, `hooks/` or `services/` directory.

```
app/            routes only, no business logic
  (marketing)/  landing, pricing, legal
  (auth)/       login, register, forgot-password, verify
  (app)/        authenticated shell
  (sites)/      tenant public websites
  api/          webhooks and cron only

features/       one folder per feature, each with an index.ts public API
shared/         design-system primitives, layout, lib, i18n, generated types
supabase/       migrations and seed
docs/
```

A feature folder looks like this:

```
features/bookings/
  components/        BookingCalendar, BookingRow, BookingSheet...
  actions.ts         server actions (create / cancel / confirm)
  queries.ts         data access — the only file that touches Supabase
  schemas.ts         Zod schemas + inferred types
  availability.ts    pure slot/conflict logic, no IO
  availability.test.ts
  index.ts           public API of the feature
```

## The rules

1. **A feature is reached only through its `index.ts`.** Never
   `@/features/bookings/queries` from outside `features/bookings/`.
2. **`shared/` never imports from `features/`.** Dependencies point one way:
   `app → features → shared`.
3. **`queries.ts` is the only file in a feature that touches Supabase.**
4. **Pure logic lives in its own IO-free file** (availability, pricing, prompt
   building) so it can be unit-tested without mocks.
5. **A route file in `app/` is thin** — under ~30 lines: fetch through a feature
   query, render a feature component.
6. **No new top-level folders.** A new capability is a new folder in
   `features/`.

Rules 1 and 2 are enforced by ESLint (`no-restricted-imports` zones in
`eslint.config.mjs`), so violations fail `pnpm lint` and CI rather than relying
on review. That config also blocks relative paths that climb out of a feature,
so `../../clients/queries` cannot be used to sidestep rule 1.

Rules 3–6 are conventions — they are reviewed, not compiled.

## Multi-tenancy

Every business is a tenant. Every tenant-owned table has `business_id` and
**Row Level Security enabled**, with policies added in the same migration that
creates the table. RLS is never disabled, not even temporarily.

Policies go through two `security definer` helpers:

- `public.is_business_member(business_id)` — the caller belongs to the tenant
- `public.is_business_admin(business_id)` — the caller is `owner` or `admin`

They are `security definer` for a concrete reason: a policy on
`users_businesses` that queries `users_businesses` directly recurses forever.
Reading the membership table from inside a definer function breaks that cycle.

The `service_role` key bypasses RLS entirely. It is used only in webhook and
cron handlers, and those must always filter by `business_id` explicitly — RLS
is not there to catch their mistakes.

Membership rows are managed by existing admins. There is deliberately no
self-insert policy for the first owner of a new business: that row is created
by onboarding through the service role, so a user cannot mint themselves into
a tenant.

## Data conventions

| Thing      | Rule                                                    |
| ---------- | ------------------------------------------------------- |
| Money      | integer **tetri** (1 ₾ = 100). Never floats.            |
| Phones     | E.164 (`+995...`), enforced by a check constraint.      |
| Timestamps | `timestamptz`, stored UTC, displayed in `Asia/Tbilisi`. |
| Dates      | `date-fns-tz` for display conversion.                   |
| IDs        | `uuid` with `gen_random_uuid()`.                        |
| Strings    | user-facing Georgian text lives in `shared/i18n/ka.ts`. |

## Boundaries and validation

Everything crossing into the app is validated with Zod: forms, webhook
payloads, external API responses, and environment variables
(`shared/lib/env.ts`, which throws at startup rather than failing later).

Server/client boundaries return typed results rather than throwing:

```ts
{ ok: true, data } | { ok: false, error: { code, message } }
```

Server Components are the default; `"use client"` is added only when a
component genuinely needs interactivity. Mutations from the UI go through
Server Actions. Route handlers exist only for webhooks, cron and external
callers.

## Testing

Vitest, with tests co-located next to the code. The things that must be tested
are the ones where being wrong is expensive: availability/slot logic, billing
logic, webhook parsers, and AI tool handlers. UI tests are optional for now.
