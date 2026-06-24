# توثيق شامل للمشروع - Athary (آثاري)

## فهرس المحتويات

1. [نظرة عامة على المشروع](#1-نظرة-عامّة-على-المشروع)
2. [البنية التقنية](#2-البنية-التقنية)
3. [هيكل المجلدات](#3-هيكل-المجلدات)
4. [ملفات الجذر](#4-ملفات-الجذر)
5. [النظام أنواع البيانات](#5-النظام-أنواع-البيانات)
6. [البنية التحتية (lib)](#6-البنية-التحتية-lib)
7. [موفّرو السياق وال_condition](#7-موفّرو-السياق-والحالة)
8. [التخطيطات (Layouts)](#8-التخطيطات-layouts)
9. [المكونات المشتركة](#9-المكونات-المشتركة)
10. [الصفحات والميزات](#10-الصفحات-والميزات)
11. [طبقة الخدمات (Services)](#11-طبقة-الخدمات-services)
12. [الخطافات المشتركة (Hooks)](#12-الخطافات-المشتركة-hooks)
13. [نظام الإشعارات (Zustand)](#13-نظام-الإشعارات-zustand)
14. [الألوان والثيمات](#14-الألوان-والثيمات)
15. [الاختبارات](#15-الاختبارات)
16. [كيف يعمل المشروع بالكامل](#16-كيف-يعمل-المشروع-بالكامل)
17. [الأوامر المتاحة](#17-الأوامر-المتاحة)

---

## 1. نظرة عامة على المشروع

**الاسم:** Athary (آثاري)
**النوع:** منصة تعليمية إلكترونية (E-Learning Platform)
**التخصص:** التراث الإسلامي، الخط العربي، المخطوطات، والدراسات الأكاديمية المرتبطة
**الاتجاه:** RTL (من اليمين إلى اليسار) - واجهة عربية بالكامل

### الميزات الرئيسية
- **نظام المستخدمين:** مدرس، طالب، مدير (Admin)
- **الدورات التعليمية:** عرض، تصفح، تسجيل، مشاهدة
- **سلة المشتريات:** إضافة، حذف، كوبونات، دفع
- **الامتحانات:** اختبارات تفاعلية مع مؤقت
- **الجلسات المباشرة:** بث مباشر مع متابعة الحضور
- **الرسائل:** مراسلة مباشرة بين المستخدمين
- **الإشعارات:** إشعارات فورية عبر SignalR
- **الشهادات:** شهادات إتمام مع تحميل PDF
- **نظام المراجعات:** تقييم ومراجعة الدورات
- **قائمة الأمنيات:** حفظ الدورات المفضلة
- **طلبات استاد:** تقديم طلب لتصبح مدرساً
- **نظام استرداد الأموال:** طلب استرداد
- **لوحة تحكم Admin:** إدارة شاملة للمنصة
- **الثيمات:** 5 ثيمات × فاتح/داكن = 10 تركيبات

---

## 2. البنية التقنية

| التقنية | الإصدار | الوظيفة |
|---------|--------|---------|
| **React** | 19.x | إطار العمل الأساسي |
| **TypeScript** | 5.8.x | اللغة البرمجية |
| **Vite** | 6.2.x | أداة البناء والتطوير |
| **Tailwind CSS** | 4.x | التنسيق |
| **React Router** | 7.x | التوجيه (Routing) |
| **TanStack Query** | 5.x | إدارة حالة الخادم (Server State) |
| **Zustand** | 5.x | إدارة الحالة المحلية |
| **Axios** | 1.18.x | طلبات HTTP |
| **SignalR** | 8.x | الاتصال في الوقت الحقيقي |
| **React Hook Form** | 7.x | إدارة نماذج الإدخال |
| **Zod** | 4.x | التحقق من صحة البيانات |
| **Recharts** | 3.x | الرسوم البيانية |
| **Framer Motion** | 12.x | الحركات والانتقالات |
| **Sonner** | 2.x | إشعارات Toast |
| **Lucide React** | 0.546.x | الأيقونات |
| **Radix UI** | - | مكونات الوصولية |
| **Vitest** | 3.2.x | الاختبارات |
| **Testing Library** | 16.x | اختبارات المكونات |

### متغيرات البيئة

```
VITE_API_BASE_URL=https://localhost:5000    # رابط الـ API الرئيسي
VITE_SIGNALR_URL=wss://atharyapi.runasp.net # رابط SignalR للوقت الحقيقي
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID # معرّف Google OAuth
VITE_MICROSOFT_CLIENT_ID=YOUR_MICROSOFT_CLIENT_ID # معرّف Microsoft OAuth
```

---

## 3. هيكل المجلدات

```
Pro_Front/
├── .env                    # متغيرات البيئة (محظور في Git)
├── .env.example            # نموذج متغيرات البيئة
├── .gitignore              # ملفات محظورة في Git
├── .opencode/              # إعدادات opencode
├── AGENTS.md               # تعليمات المساعدين
├── assets/                 # ملفات الأصول الثابتة
├── coverage/               # تقارير تغطية الاختبارات
├── dist/                   # ملفات البناء النهائية
├── docs/                   # التوثيق
├── index.html              # صفحة HTML الرئيسية
├── metadata.json           # بيانات وصفية للمشروع
├── package.json            # تبعيات المشروع
├── package-lock.json       # إصدارات التبعيات المثبتة
├── README.md               # ملف القراءة أولاً
├── specs/                  # مواصفات المشروع
├── tsconfig.json           # إعدادات TypeScript
├── vite.config.ts          # إعدادات Vite
├── vitest.config.ts        # إعدادات الاختبارات
└── src/
    ├── main.tsx            # نقطة دخول التطبيق
    ├── router.tsx          # توجيهات الصفحات
    ├── index.css           # الأنماط العامة
    ├── test-setup.ts       # إعدادات اختبارات
    ├── vite-env.d.ts       # تعريفات TypeScript لـ Vite
    │
    ├── components/         # المكونات المشتركة
    │   ├── layout/         # مكونات التخطيط
    │   └── shared/         # مكونات مشتركة متعددة الاستخدام
    │
    ├── features/           # الميزات (Feature-Based)
    │   ├── landing/        # الصفحة الرئيسية
    │   ├── catalog/        # كتالوج الدورات
    │   ├── auth/           # المصادقة
    │   ├── cart/           # سلة المشتريات
    │   ├── student/        # لوحة تحكم الطالب
    │   ├── instructor/     # لوحة تحكم الاستاد
    │   ├── admin/          # لوحة تحكم المدير
    │   ├── profile/        # الملف الشخصي
    │   ├── about/          # صفحة عن المنصة
    │   ├── theme/          # إعدادات الثيمات
    │   ├── common/hooks/   # الخطافات المشتركة
    │   ├── courses/services/     # خدمات الدورات
    │   ├── enrollment/services/  # خدمات التسجيل
    │   ├── dashboards/services/  # خدمات الداشبورد
    │   ├── notifications/services/ # خدمات الإشعارات
    │   ├── messaging/services/   # خدمات الرسائل
    │   ├── wishlist/services/    # خدمات قائمة الأمنيات
    │   ├── media/services/       # خدمات الوسائط
    │   ├── liveSessions/services/ # خدمات الجلسات المباشرة
    │   ├── announcements/services/ # خدمات الإعلانات
    │   ├── reviews/services/     # خدمات المراجعات
    │   ├── certificates/services/ # خدمات الشهادات
    │   ├── public/services/      # خدمات الصفحات العامة
    │   └── instructorRequests/services/ # خدمات طلبات الاستاد
    │
    ├── providers/          # موفّرو السياق
    ├── stores/             # Zustand Stores
    ├── hooks/              # خطافات مخصصة
    ├── layouts/            # التخطيطات
    ├── lib/                # أدوات مساعدة
    ├── data/               # بيانات ثابتة
    └── types/              # تعريفات الأنواع
        ├── index.ts        # الأنواع الأساسية
        ├── global.d.ts     # تعريفات عامة
        └── api/            # أنواع API
```

---

## 4. ملفات الجذر

### `index.html`
- الصفحة الرئيسية لـ Vite
- يحتوي على `<div id="root">` where React mounts
- يحمّل الخطوط العربية (Cairo + Tajawal)
- يطبق الثيم من localStorage قبل تحميل JS لمنع وميض التحميل

### `package.json`
- **الاسم:** react-example
- **النوع:** ESM module
- **الأوامر:**
  - `npm run dev` - تشغيل خادم التطوير على المنفذ 3000
  - `npm run build` - بناء المشروع للإنتاج
  - `npm run preview` - معاينة البناء
  - `npm run clean` - حذف مجلدات البناء
  - `npm run lint` - فحص الأخطاء البرمجية (TypeScript)
  - `npm run test:unit` - تشغيل الاختبارات مرة واحدة
  - `npm run test:watch` - تشغيل الاختبارات في وضع المراقبة
  - `npm run test:coverage` - تشغيل الاختبارات مع تغطية

### `tsconfig.json`
- **الهدف:** ES2022
- **JSX:** react-jsx
- **الوحدة:** ESNext مع bundler resolution
- **المسارات:** `@/*` → `./src/*`
- **أنواع الاختبارات:** vitest/globals, @testing-library/jest-dom

### `vite.config.ts`
- **الإضافات:** React plugin, Tailwind CSS v4 plugin
- **المسارات:** alias `@` → `./src`
- **HMR:** يمكن تعطيله عبر `DISABLE_HMR` env var

### `vitest.config.ts`
- **بيئة الاختبار:** jsdom
- **الألوان:** مفعلة
- **التغطية:** v8 provider

---

## 5. نظام أنواع البيانات

### `src/types/index.ts` - الأنواع الأساسية

```typescript
Course       // الدورة: id, title, description, instructor, price, level, category, thumbnail, rating, studentsCount
Category     // التصنيف: id, name, description, courseCount
LiveSession  // الجلسة المباشرة: id, title, startTime, endTime, status, courseId
Testimonial  // الشهادة: id, author, role, content, rating
ViewType     // أنواع العرض: 'home' | 'catalog' | 'detail' | 'auth' | 'dashboard'
AuthSubView  // مشاهد المصادقة: 'login' | 'register' | 'forgot-password' | 'reset-password' | 'verify-email'
```

### `src/types/api/envelope.ts` - غلاف الاستجابة

```typescript
ApiResponse<T>  // الغلاف: { success: boolean, message: string, data: T, errors: string[] }
PagedList<T>    // قائمة متحركة: { items: T[], totalCount: number, page: number, pageSize: number, totalPages: number }
```

### `src/types/api/branded.ts` - الأنواع المميزة (Branded Types)

أكثر من 25 نوع مميز لضمان نوعية المعرّفات:
`CourseId`, `UserId`, `OrderId`, `PaymentId`, `EnrollmentId`, `CertificateId`, `ReviewId`, `QuizId`, `LessonId`, `SectionId`, `CategoryId`, `CouponId`, `MessageId`, `NotificationId`, `LiveSessionId`, `AnnouncementId`, `RefundId`, `ProfileId`, `PhoneId`, `AddressId`, `MediaId`, `InstructorRequestId`, `CartItemId`

---

## 6. البنية التحتية (lib/)

### `src/lib/api.ts` - عميل HTTP

**الم输出:** `api` (axios instance)

**الخصائص:**
- **Base URL:** من `env.VITE_API_BASE_URL`
- **المهلة الزمنية:** 15 ثانية
- **withCredentials:** true (لإرسال الكوكيز)

**معرّف الطلب (Request Interceptor):**
- يُرفق `Authorization: Bearer <token>` من tokenStorage

**معرّف الاستجابة (Response Interceptor):**
- عند الخطأ 401:
  1. يضع الطلبات الفاشلة في قائمة انتظار
  2. يحاول تجديد التوكن عبر `POST /auth/refresh`
  3. يعيد محاولة الطلبات الأصلية
  4. عند الفشل: يمسح التوكنات ويُعيد التوجيه إلى `/auth`

### `src/lib/env.ts` - متغيرات البيئة

يتحقق من صحة المتغيرات باستخدام Zod:
```typescript
VITE_API_BASE_URL: string
VITE_SIGNALR_URL: string
VITE_GOOGLE_CLIENT_ID: string
VITE_MICROSOFT_CLIENT_ID: string
```

### `src/lib/token-storage.ts` - إدارة التوكنات

- **التخزين:** SessionStorage
- **الدوالات:**
  - `getAccessToken()` / `setAccessToken(token)`
  - `getRefreshToken()` / `setRefreshToken(token)`
  - `getTokens()` / `setTokens(accessToken, refreshToken)`
  - `clearTokens()`

### `src/lib/query-client.ts` - عميل React Query

- **وقت التخزين المؤقت:** 30 ثانية (staleTime)
- **وقت جمع القمامة:** 5 دقائق
- **عدد المحاولات:** 2
- **إعادة الجلب عند التركيز:** معطلة

### `src/lib/query-keys.ts` - مفاتيح الاستعلام

مصنع مركزي لمفاتيح الاستعلام لكل النطاقات:
```
auth, courses, categories, enrollments, cart, orders, payments,
quizzes, certificates, notifications, messages, profiles,
dashboards, reviews, liveSessions, wishlist, announcements,
landing, instructorRequests
```

### `src/lib/signalr.ts` - الاتصال في الوقت الحقيقي

- **NotificationHub:** اتصال لإشعارات المستخدم
- **MessagingHub:** اتصال للرسائل المباشرة
- **الخصائص:** إعادة اتصال تلقائية، تسجيل أحداث

---

## 7. موفّرو السياق والحالة

### `src/providers/AppProvider.tsx` - السياق العام

**يُوفر عبر React Context:**

| الحقل | النوع | الوصف |
|-------|-------|-------|
| `isLoggedIn` | boolean | هل المستخدم مسجل دخول |
| `userName` | string | اسم المستخدم |
| `cartItems` | array | عناصر السلة |
| `cartOpen` | boolean | هل السلة مفتوحة |
| `coursesList` | array | قائمة الدورات |
| `handleLogout` | function | تسجيل الخروج |
| `handleLoginSuccess` | function | معالجة نجاح تسجيل الدخول |
| `handleAddToCart` | function | إضافة إلى السلة |
| `handleRemoveFromCart` | function | حذف من السلة |
| `handleCheckout` | function | الدفع |
| `displayToast` | function | عرض إشعار Toast |

### `src/stores/notificationStore.ts` - Zustand Store

**المخزن الوحيد في المشروع**

**الحالة:**
```typescript
notifications: Notification[]        // مصفوفة الإشعارات
unreadCount: () => number           // عدد غير المقروءة (مُشتق)
markAsRead: (id) => void            // تحديد كمقروء
markAllAsRead: () => void           // تحديد الكل كمقروء
deleteNotification: (id) => void    // حذف إشعار
addNotification: (notification) => void // إضافة إشعار جديد
```

**أنواع الإشعارات:** `new_course` | `award` | `live` | `system`

---

## 8. التخطيطات (Layouts)

### `src/layouts/RootLayout.tsx` - التخطيط الرئيسي

**البنية:**
```
AppProvider
  └── ErrorBoundary
      └── div (dir="rtl")
          ├── Navbar              // شريط التنقل العلوي
          ├── Outlet              // محتوى الصفحة الحالية
          ├── Footer              // تذييل الموقع
          ├── CartDrawer          // سلة المشتريات المنزلقة
          └── Toaster (Sonner)   // إشعارات Toast
```

**الخصائص:**
- يطبق الثيم من localStorage عند التحميل
- يستمع لأحداث `theme-changed` لتحديث الثيم
- يمرر للأسفل عند تغيير المسار

---

## 9. المكونات المشتركة

### `src/components/layout/` - مكونات التخطيط

#### `Navbar.tsx` - شريط التنقل
- **الموقع:** ثابت في الأعلى (sticky)
- **المحتوى:**
  - شعار المنصة
  - روابط التنقل (الرئيسية، الكتالوج، عن المنصة)
  - جرس الإشعارات مع Popover (تحديد مقروء، حذف)
  - زر سلة المشتريات
  - قائمة المستخدم (اسم + صورة + تسجيل خروج)
  - قائمة تسجيل الدخول/التسجيل (للضيوف)
  - قائمة الموبايل (hamburger menu)
  - زر تبديل الوضع الفاتح/الداكن

#### `Footer.tsx` - تذييل الموقع
- **المحتوى:**
  - معلومات المنصة + روابط اجتماعية
  - روابط المنصة
  - روابط مسارات الدورات
  - نموذج اشتراك النشرة البريدية
  - حقوق النشر + الروابط القانونية

#### `CartDrawer.tsx` - سلة المشتريات
- **الموقع:** تنزلق من الجانب الأيسر
- **المحتوى:**
  - صور العناصر + العناوين + الأسعار
  - أزرار الحذف
  - المجموع الكلي
  - زر الانتقال للدفع

#### `ErrorBoundary.tsx` - حدود الخطأ
- **النوع:** مكون فئة (Class Component)
- **الوظيفة:** يلتقط أخطاء العرض ويعرض صفحة خطأ مخصصة

#### `NotFound.tsx` - صفحة 404
- **المحتوى:** أيقونة بوصلة متحركة + رسالة + أزرار تنقل

### `src/components/shared/` - المكونات المشتركة

#### `ErrorFallback.tsx` - عرض الخطأ
- **الخصائص:** `title`, `message`, `onRetry`, `className`
- **الوظيفة:** عرض خطأ مع زر إعادة المحاولة

#### `EmptyState.tsx` - الحالة الفارغة
- **الخصائص:** `icon`, `title`, `description`, `action`, `className`
- **الوظيفة:** عرض رسالة عند عدم وجود بيانات

#### `Pagination.tsx` - التنقل بين الصفحات
- **الخصائص:** `currentPage`, `totalPages`, `onPageChange`, `className`
- **الوظيفة:** أرقام الصفحات مع ... و أزرار التالي/السابق

#### `Skeleton.tsx` - هيكل التحميل
- **المكونات:** `Skeleton` (أساسي), `CourseCardSkeleton`, `DashboardSkeleton`
- **الاستخدام:** عرض تأثير pulse أثناء تحميل البيانات

---

## 10. الصفحات والميزات

### الصفحة الرئيسية (`/`)

#### `src/features/landing/LandingPage.tsx`
- **الوصف:** صفحة تسويقية كاملة
- **الأقسام:**
  - Hero Section (قسم رئيسي مع إحصائيات)
  - شبكة التصنيفات
  - الدورات المميزة
  - كيف يعمل (خطوات الاستخدام)
  - شهادات المستخدمين
- **الخطافات:** `useLanding`, `useCart`
- **المكتبات:** Framer Motion, Lucide Icons

---

### الكتالوج (`/catalog`)

#### `src/features/catalog/CourseCatalog.tsx`
- **الوصف:** تصفح جميع الدورات مع فلاتر
- **الميزات:**
  - شريط بحث
  - فلاتر جانبية (تصنيف، مستوى، سعر، تقييم)
  - ترتيب حسب (الأحدث، الأعلى تقييماً، الأقل سعراً)
  - بطاقات الدورات مع زر أضف للسلة
  - تصفح الصفحات
  - درج فلاتر الموبايل
- **الخطافات:** `useCourses`, `useCategories`, `useCart`

---

### تفاصيل الدورة (`/course/:courseId`)

#### `src/features/catalog/CourseDetails.tsx`
- **الوصف:** صفحة الدورة التفصيلية
- **الأقسام:**
  - بانر الدورة
  - معلومات الاستاد
  - نتائج التعلم
  - المتطلبات
  - قائمة المراجعات
  - دورات ذات صلة
  - شريط جانبي ثابت (سعر، أضف للسلة، قائمة أمنيات، مشاركة)
- **الخطافات:** `useCourseDetail`, `useCourseReviews`, `useCart`

---

### المصادقة (`/auth`)

#### `src/features/auth/AuthPage.tsx`
- **الوصف:** محرك مصادقة متعدد المشاهد
- **المشاهد:**
  - **تسجيل الدخول:** بريد + كلمة مرور + OAuth (Google, Microsoft)
  - **التسجيل:** معالج 3 خطوات (معلومات شخصية + كلمة مرور + تأكيد)
  - **نسيت كلمة المرور:** إرسال بريد إعادة التعيين
  - **التحقق من البريد:** OTP
  - **إعادة تعيين كلمة المرور:** كلمة مرور جديدة
  - **تأكيد النجاح:** رسالة تأكيد
- **المكتبات:** React Hook Form + Zod
- **الخدمات:** `authService`, `publicService`

---

### لوحة تحكم الطالب (`/dashboard`)

#### `src/features/student/StudentDashboard.tsx`
- **الوصف:** لوحة تحكم شاملة للطالب مع شريط جانبي قابل للطي
- **الأقسام:**
  - **نظرة عامة:** رسوم بيانية للتقدم والإحصائيات
  - **دوراتي:** قائمة الدورات المسجل فيها
  - **شهاداتي:** الشهادات المحصلة
  - **المفضلة/الاسترداد:** قائمة الأمنيات + طلبات الاسترداد
  - **الرسائل:** مركز الرسائل المباشرة
  - **الإشعارات:** قائمة الإشعارات
  - **طلب استاد:** تقديم طلب لتصبح استاداً
  - **غرفة التعلم:** مشاهدة الدورات
  - **الاختبارات:** اختبارات تفاعلية
  - **الجلسات المباشرة:** انضمام للجلسات

#### `src/features/student/LearningRoom.tsx`
- **الوصف:** غرفة مشاهدة الدورة
- **المكونات:** شريط جانبي للمنهج + مشغل فيديو + ملاحظات + نقاش + اختبارات + شهادة

#### `src/features/student/QuizTaking.tsx`
- **الوصف:** نظام اختبار تفاعلي
- **المكونات:** مؤقت + تنقل بين الأسئلة + اختيار الإجابة + عرض النتيجة

#### `src/features/student/MessagingCenter.tsx`
- **الوصف:** مركز الرسائل والإشعارات
- **التبويبات:** المحادثات + نافذة الدردشة | الإشعارات

#### `src/features/student/WishlistRefunds.tsx`
- **الوصف:** المفضلة وطلبات الاسترداد
- **التبويبات:** قائمة الأمنيات | طلبات الاسترداد + تقديم طلب جديد

#### `src/features/student/InstructorApply.tsx`
- **الوصف:** نموذج تقديم طلب استاد
- **المحتوى:** رفع السيرة الذاتية + الشهادات + الخبرة + التصنيف + الموافقة على الشروط

#### `src/features/student/ManuscriptCertificate.tsx`
- **الوصف:** بطاقة شهادة مزخرفة
- **المكونات:** تحميل + مشاركة (WhatsApp, LinkedIn, Twitter) + تصميم زخرفي

---

### لوحة تحكم الاستاد (`/instructor`)

#### `src/features/instructor/InstructorDashboard.tsx`
- **الوصف:** لوحة تحكم الاستاد مع شريط جانبي قابل للطي
- **الأقسام:**
  - **نظرة عامة:** رسوم بيانية للإيرادات والطلاب
  - **دوراتي:** شبكة بطاقات الدورات مع تعديل
  - **منشئ الدورات:** معالج إنشاء/تعديل الدورة
  - **المراجعات:** مراجعة الدورات
  - **الأرباح:** تفاصيل الأرباح
  - **إعدادات الثيم:** تبديل الثيمات

#### `src/features/instructor/CourseBuilder.tsx`
- **الوصف:** معالج متعدد الخطوات لإنشاء الدورة (1167 سطر)
- **الخطوات:**
  1. المعلومات الأساسية
  2. التسعير
  3. المنهج (الأقسام والعناصر)
  4. رفع الوسائط
  5. المعاينة
- **المكتبات:** React Hook Form + Zod

#### `src/features/instructor/LiveSession.tsx`
- **الوصف:** غرفة الجلسة المباشرة
- **المكونات:** منطقة الفيديو + لوحة المشاركين + لوحة الدردشة + أزرار التحكم (ميكروفون، فيديو، مغادرة)

---

### لوحة تحكم المدير (`/admin`)

#### `src/features/admin/AdminDashboard.tsx`
- **الوصف:** لوحة تحكم شاملة للمدير (12+ تبويب)
- **التبويبات:**
  1. **نظرة عامة:** إحصائيات عامة + رسوم بيانية متقدمة
  2. **مراجعة الدورات:** اعتماد/رفض/أرشفة الدورات
  3. **طلبات الاستاد:** اعتماد/رفض طلبات التدريس
  4. **الطلبات/الاستردادات:** إدارة الطلبات واسترداد الأموال
  5. **التصنيفات:** إضافة/تعديل/حذف التصنيفات
  6. **الكوبونات:** إنشاء/تعديل/حذف/تفعيل الكوبونات
  7. **طرق الدفع:** تفعيل/تعطيل طرق الدفع
  8. **المستخدمين:** قائمة المستخدمين + حظر/فك الحظر
  9. **إدارة المراجعات:** مراجعة التقييمات
  10. **الإعلانات:** إنشاء وإدارة الإعلانات
  11. **مكتبة الوسائط:** تصفح ورفع الملفات
  12. **سجل النظام:** سجل النشاطات + إعدادات النظام

#### `src/features/admin/ReviewsModeration.tsx`
- **الوصف:** إدارة التقييمات المُبلّغ عنها
- **الإجراءات:** اعتماد / رفض

#### `src/features/admin/AnnouncementsCenter.tsx`
- **الوصف:** إنشاء وإدارة الإعلانات
- **الاستهداف:** الجميع / الطلاب / الاستاذاة / دورة محددة

#### `src/features/admin/MediaLibrary.tsx`
- **الوصف:** متصفح ملفات الوسائط
- **الأنواع:** فيديو / مستند / صورة
- **الإجراءات:** رفع + معاينة + تصفية

#### `src/features/admin/SystemActivitySettings.tsx`
- **الوصف:** سجل النشاطات + إعدادات النظام
- **الإعدادات:** وضع الصيانة / التسجيل / إعدادات أخرى

#### `src/features/admin/AdvancedAnalytics.tsx`
- **الوصف:** رسوم بيانية متقدمة
- **المؤشرات:** الإيرادات، التسجيلات، الإتمامات، النمو

---

### الملف الشخصي (`/profile`)

#### `src/features/profile/ProfileSettings.tsx`
- **الوصف:** إعدادات الحساب الشخصية
- **التبويبات:**
  1. **المعلومات الشخصية:** نموذج React Hook Form + Zod
  2. **أرقام الهاتف:** إضافة/حذف/تحديد افتراضي
  3. **العناوين:** إضافة/حذف/تحديد افتراضي
  4. **الأمان:** تغيير كلمة المرور

#### `src/features/profile/PublicProfile.tsx`
- **الوصف:** صفحة الملف الشخصي العامة للاستاد
- **المحتوى:** بطاقة الملف الشخصي (صورة + نبذة + جنسية) + الدورات المنشورة

---

### الصفحة العامة (`/about`)

#### `src/features/about/AboutContactPublic.tsx`
- **الوصف:** صفحة عن المنصة + نموذج اتصال
- **الأقسام:**
  - قسم Hero مع إحصائيات
  - نموذج الاتصال
  - معلومات المكتب
  - خريطة (عنصر نائب)
  - نوافذ قوانين (الخصوصية، الشروط، سياسة الاسترداد)

---

### صفحة 404 (`*`)

#### `src/components/layout/NotFound.tsx`
- **الوصف:** صفحة غير موجودة
- **المحتوى:** أيقونة بوصلة + رسالة + أزرار تنقل للرئيسية والكتالوج

---

## 11. طبقة الخدمات (Services)

### الهيكل العام

جميع الخدمات كائنات بسيطة (Object Literals) تحتوي على دوال ثابتة (Static Methods) تستخدم عميل Axios المشترك.

### `src/lib/api.ts` - عميل HTTP المشترك
- يُرفق التوكن تلقائياً في كل طلب
- يُجدد التوكن تلقائياً عند الخطأ 401
- يضع الطلبات الفاشلة في قائمة انتظار أثناء التجديد

---

### خدمات المصادقة

#### `src/features/auth/services/auth.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `login(credentials)` | POST | `/auth/login` |
| `register(data)` | POST | `/auth/register` |
| `logout()` | POST | `/auth/logout` |
| `refreshToken()` | POST | `/auth/refresh` |
| `loginWithOAuth(provider)` | POST | `/auth/loginWithOAuth` |
| `confirmEmail(token)` | GET | `/auth/confirm-email` |
| `resendConfirmation(email)` | POST | `/auth/resend-confirmation-email` |
| `forgotPassword(email)` | POST | `/auth/forgot-password` |
| `resetPassword(data)` | POST | `/auth/reset-password` |
| `changePassword(data)` | POST | `/auth/change-password` |
| `send2FA()` | POST | `/auth/send-2fa` |
| `login2FA(code)` | POST | `/auth/login-2fa` |
| `enable2FA()` | POST | `/auth/enable-2fa` |
| `disable2FA()` | POST | `/auth/disable-2fa` |
| `getSessions()` | GET | `/auth/sessions` |
| `revokeSession(id)` | DELETE | `/auth/sessions/:id` |
| `revokeAllSessions()` | DELETE | `/auth/revoke-all-sessions` |
| `verifyEmail(token)` | POST | `/auth/verify-email` |
| `resendVerification(email)` | POST | `/auth/resend-verification` |

---

### خدمات الصفحات العامة

#### `src/features/public/services/public.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getPublicCourses(filters)` | GET | `/public/courses` |
| `getPublicCourse(id)` | GET | `/public/courses/:id` |
| `getRelatedCourses(id)` | GET | `/public/courses/:id/related-courses` |
| `getCourseCurriculum(id)` | GET | `/public/courses/:id/curriculum/sections` |
| `getCourseFAQ(id)` | GET | `/public/courses/:id/faq` |
| `getPublicProfile(slug)` | GET | `/public/profiles/:slug` |
| `getPublicProfileById(id)` | GET | `/public/profiles/id/:id` |
| `getInstructorCourses(id)` | GET | `/public/instructor/courses/:instructorId` |
| `getTestimonials()` | GET | `/public/testimonials` |
| `getLandingPageData()` | GET | `/public/landing` |

#### `src/features/public/services/contact.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `sendMessage(data)` | POST | `/contact` |

#### `src/features/auth/services/public.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getLandingPageData()` | GET | `/public/landing` |
| `getCategories()` | GET | `/categories` |

---

### خدمات الدورات

#### `src/features/courses/services/course.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getCourses(filters)` | GET | `/courses` |
| `getInstructorCourses(filters)` | GET | `/courses/instructor-courses` |
| `getInstructorCoursesById(id, filters)` | GET | `/courses/instructor-courses/:instructorId` |
| `getCourseDetail(id)` | GET | `/courses/:id` |
| `getCourseInstructor(id)` | GET | `/courses/:id/instructor` |
| `createCourse(data)` | POST | `/courses` |
| `updateCourse(id, data)` | PUT | `/courses/:id` |
| `publishCourse(id)` | PUT | `/courses/:id/publish` |
| `archiveCourse(id)` | PUT | `/courses/:id/archive` |
| `deleteCourse(id)` | DELETE | `/courses/:id` |
| `deleteCourseImage(id)` | DELETE | `/courses/:id/delete-image` |

#### `src/features/courses/services/category.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getCategories()` | GET | `/categories` |
| `createCategory(data)` | POST | `/categories` |
| `updateCategory(id, data)` | PUT | `/categories/:id` |
| `deleteCategory(id)` | DELETE | `/categories/:id` |

#### `src/features/courses/services/curriculum.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getSections(courseId)` | GET | `/courses/:courseId/curriculum/sections` |
| `createSection(courseId, data)` | POST | `/courses/:courseId/curriculum/sections` |
| `updateSection(courseId, sectionId, data)` | PUT | `/courses/:courseId/curriculum/sections/:sectionId` |
| `deleteSection(courseId, sectionId)` | DELETE | `/courses/:courseId/curriculum/sections/:sectionId` |
| `updateSectionsOrder(courseId, data)` | PUT | `/courses/:courseId/curriculum/sections/order` |

---

### خدمات سلة المشتريات والطلبات

#### `src/features/cart/services/cart.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getCart()` | GET | `/cart` |
| `addItem(data)` | POST | `/cart/items` |
| `removeItem(courseId)` | DELETE | `/cart/items/:courseId` |
| `clearCart()` | DELETE | `/cart` |
| `applyCoupon(code)` | POST | `/cart/coupon` |

#### `src/features/cart/services/order.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `checkout(data)` | POST | `/orders/checkout` |
| `getOrders()` | GET | `/orders` |
| `getOrder(id)` | GET | `/orders/:id` |

#### `src/features/cart/services/payment.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getPaymentMethods()` | GET | `/payments/methods` |
| `createPaymentIntent(data)` | POST | `/payments/create-intent` |
| `confirmPayment(paymentId)` | POST | `/payments/:paymentId/confirm` |
| `getOrderPayments(orderId)` | GET | `/payments/order/:orderId` |
| `getPayment(id)` | GET | `/payments/:id` |
| `handleWebhook(data)` | POST | `/payments/webhook` |

---

### خدمات التسجيل في الدورات

#### `src/features/enrollment/services/enrollment.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getEnrollments()` | GET | `/enrollments` |
| `getByCourse(courseId)` | GET | `/enrollments/course/:courseId` |
| `getByStudent(studentId)` | GET | `/enrollments/student/:studentId` |
| `getEnrollment(id)` | GET | `/enrollments/:id` |
| `getProgress(id)` | GET | `/enrollments/:id/progress` |
| `checkProgress(id)` | POST | `/enrollments/:id/check-progress` |
| `checkAndCompleteIfEligible(id)` | POST | `/enrollments/:id/check-and-complete-if-eligible` |
| `requestCompletion(id)` | POST | `/enrollments/:id/request-completion` |
| `markExpired()` | POST | `/enrollments/mark-expired` |

---

### خدمات الامتحانات

#### `src/features/enrollment/services/quiz.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getQuizzesByLesson(lessonId)` | GET | `/quizzes/lesson/:lessonId` |
| `getQuiz(id)` | GET | `/quizzes/:id` |
| `submitQuiz(id, answers)` | POST | `/quizzes/:id/submit` |
| `getMyAttempts(lessonId)` | GET | `/quizzes/attempts/my-attempts/:lessonId` |
| `getStudentQuizzes(lessonId)` | GET | `/quizzes/lesson/:lessonId/student` |

---

### خدمات الداشبورد

#### `src/features/dashboards/services/dashboard.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getStudentOverview()` | GET | `/student/dashboard/overview` |
| `getInstructorOverview()` | GET | `/instructor/dashboard/overview` |
| `getAdminOverview()` | GET | `/admin/dashboard/overview` |
| `getInstructorRevenue()` | GET | `/instructor/dashboard/revenue` |
| `getInstructorStudents()` | GET | `/instructor/dashboard/students` |
| `getStudentCertificates()` | GET | `/student/dashboard/certificates` |
| `getStudentWishlist()` | GET | `/student/dashboard/wishlist` |
| `getStudentPayments()` | GET | `/student/dashboard/payments` |

---

### خدمات الملف الشخصي

#### `src/features/profile/services/profile.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getProfile()` | GET | `/profiles` |
| `updateProfile(data)` | PUT | `/profiles` |
| `addPhone(data)` | POST | `/profiles/phones` |
| `setDefaultPhone(phoneId)` | PUT | `/profiles/phones/:phoneId/default-phone` |
| `deletePhone(phoneId)` | DELETE | `/profiles/phones/:phoneId` |
| `addAddress(data)` | POST | `/profiles/addresses` |
| `setDefaultAddress(addressId)` | PUT | `/profiles/addresses/:addressId/default-address` |
| `deleteAddress(addressId)` | DELETE | `/profiles/addresses/:addressId` |
| `getPublicProfile(slug)` | GET | `/profiles/public/:slug` |
| `getPublicProfileById(id)` | GET | `/profiles/public/id/:id` |

---

### خدمات الشهادات

#### `src/features/certificates/services/certificate.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getMyCertificates()` | GET | `/certificates/my` |
| `verifyCertificate(code)` | GET | `/certificates/verify/:code` |
| `getCertificate(id)` | GET | `/certificates/:id` |
| `downloadCertificate(id)` | GET | `/certificates/:id/download` |

---

### خدمات الإعلانات

#### `src/features/announcements/services/announcement.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getMyAnnouncements()` | GET | `/announcements/my-announcements` |
| `getAnnouncements(filters)` | GET | `/announcements` |
| `getByUser(userId)` | GET | `/announcements/user/:userId` |
| `getByCourse(courseId)` | GET | `/announcements/course/:courseId` |
| `getAnnouncement(id)` | GET | `/announcements/:id` |
| `createAnnouncement(data)` | POST | `/announcements` |
| `updateAnnouncement(id, data)` | PUT | `/announcements/:id` |
| `deleteAnnouncement(id)` | DELETE | `/announcements/:id` |

---

### خدمات الجلسات المباشرة

#### `src/features/liveSessions/services/liveSession.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getScheduledSessions()` | GET | `/live-sessions/scheduled` |
| `getEnrolledUpcoming()` | GET | `/live-sessions/enrolled-upcoming` |
| `getByCourse(courseId)` | GET | `/courses/:courseId/live-sessions` |
| `getSession(id)` | GET | `/live-sessions/:id` |
| `createSession(courseId, data)` | POST | `/courses/:courseId/live-sessions` |
| `updateSession(id, data)` | PUT | `/live-sessions/:id` |
| `deleteSession(id)` | DELETE | `/live-sessions/:id` |
| `cancelSession(id)` | POST | `/live-sessions/:id/cancel` |
| `startSession(id)` | POST | `/live-sessions/:id/start` |
| `endSession(id)` | POST | `/live-sessions/:id/end` |
| `joinSession(id)` | POST | `/live-sessions/:id/attendance/join` |
| `getStudentUpcoming()` | GET | `/live-sessions/student/upcoming` |

---

### خدمات الرسائل

#### `src/features/messaging/services/message.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getConversations()` | GET | `/messages/conversations` |
| `getConversation(userId)` | GET | `/messages/conversations/:userId` |
| `getMessages(userId)` | GET | `/messages/:userId` |
| `getRecentMessages()` | GET | `/messages/recent-messages` |
| `sendMessage(data)` | POST | `/messages/send` |
| `markAsRead(userId)` | PUT | `/messages/read/:userId` |
| `deleteMessage(id)` | DELETE | `/messages/:id` |

---

### خدمات الإشعارات

#### `src/features/notifications/services/notification.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getMyNotifications()` | GET | `/notifications/my-notifications` |
| `getNotifications(filters)` | GET | `/notifications` |
| `getUnreadCount()` | GET | `/notifications/unread-count` |
| `markAsRead(id)` | PUT | `/notifications/:id/read` |
| `markAllAsRead()` | PUT | `/notifications/mark-all-read` |
| `deleteNotification(id)` | DELETE | `/notifications/:id` |
| `getPreferences()` | GET | `/notifications/preferences` |
| `updatePreferences(data)` | PUT | `/notifications/preferences` |
| `checkCompletion(enrollmentId)` | GET | `/notifications/check-completion/:enrollmentId` |

---

### خدمات المراجعات

#### `src/features/reviews/services/review.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getCourseReviews(courseId, params)` | GET | `/reviews/course/:courseId` |
| `getMyReviews()` | GET | `/reviews/user` |
| `submitReview(courseId, data)` | POST | `/reviews/course/:courseId` |
| `updateReview(reviewId, data)` | PUT | `/reviews/:reviewId` |
| `deleteReview(reviewId)` | DELETE | `/reviews/:reviewId` |
| `getReviewableEnrollments()` | GET | `/reviews/reviewable-enrollments` |

---

### خدمات قائمة الأمنيات

#### `src/features/wishlist/services/wishlist.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getWishlist()` | GET | `/wishlist` |
| `addToWishlist(courseId)` | POST | `/wishlist/:courseId` |
| `removeFromWishlist(courseId)` | DELETE | `/wishlist/:courseId` |
| `isInWishlist(courseId)` | GET | `/wishlist/check/:courseId` |

---

### خدمات الوسائط

#### `src/features/media/services/media.service.ts`
- **نمط الرفع:** Pre-signed URL (3 خطوات)
  1. طلب رابط الرفع
  2. PUT الملف مباشرة للرابط
  3. تأكيد الرفع مع الخادم

| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `getUploadUrl(data)` | POST | `/media/upload-url` |
| `confirmUpload(data)` | POST | `/media/confirm-upload` |
| `getObjectById(id)` | GET | `/media/object-id/:id` |
| `deleteMedia(id)` | DELETE | `/media/:id` |
| `getFileUrl(objectKey)` | GET | `/media/file-url/:objectKey` |
| `uploadFile(file)` | (مُنسّق) | يُنفذ الخطوات 1-3 |

---

### خدمات طلبات الاستاد

#### `src/features/instructorRequests/services/instructorRequest.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `submitRequest(data)` | POST | `/instructor-requests` |
| `getRequestStatus()` | GET | `/instructor-requests/status` |

---

### خدمات استرداد الأموال

#### `src/features/student/services/studentRefund.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `requestRefund(data)` | POST | `/refunds` |
| `getMyRefunds()` | GET | `/refunds/my` |

---

### خدمات إدارة المدير

#### `src/features/admin/services/admin.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `approveCourse(id)` | PUT | `/admin/courses/:id/approve` |
| `rejectCourse(id)` | PUT | `/admin/courses/:id/reject` |
| `archiveCourse(id)` | PUT | `/admin/courses/:id/archive` |
| `getCoupons()` | GET | `/admin/coupons` |
| `createCoupon(data)` | POST | `/admin/coupons` |
| `toggleCoupon(id)` | PUT | `/admin/coupons/:id/toggle` |
| `deleteCoupon(id)` | DELETE | `/admin/coupons/:id` |
| `getPaymentMethods()` | GET | `/admin/payment-methods` |
| `togglePaymentMethod(id)` | PUT | `/admin/payment-methods/:id/toggle` |
| `getRefunds()` | GET | `/admin/refunds` |
| `approveRefund(id)` | PUT | `/admin/refunds/:id/approve` |
| `rejectRefund(id)` | PUT | `/admin/refunds/:id/reject` |
| `getInstructorRequests()` | GET | `/admin/instructor-requests` |
| `approveInstructorRequest(id)` | PUT | `/admin/instructor-requests/:id/approve` |
| `rejectInstructorRequest(id)` | PUT | `/admin/instructor-requests/:id/reject` |
| `getUsers()` | GET | `/admin/users` |
| `toggleUserBlock(id)` | PUT | `/admin/users/:id/toggle-block` |

#### `src/features/admin/services/courseAdmin.service.ts`
| الدالة | الطريقة | الرابط |
|--------|---------|--------|
| `approveCourse(id)` | PUT | `/admin/courses/:id/approve` |
| `rejectCourse(id, reason)` | PUT | `/admin/courses/:id/reject` |
| `archiveCourse(id)` | PUT | `/admin/courses/:id/archive` |
| `toggleFeatured(id, featured)` | PUT | `/admin/courses/:id/featured` |

---

## 12. الخطافات المشتركة (Hooks)

### خطافات React Query

جميع الخطافات في `src/features/common/hooks/` تستخدم TanStack Query لإدارة حالة الخادم.

| الخطاف | الملف | الوظيفة |
|--------|-------|---------|
| `useAuth` | `useAuth.ts` | تسجيل الدخول/الخروج، التسجيل، OAuth |
| `useCourses` | `useCourses.ts` | قائمة الدورات، تفاصيل الدورة، دورات الاستاد |
| `useCategories` | `useCategories.ts` | قائمة التصنيفات |
| `useCart` | `useCart.ts` | CRUD السلة، تطبيق الكوبون |
| `useOrders` | `useOrders.ts` | إتمام الشراء |
| `usePayment` | `usePayment.ts` | إنشاء نية الدفع |
| `useDashboard` | `useDashboard.ts` | بيانات الداشبورد (طالب/استاد/مدير) |
| `useEnrollments` | `useEnrollments.ts` | قائمة التسجيلات |
| `useCertificates` | `useCertificates.ts` | قائمة الشهادات |
| `useProfile` | `useProfile.ts` | CRUD الملف الشخصي |
| `useNotifications` | `useNotifications.ts` | الإشعارات، تحديد مقروء، عدد غير المقروءة |
| `useMessages` | `useMessages.ts` | المحادثات، إرسال رسالة، تحديد مقروء |
| `useLiveSession` | `useLiveSession.ts` | الجلسات المباشرة القادمة |
| `useReview` | `useReview.ts` | مراجعات الدورة، إرسال مراجعة |
| `useQuiz` | `useQuiz.ts` | بيانات الاختبار، إرسال الإجابات |
| `useLanding` | `useLanding.ts` | بيانات الصفحة الرئيسية |
| `useSignalR` | `useSignalR.ts` | إدارة اتصال SignalR |
| `useAnnouncement` | `useAnnouncement.ts` | الاستعلام عن الإعلانات |

### خطافات خاصة بالميزة

| الخطاف | الملف | الوظيفة |
|--------|-------|---------|
| `useWishlist` | `wishlist/hooks/useWishlist.ts` | CRUD قائمة الأمنيات |
| `useRefunds` | `student/hooks/useRefunds.ts` | قائمة طلبات الاسترداد + تقديم طلب |
| `useInstructorRequest` | `instructorRequests/hooks/useInstructorRequest.ts` | حالة طلب الاستاد + التقديم |
| `useAdmin` | `admin/hooks/useAdmin.ts` | خطافات المدير: الكوبونات، طرق الدفع، الاستردادات، طلبات الاستاد، المستخدمين |

### خطافات أخرى

| الخطاف | الملف | الوظيفة |
|--------|-------|---------|
| `useTheme` | `hooks/useTheme.ts` | إدارة الثيم (فاتح/داكن + لون) مع localStorage |

---

## 13. نظام الإشعارات (Zustand)

### `src/stores/notificationStore.ts`

**الحالة:**
```typescript
{
  notifications: [
    { id: 1, title: 'دورة جديدة', content: 'تمت إضافة دورة الخط الكوفي', date: '2024-...', read: false, type: 'new_course' },
    { id: 2, title: 'شهادة', content: 'حصلت على شهادة إتمام', date: '2024-...', read: false, type: 'award' },
    { id: 3, title: 'جلسة مباشرة', content: 'ستبدأ جلسة مباشرة قريباً', date: '2024-...', read: true, type: 'live' }
  ],
  unreadCount: () => 2,  // عدد غير المقروءة
  markAsRead: (id) => void,
  markAllAsRead: () => void,
  deleteNotification: (id) => void,
  addNotification: (notification) => void
}
```

**الأنواع:** `new_course` | `award` | `live` | `system`

**ملاحظة:** هذا Store إدارة حالة محلية فقط (UI) ولا يتزامن مع خادم الإشعارات.

---

## 14. الألوان والثيمات

### `src/index.css` - نظام الثيمات

**مساحة الألوان:** OKLCH (محددة الجودة)

### الثيمات المتاحة

| الثيم | اللون الأساسي |
|-------|--------------|
| **Default** | برتقالي |
| **Gold** | ذهبي |
| **Forest** | أخضر غابات |
| **Graphite** | رمادي فحمي |

###أوضاع العرض

| الوضع | الخصائص |
|-------|---------|
| **Light** | خلفية فاتحة، نصوص داكنة |
| **Dark** | خلفية داكنة، نصوص فاتحة |

### **التركيبات المتاحة:** 5 ثيمات × 2 أوضاع = 10 تركيبات

### إدارة الثيمات

- **الحفظ:** localStorage (مفتاح `theme-mode` و `theme-color`)
- **التغيير:** فعّال عبر `ThemeSettingsPopover` (Radix UI Popover)
- **المزامنة:** حدث مخصص `theme-changed` بين المكونات
- **التطبيق:** CSS Custom Properties على عنصر `<html>`

---

## 15. الاختبارات

### الأداة: Vitest + React Testing Library

### ملفات الاختبارات الموجودة

| الملف | الوظيفة |
|-------|---------|
| `EmptyState.test.tsx` | اختبار مكون الحالة الفارغة |
| `ErrorFallback.test.tsx` | اختبار مكون عرض الخطأ |
| `Pagination.test.tsx` | اختبار التنقل بين الصفحات |
| `Skeleton.test.tsx` | اختبار هيكل التحميل |
| `auth.service.test.ts` | اختبار خدمة المصادقة |
| `courseAdmin.service.test.ts` | اختبار خدمة إدارة الدورات |
| `announcement.service.test.ts` | اختبار خدمة الإعلانات |
| `cart.service.test.ts` | اختبار خدمة السلة |
| `order.service.test.ts` | اختبار خدمة الطلبات |
| `payment.service.test.ts` | اختبار خدمة الدفع |
| `certificate.service.test.ts` | اختبار خدمة الشهادات |
| `category.service.test.ts` | اختبار خدمة التصنيفات |
| `course.service.test.ts` | اختبار خدمة الدورات |
| `curriculum.service.test.ts` | اختبار خدمة المنهج |
| `dashboard.service.test.ts` | اختبار خدمة الداشبورد |
| `enrollment.service.test.ts` | اختبار خدمة التسجيل |
| `quiz.service.test.ts` | اختبار خدمة الامتحانات |
| `instructorRequest.service.test.ts` | اختبار خدمة طلبات الاستاد |
| `liveSession.service.test.ts` | اختبار خدمة الجلسات المباشرة |
| `media.service.test.ts` | اختبار خدمة الوسائط |
| `message.service.test.ts` | اختبار خدمة الرسائل |
| `notification.service.test.ts` | اختبار خدمة الإشعارات |
| `profile.service.test.ts` | اختبار خدمة الملف الشخصي |
| `public.service.test.ts` | اختبار الخدمة العامة |
| `review.service.test.ts` | اختبار خدمة المراجعات |
| `wishlist.service.test.ts` | اختبار خدمة قائمة الأمنيات |
| `useAnnouncement.test.ts` | اختبار خطاف الإعلانات |
| `useAuth.test.ts` | اختبار خطاف المصادقة |
| `useCart.test.ts` | اختبار خطاف السلة |
| `useCategories.test.ts` | اختبار خطاف التصنيفات |
| `useCertificates.test.ts` | اختبار خطاف الشهادات |
| `useCourses.test.ts` | اختبار خطاف الدورات |
| `useDashboard.test.ts` | اختبار خطاف الداشبورد |
| `useEnrollments.test.ts` | اختبار خطاف التسجيل |
| `useLiveSession.test.ts` | اختبار خطاف الجلسات المباشرة |
| `useMessages.test.ts` | اختبار خطاف الرسائل |
| `useNotifications.test.ts` | اختبار خطاف الإشعارات |
| `useOrders.test.ts` | اختبار خطاف الطلبات |
| `usePayment.test.ts` | اختبار خطاف الدفع |
| `useProfile.test.ts` | اختبار خطاف الملف الشخصي |
| `useQuiz.test.ts` | اختبار خطاف الامتحانات |
| `useReview.test.ts` | اختبار خطاف المراجعات |
| `useSignalR.test.ts` | اختبار خطاف SignalR |

---

## 16. كيف يعمل المشروع بالكامل

### دورة حياة الطلب

```
1. المستخدم يفتح الصفحة الرئيسية
   ↓
2. يتصفح الكتالوج ويختار دورة
   ↓
3. يضيف الدورة للسلة
   ↓
4. يذهب لصفحة الدفع
   ↓
5. يختار طريقة الدفع ويلambda الدفع
   ↓
6. يتم إنشاء الطلب والدفع
   ↓
7. يُسجّل في الدورة تلقائياً
   ↓
8. يمكنه مشاهدة الدورة في لوحة التحكم
```

### تدفق المصادقة

```
1. المستخدم يدخل بيانات تسجيل الدخول
   ↓
2. الطلب يذهب لـ POST /auth/login
   ↓
3. الخادم يُعيد access token + refresh token
   ↓
4. التوكنات تُخزّن في SessionStorage
   ↓
5. كل طلب لاحق يُرفق التوكن تلقائياً
   ↓
6. عند انتهاء الصلاحية (401):
   a. يتم تجديد التوكن عبر POST /auth/refresh
   b. يُعاد محاولة الطلب الأصلي
   c. عند فشل التجديد: تسجيل خروج تلقائي
```

### تدفق رفع الوسائط (Pre-signed URL)

```
1. العميل يطلب رابط رفع من الخادم
   POST /media/upload-url
   ↓
2. الخادم يُعيد Pre-signed URL
   ↓
3. العميل يرفع الملف مباشرة للـ URL
   PUT <pre-signed-url>
   ↓
4. العميل يُؤكد الرفع مع الخادم
   POST /media/confirm-upload
   ↓
5. الخادم يحفظ رابط الملف
```

### الإشعارات الفورية (SignalR)

```
1. عند تسجيل الدخول، يتم فتح اتصال SignalR
   ↓
2. الاتصال يبقى مفتوحاً مع الخادم
   ↓
3. عند حدث جديد (رسالة، إشعار، جلسة مباشرة):
   a. الخادم يرسل البيانات عبر الاتصال
   b. العميل يستقبل البيانات فوراً
   c. يتم تحديث واجهة المستخدم
```

### تدفق الامتحانات

```
1. الطالب يفتح صفحة الاختبار
   ↓
2. يُحمّل الأسئلة من الخادم
   ↓
3. يبدأ الاختبار مع مؤقت
   ↓
4. يُجيب على كل سؤال
   ↓
5. يُرسل الإجابات
   POST /quizzes/:id/submit
   ↓
6. يعرض النتيجة
```

---

## 17. الأوامر المتاحة

| الأمر | الوظيفة |
|-------|---------|
| `npm run dev` | تشغيل خادم التطوير على المنفذ 3000 |
| `npm run build` | بناء المشروع للإنتاج |
| `npm run preview` | معاينة البناء |
| `npm run clean` | حذف مجلدات البناء |
| `npm run lint` | فحص الأخطاء البرمجية |
| `npm run test:unit` | تشغيل الاختبارات |
| `npm run test:watch` | تشغيل الاختبارات في وضع المراقبة |
| `npm run test:coverage` | تشغيل الاختبارات مع تغطية |

---

## ملخص إحصائيات المشروع

| البند | العدد |
|-------|-------|
| **إجمالي ملفات .ts/.tsx** | 155+ ملف |
| **ملفات الاختبارات** | 40+ ملف |
| **الخدمات** | 22 خدمة |
| **الخطافات** | 22 خطاف |
| **الصفحات** | 11 صفحة |
| **المكونات المشتركة** | 15+ مكون |
| **نقاط نهاية API** | 140+ نقطة نهاية |
| **أنواع البيانات** | 25+ نوع مميز |
| **الثيمات** | 10 تركيبات |
