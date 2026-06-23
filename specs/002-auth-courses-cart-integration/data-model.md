# Data Model: Auth + Courses + Cart Integration

**Date**: 2026-06-23
**Feature**: 002-auth-courses-cart-integration

## Overview

This feature does NOT create new entities. It consumes existing backend entities through the 22 service files and 26 DTO type files already defined in Phase 1. The data model below documents the key entities and their relationships as they are consumed by the page components being rewritten.

## Entities

### User/Auth

**Source DTOs**: `auth.ts`, `profile.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` (GUID) | Branded type `UserId` |
| email | `string` | Required |
| fullName | `string` | Computed: `firstName + lastName` |
| profileImageUrl | `string?` | NOT `avatarUrl` |
| roles | `string[]` | `'Student' | 'Instructor' | 'Admin'` |
| isActive | `boolean` | |
| emailConfirmed | `boolean` | |

**Auth Tokens** (stored in HTTP-only cookies by backend):
- `accessToken` — JWT, short-lived (15min)
- `refreshToken` — long-lived, used for silent refresh
- `sessionId` — identifies the session for management

**State transitions**:
```
Unverified → Verified (email confirmation)
Active → Suspended (admin action)
Active → Deleted (soft delete)
```

---

### Course

**Source DTOs**: `course.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` (GUID) | Branded type `CourseId` |
| title | `string` | |
| slug | `string` | URL-friendly |
| description | `string?` | |
| courseImageUrl | `string?` | NOT `thumbnail` |
| price | `number` | 0 = free |
| isFree | `boolean` | Derived |
| level | `CourseLevel` | `'Beginner' | 'Intermediate' | 'Advanced'` |
| language | `CourseLanguage` | `'Ar' | 'En'` |
| categoryName | `string` | NOT `category: string` |
| categoryId | `string` | |
| instructorName | `string` | |
| averageRating | `number` | NOT `rating` |
| enrollmentCount | `number` | |
| totalDurationMinutes | `number` | NOT `duration: string` |
| sectionCount | `number` | |
| lessonCount | `number` | |

**State transitions**:
```
Draft → PendingReview → Published → Archived
```

---

### Enrollment

**Source DTOs**: `enrollment.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` (GUID) | |
| userId | `string` | |
| courseId | `string` | |
| courseTitle | `string` | |
| status | `EnrollmentStatus` | `'InProgress' | 'Completed' | 'Expired' | 'Refunded'` |
| progressPercentage | `number` | 0-100 |
| source | `EnrollmentSource` | `'Purchase' | 'Gift' | 'AdminGrant' | 'Coupon'` |

**State transitions**:
```
InProgress → Completed (all content done)
InProgress → Expired (access period elapsed)
InProgress → Refunded (refund processed)
```

---

### Cart

**Source DTOs**: `cart.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` (GUID) | |
| items | `CartItemDto[]` | Course items in cart |
| subtotal | `number` | Sum of item prices |
| couponCode | `string?` | Applied coupon |
| discountAmount | `number` | Coupon discount |
| finalAmount | `number` | subtotal - discountAmount |

**CartItem**:
| Field | Type |
|-------|------|
| id | `string` |
| courseId | `string` |
| courseTitle | `string` |
| courseImageUrl | `string?` |
| priceSnapshot | `number` |
| currentPrice | `number` |

---

### Order

**Source DTOs**: `order.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` (GUID) | |
| orderNumber | `string` | Human-readable |
| subtotal | `number` | |
| discountAmount | `number` | |
| finalAmount | `number` | |
| status | `string` | `'Pending' | 'Paid' | 'Failed' | 'Refunded'` |
| couponCode | `string?` | |
| items | `OrderItemDto[]` | |
| payments | `PaymentHistoryDto[]` | |

---

### Payment

**Source DTOs**: `payment.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` (GUID) | |
| orderId | `string` | |
| amount | `number` | |
| status | `string` | |
| gatewayTransactionId | `string?` | Tap payment ID |
| paymentMethodName | `string?` | |

**State transitions**:
```
Pending → Processing → Completed → Failed
Pending → Processing → Completed → Refunded
```

---

### Review

**Source DTOs**: `review.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` (GUID) | |
| userId | `string` | |
| userFullName | `string` | |
| courseId | `string` | |
| rating | `number` | 1-5 |
| comment | `string?` | |
| status | `string` | |
| isVerified | `boolean` | |

---

### Category

**Source DTOs**: `course.ts` (CategoryResponseDto)

| Field | Type | Notes |
|-------|------|-------|
| id | `string` (GUID) | |
| name | `string` | |
| description | `string?` | |
| slug | `string?` | |
| imageUrl | `string?` | |
| children | `CategoryResponseDto[]` | Hierarchical |

---

### Landing (Aggregated)

**Source DTOs**: `landing.ts`

| Field | Type | Notes |
|-------|------|-------|
| stats | `LandingStatsDto` | Total students, courses, instructors, etc. |
| categories | `CategoryResponseDto[]` | |
| featuredCourses | `PublicCourseDto[]` | Up to 6 |
| upcomingLiveSessions | `LiveSessionResponseDto[]` | |
| testimonials | `TestimonialDto[]` | |

## Relationships

```
User 1──N Enrollment
User 1──N Order
User 1──1 Cart
User 1──N Review
Course 1──N Enrollment
Course 1──N Section
Course N──1 Category
Course 1──N Review
Cart 1──N CartItem
CartItem N──1 Course
Order 1──N OrderItem
Order 1──N Payment
Section 1──N SectionItem
```

## Validation Rules

- Email: valid email format
- Password: minimum 8 characters
- firstName/lastName: required for registration
- Coupon code: must be valid and not expired at checkout
- Rating: 1-5 integer
- Cart: max items enforced by backend
- Order: must have at least one item
