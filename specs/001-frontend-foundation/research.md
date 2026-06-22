# Research: Frontend Foundation — API Layer + Types + Services + SignalR + Shared Components

**Date**: 2026-06-22
**Spec**: [spec.md](./spec.md)

## R1: Token Storage Strategy — HTTP-only Cookies vs localStorage

**Decision**: HTTP-only cookies set by the backend. Frontend does NOT read/write tokens.

**Rationale**: The constitution mandates "OAuth tokens stored in HTTP-only cookies (set by backend), NOT in `localStorage`." This prevents XSS token theft since JavaScript cannot access HTTP-only cookies. The backend sets `auth-token` and `refresh-token` as HTTP-only, `Secure`, `SameSite=Strict` cookies.

**Alternatives considered**:
- **localStorage**: Simpler to implement but vulnerable to XSS. The attacker can steal tokens via `localStorage.getItem('auth-token')`.
- **Hybrid (cookie access + localStorage refresh)**: Adds complexity without proportional security benefit. The backend already manages both tokens.

**Implementation**: Axios uses `withCredentials: true` on all requests. No `localStorage.getItem('auth-token')` calls. The refresh interceptor sends `POST /auth/refresh` without a body — the backend reads the refresh token from the cookie.

## R2: Service File Location — Feature-based vs Flat

**Decision**: Feature-based directories: `src/features/*/services/`.

**Rationale**: Constitution mandates "feature-based, not file-type-based" structure. Each domain module encapsulates its own services. Prevents circular dependencies and makes it clear which services belong to which feature.

**Alternatives considered**:
- **Flat `src/services/`**: Matches FRONTEND_PLAN.md and MODIFICATION_GUIDE.md exactly. Easier to find all services. But violates constitution's SOLID principle (Single Responsibility, focused interfaces).

## R3: Types File Structure — Per-domain vs Single File

**Decision**: One file per domain module in `src/types/api/`.

**Rationale**: Constitution mandates "API DTOs MUST be defined in `src/types/api/` — one file per domain module." This keeps files small (<300 lines each) and makes imports targeted (import only what you need from `@/types/api/auth`).

**Alternatives considered**:
- **Single `types/api.ts`**: Simpler to find, matches MODIFICATION_GUIDE.md. But the file would be ~2000+ lines, violating the 300-line limit and making imports wasteful.

## R4: Testing Strategy — Co-located Unit Tests

**Decision**: Co-located `*.test.ts` files for all 22 services and 16 hooks. ≥80% line coverage.

**Rationale**: Constitution mandates "Every service file MUST have a corresponding `*.test.ts` with ≥80% line coverage" and "Every hook MUST have tests for: initial state, each returned value, cleanup on unmount." Testing is NON-NEGOTIABLE.

**Alternatives considered**:
- **Separate `__tests__/` directory**: Constitution explicitly FORBIDS this pattern.
- **Skip tests**: Violates constitution. PRs would fail the coverage gate.

**Implementation**: Mock the API client at the service boundary using `vi.mock('@/lib/api')`. For hooks, use `@testing-library/renderHook` with a `QueryClientProvider` wrapper.

## R5: SignalR Connection Strategy

**Decision**: Two separate hub connections (`/hubs/notifications`, `/hubs/messaging`) with automatic reconnection.

**Rationale**: The backend exposes two separate hubs. SignalR supports multiple connections. Each hub has different event handlers and different security scopes.

**Alternatives considered**:
- **Single multiplexed connection**: Not supported by SignalR — each hub requires its own connection.
- **Polling instead of SignalR**: Violates constitution ("Real-time updates MUST go through a single typed SignalR connection").

**Implementation**: `src/lib/signalr.ts` exports `createNotificationHub(token)` and `createMessagingHub(token)`. `src/hooks/useSignalR.ts` manages lifecycle: creates connections on auth, listens for events, stops on logout.

## R6: Query Key Structure

**Decision**: Factory pattern with domain-scoped keys: `queryKeys.courses.list(filters)`, `queryKeys.enrollments.myCourses()`, etc.

**Rationale**: Constitution mandates "structured key factory." Factory pattern ensures consistent, type-safe keys and makes cache invalidation precise (invalidate `queryKeys.courses.all()` to refetch all course queries).

**Implementation**:
```typescript
export const queryKeys = {
  courses: {
    all: ['courses'] as const,
    list: (filters: PublicCourseFilterDto) => ['courses', 'list', filters] as const,
    detail: (id: string) => ['courses', 'detail', id] as const,
    related: (id: string) => ['courses', 'related', id] as const,
  },
  enrollments: {
    all: ['enrollments'] as const,
    myCourses: () => ['enrollments', 'myCourses'] as const,
    detail: (id: string) => ['enrollments', 'detail', id] as const,
    progress: (id: string) => ['enrollments', 'progress', id] as const,
  },
  // ... other domains
};
```

## R7: Error Handling in API Client

**Decision**: Centralized error interceptor handles 400, 403, 404, 429, 500 with console.error. Services can also handle errors locally via `.catch()`.

**Rationale**: The spec requires structured logging of all HTTP errors. Centralized handling prevents duplicating error logic in every service. Services still have the option to handle errors locally for domain-specific logic.

**Alternatives considered**:
- **No centralized error handling**: Would require every service call to handle errors individually — violates DRY.
- **Throw custom errors**: More structured but adds complexity. The current approach (log + reject promise) lets the caller decide how to handle.

## R8: Presigned URL Upload Flow

**Decision**: 3-step flow in `mediaService.uploadFile()`: (1) `POST /media/upload-url`, (2) `PUT` to presigned URL, (3) `POST /media/confirm-upload`.

**Rationale**: Matches backend's MinIO presigned URL pattern. The frontend never handles file data directly — it uploads to a pre-authorized URL.

**Implementation**: The `mediaService.uploadFile()` method orchestrates all 3 steps internally. Callers just pass the `File` object and get back a `MediaFileDto`.

## R9: Dark Mode for Shared Components

**Decision**: Use Tailwind's `dark:` variant classes. All shared components support dark mode out of the box.

**Rationale**: Constitution mandates "All shared components MUST support dark mode." The existing `useTheme.ts` hook provides the dark mode state. Tailwind 4 handles the CSS.

**Implementation**: Skeleton uses `bg-gray-200 dark:bg-gray-700`. ErrorFallback uses `text-gray-600 dark:text-gray-400`. Pagination uses `border-gray-300 dark:border-gray-600`.
