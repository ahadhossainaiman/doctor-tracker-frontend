# Doctor Tracker: Software Requirements Specification (SRS)

Two repos/folders: `doctor-tracker-backend` (Node + Express + MongoDB) and `doctor-tracker-frontend` (Next.js).

## 0. Decisions & Assumptions

1. **Spec conflict.** The task PDF says both "full-stack inside Next.js" and "separate Next.js client + standalone Express server". This project follows the **separate** option (two apps). State this choice in the README.
2. **Single role:** `admin`. All routes need login. Roles are modelled so more can be added later.
3. **A patient belongs to exactly one doctor** (`patient.doctor` reference).
4. **Date filters:** doctors use `createdAt`; patients use `registeredAt` (visit/registration date, editable, defaults to now).
5. **Optional extras:** edit/delete doctor, dark mode, CSV export, skeleton loaders.
6. **Auth style:** JWT in httpOnly cookies (access + refresh), Next.js middleware for route guarding, Express middleware for API guarding.
7. **Avoiding CORS pain:** frontend proxies `/api/*` to the Express server via Next.js `rewrites`, so the browser talks to one origin.

## 1. SRS

### 1.1 Purpose & Scope
Doctor Tracker is a secure admin portal to manage doctors and their patients, with search, filters, pagination and an analytics dashboard. Out of scope: patient-facing portal, appointments, billing, file uploads.

### 1.2 Users
| User | Description |
|---|---|
| Admin | Authenticated user. Full access to dashboard, doctors, patients. |
| Unauthenticated visitor | Can only see the login page. |

### 1.3 Functional Requirements

**Authentication (AUTH)**
- AUTH-1: Login with email + password; returns session via httpOnly cookies.
- AUTH-2: Logout clears cookies.
- AUTH-3: Silent refresh of expired access token.
- AUTH-4: `GET /auth/me` returns current user.
- AUTH-5: Every non-login API route and every UI route except `/login` requires authentication.
- AUTH-6: Rate limit login attempts; lock-out or delay after repeated failures.
- AUTH-7: Admin account created by seed script (no public signup).

**Doctor Management (DOC)**
- DOC-1: Create doctor: name, specialization, hospital, phone, email (all required, email unique).
- DOC-2: List doctors, server-side paginated (default 10, max 50).
- DOC-3: Search by name, specialization, hospital (debounced).
- DOC-4: Filter by specialization, hospital, created date range.
- DOC-5: Sort by name, createdAt, patientCount.
- DOC-6: Doctor detail page shows profile + that doctor's patients (paginated).
- DOC-7: Add a new patient under a doctor (from doctor detail).
- DOC-8: Delete a patient from a doctor's list (with confirm dialog).
- DOC-9 (optional): Edit doctor; delete doctor (blocked with 409 if the doctor still has patients).

**Patient Management (PAT)**
- PAT-1: Patient fields: name, age, gender, phone, email (optional), condition, registeredAt, notes (optional), doctor.
- PAT-2: Dedicated Patients page lists all patients, server-side paginated.
- PAT-3: Search by name/condition/phone.
- PAT-4: Filter by condition, doctor, gender, registered date range.
- PAT-5: Edit patient (modal or side sheet), including reassigning doctor.
- PAT-6: Delete patient with confirmation.
- PAT-7: Doctor's `patientCount` stays correct after create/delete/reassign.

**Dashboard (DASH)**
- DASH-1: KPI cards: total doctors, total patients, patients added this month, average patients per doctor.
- DASH-2: Bar chart: patients per doctor (top 10).
- DASH-3: Line/area chart: patients registered over time, range selector (7d, 30d, 90d, 12m), day/week/month grouping.
- DASH-4: Donut chart: patients by condition (top N + "Other").
- DASH-5: Doctors by specialization (bar or donut).
- DASH-6: Recent activity: latest patients and latest doctors.

**UI/UX (UX)**
- UX-1: Sidebar (desktop) / bottom tab bar (mobile) navigation: Dashboard, Doctors, Patients.
- UX-2: Responsive from 360px to wide desktop.
- UX-3: Loading skeletons, empty states, error states, toast feedback on every mutation.
- UX-4: Filters/search/page stored in the URL query string (shareable, back-button safe).
- UX-5: Accessible forms: labels, inline validation messages, keyboard friendly dialogs.

### 1.4 Non-Functional Requirements
| ID | Requirement |
|---|---|
| NFR-1 Performance | List endpoints respond under 200ms on 10k doctors / 100k patients (indexed). No collection scans for list/search/filter. |
| NFR-2 Scalability | Stateless API, pagination everywhere, indexes documented, aggregation uses `$match` first, counts denormalized. |
| NFR-3 Security | bcrypt hashing, httpOnly + Secure cookies, helmet, CORS allow-list, input validation (Zod), NoSQL-injection sanitising, rate limiting, no secrets in repo. |
| NFR-4 Reliability | Central error handler, consistent error envelope, request IDs in logs. |
| NFR-5 Maintainability | Modular folder structure, typed (TypeScript), reusable components, lint + format. |
| NFR-6 Usability | Lighthouse performance/accessibility 90+ on main pages. |
| NFR-7 Documentation | README per the standardized template (Elevator Pitch, Setup Guide + .env.example, System Architecture, 2 Technical Decisions, Visual Evidence with desktop + mobile screenshots). |

### 1.5 Data Requirements

**User:** `name`, `email` (unique), `passwordHash`, `role`, `tokenVersion`, `createdAt`.

**Doctor:** `name`, `specialization`, `hospital`, `phone`, `email` (unique), `patientCount` (denormalized, default 0), `createdAt`, `updatedAt`.

**Patient:** `name`, `age`, `gender` (male/female/other), `phone`, `email?`, `condition`, `registeredAt`, `notes?`, `doctor` (ObjectId ref), `createdAt`, `updatedAt`.

**Indexes**
| Collection | Index | Serves |
|---|---|---|
| users | `{email:1}` unique | login |
| doctors | `{email:1}` unique | uniqueness |
| doctors | `{createdAt:-1}` | default sort, date filter |
| doctors | `{specialization:1, createdAt:-1}` | specialization filter |
| doctors | `{hospital:1, createdAt:-1}` | hospital filter |
| doctors | `{patientCount:-1}` | sort by load |
| doctors | text `{name, specialization, hospital}` | search |
| patients | `{doctor:1, registeredAt:-1}` | doctor's patient list |
| patients | `{condition:1, registeredAt:-1}` | condition filter, condition chart |
| patients | `{registeredAt:-1}` | date filter, time series |
| patients | text `{name, condition}` | search |

### 1.6 Acceptance Criteria (summary)
- Unauthenticated access to any protected page redirects to `/login`; unauthenticated API call returns 401.
- Every list supports search + filter + pagination together, server-side.
- Creating/deleting a patient updates doctor `patientCount` and dashboard numbers.
- Dashboard loads in one round of parallel requests with cached results.
- Works on mobile and desktop; screenshots of both in README.

### 1.7 Traceability to the Task PDF
| PDF requirement | Covered by |
|---|---|
| Secure login, protected routes, authorization | AUTH-1..7, SYSTEM_DESIGN 2.5 |
| Create doctor (name, specialization, hospital, phone, email) | DOC-1 |
| List, search, filter (date-wise + others), paginate doctors | DOC-2..5 |
| View a doctor's patients, add patient, delete patient | DOC-6..8 |
| Patient page: list, edit, delete | PAT-2, PAT-5, PAT-6 |
| Patient pagination, search, filter (date, condition, others) | PAT-2..4 |
| Dashboard: totals, patients per doctor, date stats, charts | DASH-1..6 |
| Modern UI, responsive, smooth navigation | UX-1..5, DESIGN.md |
| Query optimization, MongoDB indexing, efficient patterns | NFR-1, 1.5, SYSTEM_DESIGN 2.4 |
| Clean structure, reusable components, validation, error handling | NFR-4, NFR-5, SYSTEM_DESIGN 2.6, 2.7 |
| State management and data fetching strategy | SYSTEM_DESIGN 2.7 |
| README template, .env.example, desktop + mobile screenshots | NFR-7 |
| Submission: project link, GitHub repo, credentials | Seeded demo admin documented in README |

**Gaps found in review and how they are closed**
- PDF contradicts itself on the stack: resolved as separate apps (section 0, point 1).
- Doctor deletion is not in the PDF: blocked with 409 if the doctor still has patients; optional.
- "Authorization" is mentioned but only one role exists: role middleware is built and a 403 path is tested.
- Performance goals are only implied: made measurable (NFR-1, NFR-6, explain() check).
- Reviewer access: a seeded demo admin account is documented in both READMEs.
