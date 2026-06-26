# Refactoring Plan — Pro_Front

Generated: 2026-06-26 | Total lines: ~24,091 (.ts + .tsx) | Files: 120+

---

## 1. Current Folder Structure

```
src/
├── components/
│   ├── layout/          # CartDrawer, ErrorBoundary, Footer, Navbar, NotFound
│   └── shared/          # EmptyState, ErrorFallback, Pagination, Skeleton
├── data/                # index.ts (mock data)
├── features/
│   ├── about/           # AboutContactPublic.tsx
│   ├── admin/           # AdminDashboard, AdvancedAnalytics, AnnouncementsCenter,
│   │   ├── hooks/       #   MediaLibrary, ReviewsModeration, SystemActivitySettings
│   │   └── services/    # admin.service.ts, courseAdmin.service.ts
│   ├── announcements/   # services/
│   ├── auth/            # AuthPage.tsx
│   │   └── services/    # auth.service.ts, public.service.ts
│   ├── cart/            # CartCheckout.tsx
│   │   └── services/    # cart.service.ts, order.service.ts, payment.service.ts
│   ├── catalog/         # CourseCatalog.tsx, CourseDetails.tsx
│   ├── certificates/    # services/
│   ├── common/hooks/    # 16 hooks (useAuth, useProfile, useCart, …)
│   ├── courses/         # services/ (course, category, curriculum)
│   ├── dashboards/      # services/
│   ├── enrollment/      # services/
│   ├── instructor/      # CourseBuilder, InstructorDashboard, LiveSession
│   ├── instructorRequests/  # hooks/, services/
│   ├── landing/         # LandingPage.tsx
│   ├── liveSessions/    # services/
│   ├── media/           # services/
│   ├── messaging/       # services/
│   ├── notifications/   # services/
│   ├── profile/         # ProfileSettings.tsx, PublicProfile.tsx
│   │   └── services/    # profile.service.ts
│   ├── public/          # services/ (public.service.ts, contact.service.ts)
│   ├── reviews/         # services/
│   ├── student/         # StudentDashboard, LearningRoom, QuizTaking,
│   │   ├── hooks/       #   MessagingCenter, WishlistRefunds, InstructorApply,
│   │   └── services/    #   ManuscriptCertificate
│   ├── theme/           # ThemeSettingsPopover.tsx
│   └── wishlist/        # hooks/, services/
├── hooks/               # useTheme.ts
├── layouts/             # RootLayout.tsx
├── lib/                 # api.ts, env.ts, query-client.ts, query-keys.ts,
│                        #   signalr.ts, token-storage.ts
├── providers/           # AppProvider.tsx
├── stores/              # notificationStore.ts
└── types/api/           # 26 type files
```

---

## 2. Large Components (>300 lines)

21 files exceed 300 lines — **16,796 lines of TSX** (70% of all code).

| # | Lines | File | Problem |
|---|-------|------|---------|
| 1 | **2447** | `admin/AdminDashboard.tsx` | 24 logical sections, 7 inline tables, 17+ components to extract |
| 2 | **1421** | `profile/ProfileSettings.tsx` | 6 tabs, address/phone CRUD, notification prefs, profile form — 12 extractions |
| 3 | **1167** | `instructor/CourseBuilder.tsx` | 3-step wizard — 12 extractions |
| 4 | **989** | `auth/AuthPage.tsx` | 7 auth sub-views (login, register, forgot, reset, otp, verify, 2FA) |
| 5 | **789** | `student/LearningRoom.tsx` | Player + syllabus + comments + notes — 10 extractions |
| 6 | **752** | `student/StudentDashboard.tsx` | 5 tabs + sidebar — 8 extractions |
| 7 | **641** | `instructor/InstructorDashboard.tsx` | 4 tabs + sidebar — 8 extractions |
| 8 | **629** | `admin/MediaLibrary.tsx` | 4 sections — 5 extractions |
| 9 | **551** | `admin/AdvancedAnalytics.tsx` | Charts + tables |
| 10 | **549** | `admin/SystemActivitySettings.tsx` | Audit logs + settings |
| 11 | **531** | `admin/ReviewsModeration.tsx` | Reviews table + moderation |
| 12 | **529** | `student/QuizTaking.tsx` | Quiz UI |
| 13 | **507** | `landing/LandingPage.tsx` | Hero + sections |
| 14 | **416** | `admin/AnnouncementsCenter.tsx` | Announcement CRUD |
| 15 | **412** | `layout/Navbar.tsx` | Navigation |
| 16 | **397** | `about/AboutContactPublic.tsx` | About + contact |
| 17 | **390** | `instructor/LiveSession.tsx` | Live session controls |
| 18 | **368** | `catalog/CourseCatalog.tsx` | Filter + grid |
| 19 | **347** | `student/MessagingCenter.tsx` | Chat UI |
| 20 | **318** | `student/InstructorApply.tsx` | Application form |
| 21 | **302** | `student/WishlistRefunds.tsx` | Wishlist + refunds |

**Total over limit**: 21 files | Recommendation: **max 300 lines per component**

---

## 3. Duplicate Components

| Component | Defined In | Also Duplicated In |
|-----------|-----------|-------------------|
| **Stats Card** | AdminDashboard (4×) | InstructorDashboard (4×), StudentDashboard (4×) |
| **Sidebar Nav** | AdminDashboard (13 items) | InstructorDashboard, StudentDashboard |
| **Section Header** (label + title + description) | AdminDashboard (8+ tabs) | SystemActivitySettings, ReviewsModeration |
| **Data Table** (white card + overflow table + status + actions) | AdminDashboard (7 tables) | AdvancedAnalytics, SystemActivitySettings, MediaLibrary |
| **Filter Bar** (search + status dropdowns) | InstructorDashboard | AdminDashboard (3×), SystemActivitySettings, CourseCatalog |
| **Confirm Modal** (AnimatePresence + backdrop + title + message + 2 buttons) | AdminDashboard | CourseBuilder, QuizTaking, CartCheckout, MediaLibrary |
| **Status Badge** (colored pill) | Every table inline | 12+ instances across codebase |
| **Page Header** (role badge + welcome + subtitle) | AdminDashboard | InstructorDashboard, StudentDashboard |
| **Chart Wrapper** (Recharts ResponsiveContainer + tooltip theme) | InstructorDashboard | StudentDashboard, AdvancedAnalytics |
| **Toast Notification** (manual) | LandingPage | All other files use `sonner` library |

---

## 4. Duplicate UI (Visual Repetition Within Files)

| File | Pattern | Count |
|------|---------|-------|
| AdminDashboard | StatsCard grid | 4 cards × same layout |
| AdminDashboard | DataTable | 7 tables × same structure |
| AdminDashboard | Sidebar nav buttons | 13 buttons × same pattern |
| AdminDashboard | Section header | 8 tabs × same 3-line header |
| InstructorDashboard | StatsCard grid | 4 cards × same layout |
| StudentDashboard | StatsCard grid | 4 cards × same layout |
| CourseBuilder | TagInput (outcomes + requirements) | 2 identical patterns |
| CourseBuilder | FormInput (title, subtitle, category, price, etc.) | 6× label + input + error |
| CourseBuilder | AddItem buttons (video, document, quiz) | 3× same button pattern |
| LearningRoom | Syllabus items | 6 items × same status pattern |
| ProfileSettings | Phone cards, Address cards | N identical CRUD cards |

---

## 5. Duplicate Logic

| # | Issue | Files | Severity |
|---|-------|-------|----------|
| 1 | **Admin course CRUD in 2 services** | `admin.service.ts` ↔ `courseAdmin.service.ts` | **High** |
| 2 | **getPublicProfile/getPublicProfileById** | `profile.service.ts` ↔ `public/service/public.service.ts` | **High** |
| 3 | **getLanding()** | `auth/services/public.service.ts` ↔ `public/services/public.service.ts` | Medium |
| 4 | **useNotificationPreferences** duplicates `useNotifications` | `common/hooks/` — 2 files, same logic | **High** |
| 5 | **Inline query keys** bypassing `queryKeys` factory | `useAdmin.ts`, `useRefunds.ts`, `useInstructorRequest.ts`, `useCourses.ts` | **High** |
| 6 | **`.then(r => r.data)` boilerplate** | All 26 service files (~100+ calls) | **High** |
| 7 | **createNotificationHub vs createMessagingHub** | `lib/signalr.ts` — 95% identical code | Medium |
| 8 | **Hook query+struct pattern** | 16 hooks in `common/hooks/` — all structurally identical | Medium |
| 9 | **notificationStore.ts mock data** vs real service | `stores/` + `notification.service.ts` | Medium |
| 10 | **toPascalCase utility** defined locally | `profile/service/profile.service.ts` (used 4× with ugly casts) | Medium |
| 11 | **CategoryResponseDto type** | `category.service.ts` + `auth/services/public.service.ts` | Low |
| 12 | **ContactMessageDto type** | `contact.service.ts` + `types/api/contact.ts` | Low |
| 13 | **Inline request types** not in `types/api/` | 8 service files define types locally | Medium |

---

## 6. Components That Should Be Extracted

### 6A. Shared UI Components (to `src/components/shared/`)

| Component | From | Usage Count | Lines Saved |
|-----------|------|-------------|-------------|
| `StatCard` | AdminDashboard, InstructorDashboard, StudentDashboard | 12× | ~200 |
| `DashboardSidebar` | AdminDashboard, InstructorDashboard, StudentDashboard | 3× | ~240 |
| `PageHeader` | AdminDashboard, InstructorDashboard, StudentDashboard | 3× | ~45 |
| `SectionHeader` | AdminDashboard (8 tabs) | 8× | ~40 |
| `DataTable` | AdminDashboard (7 tables), AdvancedAnalytics, SystemActivitySettings | 9× | ~400 |
| `StatusBadge` | All tables | 12+× | ~100 |
| `FilterBar` | InstructorDashboard, AdminDashboard, SystemActivitySettings | 5× | ~150 |
| `ConfirmModal` | AdminDashboard, CourseBuilder, QuizTaking, CartCheckout, MediaLibrary | 5× | ~250 |
| `ChartWrapper` | InstructorDashboard, StudentDashboard, AdvancedAnalytics | 3× | ~90 |
| `EmptyState` | Already exists! But only CourseCatalog uses it | 1/10 | — |
| `LoadingState` | Every feature page | 20+× | ~50 |

### 6B. AdminDashboard Sub-Components (17 to extract)

| Component | Lines | Description |
|-----------|-------|-------------|
| `AdminStatsGrid` | 1037–1147 | 4 stat cards |
| `QueueCards` | 1152–1231 | 3 action cards |
| `ActivityLogTable` | 1235–1290 | Audit trail |
| `CourseModerationTable` | 1295–1616 | Filter + table + expand |
| `TeacherLicenseTable` | 1619–1820 | Expandable teacher rows |
| `OrdersRefundsPanel` | 1822–2001 | Sub-tab toggle + 2 tables |
| `CategoryManager` | 2003–2095 | Form + list |
| `SettingsPanel` | 2097–2192 | Checkboxes + inputs |
| `CouponsTable` | 2230–2284 | Coupon management |
| `PaymentMethodsGrid` | 2286–2324 | Payment method cards |
| `UsersTable` | 2326–2382 | User management |
| `SignalRToast` | 714–758 | Floating notification |
| `RejectionDialog` | 2388–2443 | Rejection modal |
| `SidebarNavigation` | 760–1007 | Animated sidebar |

### 6C. CourseBuilder Sub-Components (12 to extract)

| Component | Lines | Description |
|-----------|-------|-------------|
| `WizardStepper` | 422–512 | 3-step progress |
| `TagInput` | 629–698 | Add/remove tags |
| `ThumbnailUploader` | 601–625 | Image upload + preview |
| `SectionEditor` | 738–877 | Section + items |
| `PublishingChecklist` | 926–1047 | 6-item checklist |
| `MetadataSummary` | 1049–1105 | Review card |
| `ConfirmDeleteDialog` | 1107–1162 | Delete modal |

### 6D. LearningRoom Sub-Components (10 to extract)

| Component | Lines | Description |
|-----------|-------|-------------|
| `VideoPlayer` | 281–379 | Player + controls |
| `DocumentViewer` | 382–415 | Manuscript view |
| `QuizPrompt` | 417–437 | Quiz CTA |
| `CommentSection` | 480–548 | Comments + input |
| `ResourceList` | 551–578 | File downloads |
| `NotesEditor` | 582–612 | Auto-save textarea |
| `ProgressTracker` | 622–647 | Progress bar |
| `SyllabusList` | 649–761 | Sidebar navigation |
| `LiveBroadcastCard` | 763–781 | Live session CTA |

### 6E. ProfileSettings Sub-Components (8 to extract)

| Component | Lines | Description |
|-----------|-------|-------------|
| `ProfileForm` | Personal info form |
| `NotificationPreferences` | Toggle grid |
| `AddressCard` + `AddressForm` | Address CRUD |
| `PhoneCard` + `PhoneForm` | Phone CRUD |
| `AvatarUploader` | Profile picture |
| `SecuritySection` | Change password + 2FA + sessions |

### 6F. AuthPage Sub-Components (7 to extract)

| Component | Lines | Description |
|-----------|-------|-------------|
| `LoginForm` | Login with email + password |
| `RegisterForm` | 3-step wizard |
| `ForgotPasswordForm` | Reset request |
| `ResetPasswordForm` | New password |
| `OtpVerifyForm` | OTP code input |
| `TwoFactorForm` | 2FA code input |
| `SocialLoginButtons` | Google + Microsoft |

---

## 7. Suggested Folder Structure

```
src/
├── components/
│   ├── layout/              # Navbar, Footer, CartDrawer, ErrorBoundary, NotFound
│   │   └── dashboard/        # (NEW) DashboardShell, DashboardSidebar, DashboardHeader
│   ├── shared/               # EmptyState, ErrorFallback, Pagination, Skeleton
│   │   ├── ui/               # (NEW) StatCard, StatusBadge, DataTable, FilterBar,
│   │   │                     #        ConfirmModal, SectionHeader, LoadingState
│   │   └── form/             # (NEW) FormInput, FormSelect, TagInput
│   ├── learning/             # (NEW) VideoPlayer, DocumentViewer, QuizPrompt,
│   │                         #        CommentSection, ResourceList, NotesEditor,
│   │                         #        ProgressTracker, SyllabusList
│   └── wizard/               # (NEW) WizardStepper, WizardStep
├── features/
│   ├── admin/
│   │   ├── components/       # (NEW) AdminStatsGrid, CourseModerationTable, …
│   │   ├── hooks/            # useAdmin (keep)
│   │   └── services/         # admin.service.ts ONLY (merge courseAdmin)
│   ├── auth/
│   │   ├── components/       # (NEW) LoginForm, RegisterForm, …
│   │   └── services/         # auth.service.ts ONLY (move public methods out)
│   ├── profile/
│   │   ├── components/       # (NEW) ProfileForm, AddressCard, PhoneCard, …
│   │   └── services/         # profile.service.ts (remove duplicate public methods)
│   ├── instructor/
│   │   ├── components/       # (NEW) CourseBuilderWizard
│   │   └── …
│   ├── student/
│   │   ├── components/       # (NEW) LearningRoom sub-components
│   │   └── …
│   └── common/hooks/         # Consolidate useNotifications + useNotificationPrefs
├── lib/
│   ├── api.ts                # Add auto-unwrap interceptor
│   ├── hook-factories.ts     # (NEW) createQueryHook, createMutationHook
│   ├── case-convert.ts       # (NEW) toPascalCase (fixed)
│   ├── signalr.ts            # Refactor to factory function
│   ├── query-keys.ts         # Add missing keys (admin, student refunds, …)
│   ├── token-storage.ts
│   └── env.ts
├── types/api/                # Add missing type files
│   ├── admin.ts              # (NEW) CreateCouponRequest, AdminUserDto, …
│   ├── index.ts              # Add admin, coupon exports
│   └── …
└── stores/                   # Remove notificationStore.ts (mock data)
```

---

## 8. Components That Should Be Shared

| Component | Suggested Location | Consumed By |
|-----------|-------------------|-------------|
| `StatCard` | `components/shared/ui/` | All 3 dashboards |
| `StatusBadge` | `components/shared/ui/` | All tables |
| `DataTable` | `components/shared/ui/` | Admin, instructor, student tables |
| `FilterBar` | `components/shared/ui/` | CourseCatalog, dashboards |
| `ConfirmModal` | `components/shared/ui/` | Admin, CourseBuilder, Quiz, Cart |
| `SectionHeader` | `components/shared/ui/` | Admin tabs, settings pages |
| `PageHeader` | `components/shared/ui/` | All dashboards |
| `DashboardSidebar` | `components/layout/dashboard/` | All dashboards |
| `ChartWrapper` | `components/shared/ui/` | Analytics pages |
| `LoadingState` | `components/shared/` (already Skeleton exists) | Every feature page |
| `EmptyState` | `components/shared/` (already exists, use it!) | Every feature page |
| `VideoPlayer` | `components/learning/` | LearningRoom, CourseDetails |
| `DocumentViewer` | `components/learning/` | LearningRoom |
| `ProgressTracker` | `components/learning/` | LearningRoom, StudentDashboard |
| `SyllabusList` | `components/learning/` | LearningRoom, CourseCatalog |
| `CommentSection` | `components/learning/` | LearningRoom, CourseDetails |
| `WizardStepper` | `components/wizard/` | CourseBuilder, AuthPage (register wizard) |
| `TagInput` | `components/shared/form/` | CourseBuilder |
| `FormInput` | `components/shared/form/` | Every form |
| `FormSelect` | `components/shared/form/` | Every form |
| `AvatarUploader` | `components/shared/ui/` | ProfileSettings, Navbar |

---

## 9. Hooks to Extract

### 9A. Consolidate Duplicate Hooks

| Current Hooks | Action | Reason |
|---------------|--------|--------|
| `useNotifications` ↔ `useNotificationPreferences` | **Merge** into `useNotifications` | 100% overlap |
| (none missing) | **Add** `useAdminCoupons`, `useAdminPaymentMethods`, etc. to use centralized queryKeys | Currently inline |

### 9B. Hook Factory (new shared utility)

Create `src/lib/hook-factories.ts`:

```typescript
// Eliminates ~18 nearly-identical hook files
createListQueryHook<T>(queryKey, queryFn)        // For: useCategories, useAnnouncement, etc.
createDetailQueryHook<T>(queryKeyFn, queryFn)    // For: useCourseDetail, useEnrollmentDetail, etc.
createMutationHook<T, V>(mutationFn, invalidateKeys)  // For: all CRUD mutations
```

### 9C. Hooks Using Inline Query Keys (should migrate to `queryKeys`)

- `useAdmin.ts` — uses `['admin', 'coupons']`, `['admin', 'paymentMethods']`, etc.
- `useRefunds.ts` — uses `['student', 'refunds']`
- `useInstructorRequest.ts` — uses `['instructor-request', 'my-requests']`
- `useCourses.ts` — uses `['courses', 'instructor']` (missing from queryKeys)

---

## 10. Services to Extract

### 10A. Merge Duplicate Services

| Service A | Service B | Action |
|-----------|-----------|--------|
| `admin/services/admin.service.ts` | `admin/services/courseAdmin.service.ts` | **Merge into admin.service.ts** — delete courseAdmin.service.ts |
| `profile/services/profile.service.ts` (getPublicProfile) | `public/services/public.service.ts` (getPublicProfile) | **Remove from profile.service.ts** — use public.service.ts |
| `auth/services/public.service.ts` (getLanding) | `public/services/public.service.ts` (getLanding) | **Remove from auth/services/** — use public/services/ |

### 10B. Add Auto-Unwrap Interceptor

Add to `src/lib/api.ts`:
```typescript
// Auto-unwrap .data so every service can drop `.then(r => r.data)`
api.interceptors.response.use((response) => response.data);
```
This eliminates **~100+ `.then(r => r.data)` calls** across all services.

---

## 11. Utilities to Extract

| Utility | Current Location | Target | Priority |
|---------|-----------------|--------|----------|
| `toPascalCase` | `profile/services/profile.service.ts` | `src/lib/case-convert.ts` | **High** |
| Create hub factory | `lib/signalr.ts` (2 identical functions) | Same file, factory pattern | Medium |
| Hook factories | None (18 duplicate hooks) | `src/lib/hook-factories.ts` | Medium |
| Status badge color fn | Inline in 7 tables | `src/lib/status-utils.ts` | Low |
| Date formatting | Inline throughout | Consider `date-fns` or utility | Low |

---

## 12. Estimated Number of Commits

| # | Commit | Files Changed | Est. Effort |
|---|--------|---------------|-------------|
| 1 | **Extract shared UI components** — `StatCard`, `StatusBadge`, `SectionHeader`, `PageHeader`, `LoadingState` | ~15 files (5 new + 10 modified) | Medium |
| 2 | **Extract `DataTable` + `FilterBar`** + migrate all admin tables | ~12 files (2 new + 10 modified) | **Large** |
| 3 | **Extract `ConfirmModal`** + migrate all 5 usages | ~8 files (1 new + 7 modified) | Small |
| 4 | **Extract `DashboardSidebar`** + migrate 3 dashboards | ~6 files (1 new + 5 modified) | Medium |
| 5 | **Extract `ChartWrapper`** + migrate charts | ~5 files (1 new + 4 modified) | Small |
| 6 | **Refactor AdminDashboard** — extract 14 sub-components | ~16 files (14 new + 2 modified) | **Very Large** |
| 7 | **Refactor CourseBuilder** — extract 8 sub-components | ~10 files (8 new + 2 modified) | **Large** |
| 8 | **Refactor LearningRoom** — extract 10 sub-components | ~12 files (10 new + 2 modified) | **Large** |
| 9 | **Refactor ProfileSettings** — extract 6 sub-components | ~8 files (6 new + 2 modified) | **Large** |
| 10 | **Refactor AuthPage** — extract 7 sub-forms | ~9 files (7 new + 2 modified) | **Large** |
| 11 | **Consolidate duplicate services** (admin/courseAdmin, profile/public, auth/public) | ~8 files (3 deleted, 5 modified) | Medium |
| 12 | **Consolidate duplicate hooks** (useNotifications + useNotificationPreferences) | ~5 files (1 deleted, 4 modified) | Small |
| 13 | **Add auto-unwrap interceptor** + remove all `.then(r => r.data)` | ~27 files (1 new config, 26 modified) | **Large** |
| 14 | **Centralize query keys** — add missing keys + migrate inline usage | ~6 files (1 modified + 5 hook files) | Medium |
| 15 | **Extract utility** — `toPascalCase` to `src/lib/case-convert.ts` | ~2 files (1 new + 1 modified) | Small |
| 16 | **Consolidate types** — move inline types to `types/api/` + remove duplicates | ~14 files (4 new + 10 modified) | Medium |
| 17 | **Fix EmptyState usage** — use shared component everywhere | ~8 files | Small |
| 18 | **Remove `notificationStore.ts`** (mock data) | ~2 files (1 deleted, 1 import removed) | Small |
| 19 | **Extract hook factory** `src/lib/hook-factories.ts` | ~19 files (1 new + 18 modified) | **Large** |

**Total estimated commits: 18–19**

**Estimated timeline (sequential):**
- Structural / low-risk: commits 1–5, 11–12, 14–18 → ~10 commits
- High-risk / large refactors: commits 6–10 → ~5 commits
- Cross-cutting changes: commits 13, 19 → ~2 commits

---

## Summary

| Category | Count |
|----------|-------|
| Files >300 lines | 🔴 21 |
| Duplicate UI patterns | 12+ |
| Duplicate service methods | 3 sets |
| Duplicate hooks | 1 set (2 files) |
| Components to extract | **~70** across 6 files |
| New shared components | **~22** |
| Hook factory patterns | 3 (covers 18 hooks) |
| Inline query key violations | 4 hooks |
| Service files with duplicate logic | 6 files |
| Estimated commits | **18–19** |
| Lines of duplicate code eliminated | **~3,000+** |

⚠ **Wait for approval before starting.**
