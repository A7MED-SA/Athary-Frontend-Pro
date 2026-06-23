# Implementation Plan: Dashboards + Secondary Features + Missing Backend Features

**Branch**: `003-dashboards-secondary-features` | **Date**: 2026-06-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-dashboards-secondary-features/spec.md`

## Summary

Connect Student/Instructor/Admin dashboards to real backend APIs, wire secondary pages (Profile Settings, Messaging, Public Instructor Profile, Wishlist, Refunds, Instructor Apply) to real services, and add missing backend features (Coupons CRUD, Payment Methods, Refunds approve/reject, Instructor Requests, User Management). Implements Phase 4 (Dashboards), Phase 5 (Secondary Features), and Phase 6 (Missing Backend Features) from FRONTEND_PLAN.md. The infrastructure layer (22 services, 16 hooks, types, query keys, API client, SignalR) is already in place from Phases 1-3. This phase focuses on replacing mock data in dashboard and secondary page components with real hook integrations.

## Technical Context

**Language/Version**: TypeScript 5+, React 19

**Primary Dependencies**: Vite 6, TanStack Query 5, React Router 7, Tailwind CSS 4, Zod, React Hook Form, sonner (toast), @microsoft/signalr, charting library (Recharts)

**Storage**: No client-side persistence beyond HTTP-only cookies (set by backend). All server state via TanStack Query cache.

**Testing**: Vitest 3.2 + React Testing Library + Playwright (E2E)

**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge), Arabic-first RTL layout

**Project Type**: Single-page web application (React frontend communicating with .NET backend API)

**Performance Goals**: Dashboard loads within 2s, profile updates within 1s, messages delivered via SignalR within 1s, 95% content-display rate

**Constraints**: ≤200KB initial bundle (gzipped), no `any` types, no `dangerouslySetInnerHTML`, Tailwind 4 theme tokens only, max 300 lines per file

**Scale/Scope**: 9 page components to rewrite, ~20 modified files total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality & Clean Architecture | ✅ PASS | Feature-based structure maintained; services/hooks already split by domain |
| II. Backend Integration & State Management | ✅ PASS | All HTTP via typed services; TanStack Query with key factory; no direct fetch in components |
| III. Testing Standards | ✅ PASS | Services and hooks have tests from Phase 1; page components will need smoke tests |
| IV. User Experience Consistency | ✅ PASS | Skeleton loading, error fallbacks, toast notifications, RTL layout, dark mode |
| V. Performance Requirements | ✅ PASS | Route-level code splitting via React.lazy; dashboard data cached via React Query |

**No violations. Complexity Tracking table empty.**

## Project Structure

### Documentation (this feature)

```text
specs/003-dashboards-secondary-features/
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
│   ├── student/
│   │   └── StudentDashboard.tsx      # REWRITE — use useStudentOverview() hook
│   ├── instructor/
│   │   └── InstructorDashboard.tsx   # REWRITE — use useInstructorOverview() hook
│   ├── admin/
│   │   └── AdminDashboard.tsx        # REWRITE — use useAdminOverview() + tab panels
│   ├── profile/
│   │   └── ProfileSettings.tsx       # REWRITE — use useProfile() + presigned URL upload
│   ├── messaging/
│   │   └── MessagingCenter.tsx       # REWRITE — use useConversations() + SignalR
│   ├── public-profile/
│   │   └── PublicProfile.tsx         # REWRITE — use usePublicInstructor() by slug
│   ├── wishlist/
│   │   └── Wishlist.tsx              # REWRITE — use useWishlist() hook
│   ├── refunds/
│   │   └── Refunds.tsx               # REWRITE — use useRefunds() hook
│   └── instructor-apply/
│       └── InstructorApply.tsx       # REWRITE — use useInstructorRequest() hook
├── components/
│   ├── shared/                       # EXISTS — Pagination, Skeleton, ErrorFallback, EmptyState
│   └── layout/                       # EXISTS — Navbar, Footer, CartDrawer
├── lib/
│   ├── api.ts                        # EXISTS
│   ├── query-client.ts               # EXISTS
│   ├── query-keys.ts                 # EXISTS
│   └── signalr.ts                    # EXISTS
├── types/
│   └── api/                          # EXISTS — 26 DTO files
└── hooks/
    ├── useTheme.ts                   # EXISTS
    └── useSignalR.ts                 # EXISTS
```

**Structure Decision**: Feature-based directory structure per constitution. All infrastructure (services, hooks, types, shared components) is already in place from Phases 1-3. This phase only modifies page components.

## Complexity Tracking

No violations to justify.
