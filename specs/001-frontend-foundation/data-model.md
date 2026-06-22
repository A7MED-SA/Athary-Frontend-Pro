# Data Model: Frontend Foundation — Types & DTOs

**Date**: 2026-06-22
**Spec**: [spec.md](./spec.md)

## Generic Envelopes

### ApiResponse<T>

| Field    | Type       | Description                          |
|----------|------------|--------------------------------------|
| success  | boolean    | Whether the request succeeded        |
| message  | string?    | Optional human-readable message      |
| data     | T          | The response payload                 |
| errors   | string[]?  | Optional list of error messages      |

### PagedList<T>

| Field      | Type    | Description                    |
|------------|---------|--------------------------------|
| items      | T[]     | The page items                 |
| page       | number  | Current page number (1-based)  |
| pageSize   | number  | Items per page                 |
| totalCount | number  | Total items across all pages   |
| totalPages | number  | Total number of pages          |
| hasPrevious| boolean | Whether a previous page exists |
| hasNext    | boolean | Whether a next page exists     |

## Auth Domain

### LoginRequest

| Field      | Type    | Required | Notes         |
|------------|---------|----------|---------------|
| email      | string  | ✅       |               |
| password   | string  | ✅       |               |
| rememberMe | boolean | ❌       | Default: false|

### RegisterRequest

| Field         | Type    | Required | Notes                  |
|---------------|---------|----------|------------------------|
| firstName     | string  | ✅       |                        |
| lastName      | string  | ✅       |                        |
| email         | string  | ✅       |                        |
| password      | string  | ✅       |                        |
| confirmPassword| string | ✅       | Must match password    |
| gender        | Gender  | ❌       |                        |
| dateOfBirth   | string  | ❌       | ISO 8601               |
| phoneNumber   | string  | ❌       |                        |
| country       | string  | ❌       |                        |
| city          | string  | ❌       |                        |
| streetLine1   | string  | ❌       |                        |
| postalCode    | string  | ❌       |                        |

### AuthResponse

| Field        | Type        | Required | Notes                     |
|--------------|-------------|----------|---------------------------|
| accessToken  | string      | ✅       | JWT (but stored in cookie)|
| refreshToken | string      | ✅       | (stored in cookie)        |
| sessionId    | string      | ✅       | Unique session identifier |
| expiresAt    | string      | ✅       | ISO 8601                  |
| user         | UserInfoDto | ✅       |                           |

### UserInfoDto

| Field            | Type     | Required | Notes                    |
|------------------|----------|----------|--------------------------|
| id               | string   | ✅       | UUID                     |
| email            | string   | ✅       |                          |
| fullName         | string   | ✅       |                          |
| profilePictureUrl| string   | ❌       | NOT avatarUrl            |
| isActive         | boolean  | ✅       |                          |
| emailConfirmed   | boolean  | ✅       |                          |
| roles            | string[] | ✅       |                          |

### OAuthLoginRequest

| Field    | Type                        | Required | Notes                          |
|----------|-----------------------------|----------|--------------------------------|
| idToken  | string                      | ✅       | Google/Microsoft ID token      |
| provider | 'google' \| 'microsoft'     | ✅       |                                |

### SessionDto

| Field     | Type    | Required | Notes     |
|-----------|---------|----------|-----------|
| id        | string  | ✅       | UUID      |
| ipAddress | string  | ✅       |           |
| userAgent | string  | ✅       |           |
| createdAt | string  | ✅       | ISO 8601  |
| lastUsed  | string  | ❌       | ISO 8601  |
| isActive  | boolean | ✅       |           |

### Gender (Enum)

Values: `'Male' | 'Female' | 'Other' | 'PreferNotToSay'`

## Profile Domain

### ProfileDto

| Field            | Type      | Required | Notes        |
|------------------|-----------|----------|--------------|
| id               | string    | ✅       | UUID         |
| fullName         | string    | ✅       |              |
| email            | string    | ✅       |              |
| bio              | string    | ❌       |              |
| gender           | Gender    | ❌       |              |
| dateOfBirth      | string    | ❌       | ISO 8601     |
| nationality      | string    | ❌       |              |
| profileImageUrl  | string    | ❌       | NOT avatarUrl|
| createdAt        | string    | ✅       | ISO 8601     |
| phones           | PhoneDto[]| ✅       |              |
| addresses        | AddressDto[]| ✅     |              |

### PublicProfileDto

| Field           | Type   | Required | Notes |
|-----------------|--------|----------|-------|
| id              | string | ✅       | UUID  |
| fullName        | string | ❌       |       |
| slug            | string | ❌       |       |
| bio             | string | ❌       |       |
| nationality     | string | ❌       |       |
| profileImageUrl | string | ❌       |       |
| createdAt       | string | ✅       |       |

### PhoneDto

| Field       | Type    | Required | Notes |
|-------------|---------|----------|-------|
| id          | string  | ✅       | UUID  |
| phoneNumber | string  | ✅       |       |
| type        | PhoneType | ✅     |       |
| isVerified  | boolean | ✅       |       |
| isDefault   | boolean | ✅       |       |

### AddressDto

| Field        | Type    | Required | Notes |
|--------------|---------|----------|-------|
| id           | string  | ✅       | UUID  |
| type         | string  | ✅       |       |
| streetLine1  | string  | ✅       |       |
| streetLine2  | string  | ❌       |       |
| city         | string  | ✅       |       |
| stateProvince| string  | ❌       |       |
| postalCode   | string  | ✅       |       |
| country      | string  | ✅       |       |
| contactPhone | string  | ❌       |       |
| isDefault    | boolean | ✅       |       |

### PhoneType (Enum)

Values: `'Primary' | 'Secondary'`

## Course Domain

### CourseLevel (Enum)

Values: `'Beginner' | 'Intermediate' | 'Advanced'`

### CourseLanguage (Enum)

Values: `'Ar' | 'En'`

### PublicCourseDto

| Field                | Type        | Required | Notes |
|----------------------|-------------|----------|-------|
| id                   | string      | ✅       | UUID  |
| title                | string      | ✅       |       |
| slug                 | string      | ✅       |       |
| description          | string      | ❌       |       |
| courseImageUrl       | string      | ❌       | NOT thumbnail |
| price                | number      | ✅       |       |
| isFree               | boolean     | ✅       |       |
| level                | CourseLevel | ✅       |       |
| language             | CourseLanguage | ✅    |       |
| categoryName         | string      | ✅       | NOT category: string |
| categoryId           | string      | ✅       | UUID  |
| instructorName       | string      | ✅       |       |
| averageRating        | number      | ✅       | NOT rating |
| enrollmentCount      | number      | ✅       | NOT studentsCount |
| totalDurationMinutes | number      | ✅       | NOT duration: string |
| sectionCount         | number      | ✅       |       |
| lessonCount          | number      | ✅       | NOT lessonsCount |
| publishedAt          | string      | ❌       | ISO 8601 |

### PublicCourseFilterDto

| Field         | Type             | Required | Notes |
|---------------|------------------|----------|-------|
| searchQuery   | string           | ❌       |       |
| categoryId    | string           | ❌       | UUID  |
| level         | CourseLevel      | ❌       |       |
| language      | CourseLanguage   | ❌       |       |
| minPrice      | number           | ❌       |       |
| maxPrice      | number           | ❌       |       |
| isFreeOnly    | boolean          | ❌       |       |
| minRating     | number           | ❌       |       |
| sortBy        | PublicCourseSortBy | ❌     |       |
| sortDescending| boolean          | ❌       |       |
| page          | number           | ❌       |       |
| pageSize      | number           | ❌       |       |

### PublicCourseSortBy (Enum)

Values: `'PublishedAt' | 'Price' | 'AverageRating' | 'EnrollmentCount' | 'Title'`

## Enrollment Domain

### EnrollmentStatus (Enum)

Values: `'InProgress' | 'Completed' | 'Expired' | 'Refunded'`

### EnrollmentSource (Enum)

Values: `'Purchase' | 'Gift' | 'AdminGrant' | 'Coupon'`

### ContentType (Enum)

Values: `'Video' | 'Quiz' | 'Document' | 'LiveSession'`

### ContentProgressDto

| Field                 | Type        | Required | Notes |
|-----------------------|-------------|----------|-------|
| id                    | string      | ✅       | UUID  |
| enrollmentId          | string      | ✅       | UUID  |
| contentType           | ContentType | ✅       |       |
| contentId             | string      | ✅       | UUID  |
| isCompleted           | boolean     | ✅       |       |
| watchTimeSeconds      | number      | ✅       |       |
| attemptsCount         | number      | ✅       |       |
| completionPercentage  | number      | ✅       |       |
| metadata              | string      | ❌       |       |
| lastAccessedAt        | string      | ❌       | ISO 8601 |
| completedAt           | string      | ❌       | ISO 8601 |

## Cart & Order Domain

### CartResponseDto

| Field          | Type         | Required | Notes |
|----------------|--------------|----------|-------|
| id             | string       | ✅       | UUID  |
| items          | CartItemDto[]| ✅       |       |
| subtotal       | number       | ✅       |       |
| couponCode     | string       | ❌       |       |
| discountAmount | number       | ✅       |       |
| finalAmount    | number       | ✅       | NOT total |

### OrderResponseDto

| Field          | Type    | Required | Notes |
|----------------|---------|----------|-------|
| id             | string  | ✅       | UUID  |
| orderNumber    | string  | ✅       |       |
| subtotal       | number  | ✅       |       |
| discountAmount | number  | ✅       |       |
| finalAmount    | number  | ✅       |       |
| status         | string  | ✅       |       |
| couponCode     | string  | ❌       |       |
| itemCount      | number  | ✅       |       |
| createdAt      | string  | ✅       |       |

## SignalR Hub Endpoints

| Hub                      | URL                    | Events Received         |
|--------------------------|------------------------|-------------------------|
| Notifications Hub        | `/hubs/notifications`  | `ReceiveNotification`   |
| Messaging Hub            | `/hubs/messaging`      | `ReceiveMessage`        |

Both hubs require JWT authentication via the `access_token` query parameter or Authorization header.
