# Connectify — Architecture & Design System

Next.js 15 (App Router) · React 19 · Clerk auth · Prisma/Postgres · Tailwind CSS v4 · shadcn/Radix primitives. Plain JavaScript (see [Decisions](#decisions)).

## Folder structure

```
app/                      Routes only: pages, layouts, and route-private components
  provider.jsx            next-themes provider (class strategy, system default)
  _components/            Landing page content
  (auth)/                 Clerk sign-in / sign-up
  (main)/                 Authenticated app shell (section nav + page title)
    _components/          Section nav + nav item config
    dashboard/ events/ meetings/ availability/
      _components/        Components used by that one route only
  [username]/             Public profile → [eventId]/ public booking page
  sync-user/              Post-auth fallback: mirrors the Clerk user into the database, then /dashboard
actions/                  Server actions: the only code that talks to the database
components/
  ui/                     Design-system primitives (button, card, input, badge, ...)
  layout/                 Navbar (server) + NavbarFrame (client scroll state), footer, app shell, user menu, theme toggle
  events/                 Event UI shared by several routes (card, form, create drawer)
  user-avatar.jsx         Shared app component
hooks/use-fetch.js        Loading/error/data wrapper around a server action
lib/
  auth.js                 requireUser(): Clerk session → database user (creates it on first use)
  availability.js         Pure slot / availability logic (no I/O)
  clerk-appearance.js     Clerk theme from the design tokens
  sync-user.js            Clerk user → database upsert (used by /sync-user and requireUser)
  constants.js            Days, time slots, defaults, storage keys, limits
  username.js             generateUsername(): valid default username for new users
  validators.js           Zod schemas, shared by client forms and server actions
  prisma.js, utils.js     DB client, cn()
styles/                   tokens · base · typography · layout · utilities · calendar (globals.css imports them in that order)
prisma/                   Schema + migrations
```

### Layering and boundaries

| Layer | May import | Must not |
|---|---|---|
| `app/**` pages | components, actions, lib, hooks | contain Prisma queries |
| `components/**` | `ui`, hooks, actions, lib | import from `app/` |
| `actions/**` | lib (auth, validators, availability, prisma) | import components |
| `lib/**` | other lib files | import actions, components, hooks |

A component is placed by reach: used by one route → that route's `_components/`; by several routes → `components/<area>/`; by every feature and domain-free → `components/ui/`. A madge scan finds no circular dependencies.

### Request flow

- **Reads (pages)** are server components that call actions directly (`getUserEvents`, `getUserMeetings`, ...).
- **Writes** are client forms: react-hook-form + zod → `useFetch(action)` → server action. Actions re-validate with the same zod schema because they can be invoked directly.
- **Auth**: `middleware.js` guards `/dashboard`, `/events`, `/meetings`, `/availability`; each action calls `requireUser()` and checks ownership. `requireUser()` creates the database user on first use (`lib/sync-user.js`), so any path that reaches a protected page without `/sync-user` still works. Public reads (`getEventDetails`, `getEventAvailability`, `getUserByUsername`, `createBooking`) are intentionally unauthenticated.

## Design system

The visual language is shared with the author's portfolio (`1_kartikey`): same tokens, type scale, primitives and page frame. Raw values live in **`styles/tokens.css`** and nowhere else (no hex/rgb or raw z-indexes in components). Dark mode is the `.dark` class on `<html>`, managed by `next-themes` (`attribute="class"`, `defaultTheme="system"`, storage key `theme`); the toggle reveals the new theme as a circle expanding from the button (View Transitions API via `react-theme-switch-animation`, 650 ms), same as the portfolio.

| Group | Tokens | Notes |
|---|---|---|
| Surfaces | `background foreground card popover` (+`-foreground`) | Light: white / near-white cards. Dark: black / `#0a0a0a` |
| Brand | `primary secondary accent` (+`-foreground`) | Monochrome |
| Content / controls | `muted muted-foreground border input ring` | Dark borders are translucent white |
| Status | `destructive success warning` | Light/dark values; text on destructive is white |
| Shape | `--radius` 0.5rem → `rounded-xs/sm/md/lg/xl` | |
| Type scale | `text-xs … text-6xl` | Compact: base 14px (xs 11, sm 12, lg 16 …) |
| Elevation | `shadow-popover`, `shadow-overlay` | Surfaces are flat; shadows only on floating UI |
| Motion | none, except nav-link hover underline and the theme-switch reveal | See "No motion" below |
| Z-index | `--z-sticky` 40 (navbar) · `--z-overlay` 50 (drawers, selects) | Use `z-(--z-…)` |
| Font | Geist Sans / Geist Mono (`--font-geist-sans/-mono`) | Headings weight 450, negative tracking |
| Breakpoints, spacing | Tailwind defaults | sm 640 / md 768 / lg 1024 / xl 1280 |

### Type roles and layout classes (`typography.css`, `layout.css`)

`text-heading-48/40/32/24/20/16`, `text-copy-18/16/14/13` (+ `-mono`), `heading-lg`, `heading-sm`, `body-text`, `eyebrow` (mono, uppercase, tracked). `page-shell` / `section-shell` (max-width 48rem, responsive gutters), `surface` (translucent card with soft border), `thin-scrollbar`.

### Page frame

`app/layout.js` → `<div class="px-3">` (gutter on a wrapper, not `<body>`: Radix scroll-lock rewrites body padding) → `Navbar` (sticky, blurred, text links with an underline that grows on hover) → `AppShell` (centered `max-w-3xl` column) → page + `Footer`. Signed-in sections add a horizontal `SectionNav` in the same link style.

### Components (`components/ui`)

`Button` (default, destructive, outline, secondary, ghost, link × default, xs, sm, lg, icon, icon-xs/sm/lg) · `Card` · `Badge` · `Input` · `Textarea` · `Label` · `Checkbox` · `Select` · `Tabs` · `Drawer` · `Popover` · `Command` (cmdk) · `Avatar` · `Skeleton` · `EmptyState` · `ErrorState` · `FormField` · `FieldError` · `LoadingBar`.

Button, Input, Card, Badge, Skeleton, EmptyState, ErrorState and Select are copied from the portfolio unchanged apart from Radix import paths. Each primitive carries `data-slot` and handles hover / focus-visible / disabled / `aria-invalid` itself.

### CSS

No component CSS files. `calendar.css` re-themes react-day-picker, which defines its own accent on `.rdp-root`.

### Clerk widgets

`lib/clerk-appearance.js` themes every Clerk surface (sign-in, sign-up, user menu, account modal) from the tokens via CSS variables, passed once to `<ClerkProvider appearance>` in `app/layout.js`. Because the values are `var(--…)`, light/dark follows the `.dark` class with no `@clerk/themes` package. Clerk's own branding footer and dev-mode banner are left as Clerk renders them.

### No motion

By design the app does not animate. `styles/motion.css` sets `animation: none; transition: none` on everything (unlayered, so it beats every Tailwind utility and library class), plus a scoped `!important` override for vaul, which injects its own high-specificity slide/fade styles. Two exemptions: loading bars (`.loading-bar`) so they still indicate progress, and `.allow-motion`, used only on the header and section nav so their hover underline (grows from the left, 300 ms ease-out, link colour 150 ms) matches the portfolio exactly. The theme toggle's circular reveal is unaffected: it animates `::view-transition` pseudo-elements, which that rule never matches. Don't add `transition-*`, `animate-*` or scroll-reveal effects; they would be neutralised anyway.

## Decisions

- **Stay on JavaScript.** The prompt asks for strict TypeScript, but converting ~60 files with no tests and no running database is a high-risk rewrite and the build/lint baseline is clean. Zod schemas already give runtime typing at every boundary. Revisit as a dedicated, test-backed migration.
- **Dependencies.** Added to match the portfolio design: `geist`, `next-themes`, `react-theme-switch-animation`, `react-icons`. Added for the time zone picker: `cmdk`, `@radix-ui/react-popover`. Removed: `framer-motion`, `@radix-ui/react-dialog` (provided by `vaul`).
- **Sidebar replaced by a section nav.** The portfolio's single 48rem column has no room for a 16rem sidebar, so the signed-in app uses a horizontal text nav instead.
- **Server actions are the service layer.** A separate repository/service layer would add indirection for ~8 small queries.
- **Post-login redirect.** Every login or sign-up is forced to `/sync-user` (`POST_AUTH_URL`, set on `<SignIn>`, `<SignUp>` and the header `SignInButton`), which syncs the user and continues to `/dashboard`, whichever page sent them to sign in. The destination lives in code, not `.env`.
- **Time zone picker** (`availability/_components/time-zone-select.jsx`): a searchable combobox (Popover + cmdk Command) with region groups, UTC offsets, and the viewer's zone and UTC pinned on top. cmdk's default matcher is fuzzy and ranks unrelated zones first, so it uses a strict one (`scoreTimeZoneMatch` in `lib/time.js`: every typed word must appear, word-start matches rank first) plus aliases for legacy and common names (`Asia/Calcutta` ↔ Kolkata/India, `Europe/Kiev` ↔ Kyiv, ...).
- **Usernames** are 3–30 characters of letters, numbers, hyphens and underscores (`usernameSchema`). New users get a generated one (`generateUsername`: lowercase name, hyphenated, plus a 4-character id suffix) that always satisfies the schema, so the dashboard form never rejects its own pre-filled value.
- **Auth error text** is now uniform (`Unauthorized`, `User not found in database.`) instead of varying per action.
- **`deleteEvent`** renamed from `DeleteEvent` (internal only).
- **`sessionStorage` key** renamed `connectx:postAuthRedirect` → `connectify:postAuthRedirect`; only affects a sign-in already in flight during deploy.

## Time zones and booking integrity

- **Availability hours are wall-clock times in the host's own zone.** `Availability.timeZone` (IANA name, default `UTC`) says which. `DayAvailability.startTime/endTime` stay time-of-day values ("09:00").
- **Slots are real instants.** `getBookableSlots` (`lib/availability.js`) walks the next 30 days in the host's zone (DST-correct via `@date-fns/tz`) and returns UTC instants. The grid is anchored to each day's start, so a slot is the same instant whenever it is computed; that is what lets the server re-verify it. A slot that would run past the day's end is not offered.
- **Each viewer sees their own zone.** The booking page receives `{ timeZone, slots: [ISO…] }`; the browser groups and labels slots in the guest's zone after mount (and says when the host is elsewhere). The host's meetings and dashboard are formatted on the server in the host's availability zone.
- **`createBooking` trusts only the chosen start.** It re-derives the bookable slots and accepts the booking only if the start is exactly one of them, derives the end from the event duration, and does the check and the insert in one serializable transaction (a concurrent winner yields "no longer available"). Private events remain bookable by link: private means unlisted, not closed, and the Copy Link action relies on that.

## Known limitations / technical debt

1. **No automated test suite.** Nothing here was covered by tests; behaviour was verified by lint, production build, a route smoke test and code review only. Priority targets: `lib/availability.js` (pure, easy to test), `createBooking`.
2. **Landing-page copy** still cites "100+/thousands of professionals" figures and testimonials that are unverified. Content decision.
3. **`getUserByUsername` selects the host's email** though no page renders it; drop the field if not needed.
4. **Username update gives no success feedback**, and `useUser()` may show the stale username until reload.
5. **Unreferenced assets** in `public/`: `logo.png`, `poster.png`, `banner.jpeg`, `banner1.png`. Left in place (look like intentional brand assets); delete or wire up.
6. Deprecated `next lint` will need migrating to the ESLint CLI before Next 16.
