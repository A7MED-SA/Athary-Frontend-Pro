<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at `specs/003-dashboards-secondary-features/plan.md`.
<!-- SPECKIT END -->

# AGENTS.md — Auth, Routing & RBAC Architecture

## Overview

This project uses **JWT-based authentication** with **Role-Based Access Control (RBAC)**.
The Backend defines roles: `Admin`, `Instructor`, `Student`.
The Frontend enforces routing guards based on these roles.

---

## Authentication Flow

### Login

1. User submits credentials via `AuthPage.tsx`
2. `useAuth().loginAsync()` calls `POST /auth/login`
3. Backend returns `AuthResponse`:
   ```ts
   {
     accessToken: string;
     refreshToken: string;
     sessionId: string;
     expiresAt: string;
     user: UserInfoDto;  // { id, email, fullName, roles: string[], ... }
   }
   ```
4. Frontend stores tokens via `tokenStorage.setTokens(accessToken, refreshToken)` → `sessionStorage`
5. Frontend stores user info via `tokenStorage.setUserInfo(user)` → `sessionStorage`
6. `AppProvider.handleLoginSuccess(user)` sets: `isLoggedIn`, `userName`, `userRoles`, `userId`
7. User is navigated to `/dashboard`

### Token Storage

- **Location**: `sessionStorage` (cleared when tab is closed)
- **Keys**: `athary_access_token`, `athary_refresh_token`, `athary_user_info`
- **File**: `src/lib/token-storage.ts`

### Token Refresh

- Axios interceptor in `src/lib/api.ts` catches `401` responses
- Automatically calls `POST /auth/refresh` with `refreshToken`
- Queues concurrent requests during refresh
- On failure: clears tokens, redirects to `/auth`

### Logout

- `useAuth().logout()` calls `POST /auth/logout`
- Clears `sessionStorage` tokens + user info
- Clears React Query cache
- Redirects to `/auth`

---

## RBAC — Role-Based Access Control

### Roles (defined by Backend)

| Role | Description |
|------|-------------|
| `Admin` | Full platform access |
| `Instructor` | Course management, student oversight |
| `Student` | Course enrollment, learning |

### How Roles are Stored

1. Backend returns `roles: string[]` in `UserInfoDto` on login
2. Stored in `sessionStorage` via `tokenStorage.setUserInfo()`
3. Loaded into `AppProvider` state: `userRoles: Role[]`
4. Available globally via `useAppContext().userRoles`

### Role Checking Helpers (in AppProvider)

```tsx
const { hasRole, hasAnyRole, userRoles } = useAppContext();

hasRole('Admin')           // true if user has Admin role
hasAnyRole(['Admin', 'Instructor'])  // true if user has either
```

---

## Route Protection

### ProtectedRoute Component

**File**: `src/components/ProtectedRoute.tsx`

```tsx
<ProtectedRoute allowedRoles={['Admin']}>
  <AdminDashboard />
</ProtectedRoute>
```

**Behavior**:
1. If `isLoggedIn === false` → redirect to `/auth`
2. If `allowedRoles` provided and user has none → redirect to `/dashboard`
3. Otherwise → render children

### Route Configuration

**File**: `src/router.tsx`

| Route | Protection | Allowed Roles |
|-------|-----------|---------------|
| `/` | None | Public |
| `/catalog` | None | Public |
| `/course/:id` | None | Public |
| `/auth` | None | Public |
| `/about` | None | Public |
| `/instructor/:name` | None | Public |
| `/dashboard` | `ProtectedRoute` | Student, Instructor, Admin |
| `/instructor` | `ProtectedRoute` | Instructor, Admin |
| `/admin` | `ProtectedRoute` | Admin only |
| `/profile` | `ProtectedRoute` | Any authenticated user |

---

## API Layer

### Axios Instance

**File**: `src/lib/api.ts`

- Base URL from `VITE_API_BASE_URL`
- Request interceptor: attaches `Authorization: Bearer <token>`
- Response interceptor: handles `401` with automatic token refresh

### Key API Files

| Service | File | Endpoints |
|---------|------|-----------|
| Auth | `src/features/auth/services/auth.service.ts` | `/auth/*` |
| Profile | `src/features/profile/services/profile.service.ts` | `/profile/*` |
| Notifications | `src/features/notifications/services/notification.service.ts` | `/notifications/*` |

---

## File Structure (Auth-related)

```
src/
├── lib/
│   ├── api.ts                    # Axios instance + interceptors
│   └── token-storage.ts          # sessionStorage CRUD for tokens + user info
├── providers/
│   └── AppProvider.tsx            # Global state: isLoggedIn, userRoles, userId
├── components/
│   └── ProtectedRoute.tsx         # Route guard (auth + role check)
├── router.tsx                     # Route definitions with ProtectedRoute
├── features/
│   ├── auth/
│   │   ├── AuthPage.tsx           # Login/Register/OAuth forms
│   │   └── services/auth.service.ts
│   ├── profile/
│   │   ├── ProfileSettings.tsx    # User profile management
│   │   ├── PublicProfile.tsx      # Public instructor profile
│   │   └── services/profile.service.ts
│   └── common/
│       └── hooks/
│           ├── useAuth.ts         # Auth mutations (login, register, logout)
│           ├── useProfile.ts      # Profile CRUD
│           └── useNotificationPreferences.ts  # Notification prefs
└── types/
    └── api/
        ├── auth.ts                # AuthResponse, UserInfoDto, etc.
        └── profile.ts             # ProfileDto, UpdateProfileRequest, etc.
```

---

## Adding a New Protected Route

```tsx
// In router.tsx
import ProtectedRoute from './components/ProtectedRoute';

{
  path: 'my-new-page',
  element: (
    <ProtectedRoute allowedRoles={['Instructor']}>
      <LazyPage><MyNewPage /></LazyPage>
    </ProtectedRoute>
  ),
}
```

---

## Adding a New Role

1. Backend must include the role in `UserInfoDto.roles[]`
2. Update the `Role` type in `src/providers/AppProvider.tsx`:
   ```ts
   type Role = 'Admin' | 'Instructor' | 'Student' | 'NewRole';
   ```
3. Update `ProtectedRoute.tsx` if needed (it already accepts `Role[]`)
4. Use `hasRole('NewRole')` or `hasAnyRole(['NewRole'])` in components

---

## Common Pitfalls

- **Never store roles in `localStorage`** — use `sessionStorage` via `tokenStorage`
- **Never hardcode role checks in components** — use `hasRole()` / `hasAnyRole()` from context
- **Always wrap protected routes** with `<ProtectedRoute>` in `router.tsx`
- **Backend is the source of truth** for roles — frontend just enforces UI access
- **Profile fields sent to backend** must match `UpdateProfileRequest` type exactly
ttps://react.dev/link/react-devtools
:5000/api/notifications:1  Failed to load resource: the server responded with a status of 401 (Unauthorized)
:5000/api/notifications/unread-count:1  Failed to load resource: the server responded with a status of 401 (Unauthorized)
:5000/api/notifications/preferences:1  Failed to load resource: the server responded with a status of 401 (Unauthorized)
:5000/api/notifications:1  Failed to load resource: the server responded with a status of 401 (Unauthorized)
:5000/api/notifications/unread-count:1  Failed to load resource: the server responded with a status of 401 (Unauthorized)
:5000/api/notifications/preferences:1  Failed to load resource: the server responded with a status of 401 (Unauthorized)
:5000/api/notifications:1  Failed to load resource: the server responded with a status of 401 (Unauthorized)
:5000/api/notifications/unread-count:1  Failed to load resource: the server responded with a status of 401 (Unauthorized)
:5000/api/notifications/preferences:1  Failed to load resource: the server responded with a status of 401 (Unauthorized)
:5000/api/auth/login:1  Failed to load resource: the server responded with a status of 403 (Forbidden)
api.ts:97 API Error [403]: Invalid email or password
(anonymous) @ api.ts:97
@microsoft_signalr.js?v=168a81c3:299 [2026-06-24T19:47:40.257Z] Information: Normalizing 'wss://atharyapi.runasp.net/hubs/notifications?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOGRlZDE3Ny1lZGQ3LWExZTUtYTAyYi1iODRhYzhlOTAwMDAiLCJlbWFpbCI6ImFhYWFhYUBnZ2dnLmNvbSIsImp0aSI6ImFhYTIyNzhmLTZjYzctNGNhNC05ZDViLTdlZTMyZmEzYzQwMyIsInNpZCI6IjA4ZGVkMjI5LTcyOTYtNmZmMi1hMDJiLWI4NGE0OWMwMDAwMCIsIkZ1bGxOYW1lIjoiQWhtZWQgc2F5ZWQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdHVkZW50IiwiZXhwIjoxNzgyMzM0MDU5LCJpc3MiOiJBdGhhcnkiLCJhdWQiOiJBdGhhcnlDbGllbnQifQ.5317nCblRS3RL9HAD-9o9E2DE3IewL8t8sH3GAMlrWo' to 'wss://atharyapi.runasp.net/hubs/notifications?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOGRlZDE3Ny1lZGQ3LWExZTUtYTAyYi1iODRhYzhlOTAwMDAiLCJlbWFpbCI6ImFhYWFhYUBnZ2dnLmNvbSIsImp0aSI6ImFhYTIyNzhmLTZjYzctNGNhNC05ZDViLTdlZTMyZmEzYzQwMyIsInNpZCI6IjA4ZGVkMjI5LTcyOTYtNmZmMi1hMDJiLWI4NGE0OWMwMDAwMCIsIkZ1bGxOYW1lIjoiQWhtZWQgc2F5ZWQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdHVkZW50IiwiZXhwIjoxNzgyMzM0MDU5LCJpc3MiOiJBdGhhcnkiLCJhdWQiOiJBdGhhcnlDbGllbnQifQ.5317nCblRS3RL9HAD-9o9E2DE3IewL8t8sH3GAMlrWo'.
@microsoft_signalr.js?v=168a81c3:299 [2026-06-24T19:47:40.349Z] Information: Normalizing 'wss://atharyapi.runasp.net/hubs/messaging?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOGRlZDE3Ny1lZGQ3LWExZTUtYTAyYi1iODRhYzhlOTAwMDAiLCJlbWFpbCI6ImFhYWFhYUBnZ2dnLmNvbSIsImp0aSI6ImFhYTIyNzhmLTZjYzctNGNhNC05ZDViLTdlZTMyZmEzYzQwMyIsInNpZCI6IjA4ZGVkMjI5LTcyOTYtNmZmMi1hMDJiLWI4NGE0OWMwMDAwMCIsIkZ1bGxOYW1lIjoiQWhtZWQgc2F5ZWQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdHVkZW50IiwiZXhwIjoxNzgyMzM0MDU5LCJpc3MiOiJBdGhhcnkiLCJhdWQiOiJBdGhhcnlDbGllbnQifQ.5317nCblRS3RL9HAD-9o9E2DE3IewL8t8sH3GAMlrWo' to 'wss://atharyapi.runasp.net/hubs/messaging?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOGRlZDE3Ny1lZGQ3LWExZTUtYTAyYi1iODRhYzhlOTAwMDAiLCJlbWFpbCI6ImFhYWFhYUBnZ2dnLmNvbSIsImp0aSI6ImFhYTIyNzhmLTZjYzctNGNhNC05ZDViLTdlZTMyZmEzYzQwMyIsInNpZCI6IjA4ZGVkMjI5LTcyOTYtNmZmMi1hMDJiLWI4NGE0OWMwMDAwMCIsIkZ1bGxOYW1lIjoiQWhtZWQgc2F5ZWQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdHVkZW50IiwiZXhwIjoxNzgyMzM0MDU5LCJpc3MiOiJBdGhhcnkiLCJhdWQiOiJBdGhhcnlDbGllbnQifQ.5317nCblRS3RL9HAD-9o9E2DE3IewL8t8sH3GAMlrWo'.
requests.js:1 Fetch API cannot load wss://atharyapi.runasp.net/hubs/notifications/negotiate?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOGRlZDE3Ny1lZGQ3LWExZTUtYTAyYi1iODRhYzhlOTAwMDAiLCJlbWFpbCI6ImFhYWFhYUBnZ2dnLmNvbSIsImp0aSI6ImFhYTIyNzhmLTZjYzctNGNhNC05ZDViLTdlZTMyZmEzYzQwMyIsInNpZCI6IjA4ZGVkMjI5LTcyOTYtNmZmMi1hMDJiLWI4NGE0OWMwMDAwMCIsIkZ1bGxOYW1lIjoiQWhtZWQgc2F5ZWQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdHVkZW50IiwiZXhwIjoxNzgyMzM0MDU5LCJpc3MiOiJBdGhhcnkiLCJhdWQiOiJBdGhhcnlDbGllbnQifQ.5317nCblRS3RL9HAD-9o9E2DE3IewL8t8sH3GAMlrWo&negotiateVersion=1. URL scheme "wss" is not supported.
s.fetch @ requests.js:1
requests.js:1 Fetch API cannot load wss://atharyapi.runasp.net/hubs/messaging/negotiate?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOGRlZDE3Ny1lZGQ3LWExZTUtYTAyYi1iODRhYzhlOTAwMDAiLCJlbWFpbCI6ImFhYWFhYUBnZ2dnLmNvbSIsImp0aSI6ImFhYTIyNzhmLTZjYzctNGNhNC05ZDViLTdlZTMyZmEzYzQwMyIsInNpZCI6IjA4ZGVkMjI5LTcyOTYtNmZmMi1hMDJiLWI4NGE0OWMwMDAwMCIsIkZ1bGxOYW1lIjoiQWhtZWQgc2F5ZWQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdHVkZW50IiwiZXhwIjoxNzgyMzM0MDU5LCJpc3MiOiJBdGhhcnkiLCJhdWQiOiJBdGhhcnlDbGllbnQifQ.5317nCblRS3RL9HAD-9o9E2DE3IewL8t8sH3GAMlrWo&negotiateVersion=1. URL scheme "wss" is not supported.
s.fetch @ requests.js:1
@microsoft_signalr.js?v=168a81c3:296 [2026-06-24T19:47:40.657Z] Warning: Error from HTTP request. TypeError: Failed to fetch.
log @ @microsoft_signalr.js?v=168a81c3:296
@microsoft_signalr.js?v=168a81c3:296 [2026-06-24T19:47:40.658Z] Warning: Error from HTTP request. TypeError: Failed to fetch.
log @ @microsoft_signalr.js?v=168a81c3:296
@microsoft_signalr.js?v=168a81c3:293 [2026-06-24T19:47:40.660Z] Error: Failed to complete negotiation with the server: TypeError: Failed to fetch
log @ @microsoft_signalr.js?v=168a81c3:293
@microsoft_signalr.js?v=168a81c3:293 [2026-06-24T19:47:40.671Z] Error: Failed to complete negotiation with the server: TypeError: Failed to fetch
log @ @microsoft_signalr.js?v=168a81c3:293
@microsoft_signalr.js?v=168a81c3:293 [2026-06-24T19:47:40.672Z] Error: Failed to start the connection: Error: Failed to complete negotiation with the server: TypeError: Failed to fetch
log @ @microsoft_signalr.js?v=168a81c3:293
@microsoft_signalr.js?v=168a81c3:293 [2026-06-24T19:47:40.674Z] Error: Failed to start the connection: Error: Failed to complete negotiation with the server: TypeError: Failed to fetch
log @ @microsoft_signalr.js?v=168a81c3:293
useSignalR.ts:58 SignalR connection error: FailedToNegotiateWithServerError: Failed to complete negotiation with the server: TypeError: Failed to fetch
    at HttpConnection._getNegotiationResponse (@microsoft_signalr.js?v=168a81c3:2344:29)
    at async HttpConnection._startInternal (@microsoft_signalr.js?v=168a81c3:2271:31)
    at async HttpConnection.start (@microsoft_signalr.js?v=168a81c3:2199:5)
    at async _HubConnection._startInternal (@microsoft_signalr.js?v=168a81c3:988:5)
    at async _HubConnection._startWithStateTransitions (@microsoft_signalr.js?v=168a81c3:968:7)
    at async Promise.all (index 0)
    at async useSignalR.ts:52:7
(anonymous) @ useSignalR.ts:58
Node cannot be found in the current page.
