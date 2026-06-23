# Research: Dashboards + Secondary Features + Missing Backend Features

**Date**: 2026-06-23
**Feature**: 003-dashboards-secondary-features

## Decisions

### R1: Dashboard Chart Library Selection

**Decision**: Use Recharts for dashboard charts (line charts for trends, pie charts for distributions).

**Rationale**: Recharts is the most popular React charting library with excellent TypeScript support, composable API, and built-in responsiveness. It integrates well with Tailwind CSS and supports RTL layouts. The library is lightweight (~30KB gzipped) and well-maintained.

**Alternatives considered**:
- Chart.js + react-chartjs-2: Rejected — less composable, harder to customize with Tailwind
- Victory: Rejected — larger bundle size, less active maintenance
- Nivo: Rejected — overkill for simple dashboard charts, larger bundle

**Implementation notes**:
- LineChart for revenue/enrollment trends (12 months)
- PieChart for student level distribution and course category distribution
- ResponsiveContainer for auto-sizing
- Arabic axis labels via tailwindcss-rtl

---

### R2: Profile Picture Upload Flow

**Decision**: Implement 3-step presigned URL upload flow: (1) request presigned URL from backend, (2) upload directly to MinIO storage, (3) confirm upload and set as profile picture.

**Rationale**: The clarification session confirmed this flow. This matches the backend's media service architecture which uses MinIO with presigned URLs for direct browser-to-storage uploads. This avoids routing large file uploads through the backend server.

**Alternatives considered**:
- Direct FormData upload to backend: Rejected — backend uses MinIO presigned URLs, not direct upload
- Chunked upload: Rejected — profile pictures are small files (<5MB), chunking unnecessary

**Implementation notes**:
- Step 1: `POST /media/upload-url` with fileType, fileName, contentType, fileSizeBytes, visibility
- Step 2: `PUT uploadUrl` with file and requiredHeaders
- Step 3: `POST /media/confirm-upload` with fileId, objectKey, bucket
- Step 4: `POST /profile/picture` with fileId
- Client-side validation: max 5MB, image types only (JPEG, PNG, WebP)

---

### R3: Admin Dashboard Tab Architecture

**Decision**: Implement admin dashboard as a single page with tab panels (not separate routes). Each tab loads its data lazily when selected.

**Rationale**: The clarification session confirmed tab panels. This provides consistent navigation, reduces initial load time (only overview data loads initially), and matches common admin dashboard patterns.

**Alternatives considered**:
- Separate routes per tab: Rejected per clarification — causes full page reload, loses context
- Accordion panels: Rejected — tabs are more conventional for admin dashboards

**Implementation notes**:
- Tab state managed via URL search params (`?tab=coupons`) for bookmarkability
- Each tab uses its own React Query hook with `enabled: activeTab === 'tabName'`
- Tabs: Overview, Users, Coupons, Payment Methods, Refunds, Teacher Requests, Reviews, Announcements

---

### R4: Real-time Messaging with SignalR

**Decision**: Use existing SignalR integration from Phase 1 for messaging. Messages are sent via REST API and received via SignalR hub.

**Rationale**: The SignalR infrastructure (`lib/signalr.ts`, `hooks/useSignalR.ts`) is already in place from Phase 1. The messaging hub (`/hubs/messaging`) is available in the backend. This follows the existing pattern for notifications.

**Alternatives considered**:
- Polling: Rejected — inefficient, not real-time, increases server load
- WebSocket directly: Rejected — SignalR handles reconnection, fallback, and protocol negotiation

**Implementation notes**:
- Send message: `POST /messages` with receiverId and content
- Receive messages: `connection.on('ReceiveMessage', callback)` in useSignalR hook
- Conversation list: `GET /messages/conversations` with pagination
- Unread count: `GET /messages/unread-count` for badge in navbar

---

### R5: Form Validation Pattern

**Decision**: Use React Hook Form + Zod for all forms (Profile, Address, Phone, Coupon, Instructor Apply). Zod schemas defined alongside form components.

**Rationale**: The constitution mandates React Hook Form + Zod for form validation. This provides type-safe validation, inline error display, and consistent UX across all forms.

**Alternatives considered**:
- Custom validation: Rejected — violates constitution, inconsistent UX
- Formik + Yup: Rejected — constitution specifies React Hook Form + Zod

**Implementation notes**:
- Each form has a co-located Zod schema
- `zodResolver(schema)` for React Hook Form integration
- Inline error messages via `formState.errors`
- Toast notifications for submission success/error
- Loading states on submit buttons during mutation

---

### R6: Dashboard Data Caching Strategy

**Decision**: Use React Query with staleTime of 5 minutes for dashboard overview data. Manual refetch on tab switch.

**Rationale**: Dashboard data changes infrequently (every few minutes at most). A 5-minute staleTime reduces unnecessary API calls while keeping data reasonably fresh. Manual refetch ensures data is fresh when user actively switches tabs.

**Alternatives considered**:
- No caching (refetch on every mount): Rejected — causes unnecessary loading states
- Long cache (30 minutes): Rejected — data could be stale during active use
- Real-time updates via SignalR for dashboards: Rejected — overkill for dashboard metrics

**Implementation notes**:
- `staleTime: 5 * 60 * 1000` (5 minutes) for overview endpoints
- `refetchOnWindowFocus: true` for background freshness
- `refetchOnMount: 'always'` when switching tabs
- Optimistic updates for CRUD operations (coupons, refunds)
