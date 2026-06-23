# Data Model: Dashboards + Secondary Features + Missing Backend Features

**Date**: 2026-06-23
**Feature**: 003-dashboards-secondary-features

## Overview

This feature does NOT create new entities. It consumes existing backend entities through the 22 service files and 26 DTO type files already defined in Phase 1. The data model below documents the key entities and their relationships as they are consumed by the page components being rewritten.

## Entities

### StudentOverview

**Source DTOs**: `dashboard.ts`

| Field | Type | Notes |
|-------|------|-------|
| metrics | `DashboardMetricDto[]` | Enrolled courses, completed, certificates, hours |
| recentCourses | `StudentCourseDto[]` | Last accessed courses with progress |
| weeklyActivity | `ChartSeriesDto` | Study hours over past 4 weeks |
| recentCertificates | `StudentCertificateDto[]` | Earned certificates |

**DashboardMetricDto**:
| Field | Type | Notes |
|-------|------|-------|
| label | `string` | Metric name |
| value | `string` | Display value |
| change | `number?` | Percentage change |
| trend | `string` | 'up' | 'down' | 'stable' |
| icon | `string?` | Icon identifier |
| color | `string?` | Theme color |

**StudentCourseDto**:
| Field | Type | Notes |
|-------|------|-------|
| id | `string` | |
| enrollmentId | `string` | |
| courseId | `string` | |
| courseTitle | `string` | |
| thumbnailUrl | `string?` | |
| instructorName | `string` | |
| progressPercentage | `number` | 0-100 |
| status | `string` | |
| lastAccessedAt | `string?` | |

---

### InstructorOverview

**Source DTOs**: `dashboard.ts`

| Field | Type | Notes |
|-------|------|-------|
| metrics | `DashboardMetricDto[]` | Revenue, students, courses |
| courses | `InstructorCourseDto[]` | Instructor's courses |
| revenueTrend | `ChartSeriesDto` | Revenue over 12 months |
| enrollmentTrend | `ChartSeriesDto` | Enrollments over 12 months |
| studentLevelDistribution | `DistributionItemDto[]` | Beginner/Intermediate/Advanced |
| pendingEditRequests | `number` | Count of pending requests |

**InstructorCourseDto**:
| Field | Type | Notes |
|-------|------|-------|
| id | `string` | |
| title | `string` | |
| slug | `string` | |
| thumbnailUrl | `string?` | |
| price | `number` | |
| status | `string` | Draft/Published |
| enrollmentCount | `number` | |
| averageRating | `number` | |
| totalDurationMinutes | `number` | |
| revenue | `number` | |
| progressPercentage | `number` | |

---

### AdminOverview

**Source DTOs**: `dashboard.ts`

| Field | Type | Notes |
|-------|------|-------|
| metrics | `DashboardMetricDto[]` | Platform stats |
| revenueTrend | `ChartSeriesDto` | Revenue over time |
| enrollmentTrend | `ChartSeriesDto` | Enrollment trend |
| userGrowth | `ChartSeriesDto` | User registration trend |
| courseDistribution | `DistributionItemDto[]` | Courses by category |
| topCourses | `TopCourseDto[]` | Top courses by enrollment/revenue |
| pendingItems | `PendingItemsDto` | Counts of pending items |

**TopCourseDto**:
| Field | Type | Notes |
|-------|------|-------|
| id | `string` | |
| title | `string` | |
| instructorName | `string?` | |
| price | `number` | |
| enrollmentCount | `number` | |
| averageRating | `number` | |
| revenue | `number` | |

**PendingItemsDto**:
| Field | Type | Notes |
|-------|------|-------|
| pendingCourses | `number` | |
| pendingEditRequests | `number` | |
| pendingTeacherRequests | `number` | |
| flaggedReviews | `number` | |

---

### Profile

**Source DTOs**: `profile.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` (GUID) | |
| fullName | `string` | Computed: firstName + lastName |
| email | `string` | |
| bio | `string?` | |
| gender | `Gender?` | 'Male' | 'Female' | 'Other' | 'PreferNotToSay' |
| dateOfBirth | `string?` | ISO date |
| nationality | `string?` | |
| profileImageUrl | `string?` | NOT `avatarUrl` |
| createdAt | `string` | |
| phones | `PhoneDto[]` | |
| addresses | `AddressDto[]` | |

**PhoneDto**:
| Field | Type | Notes |
|-------|------|-------|
| id | `string` | |
| phoneNumber | `string` | |
| type | `PhoneType` | 'Primary' | 'Secondary' |
| isVerified | `boolean` | |
| isDefault | `boolean` | |

**AddressDto**:
| Field | Type | Notes |
|-------|------|-------|
| id | `string` | |
| type | `string` | |
| streetLine1 | `string` | |
| streetLine2 | `string?` | |
| city | `string` | |
| stateProvince | `string?` | |
| postalCode | `string` | |
| country | `string` | |
| contactPhone | `string?` | |
| isDefault | `boolean` | |

---

### PublicProfile (Instructor)

**Source DTOs**: `profile.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` (GUID) | |
| fullName | `string?` | |
| slug | `string?` | URL-friendly identifier |
| bio | `string?` | |
| nationality | `string?` | |
| profileImageUrl | `string?` | |
| createdAt | `string` | |

---

### Conversation

**Source DTOs**: `message.ts`

| Field | Type | Notes |
|-------|------|-------|
| otherUserId | `string` | |
| otherUserName | `string` | |
| lastMessage | `string` | |
| lastMessageAt | `string` | |
| unreadCount | `number` | |

---

### Message

**Source DTOs**: `message.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` | |
| senderId | `string` | |
| receiverId | `string` | |
| content | `string` | |
| sentAt | `string` | |
| isRead | `boolean` | |
| readAt | `string?` | |

---

### WishlistItem

**Source DTOs**: `wishlist.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` | |
| courseId | `string` | |
| courseTitle | `string` | |
| courseImageUrl | `string?` | |
| instructorName | `string?` | |
| price | `number` | |
| addedAt | `string` | |

---

### Refund

**Source DTOs**: `refund.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` | |
| paymentId | `string` | |
| amount | `number` | |
| reason | `string?` | |
| status | `string` | 'Requested' | 'Approved' | 'Rejected' | 'Processed' |
| orderNumber | `string?` | |
| requestedAt | `string` | |
| processedAt | `string?` | |
| processedByName | `string?` | |

**State transitions**:
```
Requested → Approved → Processed
Requested → Rejected
```

---

### InstructorRequest

**Source DTOs**: `instructorRequest.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` | |
| userName | `string` | |
| userEmail | `string` | |
| status | `InstructorRequestStatus` | 'Pending' | 'Approved' | 'Rejected' | 'RequiresMoreInfo' |
| message | `string?` | |
| submittedAt | `string` | |
| processedAt | `string?` | |
| processedByUserName | `string?` | |
| documentsCount | `number` | |

**State transitions**:
```
Pending → Approved
Pending → Rejected
Pending → RequiresMoreInfo → Pending (resubmit)
```

---

### Coupon

**Source DTOs**: `coupon.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` | |
| code | `string` | Unique code |
| type | `string` | 'Percentage' | 'FixedAmount' |
| value | `number` | Discount value |
| maxDiscountAmount | `number?` | Cap for percentage discounts |
| minimumPurchaseAmount | `number?` | Minimum order total |
| applicableTo | `string` | 'All' | 'SpecificCourses' | 'SpecificCategories' |
| usageLimit | `number?` | Total usage limit |
| userLimitPerUser | `number?` | Per-user limit |
| timesUsed | `number` | Current usage count |
| isActive | `boolean` | |
| validFrom | `string?` | |
| validUntil | `string?` | |
| createdAt | `string` | |

---

### PaymentMethod

**Source DTOs**: `payment.ts`

| Field | Type | Notes |
|-------|------|-------|
| id | `string` | |
| name | `string` | Display name |
| provider | `string` | Payment provider |
| type | `string` | Payment type |
| isActive | `boolean` | |
| configuration | `string?` | JSON config |

---

## Relationships

```
User 1──1 StudentOverview (computed)
User 1──1 InstructorOverview (computed)
User 1──1 AdminOverview (computed)
User 1──1 Profile
User 1──N Phone
User 1──N Address
User 1──N Conversation
User 1──N Message
User 1──N WishlistItem
User 1──N Refund
User 1──N InstructorRequest
User 1──N Coupon (admin manages)
User 1──N PaymentMethod (admin manages)
```

## Validation Rules

- Profile firstName/lastName: required, max 100 characters
- Profile bio: max 1000 characters
- Profile phoneNumber: valid phone format
- Address postalCode: max 20 characters
- Message content: required, max 5000 characters
- Coupon code: required, unique, alphanumeric
- Coupon value: positive number
- Refund reason: max 1000 characters
- InstructorRequest message: required, min 10 characters
