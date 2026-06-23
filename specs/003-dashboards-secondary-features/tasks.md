# Tasks: Dashboards + Secondary Features + Missing Backend Features

**Input**: Design documents from `/specs/003-dashboards-secondary-features/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-routes.md, quickstart.md

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US9)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install charting library and configure dependencies

- [ ] T001 Install Recharts for dashboard charts: `npm install recharts`
- [ ] T002 [P] Verify Recharts types are available: check `node_modules/recharts/types` exists

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Ensure dashboard services and hooks are properly configured

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Verify `src/services/dashboard.service.ts` exists and has all dashboard endpoints
- [ ] T004 [P] Verify `src/services/profile.service.ts` exists with phone/address management
- [ ] T005 [P] Verify `src/services/message.service.ts` exists with conversation endpoints
- [ ] T006 [P] Verify `src/services/wishlist.service.ts` exists with CRUD operations
- [ ] T007 [P] Verify `src/services/instructorRequest.service.ts` exists with submit/status
- [ ] T008 [P] Verify `src/services/admin.service.ts` exists with coupons/payment-methods/refunds
- [ ] T009 [P] Verify `src/services/publicInstructor.service.ts` exists with slug lookup
- [ ] T010 Verify `src/hooks/useSignalR.ts` exists and handles messaging events

**Checkpoint**: Foundation ready — all dashboard and secondary page stories can now be implemented

---

## Phase 3: User Story 1 — Student Dashboard Overview (Priority: P1) 🎯 MVP

**Goal**: Student can see dashboard with enrollment stats, recent courses, weekly activity, and certificates

**Independent Test**: Log in as student → navigate to `/student/dashboard` → metrics load → recent courses shown → weekly activity chart displays → certificates listed

### Implementation for User Story 1

- [ ] T011 [US1] Rewrite `src/features/student/StudentDashboard.tsx` — replace mock data with `useStudentOverview()` hook, render metrics cards (enrolled courses, completed, certificates, hours)
- [ ] T012 [P] [US1] Add recent courses section in `src/features/student/StudentDashboard.tsx` — render `recentCourses: StudentCourseDto[]` with progress percentages
- [ ] T013 [P] [US1] Add weekly activity chart in `src/features/student/StudentDashboard.tsx` — render `weeklyActivity: ChartSeriesDto` using Recharts LineChart
- [ ] T014 [P] [US1] Add certificates section in `src/features/student/StudentDashboard.tsx` — render `recentCertificates: StudentCertificateDto[]` with verification codes
- [ ] T015 [US1] Add loading state — show `DashboardSkeleton` while data loads
- [ ] T016 [US1] Add error state — show `ErrorFallback` with retry when API fails

**Checkpoint**: User Story 1 complete — student dashboard shows real backend data

---

## Phase 4: User Story 2 — Instructor Dashboard Overview (Priority: P1)

**Goal**: Instructor can see dashboard with course stats, revenue trends, enrollment trends, and pending edit requests

**Independent Test**: Log in as instructor → navigate to `/instructor/dashboard` → metrics load → revenue chart displays → enrollment chart displays → student distribution shown → courses listed

### Implementation for User Story 2

- [ ] T017 [US2] Rewrite `src/features/instructor/InstructorDashboard.tsx` — replace mock data with `useInstructorOverview()` hook, render metrics cards
- [ ] T018 [P] [US2] Add revenue trend chart in `src/features/instructor/InstructorDashboard.tsx` — render `revenueTrend: ChartSeriesDto` using Recharts LineChart (12 months)
- [ ] T019 [P] [US2] Add enrollment trend chart in `src/features/instructor/InstructorDashboard.tsx` — render `enrollmentTrend: ChartSeriesDto` using Recharts LineChart
- [ ] T020 [P] [US2] Add student level distribution in `src/features/instructor/InstructorDashboard.tsx` — render `studentLevelDistribution: DistributionItemDto[]` using Recharts PieChart
- [ ] T021 [P] [US2] Add courses list in `src/features/instructor/InstructorDashboard.tsx` — render `courses: InstructorCourseDto[]` with enrollment, rating, revenue, status
- [ ] T022 [US2] Add pending edit requests badge in `src/features/instructor/InstructorDashboard.tsx` — show `pendingEditRequests` count with link
- [ ] T023 [US2] Add loading state — show `DashboardSkeleton` while data loads
- [ ] T024 [US2] Add error state — show `ErrorFallback` with retry when API fails

**Checkpoint**: User Story 2 complete — instructor dashboard shows real backend data

---

## Phase 5: User Story 3 — Admin Dashboard Overview (Priority: P1)

**Goal**: Admin can see dashboard with platform stats, revenue, user growth, enrollment trends, and pending items

**Independent Test**: Log in as admin → navigate to `/admin/dashboard` → metrics load → charts display → top courses shown → pending items counted

### Implementation for User Story 3

- [ ] T025 [US3] Rewrite `src/features/admin/AdminDashboard.tsx` — replace mock data with `useAdminOverview()` hook, render metrics cards and tab navigation
- [ ] T026 [P] [US3] Add revenue trend chart in `src/features/admin/AdminDashboard.tsx` — render `revenueTrend: ChartSeriesDto` using Recharts LineChart
- [ ] T027 [P] [US3] Add user growth chart in `src/features/admin/AdminDashboard.tsx` — render `userGrowth: ChartSeriesDto` using Recharts LineChart
- [ ] T028 [P] [US3] Add enrollment trend chart in `src/features/admin/AdminDashboard.tsx` — render `enrollmentTrend: ChartSeriesDto` using Recharts LineChart
- [ ] T029 [P] [US3] Add course distribution pie chart in `src/features/admin/AdminDashboard.tsx` — render `courseDistribution: DistributionItemDto[]` using Recharts PieChart
- [ ] T030 [P] [US3] Add top courses list in `src/features/admin/AdminDashboard.tsx` — render `topCourses: TopCourseDto[]` ranked by enrollment/revenue
- [ ] T031 [US3] Add pending items section in `src/features/admin/AdminDashboard.tsx` — render `pendingItems: PendingItemsDto` with counts for courses, edit requests, teacher requests, flagged reviews
- [ ] T032 [US3] Add loading state — show `DashboardSkeleton` while data loads
- [ ] T033 [US3] Add error state — show `ErrorFallback` with retry when API fails

**Checkpoint**: User Story 3 complete — admin dashboard shows real backend data

---

## Phase 6: User Story 4 — Admin Dashboard Tabs (Priority: P2)

**Goal**: Admin can manage users, coupons, payment methods, refunds, instructor requests, reviews from dashboard tabs

**Independent Test**: Navigate to admin dashboard → click each tab → perform CRUD operations → verify changes persist

### Implementation for User Story 4

- [ ] T034 [US4] Add tab panel architecture in `src/features/admin/AdminDashboard.tsx` — implement URL-based tab state (`?tab=coupons`), lazy load tab content
- [ ] T035 [US4] Implement Users tab in `src/features/admin/AdminDashboard.tsx` — fetch from `GET /admin/users`, render user list with search and role filtering
- [ ] T036 [US4] Implement Coupons tab in `src/features/admin/AdminDashboard.tsx` — fetch from `adminService.getCoupons()`, render list with create/edit/toggle/delete actions
- [ ] T037 [US4] Add coupon creation form in `src/features/admin/AdminDashboard.tsx` — React Hook Form + Zod, submit calls `adminService.createCoupon()`, toast on success/error
- [ ] T038 [US4] Add coupon toggle in `src/features/admin/AdminDashboard.tsx` — toggle button calling `adminService.toggleCoupon()`, update list optimistically
- [ ] T039 [US4] Implement Payment Methods tab in `src/features/admin/AdminDashboard.tsx` — fetch from `adminService.getPaymentMethods()`, list with create/toggle actions
- [ ] T040 [US4] Implement Refunds tab in `src/features/admin/AdminDashboard.tsx` — fetch from `adminService.getRefunds()`, list with approve/reject actions
- [ ] T041 [US4] Add refund approve/reject in `src/features/admin/AdminDashboard.tsx` — buttons calling `adminService.approveRefund()` / `adminService.rejectRefund()`, toast feedback
- [ ] T042 [US4] Implement Teacher Requests tab in `src/features/admin/AdminDashboard.tsx` — fetch from `instructorRequestService.getPending()`, list with process/reject actions
- [ ] T043 [US4] Implement Reviews tab in `src/features/admin/AdminDashboard.tsx` — fetch pending reviews, list with approve/reject moderation actions
- [ ] T044 [US4] Add loading states per tab — skeleton while each tab's data loads
- [ ] T045 [US4] Add error states per tab — error fallback with retry per tab

**Checkpoint**: User Story 4 complete — all admin management tabs functional

---

## Phase 7: User Story 5 — Profile Settings & Media Upload (Priority: P2)

**Goal**: User can update profile, manage phones/addresses, upload profile picture, change password

**Independent Test**: Navigate to `/profile/settings` → update profile → upload picture → manage phones → manage addresses → change password

### Implementation for User Story 5

- [ ] T046 [US5] Rewrite `src/features/profile/ProfileSettings.tsx` — replace mock data with `useProfile()` hook, render editable form with React Hook Form + Zod
- [ ] T047 [US5] Add profile update form in `src/features/profile/ProfileSettings.tsx` — fields: firstName, lastName, bio, gender, dateOfBirth, nationality, submit calls `profileService.update()`, toast feedback
- [ ] T048 [US5] Implement 3-step profile picture upload in `src/features/profile/ProfileSettings.tsx` — (1) get presigned URL from `mediaService.getUploadUrl()`, (2) upload to storage via `mediaService.uploadToPresignedUrl()`, (3) confirm via `mediaService.confirmUpload()` + set via `profileService.setPicture()`
- [ ] T049 [US5] Add client-side image validation in `src/features/profile/ProfileSettings.tsx` — max 5MB, image types only (JPEG, PNG, WebP), show error before upload
- [ ] T050 [P] [US5] Add phones management in `src/features/profile/ProfileSettings.tsx` — list from `profileService.getPhones()`, add/delete/set-default actions
- [ ] T051 [P] [US5] Add addresses management in `src/features/profile/ProfileSettings.tsx` — list from `profileService.getAddresses()`, add/edit/delete/set-default actions
- [ ] T052 [US5] Add change password form in `src/features/profile/ProfileSettings.tsx` — current + new password fields, submit calls `authService.changePassword()`, toast feedback
- [ ] T053 [US5] Add active sessions section in `src/features/profile/ProfileSettings.tsx` — list from `authService.getSessions()`, revoke button calling `authService.revokeSession()`, confirmation dialog for current session
- [ ] T054 [US5] Add loading state — skeleton while profile data loads
- [ ] T055 [US5] Add error state — error fallback with retry

**Checkpoint**: User Story 5 complete — profile management fully functional

---

## Phase 8: User Story 6 — Public Instructor Profile (Priority: P2)

**Goal**: Visitor can view instructor's public profile by slug with bio, courses, and reviews

**Independent Test**: Navigate to `/instructor/:slug` → profile loads → courses listed → 404 for non-existent slug

### Implementation for User Story 6

- [ ] T056 [US6] Rewrite `src/features/public-profile/PublicProfile.tsx` — replace mock data with `usePublicInstructor(slug)` hook, render profile with fullName, bio, nationality, profileImageUrl
- [ ] T057 [US6] Add instructor courses section in `src/features/public-profile/PublicProfile.tsx` — fetch from `publicInstructorService.getCourses(slug)`, render course cards
- [ ] T058 [US6] Add 404 handling in `src/features/public-profile/PublicProfile.tsx` — show "Instructor not found" message when API returns 404
- [ ] T059 [US6] Add loading state — skeleton while profile loads
- [ ] T060 [US6] Add error state — error fallback with retry

**Checkpoint**: User Story 6 complete — public instructor profile functional

---

## Phase 9: User Story 7 — Messaging Center (Priority: P3)

**Goal**: User can view conversations, send messages, receive real-time messages via SignalR

**Independent Test**: Navigate to `/messages` → conversations load → click conversation → messages display → send message → receive real-time message

### Implementation for User Story 7

- [ ] T061 [US7] Rewrite `src/features/messaging/MessagingCenter.tsx` — replace mock data with `useConversations()` hook, render conversation list with last message and unread count
- [ ] T062 [US7] Add conversation detail view in `src/features/messaging/MessagingCenter.tsx` — fetch from `messageService.getConversation(userId)`, render message list
- [ ] T063 [US7] Add message send in `src/features/messaging/MessagingCenter.tsx` — text input + send button, submit calls `messageService.send()`, append message to list
- [ ] T064 [US7] Integrate SignalR for real-time messages in `src/features/messaging/MessagingCenter.tsx` — listen to `ReceiveMessage` event, update conversation list and message list
- [ ] T065 [US7] Add unread count badge in `src/components/layout/Navbar.tsx` — fetch from `messageService.getUnreadCount()`, update via SignalR
- [ ] T066 [US7] Add loading state — skeleton while conversations load
- [ ] T067 [US7] Add error state — error fallback with retry
- [ ] T068 [US7] Add reconnecting indicator — show when SignalR connection drops

**Checkpoint**: User Story 7 complete — messaging with real-time support functional

---

## Phase 10: User Story 8 — Wishlist & Refunds (Priority: P3)

**Goal**: Student can manage wishlist and request refunds

**Independent Test**: Navigate to `/wishlist` → items load → remove item → navigate to `/refunds` → request refund → confirm

### Implementation for User Story 8

- [ ] T069 [US8] Rewrite `src/features/wishlist/Wishlist.tsx` — replace mock data with `useWishlist()` hook, render wishlist items with course info
- [ ] T070 [US8] Add remove from wishlist in `src/features/wishlist/Wishlist.tsx` — remove button calling `wishlistService.remove()`, update list
- [ ] T071 [US8] Rewrite `src/features/refunds/Refunds.tsx` — replace mock data with `useRefunds()` hook, render refund request list
- [ ] T072 [US8] Add refund request form in `src/features/refunds/Refunds.tsx` — select payment + reason, submit calls `refundService.request()`, toast feedback
- [ ] T073 [US8] Add loading states — skeleton while data loads
- [ ] T074 [US8] Add error states — error fallback with retry

**Checkpoint**: User Story 8 complete — wishlist and refunds functional

---

## Phase 11: User Story 9 — Instructor Apply (Priority: P3)

**Goal**: Student can apply to become instructor by submitting credentials and documents

**Independent Test**: Navigate to `/instructor-apply` → fill form → upload documents → submit → see status

### Implementation for User Story 9

- [ ] T075 [US9] Rewrite `src/features/instructor-apply/InstructorApply.tsx` — replace mock data with `useInstructorRequest()` hook
- [ ] T076 [US9] Add application form in `src/features/instructor-apply/InstructorApply.tsx` — message field + document upload, React Hook Form + Zod validation
- [ ] T077 [US9] Add document upload in `src/features/instructor-apply/InstructorApply.tsx` — upload documents via `mediaService.uploadFile()`, attach fileIds to submission
- [ ] T078 [US9] Add submit handler in `src/features/instructor-apply/InstructorApply.tsx` — call `instructorRequestService.submit()`, toast feedback
- [ ] T079 [US9] Add application status display in `src/features/instructor-apply/InstructorApply.tsx` — fetch from `instructorRequestService.getMyRequests()`, show status with details
- [ ] T080 [US9] Add loading state — skeleton while data loads
- [ ] T081 [US9] Add error state — error fallback with retry

**Checkpoint**: User Story 9 complete — instructor application functional

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T082 [P] Verify all dashboard charts support dark mode — check Recharts colors in dark theme
- [ ] T083 [P] Verify RTL layout on all rewritten pages — ensure `dir="rtl"` and logical CSS properties
- [ ] T084 [P] Verify all user-facing strings are in Arabic — no hardcoded English in UI
- [ ] T085 [P] Verify accessibility — keyboard navigation, ARIA labels, focus indicators on all interactive elements
- [ ] T086 Run quickstart.md validation scenarios — test all 12 scenarios end-to-end
- [ ] T087 Verify no mock data remains — search for any remaining `src/data/index.ts` imports in page components
- [ ] T088 Verify bundle size — `npm run build` and check gzipped size ≤ 200KB

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **User Stories (Phase 3-11)**: All depend on Phase 2 completion
  - US1 (P1), US2 (P1), US3 (P1) can run in parallel
  - US4 (P2), US5 (P2), US6 (P2) can run in parallel after US1-US3
  - US7 (P3), US8 (P3), US9 (P3) can run in parallel after US4-US6
- **Polish (Phase 12)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (Student Dashboard)**: Can start after Phase 2 — no dependencies on other stories
- **US2 (Instructor Dashboard)**: Can start after Phase 2 — no dependencies on other stories
- **US3 (Admin Dashboard)**: Can start after Phase 2 — no dependencies on other stories
- **US4 (Admin Tabs)**: Can start after Phase 3 (US3) — depends on admin dashboard being implemented
- **US5 (Profile Settings)**: Can start after Phase 2 — no dependencies on other stories
- **US6 (Public Profile)**: Can start after Phase 2 — no dependencies on other stories
- **US7 (Messaging)**: Can start after Phase 2 — no dependencies on other stories
- **US8 (Wishlist/Refunds)**: Can start after Phase 2 — no dependencies on other stories
- **US9 (Instructor Apply)**: Can start after Phase 2 — no dependencies on other stories

### Within Each User Story

- Implementation tasks in dependency order (hooks before UI, forms before submission)
- Each story has loading/error state handling
- Each story can be stopped at checkpoint and validated independently

### Parallel Opportunities

- T012 + T013 + T014 (student dashboard sections) — parallel
- T018 + T019 + T020 + T021 (instructor dashboard charts) — parallel
- T026 + T027 + T028 + T029 + T030 (admin dashboard charts) — parallel
- T050 + T051 (phones + addresses management) — parallel
- T082 + T083 + T084 + T085 (polish tasks) — parallel
- US1 + US2 + US3 can run in parallel (different dashboard pages)
- US5 + US6 + US7 + US8 + US9 can run in parallel (different secondary pages)

---

## Parallel Example: User Story 3 (Admin Dashboard)

```bash
# Launch all chart tasks together:
Task: "Add revenue trend chart in src/features/admin/AdminDashboard.tsx"
Task: "Add user growth chart in src/features/admin/AdminDashboard.tsx"
Task: "Add enrollment trend chart in src/features/admin/AdminDashboard.tsx"
Task: "Add course distribution pie chart in src/features/admin/AdminDashboard.tsx"
Task: "Add top courses list in src/features/admin/AdminDashboard.tsx"

# Then sequential:
Task: "Add pending items section in src/features/admin/AdminDashboard.tsx" (depends on T025)
Task: "Add loading state in src/features/admin/AdminDashboard.tsx" (depends on T025)
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US3 Only)

1. Complete Phase 1: Setup (install Recharts)
2. Complete Phase 2: Foundational (verify services/hooks)
3. Complete Phase 3: User Story 1 (Student Dashboard)
4. Complete Phase 4: User Story 2 (Instructor Dashboard)
5. Complete Phase 5: User Story 3 (Admin Dashboard Overview)
6. **STOP and VALIDATE**: Test all dashboards end-to-end
7. Deploy/demo if ready

### Incremental Delivery

1. Phase 1+2 → Foundation ready
2. Phase 3+4+5 → All dashboards complete → Deploy/Demo (MVP!)
3. Phase 6 → Admin management tabs → Deploy/Demo (admin operations!)
4. Phase 7+8 → Profile + Public Profile → Deploy/Demo (user management!)
5. Phase 9+10+11 → Messaging + Wishlist + Instructor Apply → Deploy/Demo (engagement!)
6. Phase 12 → Polish → Final release

### Parallel Team Strategy

With multiple developers:
1. Team completes Phase 1+2 together
2. Once Phase 2 is done:
   - Developer A: US1 + US2 + US3 (All Dashboards)
   - Developer B: US4 + US5 (Admin Tabs + Profile)
   - Developer C: US6 + US7 + US8 + US9 (Secondary Pages)
3. Stories complete and integrate independently
4. Phase 12 together for polish

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All page components are REWRITES of existing files — preserve working code where possible
- Dashboard charts use Recharts (decision from research.md)
- Profile picture upload follows 3-step presigned URL flow (decision from research.md)
- Admin dashboard uses tab panels with URL-based state (decision from research.md)
