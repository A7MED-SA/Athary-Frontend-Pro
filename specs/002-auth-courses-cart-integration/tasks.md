# Tasks: Auth + Courses + Cart Integration

**Input**: Design documents from `/specs/002-auth-courses-cart-integration/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-routes.md, quickstart.md

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US6)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install OAuth dependencies and configure environment variables

- [x] T001 Install Google Identity Services library: add `<script src="https://accounts.google.com/gsi/client">` to `index.html`
- [x] T002 Install Microsoft Identity Library: `npm install @azure/msal-browser`
- [x] T003 [P] Add `VITE_GOOGLE_CLIENT_ID` to `src/lib/env.ts` with Zod validation
- [x] T004 [P] Add `VITE_MICROSOFT_CLIENT_ID` to `src/lib/env.ts` with Zod validation
- [x] T005 [P] Add OAuth env vars to `.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Replace mock AppProvider with real React Query + sonner wrapper

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Rewrite `src/providers/AppProvider.tsx` — remove mock cart/auth/notification state, wrap children with `QueryClientProvider` (from `src/lib/query-client.ts`) + `Toaster` from sonner
- [x] T007 Update `src/main.tsx` — ensure AppProvider wraps Router with QueryClientProvider
- [x] T008 Verify `src/lib/api.ts` token refresh works with the new AppProvider (no mock state interference)

**Checkpoint**: Foundation ready — auth, catalog, cart, and landing pages can now be implemented in parallel

---

## Phase 3: User Story 1 — User Login & Session Management (Priority: P1) 🎯 MVP

**Goal**: User can log in with email/password or Google/Microsoft OAuth, session persists via refresh tokens, and user can view/revoke sessions

**Independent Test**: Log in with valid credentials → redirect to dashboard → reload page (session persists) → navigate to profile settings → see sessions → revoke a session

### Implementation for User Story 1

- [x] T009 [US1] Rewrite login form section in `src/features/auth/AuthPage.tsx` — email + password fields with React Hook Form + Zod validation, submit calls `useLogin()` hook, show toast on success/error
- [x] T010 [US1] Add Google OAuth popup button in `src/features/auth/AuthPage.tsx` — initialize GIS, open popup on click, send idToken to `authService.loginWithGoogle()`, handle popup close/error with toast (FR-023)
- [x] T011 [US1] Add Microsoft OAuth popup button in `src/features/auth/AuthPage.tsx` — initialize MSAL, loginPopup, send idToken to `authService.loginWithMicrosoft()`, handle popup close/error with toast (FR-023)
- [x] T012 [US1] Add auth state initialization in `src/features/auth/AuthPage.tsx` — on mount, check if user is already authenticated via `useAuth()` hook, redirect to dashboard if so
- [x] T013 [US1] Wire session management in `src/features/profile/ProfileSettings.tsx` — display active sessions from `authService.getSessions()`, add revoke button calling `authService.revokeSession()`

**Checkpoint**: User Story 1 complete — login, OAuth, session management all functional

---

## Phase 4: User Story 2 — User Registration & Email Verification (Priority: P1)

**Goal**: New user can register with firstName/lastName/email/password, verify email, reset password

**Independent Test**: Fill registration form → submit → see confirmation → click verification link → email confirmed → can log in

### Implementation for User Story 2

- [x] T014 [P] [US2] Add registration form section in `src/features/auth/AuthPage.tsx` — firstName, lastName, email, password, confirmPassword fields with React Hook Form + Zod, submit calls `useRegister()` hook
- [x] T015 [P] [US2] Add email verification handler in `src/features/auth/AuthPage.tsx` — detect `token` + `email` query params on mount, call `authService.verifyEmail()`, show success/error message
- [x] T016 [P] [US2] Add forgot password form in `src/features/auth/AuthPage.tsx` — email field, submit calls `authService.forgotPassword()`, show confirmation toast
- [x] T017 [P] [US2] Add reset password form in `src/features/auth/AuthPage.tsx` — detect `token` + `email` query params, show new password + confirm fields, submit calls `authService.resetPassword()`
- [x] T018 [US2] Add form validation error display — inline errors below each field in Arabic, per constitution Principle IV

**Checkpoint**: User Story 2 complete — registration, verification, password reset all functional

---

## Phase 5: User Story 3 — Browse Course Catalog (Priority: P2)

**Goal**: Visitor/authenticated user can browse courses with filtering, sorting, and pagination

**Independent Test**: Navigate to `/courses` → courses load → filter by category → search → sort → paginate → empty state shown when no results

### Implementation for User Story 3

- [x] T019 [US3] Rewrite `src/features/catalog/CourseCatalog.tsx` — replace mock data with `useCourseList(filters)` hook, implement filter state via `useSearchParams`
- [x] T020 [P] [US3] Add category filter UI in `src/features/catalog/CourseCatalog.tsx` — fetch categories from `useCategories()`, render filter dropdown/chips
- [x] T021 [P] [US3] Add search input in `src/features/catalog/CourseCatalog.tsx` — debounced search input updating `searchQuery` param
- [x] T022 [P] [US3] Add sort dropdown in `src/features/catalog/CourseCatalog.tsx` — options: newest, price, rating, enrollment count
- [x] T023 [US3] Integrate `Pagination` component in `src/features/catalog/CourseCatalog.tsx` — connect to paged response from API
- [x] T024 [US3] Add loading state — show `CourseCardSkeleton` grid while loading
- [x] T025 [US3] Add error state — show `ErrorFallback` with retry when fetch fails
- [x] T026 [US3] Add empty state — show `EmptyState` when no courses match filters

**Checkpoint**: User Story 3 complete — catalog with filters, search, sort, pagination all functional

---

## Phase 6: User Story 4 — View Course Details (Priority: P2)

**Goal**: User can view full course info including syllabus, instructor, reviews, and related courses

**Independent Test**: Click course card → detail page loads → sections listed → instructor info shown → reviews displayed → related courses shown

### Implementation for User Story 4

- [x] T027 [US4] Rewrite `src/features/catalog/CourseDetails.tsx` — replace mock data with `useCourseDetail(id)` hook, render course title, description, price, rating, duration, instructor
- [x] T028 [P] [US4] Add syllabus/sections display in `src/features/catalog/CourseDetails.tsx` — render `sections: PublicSectionDto[]` with nested items
- [x] T029 [P] [US4] Add instructor section in `src/features/catalog/CourseDetails.tsx` — render `instructor: PublicInstructorDto` with name, bio, profileImageUrl
- [x] T030 [P] [US4] Add reviews section in `src/features/catalog/CourseDetails.tsx` — fetch from `useCourseReviews(courseId)`, render rating + comment list
- [x] T031 [P] [US4] Add related courses section in `src/features/catalog/CourseDetails.tsx` — fetch from `courseService.getRelated(id)`, render up to 4 course cards
- [x] T032 [US4] Add "Enroll" button for free courses — calls `enrollmentService.enroll()`, show "Already Enrolled" if enrolled
- [x] T033 [US4] Add "Add to Cart" button for paid courses — calls `cartService.addItem()`, show "Already Owned" if enrolled
- [x] T034 [US4] Add loading/error/empty states — Skeleton during load, ErrorFallback on error, 404 if course not found

**Checkpoint**: User Story 4 complete — course detail page fully functional

---

## Phase 7: User Story 5 — Shopping Cart & Checkout (Priority: P2)

**Goal**: Authenticated user can manage cart, apply coupons, checkout with Tap Payment hosted page

**Independent Test**: Add course to cart → open cart drawer → apply coupon → proceed to checkout → confirm order → redirect to Tap → return on success

### Implementation for User Story 5

- [x] T035 [US5] Rewrite `src/features/cart/CartCheckout.tsx` — replace mock cart with `useCart()` hook, render items with prices, subtotal, final amount
- [x] T036 [P] [US5] Add cart item remove in `src/features/cart/CartCheckout.tsx` — remove button calling `cartService.removeItem()`, update totals
- [x] T037 [P] [US5] Add coupon input in `src/features/cart/CartCheckout.tsx` — text input + apply button, call `cartService.applyCoupon()`, show discount, handle invalid coupon error
- [x] T038 [US5] Add checkout confirmation step in `src/features/cart/CartCheckout.tsx` — re-validate coupon via `cartService.applyCoupon()`, show final total, "Confirm Order" button
- [x] T039 [US5] Implement payment redirect in `src/features/cart/CartCheckout.tsx` — on confirm: `orderService.create()` → `paymentService.process()` → `window.location.href = redirectUrl`
- [x] T040 [US5] Add payment success/cancel handler — detect query params on return, show success toast + enrolled message, or show error + keep cart
- [x] T041 [US5] Wire cart drawer in `src/components/layout/CartDrawer.tsx` — use `useCart()` hook, show items count badge, connect to real cart state
- [x] T042 [US5] Add loading/error states — Skeleton during cart load, ErrorFallback on error, double-submit prevention

**Checkpoint**: User Story 5 complete — full cart + checkout + payment flow functional

---

## Phase 8: User Story 6 — Landing Page with Real Data (Priority: P3)

**Goal**: Landing page displays real platform data (stats, featured courses, categories, live sessions, testimonials)

**Independent Test**: Visit `/` → stats load → featured courses shown → categories displayed → live sessions listed → skeleton during loading

### Implementation for User Story 6

- [x] T043 [US6] Rewrite `src/features/landing/LandingPage.tsx` — replace mock data with `useLanding()` hook (calls `publicService.getLanding()`)
- [x] T044 [P] [US6] Add stats section in `src/features/landing/LandingPage.tsx` — render `stats: LandingStatsDto` (totalStudents, totalCourses, etc.)
- [x] T045 [P] [US6] Add featured courses section in `src/features/landing/LandingPage.tsx` — render up to 6 `PublicCourseDto` cards
- [x] T046 [P] [US6] Add categories section in `src/features/landing/LandingPage.tsx` — render `CategoryResponseDto[]` list
- [x] T047 [P] [US6] Add upcoming live sessions section in `src/features/landing/LandingPage.tsx` — render `LiveSessionResponseDto[]`
- [x] T048 [US6] Add loading states — skeleton placeholders for each section during data fetch

**Checkpoint**: User Story 6 complete — landing page shows real backend data

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T049 [P] Verify all pages support dark mode — check Skeleton, ErrorFallback, EmptyState, Pagination in dark theme
- [x] T050 [P] Verify RTL layout on all rewritten pages — ensure `dir="rtl"` and logical CSS properties
- [x] T051 [P] Verify all user-facing strings go through `i18next` `t()` — no hardcoded Arabic/English
- [x] T052 [P] Verify accessibility — keyboard navigation, ARIA labels, focus indicators on all interactive elements
- [x] T053 Run quickstart.md validation scenarios — test all 10 scenarios end-to-end
- [x] T054 Verify no mock data remains — search for any remaining `src/data/index.ts` imports in page components
- [x] T055 Verify bundle size — `npm run build` and check gzipped size ≤ 200KB

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (env vars configured) — BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Phase 2 completion
  - US1 (P1) and US2 (P1) can run in parallel
  - US3 (P2), US4 (P2), US5 (P2) can run in parallel after US1/US2
  - US6 (P3) can run in parallel with US3-US5
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (Login/Session)**: Can start after Phase 2 — no dependencies on other stories
- **US2 (Registration)**: Can start after Phase 2 — no dependencies on other stories
- **US3 (Catalog)**: Can start after Phase 2 — no dependencies on other stories
- **US4 (Course Details)**: Can start after Phase 2 — benefits from US3 (catalog) but independently testable
- **US5 (Cart/Checkout)**: Can start after Phase 2 — benefits from US4 (add to cart from detail page) but independently testable
- **US6 (Landing)**: Can start after Phase 2 — no dependencies on other stories

### Within Each User Story

- Implementation tasks in dependency order (forms before submission, hooks before UI)
- Each story has loading/error/empty state handling
- Each story can be stopped at checkpoint and validated independently

### Parallel Opportunities

- T003 + T004 + T005 (env config) — parallel
- T014 + T015 + T016 + T017 (auth form sections) — parallel
- T020 + T021 + T022 (catalog filters/search/sort) — parallel
- T028 + T029 + T030 + T031 (course detail sections) — parallel
- T036 + T037 (cart remove + coupon) — parallel
- T044 + T045 + T046 + T047 (landing sections) — parallel
- T049 + T050 + T051 + T052 (polish tasks) — parallel
- US1 + US2 can run in parallel (different form sections of same file — use feature flags or separate components)
- US3 + US6 can run in parallel (different pages)

---

## Parallel Example: User Story 3 (Catalog)

```bash
# Launch all filter/search/sort tasks together:
Task: "Add category filter UI in src/features/catalog/CourseCatalog.tsx"
Task: "Add search input in src/features/catalog/CourseCatalog.tsx"
Task: "Add sort dropdown in src/features/catalog/CourseCatalog.tsx"

# Then sequential:
Task: "Integrate Pagination component in src/features/catalog/CourseCatalog.tsx" (depends on T019)
Task: "Add loading state in src/features/catalog/CourseCatalog.tsx" (depends on T019)
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete Phase 1: Setup (env vars, dependencies)
2. Complete Phase 2: AppProvider replacement
3. Complete Phase 3: User Story 1 (Login + OAuth + Sessions)
4. Complete Phase 4: User Story 2 (Registration + Verification + Reset)
5. **STOP and VALIDATE**: Test auth flow end-to-end
6. Deploy/demo if ready

### Incremental Delivery

1. Phase 1+2 → Foundation ready
2. Phase 3+4 → Auth complete → Deploy/Demo (MVP!)
3. Phase 5+6 → Courses browse + detail → Deploy/Demo
4. Phase 7 → Cart + checkout → Deploy/Demo (revenue!)
5. Phase 8 → Landing page → Deploy/Demo (public launch!)
6. Phase 9 → Polish → Final release

### Parallel Team Strategy

With multiple developers:
1. Team completes Phase 1+2 together
2. Once Phase 2 is done:
   - Developer A: US1 + US2 (Auth)
   - Developer B: US3 + US4 (Courses)
   - Developer C: US5 + US6 (Cart + Landing)
3. Stories complete and integrate independently
4. Phase 9 together for polish

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All 5 page components are REWRITES of existing files — preserve working code where possible
- AppProvider replacement (T006-T008) is the critical blocking task — prioritize it
