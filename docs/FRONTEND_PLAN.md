# Frontend Execution Plan — Athary Platform

> **النسخة المعدلة** — بناءً على `MODIFICATION_GUIDE.md`
> الخطة التنفيذية الكاملة لربط الـ Frontend بالـ Backend الحقيقي
> تشمل 6 مراحل، كل مرحلة تحتوي على الملفات المطلوب إنشاؤها وتعديلها بالكامل

---

## الفهرس

1. [نظرة عامة — أبرز الفروقات عن الخطة السابقة](#1)
2. [المرحلة 0: تنظيف وتهيئة](#2)
3. [المرحلة 1: الطبقة الأساسية — Types + 22 Service + Hooks + SignalR + Shared Components](#3)
4. [المرحلة 2: ربط Auth بالكامل — مع OAuth](#4)
5. [المرحلة 3: ربط Courses + Catalog + Cart](#5)
6. [المرحلة 4: ربط Dashboards](#6)
7. [المرحلة 5: ربط الميزات الثانوية](#7)
8. [المرحلة 6: الميزات المفقودة من Backend](#8)
9. [الجدول الزمني](#9)

---

## 1. نظرة عامة <a id="1"></a>

### ✅ التصحيحات عن الخطة السابقة (`FRONTEND_PLAN.md`)

| البند | الخطة القديمة | الخطة الجديدة (بعد MODIFICATION_GUIDE) |
|-------|--------------|--------------------------------------|
| عدد Services | 14 | **22** |
| SignalR | ❌ غير موجود | ✅ `lib/signalr.ts` + `hooks/useSignalR.ts` |
| Shared Components | ❌ غير موجودة | ✅ Pagination, Skeleton, ErrorFallback, EmptyState |
| OAuth Flow | ❌ `window.location.href` redirect | ✅ `POST /oauth/google` مع `{idToken, provider}` |
| Auth Types | `fullName`, `avatarUrl` | ✅ `firstName + lastName`, `profileImageUrl` |
| AuthResponse | بدون `sessionId` | ✅ مع `sessionId` |
| Quiz Paths | `.../attempts/start`, `.../submit` | ✅ `POST .../attempts` + `PUT .../attempts/{id}` |
| Enrollment Paths | `/enrollments/my-courses` | ✅ `/enrollments` |
| Media Admin Paths | `PUT .../soft-delete` | ✅ `DELETE .../soft` + `POST .../restore` |
| Types DTOs | ناقصة (19 قسم) | ✅ كاملة (23 قسم) |
| React Hook Form + Zod | مذكور فقط | ✅ مدمج مع كل صفحة |
| Error Boundaries | ❌ | ✅ `ErrorFallback.tsx` |

---

## 2. المرحلة 0: تهيئة <a id="2"></a>

### 2.1 تحديث `src/lib/api.ts`

التغييرات عن النسخة السابقة:
- معالجة كل أكواد الخطأ (400, 403, 404, 429, 500)
- استخدام `InternalAxiosRequestConfig` + `AxiosError`
- إضافة _retry للمنع التكرار اللانهائي
- تحقق من وجود refresh token قبل إرسال طلب

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7001/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => { if (error) prom.reject(error); else prom.resolve(token); });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => { failedQueue.push({ resolve, reject }); })
          .then((token) => { originalRequest.headers.Authorization = `Bearer ${token}`; return api(originalRequest); });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh-token');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('auth-token', data.data.accessToken);
        localStorage.setItem('refresh-token', data.data.refreshToken);
        processQueue(null, data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      } finally { isRefreshing = false; }
    }

    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400: console.error('Bad Request:', (data as any)?.message); break;
        case 403: console.error('Forbidden:', (data as any)?.message); break;
        case 404: console.error('Not Found:', (data as any)?.message); break;
        case 429: console.error('Rate Limited:', (data as any)?.message); break;
        case 500: console.error('Server Error:', (data as any)?.message); break;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## 3. المرحلة 1: الطبقة الأساسية <a id="3"></a>

### ✅ ما تم تغييره عن الخطة السابقة:

| البند | قبل | بعد |
|-------|------|------|
| Types | 19 قسم | **23 قسم** — حسب MODIFICATION_GUIDE |
| Services | 14 | **22** — كلها بـ routes مضبوطة |
| Hooks | 12 | **16** — مضاف: usePayment, useReview, useLiveSession, useAnnouncement |
| SignalR | ❌ | ✅ `lib/signalr.ts` + `hooks/useSignalR.ts` |
| Shared Components | ❌ | ✅ Pagination, Skeleton, ErrorFallback, EmptyState |

### 3.1 `src/types/api.ts` — 23 قسم DTOs

**المصدر الكامل**: `docs/MODIFICATION_GUIDE.md` (السطور 1214–2225)

**التغييرات الجوهرية عن الخطة السابقة**:

#### Auth DTOs — تعديل مهم:

```typescript
// ✅ الصحيح حسب MODIFICATION_GUIDE
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender?: Gender;
  dateOfBirth?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  streetLine1?: string;
  postalCode?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  sessionId: string;       // ← جديد: لم يكن موجوداً
  expiresAt: string;
  user: UserInfoDto;
}

export interface UserInfoDto {
  id: string;
  email: string;
  fullName: string;
  profilePictureUrl?: string;  // ← وليس avatarUrl
  isActive: boolean;
  emailConfirmed: boolean;
  roles: string[];
}

export interface OAuthLoginRequest {   // ← جديد بالكامل
  idToken: string;
  provider: 'google' | 'microsoft';
}
```

#### Profile DTOs:

```typescript
export interface ProfileDto {
  id: string;
  fullName: string;
  email: string;
  bio?: string;
  gender?: Gender;
  dateOfBirth?: string;
  nationality?: string;         // ← جديد
  profileImageUrl?: string;     // ← وليس avatarUrl
  createdAt: string;
  phones: PhoneDto[];
  addresses: AddressDto[];
}
```

#### Course DTOs — إضافة كل الأنواع الناقصة:

```typescript
export interface PublicCourseFilterDto {    // ← جديد بالكامل
  searchQuery?: string;
  categoryId?: string;
  level?: CourseLevel;
  language?: CourseLanguage;
  minPrice?: number;
  maxPrice?: number;
  isFreeOnly?: boolean;
  minRating?: number;
  sortBy?: PublicCourseSortBy;
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PublicSectionDto {         // ← جديد
  id: string;
  title: string;
  description?: string;
  position: number;
  items: PublicSectionItemDto[];
}

export interface CourseSuggestionDto { ... } // ← جديد
export interface PlatformStatsDto { ... }   // ← جديد
export interface FilterOptionsDto { ... }   // ← جديد
```

#### Enrollment DTOs — ContentProgress:

```typescript
export interface ContentProgressDto {       // ← جديد بالكامل
  id: string;
  enrollmentId: string;
  contentType: ContentType;
  contentId: string;
  isCompleted: boolean;
  watchTimeSeconds: number;
  attemptsCount: number;
  completionPercentage: number;
  metadata?: string;
  lastAccessedAt?: string;
  completedAt?: string;
}

export type ContentType = 'Video' | 'Quiz' | 'Document' | 'LiveSession';
```

#### Quiz DTOs — تفصيل الأسئلة:

```typescript
export interface QuestionResponseDto {     // ← جديد
  id: string;
  questionText: string;
  type: QuestionType;
  points: number;
  explanation?: string;
  position: number;
  options: OptionResponseDto[];
}

export interface OptionResponseDto { ... } // ← جديد
export interface SubmitAnswerDto { ... }   // ← جديد
export interface SubmitAttemptRequest { ... } // ← جديد
export interface QuizResultDto extends QuizAttemptResponseDto { ... } // ← جديد
export interface AnswerResultDto { ... }    // ← جديد
```

### 3.2 22 Service Files

**المصدر الكامل**: `docs/MODIFICATION_GUIDE.md` (السطور 2230–3120)

الخدمات الـ 8 المضافة (جديدة كلياً):

| # | الملف | الوصف |
|---|-------|-------|
| 15 | `payment.service.ts` | معالجة الدفع، طرق الدفع، سجل المدفوعات |
| 16 | `review.service.ts` | إنشاء/تحديث/حذف/إبلاغ تقييمات |
| 17 | `liveSession.service.ts` | جلسات مباشرة: إنشاء، انضمام، ترك، حضور |
| 18 | `announcement.service.ts` | إعلانات: إنشاء، تحديث، إلغاء تفعيل |
| 19 | `instructorRequest.service.ts` | طلبات مدرب: تقديم، معالجة، إلغاء |
| 20 | `admin.service.ts` | كوبونات، طرق دفع، استردادات |
| 21 | `publicInstructor.service.ts` | ملف مدرب عام بالـ slug |
| 22 | `public.service.ts` | Landing, Testimonials, Contact, About, Legal |

#### المسارات المضبوطة لكل Service:

**auth.service.ts** — تعديل مهم: OAuth يرسل `POST` مع idToken:
```typescript
loginWithGoogle: (idToken: string) =>
  api.post<ApiResponse<AuthResponse>>('/oauth/google', { idToken, provider: 'google' }),
```

**category.service.ts** — تعديل: إضافة CRUD كامل:
```
GET    /categories
GET    /categories/{id}
POST   /categories
PUT    /categories/{id}
DELETE /categories/{id}
PUT    /categories/{id}/image
```

**course.service.ts** — تعديل: يا Pagination مع `PagedList<PublicCourseDto>`:
```
GET /public/courses ← params: PublicCourseFilterDto
GET /public/courses/{id}
GET /public/courses/slug/{slug}
GET /public/courses/stats
GET /public/courses/{id}/related
GET /public/courses/filters/options
GET /public/courses/search/suggest
```

**enrollment.service.ts** — تعديل المسار:
```
GET    /enrollments        ← وليس /enrollments/my-courses
POST   /enrollments
GET    /enrollments/{id}
GET    /enrollments/{id}/progress
PUT    /enrollments/{id}/progress
POST   /enrollments/{id}/progress/{type}/{contentId}/complete
```

**quiz.service.ts** — تعديل المسارات (بدون '/start', '/submit'):
```
POST   /enrollments/{enrollmentId}/quizzes/{quizId}/attempts
PUT    /enrollments/{enrollmentId}/quizzes/{quizId}/attempts/{attemptId}
GET    /enrollments/{enrollmentId}/quizzes/{quizId}/attempts
GET    /enrollments/{enrollmentId}/quizzes/{quizId}/attempts/{attemptId}
```

**wishlist.service.ts** — تعديل المسار:
```
POST   /wishlist/{courseId}     ← وليس POST /wishlist فقط
DELETE /wishlist/{courseId}
```

**media.service.ts** — تعديل مسارات Admin:
```
DELETE /admin/media/{fileId}/soft    ← وليس /soft-delete
POST   /admin/media/{fileId}/restore
DELETE /admin/media/{fileId}
```

**admin.service.ts** — جديد (MODIFICATION_GUIDE السطور 2925–2970):
```
GET    /admin/coupons
POST   /admin/coupons
PUT    /admin/coupons/{id}
PATCH  /admin/coupons/{id}/toggle
DELETE /admin/coupons/{id}
GET    /admin/payment-methods
POST   /admin/payment-methods
PATCH  /admin/payment-methods/{id}/toggle
GET    /admin/refunds
POST   /admin/refunds/approve
POST   /admin/refunds/reject
```

### 3.3 SignalR Integration — جديد بالكامل

**ملف `src/lib/signalr.ts`**: الاتصال بلـ Hubs مع Auto Reconnect
```
/hubs/notifications  ← إشعارات
/hubs/messaging      ← محادثات
```

**ملف `src/hooks/useSignalR.ts`**: ربط SignalR مع `notificationStore`
- `connection.on('ReceiveNotification', ...)` ← تحديث الـ store
- `connection.onreconnecting` / `onreconnected`
- `useEffect` يعتمد على `isAuthenticated` + user
- طلب صلاحية إشعارات المتصفح (Browser Notification API)

### 3.4 Shared Components — 4 ملفات جديدة

| الملف | الوظيفة |
|-------|---------|
| `Pagination.tsx` | تنقل بين الصفحات مع زر 1, 2, ..., N + أسهم |
| `Skeleton.tsx` | `Skeleton`, `CourseCardSkeleton`, `DashboardSkeleton` |
| `ErrorFallback.tsx` | عرض خطأ مع زر Retry، يدعم `error`, `onRetry`, `title`, `message` |
| `EmptyState.tsx` | حالة عدم وجود بيانات مع icon, title, description, action |

### 3.5 Hooks (React Query) — 16 Hook ملفات

**جديد**: `usePayment`, `useReview`, `useLiveSession`, `useAnnouncement`

---

## 4. المرحلة 2: ربط Auth مع OAuth <a id="4"></a>

### ✅ التغييرات عن الخطة السابقة:

1. **OAuth flow**: `POST /oauth/google` مع `{idToken, provider}` (وليس window redirect)
2. **Register Form**: استخدام `firstName` + `lastName` منفصلين (وليس fullName واحد)
3. **Auth tokens**: تخزين `sessionId` إضافة إلى accessToken + refreshToken
4. **Profile Image**: استخدام `profileImageUrl` (وليس `avatarUrl`)

### ملفات التعديل:

| الملف | التعديل |
|-------|---------|
| `AppProvider.tsx` | تخزين `sessionId`، `profileImageUrl`، `roles`، تحميل الـ profile تلقائياً |
| `AuthPage.tsx` | فورم login: email + password + rememberMe ✓ |
| | فورم register: firstName + lastName + email + password + confirmPassword ✓ |
| | أزرار OAuth (Google + Microsoft): POST إلى `/oauth/{provider}` |
| | التحقق من البريد: `verifyEmail({ token, email })` ✓ |
| | إعادة تعيين كلمة المرور: `resetPassword({ token, email, newPassword, confirmPassword })` ✓ |
| `router.tsx` | loaders تتحقق من صحة التوكين وتعيد التوجيه |

---

## 5. المرحلة 3: ربط Courses + Catalog + Cart <a id="5"></a>

### ✅ التغييرات عن الخطة السابقة:

1. **Course Types**: استخدام `PublicCourseDto` مع `categoryName` (وليس `category: string`)
2. **Rating**: استخدام `averageRating: number` (وليس `rating: number`)
3. **Duration**: استخدام `totalDurationMinutes: number` (وليس `duration: string`)
4. **Enrollment**: استخدام `GET /enrollments` (وليس `/enrollments/my-courses`)
5. **Cart**: استخدام `CartResponseDto` مع `finalAmount` (وليس `total`)
6. **Checkout**: استخدام `POST /orders` + `POST /payments/process` (وليس `POST /checkout` واحد)

### 5.1 تعديل `LandingPage.tsx`

استخدام `publicService.getLanding()` ← يعيد `LandingDto` يحتوي:
```typescript
{
  stats: LandingStatsDto,
  categories: CategoryResponseDto[],
  featuredCourses: PublicCourseDto[],
  upcomingLiveSessions: LiveSessionResponseDto[],
  testimonials: TestimonialDto[]
}
```

### 5.2 تعديل `CourseCatalog.tsx`

- استخدام `courseService.getPublicList(filters: PublicCourseFilterDto)`
- إضافة `Pagination` component مكان الـ scroll اللانهائي
- استخدام `Skeleton` أثناء التحميل
- استخدام `ErrorFallback` عند فشل التحميل
- استخدام `EmptyState` عند عدم وجود نتائج

### 5.3 تعديل `CourseDetails.tsx`

- استخدام `courseService.getPublicById(id)` ← يعيد `PublicCourseDetailDto`
- عرض `instructor: PublicInstructorDto` مع `fullName`, `bio`, `profileImageUrl`
- عرض `sections: PublicSectionDto[]` مع `items: PublicSectionItemDto[]`
- عرض `requirements: string[]`, `learningOutcomes: string[]`
- زر Enroll: `enrollmentService.enroll(courseId)`
- زر Add to Cart: `cartService.addItem(courseId)`
- Reviews: `reviewService.getCourseReviews(courseId)`
- Related courses: `courseService.getRelated(id)`

### 5.4 تعديل `CartCheckout.tsx`

- استخدام `cartService.get()` ← يعيد `CartResponseDto`
- إضافة/إزالة: `cartService.addItem(courseId)` / `cartService.removeItem(itemId)`
- كوبون: `cartService.applyCoupon(code)` ← يعيد `ApplyCouponResponse`
- Checkout: `orderService.create(couponCode? )` ← يعيد `OrderResponseDto`
- دفع: `paymentService.process(orderId, paymentMethodId)` ← يعيد `PaymentResponseDto`

---

## 6. المرحلة 4: ربط Dashboards <a id="6"></a>

### ✅ التغييرات عن الخطة السابقة:

1. **Dashboard DTOs**: استخدام `StudentOverviewDto`, `InstructorOverviewDto`, `AdminOverviewDto` (مع nested `DashboardMetricDto`, `ChartSeriesDto`)
2. **Admin Dashboard**: إضافة تبويبات مفقودة (Coupons, Payment Methods)

### إضافات جديدة في Admin Dashboard:

| التبويب | Service المستخدم |
|---------|-----------------|
| Users Management | `adminUsersService` (جديد) |
| Courses Management | `adminCourseService` (جديد) |
| Instructor Requests | `instructorRequestService` |
| Coupons Management | `adminService.getCoupons(), .createCoupon(), .toggleCoupon()` |
| Payment Methods | `adminService.getPaymentMethods(), .createPaymentMethod()` |
| Refunds | `adminService.getRefunds(), .approveRefund(), .rejectRefund()` |

---

## 7. المرحلة 5: الصفحات الثانوية <a id="7"></a>

### ✅ التغييرات عن الخطة السابقة:

1. **Public Profile**: استخدام `publicInstructorService.getBySlug(slug)` — البحث بالـ slug
2. **Profile Settings**: استخدام `profileService.update()` مع `{ firstName, lastName, bio, gender, ... }`
3. **Media Upload**: استخدام `mediaService.uploadFile()` (Presigned URL Flow بـ 3 خطوات)
4. **Messaging**: استخدام `messageService` مع `ConversationListResponse`, `ConversationMessagesResponse`
5. **React Hook Form + Zod**: ربط كل الفورمات (Profile, Address, Phone, Contact)

---

## 8. المرحلة 6: ميزات Backend غير المستخدمة <a id="8"></a>

### ✅ إضافات جديدة عن الخطة السابقة:

| الميزة | Controller في Backend | Service في Frontend |
|--------|---------------------|---------------------|
| Instructor Requests (Admin) | `InstructorRequestController` | `instructorRequestService` |
| Coupons (Admin CRUD) | `AdminCouponsController` | `adminService` |
| Payment Methods (Admin) | `AdminPaymentMethodsController` | `adminService` |
| Session Management | `AuthController` | `authService.getSessions()` + `revokeSession()` |
| Video Comments | `VideoCommentController` | جديد: `src/services/videoComment.service.ts` |
| User Management (Admin) | `AdminUsersController` | جديد: `src/services/adminUsers.service.ts` |
| Edit Requests (Admin) | `AdminCourseController` | جديد: `src/services/adminCourse.service.ts` |
| Reports/Flagging | `ReportsController` | `reportService` (جديد) |
| Certificate Verification | `CertificatesController.Verify` | `certificateService.verify(code)` |
| Live Attendance Tracking | `LiveAttendanceController` | `liveSessionService.join()`, `.leave()`, `.getAttendeeCount()` |

---

## 9. الجدول الزمني <a id="9"></a>

### الأسبوع 1-2: Backend Modifications
(راجع `BACKEND_PLAN.md`)

### الأسبوع 3-4: Frontend Foundation
| اليوم | المهمة |
|-------|--------|
| 1-2 | `types/api.ts` كامل (23 قسم DTOs) |
| 3-5 | 22 Service files |
| 6-7 | SignalR + Shared Components |
| 8-10 | 16 Hook files (React Query) |

### الأسبوع 5-6: Auth + Public Pages
| اليوم | المهمة |
|-------|--------|
| 1-3 | Auth (Login, Register, OAuth, Verify, Reset, Sessions) |
| 4-5 | Landing Page |
| 6-7 | Course Catalog + Filters + Pagination |
| 8-9 | Course Details + Reviews |
| 10 | Public Profile (Instructor by slug) |

### الأسبوع 7-8: Cart + Student Dashboard
| اليوم | المهمة |
|-------|--------|
| 1-2 | Cart + Checkout + Coupon + Payment |
| 3-5 | Student Dashboard (Overview, Courses, Activity, Certificates) |
| 6-7 | Learning Room (Video, Progress, Content tracking) |
| 8-9 | Quiz Taking (Attempts, Submit, Results) |
| 10 | Messaging Center + Wishlist + Refunds + Instructor Apply |

### الأسبوع 9-10: Instructor + Admin
| اليوم | المهمة |
|-------|--------|
| 1-2 | Instructor Dashboard (Overview, Revenue, Students) |
| 3-4 | Course Builder (Sections, Videos, Documents, Quizzes) |
| 5-6 | Live Sessions (Create, Manage, Attendance) |
| 7-8 | Admin Dashboard (Overview, Analytics, Top Courses) |
| 9-10 | Admin Pages (Reviews, Announcements, Media, Settings, Coupons, Users, Teacher Requests) |

### الأسبوع 11: Testing + Polish
| اليوم | المهمة |
|-------|--------|
| 1-2 | Integration Testing |
| 3-4 | Bug Fixes |
| 5-6 | Performance (Caching, Bundle size, Lazy loading) |
| 7-8 | Security Review (XSS, CSRF, Injection) |
| 9-10 | Documentation + Cleanup |

---

## ملخص الملفات النهائي

| الفئة | العدد | الملفات |
|-------|-------|---------|
| Types | 1 | `types/api.ts` (23 قسم DTOs) |
| Services | 22 | `auth`, `course`, `category`, `cart`, `order`, `payment`, `enrollment`, `quiz`, `certificate`, `notification`, `message`, `profile`, `wishlist`, `media`, `review`, `liveSession`, `announcement`, `instructorRequest`, `admin`, `dashboard`, `publicInstructor`, `public` |
| Hooks | 16 | `useAuth`, `useCourses`, `useCategories`, `useCart`, `useOrders`, `usePayment` (جديد), `useEnrollments`, `useQuiz`, `useCertificates`, `useNotifications`, `useMessages`, `useProfile`, `useDashboard`, `useReview` (جديد), `useLiveSession` (جديد), `useAnnouncement` (جديد) |
| SignalR | 2 | `lib/signalr.ts`, `hooks/useSignalR.ts` (جديد) |
| Shared Components | 4 | `Pagination.tsx`, `Skeleton.tsx`, `ErrorFallback.tsx`, `EmptyState.tsx` (جديدة) |

---

## 10. إضافات بنيوية وتحسينات <a id="10"></a>

### 10.1 🟡 Error Boundary — على مستوى الـ Router

**الملف**: `src/router.tsx`

```tsx
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/shared/ErrorFallback';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorFallback />,  // ← على مستوى الـ Layout
    children: [
      {
        index: true,
        element: <LandingPage />,
        errorElement: <ErrorFallback title="حدث خطأ في الصفحة الرئيسية" />,
      },
      {
        path: 'courses/:id',
        element: <CourseDetails />,
        errorElement: <ErrorFallback title="تعذر تحميل الدورة" />,
      },
      // ... باقي الـ routes مع errorElement
    ],
  },
]);
```

**ملحوظة**: كل صفحة رئيسية يجب أن يكون لها `errorElement` خاص بها لتعطي رسالة خطأ مخصصة.

### 10.2 🟡 Loading Strategy — متى نستخدم إيه؟

| النوع | الاستخدام | المكون |
|-------|----------|--------|
| **Skeleton** | تحميل بيانات صفحة كاملة (قائمة دورات، داشبورد) | `CourseCardSkeleton`, `DashboardSkeleton` |
| **Spinner** | أزرار (إرسال فورم، تسجيل دخول) — داخل الـ button | `motion` + `Loader2` من lucide-react |
| **Progress Bar** | تحميل صفحة (Route level) — شريط في أعلى الصفحة | `nprogress` أو custom |
| **Skeleton + ErrorFallback** | `Suspense` + `ErrorBoundary` حول كل Queries | `useQuery` → `isPending` → Skeleton, `isError` → ErrorFallback |

**مثال عملي:**

```tsx
function CourseCatalog() {
  const { data, isLoading, isError, error, refetch } = useCourseList(filters);

  if (isLoading) return <div className="grid grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}</div>;
  if (isError) return <ErrorFallback error={error as Error} onRetry={refetch} title="تعذر تحميل الدورات" />;
  if (!data?.data.items.length) return <EmptyState title="لا توجد دورات" description="حاول تغيير معايير البحث" />;

  return <>{/* عرض البيانات */}</>;
}
```

### 10.3 🟡 Toast/Notification System — إشعارات المستخدم

**اختيار مكتبة**: `sonner` (خفيفة، تدعم RTL، تدعم Toast + Promise):

```bash
npm install sonner
```

**الإعداد في `RootLayout.tsx`:**
```tsx
import { Toaster } from 'sonner';

function RootLayout() {
  return (
    <>
      <Toaster
        position="top-left"
        richColors
        closeButton
        dir="rtl"
        toastOptions={{
          style: { fontFamily: 'inherit' },
        }}
      />
      <Navbar />
      <Outlet />
      <Footer />
      <CartDrawer />
    </>
  );
}
```

**الاستخدام في أي مكان:**
```tsx
import { toast } from 'sonner';

// 🔴 استخدام مباشر
toast.success('تم التسجيل بنجاح');
toast.error('فشل تسجيل الدخول');
toast.info('تم إضافة الدورة إلى السلة');

// 🔴 مع Promise (تحميل ← نجاح/فشل)
const promise = enrollmentService.enroll(courseId);
toast.promise(promise, {
  loading: 'جاري التسجيل...',
  success: 'تم التسجيل في الدورة بنجاح',
  error: 'فشل التسجيل. يرجى المحاولة مرة أخرى',
});
```

### 10.4 🟢 Form Validation — مثال كامل بـ Zod

**تثبيت**: `zod` + `@hookform/resolvers` (موجودان بالفعل في package.json)

```bash
npm install @hookform/resolvers  # ← إن لم يكن موجوداً
```

**مثال: فورم تسجيل الدخول:**
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';  // zod v4
import { useLogin } from '@/hooks/useAuth';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await login.mutateAsync(data, {
      onSuccess: () => toast.success('مرحباً بعودتك!'),
      onError: (err) => toast.error(err.response?.data?.message || 'فشل تسجيل الدخول'),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="البريد الإلكتروني" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      <input {...register('password')} type="password" placeholder="كلمة المرور" />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'جاري التحميل...' : 'تسجيل الدخول'}
      </button>
    </form>
  );
}
```

**Shemas المطلوبة لكل فورم**:
| الفورم | الـ Schema |
|--------|-----------|
| Login | `email`, `password`, `rememberMe` |
| Register | `firstName`, `lastName`, `email`, `password`, `confirmPassword`, `gender`, `dateOfBirth`, `phoneNumber` |
| Profile | `firstName`, `lastName`, `bio`, `gender`, `dateOfBirth`, `nationality` |
| Address | `type`, `streetLine1`, `city`, `postalCode`, `country` |
| Phone | `phoneNumber`, `type` |
| Contact | `fullName`, `email`, `subject`, `message` |
| Course | `title`, `description`, `price`, `level`, `language` |
| Quiz Question | `questionText`, `type`, `options`, `points` |

### 10.5 🟢 Internationalization (i18n) — ملاحظة

**الوضع الحالي**: المشروع 100% عربي. لا حاجة لـ `react-i18next` أو `next-intl` حالياً.

**التوصية**: إذا احتجت لاحقاً:
```bash
npm install react-i18next i18next
```
- استخدم `i18next-browser-languagedetector` للكشف التلقائي عن اللغة
- خزّن ملفات الترجمة في `src/locales/ar/`, `src/locales/en/`
- غيّر الاتجاه (RTL ↔ LTR) عبر CSS custom property

### 10.6 🟢 Accessibility (a11y) — إضافات ضرورية

**الحد الأدنى المطلوب لكل Component:**
```tsx
// ✅ أزرار
<button aria-label="إغلاق القائمة" onClick={closeMenu}>
  <X className="w-5 h-5" />
</button>

// ✅ صور
<img src={course.thumbnail} alt={`صورة دورة ${course.title}`} />

// ✅ نماذج
<input aria-describedby="email-error" aria-invalid={!!errors.email} />
<div id="email-error" role="alert">{errors.email?.message}</div>

// ✅ إشعارات Toast
<div role="status" aria-live="polite">...</div>

// ✅ روابط التنقل
<nav aria-label="التنقل الرئيسي">...</nav>
<main role="main">...</main>
```

**موارد إضافية**:
- استخدم `eslint-plugin-jsx-a11y` (موجود في Vite تلقائياً)
- اختبر باستخدام axe DevTools أو Lighthouse

### 10.7 🟢 Performance Budget — حدود الأداء

| المقياس | الحد الأقصى | طريقة القياس |
|---------|------------|-------------|
| **JS Bundle (initial)** | ≤ 200 KB (gzip) | `vite build --report` |
| **CSS Bundle** | ≤ 50 KB | `vite build` |
| **LCP (Largest Contentful Paint)** | ≤ 2.5s | Lighthouse |
| **FID (First Input Delay)** | ≤ 100ms | Lighthouse |
| **CLS (Cumulative Layout Shift)** | ≤ 0.1 | Lighthouse |
| **عدد الـ API calls في Landing** | 1 (Landing endpoint) | Network tab |

**استراتيجية التحقيق**:
- Lazy loading للمكونات الثقيلة: `React.lazy(() => import('./HeavyChart'))`
- Code splitting لكل Route (موجود في Vite تلقائياً مع `React.lazy`)
- Preload الصور الحرجة (hero, logos)
- Compress الصور (WebP, AVIF)
- `staleTime` في React Query لا يقل عن 5 دقائق للبيانات الثابتة

### 10.8 🟡 E2E Testing Strategy — اختبارات شاملة

**اختيار الأداة**: Playwright (يدعم RTL، أسرع من Cypress):

```bash
npm init playwright@latest
```

**بنية الاختبارات:**
```
e2e/
├── auth.spec.ts          # تسجيل دخول/خروج، OAuth
├── courses.spec.ts       # تصفح، بحث، تصفية
├── cart.spec.ts          # إضافة/إزالة، كوبون, دفع
├── student.spec.ts       # Dashboard, Learning Room, Quiz
├── instructor.spec.ts    # Dashboard, Course Builder, Live Session
├── admin.spec.ts         # Dashboard, Users, Coupons, Refunds
├── fixtures/
│   └── auth.ts           # تسجيل دخول reusable
├── pages/
│   ├── LoginPage.ts      # Page Object Model
│   └── CoursePage.ts
└── playwright.config.ts
```

**مثال:**
```ts
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can login and see dashboard', async ({ page }) => {
  await page.goto('/auth');
  await page.fill('[name="email"]', 'student@athary.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/student/dashboard');
  await expect(page.locator('text=لوحة التحكم')).toBeVisible();
});

test('user sees error on invalid credentials', async ({ page }) => {
  await page.goto('/auth');
  await page.fill('[name="email"]', 'wrong@email.com');
  await page.fill('[name="password"]', 'wrongpass');
  await page.click('button[type="submit"]');
  await expect(page.locator('[role="alert"]')).toContainText('فشل تسجيل الدخول');
});
```

### 10.9 🟢 Storybook — للـ Shared Components

**التثبيت:**
```bash
npx storybook@latest init
```

**مثال:**
```tsx
// src/components/shared/Pagination.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Shared/Pagination',
  component: Pagination,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: { currentPage: 1, totalPages: 10, onPageChange: (p) => console.log(p) },
};

export const LastPage: Story = {
  args: { currentPage: 10, totalPages: 10, onPageChange: (p) => console.log(p) },
};
```

**المكونات المطلوب توثيقها**: `Pagination`, `Skeleton`, `ErrorFallback`, `EmptyState`, `CartDrawer`, `Navbar`

### 10.10 🟢 Dark Mode — الوضع الحالي

**الوضع الحالي**: ✅ المشروع يدعم Dark Mode بالفعل عبر `src/hooks/useTheme.ts`.

**ما يجب التأكد منه**:
- [ ] كل Shared Components الجديدة تدعم dark mode
- [ ] `Skeleton` يستخدم ألوان dark mode (`bg-gray-700` بدلاً من `bg-gray-200`)
- [ ] `ErrorFallback` و `EmptyState` يستخدمان `text-gray-600 dark:text-gray-400`
- [ ] `Pagination` يستخدم `border-gray-300 dark:border-gray-600`
- [ ] Toast system (`sonner`) يدعم dark mode تلقائياً

---

## ملخص الإضافات البنيوية

| # | الإضافة | الأولوية | الملف المتأثر |
|---|---------|---------|--------------|
| 1 | Error Boundary | 🟡 متوسطة | `router.tsx` |
| 2 | Loading Strategy | 🟡 متوسطة | كل الصفحات |
| 3 | Toast System (sonner) | 🟡 متوسطة | `RootLayout.tsx` |
| 4 | Form Validation (Zod) | 🟢 منخفضة | كل الفورمات |
| 5 | i18n | 🟢 منخفضة | غير مطلوب حالياً |
| 6 | Accessibility (a11y) | 🟢 منخفضة | كل المكونات |
| 7 | Performance Budget | 🟢 منخفضة | `vite.config.ts` |
| 8 | E2E Tests (Playwright) | 🟡 متوسطة | `e2e/` مجلد جديد |
| 9 | Storybook | 🟢 منخفضة | Shared Components |
| 10 | Dark Mode Audit | 🟢 منخفضة | Shared Components |
