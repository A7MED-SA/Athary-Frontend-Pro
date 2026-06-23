# Feature Specification: Auth + Courses + Cart Integration

**Feature Branch**: `002-auth-courses-cart-integration`

**Created**: 2026-06-23

**Status**: Draft

**Input**: User description: "From FRONTEND_PLAN.md, implement Phase 2 (Auth with OAuth) and Phase 3 (Courses + Catalog + Cart) — rewiring existing mock pages to use real backend API services, hooks, and types."

## Clarifications

### Session 2026-06-23

- Q: How should OAuth buttons behave when clicked? → A: Popup window using Google Identity Services / Microsoft Identity Library; idToken is obtained client-side in the popup, then POSTed to backend.
- Q: How does the user complete payment at checkout? → A: Hosted payment page — user is redirected to Tap's payment page, then returned to a success/cancel URL on the platform.
- Q: When is the coupon discount finalized? → A: Checkout confirmation — coupon is validated at cart for preview, then re-validated at checkout; final total shown on confirmation step before payment.
- Q: How should OAuth failures be surfaced? → A: Toast error displayed (e.g., "Google login was cancelled" or "OAuth failed, try again") and user remains on the login page.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Login & Session Management (Priority: P1)

As a registered user, I want to log in with my email and password (or via Google/Microsoft OAuth) so that I can access my personalized dashboard, enrolled courses, and platform features. After logging in, my session persists across page reloads via refresh tokens, and I can view/revoke active sessions.

**Why this priority**: Authentication is the foundation for all personalized features. Without working auth, no other phase can function. OAuth provides the most common signup path for new users.

**Independent Test**: Can be fully tested by logging in with valid credentials, verifying redirect to dashboard, reloading the page (session persists), and logging out.

**Acceptance Scenarios**:

1. **Given** a user is on the login page, **When** they enter valid email and password and submit, **Then** they are authenticated, tokens are stored, and they are redirected to their role-based dashboard.
2. **Given** a user is on the login page, **When** they click "Login with Google", **Then** a Google OAuth flow initiates, the idToken is sent to `POST /oauth/google`, and the user is authenticated and redirected.
3. **Given** a user is on the login page, **When** they click "Login with Microsoft", **Then** a Microsoft OAuth flow initiates, the idToken is sent to `POST /oauth/microsoft`, and the user is authenticated and redirected.
4. **Given** a user is authenticated, **When** their access token expires, **Then** the system automatically refreshes the token using the refresh token without user intervention.
5. **Given** a user is authenticated, **When** they navigate to `/profile/settings`, **Then** they can see their active sessions and revoke any session.
6. **Given** a user enters invalid credentials, **When** they submit the login form, **Then** an appropriate error message is displayed.

---

### User Story 2 - User Registration & Email Verification (Priority: P1)

As a new user, I want to create an account with my first name, last name, email, and password, then verify my email address so that I can start using the platform.

**Why this priority**: Registration is essential for user acquisition. Email verification ensures account security and deliverability of notifications.

**Independent Test**: Can be tested by filling the registration form, submitting it, receiving a verification token, and completing verification.

**Acceptance Scenarios**:

1. **Given** a user is on the registration page, **When** they fill firstName, lastName, email, password, confirmPassword and submit, **Then** a verification email is sent and the user sees a confirmation message.
2. **Given** a user submits the registration form with mismatched passwords, **When** the form is validated, **Then** a validation error is shown for confirmPassword.
3. **Given** a user receives a verification email with a token, **When** they click the verification link, **Then** their email is confirmed and they can log in.
4. **Given** a user is on the forgot password page, **When** they enter their email and submit, **Then** a password reset email is sent.
5. **Given** a user clicks the reset password link from email, **When** they enter new password and confirm, **Then** their password is updated and they can log in with the new password.

---

### User Story 3 - Browse Course Catalog (Priority: P2)

As a visitor or authenticated user, I want to browse available courses with filtering, sorting, and pagination so that I can find courses that match my interests.

**Why this priority**: Course discovery is the primary value proposition for students and the main conversion funnel for the platform.

**Independent Test**: Can be tested by navigating to the catalog, applying filters (category, level, price), sorting results, and paginating through pages.

**Acceptance Scenarios**:

1. **Given** a user visits the course catalog, **When** the page loads, **Then** courses are fetched from `GET /public/courses` and displayed in a grid with pagination.
2. **Given** a user is on the catalog page, **When** they select a category filter, **Then** only courses in that category are shown.
3. **Given** a user is on the catalog page, **When** they enter a search query, **Then** courses matching the query are displayed.
4. **Given** a user is on the catalog page, **When** they change the sort option (by price, rating, newest), **Then** the course list re-sorts accordingly.
5. **Given** a user is on the catalog page, **When** no courses match the filters, **Then** an empty state message is displayed with a suggestion to adjust filters.
6. **Given** a user is on the catalog page, **When** courses are loading, **Then** skeleton placeholder cards are shown.

---

### User Story 4 - View Course Details (Priority: P2)

As a user, I want to view detailed information about a course including its syllabus, instructor, reviews, and related courses so that I can decide whether to enroll or purchase.

**Why this priority**: Course details page is the key decision point for enrollment/purchase. It must present all information needed to make an informed decision.

**Independent Test**: Can be tested by navigating to a course detail page and verifying all sections load correctly (syllabus, instructor, reviews, related courses).

**Acceptance Scenarios**:

1. **Given** a user clicks a course card, **When** the detail page loads, **Then** full course information is displayed (title, description, instructor, price, rating, duration, sections).
2. **Given** a user is on a course detail page, **When** they view the syllabus, **Then** course sections and their items (videos, quizzes, documents) are listed.
3. **Given** a user is on a course detail page, **When** they view the instructor section, **Then** the instructor's name, bio, and profile image are shown.
4. **Given** a user is on a course detail page, **When** they view reviews, **Then** student reviews with ratings are displayed.
5. **Given** a user is on a course detail page, **When** they view related courses, **Then** up to 4 related courses are shown.
6. **Given** a user is on a course detail page for a free course, **When** they click "Enroll", **Then** they are enrolled immediately without payment.
7. **Given** a user is on a course detail page for a paid course, **When** they click "Add to Cart", **Then** the course is added to their cart.

---

### User Story 5 - Shopping Cart & Checkout (Priority: P2)

As an authenticated user, I want to add courses to a shopping cart, apply a coupon code, and complete checkout with payment so that I can purchase courses.

**Why this priority**: Cart and checkout are the revenue-generating flow. Without this, the platform cannot monetize courses.

**Independent Test**: Can be tested by adding a course to cart, applying a valid coupon, proceeding to checkout, and completing payment.

**Acceptance Scenarios**:

1. **Given** a user clicks "Add to Cart" on a course, **When** the action completes, **Then** the course appears in the cart drawer and the cart badge updates.
2. **Given** a user has items in their cart, **When** they open the cart drawer, **Then** all items are listed with prices, subtotal, and a checkout button.
3. **Given** a user has items in their cart, **When** they apply a valid coupon code, **Then** the discount is applied and the final amount is updated.
4. **Given** a user has items in their cart, **When** they apply an invalid coupon, **Then** an error message is shown and the total remains unchanged.
5. **Given** a user proceeds to checkout, **When** they review the order summary (with coupon re-validation), **Then** the final total is confirmed and they are redirected to the payment gateway's hosted page to complete payment.
6. **Given** a user completes payment successfully, **When** the payment is confirmed, **Then** they see a success message and are enrolled in the purchased courses.
7. **Given** a user has items in their cart, **When** they remove an item, **Then** the item is removed and the cart total is recalculated.

---

### User Story 6 - Landing Page with Real Data (Priority: P3)

As a visitor, I want to see the landing page populated with real platform data (stats, featured courses, categories, upcoming live sessions, testimonials) so that I can understand the platform's value.

**Why this priority**: The landing page is the first impression. Real data builds trust and drives conversions, but it's not blocking other functionality.

**Independent Test**: Can be tested by visiting the homepage and verifying all sections display real data from the backend.

**Acceptance Scenarios**:

1. **Given** a visitor loads the landing page, **When** the page renders, **Then** platform stats (students, courses, instructors) are fetched from `GET /public/landing` and displayed.
2. **Given** a visitor is on the landing page, **When** they view featured courses, **Then** up to 6 featured courses are shown with real data.
3. **Given** a visitor is on the landing page, **When** they view categories, **Then** real categories from the backend are displayed.
4. **Given** a visitor is on the landing page, **When** they view upcoming live sessions, **Then** real scheduled sessions are shown.
5. **Given** a visitor is on the landing page, **When** data is loading, **Then** skeleton placeholders are shown for each section.

---

### Edge Cases

- What happens when the refresh token expires and the user is mid-action? → Redirect to login with a "session expired" message.
- What happens when a user tries to enroll in a course they're already enrolled in? → Show "Already Enrolled" state with link to learning room.
- What happens when a user tries to add an already-enrolled course to cart? → Show "Already Owned" badge and disable add-to-cart.
- What happens when the payment gateway fails mid-checkout? → Show error, keep cart intact, allow retry.
- What happens when a course is removed from the platform while it's in a user's cart? → Show "Course no longer available" and remove from cart.
- What happens when network connectivity is lost during checkout? → Show offline warning, prevent double-submission.
- What happens when a coupon expires between application and checkout? → Re-validate coupon at checkout, show error if expired.
- What happens when a user navigates directly to a course detail page via URL? → Fetch course by ID, show 404 if not found.
- What happens when the OAuth popup is closed by the user or blocked by the browser? → Show a toast error ("Login was cancelled" or "Please allow popups for this site") and remain on the login page.
- What happens when the backend rejects the OAuth idToken (expired, invalid, or user not found)? → Show a toast error ("OAuth authentication failed, try again") and remain on the login page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users via email/password with JWT access tokens and refresh tokens stored in HTTP-only cookies.
- **FR-002**: System MUST support OAuth login via Google and Microsoft using a popup flow — the frontend opens a popup using the provider's identity library (Google Identity Services, Microsoft Identity Library), obtains the idToken client-side, then sends it to `POST /oauth/google` or `POST /oauth/microsoft`.
- **FR-003**: System MUST automatically refresh expired access tokens using the refresh token without user interaction.
- **FR-004**: System MUST store sessionId alongside accessToken and refreshToken for session management.
- **FR-005**: System MUST allow users to register with firstName, lastName, email, password, and optional profile fields (gender, dateOfBirth, phoneNumber, address).
- **FR-006**: System MUST verify email addresses via token-based verification flow (`POST /auth/verify-email`).
- **FR-007**: System MUST support password reset via email token flow (`POST /auth/forgot-password` + `POST /auth/reset-password`).
- **FR-008**: System MUST display active sessions and allow users to revoke individual sessions.
- **FR-009**: System MUST fetch course catalog from `GET /public/courses` with filter, sort, and pagination parameters matching `PublicCourseFilterDto`.
- **FR-010**: System MUST display course details from `GET /public/courses/{id}` including syllabus, instructor info, requirements, and learning outcomes.
- **FR-011**: System MUST show related courses via `GET /public/courses/{id}/related`.
- **FR-012**: System MUST manage shopping cart via `GET /cart`, `POST /cart/items`, `DELETE /cart/items/{id}`.
- **FR-013**: System MUST validate coupon codes at cart for preview (via `POST /cart/coupons/validate`) and re-validate at checkout confirmation before payment processing; the final discounted total is displayed on a confirmation step before the user proceeds to the payment gateway.
- **FR-014**: System MUST create orders via `POST /orders`, then redirect the user to the payment gateway's hosted page (Tap Payment) to complete payment; upon success or cancellation, the user is returned to a platform success/cancel URL.
- **FR-015**: System MUST enroll users in free courses directly via `POST /enrollments`.
- **FR-016**: System MUST fetch landing page data from `GET /public/landing` (aggregated endpoint with stats, categories, featured courses, live sessions, testimonials).
- **FR-017**: System MUST display course reviews from `GET /reviews/course/{courseId}`.
- **FR-018**: System MUST use `profileImageUrl` (not `avatarUrl`) for user profile images across all pages.
- **FR-019**: System MUST use `categoryName` (not `category: string`) for course category display.
- **FR-020**: System MUST use `averageRating` (not `rating`) and `totalDurationMinutes` (not `duration: string`) for course metadata.
- **FR-021**: System MUST display loading skeletons during data fetching and error fallbacks with retry on failure.
- **FR-022**: System MUST show toast notifications for user actions (login success, add to cart, checkout success, errors) using sonner.
- **FR-023**: System MUST handle OAuth popup failures (user closes popup, popup blocked, provider error, backend rejects idToken) by displaying a descriptive toast error message and remaining on the login page without navigation.

### Key Entities

- **User/Auth**: User account with credentials, roles (Student/Instructor/Admin), profile data, OAuth provider links, active sessions.
- **Course**: Course listing with title, description, price, level, language, category, instructor, sections, ratings, enrollment count.
- **CourseSection**: Organizational unit within a course containing items (videos, quizzes, documents, live sessions).
- **Enrollment**: Record of a user's enrollment in a course with progress tracking and status.
- **Cart**: Shopping cart containing course items, coupon code, subtotal, discount, and final amount.
- **Order**: Purchase record with order number, items, payments, status, and coupon usage.
- **Payment**: Payment transaction with amount, status, gateway response, and method.
- **Review**: Student review of a course with rating, comment, and moderation status.
- **Category**: Course category with name, description, image, and hierarchical structure.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete login in under 30 seconds (including OAuth redirect).
- **SC-002**: Users can complete registration and email verification in under 3 minutes.
- **SC-003**: Course catalog loads and displays courses within 2 seconds on standard broadband.
- **SC-004**: Users can add a course to cart and complete checkout in under 2 minutes.
- **SC-005**: 95% of page loads show content (not error states) when backend is available.
- **SC-006**: Token refresh happens silently without interrupting the user's session.
- **SC-007**: All form validations provide inline feedback within 500ms of field interaction.
- **SC-008**: Landing page displays real data from backend (no mock data visible to users).

## Assumptions

- The backend API is available and running at the configured `VITE_API_URL`.
- All 22 service files and 17 custom hooks from Phase 1 are correctly implemented and tested.
- The existing `AppProvider.tsx` (mock state) will be replaced with real React Query-based state management.
- All existing page components (`AuthPage.tsx`, `LandingPage.tsx`, `CourseCatalog.tsx`, `CourseDetails.tsx`, `CartCheckout.tsx`) will be rewritten to use real hooks instead of mock data.
- The backend already supports all required endpoints as documented in `MODIFICATION_GUIDE.md`.
- Image/media URLs returned by the backend are valid and accessible.
- The platform is Arabic-first (RTL layout) and all user-facing strings are in Arabic.
- Dark mode is already supported via `useTheme.ts` and all new components must support it.
- Toast notifications use the `sonner` library (already installed).
- React Hook Form + Zod are available for form validation (already in package.json).
