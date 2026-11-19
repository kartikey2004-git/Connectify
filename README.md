# Connectify

A meeting-scheduling app. Hosts create events, set their weekly availability, and share a personal booking link. Guests pick a day and time and book it, with no account needed.

## Features

- **Google sign-in** for hosts, through Clerk.
- **Events** with a title, description and duration. Public events are listed on the host's profile page; private events are unlisted but can still be booked by anyone with the link.
- **Weekly availability** with a per-day start and end time, a minimum notice before booking, and the host's **time zone**.
- **Personal booking links**: `/<username>` lists a host's public events and `/<username>/<event>` is the booking page.
- **Time-zone correct booking.** Hours are set in the host's zone and each guest sees slots converted to their own, including daylight saving changes.
- **Safe booking.** The server re-checks that the chosen slot is really offered and still free, so a tampered or stale request can't double-book.
- **Meetings dashboard** with upcoming and past meetings (shown in the host's zone) and cancellation of upcoming ones.
- **Light and dark themes** that follow the system setting.

Not included: email notifications, rescheduling, and calendar sync.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19, plain JavaScript |
| Auth | Clerk (Google sign-in) |
| Database | PostgreSQL through Prisma |
| Styling | Tailwind CSS v4 with design tokens, Radix primitives |
| Forms and validation | react-hook-form and zod, shared by the client and the server actions |
| Dates and time zones | date-fns and `@date-fns/tz` |

## Getting started

**Prerequisites:** Node.js 18.18 or newer, a PostgreSQL database (Neon works well), and a Clerk application with the Google social connection enabled.

```bash
cp .env.example .env          # then fill in the values below
npm install                   # also runs `prisma generate`
npx prisma migrate deploy     # creates the database tables
npm run dev
```

Open http://localhost:3000 and sign in with Google. On first sign-in the app creates your account and takes you to the dashboard.

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key (server only, never commit it) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |

Where users land after signing in is set in code (`POST_AUTH_URL` in `lib/constants.js`), not in the environment.

### Clerk and Google

In the Clerk dashboard, keep the Google connection to the basic scopes (`openid`, email, profile). Requesting extra sensitive scopes makes Google show an "unverified app" warning on every sign-in. Production instances also need your own Google OAuth credentials; development instances can use Clerk's shared ones.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server (webpack; Turbopack fails in the client runtime on Next 15.2.8) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`next lint`) |

## Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | public | Landing page |
| `/sign-in`, `/sign-up` | public | Clerk sign-in and sign-up |
| `/<username>` | public | A host's profile and public events |
| `/<username>/<event>` | public | Booking page |
| `/dashboard` | signed in | Upcoming meetings and your public username |
| `/events` | signed in | Create, copy the link of, and delete events |
| `/meetings` | signed in | Upcoming and past meetings |
| `/availability` | signed in | Weekly hours, minimum notice and time zone |
| `/sync-user` | signed in | Post-login step that creates or updates your account, then redirects to the dashboard |

## Project structure

```
app/             Routes, layouts and route-private components
actions/         Server actions: the only code that talks to the database
components/      ui (design-system primitives), layout, events, auth
hooks/           Reusable React hooks
lib/             Auth helper, slot generation, time zones, validators, constants
styles/          Design tokens and global styles
prisma/          Schema and migrations
docs/            Architecture notes
```

## Design system

All colours, type sizes, radius, shadows and z-index layers are tokens in `styles/tokens.css`, shared with the author's portfolio. The app deliberately has no animation or transitions, apart from the hover underline on navigation links, the loading bar, and the circular reveal when switching theme. See the architecture document for the full token tables and component list.

## Deployment

1. Set the environment variables above on your host.
2. Run `npx prisma migrate deploy` against the production database.
3. Switch Clerk to a production instance and add your own Google OAuth credentials.

## Documentation

[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) covers the folder structure, layer boundaries, the time zone and booking design, the design system, architectural decisions, and known technical debt.
