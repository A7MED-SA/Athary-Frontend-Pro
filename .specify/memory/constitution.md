# Athary Constitution (دستور منصة آثاري)

> Arabic e-learning platform — React 19 + Vite 6 + Tailwind CSS 4 + TypeScript 5+

## Core Principles

### I. Code Quality & Clean Architecture

Architecture MUST follow SOLID principles adapted for React:

- **S** — Single Responsibility per component/file; no file exceeds 300 lines
- **O** — Components are open for extension via composition, closed for modification
- **L** — Presentational components accept the broadest reasonable props; never require unused props
- **I** — Hooks and services expose narrow, focused interfaces; no god-hooks or god-services
- **D** — Service modules depend on abstract DTO contracts, not concrete fetch implementations

TypeScript MUST be strict:

- `noUncheckedIndexedAccess` enforced; `any` is FORBIDDEN — use `unknown` with type guards
- Every entity MUST have a branded type for its ID (e.g., `CourseId` = `string & { __brand: 'CourseId' }`)
- API DTOs MUST be defined in `src/types/api/` — one file per domain module
- Exhaustive type guards (`switch` with `default: assertNever`) REQUIRED for union types

Directory structure MUST be feature-based, not file-type-based:

```
src/
├── features/          # Feature modules (courses, auth, quiz, …)
│   ├── courses/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.ts
│   └── …
├── shared/            # Shared UI kit, utilities, types
├── lib/               # Third-party wrappers (axios, signalr, query-client)
└── pages/             # Route-level lazy-loaded entry points
```

Zero circular dependencies — verified by `madge` in CI.

### II. Backend Integration & State Management

All HTTP communication MUST go through typed service modules in `src/features/*/services/`. Direct `fetch` or raw `axios` calls in components are FORBIDDEN.

Server state MUST be managed via TanStack Query (`@tanstack/react-query`):

- Every `useQuery` call MUST have a structured key factory (`queryKeys.courses.list()`)
- Mutations MUST use optimistic updates where user-perceptible latency > 300ms
- Query invalidation MUST happen on mutation success, not on mount
- `staleTime` defaults to 30s for list queries, 5min for static reference data

Every API interaction MUST handle four states — loading, error, empty, success:

- **Loading**: Skeleton pattern (NOT spinner) for content > 200ms; inline shimmer for small elements
- **Error**: `sonner` toast for background failures; inline error + retry button for blocking failures
- **Empty**: Illustrated empty state with CTA where applicable
- **Success**: Render with proper RTL layout

Real-time updates MUST go through a single typed SignalR connection managed by `src/lib/signalr.ts`:

- Hub method names MUST match backend hub contracts
- Connection state MUST be exposed via React context
- Automatic reconnection with exponential backoff
- Connection health exposed as a TanStack Query

Client-only state (UI state, form state) MUST use Zustand stores scoped to feature modules. Global Zustand stores are FORBIDDEN.

DTO fields MUST mirror backend contracts exactly — especially `firstName`, `lastName`, `profileImageUrl`, `sessionId`.

### III. Testing Standards (NON-NEGOTIABLE)

Three-tier test pyramid:

**Tier 1 — Unit (Vitest)**
- Every service file MUST have a corresponding `*.test.ts` with ≥80% line coverage
- Every hook MUST have tests for: initial state, each returned value, cleanup on unmount
- Utility functions MUST have 100% branch coverage
- Mock fetch/QueryClient at the service boundary; do NOT mock child components

**Tier 2 — Component (Vitest + React Testing Library)**
- Every page MUST have a smoke test (renders without crash, key elements present)
- Interaction tests for all user flows (click, type, submit, navigate)
- Test behavior, NOT implementation — no testing of internal state, only rendered output
- Use `@testing-library/user-event` for user interactions, NOT `fireEvent`
- Query by role/text, NEVER by test ID (data-testid is FORBIDDEN)

**Tier 3 — E2E (Playwright)**
- Critical user journeys: registration → browse → enroll → complete quiz
- Auth flows: login, OAuth callback, token refresh, logout
- RTL verification: all pages render correctly in Arabic
- Accessibility: full tab-order walkthrough per page

Test files MUST be co-located with source:
```
components/QuizCard.tsx
components/QuizCard.test.tsx    ✓
__tests__/QuizCard.test.tsx     ✗ FORBIDDEN
```

CI MUST block merge if coverage drops below 70% (unit + component combined).

### IV. User Experience Consistency

Design tokens MUST come from Tailwind 4 theme configuration only:
```
theme.extend.colors.primary  ✓
text-blue-600                 ✗ FORBIDDEN
```

All UI MUST be Arabic-first:

- `dir="rtl"` on `<html>`; CSS logical properties (`margin-inline-start`, `padding-block`) preferred over directional
- Arabic font stack: `'Noto Sans Arabic', 'Tajawal', system-ui, sans-serif`
- `i18next` with `ar` as default locale and `en` as fallback
- All text visible to users MUST pass through `t()` — no hardcoded Arabic or English strings
- Numbers, dates, currencies MUST use `Intl.NumberFormat('ar-SA')` / `Intl.DateTimeFormat('ar-SA')`

Error handling:

- Every route MUST be wrapped in a React Error Boundary with a fallback UI in Arabic
- User-facing errors MUST use `sonner` toasts (success / error / info variants)
- Form validation errors MUST appear inline below the field, in Arabic
- Network errors MUST show a retry-able inline banner, not a generic page crash

Loading:

- Skeleton components for: cards, tables, profile headers, quiz questions
- Shimmer animation for inline content placeholders
- Full-page spinner is FORBIDDEN — use route-level Suspense with layout-aware fallback

Accessibility (WCAG 2.1 AA minimum):

- All interactive elements MUST be keyboard-navigable
- Images MUST have descriptive `alt` text (Arabic)
- Color MUST NOT be the sole differentiator for status or meaning
- Focus indicators MUST be visible (minimum 2:1 contrast ratio against adjacent colors)
- ARIA labels in Arabic for complex widgets (tabs, accordions, modals)

Design consistency is enforced via visual review in Storybook — every shared component MUST have a story.

### V. Performance Requirements

Route-level code splitting:

- Every page file MUST use `React.lazy(() => import('./pages/SomePage'))` with `<Suspense>`
- No page module may exceed 50KB (gzipped) independently
- Initial bundle MUST NOT exceed 200KB (gzipped, all routes combined)

Image optimization:

- All user-uploaded images served as WebP via backend; frontend MUST use `<picture>` with WebP fallback
- `loading="lazy"` on all below-the-fold images
- Explicit `width` + `height` attributes to prevent Cumulative Layout Shift

Re-render prevention:

- `React.memo` on components that render often (cards, list items, nav elements)
- `useMemo` for expensive computations (search filtering, quiz scoring)
- `useCallback` for callbacks passed as props to memoized children
- Zustand selectors MUST pick primitive values, NOT entire objects, to avoid unnecessary subscriptions

Large lists:

- `@tanstack/react-virtual` for any list exceeding 50 items (tables, activity feeds, course catalogs)
- Infinite scroll with intersection observer for paginated feeds

Bundle monitoring is automated: CI posts a comment with the gzipped size diff on every PR. Any increase > 10KB requires justification.

## Additional Constraints

**Technology Stack**: React 19 + Vite 6 + Tailwind CSS 4 + TypeScript 5+ — no other UI frameworks (no MUI, no Ant Design, no Chakra). Radix UI primitives are permitted where custom ARIA patterns are needed (dropdowns, dialogs, popovers). Tailwind 4 plugin ecosystem is permitted.

**State Management**:
- Redux is FORBIDDEN. Server state → TanStack Query. Client state → Zustand (scoped per feature). URL state → React Router `useSearchParams` + `query-string` for serialization.
- SignalR for real-time only — NOT for request/response patterns.

**Security**:
- `dangerouslySetInnerHTML` is FORBIDDEN — use a sanitized Markdown renderer for rich text
- CSP headers MUST be set in production: `default-src 'self'`, `script-src 'self'`, `img-src 'self' https: data:`
- OAuth tokens stored in HTTP-only cookies (set by backend), NOT in `localStorage`
- All user input MUST be validated client-side via Zod schemas before submission

**Environment Configuration**:
- All env vars typed via `src/lib/env.ts` with Zod runtime validation at Vite build time
- `VITE_API_BASE_URL`, `VITE_SIGNALR_URL`, `VITE_OAUTH_CLIENT_ID` are REQUIRED
- `VITE_` prefix enforced by Vite — only these variables are available client-side
- No secrets in client code (no API keys, no tokens)

**Internationalization**:
- Arabic is the primary locale; English is secondary
- All UI strings MUST go through `i18next`; 100% translation coverage required for both locales
- Number/currency/datetime formatting uses `Intl` API, NOT hardcoded formats

## Development Workflow

**Branching**: Feature branches MUST follow `feat/###-feature-name` where `###` is the issue number. Hotfix branches use `hotfix/###-description`.

**PR Gates** (MUST ALL PASS before merge):

| Gate | Tool | Criteria |
|------|------|----------|
| Lint | ESLint | Zero errors, zero warnings |
| Type-check | `tsc --noEmit` | Zero type errors |
| Format | Prettier | All files match |
| Unit + Component tests | Vitest | ≥70% line coverage, zero failures |
| Bundle size | `vite build` + size-report | ≤200KB initial JS (gzipped) |
| Circular deps | `madge` | Zero cycles |
| E2E (select PRs) | Playwright | Full critical-journey suite passes |

**Review process**:
- At least one reviewer MUST verify constitution compliance
- Any diff > 300 lines MUST have a reviewer, not just a CI pass
- Storybook review screenshots REQUIRED for any UI change (uploaded as PR comment)
- Mobile responsive check REQUIRED for layout changes

**Constitution amendments**:
- Propose changes via PR to `.specify/memory/constitution.md`
- MAJOR version bump for incompatible principle changes
- MINOR version bump for new sections
- PATCH version bump for clarifications
- Each amendment MUST include a migration plan for existing non-compliant code

**Mock data phase-out**: All `src/features/*/services/*.mock.ts` files MUST be replaced with real API calls following FRONTEND_PLAN.md schedule. New mock data for unimplemented features is permitted ONLY during active feature development and MUST be removed before the feature PR merges.

## Governance

This constitution supersedes all ad-hoc coding practices in the `Pro_Front` repository. Every PR, spec, plan, and task MUST be checked against these principles at the review gate.

Complexity MUST be justified: any deviation (e.g., skipping a test, adding a new dependency, introducing a global store) MUST be documented in the Complexity Tracking table of the implementation plan with the rejected simpler alternative.

Use `AGENTS.md` for runtime development guidance (points to the current execution plan). Use `docs/FRONTEND_PLAN.md` for the master integration roadmap. Use `docs/MODIFICATION_GUIDE.md` for backend contract reference.

Violations of this constitution are grounds for blocking a PR or requesting a re-plan.

**Version**: 1.0.0 | **Ratified**: 2026-06-22 | **Last Amended**: 2026-06-22
