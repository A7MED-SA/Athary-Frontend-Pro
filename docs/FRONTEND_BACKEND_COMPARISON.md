# مقارنة شاملة: الفرونت إند والباك إند - Athary Platform

## فهرس المحتويات

1. [نظرة عامة على المقارنة](#1-نظرة-عامّة-على-المقارنة)
2. [البنية التقنية](#2-البنية-التقنية)
3. [مقارنة خدمات API](#3-مقارنة-خدمات-api)
4. [ما هو موجود في الباك إند فقط](#4-ما-هو-موجود-في-الباك-إند-فقط)
5. [ما هو موجود في الفرونت إند فقط](#5-ما-هو-موجود-في-الفرونت-إند-فقط)
6. [ما هو ناقص في كليهما](#6-ما-هو-ناقص-في-كليهما)
7. [كيف يتشابك المشروعان معاً](#7-كيف-يتشابك-المشروعان-معاً)
8. [توافق نقاط النهاية](#8-توافق-نقاط-النهاية)
9. [الفجوات والمطابقات](#9-الفجوات-والمطابقات)
10. [توصيات للتحسين](#10-توصيات-للتحسين)

---

## 1. نظرة عامة على المقارنة

| البند | الفرونت إند (Pro_Front) | الباك إند (Athary API) |
|-------|------------------------|----------------------|
| **التقنية** | React 19 + TypeScript | .NET 9 + C# |
| **أداة البناء** | Vite | dotnet CLI |
| **قاعدة البيانات** | - | SQL Server 2022 + EF Core |
| **التخزين** | SessionStorage (للتوكنات) | MinIO (للملفات) |
| **الحالة** | React Query + Zustand | - |
| **التواصل** | HTTP (Axios) + SignalR | HTTP Controllers + SignalR Hubs |
| **الاختبارات** | Vitest + Testing Library | - (غير موثق) |
| **التوثيق** | COMPREHENSIVE_PROJECT_DOC.md | PROJECT_DOCUMENTATION.md |
| **عدد نقاط النهاية** | يستدعي 140+ نقطة نهاية | يوفر 140+ نقطة نهاية |

---

## 2. البنية التقنية

### الفرونت إند
```
React 19 → TypeScript → Vite → Tailwind CSS 4
├── TanStack Query (حالة الخادم)
├── Zustand (حالة محلية)
├── Axios (HTTP)
├── SignalR Client (وقت حقيقي)
├── React Router 7 (توجيه)
├── React Hook Form + Zod (نماذج)
├── Recharts (رسوم بيانية)
├── Framer Motion (حركات)
└── Sonner (إشعارات Toast)
```

### الباك إند
```
.NET 9 → Clean Architecture (4 طبقات)
├── Athary.Domain (الكيانات + التعدادات)
├── Athary.Application (DTOs + الواجهات + المدققات)
├── Athary.Infrastructure (الخدمات + EF Core + Hubs)
└── Athary.API (Controllers + Middleware)
├── SQL Server 2022 (قاعدة البيانات)
├── MinIO (تخزين الملفات)
├── SignalR (وقت حقيقي)
├── Redis (تخزين مؤقت)
├── Serilog + Seq (الت_logging)
├── OpenTelemetry (المراقبة)
├── QuestPDF (توليد الشهادات)
├── MassTransit (رسائل)
└── Docker (النشر)
```

---

## 3. مقارنة خدمات API

### جدول مطابقة نقاط النهاية

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **تسجيل الدخول** | `POST /auth/login` | `POST /api/auth/login` | متطابق ✅ |
| **التسجيل** | `POST /auth/register` | `POST /api/auth/register` | متطابق ✅ |
| **تجديد التوكن** | `POST /auth/refresh` | `POST /api/auth/refresh` | متطابق ✅ |
| **تسجيل الخروج** | `POST /auth/logout` | `POST /api/auth/logout` | متطابق ✅ |
| **OAuth Google** | `POST /auth/loginWithOAuth` | `POST /api/oauth/google` | مختلف ⚠️ |
| **OAuth Microsoft** | `POST /auth/loginWithOAuth` | `POST /api/oauth/microsoft` | مختلف ⚠️ |
| **التحقق من البريد** | `POST /auth/verify-email` | `POST /api/auth/verify-email` | متطابق ✅ |
| **إعادة إرسال التحقق** | `POST /auth/resend-verification` | `POST /api/auth/resend-verification` | متطابق ✅ |
| **نسيان كلمة المرور** | `POST /auth/forgot-password` | `POST /api/auth/forgot-password` | متطابق ✅ |
| **إعادة التعيين** | `POST /auth/reset-password` | `POST /api/auth/reset-password` | متطابق ✅ |
| **تغيير كلمة المرور** | `POST /auth/change-password` | `POST /api/auth/change-password` | متطابق ✅ |
| **إرسال 2FA** | `POST /auth/send-2fa` | ❌ غير موجود | ناقص في الباك ❌ |
| **دخول 2FA** | `POST /auth/login-2fa` | ❌ غير موجود | ناقص في الباك ❌ |
| **تفعيل 2FA** | `POST /auth/enable-2fa` | ❌ غير موجود | ناقص في الباك ❌ |
| **تعطيل 2FA** | `POST /auth/disable-2fa` | ❌ غير موجود | ناقص في الباك ❌ |
| **الجلسات** | `GET /auth/sessions` | `GET /api/auth/sessions` | متطابق ✅ |
| **حذف جلسة** | `DELETE /auth/sessions/:id` | ❌ غير موجود | ناقص في الباك ❌ |
| **حذف الكل** | `DELETE /auth/revoke-all-sessions` | `POST /api/auth/logout-all` | مختلف ⚠️ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **الملف الشخصي** | `GET /profiles` | `GET /api/profile/me` | مختلف ⚠️ |
| **تحديث الملف** | `PUT /profiles` | `PUT /api/profile` | مختلف ⚠️ |
| **إضافة هاتف** | `POST /profiles/phones` | `POST /api/profile/phones` | مختلف ⚠️ |
| **تحديد هاتف افتراضي** | `PUT /profiles/phones/:id/default-phone` | `PUT /api/profile/phones/{phoneId}/default` | مختلف ⚠️ |
| **حذف هاتف** | `DELETE /profiles/phones/:id` | `DELETE /api/profile/phones/{phoneId}` | مختلف ⚠️ |
| **إضافة عنوان** | `POST /profiles/addresses` | `POST /api/profile/addresses` | مختلف ⚠️ |
| **تحديد عنوان افتراضي** | `PUT /profiles/addresses/:id/default-address` | `PUT /api/profile/addresses/{addressId}/default` | مختلف ⚠️ |
| **حذف عنوان** | `DELETE /profiles/addresses/:id` | `DELETE /api/profile/addresses/{addressId}` | مختلف ⚠️ |
| **صورة الملف الشخصي** | ❌ غير موجود | `POST /api/profile/picture` | ناقص في الفرونت ❌ |
| **حذف الصورة** | ❌ غير موجود | `DELETE /api/profile/picture` | ناقص في الفرونت ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **الدورات (عامة)** | `GET /public/courses` | `GET /api/public/courses` | متطابق ✅ |
| **تفاصيل الدورة** | `GET /public/courses/:id` | `GET /api/public/courses/{id}` | متطابق ✅ |
| **دورات ذات صلة** | `GET /public/courses/:id/related-courses` | `GET /api/public/courses/{id}/related` | مختلف ⚠️ |
| **المنهج** | `GET /public/courses/:id/curriculum/sections` | ❌ غير موجود بالشكل | مختلف ⚠️ |
| **FAQ** | `GET /public/courses/:id/faq` | ❌ غير موجود | ناقص في الباك ❌ |
| **دورات الاستاد** | `GET /public/instructor/courses/:id` | `GET /api/public/instructors/{slug}` | مختلف ⚠️ |
| **الشهادات** | `GET /public/testimonials` | `GET /api/public/testimonials` | متطابق ✅ |
| **الصفحة الرئيسية** | `GET /public/landing` | `GET /api/public/landing` | متطابق ✅ |
| **إحصائيات** | ❌ غير موجود | `GET /api/public/stats` | ناقص في الفرونت ❌ |
| **بحث الدورات** | ❌ غير موجود | `GET /api/public/courses/search/suggest` | ناقص في الفرونت ❌ |
| **خيارات الفلتر** | ❌ غير موجود | `GET /api/public/courses/filters/options` | ناقص في الفرونت ❌ |
| **قانوني** | ❌ غير موجود | `GET /api/public/legal/{type}` | ناقص في الفرونت ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **إنشاء دورة** | `POST /courses` | `POST /api/management/courses` | مختلف ⚠️ |
| **دورات الاستاد** | `GET /courses/instructor-courses` | `GET /api/management/courses` | مختلف ⚠️ |
| **تفاصيل الدورة** | `GET /courses/:id` | `GET /api/management/courses/{id}` | مختلف ⚠️ |
| **تحديث الدورة** | `PUT /courses/:id` | `PUT /api/management/courses/{id}` | مختلف ⚠️ |
| **نشر الدورة** | `PUT /courses/:id/publish` | `POST /api/management/courses/{id}/submit-for-review` | مختلف ⚠️ |
| **أرشفة الدورة** | `PUT /courses/:id/archive` | ❌ غير موجود | ناقص في الباك ❌ |
| **حذف الدورة** | `DELETE /courses/:id` | `DELETE /api/management/courses/{id}` | متطابق ✅ |
| **حذف الصورة** | `DELETE /courses/:id/delete-image` | ❌ غير موجود | ناقص في الباك ❌ |
| **المتطلبات** | ❌ غير موجود | `POST /api/management/courses/{id}/requirements` | ناقص في الفرونت ❌ |
| **نتائج التعلم** | ❌ غير موجود | `POST /api/management/courses/{id}/outcomes` | ناقص في الفرونت ❌ |
| **جدولة الحذف** | ❌ غير موجود | `POST /api/management/courses/{id}/schedule-deletion` | ناقص في الفرونت ❌ |
| **صورة الدورة** | ❌ غير موجود | `PUT /api/management/courses/{courseId}/image` | ناقص في الفرونت ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **الأقسام** | `GET /courses/:id/curriculum/sections` | `GET /api/management/courses/{id}/sections` | مختلف ⚠️ |
| **إضافة قسم** | `POST /courses/:id/curriculum/sections` | `POST /api/management/courses/{id}/sections` | مختلف ⚠️ |
| **تحديث قسم** | `PUT /courses/:id/curriculum/sections/:id` | `PUT /api/management/courses/{id}/sections/{id}` | مختلف ⚠️ |
| **حذف قسم** | `DELETE /courses/:id/curriculum/sections/:id` | `DELETE /api/management/courses/{id}/sections/{id}` | مختلف ⚠️ |
| **إعادة ترتيب** | `PUT /courses/:id/curriculum/sections/order` | `PUT /api/management/courses/{id}/sections/reorder` | مختلف ⚠️ |
| **عناصر القسم** | ❌ غير موجود | `POST /api/management/courses/{id}/sections/{id}/items` | ناقص في الفرونت ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **جلب الفيديو** | ❌ غير موجود | `GET /api/courses/{id}/videos/{id}` | ناقص في الفرونت ❌ |
| **إنشاء فيديو** | ❌ غير موجود | `POST /api/courses/{id}/videos` | ناقص في الفرونت ❌ |
| **تحديث فيديو** | ❌ غير موجود | `PUT /api/courses/{id}/videos/{id}` | ناقص في الفرونت ❌ |
| **حذف فيديو** | ❌ غير موجود | `DELETE /api/courses/{id}/videos/{id}` | ناقص في الفرونت ❌ |
| **جلب مستند** | ❌ غير موجود | `GET /api/courses/{id}/documents/{id}` | ناقص في الفرونت ❌ |
| **إنشاء مستند** | ❌ غير موجود | `POST /api/courses/{id}/documents` | ناقص في الفرونت ❌ |
| **إنشاء اختبار** | ❌ غير موجود | `POST /api/courses/{id}/quizzes` | ناقص في الفرونت ❌ |
| **أسئلة الاختبار** | ❌ غير موجود | `POST /api/courses/{id}/quizzes/{id}/questions` | ناقص في الفرونت ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **السلة** | `GET /cart` | `GET /api/cart` | متطابق ✅ |
| **إضافة للسلة** | `POST /cart/items` | `POST /api/cart/items` | متطابق ✅ |
| **حذف من السلة** | `DELETE /cart/items/:id` | `DELETE /api/cart/items/{itemId}` | متطابق ✅ |
| **تفريغ السلة** | `DELETE /cart` | ❌ غير موجود | ناقص في الباك ❌ |
| **تطبيق كوبون** | `POST /cart/coupon` | `POST /api/cart/apply-coupon` | مختلف ⚠️ |
| **حذف كوبون** | ❌ غير موجود | `DELETE /api/cart/coupon` | ناقص في الفرونت ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **إنشاء طلب** | `POST /orders/checkout` | `POST /api/orders` | مختلف ⚠️ |
| **طلباتي** | `GET /orders` | `GET /api/orders` | متطابق ✅ |
| **تفاصيل الطلب** | `GET /orders/:id` | `GET /api/orders/{orderId}` | متطابق ✅ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **طرق الدفع** | `GET /payments/methods` | `GET /api/payments/methods` | متطابق ✅ |
| **نية الدفع** | `POST /payments/create-intent` | `POST /api/payments/process` | مختلف ⚠️ |
| **تأكيد الدفع** | `POST /payments/:id/confirm` | ❌ غير موجود | ناقص في الباك ❌ |
| **دفعات الطلب** | `GET /payments/order/:orderId` | `GET /api/payments/history/{orderId}` | مختلف ⚠️ |
| **الدفع الفردي** | `GET /payments/:id` | ❌ غير موجود | ناقص في الباك ❌ |
| **Webhook** | `POST /payments/webhook` | ❌ غير موجود | ناقص في الباك ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **تسجيلي** | `GET /enrollments` | `GET /api/enrollments` | متطابق ✅ |
| **تفاصيل التسجيل** | `GET /enrollments/:id` | `GET /api/enrollments/{id}` | متطابق ✅ |
| **التقدم** | `GET /enrollments/:id/progress` | `GET /api/enrollments/{id}/progress` | متطابق ✅ |
| **فحص التقدم** | `POST /enrollments/:id/check-progress` | ❌ غير موجود | ناقص في الباك ❌ |
| **إكمال تلقائي** | `POST /enrollments/:id/check-and-complete-if-eligible` | ❌ غير موجود | ناقص في الباك ❌ |
| **طلب إكمال** | `POST /enrollments/:id/request-completion` | ❌ غير موجود | ناقص في الباك ❌ |
| **تحديد منتهي** | `POST /enrollments/mark-expired` | ❌ غير موجود | ناقص في الباك ❌ |
| **تحديث التقدم** | ❌ غير موجود | `PUT /api/enrollments/{id}/progress` | ناقص في الفرونت ❌ |
| **إكمال محتوى** | ❌ غير موجود | `POST /api/enrollments/{id}/progress/{type}/{id}/complete` | ناقص في الفرونت ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **اختبارات الدرس** | `GET /quizzes/lesson/:id` | ❌ غير موجود بالشكل | مختلف ⚠️ |
| **تفاصيل الاختبار** | `GET /quizzes/:id` | ❌ غير موجود بالشكل | مختلف ⚠️ |
| **إرسال الإجابات** | `POST /quizzes/:id/submit` | ❌ غير موجود بالشكل | مختلف ⚠️ |
| **محاولاتي** | `GET /quizzes/attempts/my-attempts/:id` | ❌ غير موجود بالشكل | مختلف ⚠️ |
| **بدء محاولة** | ❌ غير موجود | `POST /api/enrollments/{id}/quizzes/{id}/attempts` | ناقص في الفرونت ❌ |
| **إرسال محاولة** | ❌ غير موجود | `PUT /api/enrollments/{id}/quizzes/{id}/attempts/{id}` | ناقص في الفرونت ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **إنشاء إشعار** | ❌ غير موجود | `POST /api/announcements` | ناقص في الفرونت ❌ |
| **تحديث إشعار** | ❌ غير موجود | `PUT /api/announcements/{id}` | ناقص في الفرونت ❌ |
| **تعطيل إشعار** | ❌ غير موجود | `PATCH /api/announcements/{id}/deactivate` | ناقص في الفرونت ❌ |
| **حذف إشعار** | ❌ غير موجود | `DELETE /api/announcements/{id}` | ناقص في الفرونت ❌ |
| **تغذية الإعلانات** | ❌ غير موجود | `GET /api/announcements/feed` | ناقص في الفرونت ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **إنشاء جلسة** | `POST /courses/:id/live-sessions` | `POST /api/courses/{id}/live-sessions` | متطابق ✅ |
| **جلسات الدورة** | `GET /courses/:id/live-sessions` | `GET /api/courses/{id}/live-sessions` | متطابق ✅ |
| **تحديث حالة** | `PUT /live-sessions/:id` | `PUT /api/courses/{id}/live-sessions/{id}/status` | مختلف ⚠️ |
| **حذف جلسة** | `DELETE /live-sessions/:id` | `DELETE /api/courses/{id}/live-sessions/{id}` | مختلف ⚠️ |
| **إلغاء** | `POST /live-sessions/:id/cancel` | ❌ غير موجود | ناقص في الباك ❌ |
| **بدء** | `POST /live-sessions/:id/start` | ❌ غير موجود | ناقص في الباك ❌ |
| **إنهاء** | `POST /live-sessions/:id/end` | ❌ غير موجود | ناقص في الباك ❌ |
| **انضمام** | `POST /live-sessions/:id/attendance/join` | `POST /api/live-sessions/{id}/attendance/join` | متطابق ✅ |
| **مغادرة** | ❌ غير موجود | `POST /api/live-sessions/{id}/attendance/leave` | ناقص في الفرونت ❌ |
| **عدد الحاضرين** | ❌ غير موجود | `GET /api/live-sessions/{id}/attendance/count` | ناقص في الفرونت ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **إرسال رسالة** | `POST /messages/send` | `POST /api/messages/send` | متطابق ✅ |
| **المحادثات** | `GET /messages/conversations` | `GET /api/messages/conversations` | متطابق ✅ |
| **محادثة محددة** | `GET /messages/conversations/:id` | `GET /api/messages/conversations/{id}` | متطابق ✅ |
| **تحديد مقروء** | `PUT /messages/read/:id` | `PATCH /api/messages/{id}/read` | مختلف ⚠️ |
| **حذف رسالة** | `DELETE /messages/:id` | `DELETE /api/messages/{id}` | متطابق ✅ |
| **عدد غير المقروءة** | ❌ غير موجود | `GET /api/messages/unread-count` | ناقص في الفرونت ❌ |
| **الرسائل الأخيرة** | `GET /messages/recent-messages` | ❌ غير موجود | ناقص في الباك ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **إشعاراتي** | `GET /notifications/my-notifications` | `GET /api/notifications` | مختلف ⚠️ |
| **عدد غير المقروءة** | `GET /notifications/unread-count` | `GET /api/notifications/unread-count` | متطابق ✅ |
| **تحديد مقروء** | `PUT /notifications/:id/read` | `PATCH /api/notifications/{id}/read` | مختلف ⚠️ |
| **تحديد الكل مقروء** | `PUT /notifications/mark-all-read` | `POST /api/notifications/mark-all-read` | مختلف ⚠️ |
| **حذف إشعار** | `DELETE /notifications/:id` | `DELETE /api/notifications/{id}` | متطابق ✅ |
| **مسح الكل** | ❌ غير موجود | `DELETE /api/notifications/clear-all` | ناقص في الفرونت ❌ |
| **تفضيلات** | `GET/PUT /notifications/preferences` | `GET/PUT /api/notifications/preferences` | متطابق ✅ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **إنشاء تقييم** | `POST /reviews/course/:id` | `POST /api/reviews` | مختلف ⚠️ |
| **تقييمات الدورة** | `GET /reviews/course/:id` | `GET /api/reviews/course/{id}` | متطابق ✅ |
| **تقييماتي** | `GET /reviews/user` | ❌ غير موجود | ناقص في الباك ❌ |
| **تحديث تقييم** | `PUT /reviews/:id` | `PUT /api/reviews/{id}` | متطابق ✅ |
| **حذف تقييم** | `DELETE /reviews/:id` | `DELETE /api/reviews/{id}` | متطابق ✅ |
| **تسجيل مفيد** | ❌ غير موجود | `POST /api/reviews/{id}/helpful` | ناقص في الفرونت ❌ |
| **إبلاغ تقييم** | ❌ غير موجود | `POST /api/reviews/{id}/flag` | ناقص في الفرونت ❌ |
| **مراجعات معلقة** | ❌ غير موجود | `GET /api/reviews/pending` | ناقص في الفرونت ❌ |
| **إدارة التقييمات** | ❌ غير موجود | `PUT /api/reviews/{id}/moderate` | ناقص في الفرونت ❌ |
| **دورات قابلة للتقييم** | `GET /reviews/reviewable-enrollments` | ❌ غير موجود | ناقص في الباك ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **شهاداتي** | `GET /certificates/my` | `GET /api/certificates/my` | متطابق ✅ |
| **تفاصيل الشهادة** | `GET /certificates/:id` | `GET /api/certificates/{id}` | متطابق ✅ |
| **تحميل PDF** | `GET /certificates/:id/download` | `GET /api/certificates/{id}/download` | متطابق ✅ |
| **التحقق** | `GET /certificates/verify/:code` | `GET /api/certificates/verify/{code}` | متطابق ✅ |
| **إلغاء شهادة** | ❌ غير موجود | `POST /api/admin/certificates/{id}/revoke` | ناقص في الفرونت ❌ |
| **إصدار شهادة** | ❌ غير موجود | `POST /api/admin/certificates/issue` | ناقص في الفرونت ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **قائمة الأمنيات** | `GET /wishlist` | `GET /api/wishlist` | متطابق ✅ |
| **إضافة** | `POST /wishlist/:id` | `POST /api/wishlist/{id}` | متطابق ✅ |
| **حذف** | `DELETE /wishlist/:id` | `DELETE /api/wishlist/{id}` | متطابق ✅ |
| **فحص** | `GET /wishlist/check/:id` | ❌ غير موجود | ناقص في الباك ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **طلب استاد** | `POST /instructor-requests` | `POST /api/instructor-requests` | متطابق ✅ |
| **حالة الطلب** | `GET /instructor-requests/status` | `GET /api/instructor-requests/my-requests` | مختلف ⚠️ |
| **إلغاء طلب** | ❌ غير موجود | `DELETE /api/instructor-requests/{id}/cancel` | ناقص في الفرونت ❌ |
| **تحديث طلب** | ❌ غير موجود | `PUT /api/instructor-requests/{id}` | ناقص في الفرونت ❌ |
| **إضافة مستندات** | ❌ غير موجود | `POST /api/instructor-requests/{id}/documents` | ناقص في الفرونت ❌ |
| **طلباتي** | ❌ غير موجود | `GET /api/instructor-requests/my-requests` | ناقص في الفرونت ❌ |
| **تفاصيل طلب** | ❌ غير موجود | `GET /api/instructor-requests/my-requests/{id}` | ناقص في الفرونت ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **طلب استرداد** | `POST /refunds` | `POST /api/refunds` | متطابق ✅ |
| **طلباتي** | `GET /refunds/my` | `GET /api/refunds` | مختلف ⚠️ |
| **موافقة** | ❌ غير موجود | `POST /api/admin/refunds/approve` | ناقص في الفرونت ❌ |
| **رفض** | ❌ غير موجود | `POST /api/admin/refunds/reject` | ناقص في الفرونت ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **رفع ملف** | `POST /media/upload-url` | `POST /api/media/upload-url` | متطابق ✅ |
| **تأكيد الرفع** | `POST /media/confirm-upload` | `POST /api/media/confirm-upload` | متطابق ✅ |
| **رابط العرض** | `GET /media/file-url/:key` | `GET /api/media/{id}/view-url` | مختلف ⚠️ |
| **حذف** | `DELETE /media/:id` | ❌ غير موجود (Admin) | مختلف ⚠️ |
| **إحصائيات** | ❌ غير موجود | `GET /api/admin/media/stats` | ناقص في الفرونت ❌ |
| **استعادة** | ❌ غير موجود | `POST /api/admin/media/{id}/restore` | ناقص في الفرونت ❌ |

---

| الوظيفة | الفرونت (خدمة) | الباك (Controller) | الحالة |
|---------|---------------|-------------------|--------|
| **نظرة عامة طالب** | `GET /student/dashboard/overview` | `GET /api/student/dashboard/overview` | متطابق ✅ |
| **نظرة عامة استاد** | `GET /instructor/dashboard/overview` | `GET /api/instructor/dashboard/overview` | متطابق ✅ |
| **نظرة عامة مدير** | `GET /admin/dashboard/overview` | `GET /api/admin/dashboard/overview` | متطابق ✅ |
| **إيرادات الاستاد** | `GET /instructor/dashboard/revenue` | `GET /api/instructor/dashboard/revenue` | متطابق ✅ |
| **طلاب الاستاد** | `GET /instructor/dashboard/students` | `GET /api/instructor/dashboard/students` | متطابق ✅ |
| **شهادات الطالب** | `GET /student/dashboard/certificates` | `GET /api/student/dashboard/certificates` | متطابق ✅ |
| **أمنيات الطالب** | `GET /student/dashboard/wishlist` | ❌ غير موجود | ناقص في الباك ❌ |
| **دفعات الطالب** | `GET /student/dashboard/payments` | ❌ غير موجود | ناقص في الباك ❌ |
| **نشاط أسبوعي** | ❌ غير موجود | `GET /api/student/dashboard/weekly-activity` | ناقص في الفرونت ❌ |
| **دورات الاستاد** | ❌ غير موجود | `GET /api/instructor/dashboard/courses` | ناقص في الفرونت ❌ |
| **طلبات معلقة** | ❌ غير موجود | `GET /api/instructor/dashboard/pending-requests` | ناقص في الفرونت ❌ |
| **مراجعات حديثة** | ❌ غير موجود | `GET /api/instructor/dashboard/recent-reviews` | ناقص في الفرونت ❌ |
| **إيرادات المدير** | ❌ غير موجود | `GET /api/admin/dashboard/revenue` | ناقص في الفرونت ❌ |
| **نمو المستخدمين** | ❌ غير موجود | `GET /api/admin/dashboard/user-growth` | ناقص في الفرونت ❌ |
| **اتجاه التسجيل** | ❌ غير موجود | `GET /api/admin/dashboard/enrollment-trend` | ناقص في الفرونت ❌ |
| **أفضل الدورات** | ❌ غير موجود | `GET /api/admin/dashboard/top-courses` | ناقص في الفرونت ❌ |

---

## 4. ما هو موجود في الباك إند فقط (ناقص في الفرونت)

### 4.1 نقاط نهاية غير مستخدمة

| النقطة | الوصف |
|--------|-------|
| `POST /api/auth/send-2fa` | إرسال رمز 2FA |
| `POST /api/auth/login-2fa` | دخول بـ 2FA |
| `POST /api/auth/enable-2fa` | تفعيل 2FA |
| `POST /api/auth/disable-2fa` | تعطيل 2FA |
| `POST /api/auth/logout-all` | تسجيل خروج من كل الجلسات |
| `POST /api/profile/picture` | رفع صورة الملف الشخصي |
| `DELETE /api/profile/picture` | حذف صورة الملف الشخصي |
| `GET /api/public/stats` | إحصائيات المنصة |
| `GET /api/public/about` | محتوى صفحة عن المنصة |
| `GET /api/public/legal/{type}` | الصفحات القانونية |
| `GET /api/public/courses/search/suggest` | اقتراحات البحث |
| `GET /api/public/courses/filters/options` | خيارات الفلتر |
| `GET /api/public/courses/slug/{slug}` | الدورة بالـ slug |
| `GET /api/public/instructors/check-slug` | فحص توفر الـ slug |
| `GET /api/public/instructors/search` | بحث عن الاستاذاة |
| `POST /api/public/testimonials` | إرسال شهادة |
| `POST /api/management/courses/{id}/requirements` | إضافة متطلب |
| `DELETE /api/management/courses/{id}/requirements/{id}` | حذف متطلب |
| `POST /api/management/courses/{id}/outcomes` | إضافة نتيجة تعلم |
| `DELETE /api/management/courses/{id}/outcomes/{id}` | حذف نتيجة تعلم |
| `POST /api/management/courses/{id}/submit-for-review` | إرسال للمراجعة |
| `POST /api/management/courses/{id}/schedule-deletion` | جدولة حذف |
| `POST /api/management/courses/{id}/cancel-scheduled-deletion` | إلغاء جدولة الحذف |
| `GET /api/management/courses/{id}/deletion-status` | حالة الحذف |
| `PUT /api/management/courses/{id}/image` | رفع صورة الدورة |
| `POST /api/management/courses/{id}/sections/{id}/items` | إضافة عنصر للقسم |
| `PUT /api/management/courses/{id}/sections/{id}/items/{id}` | تحديث عنصر |
| `DELETE /api/management/courses/{id}/sections/{id}/items/{id}` | حذف عنصر |
| `PUT /api/management/courses/{id}/sections/{id}/items/reorder` | إعادة ترتيب العناصر |
| `GET /api/courses/{id}/videos/{id}` | جلب فيديو |
| `POST /api/courses/{id}/videos` | إنشاء فيديو |
| `PUT /api/courses/{id}/videos/{id}` | تحديث فيديو |
| `DELETE /api/courses/{id}/videos/{id}` | حذف فيديو |
| `GET /api/courses/{id}/documents/{id}` | جلب مستند |
| `POST /api/courses/{id}/documents` | إنشاء مستند |
| `PUT /api/courses/{id}/documents/{id}` | تحديث مستند |
| `DELETE /api/courses/{id}/documents/{id}` | حذف مستند |
| `POST /api/courses/{id}/quizzes` | إنشاء اختبار |
| `GET /api/courses/{id}/quizzes/{id}` | تفاصيل اختبار |
| `PUT /api/courses/{id}/quizzes/{id}` | تحديث اختبار |
| `DELETE /api/courses/{id}/quizzes/{id}` | حذف اختبار |
| `POST /api/courses/{id}/quizzes/{id}/questions` | إضافة سؤال |
| `PUT /api/courses/{id}/quizzes/{id}/questions/{id}` | تحديث سؤال |
| `DELETE /api/courses/{id}/quizzes/{id}/questions/{id}` | حذف سؤال |
| `POST /api/enrollments/{id}/quizzes/{id}/attempts` | بدء محاولة |
| `PUT /api/enrollments/{id}/quizzes/{id}/attempts/{id}` | إرسال محاولة |
| `GET /api/enrollments/{id}/quizzes/{id}/attempts` | محاولاتي |
| `PUT /api/enrollments/{id}/progress` | تحديث التقدم |
| `POST /api/enrollments/{id}/progress/{type}/{id}/complete` | إكمال محتوى |
| `POST /api/cart/coupon` (DELETE) | حذف كوبون من السلة |
| `POST /api/announcements` | إنشاء إعلان (Admin) |
| `PUT /api/announcements/{id}` | تحديث إعلان (Admin) |
| `PATCH /api/announcements/{id}/deactivate` | تعطيل إعلان |
| `DELETE /api/announcements/{id}` | حذف إعلان |
| `GET /api/announcements/feed` | تغذية الإعلانات |
| `POST /api/live-sessions/{id}/cancel` | إلغاء جلسة |
| `POST /api/live-sessions/{id}/start` | بدء جلسة |
| `POST /api/live-sessions/{id}/end` | إنهاء جلسة |
| `POST /api/live-sessions/{id}/attendance/leave` | مغادرة جلسة |
| `GET /api/live-sessions/{id}/attendance/count` | عدد الحاضرين |
| `GET /api/messages/unread-count` | عدد الرسائل غير المقروءة |
| `DELETE /api/notifications/clear-all` | مسح كل الإشعارات |
| `POST /api/reviews/{id}/helpful` | تسجيل مفيد |
| `POST /api/reviews/{id}/flag` | إبلاغ تقييم |
| `GET /api/reviews/pending` | تقييمات معلقة |
| `PUT /api/reviews/{id}/moderate` | إدارة التقييمات |
| `POST /api/admin/certificates/{id}/revoke` | إلغاء شهادة |
| `POST /api/admin/certificates/issue` | إصدار شهادة |
| `GET /api/videos/{id}/comments` | تعليقات الفيديو |
| `POST /api/videos/{id}/comments` | إضافة تعليق |
| `PUT /api/videos/{id}/comments/{id}` | تحديث تعليق |
| `DELETE /api/videos/{id}/comments/{id}` | حذف تعليق |
| `POST /api/videos/{id}/comments/{id}/like` | إعجاب بتعليق |
| `GET /api/system-settings` | إعدادات النظام |
| `GET /api/system-settings/{key}` | إعداد محدد |
| `POST /api/system-settings` | إنشاء إعداد |
| `PUT /api/system-settings/{key}` | تحديث إعداد |
| `DELETE /api/system-settings/{key}` | حذف إعداد |
| `GET /api/activity-logs` | سجل النشاطات |
| `POST /api/reports` | إنشاء تقرير |
| `GET /api/reports/pending` | تقارير معلقة |
| `PATCH /api/reports/{id}/resolve` | حل تقرير |
| `POST /api/coupons/validate` | التحقق من الكوبون |
| `GET /api/admin/coupons/{id}` | تفاصيل كوبون |
| `PUT /api/admin/coupons/{id}` | تحديث كوبون |
| `GET /api/admin/users/{id}` | تفاصيل مستخدم |
| `DELETE /api/admin/users/{id}` | حذف مستخدم |
| `POST /api/admin/courses/{id}/reject` | رفض دورة |
| `GET /api/admin/courses/edit-requests` | طلبات تعديل |
| `GET /api/admin/courses/edit-requests/{id}` | تفاصيل طلب تعديل |
| `POST /api/admin/courses/edit-requests/{id}/review` | مراجعة طلب تعديل |
| `GET /api/admin/certificates` | كل الشهادات |
| `GET /api/instructor-requests/can-submit` | هل يمكن التقديم |
| `GET /api/instructor-requests/{id}` | تفاصيل طلب (Admin) |
| `PUT /api/instructor-requests/{id}/process` | معالجة طلب (Admin) |
| `DELETE /api/instructor-requests/{id}` | حذف طلب (Admin) |
| `GET /health` | فحص الصحة |
| `GET /healthz` | فحص الحياة |
| `GET /ready` | فحص الجاهزية |

### 4.2 خدمات الباك إند غير المستخدمة بالكامل

| الخدمة | الوصف |
|--------|-------|
| `IObjectStorage` | MinIO - تخزين الملفات |
| `IVideoProcessingService` | معالجة الفيديو |
| `IVideoCommentService` | تعليقات الفيديو |
| `IContactService` | نموذج الاتصال (مختلف) |
| `ILegalPageService` | الصفحات القانونية |
| `ITestimonialService` | الشهادات |
| `IReportService` | نظام الإبلاغ |
| `IActivityLogService` | سجل النشاطات |
| `ISystemSettingService` | إعدادات النظام |
| `IEmailService` | إرسال البريد الإلكتروني |

### 4.3 مكونات الباك إند غير المستخدمة

| المكون | الوصف |
|--------|-------|
| `VideoProcessingWorker` | عامل معالجة الفيديو |
| `EditRequestCleanupService` | تنظيف الطلبات المنتهية |
| `ScheduledDeletionService` | الحذف المجدول |

---

## 5. ما هو موجود في الفرونت إند فقط (ناقص في الباك)

### 5.1 نقاط نهاية غير مدعومة

| النقطة | الوصف |
|--------|-------|
| `POST /auth/send-2fa` | إرسال رمز 2FA |
| `POST /auth/login-2fa` | دخول بـ 2FA |
| `POST /auth/enable-2fa` | تفعيل 2FA |
| `POST /auth/disable-2fa` | تعطيل 2FA |
| `DELETE /auth/sessions/:id` | حذف جلسة محددة |
| `DELETE /cart` | تفريغ السلة بالكامل |
| `POST /payments/create-intent` | إنشاء نية الدفع (Stripe) |
| `POST /payments/:id/confirm` | تأكيد الدفع |
| `GET /payments/:id` | تفاصيل الدفع |
| `POST /payments/webhook` | Webhook للدفع |
| `POST /enrollments/:id/check-progress` | فحص التقدم |
| `POST /enrollments/:id/check-and-complete-if-eligible` | إكمال تلقائي |
| `POST /enrollments/:id/request-completion` | طلب إكمال |
| `POST /enrollments/mark-expired` | تحديد منتهي |
| `GET /courses/:id/instructor` | معلومات الاستاد |
| `PUT /courses/:id/publish` | نشر الدورة |
| `PUT /courses/:id/archive` | أرشفة الدورة |
| `DELETE /courses/:id/delete-image` | حذف صورة الدورة |
| `GET /quizzes/lesson/:id` | اختبارات الدرس |
| `GET /quizzes/:id` | تفاصيل الاختبار |
| `POST /quizzes/:id/submit` | إرسال الإجابات |
| `GET /quizzes/attempts/my-attempts/:id` | محاولاتي |
| `GET /student/dashboard/wishlist` | أمنيات الطالب |
| `GET /student/dashboard/payments` | دفعات الطالب |
| `GET /reviews/reviewable-enrollments` | دورات قابلة للتقييم |
| `GET /wishlist/check/:id` | فحص إذا في الأمنيات |
| `GET /notifications/my-notifications` | إشعاراتي |
| `POST /notifications/check-completion/:id` | فحص إكمال التسجيل |
| `GET /messages/recent-messages` | الرسائل الأخيرة |
| `POST /live-sessions/:id/cancel` | إلغاء جلسة |
| `POST /live-sessions/:id/start` | بدء جلسة |
| `POST /live-sessions/:id/end` | إنهاء جلسة |
| `GET /live-sessions/student/upcoming` | جلسات الطالب القادمة |
| `GET /live-sessions/scheduled` | جلسات مجدولة |
| `GET /live-sessions/enrolled-upcoming` | جلسات مسجل فيها |

### 5.2 مكونات الفرونت غير المدعومة بالكامل

| المكون | الوصف |
|--------|-------|
| `LearningRoom` | غرفة التعلم (مشاهدة الدورات) |
| `QuizTaking` | نظام الاختبار التفاعلي |
| `MessagingCenter` | مركز الرسائل |
| `ManuscriptCertificate` | بطاقة الشهادة المزخرفة |
| `ThemeSettingsPopover` | إعدادات الثيمات |
| `CartDrawer` | سلة المشتريات المنزلقة |
| 10 ثيمات | نظام الثيمات الكامل |

---

## 6. ما هو ناقص في كليهما

### 6.1 ميزات ناقصة في الباك والفرونت

| الميزة | الوصف | الأولوية |
|--------|-------|---------|
| **نظام الإبلاغ** | الإبلاغ عن محتوى مخالف (موجود في الباك لكن غير مستخدم في الفرونت) | متوسطة |
| **تعليقات الفيديو** | تعليقات على محاضرات الفيديو (موجود في الباك لكن غير مستخدم في الفرونت) | متوسطة |
| **إعدادات النظام** | إدارة إعدادات المنصة من الواجهة (موجود في الباك لكن غير مستخدم في الفرونت) | منخفضة |
| **سجل النشاطات** | عرض سجل النشاطات للمدير (موجود في الباك لكن غير مستخدم في الفرونت) | منخفضة |
| **البحث المتقدم** | اقتراحات البحث وخيارات الفلتر (موجود في الباك لكن غير مستخدم في الفرونت) | عالية |
| **الصفحات القانونية** | عرض سياسة الخصوصية والشروط (موجود في الباك لكن غير مستخدم في الفرونت) | متوسطة |
| **نظام 2FA** | المصادقة الثنائية (موجود في الفرونت لكن غير موجود في الباك) | عالية |
| **معالجة الفيديو** | معالجة وتحويل الفيديو (موجود في الباك لكن غير مستخدم في الفرونت) | منخفضة |

---

## 7. كيف يتشابك المشروعان معاً

### 7.1 تدفق البيانات

```
┌─────────────────────────────────────────────────────────────┐
│                    الفرونت إند (React)                      │
│                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  الصفحة  │───▶│  Axios   │───▶│ React    │              │
│  │  الرئيسية│    │  Client  │    │ Query    │              │
│  └──────────┘    └────┬─────┘    └──────────┘              │
│                       │                                     │
│                       │ HTTP Requests                       │
│                       │ + Bearer Token                      │
└───────────────────────┼─────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────┼─────────────────────────────────────┐
│                    الباك إند (.NET)                          │
│                       │                                     │
│  ┌──────────┐    ┌────▼─────┐    ┌──────────┐              │
│  │  SignalR │◀───│Controller│───▶│ Service  │              │
│  │   Hubs   │    │          │    │  Layer   │              │
│  └──────────┘    └──────────┘    └────┬─────┘              │
│                                       │                     │
│                                       ▼                     │
│                                ┌──────────┐                 │
│                                │ EF Core  │                 │
│                                │    +     │                 │
│                                │ SQL Server│                │
│                                └──────────┘                 │
│                                                             │
│                                ┌──────────┐                 │
│                                │   MinIO  │                 │
│                                │ (ملفات)  │                 │
│                                └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 تدفق المصادقة

```
1. المستخدم يدخل بيانات الدخول في الفرونت
   ↓
2. الفرونت يرسل POST /api/auth/login
   ↓
3. الباك يتحقق ويرجع JWT tokens
   ↓
4. الفرونت يخزن التوكنات في SessionStorage
   ↓
5. كل طلب لاحق من الفرونت يُرفق Bearer Token
   ↓
6. الباك يتحقق من التوكن في Middleware
   ↓
7. عند انتهاء الصلاحية (401):
   a. الفرونت يرسل POST /api/auth/refresh
   b. الباك يُعيد توكن جديد
   c. الفرونت يُعاد محاولة الطلب الأصلي
```

### 7.3 تدفق الإشعارات الفورية

```
1. الفرونت يفتح اتصال SignalR
   ↓
2. الباك يُسجل الاتصال في Hub
   ↓
3. عند حدث جديد (رسالة، إشعار):
   a. الباك يرسل البيانات عبر الاتصال
   b. الفرونت يستقبل البيانات فوراً
   c. الفرونت يحدث واجهة المستخدم
```

### 7.4 تدفق رفع الوسائط

```
1. الفرونت يطلب رابط رفع: POST /api/media/upload-url
   ↓
2. الباك يُرجع Pre-signed URL من MinIO
   ↓
3. الفرونت يرفع الملف مباشرة لـ MinIO
   ↓
4. الفرونت يُؤكد الرفع: POST /api/media/confirm-upload
   ↓
5. الباك يحفظ معلومات الملف في قاعدة البيانات
```

### 7.5 تدفق الشراء

```
1. الفرونت: إضافة للسلة → POST /api/cart/items
2. الفرونت: تطبيق كوبون → POST /api/cart/apply-coupon
3. الفرونت: إنشاء طلب → POST /api/orders
4. الفرونت: الدفع → POST /api/payments/process
5. الباك: معالجة الدفع وتحديث حالة الطلب
6. الباك: إنشاء التسجيل في الدورة
7. الفرونت: عرض النجاح
```

---

## 8. توافق نقاط النهاية

### 8.1 ملخص التوافق

| الفئة | متطابق | مختلف | ناقص في الفرونت | ناقص في الباك |
|-------|--------|-------|----------------|--------------|
| **المصادقة** | 8 | 3 | 0 | 5 |
| **الملف الشخصي** | 0 | 8 | 2 | 0 |
| **الدورات العامة** | 3 | 2 | 4 | 1 |
| **إدارة الدورات** | 1 | 5 | 6 | 1 |
| **الأقسام** | 0 | 5 | 1 | 0 |
| **المحتوى** | 0 | 0 | 12 | 0 |
| **السلة** | 3 | 1 | 1 | 1 |
| **الطلبات** | 2 | 1 | 0 | 0 |
| **المدفوعات** | 1 | 2 | 3 | 1 |
| **التسجيل** | 3 | 0 | 4 | 2 |
| **الامتحانات** | 0 | 2 | 2 | 4 |
| **الداشبورد** | 5 | 0 | 10 | 2 |
| **الإعلانات** | 0 | 0 | 5 | 0 |
| **الجلسات المباشرة** | 2 | 2 | 3 | 3 |
| **الرسائل** | 4 | 1 | 1 | 1 |
| **الإشعارات** | 3 | 2 | 1 | 1 |
| **المراجعات** | 3 | 1 | 4 | 1 |
| **الشهادات** | 4 | 0 | 2 | 0 |
| **قائمة الأمنيات** | 3 | 0 | 0 | 1 |
| **طلبات الاستاد** | 1 | 1 | 5 | 0 |
| **الاستردادات** | 1 | 1 | 2 | 0 |
| **الوسائط** | 2 | 1 | 1 | 2 |
| **المجموع** | **49** | **36** | **50** | **28** |

### 8.2 نسبة التوافق

- **نقاط النهاية المتطابقة:** 49/163 = **30%**
- **نقاط النهاية المختلفة:** 36/163 = **22%**
- **ناقص في الفرونت:** 50/163 = **31%**
- **ناقص في الباك:** 28/163 = **17%**

---

## 9. الفجوات والمطابقات

### 9.1 الفجوات الرئيسية

#### في الفرونت (يجب إضافتها):
1. **نظام 2FA** - دعم المصادقة الثنائية
2. **إدارة المحتوى** - رفع/تعديل الفيديو والمستندات والاختبارات
3. **البحث** - اقتراحات البحث وخيارات الفلتر
4. **الصفحات القانونية** - عرض الشروط والخصوصية
5. **تعليقات الفيديو** - نظام التعليقات على المحاضرات
6. **إدارة الإعلانات** - إنشاء/تعديل/حذف الإعلانات
7. **إحصائيات المنصة** - عرض إحصائيات عامة
8. **صورة الملف الشخصي** - رفع/حذف الصورة
9. **نظام الإبلاغ** - الإبلاغ عن محتوى مخالف
10. **إعدادات النظام** - إدارة إعدادات المنصة

#### في الباك (يجب إضافتها):
1. **تفريغ السلة** - حذف كل العناصر دفعة واحدة
2. **فحص التقدم** - فحص التقدم تلقائياً
3. **إكمال تلقائي** - إكمام الدورة عند استيفاء الشروط
4. **طلب إكمال** - طلب إكمام يدوياً
5. **تحديد منتهي** - تحديد الدورات المنتهية
6. **إلغاء الجلسة** - إلغاء جلسة مباشرة
7. **بدء/إنهاء الجلسة** - التحكم في حالة الجلسة
8. **مغادرة الجلسة** - تسجيل مغادرة المستخدم
9. **عدد الحاضرين** - عرض عدد المشاركين
10. **مسح الإشعارات** - حذف كل الإشعارات

### 9.2 الفجوات المشتركة (ناقص في كليهما)

1. **نظام الدفع الحقيقي** - الباك يستخدم Mock Payment Gateway
2. **معالجة الفيديو الحقيقية** - غير مكتملة
3. **نظام التقييم المتقدم** - غير متوفر بالكامل
4. **الإشعارات الفورية الحقيقية** - SignalR متوفر لكن غير مكتمل
5. **نظام التقارير** - غير متوفر في الفرونت

---

## 10. توصيات للتحسين

### 10.1 أولويات الفرونت

| الأولوية | التحسين | السبب |
|---------|--------|-------|
| عالية | إضافة نظام إدارة المحتوى | رفع وتعديل الدورات |
| عالية | إضافة البحث وخيارات الفلتر | تجربة مستخدم أفضل |
| عالية | إضافة صورة الملف الشخصي | ميزة أساسية |
| متوسطة | إضافة تعليقات الفيديو | تفاعل أكبر |
| متوسطة | إضافة الصفحات القانونية | متطلب قانوني |
| منخفضة | إضافة إعدادات النظام | للمدير فقط |

### 10.2 أولويات الباك

| الأولوية | التحسين | السبب |
|---------|--------|-------|
| عالية | إضافة نظام 2FA | أمان أعلى |
| عالية | إضافة فحص التقدم التلقائي | تجربة تعلم أفضل |
| متوسطة | إضافة التحكم في الجلسات المباشرة | إدارة أفضل |
| متوسطة | إضافة تفريغ السلة | سهولة الاستخدام |
| منخفضة | إضافة مسح الإشعارات | تنظيم أفضل |

### 10.3 تحسينات مشتركة

1. **توحيد مسارات API** - توحيد أسماء نقاط النهاية بين الفرونت والباك
2. **إكمال نظام الدفع** - ربط بوابة دفع حقيقية
3. **تحسين معالجة الأخطاء** - معالجة موحدة لجميع الأخطاء
4. **إضافة الاختبارات الشاملة** - اختبارات للباك إند
5. **تحسين الوثائق** - توحيد صيغ التوثيق

---

## ملخص نهائي

| البند | القيمة |
|-------|--------|
| **نسبة التوافق** | 30% متطابق + 22% مختلف = 52% متوافق جزئياً |
| **الفجوات الرئيسية** | 50 نقطة ناقصة في الفرونت + 28 نقطة ناقصة في الباك |
| **أكبر فجوة** | نظام إدارة المحتوى (12 نقطة ناقصة في الفرونت) |
| **أكبر تطابق** | نظام المصادقة والداشبورد (8+5 نقاط متطابقة) |
| **التحسين الأهم** | توحيد مسارات API وإكمال نظام الدفع |

---

*تم إنشاء هذا التقرير بتاريخ: 2026-06-24*
