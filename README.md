# Doctor Tracker

## Elevator Pitch

Doctor Tracker is the admin portal for a clinic. One seeded admin signs in with httpOnly cookies, then searches, filters, and pages doctors and patients, and reads a dashboard of totals and charts. The browser talks only to this Next.js app. Next.js rewrites `/api/*` to a separate Express server, so the session cookies stay on one origin.

## Setup Guide

Requirements: Node.js 20 or newer. The API in `doctor-tracker-backend` must already be running.

```bash
cp .env.example .env
npm install
npm run dev
```

The app listens on `http://localhost:3000`. `.env.example` sets `API_URL` to the Express origin only (`http://localhost:4000`), with no path and no trailing slash.

Seed login, created by the API seed script:

- email: `admin@doctortracker.local`
- password: `ChangeMe123!`

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` / `npm start` | Production build and server |

## System Architecture

```
Browser
  |  same origin, credentials: include
  v
Next.js (App Router, port 3000)
  |  rewrite /api/:path* -> API_URL/api/:path*
  v
Express /api/v1 (port 4000)
  v
MongoDB: users, doctors, patients
```

Route protection in `src/proxy.ts` checks that an access or refresh cookie is present. The API still authorizes every call. On a 401, `src/lib/apiClient.ts` refreshes once and retries. If refresh fails, the query cache is cleared and the browser goes to `/login?next=`.

Server data lives in TanStack Query hooks under `src/features`. Search, filters, sort, and page live in the URL through nuqs. Lists keep the previous page on screen while the next page loads.

```
src/
  app/            routes: login, dashboard, doctors, patients
  components/     shell, shared list toolkit, feature views
  features/       auth, doctors, patients, dashboard, meta
  lib/            api client, tokens, motion, formatting
```

## Technical Decisions

1. **Same-origin API rewrite.** The task allows either a Next.js-only app or a separate client and Express server. This repo is the client. The browser calls `/api/v1/...` on port 3000, and Next.js proxies that to Express. Cookies stay first-party, so the UI does not use CORS or `localStorage` tokens.

2. **Recharts loads only with the dashboard.** The chart module is imported through `next/dynamic` from the dashboard route. Doctors, patients, and login do not download it. A label hash picks one of six chart colors, so a condition or specialization keeps the same color on every chart.

## Visual Evidence

- Desktop: `docs/screenshots/desktop.png`
- Mobile: `docs/screenshots/mobile.png`

## Submission

- Frontend: this repository
- API: `doctor-tracker-backend`
- Admin: `admin@doctortracker.local` / `ChangeMe123!`
