# Research: Auth + Courses + Cart Integration

**Date**: 2026-06-23
**Feature**: 002-auth-courses-cart-integration

## Decisions

### R1: OAuth Popup Flow Implementation

**Decision**: Use Google Identity Services (GIS) `accounts.id.initialize()` + `accounts.id.prompt()` for popup-based OAuth. For Microsoft, use MSAL.js `LoginPopup` flow.

**Rationale**: The clarification session confirmed popup flow (Option A). GIS is Google's recommended approach for web OAuth — it handles the popup, token issuance, and error states. MSAL.js is Microsoft's official library with equivalent popup support. Both libraries are well-maintained and widely used.

**Alternatives considered**:
- Redirect flow: Rejected per clarification — causes full page reload, loses local state
- Hybrid (popup + redirect fallback): Rejected — adds unnecessary complexity for marginal benefit

**Implementation notes**:
- GIS: `google.accounts.id.initialize({ client_id, callback })` → `google.accounts.id.prompt()`
- MSAL: `new PublicClientApplication({ auth: { clientId, authority } })` → `loginPopup({ scopes })`
- Both return idToken which is sent to backend via `POST /oauth/google` or `POST /oauth/microsoft`
- Popup blockers: detect via try/catch on popup open, show toast error per FR-023

---

### R2: Tap Payment Hosted Page Integration

**Decision**: Redirect to Tap's hosted payment page via `POST /payments/process` which returns a redirect URL. User completes payment on Tap's domain, then is redirected back to platform success/cancel URL.

**Rationale**: The clarification session confirmed hosted page (Option A). This eliminates PCI DSS scope entirely — no card data touches the platform. Tap Payment provides a hosted checkout page that supports multiple payment methods (cards, Apple Pay, etc.).

**Alternatives considered**:
- Embedded iframe: Rejected — still requires PCI compliance for iframe context
- Client-side SDK: Rejected — card data would touch the platform, increasing compliance burden

**Implementation notes**:
- Flow: `POST /orders` → get orderId → `POST /payments/process` → get redirect URL → `window.location.href = redirectUrl`
- Success/cancel URLs: configured in Tap dashboard, platform handles return via query params
- Cart state preserved in backend (cart is server-side), so returning user sees their cart intact

---

### R3: Coupon Validation Strategy

**Decision**: Dual validation — validate at cart for preview, re-validate at checkout confirmation before payment.

**Rationale**: Per clarification (Option B). Cart-time validation gives instant feedback (coupon is valid, here's the discount). Checkout re-validation ensures the coupon hasn't expired or been used up between cart and checkout. This prevents price surprises at payment.

**Alternatives considered**:
- Cart only: Rejected — coupon could expire between cart and checkout
- Real-time on every load: Rejected — unnecessary API calls, no material UX benefit

**Implementation notes**:
- Cart: `POST /cart/coupons/validate` → show discount preview in cart drawer
- Checkout: re-call `POST /cart/coupons/validate` → show final total on confirmation step
- If re-validation fails (expired/used), show error toast, clear coupon, update total

---

### R4: AppProvider Replacement Strategy

**Decision**: Replace the mock AppProvider with a thin wrapper that provides only QueryClientProvider + Toaster. All state management moves to React Query hooks and Zustand stores.

**Rationale**: The current AppProvider manages mock cart, mock auth, mock notifications via React Context. All of this is replaced by: (1) React Query for server state, (2) useAuth hook for auth state, (3) useCart hook for cart state, (4) notificationStore Zustand for notifications. The AppProvider becomes a minimal composition root.

**Alternatives considered**:
- Gradual migration (keep AppProvider, add hooks incrementally): Rejected — creates confusion about which state source is authoritative
- Keep AppProvider as auth-only provider: Rejected — auth state is managed by useAuth hook with React Query

**Implementation notes**:
- New AppProvider.tsx: wraps children with QueryClientProvider + Toaster from sonner
- Auth state: useAuth() hook reads from React Query cache (user profile, sessions)
- Cart state: useCart() hook reads from React Query cache (cart items)
- Remove all mock data imports, timer-based notifications, and in-memory state

---

### R5: Page Component Rewrite Pattern

**Decision**: Each page component follows the same pattern: call hooks → handle loading (Skeleton) → handle error (ErrorFallback with retry) → handle empty (EmptyState) → render data.

**Rationale**: This is the constitution-mandated pattern (Principle II: four API states). All existing hooks already return `{ data, isLoading, isError, error, refetch }`. Shared components (Skeleton, ErrorFallback, EmptyState) handle the non-success states.

**Alternatives considered**:
- Custom loading/error handling per page: Rejected — violates DRY, inconsistent UX
- Suspense-based loading: Rejected — React Query doesn't support Suspense out of the box for all patterns

**Implementation notes**:
- Pattern per page:
  ```tsx
  const { data, isLoading, isError, error, refetch } = useSomeQuery();
  if (isLoading) return <Skeleton variant="page" />;
  if (isError) return <ErrorFallback error={error} onRetry={refetch} />;
  if (!data?.items.length) return <EmptyState title="..." />;
  return <>{/* render data */}</>;
  ```
- Toast notifications for mutation outcomes via sonner
- Form validation via React Hook Form + Zod with inline error display

---

### R6: Environment Variables for OAuth

**Decision**: Add `VITE_GOOGLE_CLIENT_ID` and `VITE_MICROSOFT_CLIENT_ID` to env.ts with Zod validation.

**Rationale**: Constitution requires all env vars typed via `src/lib/env.ts` with Zod validation. The Google and Microsoft OAuth client IDs are needed client-side for the popup libraries. These are public identifiers (not secrets) — the actual OAuth flow is handled server-side after the frontend obtains the idToken.

**Alternatives considered**:
- Single `VITE_OAUTH_CLIENT_ID`: Rejected — Google and Microsoft use different client IDs
- Hardcoded IDs: Rejected — violates constitution (no secrets in client code, env vars required)

**Implementation notes**:
- Add to env.ts: `VITE_GOOGLE_CLIENT_ID: z.string().min(1)`, `VITE_MICROSOFT_CLIENT_ID: z.string().min(1)`
- These are public client IDs, not secrets — safe to expose in client bundle
- Add to `.env.example` for developer reference
