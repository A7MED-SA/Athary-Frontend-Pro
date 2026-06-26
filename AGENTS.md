# Athary Frontend — AI Coding Rules

## 1. 🔴 THEME SYSTEM (HIGHEST PRIORITY)

This project has **4 themes × 2 modes = 8 visual variants** defined via CSS variables in `src/index.css`.

| Theme | Class | CSS Variable Prefix |
|-------|-------|-------------------|
| Orange (طوبي) | Default | `--color-brand-orange-*` |
| Gold (ذهبي) | `.theme-gold` | `--color-brand-amber-*` |
| Forest (غابة) | `.theme-forest` | `--color-brand-orange-*` (green) |
| Graphite (جرافيت) | `.theme-graphite` | `--color-brand-orange-*` (gray) |

All themes support `.dark` mode (`.theme-gold.dark`, etc.).

### NEVER ❌
```
#ff0000        → NO hex colors
rgb(255,0,0)  → NO rgb
hsl(0,100,50) → NO hsl
bg-blue-500   → NO unmapped Tailwind colors
text-gray-300 → NO unmapped Tailwind colors
style={{ color: 'red' }}  → NO inline styles
bg-[#ff0000]  → NO arbitrary values
```

### ALWAYS ✅ — Use CSS Variables via Tailwind

**Semantic tokens (defined in `:root`, mapped via `@theme`):**
```
bg-background          text-foreground
bg-card                text-card-foreground
bg-popover             text-popover-foreground
bg-primary             text-primary-foreground
bg-secondary           text-secondary-foreground
bg-muted               text-muted-foreground
bg-accent              text-accent-foreground
bg-destructive         text-destructive-foreground
border-border          ring-ring
bg-input
```

**Status/Action tokens:**
```
bg-success / text-success       # success states
bg-error / text-error           # error states
bg-warning / text-warning       # warning states
bg-info / text-info             # info states
bg-success-bg / bg-error-bg     # soft backgrounds
```

**Color families (mapped via `@theme`):**
```
stone-50 → stone-950    (grays, all shades)
orange-50 → orange-950  (brand primary, all shades)
amber-50 → amber-950    (gold accent, all shades)
```

**Chart tokens:**
```
text-chart-1 / bg-chart-1   → chart-1 through chart-5
text-chart-2 / bg-chart-2
text-chart-3 / bg-chart-3
text-chart-4 / bg-chart-4
text-chart-5 / bg-chart-5
```

**Special tokens:**
```
bg-contrast          text-contrast-foreground  (dark sidebar backgrounds)
bg-footer-bg         text-footer-text
bg-sidebar           text-sidebar-foreground
```

### If a color doesn't exist:
1. Check if a semantic token fits (`text-error` for errors, `text-success` for success)
2. Check if `stone/orange/amber` shade works
3. Only THEN suggest a new CSS variable — **NEVER hardcode**

---

## 2. 📁 Project Structure

```
src/
├── components/
│   ├── layout/              # Navbar, Footer, CartDrawer, ErrorBoundary, NotFound
│   │   └── dashboard/       # DashboardShell, DashboardSidebar, DashboardHeader
│   ├── shared/
│   │   ├── ui/              # StatCard, StatusBadge, DataTable, FilterBar,
│   │   │                     # ConfirmModal, SectionHeader, LoadingState, EmptyState
│   │   └── form/            # FormInput, FormSelect, TagInput, FormTextarea
│   └── learning/            # VideoPlayer, DocumentViewer, CommentSection,
│                              # ProgressTracker, SyllabusList
├── features/
│   ├── {feature}/
│   │   ├── components/      # Feature-specific components (extracted from pages)
│   │   ├── hooks/           # Feature-specific hooks
│   │   └── services/        # API service files
│   └── common/hooks/        # Shared hooks (useAuth, useProfile, useCart, etc.)
├── hooks/                   # App-wide hooks (useTheme)
├── layouts/                 # RootLayout
├── lib/                     # api, env, query-keys, signalr, token-storage, utils
├── providers/               # AppProvider
├── stores/                  # Zustand stores (minimal)
└── types/api/               # All API DTOs & request/response types
```

---

## 3. 🧱 Component Rules

### File Limits
- **Max 300 lines** per component. Split into sub-components if exceeded.
- **Max 1 component** per file (plus small helpers).

### Component Structure
```tsx
// 1. Imports (grouped: React → Libraries → Internal)
// 2. Types/Interfaces (colocated, short)
// 3. Component function
// 4. Sub-components (small, at bottom of file)
// 5. Export
```

### DO:
- Extract business logic into `hooks/` or `services/`
- Use shared components from `components/shared/ui/`
- Compose pages from small components
- Keep data fetching in hooks (TanStack Query)

### DON'T:
- ❌ Put API calls directly in components
- ❌ Duplicate UI patterns (extract shared components)
- ❌ Use inline styles
- ❌ Exceed 300 lines
- ❌ Use `any` type
- ❌ Use `dangerouslySetInnerHTML`

---

## 4. 📚 Library Usage

| Concern | Library | Pattern |
|---------|---------|---------|
| UI Framework | React 19 | Functional + hooks |
| Routing | React Router 7 | `createBrowserRouter`, `<Outlet>` |
| Server State | TanStack Query 5 | `useQuery` / `useMutation` in hooks |
| HTTP | axios | Instance in `src/lib/api.ts` + interceptors |
| Forms | react-hook-form + zod | `useForm({ resolver: zodResolver(schema) })` |
| Toasts | sonner | `toast.success()`, `toast.error()` |
| Animations | motion (framer-motion) | `motion.div`, `AnimatePresence` |
| Icons | lucide-react | Import by name: `import { Search } from 'lucide-react'` |
| Charts | recharts | Wrap in shared `<ChartWrapper>` |
| Real-time | @microsoft/signalr | Via `useSignalR` hook |
| Client State | Zustand (minimal) | For non-server state only |
| Styling | Tailwind CSS 4 | `@theme` + CSS variables |
| RTL | Native | `dir="rtl"` on root, Arabic-first |

---

## 5. 🎨 UI Design Tokens

### Typography
```
font-sans: "Cairo", "Tajawal", sans-serif    (headings + body)
font-mono: "JetBrains Mono", monospace        (code)
font-serif: used for decorative/classical text
```

### Spacing (Tailwind defaults)
- Use standard Tailwind spacing: `p-4`, `gap-2`, `space-y-3`, etc.

### Border Radius
```
rounded-lg     (standard)
rounded-xl     (elevated)
rounded-2xl    (cards)
rounded-3xl    (modals, large containers)
rounded-full   (pills, badges)
```

### Shadows
```
shadow-xs    (subtle)
shadow-sm    (standard)
shadow       (elevated)
shadow-md    (dropdowns, modals)
shadow-lg    (modals)
```

### Key Accessibility
- RTL layout (`dir="rtl"`)
- Focus rings with `ring-ring`
- Proper `aria-*` attributes on interactive elements
- Keyboard navigation support

---

## 6. 🔄 Common Patterns

### Query Hook Pattern
```tsx
export function useXxx() {
  return useQuery({
    queryKey: queryKeys.xxx.list(),
    queryFn: () => xxxService.getAll(),
  });
}
```

### Mutation Hook Pattern
```tsx
export function useCreateXxx() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateXxxDto) => xxxService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.xxx.all }),
  });
}
```

### Service Pattern
```tsx
export const xxxService = {
  getAll: () =>
    api.get<ApiResponse<XxxDto[]>>('/xxx').then((r) => r.data),
  getById: (id: string) =>
    api.get<ApiResponse<XxxDto>>(`/xxx/${id}`).then((r) => r.data),
  create: (data: CreateXxxDto) =>
    api.post<ApiResponse<XxxDto>>('/xxx', data).then((r) => r.data),
};
```

---

## 7. 🚫 Common Mistakes to Avoid

1. **Hardcoded colors** — Always use CSS variables
2. **Large components** — Split at 300 lines
3. **Duplicate UI** — Extract to `components/shared/ui/`
4. **Logic in components** — Move to hooks
5. **Duplicate services** — Single source of truth per endpoint
6. **Inline query keys** — Use `queryKeys` factory
7. **Unused imports** — Clean up before committing
8. **any types** — Define proper interfaces
9. **API calls outside services** — Always use `xxxService`
10. **Mutation without cache invalidation** — Always invalidate related queries

---

## 8. 🧪 Testing

- Tests are in `*.test.ts` / `*.test.tsx` alongside source files
- Vitest + React Testing Library
- Test hooks with custom render wrappers
- Test services by mocking axios

---

## 9. 🔐 Auth & RBAC

See "AGENTS.md — Auth, Routing & RBAC Architecture" section below for full auth flow.

Key points:
- `useAuth()` from `src/features/common/hooks/useAuth.ts`
- `useAppContext()` for `isLoggedIn`, `userRoles`, `hasRole()`, `hasAnyRole()`
- Protected routes via `<ProtectedRoute allowedRoles={['Admin']}>`
- Tokens in `sessionStorage` via `tokenStorage`

---

## 10. Current Refactoring Status

Reference files for work-in-progress:
- `REFACTORING_PLAN.md` — Full refactoring plan
- `THEME_AUDIT.md` — Theme system audit with violations
- `REFACTORING_CHANGELOG.md` — Log of all changes made

### Progress
| File | Before | After | Reduction |
|------|--------|-------|-----------|
| AdminDashboard | 2,447 | 1,189 | **−1,258** (51%) |
| InstructorDashboard | 641 | 581 | −60 (9%) |
| StudentDashboard | 752 | 227 | **−525** (70%) |
| AuthPage | 989 | 490 | **−499** (50%) |
| ProfileSettings | 1,421 | 416 | **−1,005** (71%) |
| **Total** | **~24,091** | — | **−3,347 (refactored files)** |

### All AdminDashboard Tabs Extracted ✅
All 8 admin tabs are now sub-components in `src/features/admin/components/`:
- `CouponsManager`, `PaymentMethodsManager`, `UsersManager` (Session 1)
- `CourseModerationTable`, `TeacherRequestsTable`, `OrdersRefundsManager`, `CategoriesManager`, `SettingsPanel` (Session 2)
- Phase 7: `ReviewsModeration`, `AnnouncementsCenter`, `MediaLibrary`, `SystemActivitySettings`, `AdvancedAnalytics` (separate files)

### StudentDashboard Sub-Components Extracted ✅
- `StudentSidebar`, `OverviewTab`, `MyCoursesTab`, `CertificatesTab`, `ShareCertificateModal`
- Plus reusable `<TabPanel>` wrapper for AnimatePresence patterns

### AuthPage Sub-Components Extracted ✅
- 8 sub-components: `AuthLayout`, `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `OtpVerification`, `VerifyView`, `SuccessView`
- Fixed verify infinite spinner bug

### ProfileSettings Sub-Components Extracted ✅
- 6 sub-components: `SettingsSidebar`, `PersonalInfoTab`, `PhonesTab`, `AddressesTab`, `SecurityTab`, `NotificationsTab`
- All 649 lines of tab content extracted; parent reduced from 1,421 → 416

### Next Large Files to Refactor
1. **CourseBuilder** (1,167 lines) — extract steps as sub-components
2. **LearningRoom** (789 lines) — extract panel components

### Known Bugs (post-refactoring)
- `toPascalCase` in auth service broken (duplicate `charAt`)
- Gender mapping: `prefer_not_to_say` maps to `undefined`
- Logout never calls backend API

---

*Last updated: 2026-06-26*
