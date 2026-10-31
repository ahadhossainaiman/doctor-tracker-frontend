# Doctor Tracker: System Design

Companion to `docs/SRS.md`. UI details live in `docs/DESIGN.md` (frontend repo).

## 2.1 High-Level Architecture

```
Browser
  |  (single origin, cookies)
  v
Next.js frontend (App Router)  --middleware: checks auth cookie
  |  rewrites /api/* -->
  v
Express API (stateless)
  |-- middleware: helmet, cors, rate-limit, cookie-parser, request-id, sanitize
  |-- routes -> controllers -> services -> repositories(Mongoose)
  |-- Zod validation + central error handler
  v
MongoDB (users, doctors, patients)
```

## 2.2 Data Flow Examples

**Login:** form (React Hook Form + Zod) -> `POST /api/v1/auth/login` -> verify bcrypt -> set `accessToken` (15m) and `refreshToken` (7d) httpOnly cookies -> redirect to dashboard.

**List doctors:** URL query (`?q=card&specialization=Cardiology&page=2`) -> TanStack Query -> `GET /doctors` -> Zod-validated query -> build filter -> `find().sort().skip().limit()` + `countDocuments` in parallel -> `{data, meta}`.

**Add patient under doctor:** dialog -> `POST /doctors/:id/patients` -> create patient + `$inc patientCount` on doctor -> invalidate doctor, patients and dashboard queries.

## 2.3 API Design (REST, prefix `/api/v1`)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | login |
| POST | `/auth/logout` | logout |
| POST | `/auth/refresh` | rotate access token |
| GET | `/auth/me` | current user |
| GET | `/doctors` | list: `q, specialization, hospital, from, to, sort, order, page, limit` |
| POST | `/doctors` | create |
| GET | `/doctors/:id` | detail |
| PATCH | `/doctors/:id` | update (optional) |
| DELETE | `/doctors/:id` | delete (optional, 409 if patients exist) |
| GET | `/doctors/:id/patients` | doctor's patients, paginated + search |
| POST | `/doctors/:id/patients` | add patient under doctor |
| DELETE | `/doctors/:id/patients/:patientId` | remove patient from doctor |
| GET | `/patients` | list: `q, condition, doctor, gender, from, to, sort, order, page, limit` |
| GET | `/patients/:id` | detail |
| PATCH | `/patients/:id` | edit (handles doctor reassignment counts) |
| DELETE | `/patients/:id` | delete |
| GET | `/meta/filters` | distinct specializations, hospitals, conditions for dropdowns |
| GET | `/dashboard/summary` | KPI numbers |
| GET | `/dashboard/patients-per-doctor?limit=10` | bar chart |
| GET | `/dashboard/timeseries?range=30d&interval=day` | line chart |
| GET | `/dashboard/conditions?limit=6` | donut |
| GET | `/dashboard/specializations` | doctors by specialization |
| GET | `/health` | health check |

**Response envelope**
- Success: `{ success: true, data, meta? }` where `meta = { page, limit, total, totalPages }`.
- Error: `{ success: false, error: { code, message, details? } }` with proper HTTP status (400, 401, 403, 404, 409, 422, 429, 500).

## 2.4 Query & Aggregation Strategy

- **Search:** MongoDB text index for word search, plus anchored case-insensitive prefix match on `name` for type-ahead feel. Escape user regex input.
- **Pagination:** offset (`skip/limit`) with capped `limit`; cursor pagination is the scale-up path (mention in README).
- **Counts:** run `find` and `countDocuments` in parallel (`Promise.all`); use `lean()` and field projection.
- **Patients per doctor:** read from denormalized `doctor.patientCount` sorted desc with index (O(limit)), no `$lookup`.
- **Time series:** `$match` on `registeredAt` range (uses index) -> `$group` by `$dateTrunc` (day/week/month) -> `$sort`. Fill missing buckets on the server so charts have no gaps.
- **Condition donut:** `$match` -> `$group` by condition -> `$sort` -> `$limit` (+ "Other").
- **Caching:** short in-memory TTL cache (60s) for dashboard endpoints, invalidated on write. Redis is the scale-up path.
- **Consistency of `patientCount`:** update with `$inc` in the same service call (Mongo transaction if a replica set is available; otherwise a `recount` script as safety net).

## 2.5 Authentication & Authorization Design

- Passwords: bcrypt (cost 12).
- Access token JWT 15 min, refresh token JWT 7 days, both httpOnly, `SameSite=Lax` (or `None; Secure` if deployed on different domains), `Secure` in production.
- Refresh token revocation via `tokenVersion` on the user (bumped on logout).
- Express `authenticate` middleware on all routers except `/auth/login`, `/auth/refresh`, `/health`; `authorize('admin')` middleware ready for roles.
- Next.js `middleware.ts` checks cookie presence to redirect early; the real source of truth is the API (401 -> client clears state and redirects to login).
- Login rate limit (e.g. 5 per 15 min per IP+email).

## 2.6 Backend Structure (`doctor-tracker-backend`)

```
src/
  config/        env.ts (Zod-validated), db.ts, cors.ts
  modules/
    auth/        routes, controller, service, schema (zod)
    doctors/     routes, controller, service, model, schema
    patients/    routes, controller, service, model, schema
    dashboard/   routes, controller, service
    meta/
  middlewares/   authenticate, validate, errorHandler, rateLimiter, requestId, notFound
  utils/         ApiError, asyncHandler, response helpers, escapeRegex, pagination, cache
  scripts/       seed.ts (admin + fake doctors/patients), recount.ts
  app.ts         express app wiring
  server.ts      bootstrap + graceful shutdown
tests/           (optional) supertest for auth + lists
.env.example  README.md  docs/SRS.md  docs/SYSTEM_DESIGN.md
```

Stack: Node 20, Express, TypeScript, Mongoose, Zod, jsonwebtoken, bcrypt, cookie-parser, helmet, cors, express-rate-limit, express-mongo-sanitize, pino/morgan, tsx, ESLint + Prettier.

## 2.7 Frontend Structure (`doctor-tracker-frontend`)

```
src/
  app/
    (auth)/login/page.tsx
    (dashboard)/layout.tsx            sidebar + topbar shell
    (dashboard)/dashboard/page.tsx
    (dashboard)/doctors/page.tsx
    (dashboard)/doctors/[id]/page.tsx
    (dashboard)/patients/page.tsx
    loading.tsx, error.tsx, not-found.tsx
  components/
    ui/            shadcn primitives
    layout/        Sidebar, Topbar, MobileNav, PageHeader
    shared/        DataTable, Pagination, SearchInput, FilterBar, DateRangePicker,
                   ConfirmDialog, EmptyState, StatCard, Skeletons
    charts/        PatientsPerDoctorChart, TrendChart, ConditionDonut, SpecializationChart
    doctors/       DoctorForm, DoctorsTable, DoctorFilters
    patients/      PatientForm, PatientsTable, PatientFilters
  features/        api hooks per domain (useDoctors, useCreatePatient, ...)
  lib/             apiClient (fetch wrapper), queryClient, utils, constants, validators (zod), motion
  hooks/           useDebounce, useUrlState
  types/
  middleware.ts
.env.example  README.md  docs/
```

Stack: Next.js (App Router) + TypeScript, Tailwind CSS v4, shadcn/ui, Motion, cmdk, nuqs, TanStack Query (server state), TanStack Table (optional), React Hook Form + Zod, Recharts, lucide-react, sonner (toasts), next-themes.

**State management:** server state in TanStack Query (cache, dedupe, invalidation); URL = source of truth for filters/page; a tiny Zustand store (or Context) only for UI state like sidebar open. No Redux needed.

**Avoiding unnecessary re-renders:** debounce search (300ms), `keepPreviousData` for pagination, memoized table columns/charts, split components so filters do not re-render tables, dynamic import for chart components, server components for static shells.

## 2.8 UI/UX

See `docs/DESIGN.md` (full 2026 design brief: tokens, layout, dashboard bento grid, interactions, accessibility, performance targets).

## 2.9 Technical Decisions to Write in README (pick 2)

1. **Denormalized `patientCount` + compound indexes** instead of `$lookup`/runtime counting: O(limit) reads for the "patients per doctor" chart and sort, at the cost of keeping a counter consistent (handled by `$inc` and a `recount` script).
2. **httpOnly-cookie JWT + TanStack Query with URL-driven filters** instead of localStorage tokens + Redux: safer against XSS, fewer lines of state code, shareable filtered views, automatic cache invalidation.

Alternative candidates: Zod-based validation on both sides, offset vs cursor pagination, rewrites proxy vs CORS.

## 2.10 Scalability Notes

Stateless API behind a load balancer; indexes cover every list query; cursor pagination and Redis cache as next steps; read replicas for dashboard; background job for recount; Docker + docker-compose (api, web, mongo) for one-command setup.
