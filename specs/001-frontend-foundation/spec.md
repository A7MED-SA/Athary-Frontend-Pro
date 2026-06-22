# Feature Specification: Frontend Foundation — API Layer + Types + Services + SignalR + Shared Components

**Feature Branch**: `001-frontend-foundation`

**Created**: 2026-06-22

**Status**: Draft

**Input**: User description: "From FRONTEND_PLAN.md, work on Phase 0 (Clean & Initialize) and Phase 1 (Foundation Layer) completely. Use MODIFICATION_GUIDE.md and FRONTEND_BACKEND_COMPARISON.md for reference."

## Clarifications

### Session 2026-06-22

- Q: How should the frontend handle authentication tokens? → A: HTTP-only cookies — backend sets tokens as HTTP-only cookies. Frontend does NOT read/write tokens to localStorage. Axios sends cookies automatically with `withCredentials: true`. This follows the constitution's security mandate and prevents XSS token theft.
- Q: Where should the 22 service files live? → A: Feature-based directory structure per constitution. Services live in `src/features/*/services/` (e.g., `src/features/courses/services/course.service.ts`). This follows the constitution's SOLID principle of focused, encapsulated modules.
- Q: Should this phase include writing unit tests for services and hooks? → A: Yes, include tests. All 22 services and 16 hooks MUST have co-located `*.test.ts` files with ≥80% line coverage per constitution. This adds ~40% more work but ensures compliance from day one.
- Q: Should the 23 DTO sections be split into one file per domain module or kept in a single file? → A: One file per domain module in `src/types/api/` (e.g., `src/types/api/auth.ts`, `src/types/api/course.ts`). Follows the constitution's feature-based architecture principle.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — API Client with Token Management (Priority: P1)

As a developer building the Athary platform, I need a reliable API client that handles authentication token lifecycle automatically — including attaching Bearer tokens to requests, refreshing expired tokens without interrupting the user, and properly handling all HTTP error codes — so that every subsequent service module can make authenticated API calls without reinventing auth logic.

**Why this priority**: Every other feature depends on this. Without a working API client with refresh token logic, no service can communicate with the backend. This is the single foundational block.

**Independent Test**: Can be verified by making a test API call to any authenticated endpoint, confirming the token is attached, and simulating a 401 response to verify automatic refresh and retry.

**Acceptance Scenarios**:

1. **Given** a user is authenticated and the backend has set HTTP-only cookies, **When** an API request is made, **Then** the request includes `withCredentials: true` so cookies are sent automatically.
2. **Given** the access token cookie has expired, **When** an API request returns 401, **Then** the client automatically sends a refresh request to `POST /auth/refresh`, the backend sets new cookies, and the original request is retried.
3. **Given** multiple concurrent requests fail with 401 while a refresh is in progress, **When** the refresh completes, **Then** all queued requests are retried (no duplicate refresh calls).
4. **Given** the refresh token cookie is also expired or missing, **When** a 401 is received, **Then** the user is redirected to `/auth`.
5. **Given** any API response returns 400, 403, 404, 429, or 500, **When** the error interceptor runs, **Then** the error is logged with the status code and message from the response body.
6. **Given** the base API URL is configured, **When** the client is initialized, **Then** it uses `VITE_API_URL` with a fallback to `https://localhost:7001/api` and a 15-second timeout.

---

### User Story 2 — Typed DTO Layer (Priority: P1)

As a developer, I need 23 per-domain TypeScript type files under `src/types/api/` — one per backend DTO section (Auth, Profile, Category, Course, Enrollment, Cart, Order, Payment, Quiz, Certificate, Notification, Message, Review, LiveSession, Wishlist, Announcement, Dashboard, Landing, Media, Contact, InstructorRequest, Refund, Coupon) — matching the backend DTOs exactly, so that every service and component uses type-safe data contracts.

**Why this priority**: Types must exist before services can be written. They are the contract between frontend and backend and prevent runtime data mismatches.

**Independent Test**: The file compiles with zero TypeScript errors. Each interface can be imported and used in a service call without type mismatches. Branded types are used for entity IDs.

**Acceptance Scenarios**:

1. **Given** the backend defines `AuthResponse` with `accessToken`, `refreshToken`, `sessionId`, `expiresAt`, and `user: UserInfoDto`, **When** the frontend defines this interface, **Then** all fields match exactly (no `token` instead of `accessToken`, no `avatarUrl` instead of `profilePictureUrl`).
2. **Given** the backend uses `PagedList<T>` for paginated responses, **When** the frontend defines `PagedList<T>`, **Then** it includes `items`, `page`, `pageSize`, `totalCount`, `totalPages`, `hasPrevious`, `hasNext`.
3. **Given** entity IDs are UUIDs, **When** they appear in DTOs, **Then** they use branded types (e.g., `type CourseId = string & { __brand: 'CourseId' }`).
4. **Given** the backend defines 23 DTO sections, **When** the type files are created under `src/types/api/`, **Then** all 23 files exist: `auth.ts`, `profile.ts`, `category.ts`, `course.ts`, `enrollment.ts`, `cart.ts`, `order.ts`, `payment.ts`, `quiz.ts`, `certificate.ts`, `notification.ts`, `message.ts`, `review.ts`, `liveSession.ts`, `wishlist.ts`, `announcement.ts`, `dashboard.ts`, `landing.ts`, `media.ts`, `contact.ts`, `instructorRequest.ts`, `refund.ts`, `coupon.ts`.

---

### User Story 3 — Service Layer (Priority: P1)

As a developer, I need 22 typed service files — one per backend domain — that encapsulate all HTTP calls using the API client, with correct routes, request/response types, and method signatures matching the backend controllers, so that any page component can import a service and make a fully typed API call.

**Why this priority**: Services are the bridge between the API client and the UI. Without them, every page would need raw `fetch` or `axios` calls, violating the constitution's Service Layer principle.

**Independent Test**: Each service file can be imported and its methods called with correctly typed arguments. Routes match the backend exactly (e.g., `GET /public/courses` not `GET /courses`). No service makes direct `axios` calls — all use the centralized `api` instance.

**Acceptance Scenarios**:

1. **Given** 22 service files are defined, **When** each is imported, **Then** it exports a named object (e.g., `authService`, `courseService`) with methods for every endpoint in that domain.
2. **Given** the backend route for course listing is `GET /public/courses`, **When** `courseService.getPublicList()` is called, **Then** it sends `GET /public/courses` (not `GET /courses`).
3. **Given** the backend uses `POST /oauth/google` with `{ idToken, provider }`, **When** `authService.loginWithGoogle(idToken)` is called, **Then** it sends `POST /oauth/google` with `{ idToken, provider: 'google' }`.
4. **Given** the backend uses `DELETE /admin/media/{fileId}/soft` for soft delete, **When** `mediaService.softDelete(fileId)` is called, **Then** it sends `DELETE /admin/media/${fileId}/soft` (not `PUT .../soft-delete`).
5. **Given** the enrollment list endpoint is `GET /enrollments`, **When** `enrollmentService.getMyCourses()` is called, **Then** it sends `GET /enrollments` (not `GET /enrollments/my-courses`).
6. **Given** the media upload uses a presigned URL flow, **When** `mediaService.uploadFile()` is called, **Then** it executes all 3 steps: `POST /media/upload-url`, `PUT` to the presigned URL, `POST /media/confirm-upload`.

---

### User Story 4 — SignalR Integration (Priority: P2)

As a developer, I need a typed SignalR client that connects to the notifications and messaging hubs, with automatic reconnection, connection state management, and integration with the existing notification store, so that real-time notifications and messages are delivered to the user without page refreshes.

**Why this priority**: SignalR is required for real-time features (notifications, messaging) that the platform depends on. Without it, users must poll for new data.

**Independent Test**: When a notification is sent from the backend, it appears in the frontend notification store and triggers a browser notification (if permission granted). The connection automatically reconnects after network interruption.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **When** the SignalR hook mounts, **Then** it creates connections to `/hubs/notifications` and `/hubs/messaging` using the stored access token.
2. **Given** a notification is received via SignalR, **When** the `ReceiveNotification` event fires, **Then** the notification is added to the notification store and a browser notification is displayed (if permission is granted).
3. **Given** the SignalR connection drops, **When** the automatic reconnect triggers, **Then** it retries with exponential backoff (0, 2s, 5s, 10s, 30s) and updates connection state.
4. **Given** the user logs out, **When** the SignalR hook unmounts, **Then** both hub connections are stopped cleanly.
5. **Given** the user is not authenticated, **When** the SignalR hook mounts, **Then** no connections are created.

---

### User Story 5 — Shared UI Components (Priority: P2)

As a developer, I need 4 reusable shared components — Pagination, Skeleton (with variants), ErrorFallback, and EmptyState — that are used across all pages for consistent loading, error, and empty states, so that every page has a uniform user experience without reimplementing these patterns.

**Why this priority**: These components are used by every page that fetches data (all 21 pages). They establish the visual language for loading, error, and empty states.

**Independent Test**: Each component renders correctly in isolation. Pagination shows correct page numbers. Skeleton variants match the layouts they represent. ErrorFallback shows error message and retry button. EmptyState shows icon, title, and action button.

**Acceptance Scenarios**:

1. **Given** a list has 25 pages and the current page is 3, **When** `Pagination` renders, **Then** it shows page buttons for pages around 3 with ellipsis for distant pages, and prev/next arrows.
2. **Given** data is loading, **When** `CourseCardSkeleton` renders, **Then** it shows a pulsing placeholder matching the dimensions of a course card (image area, title, subtitle, price).
3. **Given** an API call fails with an error, **When** `ErrorFallback` renders with an `onRetry` callback, **Then** it shows the error title, message, and a retry button that calls `onRetry`.
4. **Given** a query returns an empty array, **When** `EmptyState` renders with a title and action, **Then** it shows an icon, the title text, description, and a clickable action button.
5. **Given** all components, **When** rendered in dark mode, **Then** they use appropriate dark mode colors (e.g., `bg-gray-700` for skeletons, not `bg-gray-200`).

---

### User Story 6 — Custom Hooks with React Query (Priority: P2)

As a developer, I need 16 custom hooks wrapping TanStack Query — one per service domain — that provide `useQuery` for reads and `useMutation` for writes, with structured query keys, proper loading/error states, and cache invalidation, so that page components can interact with the API using a consistent, declarative pattern.

**Why this priority**: Hooks are the interface between services and components. They handle caching, deduplication, and background refetching automatically.

**Independent Test**: Each hook returns `{ data, isLoading, isError, error, refetch }` for queries and `{ mutate, mutateAsync, isPending }` for mutations. Query keys are structured and cache invalidation works on mutation success.

**Acceptance Scenarios**:

1. **Given** `useCourseList(filters)` is called, **When** filters change, **Then** a new API call is made with the updated filters and old data is shown as `placeholderData`.
2. **Given** a mutation succeeds, **When** the mutation's `onSuccess` fires, **Then** related query keys are invalidated to trigger a refetch.
3. **Given** `useAuth()` is called, **When** the user is authenticated, **Then** `user` contains the user info from the auth context and `isAuthenticated` is `true`.
4. **Given** all 16 hooks exist, **When** each is imported, **Then** it wraps the corresponding service method with appropriate query/mutation configuration.

---

### User Story 7 — Unit Tests for Services and Hooks (Priority: P2)

As a developer, I need co-located unit tests for all 22 service files and 16 hooks — using Vitest with ≥80% line coverage — so that the foundation layer is verified against the constitution's testing standards and regressions are caught immediately.

**Why this priority**: The constitution mandates testing as NON-NEGOTIABLE. Without tests, the foundation layer cannot be considered complete and PRs will fail the coverage gate.

**Independent Test**: Each test file can be run independently with `vitest`. All tests pass. Coverage report shows ≥80% line coverage per file.

**Acceptance Scenarios**:

1. **Given** a service file exists (e.g., `auth.service.ts`), **When** the corresponding test file (`auth.service.test.ts`) is run, **Then** it achieves ≥80% line coverage.
2. **Given** a hook exists (e.g., `useAuth.ts`), **When** the corresponding test file (`useAuth.test.ts`) is run, **Then** it tests: initial state, each returned value, cleanup on unmount.
3. **Given** all test files, **When** they are collected by Vitest, **Then** each is co-located with its source file (not in a separate `__tests__/` directory).
4. **Given** service tests, **When** they run, **Then** they mock the API client at the service boundary (not child components).

---

### Edge Cases

- What happens when the refresh token request itself fails due to network error?
  - The client should reject the retry and redirect to `/auth`.
- What happens when two tabs are open and both try to refresh the token simultaneously?
  - The failed queue mechanism serializes refresh — only one refresh call is made. Since cookies are shared across tabs (same origin), both tabs receive the new token automatically.
- What happens when a service receives a `null` or `undefined` response for a required field?
  - TypeScript types enforce the shape; runtime validation uses the `ApiResponse<T>` envelope.
- What happens when the SignalR hub URL is misconfigured?
  - The connection logs an error and retries with backoff; no user-visible crash.
- What happens when the media upload presigned URL expires before upload completes?
  - The service should handle the error and the user can retry the upload.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a centralized Axios instance with request interceptor for Bearer token attachment.
- **FR-002**: System MUST implement automatic token refresh on 401 responses with a failed queue for concurrent requests.
- **FR-003**: System MUST handle HTTP error codes 400, 403, 404, 429, and 500 with structured logging.
- **FR-004**: System MUST define TypeScript interfaces for all 23 backend DTO sections in per-domain files under `src/types/api/` (e.g., `auth.ts`, `course.ts`, `enrollment.ts`).
- **FR-005**: System MUST provide 22 service files in feature-based directories (`src/features/*/services/`), each exporting a named object with methods for every endpoint in that domain.
- **FR-006**: System MUST use the centralized Axios instance in all services — no direct `fetch` or `axios` calls.
- **FR-007**: System MUST implement SignalR connections for `/hubs/notifications` and `/hubs/messaging` with automatic reconnection.
- **FR-008**: System MUST provide 4 shared components: Pagination, Skeleton (with CourseCardSkeleton and DashboardSkeleton variants), ErrorFallback, EmptyState.
- **FR-009**: System MUST provide 16 custom hooks using TanStack Query for data fetching and mutations.
- **FR-010**: System MUST use structured query keys for all useQuery calls.
- **FR-011**: System MUST invalidate relevant query keys on mutation success.
- **FR-012**: All shared components MUST support dark mode via Tailwind CSS classes.
- **FR-013**: SignalR connections MUST use the stored access token for authentication.
- **FR-014**: SignalR connections MUST implement exponential backoff reconnection (0, 2s, 5s, 10s, 30s).
- **FR-015**: The media service MUST implement the 3-step presigned URL upload flow (get URL, upload to presigned URL, confirm upload).
- **FR-016**: Entity IDs in DTOs MUST use branded TypeScript types.
- **FR-017**: System MUST NOT use `any` type — use `unknown` with type guards where needed.
- **FR-018**: System MUST use `InternalAxiosRequestConfig` and `AxiosError` for interceptor typing (not plain `AxiosRequestConfig`).
- **FR-019**: Token storage MUST use HTTP-only cookies set by the backend — frontend MUST NOT read or write tokens to localStorage. Axios MUST use `withCredentials: true` for all requests.
- **FR-020**: System MUST prevent infinite refresh loops using a `_retry` flag on the original request config.
- **FR-021**: Every service file MUST have a co-located `*.test.ts` file with ≥80% line coverage.
- **FR-022**: Every hook MUST have a co-located `*.test.ts` file testing initial state, returned values, and cleanup.
- **FR-023**: Service tests MUST mock the API client at the service boundary — not child components.

### Key Entities

- **ApiResponse<T>**: Envelope with `success`, `message`, `data`, `errors` fields wrapping all backend responses.
- **PagedList<T>**: Paginated response with `items`, `page`, `pageSize`, `totalCount`, `totalPages`, `hasPrevious`, `hasNext`.
- **AuthResponse**: Contains `accessToken`, `refreshToken`, `sessionId`, `expiresAt`, and `user: UserInfoDto`.
- **PublicCourseDto**: Core course entity for public display with `id`, `title`, `slug`, `courseImageUrl`, `price`, `isFree`, `level`, `language`, `categoryName`, `categoryId`, `instructorName`, `averageRating`, `enrollmentCount`, `totalDurationMinutes`, `sectionCount`, `lessonCount`.
- **HubConnection**: SignalR connection object for notifications and messaging hubs with state management.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The API client successfully refreshes expired tokens without user intervention in 100% of test cases.
- **SC-002**: All 22 service files compile with zero TypeScript errors and have correct route paths matching the backend.
- **SC-003**: All 23 DTO sections are defined with field-level accuracy matching the MODIFICATION_GUIDE.md specifications.
- **SC-004**: SignalR connections establish and receive notifications within 2 seconds of a backend event.
- **SC-005**: All 4 shared components render correctly in both light and dark modes.
- **SC-006**: Zero `any` types in the codebase (enforced by ESLint).
- **SC-007**: All 16 hooks return properly typed data with loading, error, and success states.
- **SC-008**: All 22 service test files and 16 hook test files exist and pass with ≥80% line coverage.

## Assumptions

- The backend API is running and accessible at the configured `VITE_API_URL`.
- The backend returns responses in the `ApiResponse<T>` envelope format consistently.
- The `@microsoft/signalr` package is already installed or will be installed as part of this work.
- The `sonner` toast library is already installed for error/success notifications.
- The existing `notificationStore` (Zustand) is already implemented and can be used by the SignalR hook.
- The existing `useAuth` hook exists and provides `user`, `isAuthenticated`, and token management.
- The `VITE_API_URL` environment variable is configured in `.env`.
- React 19, Vite 6, Tailwind CSS 4, and TypeScript 5+ are the active stack versions.
- Dark mode support is already implemented in the base theme via `useTheme.ts`.
