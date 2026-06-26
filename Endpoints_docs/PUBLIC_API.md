# Athary Platform — Public / Landing API Documentation

> **Base URL:** `http://<host>:5000`
> **Response Envelope:** All responses wrapped in `ApiResponse<T>`

```jsonc
{
  "success": true,        // bool
  "data": null,           // T | null  — actual payload
  "message": null,        // string | null  — status message
  "errorCode": null,      // string | null  — machine-readable error code (only on failure)
  "errors": null          // string[] | null  — validation/error details
}
```

---

## Table of Contents

1. [Error Codes](#1-error-codes)
2. [Landing Endpoints](#2-landing-endpoints)
3. [About Endpoints](#3-about-endpoints)
4. [Legal Endpoints](#4-legal-endpoints)
5. [Contact Endpoints](#5-contact-endpoints)
6. [Testimonial Endpoints](#6-testimonial-endpoints)
7. [Instructor Endpoints](#7-instructor-endpoints)
8. [DTO Reference](#8-dto-reference)
9. [Endpoint Summary Table](#9-endpoint-summary-table)

---

## 1. Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | FluentValidation or argument error |
| `SPAM_CONTENT_DETECTED` | 400 | Message flagged as spam |
| `NOT_FOUND` | 404 | Resource not found |
| `USER_NOT_FOUND` | 404 | Instructor/user not found |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

---

## 2. Landing Endpoints

### 2.1 `GET /api/public/landing`

**Auth:** Anonymous | **Cache:** 300s

**Business Logic:**
1. Aggregates landing data: stats, categories, featured courses, upcoming live sessions, approved testimonials
2. Returns cached result for 5 minutes

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "stats": {
      "totalStudents": 10000,
      "totalCourses": 200,
      "totalInstructors": 50,
      "satisfactionRate": 95.5,
      "totalVideoHours": 500,
      "totalCertificatesIssued": 3000
    },
    "categories": [],
    "featuredCourses": [],
    "upcomingLiveSessions": [],
    "testimonials": []
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 500 | Server error |

### 2.2 `GET /api/public/stats`

**Auth:** Anonymous | **Cache:** 300s

**Business Logic:**
1. Returns only the `LandingStatsDto` portion from landing data

**Success Response — `200 OK`:** Same `data.stats` shape as landing above.

**Errors:**
| Code | Condition |
|---|---|
| 500 | Server error |

---

## 3. About Endpoints

### 3.1 `GET /api/public/about`

**Auth:** Anonymous | **Cache:** 3600s

**Business Logic:**
1. Loads system settings with `About.` prefix
2. Returns title, description, mission, vision, and hardcoded stats

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "title": "About Athary",
    "description": "Our platform description...",
    "mission": "Our mission...",
    "vision": "Our vision...",
    "stats": {
      "manuscriptsCount": 200,
      "learnersCount": 10000,
      "yearsOfExperience": 14
    }
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 500 | Server error |

---

## 4. Legal Endpoints

### 4.1 `GET /api/public/legal/{type}`

**Auth:** Anonymous | **Cache:** 3600s

**Path Parameters:**
| Parameter | Type | Valid Values |
|---|---|---|
| `type` | string | `privacy`, `terms`, `refund` |

**Business Logic:**
1. Validate `type` is one of: privacy, terms, refund → 400 if invalid
2. Fetch published legal page from database → 404 if not found

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "type": "privacy",
    "title": "Privacy Policy",
    "content": "<h1>Privacy Policy</h1>...",
    "isPublished": true,
    "version": "1.0",
    "lastUpdatedAt": "2026-01-15T10:00:00Z"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid legal page type (not privacy/terms/refund) |
| 404 | Legal page not found or not published |

---

## 5. Contact Endpoints

### 5.1 `POST /api/public/contact`

**Auth:** Anonymous | **Rate Limit:** Contact (configured via `EnableRateLimiting`)

**Request Body:**
```jsonc
{
  "fullName": "string",       // required
  "email": "string",          // required, valid email
  "phone": "string | null",   // optional
  "subject": "string",        // required
  "message": "string"         // required
}
```

**Business Logic:**
1. Validate model state → 400 if invalid
2. Check message against spam keywords → 400 if flagged
3. Create contact message record

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Message sent successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure / spam content detected |

---

## 6. Testimonial Endpoints

### 6.1 `GET /api/public/testimonials`

**Auth:** Anonymous | **Cache:** 600s

**Query Parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | int | 1 | Page number |
| `pageSize` | int | 10 | Items per page |
| `minRating` | int? | null | Filter by minimum rating (1-5) |

**Business Logic:**
1. Returns approved, non-flagged testimonials ordered by display order

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "content": "Great learning experience!",
      "rating": 5,
      "userName": "John Doe",
      "userAvatar": null,
      "displayOrder": 1,
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 500 | Server error |

### 6.2 `POST /api/public/testimonials`

**Auth:** Required

**Request Body:**
```jsonc
{
  "content": "string",    // required
  "rating": 5             // required, 1-5
}
```

**Business Logic:**
1. Extract userId from JWT
2. If user already has a testimonial → update existing instead of creating new
3. New testimonials created with `IsApproved = false`

**Success Response — `201 Created`:** Returns `TestimonialDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure |
| 401 | Missing/invalid JWT |

---

## 7. Instructor Endpoints

### 7.1 `GET /api/public/instructors/{slug}`

**Auth:** Anonymous

**Path Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `slug` | string | Instructor's URL slug |

**Business Logic:**
1. Look up instructor by slug → 404 if not found
2. Returns public profile only

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "fullName": "John Doe",
    "slug": "john-doe",
    "bio": "Expert instructor",
    "nationality": "Egyptian",
    "profileImageUrl": null,
    "createdAt": "2026-01-01T00:00:00Z"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 404 | Instructor not found |

### 7.2 `GET /api/public/instructors/check-slug`

**Auth:** Required

**Query Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `slug` | string | Slug to check |

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": true,
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

### 7.3 `GET /api/public/instructors/search`

**Auth:** Anonymous

**Query Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `q` | string | Search query (min 2 chars) |

**Business Logic:**
1. If query < 2 characters → return empty list
2. Search instructors by slug/name

**Success Response — `200 OK`:** Returns `List<PublicProfileDto>`.

**Errors:**
| Code | Condition |
|---|---|
| 500 | Server error |

---

## 8. DTO Reference

### 8.1 Landing DTOs

| DTO | Fields |
|---|---|
| **LandingDto** | `stats: LandingStatsDto`, `categories: CategoryResponseDto[]`, `featuredCourses: PublicCourseDto[]`, `upcomingLiveSessions: LiveSessionResponseDto[]`, `testimonials: TestimonialDto[]` |
| **LandingStatsDto** | `totalStudents`, `totalCourses`, `totalInstructors`, `satisfactionRate`, `totalVideoHours`, `totalCertificatesIssued` |

### 8.2 Legal Page DTOs

| DTO | Fields |
|---|---|
| **LegalPageDto** | `id`, `type`, `title`, `content`, `isPublished`, `version?`, `lastUpdatedAt?` |

### 8.3 Contact DTOs

| DTO | Fields |
|---|---|
| **CreateContactMessageDto** | `fullName`\*, `email`\*, `phone?`, `subject`\*, `message`\* |
| **ContactMessageDto** | `id`, `fullName`, `email`, `phone?`, `subject`, `message`, `isRead`, `createdAt` |

### 8.4 Testimonial DTOs

| DTO | Fields |
|---|---|
| **TestimonialDto** | `id`, `content`, `rating`, `userName`, `userAvatar?`, `displayOrder`, `createdAt` |
| **CreateTestimonialDto** | `content`\*, `rating`\* |

### 8.5 Instructor / Profile DTOs

| DTO | Fields |
|---|---|
| **PublicProfileDto** | `id`, `fullName?`, `slug?`, `bio?`, `nationality?`, `profileImageUrl?`, `createdAt` |

---

## 9. Endpoint Summary Table

| Method | Route | Auth | Cache | Rate Limit | Description |
|---|---|---|---|---|---|
| `GET` | `/api/public/landing` | No | 300s | — | Get landing page data |
| `GET` | `/api/public/stats` | No | 300s | — | Get platform stats |
| `GET` | `/api/public/about` | No | 3600s | — | Get about page info |
| `GET` | `/api/public/legal/{type}` | No | 3600s | — | Get legal page (privacy/terms/refund) |
| `POST` | `/api/public/contact` | No | — | Contact | Submit contact message |
| `GET` | `/api/public/testimonials` | No | 600s | — | List approved testimonials |
| `POST` | `/api/public/testimonials` | Yes | — | — | Create/update testimonial |
| `GET` | `/api/public/instructors/{slug}` | No | — | — | Get instructor public profile |
| `GET` | `/api/public/instructors/check-slug` | Yes | — | — | Check slug availability |
| `GET` | `/api/public/instructors/search` | No | — | — | Search instructors |
