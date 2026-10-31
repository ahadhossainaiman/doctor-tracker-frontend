### 2.8 UI/UX Design Direction (2026)

**Goal:** a calm, data-dense, premium admin product, at the level of Linear, Vercel or Stripe dashboards. UI/UX is a top evaluation criterion, so treat this section as the design brief. Save it in the frontend repo as `docs/DESIGN.md`.

**Design principles**

- **Bento dashboard:** modular cards on a 12-column grid, one clear finding per card, generous whitespace.
- **Layered surfaces:** soft elevation, 1px hairline borders, large radius. Glass blur only on overlays (command palette, popovers, sheets), never on data cards.
- **Speed as design:** skeletons that match the final layout, optimistic updates, prefetch on hover, no layout shift.
- **Keyboard and touch first:** command palette, shortcuts, 44px touch targets, bottom navigation on mobile.
- **Dark mode is first-class:** system default plus a toggle, designed together with light, not inverted afterwards.

**Design tokens**

| Token | Value / rule |
| --- | --- |
| Color space | OKLCH CSS variables via Tailwind v4 `@theme`; semantic names (`--surface`, `--surface-raised`, `--border`, `--text`, `--text-muted`, `--brand`, `--success`, `--warning`, `--danger`) |
| Brand | One accent (indigo or teal), used for primary actions, active nav and the main chart series only |
| Neutrals | Warm-neutral grays, no pure black or pure white backgrounds; dark surface around 14-16% lightness |
| Chart palette | 6 colorblind-safe colors, the same condition/specialization keeps the same color in every chart |
| Typography | Geist Sans (or Inter variable) + Geist Mono via `next/font`; scale 12/14/16/20/24/32; `tabular-nums` on every number |
| Radius & shadow | Radius 10 (inputs), 14 (cards), 20 (sheets); two-layer soft shadows, stronger only for overlays |
| Spacing | 4px base scale; card padding 20-24px; page gutter 16 (mobile) / 32 (desktop) |
| Motion | 150-250ms, ease-out or light spring; Motion library for list/card enter, sheet and dialog transitions; View Transitions API for page changes where supported |

**Layout**

- **Desktop:** collapsible sidebar (264px / 72px icon rail), top bar with breadcrumb, global search / command palette trigger (Cmd+K), theme toggle and user menu.
- **Mobile (360px+):** bottom tab bar (Dashboard, Doctors, Patients), page title bar, tables become stacked cards, filters open in a bottom sheet.
- **Content width:** max 1440px, container queries so cards adapt to their own width, not only the viewport.

**Dashboard (bento grid)**

- Row 1: four KPI cards, each with value, small sparkline and delta vs the previous period.
- Row 2: large trend card (area chart, range switch 7d/30d/90d/12m, day/week/month toggle) + condition donut with a direct-labelled legend.
- Row 3: patients-per-doctor horizontal bars (top 10, click goes to that doctor) + doctors-by-specialization.
- Row 4: recent patients and recent doctors lists.

**Interaction details that make it feel 2026**

- Command palette (cmdk): jump to pages, search doctors/patients, quick actions ("Add doctor", "Add patient").
- Filters as removable chips under the filter bar, URL-synced, with a one-click Reset; saved "views" are an optional extra.
- Edit in a side sheet (not a full page); create in a dialog; destructive actions use a confirm dialog or an "Undo" toast.
- Optimistic updates with rollback; row-level pending state instead of full-table spinners.
- Table density toggle (comfortable / compact), sticky header, column sorting indicators, row hover actions.
- Empty states with a short message and a primary action; error states with a Retry button.
- Number and date formatting through `Intl` (compact numbers, relative dates with absolute date in tooltip).

**Accessibility & quality bar**

- WCAG 2.2 AA: contrast 4.5:1 for text, visible `:focus-visible` rings, labels on every input, keyboard-reachable dialogs and menus.
- Charts have an accessible name and a data-table fallback ("View data" toggle).
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.
- Targets: Lighthouse 90+ (performance, accessibility, best practices), LCP under 2.5s, INP under 200ms, near-zero layout shift.
- Test and screenshot at 360, 768, 1280 and 1536px, in light and dark.

**Tech choices serving the design** Latest stable Next.js (App Router, React 19, Server Components, Suspense streaming), React Compiler if the installed Next.js version supports it, Tailwind CSS v4, shadcn/ui (Radix), Motion, cmdk, vaul (mobile bottom sheets), Recharts, nuqs (typed URL state), sonner.