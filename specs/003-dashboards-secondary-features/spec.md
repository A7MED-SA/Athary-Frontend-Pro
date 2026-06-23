# Feature Specification: Dashboards + Secondary Features + Missing Backend Features

**Feature Branch**: `003-dashboards-secondary-features`

**Created**: 2026-06-23

**Status**: Draft

**Input**: User description: "From FRONTEND_PLAN.md, implement Phase 4 (Dashboards), Phase 5 (Secondary Features), and Phase 6 (Missing Backend Features) — connecting Student/Instructor/Admin dashboards to real APIs, wiring secondary pages (Profile, Messaging, Media, Public Profile), and adding missing backend features (Instructor Requests, Coupons, Payment Methods, Sessions, User Management, Reports, Certificates, Live Attendance, Video Comments)."

## Clarifications

### Session 2026-06-23

- Q: How should dashboard metrics be displayed when data is partially available? → A: Show available metrics with skeleton placeholders for missing data; never show an empty dashboard.
- Q: Should admin dashboard tabs (Coupons, Payment Methods, Refunds) be separate pages or tab panels within a single page? → A: Tab panels within a single AdminDashboard page for consistent navigation.
- Q: How should profile image upload work with the presigned URL flow? → A: 3-step flow: (1) get presigned URL from backend, (2) upload directly to storage, (3) confirm upload and set as profile picture.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Student Dashboard Overview (Priority: P1)

As a student, I want to see my dashboard with enrollment stats, recent courses, weekly activity, and certificates so that I can track my learning progress.

**Why this priority**: The student dashboard is the primary interface for returning students. Without it, students have no way to track progress.

**Independent Test**: Can be tested by logging in as a student, navigating to the dashboard, and verifying all sections load with real data.

**Acceptance Scenarios**:

1. **Given** a student logs in, **When** they navigate to `/student/dashboard`, **Then** overview metrics (enrolled courses, completed courses, certificates, hours learned) are fetched from `GET /student/dashboard/overview` and displayed.
2. **Given** a student is on the dashboard, **When** they view recent courses, **Then** their enrolled courses with progress percentages are listed.
3. **Given** a student is on the dashboard, **When** they view weekly activity, **Then** a chart showing study hours over the past 4 weeks is displayed.
4. **Given** a student is on the dashboard, **When** they view certificates, **Then** earned certificates with verification codes are listed.
5. **Given** a student is on the dashboard, **When** data is loading, **Then** dashboard skeleton placeholders are shown.
6. **Given** a student is on the dashboard, **When** the API call fails, **Then** an error fallback with retry button is displayed.

---

### User Story 2 - Instructor Dashboard Overview (Priority: P1)

As an instructor, I want to see my dashboard with course stats, revenue trends, enrollment trends, and pending edit requests so that I can manage my teaching activity.

**Why this priority**: Instructors need visibility into their course performance and revenue to make informed decisions.

**Independent Test**: Can be tested by logging in as an instructor, navigating to the dashboard, and verifying all metrics load.

**Acceptance Scenarios**:

1. **Given** an instructor logs in, **When** they navigate to `/instructor/dashboard`, **Then** overview metrics are fetched from `GET /instructor/dashboard/overview` and displayed.
2. **Given** an instructor is on the dashboard, **When** they view revenue trend, **Then** a chart showing revenue over the past 12 months is displayed.
3. **Given** an instructor is on the dashboard, **When** they view enrollment trend, **Then** a chart showing enrollments over the past 12 months is displayed.
4. **Given** an instructor is on the dashboard, **When** they view student level distribution, **Then** a pie chart showing Beginner/Intermediate/Advanced breakdown is displayed.
5. **Given** an instructor is on the dashboard, **When** they view pending edit requests, **Then** a count badge and link to pending requests is shown.
6. **Given** an instructor is on the dashboard, **When** they view their courses, **Then** courses with enrollment count, rating, revenue, and status are listed.

---

### User Story 3 - Admin Dashboard Overview (Priority: P1)

As an admin, I want to see my dashboard with platform stats, revenue, user growth, enrollment trends, and pending items so that I can monitor platform health.

**Why this priority**: Admin dashboard provides critical platform-level visibility for operations and decision-making.

**Independent Test**: Can be tested by logging in as an admin, navigating to the dashboard, and verifying all metrics load.

**Acceptance Scenarios**:

1. **Given** an admin logs in, **When** they navigate to `/admin/dashboard`, **Then** overview metrics are fetched from `GET /admin/dashboard/overview` and displayed.
2. **Given** an admin is on the dashboard, **When** they view revenue trend, **Then** a chart showing platform revenue over time is displayed.
3. **Given** an admin is on the dashboard, **When** they view user growth, **Then** a chart showing user registration trend is displayed.
4. **Given** an admin is on the dashboard, **When** they view enrollment trend, **Then** a chart showing enrollment trend is displayed.
5. **Given** an admin is on the dashboard, **When** they view top courses, **Then** courses ranked by enrollment/revenue are listed.
6. **Given** an admin is on the dashboard, **When** they view pending items, **Then** counts for pending courses, edit requests, teacher requests, and flagged reviews are shown.
7. **Given** an admin is on the dashboard, **When** they view course distribution, **Then** a pie chart showing courses by category is displayed.

---

### User Story 4 - Admin Dashboard Tabs (Priority: P2)

As an admin, I want to manage users, coupons, payment methods, refunds, instructor requests, reviews, and announcements from the admin dashboard so that I can perform administrative tasks.

**Why this priority**: Admin management tabs are essential for platform operations but secondary to dashboard visibility.

**Independent Test**: Can be tested by navigating to each admin tab and performing CRUD operations.

**Acceptance Scenarios**:

1. **Given** an admin is on the dashboard, **When** they click "Users" tab, **Then** a user management list is displayed with search and role filtering (from `GET /admin/users`).
2. **Given** an admin is on the dashboard, **When** they click "Coupons" tab, **Then** a coupons list is displayed with create/edit/toggle/delete actions.
3. **Given** an admin creates a coupon, **When** the form is submitted, **Then** the coupon is created via `POST /admin/coupons` and appears in the list.
4. **Given** an admin toggles a coupon, **When** the action completes, **Then** the coupon's active status is updated via `PATCH /admin/coupons/{id}/toggle`.
5. **Given** an admin is on the dashboard, **When** they click "Payment Methods" tab, **Then** payment methods are listed with create/toggle actions.
6. **Given** an admin is on the dashboard, **When** they click "Refunds" tab, **Then** refund requests are listed with approve/reject actions.
7. **Given** an admin approves a refund, **When** the action completes, **Then** the refund status is updated via `POST /admin/refunds/approve`.
8. **Given** an admin is on the dashboard, **When** they click "Teacher Requests" tab, **Then** pending instructor requests are listed with process/reject actions.
9. **Given** an admin is on the dashboard, **When** they click "Reviews" tab, **Then** pending reviews are listed with approve/reject moderation actions.

---

### User Story 5 - Profile Settings & Media Upload (Priority: P2)

As a user, I want to update my profile information, manage phones/addresses, upload a profile picture, and change my password so that I can keep my account up to date.

**Why this priority**: Profile management is a core user need for account maintenance and personalization.

**Independent Test**: Can be tested by updating profile fields, uploading a profile picture, managing phones/addresses, and changing password.

**Acceptance Scenarios**:

1. **Given** a user navigates to `/profile/settings`, **When** the page loads, **Then** their profile data is fetched from `GET /profile/me` and displayed in an editable form.
2. **Given** a user updates their profile fields (firstName, lastName, bio, gender, dateOfBirth, nationality), **When** they save, **Then** the profile is updated via `PUT /profile/profile` and a success toast is shown.
3. **Given** a user clicks "Change Profile Picture", **When** they select an image, **Then** the 3-step upload flow executes: (1) get presigned URL, (2) upload to storage, (3) confirm and set as profile picture.
4. **Given** a user is on profile settings, **When** they view phones section, **Then** existing phones are listed with add/delete/set-default actions.
5. **Given** a user is on profile settings, **When** they view addresses section, **Then** existing addresses are listed with add/edit/delete/set-default actions.
6. **Given** a user changes their password, **When** they submit the form with current + new password, **Then** the password is changed via `POST /auth/change-password` and a success toast is shown.
7. **Given** a user is on profile settings, **When** they view active sessions, **Then** sessions are listed with revoke action.

---

### User Story 6 - Public Instructor Profile (Priority: P2)

As a visitor, I want to view an instructor's public profile by their slug URL so that I can see their bio, courses, and reviews.

**Why this priority**: Public profiles are important for instructor discovery and trust building.

**Independent Test**: Can be tested by navigating to `/instructor/:slug` and verifying the profile loads.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to `/instructor/:slug`, **When** the page loads, **Then** the instructor profile is fetched from `GET /public/instructors/{slug}` and displayed.
2. **Given** a visitor is on an instructor profile, **When** they view courses, **Then** the instructor's published courses are listed via `GET /public/instructors/{slug}/courses`.
3. **Given** a visitor navigates to a non-existent slug, **When** the API returns 404, **Then** a "Instructor not found" message is displayed.

---

### User Story 7 - Messaging Center (Priority: P3)

As a user, I want to view my conversations, send messages, and receive real-time messages via SignalR so that I can communicate with instructors and students.

**Why this priority**: Messaging is important for platform engagement but not blocking core learning functionality.

**Independent Test**: Can be tested by opening the messaging center, viewing conversations, and sending a message.

**Acceptance Scenarios**:

1. **Given** a user navigates to `/messages`, **When** the page loads, **Then** conversations are fetched from `GET /messages/conversations` and displayed.
2. **Given** a user clicks a conversation, **When** the conversation opens, **Then** messages are fetched from `GET /messages/conversations/{userId}` and displayed.
3. **Given** a user types a message and clicks send, **When** the action completes, **Then** the message is sent via `POST /messages` and appears in the conversation.
4. **Given** a user is on the messaging page, **When** a new message arrives via SignalR, **Then** the conversation list is updated in real-time.
5. **Given** a user is on the messaging page, **When** unread count changes, **Then** the badge in the navbar updates.

---

### User Story 8 - Wishlist & Refunds (Priority: P3)

As a student, I want to manage my wishlist and request refunds for purchases so that I can save courses for later and get refunds when needed.

**Why this priority**: Wishlist and refunds are secondary features that enhance user experience but are not blocking.

**Independent Test**: Can be tested by adding/removing courses from wishlist and requesting a refund.

**Acceptance Scenarios**:

1. **Given** a student navigates to `/wishlist`, **When** the page loads, **Then** wishlist items are fetched from `GET /wishlist` and displayed.
2. **Given** a student clicks "Remove" on a wishlist item, **When** the action completes, **Then** the item is removed via `DELETE /wishlist/{courseId}`.
3. **Given** a student navigates to `/refunds`, **When** the page loads, **Then** their refund requests are listed.
4. **Given** a student requests a refund, **When** they submit the form with paymentId and reason, **Then** the refund is created via `POST /refunds` and a success toast is shown.

---

### User Story 9 - Instructor Apply (Priority: P3)

As a student, I want to apply to become an instructor by submitting my credentials and documents so that I can create courses on the platform.

**Why this priority**: Instructor application is important for platform growth but not blocking existing functionality.

**Independent Test**: Can be tested by submitting an instructor application with documents.

**Acceptance Scenarios**:

1. **Given** a student navigates to `/instructor-apply`, **When** the page loads, **Then** the application form is displayed.
2. **Given** a student fills the application form with a message and documents, **When** they submit, **Then** the request is created via `POST /instructor-requests` and a success toast is shown.
3. **Given** a student has a pending application, **When** they view the page, **Then** the application status is shown with details.

---

### Edge Cases

- What happens when a dashboard API returns partial data (some metrics available, others not)? → Show available metrics with skeleton placeholders for missing ones.
- What happens when a profile picture upload fails at step 2 (presigned URL upload)? → Show error toast, allow retry, do not change profile picture.
- What happens when an admin tries to delete a coupon that has been used? → Show warning about existing usage, allow deactivation instead of deletion.
- What happens when a user tries to revoke their current session? → Show confirmation dialog, then revoke and redirect to login.
- What happens when a refund request is submitted for an already-refunded payment? → Show error "Refund already requested/processed".
- What happens when an instructor tries to apply but already has a pending request? → Show "Application already submitted" with status.
- What happens when a message is sent to a user who has blocked messaging? → Show error "Unable to send message to this user".
- What happens when SignalR connection drops during messaging? → Show reconnecting indicator, queue messages, sync when reconnected.
- What happens when a user tries to upload a profile picture that is too large (>10MB)? → Show client-side validation error before upload.
- What happens when admin tries to approve a refund that was already processed? → Show error "Refund already processed".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display student dashboard overview with metrics fetched from `GET /student/dashboard/overview` including enrolled courses, completed courses, certificates, and hours learned.
- **FR-002**: System MUST display student weekly activity chart from `GET /student/dashboard/weekly-activity`.
- **FR-003**: System MUST display student certificates from `GET /student/dashboard/certificates`.
- **FR-004**: System MUST display instructor dashboard overview with metrics from `GET /instructor/dashboard/overview` including revenue trend, enrollment trend, and student level distribution.
- **FR-005**: System MUST display instructor courses with enrollment count, rating, revenue, and status.
- **FR-006**: System MUST display admin dashboard overview with metrics from `GET /admin/dashboard/overview` including revenue trend, user growth, enrollment trend, top courses, and pending items.
- **FR-007**: System MUST provide admin tabs for Users Management, Coupons CRUD, Payment Methods, Refunds approve/reject, Teacher Requests, Reviews Moderation, and Announcements.
- **FR-008**: System MUST allow profile updates via `PUT /profile/profile` with fields: firstName, lastName, bio, gender, dateOfBirth, nationality.
- **FR-009**: System MUST implement 3-step profile picture upload: (1) get presigned URL from `POST /media/upload-url`, (2) upload to storage, (3) confirm via `POST /media/confirm-upload` and set via `POST /profile/picture`.
- **FR-010**: System MUST manage phones (add/delete/set-default) via `GET/POST/DELETE /profile/phones`.
- **FR-011**: System MUST manage addresses (add/edit/delete/set-default) via `GET/POST/PUT/DELETE /profile/addresses`.
- **FR-012**: System MUST change password via `POST /auth/change-password`.
- **FR-013**: System MUST display active sessions via `GET /auth/sessions` and allow revoking via `DELETE /auth/sessions/{id}`.
- **FR-014**: System MUST display public instructor profile by slug from `GET /public/instructors/{slug}`.
- **FR-015**: System MUST display instructor courses from `GET /public/instructors/{slug}/courses`.
- **FR-016**: System MUST display messaging center with conversations from `GET /messages/conversations`.
- **FR-017**: System MUST send messages via `POST /messages` and receive real-time messages via SignalR `/hubs/messaging`.
- **FR-018**: System MUST display wishlist from `GET /wishlist` with add/remove actions.
- **FR-019**: System MUST allow refund requests via `POST /refunds`.
- **FR-020**: System MUST allow instructor applications via `POST /instructor-requests` with document uploads.
- **FR-021**: System MUST display instructor request status via `GET /instructor-requests/my-requests`.
- **FR-022**: System MUST manage coupons (CRUD) via `GET/POST/PUT/DELETE /admin/coupons` and toggle via `PATCH /admin/coupons/{id}/toggle`.
- **FR-023**: System MUST manage payment methods via `GET/POST /admin/payment-methods` and toggle via `PATCH /admin/payment-methods/{id}/toggle`.
- **FR-024**: System MUST manage refunds via `GET /admin/refunds`, approve via `POST /admin/refunds/approve`, and reject via `POST /admin/refunds/reject`.
- **FR-025**: System MUST use `DashboardSkeleton` during dashboard data loading and `ErrorFallback` on failure.
- **FR-026**: System MUST support React Hook Form + Zod validation for all forms (Profile, Address, Phone, Contact, Coupon).
- **FR-027**: System MUST use toast notifications (sonner) for all CRUD operations success/error feedback.

### Key Entities

- **StudentOverview**: Dashboard metrics, recent courses, weekly activity chart, certificates.
- **InstructorOverview**: Dashboard metrics, courses, revenue/enrollment trends, student distribution.
- **AdminOverview**: Dashboard metrics, revenue/enrollment/user-growth trends, top courses, pending items.
- **Profile**: User profile with firstName, lastName, bio, gender, dateOfBirth, nationality, profileImageUrl, phones, addresses.
- **PublicProfile**: Public instructor profile with slug, bio, nationality, profileImageUrl.
- **Conversation**: Message thread between two users with last message, unread count.
- **Message**: Individual message with sender, receiver, content, timestamp, read status.
- **WishlistItem**: Saved course with courseId, title, image, price.
- **Refund**: Refund request with paymentId, amount, reason, status.
- **InstructorRequest**: Application to become instructor with status, documents, admin notes.
- **Coupon**: Discount code with type, value, limits, usage tracking.
- **PaymentMethod**: Payment gateway configuration with name, provider, type, active status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Student dashboard loads and displays all metrics within 2 seconds.
- **SC-002**: Instructor dashboard loads and displays all metrics within 2 seconds.
- **SC-003**: Admin dashboard loads and displays all metrics within 2 seconds.
- **SC-004**: Profile updates complete and reflect changes within 1 second.
- **SC-005**: Profile picture upload completes within 5 seconds for images under 5MB.
- **SC-006**: Messages are delivered in real-time via SignalR within 1 second.
- **SC-007**: Admin CRUD operations (coupons, refunds) complete within 2 seconds.
- **SC-008**: 95% of dashboard page loads show content (not error states) when backend is available.
- **SC-009**: All form validations provide inline feedback within 500ms of field interaction.
- **SC-010**: Public instructor profile loads within 1.5 seconds.

## Assumptions

- The backend API is available and running at the configured `VITE_API_URL`.
- All 22 service files and 16 custom hooks from Phases 1-3 are correctly implemented and tested.
- The existing page components (StudentDashboard, InstructorDashboard, AdminDashboard, ProfileSettings, MessagingCenter, etc.) will be rewritten to use real hooks instead of mock data.
- The backend already supports all required endpoints as documented in `MODIFICATION_GUIDE.md`.
- SignalR hubs (`/hubs/notifications`, `/hubs/messaging`) are available and functional.
- Media upload uses MinIO with presigned URLs (3-step flow).
- The platform is Arabic-first (RTL layout) and all user-facing strings are in Arabic.
- Dark mode is already supported via `useTheme.ts` and all new components must support it.
- Toast notifications use the `sonner` library (already installed).
- React Hook Form + Zod are available for form validation (already in package.json).
- Dashboard charts can use any charting library (e.g., Recharts, Chart.js) — choice is implementation detail.
