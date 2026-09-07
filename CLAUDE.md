# CLAUDE.md — RoomCall

Project-level instructions. These take precedence over ~/.claude/CLAUDE.md
wherever they conflict.

## What this product is

A multilingual guest-request system for hotels. A card in each room carries a
QR code with the room number. The guest scans it, picks a language, and sends
a request — a broken AC, extra towels, room service, late checkout. The front
desk sees it immediately in their own language and answers back in the
guest's.

Two surfaces:

1. **Guest** (`/r/[room]`) — mobile-first, no app, no account. Language
   picker, request screens, live tracking with a reply thread.
2. **Front desk** (`/desk`, `/desk/analytics`) — grouped inbox, dual-language
   conversation, status and assignee, translated composer, analytics.

Languages: Arabic, Russian, Turkish, English, Georgian, plus a free-text
"other language" that falls back to English copy. Arabic is RTL throughout.
Currency: GEL (₾), stored as integer tetri.

## Current state

The UI is complete and driven by static demo data. There is no backend: the
request list lives in a client-side store (`features/requests/store.ts`) built
on `useSyncExternalStore` + localStorage, so a request sent from `/r/205`
shows up on `/desk` in the same browser. "Translation" is a lookup table in
`shared/i18n/dictionary.ts`, not a model call.

`supabase/` and `shared/types/supabase.ts` still hold the schema of the
previous product (a salon booking SaaS) and do not describe RoomCall. Do not
build against them — replace them when the backend work starts.

## Stack (do not change without asking)

- Next.js (App Router) + TypeScript strict + Tailwind v4
- lucide-react for icons
- Vitest for tests, Playwright for e2e (later)
- Zod for runtime validation at real boundaries
- pnpm

## Architecture: feature-based

Code is organized by **feature**, not by technical layer. `app/` contains only
thin route files that import from `features/`.

```
app/
  page.tsx                    redirects to /desk
  r/[room]/page.tsx           -> features/guest
  desk/layout.tsx             console frame + header
  desk/page.tsx               -> features/desk (inbox)
  desk/analytics/page.tsx     -> features/desk (analytics)

features/
  requests/                   the shared domain
    types.ts                  Request, Message, Category, Status, Urgency
    schemas.ts                Zod schema for persisted state
    catalog.ts                categories, icons, items, dishes, hotel facts
    language.ts               GuestLanguage helpers, resolveText, translateAll
    demo-data.ts              seed requests + analytics figures
    store.ts                  client store (useSyncExternalStore + localStorage)
    index.ts                  public API
  guest/
    components/               one file per screen
    build-request.ts          pure: form input -> Request draft
    build-request.test.ts
    screens.ts                GuestScreen union
    index.ts
  desk/
    components/               header, list, conversation, composer, analytics
    initials.ts
    index.ts

shared/
  i18n/
    dictionary.ts             DICTIONARY (5 languages) + Phrases
    canned.ts                 quick replies in every language
    script.ts                 script -> font class, RTL detection
  lib/                        cn, money
  types/                      stale Supabase types only
```

Rules:

- A feature exports only through its `index.ts`. Other features import from
  that, never from internal files.
- Features may import from `shared/` and from other features' `index.ts`.
  `shared/` never imports from `features/`.
- Pure logic (request building, translation lookup) goes in its own file with
  no IO so it can be unit-tested.
- A route file in `app/` should be < 30 lines.
- Do not create new top-level folders. New capability = new folder in
  `features/`.

## Conventions

- Strict TypeScript. No `any`. No `@ts-ignore`.
- Server Components by default; `"use client"` only when needed.
- Small components, no file over ~250 lines — split.
- No comments explaining _what_; only _why_ when non-obvious.
- Money stored as integer tetri (1 ₾ = 100 tetri). Never floats. Format with
  `formatGel`.
- Guest-facing strings come from `shared/i18n/dictionary.ts` — never hardcode
  them in a component. Two exceptions: the front-desk UI is English and can be
  inline, and the language picker at `/r/[room]` is English by design because
  it runs before the guest has chosen a language.
- Never claim a translation the code did not produce. Free text is passed
  through untranslated; `resolveText` returns the language it actually
  resolved to, and callers must render `dir`/`scriptFont` for _that_ language
  and label it accordingly.
- Every language-bearing element sets `dir` and the matching font class via
  `scriptFont(lang)`. Arabic must render RTL with IBM Plex Sans Arabic,
  Georgian with Noto Sans Georgian.
- Tests for: request building, translation lookup, availability-style pure
  logic. UI tests are optional for now.

## Design

- The source of truth is the Claude Design project "RoomCall v3". Match it,
  don't reinvent.
- Palette: canvas `#EDE9E2`, paper `#F7F4EF`, surface `#FBFAF8`, ink
  `#111111`, sage `#5E7A6B` (single accent), sand `#D9C9A8`, urgent
  `#B5503C`. All exposed as Tailwind tokens in `app/globals.css` — use
  `bg-paper`, `text-sage`, `border-line`, never raw hex.
- Fonts: Inter Tight (UI), IBM Plex Mono (numbers, labels), IBM Plex Sans
  Arabic, Noto Sans Georgian.
- Pill buttons and generous radii (20–26px). Status = text + colour, never
  colour alone.
- Guest screens are mobile-first and centred at `max-w-[430px]`. The desk
  console is desktop-first.

## Workflow for Claude Code

- Run `pnpm typecheck && pnpm lint && pnpm test` before declaring done.
- Prefer small PRs: one feature or one bug per branch.
- Don't add dependencies without a one-line justification.
- Don't write marketing copy; I provide it.

## Commands

```
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```
