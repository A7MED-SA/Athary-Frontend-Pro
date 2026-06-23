# Quickstart: Auth + Courses + Cart Integration

**Date**: 2026-06-23
**Feature**: 002-auth-courses-cart-integration

## Prerequisites

- Node.js 18+
- Backend API running at configured `VITE_API_URL`
- Google OAuth Client ID configured in Google Cloud Console
- Microsoft OAuth Client ID configured in Azure Portal
- Tap Payment merchant account configured

## Setup

```bash
# 1. Install dependencies (if not already)
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set:
#   VITE_API_BASE_URL=http://localhost:7001/api
#   VITE_GOOGLE_CLIENT_ID=your-google-client-id
#   VITE_MICROSOFT_CLIENT_ID=your-microsoft-client-id
#   VITE_SIGNALR_URL=http://localhost:7001/hubs

# 3. Start dev server
npm run dev
```

## Validation Scenarios

### Scenario 1: Email/Password Login

1. Navigate to `/auth`
2. Enter valid email and password
3. Click "تسجيل الدخول" (Login)
4. **Expected**: Redirect to role-based dashboard, auth token stored in HTTP-only cookie
5. Reload page
6. **Expected**: Session persists, user remains on dashboard

### Scenario 2: OAuth Login (Google)

1. Navigate to `/auth`
2. Click "تسجيل الدخول بـ Google" (Login with Google)
3. **Expected**: Popup opens with Google account selector
4. Select account in popup
5. **Expected**: Popup closes, user authenticated, redirected to dashboard
6. **Expected**: If popup blocked, toast error "يرجى السماح النوافذ المنبثقة" remains on login page

### Scenario 3: Registration

1. Navigate to `/auth` → switch to register view
2. Fill firstName, lastName, email, password, confirmPassword
3. Submit form
4. **Expected**: Success message "تم التسجيل بنجاح، يرجى التحقق من بريدك الإلكتروني"
5. Click verification link from email
6. **Expected**: Email confirmed, can now log in

### Scenario 4: Course Catalog Browsing

1. Navigate to `/courses`
2. **Expected**: Courses load with skeleton placeholders, then display in grid
3. Select a category filter
4. **Expected**: Courses filter by category
5. Enter search query
6. **Expected**: Courses filter by search term
7. Change sort option
8. **Expected**: Courses re-sort
9. Navigate to page 2
10. **Expected**: Page 2 courses load

### Scenario 5: Course Details

1. Click a course card from catalog
2. **Expected**: Full detail page loads (title, description, instructor, sections, reviews)
3. Scroll to syllabus section
4. **Expected**: Sections and items listed
5. Scroll to reviews section
6. **Expected**: Student reviews with ratings displayed

### Scenario 6: Add to Cart & Checkout

1. On a paid course detail page, click "إضافة إلى السلة" (Add to Cart)
2. **Expected**: Course appears in cart drawer, cart badge updates
3. Open cart drawer
4. **Expected**: Items listed with prices, subtotal shown
5. Apply coupon code "DISCOUNT20"
6. **Expected**: Discount applied, final amount updated
7. Click "إتمام الشراء" (Checkout)
8. **Expected**: Order summary page with re-validated coupon
9. Click "تأكيد الطلب" (Confirm Order)
10. **Expected**: Redirect to Tap Payment hosted page
11. Complete payment on Tap page
12. **Expected**: Redirect back to success page, enrolled in courses

### Scenario 7: Free Course Enrollment

1. Navigate to a free course detail page
2. Click "سجل الآن" (Enroll Now)
3. **Expected**: Immediately enrolled, redirected to learning room

### Scenario 8: Landing Page

1. Navigate to `/`
2. **Expected**: Stats, featured courses, categories, live sessions load from backend
3. **Expected**: Skeleton placeholders during loading
4. **Expected**: No mock data visible

### Scenario 9: Error Handling

1. Disconnect network (or simulate backend down)
2. Navigate to `/courses`
3. **Expected**: Error fallback with retry button displayed
4. Click retry
5. **Expected**: Re-attempts to fetch data

### Scenario 10: Token Refresh

1. Log in and wait for access token to expire (or manually clear it)
2. Perform an action that requires auth
3. **Expected**: Token refresh happens silently, action completes
4. **Expected**: No redirect to login, no error shown
