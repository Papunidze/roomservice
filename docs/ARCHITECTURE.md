# Architecture

## Feature-based layout

Code is organised by **feature**, not by technical layer. Everything a feature
needs — UI, pure logic, tests — lives in one folder. There is no global
`components/` or `hooks/` directory.

```
app/            routes only, no business logic
  r/[room]/     guest request app
  desk/         front-desk console (inbox + analytics)

features/       one folder per feature, each with an index.ts public API
shared/         i18n dictionary and small libs
supabase/       stale — schema of the previous product, see below
docs/
```

## Features

```
features/requests/       the shared domain, imported by both surfaces
  types.ts               Request, Message, Category, Status, Urgency
  schemas.ts             Zod schema used to validate persisted state
  catalog.ts             categories, icons, items, dishes, hotel facts
  language.ts            GuestLanguage helpers, resolveText, translateAll
  demo-data.ts           seed requests + analytics figures
  store.ts               client store
  index.ts               public API

features/guest/          the QR-scanned guest app
  components/            one file per screen
  build-request.ts       pure: form input -> Request draft
  build-request.test.ts
  screens.ts             GuestScreen union

features/desk/           the front-desk console
  components/            header, list, conversation, composer, analytics
  initials.ts
```

Rules:

- A feature exports only through its `index.ts`. Other features import from
  that, never from internal files.
- Features may import from `shared/` and from other features' `index.ts`.
  `shared/` never imports from `features/`.
- Pure logic goes in its own IO-free file so it can be unit-tested.
- Route files in `app/` stay under 30 lines: read params, render a feature
  component.
- No file over ~250 lines.

## State

There is no backend yet. `features/requests/store.ts` is a module-level store
built on `useSyncExternalStore`:

- `getServerSnapshot` returns `DEMO_REQUESTS` so SSR and hydration agree.
- `getSnapshot` returns a cached array reference, so React never loops.
- State is persisted to `localStorage` and validated with Zod on read, so a
  stale or hand-edited payload falls back to the seed instead of crashing.
- A `storage` listener (attached on the first subscriber, removed on the last)
  keeps two tabs in sync — this is what makes the guest → desk hand-off
  visible without a server.

When a real backend arrives, `store.ts` is the single seam to replace.

## Translation

`shared/i18n/dictionary.ts` holds the five supported languages. Every request
carries a `translations` map filled at creation time by `translateAll`, so
canned content is genuinely multilingual.

Free-text is **not** translated — there is no model in the loop. `resolveText`
returns both the string and the language it actually resolved to, and every
call site renders `dir` + `scriptFont` for that language and labels it
honestly. Nothing in the UI claims a translation that does not exist.

## Stale directories

`supabase/` and `shared/types/supabase.ts` describe the previous product (a
salon booking SaaS): bookings, businesses, services, Instagram/WhatsApp
conversations. Nothing in RoomCall references them. Replace rather than extend
them when backend work starts.
