# Quickstart: Frontend Foundation — API Layer + Types + Services + SignalR + Shared Components

**Date**: 2026-06-22
**Spec**: [spec.md](./spec.md)

## Prerequisites

- Node.js 22+
- pnpm 9+
- `.env` configured with `VITE_API_BASE_URL=https://atharyapi.runasp.net` and `VITE_HUB_BASE_URL=wss://atharyapi.runasp.net`

## Build & Run

```bash
pnpm install
pnpm dev
```

## Validation Scenarios

### Scenario 1: API Client — Auth Flow

1. Open browser, navigate to `/login`.
2. Enter valid credentials and submit.
3. **Verify**: Login succeeds. `auth-token` cookie is set as HTTP-only. No token stored in `localStorage`.
4. Refresh the page. **Verify**: User remains authenticated (cookie persists).
5. Navigate to a protected page. **Verify**: API requests include `withCredentials: true` automatically.
6. Wait 25 minutes (or manually expire the access token). Trigger an API call. **Verify**: Token refresh happens automatically via the 401 interceptor. User does not see a login prompt.

### Scenario 2: Public Course Listing with Pagination

1. Navigate to `/courses`.
2. **Verify**: Course cards load from the real API (`GET /api/v1/public/courses`).
3. Verify the filter bar has search, category, level, language, price range, and rating controls.
4. Apply a category filter. **Verify**: URL updates to `?category=<id>&page=1`. Course list filters accordingly.
5. Click "Next Page". **Verify**: Page updates to `?page=2`. Pagination component shows correct page number.
6. Search for a term. **Verify**: `searchQuery` param updates. Results filter accordingly.
7. Click a course card. **Verify**: Navigate to `/courses/:id`.

### Scenario 3: Course Enrollment & Progress

1. Log in as a student. Purchase a course through the checkout flow.
2. Navigate to `/dashboard/enrollments`. **Verify**: The new enrollment appears with status `InProgress`.
3. Enter a course. Watch a video lesson. **Verify**: Progress updates in real time (TanStack Query invalidation).
4. Complete the lesson. **Verify**: Checkmark appears. Progress bar advances.
5. Complete all lessons. **Verify**: Course status changes to `Completed`. Certificate becomes available.

### Scenario 4: SignalR Real-Time Notifications

1. Log in. **Verify**: SignalR connection to `/hubs/notifications` is established (check Network tab for WebSocket upgrade).
2. From another client (e.g., instructor account), send a notification to this user.
3. **Verify**: Toast notification appears in real time without page refresh.
4. Navigate to `/dashboard/notifications`. **Verify**: Notification list includes the new notification.
5. Mark a notification as read. **Verify**: Unread count badge decreases.

### Scenario 5: Dark Mode Shared Components

1. Toggle dark mode via the theme switcher.
2. Navigate to a page with a Pagination component. **Verify**: Dark mode colors apply correctly (text, borders, active state).
3. Navigate to a page with a Skeleton loading state. **Verify**: Skeleton uses dark mode background colors.
4. Trigger an error state. **Verify**: ErrorFallback renders with correct dark mode colors and provides a retry button.
5. Navigate to an empty state page. **Verify**: EmptyState renders with correct dark mode colors and optional action button.

### Scenario 6: Instructor Course Management

1. Log in as an instructor. Navigate to `/dashboard/courses`.
2. **Verify**: Course list loads from real API.
3. Create a new course with title, description, price, category, and image upload.
4. **Verify**: Course appears in the list. Image upload uses the presigned URL flow (3-step: get URL → PUT → confirm).
5. Publish the course. **Verify**: Status changes to `Published`.
6. Edit the course. **Verify**: Changes persist.

### Scenario 7: Admin Review & Analytics

1. Log in as an admin. Navigate to `/dashboard/analytics`.
2. **Verify**: Admin overview loads from real API with course stats, user stats, revenue stats, etc.
3. Navigate to the course approval queue. **Verify**: Pending courses appear.
4. Approve a course. **Verify**: Course moves to approved. Status updates in real time.

### Scenario 8: Token Refresh During Active Session

1. Log in. Perform some actions.
2. Wait for the access token to expire (15 minutes).
3. Perform an action that triggers an API call.
4. **Verify**: The 401 interceptor catches the expired token, calls `POST /auth/refresh`, and retries the original request. The user does not see a redirect to login.
5. **Verify**: If refresh fails (expired refresh token), the user is redirected to login.

### Scenario 9: Unit Test Coverage

```bash
pnpm test:unit -- --coverage
```

**Verify**: Coverage report shows ≥80% line coverage for all 22 service files and all 16 hook files. No `any` types in the codebase.
