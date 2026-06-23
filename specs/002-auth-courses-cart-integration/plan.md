# Implementation Plan: Auth + Courses + Cart Integration

**Branch**: `002-auth-courses-cart-integration` | **Date**: 2026-06-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-auth-courses-cart-integration/spec.md`

## Summary

Rewire 5 existing mock pages (AuthPage, LandingPage, CourseCatalog, CourseDetails, CartCheckout) and the AppProvider to use real backend API services, React Query hooks, and typed DTOs. Implements Phase 2 (Auth with OAuth popup flow) and Phase 3 (Courses + Catalog + Cart with Tap Payment hosted page) from FRONTEND_PLAN.md. The infrastructure layer (22 services, 17 hooks, 26 type files, query keys, API client, SignalR) is already in place from Phase 1. This phase focuses on replacing mock data in page components with real hook integrations and building the OAuth popup flow.

## Technical Context

**Language/Version**: TypeScript 5+, React 19

**Primary Dependencies**: Vite 6, TanStack Query 5, React Router 7, Tailwind CSS 4, Zod, React Hook Form, sonner (toast), @tanstack/react-virtual, Google Identity Services, Microsoft Identity Library

**Storage**: No client-side persistence beyond HTTP-only cookies (set by backend). All server state via TanStack Query cache.

**Testing**: Vitest 3.2 + React Testing Library + Playwright (E2E)

**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge), Arabic-first RTL layout

**Project Type**: Single-page web application (React frontend communicating with .NET backend API)

**Performance Goals**: Catalog loads within 2s, login completes within 30s, checkout within 2min, 95% content-display rate

**Constraints**: ≤200KB initial bundle (gzipped), no `any` types, no `dangerouslySetInnerHTML`, all UI strings through `i18next`, Tailwind 4 theme tokens only, max 300 lines per file

**Scale/Scope**: 5 page components to rewrite, 1 new AppProvider replacement, ~15 modified files total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality & Clean Architecture | ✅ PASS | Feature-based structure maintained; services/hooks already split by domain |
| II. Backend Integration & State Management | ✅ PASS | All HTTP via typed services; TanStack Query with key factory; no direct fetch in components |
| III. Testing Standards | ✅ PASS | Services and hooks have tests from Phase 1; page components will need smoke tests |
| IV. User Experience Consistency | ✅ PASS | Skeleton loading, error fallbacks, toast notifications, RTL layout, dark mode |
| V. Performance Requirements | ✅ PASS | Route-level code splitting via React.lazy; virtual lists for catalogs; image optimization |

**No violations. Complexity Tracking table empty.**

## Project Structure

### Documentation (this feature)

```text
specs/002-auth-courses-cart-integration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-routes.md
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── features/
│   ├── auth/
│   │   ├── AuthPage.tsx           # REWRITE — login/register/oauth forms with React Hook Form + Zod
│   │   └── services/
│   │       └── auth.service.ts    # EXISTS — no changes needed
│   ├── landing/
│   │   └── LandingPage.tsx        # REWRITE — use useLanding() hook for real data
│   ├── catalog/
│   │   ├── CourseCatalog.tsx      # REWRITE — use useCourseList() with Pagination, Skeleton, EmptyState
│   │   └── CourseDetails.tsx      # REWRITE — use useCourseDetail(), useCourseReviews()
│   ├── cart/
│   │   ├── CartCheckout.tsx       # REWRITE — use useCart(), useCheckout(), coupon validation flow
│   │   └── services/
│   │       └── *.service.ts      # EXISTS — no changes needed
│   └── common/
│       └── hooks/
│           └── use*.ts           # EXISTS — no changes needed
├── providers/
│   └── AppProvider.tsx            # REPLACE — remove mock state, wrap with QueryClientProvider
├── components/
│   ├── shared/                    # EXISTS — Pagination, Skeleton, ErrorFallback, EmptyState
│   └── layout/                    # EXISTS — Navbar, Footer, CartDrawer
├── lib/
│   ├── api.ts                     # EXISTS — HTTP-only cookies, refresh queue
│   ├── query-client.ts            # EXISTS
│   ├── query-keys.ts              # EXISTS
│   └── signalr.ts                 # EXISTS
├── types/
│   └── api/                       # EXISTS — 26 DTO files
└── hooks/
    └── useTheme.ts                # EXISTS
```

**Structure Decision**: Feature-based directory structure per constitution. All infrastructure (services, hooks, types, shared components) is already in place from Phase 1. This phase only modifies page components and the AppProvider.

## Complexity Tracking

No violations to justify.
