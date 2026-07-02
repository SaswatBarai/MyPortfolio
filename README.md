# Saswat Barai — Portfolio

Personal portfolio site for Saswat Barai, a backend-focused software engineer. Built with Next.js 15 (App Router) and TypeScript, styled in an editorial/mono aesthetic ("portfolio.v3" — monospace uppercase labels, 2px borders, sharp corners, dark theme with an orange accent, restrained motion).

Live: https://saswat.app

## Tech stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui (Radix primitives), Framer Motion / GSAP for motion
- **Data:** MongoDB (Mongoose) — stores schedule requests and available call slots
- **Auth:** JWT (`jose`) in an httpOnly cookie, checked in `middleware.ts`, admin password hashed with `bcryptjs`
- **Email:** Resend — booking confirmations and admin notifications
- **Calendar:** Google Calendar API (`googleapis`) — creates Meet links for approved calls
- **Deploy:** Vercel / Netlify (`netlify.toml` present)

## Folder structure

```
src/
  app/
    page.tsx                 # Home page (hero, experience, projects, tech stack, hire-me)
    layout.tsx                # Root layout + SEO metadata
    projects/
      page.tsx                # Project archive/listing page
      [slug]/page.tsx          # Per-project case study page
    dashboard/
      page.tsx                # Admin dashboard (schedule requests + slot management)
      login/page.tsx           # Admin login
    api/
      auth/login|logout         # Admin session endpoints
      schedule/
        request                # Public: visitor submits a call request
        requests                # Admin-only: list requests
        approve/[id]             # Admin-only: approve + create Meet link + notify
        reject/[id]               # Admin-only: reject a request
        slots                    # GET public (available slots), POST/DELETE admin-only
  components/                 # Page sections + shared UI (Navbar, ScheduleCallModal, etc.)
  components/ui/               # shadcn/ui primitives (button, dialog, tabs, calendar, ...)
  lib/
    projects.ts                # Project content — see below
    auth.ts                     # JWT sign/verify helpers
    mongodb.ts                  # Mongoose connection helper
    google-calendar.ts          # Google Calendar OAuth2 client + event creation
    resend.ts                   # Transactional email senders
    models/                     # Mongoose schemas (AvailableSlot, ScheduleRequest)
  middleware.ts                # Route protection for /dashboard and admin-only API routes
```

## Running locally

Requires Node 18+ and a MongoDB connection string (a free MongoDB Atlas cluster works fine).

```bash
npm install
cp .env.local.example .env.local   # fill in the values below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

See `.env.local.example` for the full list and where to get each value:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Signs the admin session cookie — required, no fallback in production |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` | Dashboard login credentials (password is bcrypt-hashed, never stored in plaintext) |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Transactional email for booking confirmations |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REFRESH_TOKEN` / `GOOGLE_CALENDAR_ID` | Google Calendar OAuth2 for creating Meet links on approved calls |
| `YOUR_EMAIL` | Added as attendee on Meet invites and used as the admin notification recipient |

Never commit `.env.local` — it's already git-ignored.

### Testing

`npm run test:e2e` runs the Playwright suite. The schedule-call smoke test (`tests/schedule-call.spec.ts`) is opt-in only, since it hits your real MongoDB and sends a real email via Resend:

```bash
RUN_LIVE_SMOKE_TEST=1 npm run test:e2e
```

It logs in as admin, creates a throwaway slot for tomorrow, books it through the actual UI, verifies the request lands in the admin queue, then rejects the request and deletes the slot so no test data lingers.

## Editing content

**Projects** are plain data, not CMS-driven. To add, remove, or edit a project card, edit the array in `src/lib/projects.ts` — each entry has a title, date, description, tags, an image (local import from `src/assets/` or a public path), and optional `github`/`website` links. The homepage and `/projects` archive both read from this file directly, so no rebuild-time content sync is needed beyond a normal deploy. Per-project case studies live in `src/app/projects/[slug]/page.tsx` and are keyed off the same `projects` array.

**The `/dashboard` route is not a content editor** — it's an admin panel for the "schedule a call" feature (`ScheduleCallModal`). From there you can:
- Approve or reject incoming call requests (approving creates a Google Meet event and emails both parties)
- Add available call slots manually, or generate them in bulk from a weekly availability template

Access is gated by `middleware.ts`, which verifies the JWT cookie set on login (`/api/auth/login`) before allowing `/dashboard/*` pages or the admin-only `/api/schedule/*` mutation endpoints.
