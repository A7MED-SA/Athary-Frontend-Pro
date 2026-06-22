# Tasks: Frontend Foundation — API Layer + Types + Services + SignalR + Shared Components

**Input**: Design documents from `/specs/001-frontend-foundation/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included as requested in the feature specification (US7) and constitution (NON-NEGOTIABLE).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Install dependencies, configure build tools, verify project compiles

- [x] T001 Install required dependencies: `@tanstack/react-query`, `@microsoft/signalr`, `axios`, `sonner`, `zod`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom` in `package.json`
- [x] T002 Create environment configuration: `VITE_API_BASE_URL` and `VITE_SIGNALR_URL` in `.env` and type-safe env module at `src/lib/env.ts`
- [x] T003 [P] Configure Vitest with React Testing Library in `vitest.config.ts`
- [x] T004 [P] Configure path alias `@/` → `src/` in `tsconfig.json` and `vite.config.ts`

---

## Phase 2: Foundational (API Client + Types — BLOCKS ALL USER STORIES)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### API Client (US1 Core)

- [x] T005 Implement centralized Axios instance with `withCredentials: true`, 15s timeout, and `VITE_API_BASE_URL` base URL in `src/lib/api.ts`
- [x] T006 Implement 401 interceptor with automatic token refresh, failed queue for concurrent requests, `_retry` flag to prevent infinite loops, and redirect to `/auth` on refresh failure in `src/lib/api.ts`
- [x] T007 Implement error interceptor for 400, 403, 404, 429, 500 with `console.error` logging in `src/lib/api.ts`

### Query Client + Key Factory

- [x] T008 Create TanStack Query client configuration with `staleTime: 30s` for lists, `5min` for static data in `src/lib/query-client.ts`
- [x] T009 Create structured query key factory with domain-scoped keys in `src/lib/query-keys.ts`

### Generic Types (US2 Core)

- [x] T010 [P] Create generic `ApiResponse<T>` and `PagedList<T>` types in `src/types/api/envelope.ts`
- [x] T011 [P] Create branded ID types (`CourseId`, `UserId`, `EnrollmentId`, etc.) in `src/types/api/branded.ts`
- [x] T012 Create barrel export for all API types in `src/types/api/index.ts`

### Domain Types (US2)

- [x] T013 [P] Create auth types: `LoginRequest`, `RegisterRequest`, `AuthResponse`, `UserInfoDto`, `OAuthLoginRequest`, `SessionDto`, `Gender` in `src/types/api/auth.ts`
- [x] T014 [P] Create profile types: `ProfileDto`, `PublicProfileDto`, `PhoneDto`, `AddressDto`, `PhoneType` in `src/types/api/profile.ts`
- [x] T015 [P] Create course types: `PublicCourseDto`, `PublicCourseDetailDto`, `PublicCourseFilterDto`, `CourseLevel`, `CourseLanguage`, `PublicCourseSortBy` in `src/types/api/course.ts`
- [x] T016 [P] Create enrollment types: `EnrollmentResponseDto`, `ContentProgressDto`, `EnrollmentStatus`, `EnrollmentSource`, `ContentType` in `src/types/api/enrollment.ts`
- [x] T017 [P] Create cart types: `CartResponseDto`, `CartItemDto`, `ApplyCouponResponse` in `src/types/api/cart.ts`
- [x] T018 [P] Create order types: `OrderResponseDto`, `OrderDetailDto`, `OrderItemDto` in `src/types/api/order.ts`
- [x] T019 [P] Create payment types: `PaymentResponseDto`, `PaymentMethodResponse` in `src/types/api/payment.ts`
- [x] T020 [P] Create quiz types: `QuizResponseDto`, `QuestionResponseDto`, `SubmitAttemptRequest`, `QuizAttemptResultResponse` in `src/types/api/quiz.ts`
- [x] T021 [P] Create certificate types: `CertificateResponse`, `CertificateVerificationResponse` in `src/types/api/certificate.ts`
- [x] T022 [P] Create notification types: `NotificationDto`, `NotificationListDto`, `NotificationPreferencesDto` in `src/types/api/notification.ts`
- [x] T023 [P] Create message types: `MessageResponse`, `ConversationResponse`, `ConversationListResponse` in `src/types/api/message.ts`
- [x] T024 [P] Create review types: `ReviewResponse`, `ReviewDetailResponse` in `src/types/api/review.ts`
- [x] T025 [P] Create live session types: `LiveSessionResponseDto` in `src/types/api/liveSession.ts`
- [x] T026 [P] Create wishlist types: `WishlistItemDto`, `WishlistResponseDto` in `src/types/api/wishlist.ts`
- [x] T027 [P] Create announcement types: `AnnouncementResponse`, `AnnouncementListResponse` in `src/types/api/announcement.ts`
- [x] T028 [P] Create dashboard types: `StudentOverviewDto`, `InstructorOverviewDto`, `AdminOverviewDto`, `InstructorRevenueDto`, `InstructorStudentDto`, `StudentCertificatesDto`, `StudentWishlistDto`, `StudentPaymentsDto` in `src/types/api/dashboard.ts`
- [x] T029 [P] Create landing types: `LandingDto`, `LandingStatsDto`, `TestimonialDto` in `src/types/api/landing.ts`
- [x] T030 [P] Create media types: `UploadUrlRequestDto`, `MediaFileDto`, `MediaConfirmUploadRequest`, `MediaFileUrlResponse` in `src/types/api/media.ts`
- [x] T031 [P] Create contact types: `ContactMessageDto` in `src/types/api/contact.ts`
- [x] T032 [P] Create instructor request types: `InstructorRequestDto`, `SubmitInstructorRequestDto`, `InstructorRequestResponseDto` in `src/types/api/instructorRequest.ts`
- [x] T033 [P] Create refund types: `RefundResponseDto`, `RequestRefundRequest` in `src/types/api/refund.ts`
- [x] T034 [P] Create coupon types: `CouponResponseDto`, `ValidateCouponResponse` in `src/types/api/coupon.ts`

**Checkpoint**: Foundation ready — API client, query client, all 23 type files exist. User story implementation can now begin.

---

## Phase 3: User Story 1 + 2 + 3 — Service Layer (Priority: P1) 🎯 MVP

**Goal**: 22 typed service files that encapsulate all HTTP calls using the centralized API client, with correct routes, request/response types, and method signatures matching the backend controllers.

**Independent Test**: Each service file can be imported and its methods called with correctly typed arguments. Routes match the backend exactly. No service makes direct `axios` calls — all use the centralized `api` instance.

### Auth Services (US1+US3)

- [x] T035 [P] [US3] Implement `authService` with login, register, logout, refresh, OAuth, 2FA, sessions in `src/features/auth/services/auth.service.ts`
- [x] T036 [P] [US3] Implement `publicService` with course listing, course detail, related courses, sections, FAQ, profiles, testimonials, landing in `src/features/public/services/public.service.ts`
- [x] T037 [P] [US3] Implement `instructorRequestService` with submit and getStatus in `src/features/instructorRequests/services/instructorRequest.service.ts`

### Course Services (US3)

- [x] T038 [P] [US3] Implement `courseService` with admin courses, instructor courses, CRUD, publish, archive in `src/features/courses/services/course.service.ts`
- [x] T039 [P] [US3] Implement `courseAdminService` with approve, reject, archive, featured status in `src/features/admin/services/courseAdmin.service.ts`
- [x] T040 [P] [US3] Implement `curriculumService` with section CRUD and ordering in `src/features/courses/services/curriculum.service.ts`
- [x] T041 [P] [US3] Implement `categoryService` with CRUD in `src/features/courses/services/category.service.ts`

### Enrollment & Learning Services (US3)

- [x] T042 [P] [US3] Implement `enrollmentService` with enrollments, progress, completion in `src/features/enrollment/services/enrollment.service.ts`
- [x] T043 [P] [US3] Implement `quizService` with quizzes, attempts, submit in `src/features/enrollment/services/quiz.service.ts`
- [x] T044 [P] [US3] Implement `certificateService` with my certificates, verify, PDF in `src/features/certificates/services/certificate.service.ts`

### Commerce Services (US3)

- [x] T045 [P] [US3] Implement `cartService` with get, add, remove, clear, coupon in `src/features/cart/services/cart.service.ts`
- [x] T046 [P] [US3] Implement `orderService` with checkout, get orders, order detail in `src/features/cart/services/order.service.ts`
- [x] T047 [P] [US3] Implement `paymentService` with methods, intent, confirm, webhook in `src/features/cart/services/payment.service.ts`

### Communication Services (US3)

- [x] T048 [P] [US3] Implement `notificationService` with notifications, unread count, mark read, preferences in `src/features/notifications/services/notification.service.ts`
- [x] T049 [P] [US3] Implement `messageService` with conversations, messages, send, read in `src/features/messaging/services/message.service.ts`

### User Services (US3)

- [x] T050 [P] [US3] Implement `profileService` with get/update profile, phone/address CRUD, public profiles in `src/features/profile/services/profile.service.ts`
- [x] T051 [P] [US3] Implement `dashboardService` with student/instructor/admin overviews in `src/features/dashboards/services/dashboard.service.ts`

### Review & Session Services (US3)

- [x] T052 [P] [US3] Implement `reviewService` with course reviews, user reviews, CRUD in `src/features/reviews/services/review.service.ts`
- [x] T053 [P] [US3] Implement `liveSessionService` with sessions, CRUD, join, start/end in `src/features/liveSessions/services/liveSession.service.ts`

### Wishlist, Announcement, Media Services (US3)

- [x] T054 [P] [US3] Implement `wishlistService` with get, add, remove, check in `src/features/wishlist/services/wishlist.service.ts`
- [x] T055 [P] [US3] Implement `announcementService` with announcements, CRUD in `src/features/announcements/services/announcement.service.ts`
- [x] T056 [P] [US3] Implement `mediaService` with presigned URL upload flow (3-step), delete, get URL in `src/features/media/services/media.service.ts`

### Admin & Contact Services (US3)

- [x] T057 [P] [US3] Implement `adminService` with admin-level operations in `src/features/admin/services/admin.service.ts`
- [x] T058 [P] [US3] Implement `contactService` with send message in `src/features/public/services/contact.service.ts`

**Checkpoint**: All 22 service files exist, compile with zero TypeScript errors, routes match backend exactly.

---

## Phase 4: User Story 4 + 5 + 6 — SignalR + Components + Hooks (Priority: P2)

**Goal**: SignalR real-time integration, 4 shared UI components, and 16 TanStack Query hooks.

**Independent Test**: SignalR connections establish and receive notifications. Shared components render correctly in light/dark modes. Hooks return properly typed data with loading/error/success states.

### SignalR (US4)

- [x] T059 [P] [US4] Implement SignalR hub connection factories for notifications and messaging with automatic reconnection (backoff: 0, 2s, 5s, 10s, 30s) in `src/lib/signalr.ts`
- [x] T060 [US4] Implement `useSignalR` hook with connection lifecycle, event listeners, cleanup on logout, integration with notification store in `src/features/common/hooks/useSignalR.ts`

### Shared Components (US5)

- [x] T061 [P] [US5] Implement `Pagination` component with page buttons, ellipsis for distant pages, prev/next arrows, dark mode support in `src/components/shared/Pagination.tsx`
- [x] T062 [P] [US5] Implement `Skeleton` component with `CourseCardSkeleton` and `DashboardSkeleton` variants, pulsing animation, dark mode support in `src/components/shared/Skeleton.tsx`
- [x] T063 [P] [US5] Implement `ErrorFallback` component with error title, message, retry button, dark mode support in `src/components/shared/ErrorFallback.tsx`
- [x] T064 [P] [US5] Implement `EmptyState` component with icon, title, description, action button, dark mode support in `src/components/shared/EmptyState.tsx`

### Custom Hooks (US6)

- [x] T065 [P] [US6] Implement `useAuth` hook with login/logout/register mutations, user state, isAuthenticated, token management in `src/features/common/hooks/useAuth.ts`
- [x] T066 [P] [US6] Implement `useCourses` hook with course list/detail queries, CRUD mutations, cache invalidation in `src/features/common/hooks/useCourses.ts`
- [x] T067 [P] [US6] Implement `useCategories` hook with categories query, CRUD mutations in `src/features/common/hooks/useCategories.ts`
- [x] T068 [P] [US6] Implement `useCart` hook with cart query, add/remove/clear mutations, coupon mutation in `src/features/common/hooks/useCart.ts`
- [x] T069 [P] [US6] Implement `useOrders` hook with checkout mutation, orders query, order detail query in `src/features/common/hooks/useOrders.ts`
- [x] T070 [P] [US6] Implement `usePayment` hook with payment methods query, intent mutation, confirm mutation in `src/features/common/hooks/usePayment.ts`
- [x] T071 [P] [US6] Implement `useEnrollments` hook with enrollments query, progress query, completion mutations in `src/features/common/hooks/useEnrollments.ts`
- [x] T072 [P] [US6] Implement `useQuiz` hook with quizzes query, attempt mutations in `src/features/common/hooks/useQuiz.ts`
- [x] T073 [P] [US6] Implement `useCertificates` hook with certificates query, verify query, PDF download in `src/features/common/hooks/useCertificates.ts`
- [x] T074 [P] [US6] Implement `useNotifications` hook with notifications query, unread count, mark read mutations, preferences in `src/features/common/hooks/useNotifications.ts`
- [x] T075 [P] [US6] Implement `useMessages` hook with conversations query, messages query, send mutation, read mutation in `src/features/common/hooks/useMessages.ts`
- [x] T076 [P] [US6] Implement `useProfile` hook with profile query, update mutation, phone/address CRUD in `src/features/common/hooks/useProfile.ts`
- [x] T077 [P] [US6] Implement `useDashboard` hook with student/instructor/admin overview queries in `src/features/common/hooks/useDashboard.ts`
- [x] T078 [P] [US6] Implement `useReview` hook with course reviews query, user reviews query, CRUD mutations in `src/features/common/hooks/useReview.ts`
- [x] T079 [P] [US6] Implement `useLiveSession` hook with sessions queries, CRUD mutations, join/start/end mutations in `src/features/common/hooks/useLiveSession.ts`
- [x] T080 [P] [US6] Implement `useAnnouncement` hook with announcements queries, CRUD mutations in `src/features/common/hooks/useAnnouncement.ts`

**Checkpoint**: SignalR connections work, shared components render, all 16 hooks return typed data.

---

## Phase 5: User Story 7 — Unit Tests (Priority: P2)

**Goal**: Co-located unit tests for all 22 services and 16 hooks with ≥80% line coverage per constitution.

**Independent Test**: Each test file runs independently with Vitest. All tests pass. Coverage report shows ≥80% line coverage per file.

### Service Tests (US7)

- [x] T081 [P] [US7] Write tests for `authService`: login, register, logout, refresh, OAuth, 2FA, sessions in `src/features/auth/services/auth.service.test.ts`
- [x] T082 [P] [US7] Write tests for `publicService`: course listing, detail, related, profiles, landing in `src/features/public/services/public.service.test.ts`
- [x] T083 [P] [US7] Write tests for `instructorRequestService`: submit, getStatus in `src/features/instructorRequests/services/instructorRequest.service.test.ts`
- [x] T084 [P] [US7] Write tests for `courseService`: admin courses, instructor courses, CRUD, publish, archive in `src/features/courses/services/course.service.test.ts`
- [x] T085 [P] [US7] Write tests for `courseAdminService`: approve, reject, archive, featured in `src/features/admin/services/courseAdmin.service.test.ts`
- [x] T086 [P] [US7] Write tests for `curriculumService`: section CRUD, ordering in `src/features/courses/services/curriculum.service.test.ts`
- [x] T087 [P] [US7] Write tests for `categoryService`: CRUD in `src/features/courses/services/category.service.test.ts`
- [x] T088 [P] [US7] Write tests for `enrollmentService`: enrollments, progress, completion in `src/features/enrollment/services/enrollment.service.test.ts`
- [x] T089 [P] [US7] Write tests for `quizService`: quizzes, attempts, submit in `src/features/enrollment/services/quiz.service.test.ts`
- [x] T090 [P] [US7] Write tests for `certificateService`: certificates, verify, PDF in `src/features/certificates/services/certificate.service.test.ts`
- [x] T091 [P] [US7] Write tests for `cartService`: get, add, remove, clear, coupon in `src/features/cart/services/cart.service.test.ts`
- [x] T092 [P] [US7] Write tests for `orderService`: checkout, orders, detail in `src/features/cart/services/order.service.test.ts`
- [x] T093 [P] [US7] Write tests for `paymentService`: methods, intent, confirm, webhook in `src/features/cart/services/payment.service.test.ts`
- [x] T094 [P] [US7] Write tests for `notificationService`: notifications, count, read, preferences in `src/features/notifications/services/notification.service.test.ts`
- [x] T095 [P] [US7] Write tests for `messageService`: conversations, messages, send, read in `src/features/messaging/services/message.service.test.ts`
- [x] T096 [P] [US7] Write tests for `profileService`: profile, phones, addresses in `src/features/profile/services/profile.service.test.ts`
- [x] T097 [P] [US7] Write tests for `dashboardService`: student/instructor/admin overviews in `src/features/dashboards/services/dashboard.service.test.ts`
- [x] T098 [P] [US7] Write tests for `reviewService`: reviews, CRUD in `src/features/reviews/services/review.service.test.ts`
- [x] T099 [P] [US7] Write tests for `liveSessionService`: sessions, CRUD, join in `src/features/liveSessions/services/liveSession.service.test.ts`
- [x] T100 [P] [US7] Write tests for `wishlistService`: get, add, remove, check in `src/features/wishlist/services/wishlist.service.test.ts`
- [x] T101 [P] [US7] Write tests for `announcementService`: announcements, CRUD in `src/features/announcements/services/announcement.service.test.ts`
- [x] T102 [P] [US7] Write tests for `mediaService`: presigned URL flow, delete, get URL in `src/features/media/services/media.service.test.ts`

### Hook Tests (US7)

- [x] T103 [P] [US7] Write tests for `useAuth`: initial state, login/logout/register, cleanup in `src/features/common/hooks/useAuth.test.ts`
- [x] T104 [P] [US7] Write tests for `useSignalR`: connection lifecycle, event listeners, cleanup in `src/features/common/hooks/useSignalR.test.ts`
- [x] T105 [P] [US7] Write tests for `useCourses`: queries, mutations, cache invalidation in `src/features/common/hooks/useCourses.test.ts`
- [x] T106 [P] [US7] Write tests for `useCategories`: queries, mutations in `src/features/common/hooks/useCategories.test.ts`
- [x] T107 [P] [US7] Write tests for `useCart`: queries, mutations, coupon in `src/features/common/hooks/useCart.test.ts`
- [x] T108 [P] [US7] Write tests for `useOrders`: queries, mutations in `src/features/common/hooks/useOrders.test.ts`
- [x] T109 [P] [US7] Write tests for `usePayment`: queries, mutations in `src/features/common/hooks/usePayment.test.ts`
- [x] T110 [P] [US7] Write tests for `useEnrollments`: queries, mutations in `src/features/common/hooks/useEnrollments.test.ts`
- [x] T111 [P] [US7] Write tests for `useQuiz`: queries, mutations in `src/features/common/hooks/useQuiz.test.ts`
- [x] T112 [P] [US7] Write tests for `useCertificates`: queries, verify, PDF in `src/features/common/hooks/useCertificates.test.ts`
- [x] T113 [P] [US7] Write tests for `useNotifications`: queries, mutations, preferences in `src/features/common/hooks/useNotifications.test.ts`
- [x] T114 [P] [US7] Write tests for `useMessages`: queries, mutations in `src/features/common/hooks/useMessages.test.ts`
- [x] T115 [P] [US7] Write tests for `useProfile`: queries, mutations in `src/features/common/hooks/useProfile.test.ts`
- [x] T116 [P] [US7] Write tests for `useDashboard`: queries in `src/features/common/hooks/useDashboard.test.ts`
- [x] T117 [P] [US7] Write tests for `useReview`: queries, mutations in `src/features/common/hooks/useReview.test.ts`
- [x] T118 [P] [US7] Write tests for `useLiveSession`: queries, mutations in `src/features/common/hooks/useLiveSession.test.ts`
- [x] T119 [P] [US7] Write tests for `useAnnouncement`: queries, mutations in `src/features/common/hooks/useAnnouncement.test.ts`

### Component Tests (US7)

- [x] T120 [P] [US7] Write tests for `Pagination`: page rendering, ellipsis, prev/next, dark mode in `src/components/shared/Pagination.test.tsx`
- [x] T121 [P] [US7] Write tests for `Skeleton`: variants, pulsing, dark mode in `src/components/shared/Skeleton.test.tsx`
- [x] T122 [P] [US7] Write tests for `ErrorFallback`: error display, retry button, dark mode in `src/components/shared/ErrorFallback.test.tsx`
- [x] T123 [P] [US7] Write tests for `EmptyState`: icon, title, action button, dark mode in `src/components/shared/EmptyState.test.tsx`

**Checkpoint**: All 38+ test files exist and pass with ≥80% line coverage. Constitution testing gate satisfied.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T124 Run `tsc --noEmit` to verify zero TypeScript errors across all files
- [x] T125 Run `pnpm test:unit -- --coverage` to verify ≥80% line coverage for all services and hooks
- [x] T126 Run `pnpm lint` to verify zero ESLint errors and zero `any` types
- [x] T127 Run quickstart.md validation scenarios manually
- [x] T128 Verify no circular dependencies with `madge --circular src/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **Service Layer (Phase 3)**: Depends on Foundational completion — BLOCKS US4, US5, US6
- **SignalR + Components + Hooks (Phase 4)**: Depends on Service Layer completion
- **Unit Tests (Phase 5)**: Depends on Service Layer + Hooks completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 — API Client (P1)**: Part of Phase 2 (T005-T007) — blocks everything
- **US2 — Typed DTOs (P1)**: Part of Phase 2 (T010-T034) — blocks services
- **US3 — Service Layer (P1)**: Part of Phase 3 (T035-T058) — depends on US1+US2
- **US4 — SignalR (P2)**: Phase 4 (T059-T060) — depends on US1
- **US5 — Shared Components (P2)**: Phase 4 (T061-T064) — independent, no dependencies
- **US6 — Custom Hooks (P2)**: Phase 4 (T065-T080) — depends on US1, US3
- **US7 — Unit Tests (P2)**: Phase 5 (T081-T123) — depends on US3, US5, US6

### Within Each Phase

- Tests (if included) MUST be written and FAIL before implementation
- Types before services
- Services before hooks
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 2**: All 23 type files (T013-T034) can run in parallel — different files, no dependencies
- **Phase 3**: All 22 service files (T035-T058) can run in parallel — each service is a different file
- **Phase 4**: All shared components (T061-T064) can run in parallel; all hooks (T065-T080) can run in parallel
- **Phase 5**: All 38+ test files (T081-T123) can run in parallel — each test is co-located with its source

---

## Parallel Example: User Story 3 (Service Layer)

```bash
# Launch all 22 service files in parallel:
Task: "Implement authService in src/features/auth/services/auth.service.ts"
Task: "Implement publicService in src/features/public/services/public.service.ts"
Task: "Implement courseService in src/features/courses/services/course.service.ts"
Task: "Implement enrollmentService in src/features/enrollment/services/enrollment.service.ts"
Task: "Implement cartService in src/features/cart/services/cart.service.ts"
# ... (all 22 services)
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: Service Layer (US1+US2+US3)
4. **STOP and VALIDATE**: Test services independently, verify routes match backend
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add Service Layer → Test independently → Deploy/Demo (MVP!)
3. Add SignalR + Components + Hooks → Test independently → Deploy/Demo
4. Add Unit Tests → Coverage gate passes → Deploy/Demo
5. Each phase adds value without breaking previous phases

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Auth + Course services (Phase 3)
   - Developer B: Commerce + Enrollment services (Phase 3)
   - Developer C: Communication + User services (Phase 3)
3. Once services are done:
   - Developer A: SignalR (US4)
   - Developer B: Shared Components (US5)
   - Developer C: Custom Hooks (US6)
4. All developers: Unit Tests (US7) in parallel

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
