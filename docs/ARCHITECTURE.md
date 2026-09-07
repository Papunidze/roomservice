# Architecture

## Feature-based layout

Code is organised by **feature**, not by technical layer. Everything a feature
needs — UI, pure logic, tests — lives in one folder. There is no global
`components/` or `hooks/` directory.

```
app/            routes only, no business logic
  page.tsx      public landing page
  sign-in/      sign-in form
  sign-up/      hotel setup form
  r/[room]/     guest request app
  desk/         front-desk console (inbox, rooms, team, analytics, settings)

features/       one folder per feature, each with an index.ts public API
shared/         i18n, small libs, console UI primitives
supabase/       stale — schema of the previous product, see below
docs/
```

## Features

```
features/requests/       the shared domain, imported by every surface
  types.ts               Request, Message, Category, Status, Urgency, staff
  schemas.ts             Zod schemas for persisted state
  catalog.ts             categories, icons, items, dishes, hotel facts
  language.ts            GuestLanguage helpers, resolveText, translateAll
  settings.ts            Settings shape + seed
  settings-store.ts      hotel profile, guest languages, categories, items
  demo-data.ts           seed requests + analytics figures
  store.ts               request store

features/guest/          the QR-scanned guest app
  components/            one file per screen
  build-request.ts       pure: form input -> Request draft
  build-request.test.ts

features/desk/           inbox + analytics, and the console frame
  actions.ts             reply / internal note / assign / status / close room
  components/            header, filters, list, conversation, composer, charts

features/rooms/          rooms, QR plates, guest sessions
features/team/           members, routing rules, escalation, invites
features/settings/       the six settings panels (UI only)

features/auth/           sign in, hotel setup, the staff session
  credentials.ts         pure: form values -> field errors, email -> display name
  credentials.test.ts
  store.ts               the session store
  components/            shell, fields, the two forms

features/marketing/      the public landing page
  components/            header, hero, sections, footer
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

### Why settings live in `features/requests`

The hotel profile, guest info page, enabled languages, category list and item
menu are read by **both** surfaces: the console edits them, the guest app
renders them. Putting the store in the shared domain keeps the dependency
graph acyclic — `guest`, `desk`, `rooms`, `team` and `settings` all point at
`requests`, and nothing points back. `features/settings` is the editing UI
only; it holds no state of its own.

## State

There is no backend yet. `shared/lib/store.ts` is a small factory over
`useSyncExternalStore`; five stores use it (requests, settings, rooms, team,
session):

- `getServer` returns the seed so SSR and hydration agree.
- `get` returns a cached array reference, so React never loops.
- State is persisted to `localStorage` and validated with Zod on read, so a
  stale or hand-edited payload falls back to the seed instead of crashing.
- A `storage` listener (attached on the first subscriber, removed on the last)
  keeps two tabs in sync — this is what makes the guest → desk hand-off
  visible without a server.

When a real backend arrives, these five stores are the seam to replace.

Do not put a `useSyncExternalStore` consumer inside a `<Suspense>` boundary
that its sibling is outside of: the boundary hydrates separately and can stay
pinned to the server snapshot while the rest of the tree reads localStorage,
so two panels of the same console disagree. Read search params on the server
and pass them down instead.

## Auth

There is no server, so there is nothing to authenticate against. `features/auth`
validates the form with Zod, derives a display name from the email and writes a
`Session` to a fifth persisted store; `/desk` reads it for the header name,
avatar and account menu. Both forms say plainly that no credentials leave the
browser — do not dress this up as real auth in the UI.

`/desk` is deliberately **not** gated. A client-side guard would flash the
console before redirecting, and the demo has to stay openable from a link. Route
protection belongs with the real backend, in middleware, not here.

Signing up writes the hotel name straight into the settings store, so the name
the operator types is the one the console and the QR plates show.

## Threads

A `Message` has four kinds: `guest`, `staff`, `system` and `note`. The console
renders all four; the guest thread filters through `isGuestVisible`, so system
lines and internal notes can never leak to `/r/[room]`.

## Translation

`shared/i18n/dictionary.ts` holds the sixteen supported languages, and
`LANGUAGES` is the single list every surface renders from — picker, language
sheet, QR plate and settings toggles. Adding one is a data change: a code in
`LANGUAGES`, a complete `Phrases` entry, three `CANNED` replies and a
`SCRIPT_FONT` mapping, plus a font in `app/layout.tsx` if the script is new.
`Record<LangCode, …>` types make the compiler refuse an incomplete addition.
The picker searches with `matchesLanguage`, which folds diacritics so a plain
Latin keyboard finds `Español` and `Türkçe`.

Every request carries a `translations` map filled at creation time by
`translateAll`, so canned content is genuinely multilingual.

Free text is **not** translated — there is no model in the loop. `resolveText`
returns both the string and the language it actually resolved to, and every
call site renders `dir` + `scriptFont` for that language and labels it
honestly. The same rule governs settings: the guest info page and any item
added by hand are shown to guests in the language they were typed in, and the
settings UI says so rather than promising translation.

## Flags

`public/flags/<lang>.svg` holds one official flag per language, copied from
[flag-icons](https://github.com/lipis/flag-icons) (MIT) at its `4x3` ratio and
renamed from ISO country code to language code — `sa → ar`, `ir → fa`,
`ua → uk`, `gb → en`, `br → pt`, `ge → ka`. The package itself is **not** a
dependency: the 16 files were copied once, so there is nothing to install or
tree-shake. `shared/ui/Flag.tsx` renders them as a CSS `background-image` on a
decorative `<span>` — `next/image` cannot optimise SVG, and `<img>` trips
Next's LCP rule for what is really an icon. Boxes are sized 4:3 to match the
source so nothing is cropped.

Adding a language means dropping its flag in that folder under the language
code. Flags are `aria-hidden`: the native and English names sit beside them, so
a screen reader announces the language once.

## Stale directories

`supabase/` and `shared/types/supabase.ts` describe the previous product (a
salon booking SaaS): bookings, businesses, services, Instagram/WhatsApp
conversations. Nothing in RoomCall references them. Replace rather than extend
them when backend work starts.
