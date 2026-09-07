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

Languages: 16 shipped — Arabic, Persian, Turkish, Russian, Ukrainian, Hebrew,
English, German, French, Italian, Spanish, Polish, Portuguese (Brazil), Hindi,
Chinese and Georgian. Arabic, Persian and Hebrew are RTL. There is no
free-text "other language": a guest picks from the list, and English is the
fallback for anyone whose language is not on it. Which languages guests
actually see is a per-hotel setting; the picker, the QR plate and the language
sheet all render from that list.
Currency: GEL (₾), stored as integer tetri.

## Current state

The UI is complete and driven by static demo data. There is no backend: every
mutable slice lives in a client-side store built on `useSyncExternalStore` +
localStorage via `shared/lib/store.ts`, so a request sent from `/r/205` shows
up on `/desk` in the same browser. There are four such stores — requests,
settings (both in `features/requests`), rooms, and team. "Translation" is a
lookup table in `shared/i18n/dictionary.ts`, not a model call.

The front desk is one console at `/desk` with five sections: Inbox, Rooms,
Team, Analytics, Settings.

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
  desk/layout.tsx             console frame + header + overlays
  desk/page.tsx               -> features/desk (inbox)
  desk/rooms/page.tsx         -> features/rooms
  desk/team/page.tsx          -> features/team
  desk/analytics/page.tsx     -> features/desk (analytics)
  desk/settings/page.tsx      -> features/settings

features/
  requests/                   the shared domain
    types.ts                  Request, Message, Category, Status, Urgency, staff
    schemas.ts                Zod schemas for persisted state
    catalog.ts                categories, icons, items, dishes, hotel facts
    language.ts               GuestLanguage helpers, resolveText, translateAll
    settings.ts               Settings shape + seed (read by both surfaces)
    settings-store.ts         hotel profile, guest languages, categories, items
    demo-data.ts              seed requests + analytics figures
    store.ts                  request store
    index.ts                  public API
  guest/
    components/               one file per screen
    build-request.ts          pure: form input -> Request draft
    build-request.test.ts
    screens.ts                GuestScreen union
    index.ts
  desk/
    actions.ts                reply / note / assign / status / close room
    components/               header, filters, list, conversation, composer,
                              thread messages, analytics
    index.ts
  rooms/
    seed.ts, store.ts         rooms, floors, QR state, guest sessions
    plate-pattern.ts          pure: deterministic placeholder plate artwork
    components/               table, QR plate panel, add-rooms modal
  team/
    store.ts                  members, routing rules, escalation
    components/               table, routing, escalation, invite modal
  settings/
    components/               six panels + the settings shell

shared/
  i18n/
    dictionary.ts             DICTIONARY (5 languages) + Phrases
    canned.ts                 quick replies in every language
    script.ts                 script -> font class, RTL detection
  lib/                        cn, money, initials, store factory
  ui/                         console primitives: Button, Chip, Switch, Modal,
                              Avatar, Field, toast + confirm hosts
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
- Configuration both surfaces read (hotel profile, guest info, enabled
  languages, categories, item menu) lives in `features/requests` — the guest
  app must never import the console features. `features/settings` is UI only.
- Anything shared by two console features goes in `shared/ui`; `shared/ui`
  stays free of domain knowledge (pass names and labels in as props).

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
  it runs before the guest has chosen a language — that screen searches on the
  language's own name, its English name and its code, diacritic-insensitively
  (`matchesLanguage`), and suggests the device language from
  `navigator.languages`.
- The guest thread renders only `isGuestVisible` messages. System lines and
  internal notes are console-only and must never reach `/r/[room]`.
- Never claim a translation the code did not produce. Free text is passed
  through untranslated; `resolveText` returns the language it actually
  resolved to, and callers must render `dir`/`scriptFont` for _that_ language
  and label it accordingly.
- Every language-bearing element sets `dir` and the matching font class via
  `scriptFont(lang)`. Arabic and Persian use IBM Plex Sans Arabic, Hebrew Noto
  Sans Hebrew, Hindi Noto Sans Devanagari, Georgian Noto Sans Georgian, and
  Chinese the system CJK stack (`--font-cjk`) — no multi-megabyte CJK download.
- Adding a language means: a code in `LANGUAGES`, a complete `Phrases` entry,
  three `CANNED` replies, a `SCRIPT_FONT` entry, and a font in `app/layout.tsx`
  if the script is new. TypeScript fails the build until all four are done.
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
