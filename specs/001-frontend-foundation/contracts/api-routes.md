# API Contracts: Frontend Foundation — All 22 Service Files

**Date**: 2026-06-22
**Spec**: [spec.md](./spec.md)

## Base URL

```
https://atharyapi.runasp.net
```

All routes prefixed with `/api/v1/`. Cookies (`auth-token`, `refresh-token`) are attached automatically via Axios `withCredentials: true`.

---

## 1. AuthService (`auth.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `login(data)` | POST | `/auth/login` | ❌ | `LoginRequest` | `ApiResponse<AuthResponse>` |
| `register(data)` | POST | `/auth/register` | ❌ | `RegisterRequest` | `ApiResponse<{ userId: string; token: string; refreshToken: string; expiration: string }>` |
| `logout()` | POST | `/auth/logout` | ✅ | — | `ApiResponse` |
| `refreshToken()` | POST | `/auth/refresh` | ❌ | — | `ApiResponse<{ accessToken: string; refreshToken: string; expiresAt: string }>` |
| `loginWithOAuth(data)` | POST | `/auth/loginWithOAuth` | ❌ | `OAuthLoginRequest` | `ApiResponse<AuthResponse>` |
| `confirmEmail(userId, token)` | GET | `/auth/confirm-email` | ❌ | Query params | `ApiResponse` |
| `resendConfirmation(email)` | POST | `/auth/resend-confirmation-email` | ❌ | `ResendConfirmationRequest` | `ApiResponse` |
| `forgotPassword(email)` | POST | `/auth/forgot-password` | ❌ | `ForgotPasswordRequest` | `ApiResponse` |
| `resetPassword(data)` | POST | `/auth/reset-password` | ❌ | `ResetPasswordRequest` | `ApiResponse` |
| `changePassword(data)` | POST | `/auth/change-password` | ✅ | `ChangePasswordRequest` | `ApiResponse` |
| `send2FA(code)` | POST | `/auth/send-2fa` | ❌ | `SendTwoFactorCodeRequest` | `ApiResponse` |
| `loginWith2FA(data)` | POST | `/auth/login-2fa` | ❌ | `LoginTwoFactorRequest` | `ApiResponse<AuthResponse>` |
| `enable2FA()` | POST | `/auth/enable-2fa` | ✅ | — | `ApiResponse<Enable2faResponse>` |
| `disable2FA(code)` | POST | `/auth/disable-2fa` | ✅ | `Disable2faRequest` | `ApiResponse` |
| `getActiveSessions()` | GET | `/auth/sessions` | ✅ | — | `ApiResponse<SessionDto[]>` |
| `revokeSession(id)` | DELETE | `/auth/sessions/:id` | ✅ | — | `ApiResponse` |
| `revokeAllSessions()` | DELETE | `/auth/revoke-all-sessions` | ✅ | — | `ApiResponse` |

## 2. PublicService (`public.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getCourses(filters?)` | GET | `/public/courses` | ❌ | `PublicCourseFilterDto` | `ApiResponse<PagedList<PublicCourseDto>>` |
| `getCourseDetail(id)` | GET | `/public/courses/:id` | ❌ | — | `ApiResponse<PublicCourseDetailDto>` |
| `getRelatedCourses(id)` | GET | `/public/courses/:id/related-courses` | ❌ | — | `ApiResponse<PublicCourseDto[]>` |
| `getCourseSections(id)` | GET | `/public/courses/:id/curriculum/sections` | ❌ | — | `ApiResponse<CourseSectionResponseDto[]>` |
| `getCourseFaq(id)` | GET | `/public/courses/:id/faq` | ❌ | — | `ApiResponse<CourseFaqDto[]>` |
| `getPublicProfile(slug)` | GET | `/public/profiles/:slug` | ❌ | — | `ApiResponse<PublicProfileDto>` |
| `getPublicProfileById(id)` | GET | `/public/profiles/id/:id` | ❌ | — | `ApiResponse<PublicProfileDto>` |
| `getPublicCourses(instructorId)` | GET | `/public/instructor/courses/:instructorId` | ❌ | — | `ApiResponse<PublicCourseDto[]>` |
| `getTestimonials()` | GET | `/public/testimonials` | ❌ | — | `ApiResponse` |
| `getLanding()` | GET | `/public/landing` | ❌ | — | `ApiResponse<LandingDto>` |

## 3. InstructorRequestService (`instructorRequest.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `submit(data)` | POST | `/instructor-requests` | ❌ | `SubmitInstructorRequestDto` | `ApiResponse<InstructorRequestResponseDto>` |
| `getStatus()` | GET | `/instructor-requests/status` | ✅ | — | `ApiResponse<InstructorRequestResponseDto>` |

## 4. CourseService (`course.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getAdminCourses(filters?)` | GET | `/courses` | ✅ | `GetCoursesFilterDto` | `ApiResponse<PagedList<CourseResponseDto>>` |
| `getInstructorCourses(filters?)` | GET | `/courses/instructor-courses` | ✅ | `GetCoursesFilterDto` | `ApiResponse<PagedList<CourseResponseDto>>` |
| `getInstructorCoursesPublic(instructorId)` | GET | `/courses/instructor-courses/:instructorId` | ❌ | — | `ApiResponse<CourseResponseDto[]>` |
| `getCourseDetail(id)` | GET | `/courses/:id` | ✅ | — | `ApiResponse<CourseDetailResponseDto>` |
| `getInstructorCourseDetail(id)` | GET | `/courses/:id/instructor` | ✅ | — | `ApiResponse<CourseDetailResponseDto>` |
| `createCourse(data)` | POST | `/courses` | ✅ | `CreateCourseRequestDto` | `ApiResponse<CourseResponseDto>` |
| `updateCourse(id, data)` | PUT | `/courses/:id` | ✅ | `UpdateCourseRequestDto` | `ApiResponse` |
| `publishCourse(id)` | PUT | `/courses/:id/publish` | ✅ | — | `ApiResponse<CourseResponseDto>` |
| `archiveCourse(id)` | PUT | `/courses/:id/archive` | ✅ | — | `ApiResponse` |
| `deleteCourse(id)` | DELETE | `/courses/:id` | ✅ | — | `ApiResponse` |
| `deleteImage(id)` | DELETE | `/courses/:id/delete-image` | ✅ | — | `ApiResponse` |

## 5. CourseAdminService (`courseAdmin.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `approveCourse(id)` | PUT | `/admin/courses/:id/approve` | ✅ | — | `ApiResponse` |
| `rejectCourse(id, data)` | PUT | `/admin/courses/:id/reject` | ✅ | `RejectCourseRequest` | `ApiResponse` |
| `archiveCourse(id)` | PUT | `/admin/courses/:id/archive` | ✅ | — | `ApiResponse` |
| `updateFeaturedStatus(id, data)` | PUT | `/admin/courses/:id/featured` | ✅ | `UpdateCourseFeaturedStatusRequest` | `ApiResponse` |

## 6. CurriculumService (`curriculum.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getCourseSections(id)` | GET | `/courses/:id/curriculum/sections` | ✅ | — | `ApiResponse<SectionResponseDto[]>` |
| `createSection(id, data)` | POST | `/courses/:id/curriculum/sections` | ✅ | `CreateSectionRequest` | `ApiResponse<SectionResponseDto>` |
| `updateSection(id, data)` | PUT | `/courses/:courseId/curriculum/sections/:sectionId` | ✅ | `UpdateSectionRequest` | `ApiResponse` |
| `deleteSection(id)` | DELETE | `/courses/:courseId/curriculum/sections/:sectionId` | ✅ | — | `ApiResponse` |
| `updateSectionsOrder(id, data)` | PUT | `/courses/:id/curriculum/sections/order` | ✅ | `UpdateSectionsOrderRequest` | `ApiResponse` |

## 7. CategoryService (`category.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getCategories()` | GET | `/categories` | ❌ | — | `ApiResponse<CategoryResponseDto[]>` |
| `createCategory(data)` | POST | `/categories` | ✅ | `CreateCategoryRequest` | `ApiResponse<CategoryResponseDto>` |
| `updateCategory(id, data)` | PUT | `/categories/:id` | ✅ | `UpdateCategoryRequest` | `ApiResponse` |
| `deleteCategory(id)` | DELETE | `/categories/:id` | ✅ | — | `ApiResponse` |

## 8. EnrollmentService (`enrollment.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getEnrollments()` | GET | `/enrollments` | ✅ | — | `ApiResponse<EnrollmentResponseDto[]>` |
| `getCourseEnrollments(id)` | GET | `/enrollments/course/:courseId` | ✅ | — | `ApiResponse<EnrollmentResponseDto[]>` |
| `getStudentEnrollments(id)` | GET | `/enrollments/student/:studentId` | ✅ | — | `ApiResponse<EnrollmentResponseDto[]>` |
| `getEnrollmentDetail(id)` | GET | `/enrollments/:id` | ✅ | — | `ApiResponse<EnrollmentResponseDto>` |
| `getEnrollmentProgress(id)` | GET | `/enrollments/:id/progress` | ✅ | — | `ApiResponse<EnrollmentProgressResponse>` |
| `checkProgress(id)` | POST | `/enrollments/:id/check-progress` | ✅ | — | `ApiResponse` |
| `checkAndCompleteIfEligible(id)` | POST | `/enrollments/:id/check-and-complete-if-eligible` | ✅ | — | `ApiResponse` |
| `requestCompletion(id)` | POST | `/enrollments/:id/request-completion` | ✅ | — | `ApiResponse` |
| `markExpired()` | POST | `/enrollments/mark-expired` | ✅ | — | `ApiResponse` |

## 9. CartService (`cart.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getCart()` | GET | `/cart` | ✅ | — | `ApiResponse<CartResponseDto>` |
| `addItem(courseId)` | POST | `/cart/items` | ✅ | `AddCartItemRequest` | `ApiResponse<CartResponseDto>` |
| `removeItem(courseId)` | DELETE | `/cart/items/:courseId` | ✅ | — | `ApiResponse<CartResponseDto>` |
| `clearCart()` | DELETE | `/cart` | ✅ | — | `ApiResponse` |
| `applyCoupon(code)` | POST | `/cart/coupon` | ✅ | `ApplyCouponRequest` | `ApiResponse<ApplyCouponResponse>` |

## 10. OrderService (`order.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `checkout(data)` | POST | `/orders/checkout` | ✅ | `CheckoutRequest` | `ApiResponse<OrderDetailDto>` |
| `getOrders()` | GET | `/orders` | ✅ | — | `ApiResponse<OrderResponseDto[]>` |
| `getOrderDetail(id)` | GET | `/orders/:id` | ✅ | — | `ApiResponse<OrderDetailDto>` |

## 11. PaymentService (`payment.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getPaymentMethods()` | GET | `/payments/methods` | ✅ | — | `ApiResponse<PaymentMethodResponse[]>` |
| `createPaymentIntent(orderId, methodId)` | POST | `/payments/create-intent` | ✅ | `CreatePaymentIntentRequest` | `ApiResponse<PaymentIntentResponse>` |
| `confirmPayment(paymentId)` | POST | `/payments/:paymentId/confirm` | ✅ | — | `ApiResponse` |
| `getOrderPayments(orderId)` | GET | `/payments/order/:orderId` | ✅ | — | `ApiResponse<PaymentResponseDto[]>` |
| `getPaymentDetails(id)` | GET | `/payments/:id` | ✅ | — | `ApiResponse<PaymentResponseDto>` |
| `webhook(data)` | POST | `/payments/webhook` | ❌ | Webhook payload | `ApiResponse` |

## 12. QuizService (`quiz.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getQuizzes(lessonId)` | GET | `/quizzes/lesson/:lessonId` | ✅ | — | `ApiResponse<QuizResponseDto[]>` |
| `getQuizDetail(id)` | GET | `/quizzes/:id` | ✅ | — | `ApiResponse<QuizResponseDto>` |
| `submitAttempt(id, data)` | POST | `/quizzes/:id/submit` | ✅ | `SubmitQuizAttemptRequest` | `ApiResponse<QuizAttemptResultResponse>` |
| `getMyAttempts(lessonId)` | GET | `/quizzes/attempts/my-attempts/:lessonId` | ✅ | — | `ApiResponse<MyQuizAttemptResponse[]>` |
| `getQuizzesForStudent(lessonId)` | GET | `/quizzes/lesson/:lessonId/student` | ✅ | — | `ApiResponse` |

## 13. CertificateService (`certificate.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getMyCertificates()` | GET | `/certificates/my-certificates` | ✅ | — | `ApiResponse<CertificateResponse[]>` |
| `verify(code)` | GET | `/certificates/verify/:code` | ❌ | — | `ApiResponse<CertificateVerificationResponse>` |
| `getCertificateDetails(id)` | GET | `/certificates/:id` | ✅ | — | `ApiResponse<CertificateResponse>` |
| `getCertificatePDF(id, format?)` | GET | `/certificates/:id/pdf` | ✅ | Query: format | `Blob` |

## 14. NotificationService (`notification.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getMyNotifications()` | GET | `/notifications/my-notifications` | ✅ | — | `ApiResponse<NotificationDto[]>` |
| `getNotifications(params?)` | GET | `/notifications` | ✅ | Query params | `ApiResponse<PagedList<NotificationDto>>` |
| `getUnreadCount()` | GET | `/notifications/unread-count` | ✅ | — | `ApiResponse<number>` |
| `markAsRead(id)` | PUT | `/notifications/:id/read` | ✅ | — | `ApiResponse` |
| `markAllAsRead()` | PUT | `/notifications/mark-all-read` | ✅ | — | `ApiResponse` |
| `deleteNotification(id)` | DELETE | `/notifications/:id` | ✅ | — | `ApiResponse` |
| `getPreferences()` | GET | `/notifications/preferences` | ✅ | — | `ApiResponse<NotificationPreferencesDto>` |
| `updatePreferences(data)` | PUT | `/notifications/preferences` | ✅ | `UpdateNotificationPreferencesRequest` | `ApiResponse<NotificationPreferencesDto>` |
| `checkCompletion(id)` | GET | `/notifications/check-completion/:enrollmentId` | ✅ | — | `ApiResponse` |

## 15. MessageService (`message.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getConversations()` | GET | `/messages/conversations` | ✅ | — | `ApiResponse<ConversationResponse[]>` |
| `getConversationWithUser(userId)` | GET | `/messages/conversations/:userId` | ✅ | — | `ApiResponse<ConversationResponse>` |
| `getMessages(userId)` | GET | `/messages/:userId` | ✅ | — | `ApiResponse<MessageResponse[]>` |
| `getRecentMessages()` | GET | `/messages/recent-messages` | ✅ | — | `ApiResponse<MessageResponse[]>` |
| `send(data)` | POST | `/messages/send` | ✅ | `SendMessageRequest` | `ApiResponse<MessageResponse>` |
| `markAsRead(userId)` | PUT | `/messages/read/:userId` | ✅ | — | `ApiResponse` |
| `deleteMessage(id)` | DELETE | `/messages/:id` | ✅ | — | `ApiResponse` |

## 16. ProfileService (`profile.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getProfile()` | GET | `/profiles` | ✅ | — | `ApiResponse<ProfileDto>` |
| `updateProfile(data)` | PUT | `/profiles` | ✅ | `UpdateProfileRequest` | `ApiResponse<ProfileDto>` |
| `addPhone(data)` | POST | `/profiles/phones` | ✅ | `CreatePhoneRequest` | `ApiResponse<PhoneDto>` |
| `setDefaultPhone(phoneId)` | PUT | `/profiles/phones/:phoneId/default-phone` | ✅ | — | `ApiResponse` |
| `deletePhone(phoneId)` | DELETE | `/profiles/phones/:phoneId` | ✅ | — | `ApiResponse` |
| `addAddress(data)` | POST | `/profiles/addresses` | ✅ | `CreateAddressRequest` | `ApiResponse<AddressDto>` |
| `setDefaultAddress(addressId)` | PUT | `/profiles/addresses/:addressId/default-address` | ✅ | — | `ApiResponse` |
| `deleteAddress(addressId)` | DELETE | `/profiles/addresses/:addressId` | ✅ | — | `ApiResponse` |
| `getPublicProfile(slug)` | GET | `/profiles/public/:slug` | ❌ | — | `ApiResponse<PublicProfileDto>` |
| `getPublicProfileById(id)` | GET | `/profiles/public/id/:id` | ❌ | — | `ApiResponse<PublicProfileDto>` |

## 17. DashboardService (`dashboard.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getStudentOverview()` | GET | `/dashboards/student/overview` | ✅ | — | `ApiResponse<StudentOverviewDto>` |
| `getInstructorOverview()` | GET | `/dashboards/instructor/overview` | ✅ | — | `ApiResponse<InstructorOverviewDto>` |
| `getAdminOverview()` | GET | `/dashboards/admin/overview` | ✅ | — | `ApiResponse<AdminOverviewDto>` |
| `getInstructorRevenue()` | GET | `/dashboards/instructor/revenue` | ✅ | — | `ApiResponse<InstructorRevenueDto>` |
| `getInstructorStudents()` | GET | `/dashboards/instructor/students` | ✅ | — | `ApiResponse<PagedList<InstructorStudentDto>>` |
| `getStudentCertificates()` | GET | `/dashboards/student/certificates` | ✅ | — | `ApiResponse<StudentCertificatesDto>` |
| `getStudentWishlist()` | GET | `/dashboards/student/wishlist` | ✅ | — | `ApiResponse<StudentWishlistDto>` |
| `getStudentPayments()` | GET | `/dashboards/student/payments` | ✅ | — | `ApiResponse<StudentPaymentsDto>` |

## 18. ReviewService (`review.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getCourseReviews(courseId)` | GET | `/reviews/course/:courseId` | ❌ | Query params | `ApiResponse<PagedList<ReviewResponse>>` |
| `getUserReviews()` | GET | `/reviews/user` | ✅ | — | `ApiResponse<ReviewDetailResponse[]>` |
| `createReview(courseId, data)` | POST | `/reviews/course/:courseId` | ✅ | `CreateReviewRequest` | `ApiResponse<ReviewResponse>` |
| `updateReview(reviewId, data)` | PUT | `/reviews/:reviewId` | ✅ | `UpdateReviewRequest` | `ApiResponse<ReviewResponse>` |
| `deleteReview(reviewId)` | DELETE | `/reviews/:reviewId` | ✅ | — | `ApiResponse` |
| `getReviewableEnrollments()` | GET | `/reviews/reviewable-enrollments` | ✅ | — | `ApiResponse<ReviewableEnrollment[]>` |

## 19. LiveSessionService (`liveSession.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getScheduledSessions()` | GET | `/livesessions/scheduled` | ✅ | — | `ApiResponse<LiveSessionResponseDto[]>` |
| `getEnrolledUpcoming()` | GET | `/livesessions/enrolled-upcoming` | ✅ | — | `ApiResponse<LiveSessionResponseDto[]>` |
| `getSessionsForCourse(courseId)` | GET | `/livesessions/course/:courseId` | ✅ | — | `ApiResponse<LiveSessionResponseDto[]>` |
| `getById(id)` | GET | `/livesessions/:id` | ✅ | — | `ApiResponse<LiveSessionResponseDto>` |
| `create(data)` | POST | `/livesessions` | ✅ | `CreateLiveSessionRequest` | `ApiResponse<LiveSessionResponseDto>` |
| `update(id, data)` | PUT | `/livesessions/:id` | ✅ | `UpdateLiveSessionRequest` | `ApiResponse<LiveSessionResponseDto>` |
| `delete(id)` | DELETE | `/livesessions/:id` | ✅ | — | `ApiResponse` |
| `cancel(id)` | POST | `/livesessions/:id/cancel` | ✅ | — | `ApiResponse<LiveSessionResponseDto>` |
| `start(id)` | POST | `/livesessions/:id/start` | ✅ | — | `ApiResponse<LiveSessionResponseDto>` |
| `end(id)` | POST | `/livesessions/:id/end` | ✅ | — | `ApiResponse<LiveSessionResponseDto>` |
| `join(id)` | POST | `/livesessions/:id/join` | ✅ | — | `ApiResponse<JoinLiveSessionResponse>` |
| `getUpcomingStudent()` | GET | `/livesessions/student/upcoming` | ✅ | — | `ApiResponse<LiveSessionResponseDto[]>` |

## 20. WishlistService (`wishlist.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getMyWishlist()` | GET | `/wishlist` | ✅ | — | `ApiResponse<WishlistResponseDto>` |
| `addToWishlist(courseId)` | POST | `/wishlist/:courseId` | ✅ | — | `ApiResponse` |
| `removeFromWishlist(courseId)` | DELETE | `/wishlist/:courseId` | ✅ | — | `ApiResponse` |
| `isInWishlist(courseId)` | GET | `/wishlist/check/:courseId` | ✅ | — | `ApiResponse<boolean>` |

## 21. AnnouncementService (`announcement.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getMyAnnouncements()` | GET | `/announcements/my-announcements` | ✅ | — | `ApiResponse<AnnouncementListResponse>` |
| `getAnnouncements(params?)` | GET | `/announcements` | ✅ | Query params | `ApiResponse<PagedList<AnnouncementResponse>>` |
| `getByUser(userId)` | GET | `/announcements/user/:userId` | ✅ | — | `ApiResponse<AnnouncementResponse[]>` |
| `getCourseAnnouncements(courseId)` | GET | `/announcements/course/:courseId` | ✅ | — | `ApiResponse<AnnouncementResponse[]>` |
| `getById(id)` | GET | `/announcements/:id` | ✅ | — | `ApiResponse<AnnouncementResponse>` |
| `create(data)` | POST | `/announcements` | ✅ | `CreateAnnouncementRequest` | `ApiResponse<AnnouncementResponse>` |
| `update(id, data)` | PUT | `/announcements/:id` | ✅ | `UpdateAnnouncementRequest` | `ApiResponse<AnnouncementResponse>` |
| `delete(id)` | DELETE | `/announcements/:id` | ✅ | — | `ApiResponse` |

## 22. MediaService (`media.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `getUploadUrl(data)` | POST | `/media/upload-url` | ✅ | `UploadUrlRequestDto` | `ApiResponse<MediaFileDto>` |
| `confirmUpload(data)` | POST | `/media/confirm-upload` | ✅ | `MediaConfirmUploadRequest` | `ApiResponse<MediaFileDto>` |
| `getFileByObjectId(id)` | GET | `/media/object-id/:id` | ✅ | — | `ApiResponse<MediaFileDto>` |
| `deleteMedia(id)` | DELETE | `/media/:id` | ✅ | — | `ApiResponse` |
| `getFileUrl(objectKey, fileName?)` | GET | `/media/file-url/:objectKey` | ✅ | Query params | `ApiResponse<MediaFileUrlResponse>` |
| `uploadFile(file)` | * | Presigned URL PUT | — | — | `MediaFileDto` |

> **`uploadFile` is a composite client-side method**: calls `getUploadUrl` → `PUT` to presigned URL → `confirmUpload`. Not a single HTTP endpoint.

## 23. ContactService (`contact.service.ts`)

| Method | HTTP | Route | Auth | Request | Response |
|--------|------|-------|------|---------|----------|
| `sendContactMessage(data)` | POST | `/contact` | ❌ | `ContactMessageDto` | `ApiResponse` |
