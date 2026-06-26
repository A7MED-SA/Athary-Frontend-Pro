# Athary Platform — Courses API Documentation

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

Paged responses wrap `data` in a `PagedList<T>` envelope:

```jsonc
{
  "success": true,
  "data": {
    "items": [ /* T[] */ ],
    "page": 1,
    "pageSize": 12,
    "totalCount": 42,
    "totalPages": 4,
    "hasPreviousPage": false,
    "hasNextPage": true
  },
  "message": null
}
```

---

## Table of Contents

1. [Authentication & Authorization](#1-authentication--authorization)
2. [Error Handling](#2-error-handling)
3. [Public Course Endpoints](#3-public-course-endpoints)
4. [Course Management Endpoints](#4-course-management-endpoints)
5. [Admin Course Endpoints](#5-admin-course-endpoints)
6. [Section Endpoints](#6-section-endpoints)
7. [Video Content Endpoints](#7-video-content-endpoints)
8. [Document Endpoints](#8-document-endpoints)
9. [Quiz Management Endpoints](#9-quiz-management-endpoints)
10. [Quiz Attempt Endpoints](#10-quiz-attempt-endpoints)
11. [Enrollment Endpoints](#11-enrollment-endpoints)
12. [DTO Reference](#12-dto-reference)
13. [Enums Reference](#13-enums-reference)
14. [Endpoint Summary Table](#14-endpoint-summary-table)

---

## 1. Authentication & Authorization

### 1.1 Course-Level Authorization

| Controller | Route Prefix | Auth | Role Required |
|---|---|---|---|
| `PublicCourseController` | `/api/public/courses` | Anonymous | None |
| `CourseManagementController` | `/api/management/courses` | `[Authorize]` | Any authenticated user (instructor ownership enforced in service) |
| `AdminCourseController` | `/api/admin/courses` | `[Authorize(Roles = "Admin")]` | **Admin** |
| `SectionController` | `/api/management/courses/{courseId:guid}/sections` | `[Authorize]` | Any authenticated user (ownership enforced in service) |
| `VideoContentController` | `/api/courses/{courseId:guid}/videos` | `[Authorize(Roles = "Instructor")]` | **Instructor** |
| `DocumentController` | `/api/courses/{courseId:guid}/documents` | `[Authorize(Roles = "Instructor")]` | **Instructor** |
| `QuizManagementController` | `/api/courses/{courseId:guid}/quizzes` | `[Authorize(Roles = "Instructor")]` | **Instructor** |
| `QuizAttemptController` | `/api/enrollments/{enrollmentId:guid}/quizzes/{quizId:guid}/attempts` | `[Authorize]` | Any authenticated user |
| `EnrollmentsController` | `/api/enrollments` | `[Authorize]` | Any authenticated user |

---

## 2. Error Handling

### 2.1 Exception Middleware Mapping

| Exception | HTTP Status |
|---|---|
| `KeyNotFoundException` | **404** Not Found |
| `UnauthorizedAccessException` | **403** Forbidden |
| `ArgumentException` | **400** Bad Request |
| `InvalidOperationException` | **400** Bad Request |
| Any other `Exception` | **500** Internal Server Error |

Response format:
```jsonc
{
  "success": false,
  "data": null,
  "message": "<exception.Message>",
  "errorCode": "COURSE_NOT_FOUND | SECTION_NOT_FOUND | ...",
  "errors": null
}
```

### 2.2 FluentValidation Errors

Returns **400 Bad Request** with ASP.NET Core `ProblemDetails` (NOT wrapped in `ApiResponse`):

```jsonc
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Title": ["'Title' must not be empty."],
    "Price": ["'Price' must be greater than or equal to '0'."]
  }
}
```

### 2.3 Course Error Code Reference

| Error Code | HTTP Status | Description |
|---|---|---|
| **Courses — General** | | |
| `COURSE_NOT_FOUND` | 404 | Course does not exist |
| `COURSE_NOT_PUBLISHED` | 400 | Course is not published (draft/pending/archived) |
| `COURSE_NOT_PENDING` | 400 | Course is not in pending-review state |
| `COURSE_PERMISSION_DENIED` | 403 | User does not own the course |
| `COURSE_HAS_NO_IMAGE` | 400 | Course has no image to remove |
| `CANNOT_DELETE_PUBLISHED_COURSE` | 400 | Cannot delete a published course with enrolled students |
| `INVALID_SCHEDULED_DATE` | 400 | Scheduled deletion date is invalid (e.g. in the past) |
| `COURSE_HAS_SCHEDULED_DELETION` | 400 | Course already has a scheduled deletion |
| **Courses — Section** | | |
| `SECTION_NOT_FOUND` | 404 | Section does not exist |
| `SECTION_PERMISSION_DENIED` | 403 | User does not own this section's course |
| `SECTION_ITEM_NOT_FOUND` | 404 | Section item does not exist |
| **Courses — Video** | | |
| `VIDEO_NOT_FOUND` | 404 | Video does not exist |
| **Courses — Document** | | |
| `DOCUMENT_NOT_FOUND` | 404 | Document does not exist |
| **Courses — Quiz** | | |
| `QUIZ_NOT_FOUND` | 404 | Quiz does not exist |
| `QUESTION_NOT_FOUND` | 404 | Question does not exist |
| `QUIZ_ATTEMPT_MAX_REACHED` | 400 | Max attempts reached for this quiz |
| `QUIZ_ATTEMPT_NOT_FOUND` | 404 | Quiz attempt does not exist |
| `QUIZ_ATTEMPT_ALREADY_SUBMITTED` | 400 | Attempt has already been submitted |
| `CANNOT_DELETE_QUIZ_WITH_ATTEMPTS` | 409 | Cannot delete quiz that has in-progress attempts |
| `INVALID_CONTENT_TYPE` | 400 | Content type parameter is invalid |
| **Courses — Enrollment** | | |
| `ENROLLMENT_NOT_FOUND` | 404 | Enrollment does not exist |
| `ENROLLMENT_NOT_COMPLETED` | 400 | Enrollment must be completed before action |
| `ALREADY_ENROLLED` | 400 | User is already enrolled in this course |
| **Courses — Edit Request** | | |
| `EDIT_REQUEST_NOT_FOUND` | 404 | Edit request not found |
| **General** | | |
| `VALIDATION_ERROR` | 400 | FluentValidation or argument error |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |
| `FORBIDDEN` | 403 | Generic access denied |
| `NOT_FOUND` | 404 | Generic not found |
| `BAD_REQUEST` | 400 | Generic bad request |

---

## 3. Public Course Endpoints

Base: `/api/public/courses` — **All anonymous**

### 3.1 `GET /api/public/courses`

**Auth:** Anonymous

**Query Parameters:**
```jsonc
{
  "searchQuery": "string | null",       // full-text search
  "categoryId": "guid | null",          // filter by category
  "level": "CourseLevel | null",        // Beginner | Intermediate | Advanced
  "language": "CourseLanguage | null",  // Ar | En
  "minPrice": "decimal | null",
  "maxPrice": "decimal | null",
  "isFreeOnly": "bool | null",
  "minRating": "decimal | null",
  "sortBy": "PublicCourseSortBy",       // PublishedAt (default), Price, AverageRating, EnrollmentCount, Title
  "sortDescending": "bool",             // default true
  "page": 1,                            // default 1
  "pageSize": 12                        // default 12
}
```

**Business Logic:**
1. Apply filters: search, category, level, language, price range, rating
2. Sort by specified field
3. Return paged list of published courses only

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "guid",
        "title": "Mastering ASP.NET Core",
        "slug": "mastering-aspnet-core",
        "description": "A comprehensive course...",
        "courseImageUrl": "https://minio-host/courses/image.jpg",
        "price": 199.99,
        "isFree": false,
        "level": "Intermediate",
        "language": "En",
        "categoryName": "Web Development",
        "categoryId": "guid",
        "instructorName": "John Doe",
        "averageRating": 4.5,
        "enrollmentCount": 234,
        "totalDurationMinutes": 720,
        "sectionCount": 8,
        "lessonCount": 42,
        "publishedAt": "2026-01-15T10:00:00Z"
      }
    ],
    "page": 1,
    "pageSize": 12,
    "totalCount": 1,
    "totalPages": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid filter parameters |

---

### 3.2 `GET /api/public/courses/{id:guid}`

**Auth:** Anonymous

**Business Logic:**
1. Load published course by ID including requirements, outcomes, sections, and items
2. Return full public course detail

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "title": "Mastering ASP.NET Core",
    "slug": "mastering-aspnet-core",
    "description": "A comprehensive course...",
    "courseImageUrl": "https://minio-host/courses/image.jpg",
    "introVideoUrl": null,
    "price": 199.99,
    "isFree": false,
    "level": "Intermediate",
    "language": "En",
    "categoryName": "Web Development",
    "categoryId": "guid",
    "instructor": {
      "id": "guid",
      "fullName": "John Doe",
      "bio": "Senior .NET developer",
      "profileImageUrl": null
    },
    "averageRating": 4.5,
    "enrollmentCount": 234,
    "totalDurationMinutes": 720,
    "requirements": ["Basic C# knowledge", "Visual Studio"],
    "learningOutcomes": ["Build REST APIs", "Use EF Core"],
    "sections": [
      {
        "id": "guid",
        "title": "Introduction",
        "description": "Getting started",
        "position": 1,
        "items": [
          {
            "id": "guid",
            "itemType": "Video",
            "position": 1,
            "isPreviewAllowed": true
          }
        ]
      }
    ],
    "version": 3,
    "publishedAt": "2026-01-15T10:00:00Z",
    "lastContentUpdateAt": "2026-03-01T12:00:00Z"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 404 | `COURSE_NOT_FOUND` — course not found or not published |

---

### 3.3 `GET /api/public/courses/slug/{slug}`

**Auth:** Anonymous

**Business Logic:**
1. Load published course by URL slug
2. Same shape as `GET /api/public/courses/{id:guid}`

**Errors:**
| Code | Condition |
|---|---|
| 404 | `COURSE_NOT_FOUND` — course not found or not published |

---

### 3.4 `GET /api/public/courses/search/suggest`

**Auth:** Anonymous

**Query Parameters:**
```jsonc
{
  "query": "string",    // required, search term
  "limit": 5            // optional, default 5
}
```

**Business Logic:**
1. Full-text search for course titles
2. Return lightweight suggestion items (id, title, slug, category)

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "title": "Mastering ASP.NET Core",
      "slug": "mastering-aspnet-core",
      "categoryName": "Web Development"
    }
  ],
  "message": null
}
```

**Errors:** None (returns empty array on no results)

---

### 3.5 `GET /api/public/courses/stats`

**Auth:** Anonymous

**Business Logic:**
1. Aggregate platform-wide stats

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "totalCourses": 150,
    "totalStudents": 12500,
    "totalInstructors": 340,
    "totalCategories": 18
  },
  "message": null
}
```

---

### 3.6 `GET /api/public/courses/{id:guid}/related`

**Auth:** Anonymous

**Query Parameters:**
```jsonc
{
  "limit": 4    // optional, default 4
}
```

**Business Logic:**
1. Find related courses by same category (excluding current)
2. Return lightweight `PublicCourseDto` list

**Success Response — `200 OK`:** Array of `PublicCourseDto`.

---

### 3.7 `GET /api/public/courses/filters/options`

**Auth:** Anonymous

**Business Logic:**
1. Return all available filter options (categories with counts, levels, languages, price range)

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "guid",
        "name": "Web Development",
        "courseCount": 42
      }
    ],
    "levels": ["Beginner", "Intermediate", "Advanced"],
    "languages": ["Ar", "En"],
    "minPrice": 0,
    "maxPrice": 599.99
  },
  "message": null
}
```

---

## 4. Course Management Endpoints

Base: `/api/management/courses` — **All require authentication (instructor ownership)**

### 4.1 `POST /api/management/courses`

**Auth:** Required

**Request Body:**
```jsonc
{
  "title": "string",              // required, max 200
  "slug": "string | null",        // optional, auto-generated if null
  "description": "string | null", // optional
  "categoryId": "guid",           // required
  "level": "Beginner",            // optional, defaults Beginner (Beginner | Intermediate | Advanced)
  "language": "Ar",               // optional, defaults Ar (Ar | En)
  "price": 199.99                 // required, >= 0
}
```

**Business Logic:**
1. Extract `userId` from JWT `sub`
2. Create course with status `Draft`
3. Log creation activity

**Success Response — `201 Created`:**
Returns full `CourseDetailsDto` with generated `Id`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure / category not found |
| 401 | Missing/invalid JWT |

---

### 4.2 `GET /api/management/courses/{id:guid}`

**Auth:** Required

**Business Logic:**
1. Load course by ID (any status — owner sees details)
2. Return full course details including requirements, outcomes

**Success Response — `200 OK:` `CourseDetailsDto`**

**Errors:**
| Code | Condition |
|---|---|
| 404 | `COURSE_NOT_FOUND` |

---

### 4.3 `PUT /api/management/courses/{id:guid}`

**Auth:** Required

**Request Body (all fields nullable — partial update):**
```jsonc
{
  "title": "string | null",
  "slug": "string | null",
  "description": "string | null",
  "categoryId": "guid | null",
  "level": "CourseLevel | null",
  "language": "CourseLanguage | null",
  "price": "decimal | null"
}
```

**Business Logic:**
1. Only update non-null fields
2. Enforce course ownership → 403 if not owner
3. Only allowed for `Draft` or `PendingReview` courses

**Success Response — `200 OK`:** Updated `CourseDetailsDto`.

**Errors:**
| Code | Condition |
|---|---|
| 403 | `COURSE_PERMISSION_DENIED` — not the owner |
| 404 | `COURSE_NOT_FOUND` |

---

### 4.4 `POST /api/management/courses/{id:guid}/requirements`

**Auth:** Required

**Request Body:**
```jsonc
{
  "requirementText": "string"   // required
}
```

**Business Logic:**
1. Enforce ownership
2. Add requirement to course

**Success Response — `200 OK`:** `CourseRequirementDto`.

**Errors:**
| Code | Condition |
|---|---|
| 403 | `COURSE_PERMISSION_DENIED` |
| 404 | `COURSE_NOT_FOUND` |

---

### 4.5 `DELETE /api/management/courses/{id:guid}/requirements/{requirementId:guid}`

**Auth:** Required

**Business Logic:**
1. Enforce ownership
2. Remove requirement from course

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Requirement removed successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 403 | `COURSE_PERMISSION_DENIED` |
| 404 | `COURSE_NOT_FOUND` |

---

### 4.6 `POST /api/management/courses/{id:guid}/outcomes`

**Auth:** Required

**Request Body:**
```jsonc
{
  "outcomeText": "string"   // required
}
```

**Business Logic:**
1. Enforce ownership
2. Add learning outcome to course

**Success Response — `200 OK`:** `CourseLearningOutcomeDto`.

---

### 4.7 `DELETE /api/management/courses/{id:guid}/outcomes/{outcomeId:guid}`

**Auth:** Required

**Business Logic:**
1. Enforce ownership
2. Remove learning outcome

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Outcome removed successfully"
}
```

---

### 4.8 `POST /api/management/courses/{id:guid}/submit-for-review`

**Auth:** Required

**Business Logic:**
1. Course must be in `Draft` status → 400 `COURSE_NOT_PUBLISHED`
2. Change status to `PendingReview`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Course submitted for review successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | `COURSE_NOT_PUBLISHED` — not a draft |
| 403 | `COURSE_PERMISSION_DENIED` |

---

### 4.9 `DELETE /api/management/courses/{id:guid}`

**Auth:** Required

**Business Logic:**
1. Enforce ownership
2. Cannot delete published course with enrolled students → 400 `CANNOT_DELETE_PUBLISHED_COURSE`
3. Soft-delete or hard-delete based on status

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Course deleted successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | `CANNOT_DELETE_PUBLISHED_COURSE` |
| 403 | `COURSE_PERMISSION_DENIED` |
| 404 | `COURSE_NOT_FOUND` |

---

### 4.10 `POST /api/management/courses/{id:guid}/schedule-deletion`

**Auth:** Required

**Request Body:**
```jsonc
{
  "scheduledDate": "2026-07-15T00:00:00Z",   // required, must be future
  "reason": "string | null"                    // optional
}
```

**Business Logic:**
1. Enforce ownership
2. Set `ScheduledDeletionAt` and `DeletionReason`
3. Set `IsReadOnlyForStudents = true`
4. Date must be in the future → 400 `INVALID_SCHEDULED_DATE`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Deletion scheduled successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | `INVALID_SCHEDULED_DATE` |
| 403 | `COURSE_PERMISSION_DENIED` |
| 404 | `COURSE_NOT_FOUND` |

---

### 4.11 `POST /api/management/courses/{id:guid}/cancel-scheduled-deletion`

**Auth:** Required

**Business Logic:**
1. Enforce ownership
2. Clear `ScheduledDeletionAt`, `DeletionReason`, set `IsReadOnlyForStudents = false`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Scheduled deletion cancelled successfully"
}
```

---

### 4.12 `GET /api/management/courses/{id:guid}/deletion-status`

**Auth:** Required

**Business Logic:**
1. Return scheduled deletion info (any authenticated user can view)

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "courseId": "guid",
    "scheduledDeletionAt": "2026-07-15T00:00:00Z",
    "deletionReason": "Course outdated",
    "isReadOnlyForStudents": true,
    "isPending": true,
    "isExecuted": false,
    "enrolledStudentCount": 42
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 404 | `COURSE_NOT_FOUND` |

---

### 4.13 `PUT /api/management/courses/{courseId:guid}/image`

**Auth:** Required

**Request Body:**
```jsonc
{
  "fileId": "guid"    // required, ID of previously uploaded image file
}
```

**Business Logic:**
1. Enforce ownership
2. Validate file exists, is image, is ready, belongs to user
3. Set as course image

**Success Response — `200 OK`:** Updated `CourseDetailsDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | `FILE_MUST_BE_IMAGE` / `FILE_NOT_READY` |
| 403 | `COURSE_PERMISSION_DENIED` / `FILE_NOT_OWNED` |

---

## 5. Admin Course Endpoints

Base: `/api/admin/courses` — **All require `[Authorize(Roles = "Admin")]`**

### 5.1 `POST /api/admin/courses/{id:guid}/approve`

**Auth:** Admin

**Business Logic:**
1. Course must be in `PendingReview` status → 400 `COURSE_NOT_PENDING`
2. Set status to `Published`, set `PublishedAt`, log admin activity

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Course approved successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | `COURSE_NOT_PENDING` |
| 404 | `COURSE_NOT_FOUND` |

---

### 5.2 `POST /api/admin/courses/{id:guid}/reject`

**Auth:** Admin

**Request Body:**
```jsonc
{
  "reason": "string"    // required, rejection reason
}
```

**Business Logic:**
1. Course must be in `PendingReview` status
2. Set status back to `Draft`, store `RejectionReason`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Course rejected successfully"
}
```

---

### 5.3 `GET /api/admin/courses/edit-requests`

**Auth:** Admin

**Query Parameters:**
```jsonc
{
  "status": "EditRequestStatus | null",    // Pending | Approved | Rejected | Cancelled | Expired
  "requestType": "EditRequestType | null", // Section | SectionItem | CourseProperty
  "courseId": "guid | null",
  "instructorId": "guid | null",
  "page": 1,
  "pageSize": 20
}
```

**Success Response — `200 OK`:** Paged list of `EditRequestSummaryDto`.

---

### 5.4 `GET /api/admin/courses/edit-requests/{requestId:guid}`

**Auth:** Admin

**Success Response — `200 OK`:** `EditRequestDetailDto`.

**Errors:**
| Code | Condition |
|---|---|
| 404 | `EDIT_REQUEST_NOT_FOUND` |

---

### 5.5 `POST /api/admin/courses/edit-requests/{requestId:guid}/review`

**Auth:** Admin

**Request Body:**
```jsonc
{
  "approve": true,              // required
  "notes": "string | null"      // optional admin notes
}
```

**Business Logic:**
1. Admin approves or rejects the edit request
2. If approved, the requested changes are applied immediately or scheduled based on risk level
3. Returns `EditResultDto` with `AppliedImmediately` and `Message`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "appliedImmediately": true,
    "requestId": "guid",
    "status": "Approved",
    "message": "Edit request approved and changes applied.",
    "processedAt": "2026-06-26T12:00:00Z"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 404 | `EDIT_REQUEST_NOT_FOUND` |

---

## 6. Section Endpoints

Base: `/api/management/courses/{courseId:guid}/sections` — **All require authentication**

### 6.1 `GET /api/management/courses/{courseId:guid}/sections`

**Auth:** Required

**Business Logic:**
1. Return all sections for a course, ordered by position
2. Each section includes its items

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "courseId": "guid",
      "title": "Introduction",
      "description": "Getting started with the basics",
      "position": 1,
      "isLocked": false,
      "items": [
        {
          "id": "guid",
          "sectionId": "guid",
          "itemType": "Video",
          "itemId": "guid",
          "position": 1,
          "isPreviewAllowed": true,
          "isMandatory": true
        }
      ]
    }
  ],
  "message": null
}
```

---

### 6.2 `POST /api/management/courses/{courseId:guid}/sections`

**Auth:** Required

**Request Body:**
```jsonc
{
  "title": "string",              // required
  "description": "string | null"  // optional
}
```

**Business Logic:**
1. Enforce course ownership
2. Append section at the end (highest position + 1)

**Success Response — `201 Created`:** `SectionDto`.

**Errors:**
| Code | Condition |
|---|---|
| 403 | `SECTION_PERMISSION_DENIED` |
| 404 | `COURSE_NOT_FOUND` |

---

### 6.3 `GET /api/management/courses/{courseId:guid}/sections/{sectionId:guid}`

**Auth:** Required

**Success Response — `200 OK`:** `SectionDto`.

---

### 6.4 `PUT /api/management/courses/{courseId:guid}/sections/{sectionId:guid}`

**Auth:** Required

**Request Body:**
```jsonc
{
  "title": "string",               // required
  "description": "string | null",  // optional
  "isLocked": false                // bool
}
```

**Business Logic:**
1. Enforce course ownership

**Success Response — `200 OK`:** Updated `SectionDto`.

**Errors:**
| Code | Condition |
|---|---|
| 403 | `SECTION_PERMISSION_DENIED` |
| 404 | `SECTION_NOT_FOUND` |

---

### 6.5 `DELETE /api/management/courses/{courseId:guid}/sections/{sectionId:guid}`

**Auth:** Required

**Business Logic:**
1. Enforce ownership
2. Cascade-delete section items

**Success Response — `200 OK:`**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Section deleted successfully"
}
```

---

### 6.6 `PUT /api/management/courses/{courseId:guid}/sections/reorder`

**Auth:** Required

**Request Body:**
```jsonc
{
  "items": [
    { "id": "guid", "position": 1 },
    { "id": "guid", "position": 2 }
  ]
}
```

**Business Logic:**
1. Enforce ownership
2. Update position for each section

**Success Response — `200 OK:`**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Sections reordered successfully"
}
```

---

### 6.7 `POST /api/management/courses/{courseId:guid}/sections/{sectionId:guid}/items`

**Auth:** Required

**Request Body:**
```jsonc
{
  "itemType": "Video",      // required (Video | Quiz | Document | LiveSession)
  "itemId": "guid",         // required, ID of the content entity
  "isPreviewAllowed": false, // bool, optional
  "isMandatory": true        // bool, optional, defaults true
}
```

**Business Logic:**
1. Enforce ownership
2. Link existing content (video/quiz/document) to section
3. Append at the end of the section

**Success Response — `200 OK`:** `SectionItemDto`.

---

### 6.8 `PUT /api/management/courses/{courseId:guid}/sections/{sectionId:guid}/items/{itemId:guid}`

**Auth:** Required

**Request Body:**
```jsonc
{
  "isPreviewAllowed": false, // bool
  "isMandatory": true         // bool
}
```

**Success Response — `200 OK`:** Updated `SectionItemDto`.

---

### 6.9 `DELETE /api/management/courses/{courseId:guid}/sections/{sectionId:guid}/items/{itemId:guid}`

**Auth:** Required

**Business Logic:**
1. Remove item from section (does not delete the content itself)

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Section item deleted successfully"
}
```

---

### 6.10 `PUT /api/management/courses/{courseId:guid}/sections/{sectionId:guid}/items/reorder`

**Auth:** Required

**Request Body:** Same `ReorderRequestDto` as sections reorder.

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Section items reordered successfully"
}
```

---

## 7. Video Content Endpoints

Base: `/api/courses/{courseId:guid}/videos` — **All require `[Authorize(Roles = "Instructor")]`**

### 7.1 `GET /api/courses/{courseId:guid}/videos/{id:guid}`

**Auth:** Instructor

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "title": "Introduction Video",
    "videoUrl": "https://minio-host/videos/uuid.mp4",
    "provider": "Local",
    "durationSeconds": 3600,
    "quality": "_1080p",
    "status": "Ready",
    "isPreview": false,
    "viewCount": 42,
    "transcript": "Full transcript text...",
    "createdAt": "2026-01-15T10:00:00Z"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 404 | `VIDEO_NOT_FOUND` |

---

### 7.2 `POST /api/courses/{courseId:guid}/videos`

**Auth:** Instructor

**Request Body:**
```jsonc
{
  "sectionId": "guid",            // required
  "title": "string",              // required
  "videoFileId": "guid",          // required, ID of uploaded video file
  "provider": "Local",            // optional, defaults Local (Local | YouTube | Vimeo | Minio)
  "providerVideoId": "string | null", // external video ID (for YouTube/Vimeo)
  "durationSeconds": 3600,        // required
  "transcript": "string | null",  // optional
  "isPreview": false               // bool, optional
}
```

**Business Logic:**
1. Create video record, link to section item

**Success Response — `201 Created`:** `VideoResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 404 | Section not found |

---

### 7.3 `PUT /api/courses/{courseId:guid}/videos/{id:guid}`

**Auth:** Instructor

**Request Body:**
```jsonc
{
  "title": "string",               // required
  "transcript": "string | null",   // optional
  "isPreview": false                // bool
}
```

**Success Response — `200 OK`:** Updated `VideoResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 404 | `VIDEO_NOT_FOUND` |

---

### 7.4 `DELETE /api/courses/{courseId:guid}/videos/{id:guid}`

**Auth:** Instructor

**Business Logic:**
1. Soft-delete video record

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": { "message": "Deleted" }
}
```

**Errors:**
| Code | Condition |
|---|---|
| 404 | `VIDEO_NOT_FOUND` |

---

## 8. Document Endpoints

Base: `/api/courses/{courseId:guid}/documents` — **All require `[Authorize(Roles = "Instructor")]`**

### 8.1 `GET /api/courses/{courseId:guid}/documents/{id:guid}`

**Auth:** Instructor

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "title": "Course Notes.pdf",
    "description": "Supplementary material",
    "fileUrl": "https://minio-host/docs/uuid.pdf",
    "fileType": "application/pdf",
    "fileSizeBytes": 2048000,
    "downloadCount": 15,
    "isDownloadable": true,
    "createdAt": "2026-01-15T10:00:00Z"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 404 | `DOCUMENT_NOT_FOUND` |

---

### 8.2 `POST /api/courses/{courseId:guid}/documents`

**Auth:** Instructor

**Request Body:**
```jsonc
{
  "sectionId": "guid",           // required
  "title": "string",             // required
  "description": "string | null", // optional
  "fileId": "guid",              // required, ID of uploaded file
  "isDownloadable": true          // bool, optional, defaults true
}
```

**Business Logic:**
1. Create document record, link to section item

**Success Response — `201 Created`:** `DocumentResponseDto`.

---

### 8.3 `PUT /api/courses/{courseId:guid}/documents/{id:guid}`

**Auth:** Instructor

**Request Body:**
```jsonc
{
  "title": "string",               // required
  "description": "string | null",  // optional
  "isDownloadable": true            // bool, defaults true
}
```

**Success Response — `200 OK`:** Updated `DocumentResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 404 | `DOCUMENT_NOT_FOUND` |

---

### 8.4 `DELETE /api/courses/{courseId:guid}/documents/{id:guid}`

**Auth:** Instructor

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": { "message": "Deleted" }
}
```

**Errors:**
| Code | Condition |
|---|---|
| 404 | `DOCUMENT_NOT_FOUND` |

---

## 9. Quiz Management Endpoints

Base: `/api/courses/{courseId:guid}/quizzes` — **All require `[Authorize(Roles = "Instructor")]`**

### 9.1 `GET /api/courses/{courseId:guid}/quizzes/{id:guid}`

**Auth:** Instructor

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "title": "Chapter 1 Quiz",
    "description": "Test your knowledge",
    "durationMinutes": 30,
    "passingScorePercent": 60,
    "maxAttempts": 3,
    "shuffleQuestions": false,
    "shuffleOptions": false,
    "showResultsImmediately": true,
    "allowReview": true,
    "totalPoints": 10,
    "questionCount": 5,
    "createdAt": "2026-01-15T10:00:00Z",
    "questions": [
      {
        "id": "guid",
        "questionText": "What is ASP.NET Core?",
        "type": "MultipleChoice",
        "points": 2,
        "explanation": "ASP.NET Core is a cross-platform framework",
        "position": 1,
        "options": [
          {
            "id": "guid",
            "optionText": "A web framework",
            "isCorrect": true,
            "position": 1
          }
        ]
      }
    ]
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 404 | `QUIZ_NOT_FOUND` |

---

### 9.2 `POST /api/courses/{courseId:guid}/quizzes`

**Auth:** Instructor

**Request Body:**
```jsonc
{
  "sectionId": "guid",             // required
  "title": "string",               // required
  "description": "string | null",  // optional
  "durationMinutes": 30,           // optional, null = no time limit
  "passingScorePercent": 60,        // optional, defaults 60
  "maxAttempts": 3,                 // optional, null = unlimited
  "shuffleQuestions": false,        // bool, optional
  "shuffleOptions": false,          // bool, optional
  "showResultsImmediately": true,   // bool, optional, defaults true
  "allowReview": true,              // bool, optional, defaults true
  "availableFrom": "2026-01-15T10:00:00Z | null",  // optional
  "availableUntil": "2026-02-15T10:00:00Z | null"  // optional
}
```

**Success Response — `201 Created`:** `QuizResponseDto`.

---

### 9.3 `PUT /api/courses/{courseId:guid}/quizzes/{id:guid}`

**Auth:** Instructor

**Request Body:** Same fields as `CreateQuizDto` (all required, no nullable for simple fields).

**Success Response — `200 OK`:** Updated `QuizResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 404 | `QUIZ_NOT_FOUND` |

---

### 9.4 `DELETE /api/courses/{courseId:guid}/quizzes/{id:guid}`

**Auth:** Instructor

**Business Logic:**
1. Cannot delete quiz with in-progress attempts → 409 `CANNOT_DELETE_QUIZ_WITH_ATTEMPTS`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": { "message": "Deleted" }
}
```

**Errors:**
| Code | Condition |
|---|---|
| 404 | `QUIZ_NOT_FOUND` |
| 409 | `CANNOT_DELETE_QUIZ_WITH_ATTEMPTS` |

---

### 9.5 `POST /api/courses/{courseId:guid}/quizzes/{quizId:guid}/questions`

**Auth:** Instructor

**Request Body:**
```jsonc
{
  "questionText": "string",              // required
  "type": "MultipleChoice",             // required (MultipleChoice | TrueFalse | ShortAnswer)
  "points": 1,                           // optional, defaults 1
  "explanation": "string | null",        // optional
  "position": 1,                          // required
  "options": [
    {
      "optionText": "A web framework",   // required (for MultipleChoice/TrueFalse)
      "isCorrect": true,                 // required
      "position": 1                       // required
    }
  ]
}
```

**Success Response — `201 Created`:** `QuestionResponseDto`.

---

### 9.6 `PUT /api/courses/{courseId:guid}/quizzes/{quizId:guid}/questions/{questionId:guid}`

**Auth:** Instructor

**Request Body:** Same as `CreateQuestionDto`.

**Success Response — `200 OK`:** Updated `QuestionResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 404 | `QUESTION_NOT_FOUND` |

---

### 9.7 `DELETE /api/courses/{courseId:guid}/quizzes/{quizId:guid}/questions/{questionId:guid}`

**Auth:** Instructor

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": { "message": "Deleted" }
}
```

**Errors:**
| Code | Condition |
|---|---|
| 404 | `QUESTION_NOT_FOUND` |

---

## 10. Quiz Attempt Endpoints

Base: `/api/enrollments/{enrollmentId:guid}/quizzes/{quizId:guid}/attempts` — **All require authentication**

### 10.1 `POST /api/enrollments/{enrollmentId:guid}/quizzes/{quizId:guid}/attempts`

**Auth:** Required

**Business Logic:**
1. Verify enrollment exists and user is enrolled
2. Check max attempts not exceeded → 400 `QUIZ_ATTEMPT_MAX_REACHED`
3. Create new attempt with status `InProgress`

**Success Response — `201 Created`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "enrollmentId": "guid",
    "quizId": "guid",
    "attemptNumber": 1,
    "startedAt": "2026-06-26T10:00:00Z",
    "submittedAt": null,
    "scorePercentage": 0,
    "isPassed": false,
    "status": "InProgress"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | `QUIZ_ATTEMPT_MAX_REACHED` |
| 404 | `QUIZ_NOT_FOUND` / `ENROLLMENT_NOT_FOUND` |

---

### 10.2 `PUT /api/enrollments/{enrollmentId:guid}/quizzes/{quizId:guid}/attempts/{attemptId:guid}`

**Auth:** Required

**Request Body:**
```jsonc
{
  "answers": [
    {
      "questionId": "guid",        // required
      "selectedOptionId": "guid | null",    // for MultipleChoice/TrueFalse
      "answerText": "string | null"         // for ShortAnswer
    }
  ]
}
```

**Business Logic:**
1. Attempt must be `InProgress` → 400 `QUIZ_ATTEMPT_ALREADY_SUBMITTED`
2. Auto-grade: calculate score based on correct answers
3. Set `SubmittedAt`, `ScorePercentage`, `IsPassed`, status to `Submitted`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "enrollmentId": "guid",
    "quizId": "guid",
    "attemptNumber": 1,
    "startedAt": "2026-06-26T10:00:00Z",
    "submittedAt": "2026-06-26T10:30:00Z",
    "scorePercentage": 80.0,
    "isPassed": true,
    "status": "Submitted",
    "isAutoSubmitted": false,
    "answers": [
      {
        "questionId": "guid",
        "selectedOptionId": "guid",
        "answerText": null,
        "isCorrect": true,
        "earnedPoints": 2
      }
    ]
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | `QUIZ_ATTEMPT_ALREADY_SUBMITTED` |
| 404 | `QUIZ_ATTEMPT_NOT_FOUND` |

---

### 10.3 `GET /api/enrollments/{enrollmentId:guid}/quizzes/{quizId:guid}/attempts`

**Auth:** Required

**Business Logic:**
1. Return all attempts for this enrollment+quiz

**Success Response — `200 OK`:** Array of `QuizAttemptResponseDto`.

---

### 10.4 `GET /api/enrollments/{enrollmentId:guid}/quizzes/{quizId:guid}/attempts/{attemptId:guid}`

**Auth:** Required

**Business Logic:**
1. Return detailed attempt result including answers

**Success Response — `200 OK`:** `QuizResultDto`.

**Errors:**
| Code | Condition |
|---|---|
| 404 | `QUIZ_ATTEMPT_NOT_FOUND` |

---

## 11. Enrollment Endpoints

Base: `/api/enrollments` — **All require authentication**

### 11.1 `POST /api/enrollments`

**Auth:** Required

**Request Body:**
```jsonc
{
  "courseId": "guid",           // required
  "userId": "guid",             // set from JWT, do not send
  "source": "Purchase"          // optional, defaults Purchase (Purchase | Gift | AdminGrant | Coupon)
}
```

**Business Logic:**
1. `UserId` is overridden from JWT claim (ignores client value)
2. Cannot enroll in unpublished course → 400
3. Cannot enroll if already enrolled → 400 `ALREADY_ENROLLED`

**Success Response — `201 Created`:** `EnrollmentResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | `COURSE_NOT_PUBLISHED` / `ALREADY_ENROLLED` |

---

### 11.2 `GET /api/enrollments`

**Auth:** Required

**Business Logic:**
1. Return all enrollments for the authenticated user

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "userId": "guid",
      "courseId": "guid",
      "courseTitle": "Mastering ASP.NET Core",
      "enrolledAt": "2026-01-20T10:00:00Z",
      "status": "InProgress",
      "progressPercentage": 45.0,
      "completedAt": null,
      "lastAccessedAt": "2026-06-25T08:30:00Z",
      "source": "Purchase",
      "accessExpiresAt": null,
      "isRefunded": false
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

---

### 11.3 `GET /api/enrollments/{id:guid}`

**Auth:** Required

**Business Logic:**
1. Load enrollment details for the authenticated user
2. Includes full progress breakdown

**Success Response — `200 OK`:** `EnrollmentDetailDto` (includes `progresses[]`).

**Errors:**
| Code | Condition |
|---|---|
| 404 | `ENROLLMENT_NOT_FOUND` |

---

### 11.4 `GET /api/enrollments/{enrollmentId:guid}/progress`

**Auth:** Required

**Business Logic:**
1. Return progress for all content items in this enrollment

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "enrollmentId": "guid",
      "contentType": "Video",
      "contentId": "guid",
      "isCompleted": false,
      "watchTimeSeconds": 1200,
      "attemptsCount": 0,
      "completionPercentage": 33.33,
      "metadata": null,
      "lastAccessedAt": "2026-06-25T08:30:00Z",
      "completedAt": null
    }
  ],
  "message": null
}
```

---

### 11.5 `PUT /api/enrollments/{enrollmentId:guid}/progress`

**Auth:** Required

**Request Body:**
```jsonc
{
  "watchTimeSeconds": 1200,       // required
  "completionPercentage": 33.33,  // optional
  "metadata": "string | null",     // optional
  "markAsCompleted": false         // bool, optional
}
```

**Business Logic:**
1. Update progress for the enrollment
2. If `markAsCompleted` is true, set `IsCompleted = true` and `CompletedAt`

**Success Response — `200 OK`:** `ContentProgressDto`.

**Errors:**
| Code | Condition |
|---|---|
| 404 | `ENROLLMENT_NOT_FOUND` |

---

### 11.6 `POST /api/enrollments/{enrollmentId:guid}/progress/{contentType}/{contentId:guid}/complete`

**Auth:** Required

**Path Parameters:**
```jsonc
{
  "contentType": "string",  // required, must be: Video | Quiz | Document | LiveSession
  "contentId": "guid"       // required
}
```

**Business Logic:**
1. Parse `contentType` → 400 `INVALID_CONTENT_TYPE` if invalid
2. Mark the specific content item as completed

**Success Response — `200 OK`:** `ContentProgressDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | `INVALID_CONTENT_TYPE` |
| 404 | `ENROLLMENT_NOT_FOUND` |

---

## 12. DTO Reference

### 12.1 Public Course DTOs

| DTO | Fields |
|---|---|
| **PublicCourseDto** | `id`, `title`, `slug`, `description?`, `courseImageUrl?`, `price`, `isFree` (computed), `level`, `language`, `categoryName`, `categoryId`, `instructorName`, `averageRating`, `enrollmentCount`, `totalDurationMinutes`, `sectionCount`, `lessonCount`, `publishedAt?` |
| **PublicCourseDetailDto** | `id`, `title`, `slug`, `description?`, `courseImageUrl?`, `introVideoUrl?`, `price`, `isFree` (computed), `level`, `language`, `categoryName`, `categoryId`, `instructor: PublicInstructorDto`, `averageRating`, `enrollmentCount`, `totalDurationMinutes`, `requirements[]`, `learningOutcomes[]`, `sections[]: PublicSectionDto`, `version`, `publishedAt?`, `lastContentUpdateAt?` |
| **PublicInstructorDto** | `id`, `fullName`, `bio?`, `profileImageUrl?` |
| **PublicSectionDto** | `id`, `title`, `description?`, `position`, `items[]: PublicSectionItemDto` |
| **PublicSectionItemDto** | `id`, `itemType`, `position`, `isPreviewAllowed` |
| **CourseSuggestionDto** | `id`, `title`, `slug`, `categoryName` |
| **PlatformStatsDto** | `totalCourses`, `totalStudents`, `totalInstructors`, `totalCategories` |
| **FilterOptionsDto** | `categories[]: FilterOptionItem`, `levels[]`, `languages[]`, `minPrice`, `maxPrice` |
| **FilterOptionItem** | `id`, `name`, `courseCount` |
| **PublicCourseFilterDto** | `searchQuery?`, `categoryId?`, `level?`, `language?`, `minPrice?`, `maxPrice?`, `isFreeOnly?`, `minRating?`, `sortBy`, `sortDescending`, `page`, `pageSize` |

### 12.2 Course Management DTOs

| DTO | Fields |
|---|---|
| **CreateCourseDto** | `title`\*, `slug?`, `description?`, `categoryId`\*, `level`, `language`, `price`\* |
| **UpdateCourseDto** | `title?`, `slug?`, `description?`, `categoryId?`, `level?`, `language?`, `price?` |
| **CourseSummaryDto** | `id`, `title`, `slug`, `description?`, `price`, `level`, `language`, `status`, `totalDurationMinutes`, `enrollmentCount`, `averageRating`, `thumbnailUrl?`, `categoryName?`, `createdAt` |
| **CourseDetailsDto** | `id`, `title`, `slug`, `description?`, `categoryId`, `categoryName?`, `createdBy`, `creatorName`, `level`, `language`, `status`, `price`, `imageUrl?`, `courseImageFileId?`, `totalDurationMinutes`, `enrollmentCount`, `averageRating`, `createdAt`, `updatedAt?`, `publishedAt?`, `scheduledDeletionAt?`, `deletionReason?`, `isReadOnlyForStudents`, `rejectionReason?`, `requirements[]`, `learningOutcomes[]` |
| **CourseRequirementDto** | `id`, `requirementText` |
| **CourseLearningOutcomeDto** | `id`, `outcomeText` |
| **AddRequirementDto** | `requirementText`\* |
| **AddLearningOutcomeDto** | `outcomeText`\* |
| **SetCourseImageRequest** | `fileId`\* |
| **ScheduleDeletionDto** | `scheduledDate`\*, `reason?` |
| **ScheduledDeletionStatusDto** | `courseId`, `scheduledDeletionAt?`, `deletionReason?`, `isReadOnlyForStudents`, `isPending` (computed), `isExecuted` (computed), `enrolledStudentCount` |

### 12.3 Section DTOs

| DTO | Fields |
|---|---|
| **SectionDto** | `id`, `courseId`, `title`, `description?`, `position`, `isLocked`, `items[]: SectionItemDto` |
| **SectionItemDto** | `id`, `sectionId`, `itemType`, `itemId`, `position`, `isPreviewAllowed`, `isMandatory` |
| **CreateSectionDto** | `title`\*, `description?` |
| **UpdateSectionDto** | `title`\*, `description?`, `isLocked` |
| **CreateSectionItemDto** | `itemType`\*, `itemId`\*, `isPreviewAllowed`, `isMandatory` |
| **UpdateSectionItemDto** | `isPreviewAllowed`, `isMandatory` |
| **ReorderItemDto** | `id`, `position` |
| **ReorderRequestDto** | `items[]: ReorderItemDto` |

### 12.4 Video DTOs

| DTO | Fields |
|---|---|
| **CreateVideoDto** | `sectionId`\*, `title`\*, `videoFileId`\*, `provider`, `providerVideoId?`, `durationSeconds`\*, `transcript?`, `isPreview` |
| **UpdateVideoDto** | `title`\*, `transcript?`, `isPreview` |
| **VideoResponseDto** | `id`, `title`, `videoUrl?`, `provider`, `durationSeconds`, `quality`, `status`, `isPreview`, `viewCount`, `transcript?`, `createdAt` |

### 12.5 Document DTOs

| DTO | Fields |
|---|---|
| **CreateDocumentDto** | `sectionId`\*, `title`\*, `description?`, `fileId`\*, `isDownloadable` |
| **UpdateDocumentDto** | `title`\*, `description?`, `isDownloadable` |
| **DocumentResponseDto** | `id`, `title`, `description?`, `fileUrl?`, `fileType?`, `fileSizeBytes?`, `downloadCount`, `isDownloadable`, `createdAt` |

### 12.6 Quiz DTOs

| DTO | Fields |
|---|---|
| **CreateQuizDto** | `sectionId`\*, `title`\*, `description?`, `durationMinutes?`, `passingScorePercent`, `maxAttempts?`, `shuffleQuestions`, `shuffleOptions`, `showResultsImmediately`, `allowReview`, `availableFrom?`, `availableUntil?` |
| **UpdateQuizDto** | Same non-nullable fields as CreateQuizDto |
| **QuizResponseDto** | `id`, `title`, `description?`, `durationMinutes?`, `passingScorePercent`, `maxAttempts?`, `shuffleQuestions`, `shuffleOptions`, `showResultsImmediately`, `allowReview`, `totalPoints`, `questionCount`, `createdAt`, `questions[]: QuestionResponseDto` |
| **CreateQuestionDto** | `questionText`\*, `type`, `points`, `explanation?`, `position`, `options[]: CreateOptionDto` |
| **CreateOptionDto** | `optionText`\*, `isCorrect`, `position` |
| **QuestionResponseDto** | `id`, `questionText`, `type`, `points`, `explanation?`, `position`, `options[]: OptionResponseDto` |
| **OptionResponseDto** | `id`, `optionText`, `isCorrect?`, `position` |
| **SubmitAnswerDto** | `questionId`\*, `selectedOptionId?`, `answerText?` |
| **SubmitAttemptDto** | `answers[]: SubmitAnswerDto` |
| **QuizAttemptResponseDto** | `id`, `enrollmentId`, `quizId`, `attemptNumber`, `startedAt`, `submittedAt?`, `scorePercentage`, `isPassed`, `status` |
| **QuizResultDto** (extends QuizAttemptResponseDto) | + `isAutoSubmitted`, `answers[]: AnswerResultDto` |
| **AnswerResultDto** | `questionId`, `selectedOptionId?`, `answerText?`, `isCorrect`, `earnedPoints` |

### 12.7 Enrollment DTOs

| DTO | Fields |
|---|---|
| **CreateEnrollmentDto** | `courseId`\*, `userId` (set from JWT), `source` |
| **EnrollmentResponseDto** | `id`, `userId`, `courseId`, `courseTitle`, `enrolledAt`, `status`, `progressPercentage`, `completedAt?`, `lastAccessedAt?`, `source`, `accessExpiresAt?`, `isRefunded` |
| **EnrollmentDetailDto** | Same as EnrollmentResponseDto + `progresses[]: ContentProgressDto` |
| **ContentProgressDto** | `id`, `enrollmentId`, `contentType`, `contentId`, `isCompleted`, `watchTimeSeconds`, `attemptsCount`, `completionPercentage`, `metadata?`, `lastAccessedAt?`, `completedAt?` |
| **UpdateProgressDto** | `watchTimeSeconds`, `completionPercentage?`, `metadata?`, `markAsCompleted` |

### 12.8 Edit Request DTOs

| DTO | Fields |
|---|---|
| **EditResultDto** | `appliedImmediately`, `requestId?`, `status?`, `message`, `processedAt` |
| **EditRequestSummaryDto** | `id`, `courseTitle`, `instructorName`, `requestType`, `operation`, `status`, `requestedAt`, `timeUntilExpiry`, `isEmergency` |
| **EditRequestDetailDto** | `requestId`, `courseId`, `courseTitle`, `instructorId`, `instructorName`, `targetType`, `operation`, `changes[]: FieldChangeDto`, `requestedAt`, `expiresAt?`, `riskLevel` |
| **FieldChangeDto** | `fieldName`, `fieldLabel`, `oldValue?`, `newValue?`, `changeType` |
| **EditRequestFilterDto** | `status?`, `requestType?`, `courseId?`, `instructorId?`, `page`, `pageSize` |
| **ReviewRequestDto** | `approve`\*, `notes?` |
| **RejectCourseRequest** | `reason`\* |

### 12.9 Common / Infrastructure

| DTO | Fields |
|---|---|
| **PagedList\<T\>** | `items: T[]`, `page`, `pageSize`, `totalCount`, `totalPages` (computed), `hasPreviousPage` (computed), `hasNextPage` (computed) |
| **ApiResponse\<T\>** | `success`, `data: T?`, `message?`, `errorCode?`, `errors[]?` |

---

## 13. Enums Reference

### CourseDomain enums:

| Enum | Values |
|---|---|
| **CourseStatus** | `Draft`, `PendingReview`, `Published`, `Archived` |
| **CourseLevel** | `Beginner`, `Intermediate`, `Advanced` |
| **CourseLanguage** | `Ar`, `En` |
| **ContentType** | `Video`, `Quiz`, `Document`, `LiveSession` |
| **SectionItemType** | `Video`, `Quiz`, `Document`, `LiveSession` |
| **EnrollmentStatus** | `InProgress`, `Completed`, `Expired`, `Refunded` |
| **EnrollmentSource** | `Purchase`, `Gift`, `AdminGrant`, `Coupon` |
| **QuestionType** | `MultipleChoice`, `TrueFalse`, `ShortAnswer` |
| **QuizAttemptStatus** | `InProgress`, `Submitted`, `Graded` |
| **VideoProvider** | `Local`, `YouTube`, `Vimeo`, `Minio` |
| **VideoQuality** | `_720p`, `_1080p`, `_4k` |
| **VideoStatus** | `Processing`, `Ready`, `Failed` |

### Edit Request enums:

| Enum | Values |
|---|---|
| **EditRequestType** | `Section`, `SectionItem`, `CourseProperty` |
| **EditRequestStatus** | `Pending`, `Approved`, `Rejected`, `Cancelled`, `Expired` |
| **EditOperation** | `Create`, `Update`, `Delete` |
| **EditRiskLevel** | `Low`, `Medium`, `High`, `Critical` |
| **ChangeType** | `Added`, `Modified`, `Deleted` |

### Public course filter enums:

| Enum | Values |
|---|---|
| **PublicCourseSortBy** | `PublishedAt`, `Price`, `AverageRating`, `EnrollmentCount`, `Title` |

---

## 14. Endpoint Summary Table

| # | Method | Route | Auth | Roles | Description |
|---|---|---|---|---|---|
| **Public** | | | | | |
| 3.1 | `GET` | `/api/public/courses` | No | — | List published courses (filtered, paged) |
| 3.2 | `GET` | `/api/public/courses/{id:guid}` | No | — | Get course details by ID |
| 3.3 | `GET` | `/api/public/courses/slug/{slug}` | No | — | Get course details by slug |
| 3.4 | `GET` | `/api/public/courses/search/suggest` | No | — | Search suggestions |
| 3.5 | `GET` | `/api/public/courses/stats` | No | — | Get platform stats |
| 3.6 | `GET` | `/api/public/courses/{id:guid}/related` | No | — | Get related courses |
| 3.7 | `GET` | `/api/public/courses/filters/options` | No | — | Get filter options |
| **Management** | | | | | |
| 4.1 | `POST` | `/api/management/courses` | Yes | — | Create course |
| 4.2 | `GET` | `/api/management/courses/{id:guid}` | Yes | — | Get course details |
| 4.3 | `PUT` | `/api/management/courses/{id:guid}` | Yes | — | Update course (partial) |
| 4.4 | `POST` | `/api/management/courses/{id:guid}/requirements` | Yes | — | Add requirement |
| 4.5 | `DELETE` | `/api/management/courses/{id:guid}/requirements/{requirementId:guid}` | Yes | — | Remove requirement |
| 4.6 | `POST` | `/api/management/courses/{id:guid}/outcomes` | Yes | — | Add learning outcome |
| 4.7 | `DELETE` | `/api/management/courses/{id:guid}/outcomes/{outcomeId:guid}` | Yes | — | Remove learning outcome |
| 4.8 | `POST` | `/api/management/courses/{id:guid}/submit-for-review` | Yes | — | Submit course for review |
| 4.9 | `DELETE` | `/api/management/courses/{id:guid}` | Yes | — | Delete course |
| 4.10 | `POST` | `/api/management/courses/{id:guid}/schedule-deletion` | Yes | — | Schedule course deletion |
| 4.11 | `POST` | `/api/management/courses/{id:guid}/cancel-scheduled-deletion` | Yes | — | Cancel scheduled deletion |
| 4.12 | `GET` | `/api/management/courses/{id:guid}/deletion-status` | Yes | — | Get deletion status |
| 4.13 | `PUT` | `/api/management/courses/{courseId:guid}/image` | Yes | — | Set course image |
| **Admin** | | | | | |
| 5.1 | `POST` | `/api/admin/courses/{id:guid}/approve` | Yes | Admin | Approve course |
| 5.2 | `POST` | `/api/admin/courses/{id:guid}/reject` | Yes | Admin | Reject course |
| 5.3 | `GET` | `/api/admin/courses/edit-requests` | Yes | Admin | List edit requests |
| 5.4 | `GET` | `/api/admin/courses/edit-requests/{requestId:guid}` | Yes | Admin | Get edit request details |
| 5.5 | `POST` | `/api/admin/courses/edit-requests/{requestId:guid}/review` | Yes | Admin | Review edit request |
| **Sections** | | | | | |
| 6.1 | `GET` | `/api/management/courses/{courseId:guid}/sections` | Yes | — | List sections |
| 6.2 | `POST` | `/api/management/courses/{courseId:guid}/sections` | Yes | — | Create section |
| 6.3 | `GET` | `/api/management/courses/{courseId:guid}/sections/{sectionId:guid}` | Yes | — | Get section by ID |
| 6.4 | `PUT` | `/api/management/courses/{courseId:guid}/sections/{sectionId:guid}` | Yes | — | Update section |
| 6.5 | `DELETE` | `/api/management/courses/{courseId:guid}/sections/{sectionId:guid}` | Yes | — | Delete section |
| 6.6 | `PUT` | `/api/management/courses/{courseId:guid}/sections/reorder` | Yes | — | Reorder sections |
| 6.7 | `POST` | `/api/management/courses/{courseId:guid}/sections/{sectionId:guid}/items` | Yes | — | Add item to section |
| 6.8 | `PUT` | `/api/management/courses/{courseId:guid}/sections/{sectionId:guid}/items/{itemId:guid}` | Yes | — | Update section item |
| 6.9 | `DELETE` | `/api/management/courses/{courseId:guid}/sections/{sectionId:guid}/items/{itemId:guid}` | Yes | — | Delete section item |
| 6.10 | `PUT` | `/api/management/courses/{courseId:guid}/sections/{sectionId:guid}/items/reorder` | Yes | — | Reorder section items |
| **Videos** | | | | | |
| 7.1 | `GET` | `/api/courses/{courseId:guid}/videos/{id:guid}` | Yes | Instructor | Get video |
| 7.2 | `POST` | `/api/courses/{courseId:guid}/videos` | Yes | Instructor | Create video |
| 7.3 | `PUT` | `/api/courses/{courseId:guid}/videos/{id:guid}` | Yes | Instructor | Update video |
| 7.4 | `DELETE` | `/api/courses/{courseId:guid}/videos/{id:guid}` | Yes | Instructor | Delete video |
| **Documents** | | | | | |
| 8.1 | `GET` | `/api/courses/{courseId:guid}/documents/{id:guid}` | Yes | Instructor | Get document |
| 8.2 | `POST` | `/api/courses/{courseId:guid}/documents` | Yes | Instructor | Create document |
| 8.3 | `PUT` | `/api/courses/{courseId:guid}/documents/{id:guid}` | Yes | Instructor | Update document |
| 8.4 | `DELETE` | `/api/courses/{courseId:guid}/documents/{id:guid}` | Yes | Instructor | Delete document |
| **Quizzes** | | | | | |
| 9.1 | `GET` | `/api/courses/{courseId:guid}/quizzes/{id:guid}` | Yes | Instructor | Get quiz |
| 9.2 | `POST` | `/api/courses/{courseId:guid}/quizzes` | Yes | Instructor | Create quiz |
| 9.3 | `PUT` | `/api/courses/{courseId:guid}/quizzes/{id:guid}` | Yes | Instructor | Update quiz |
| 9.4 | `DELETE` | `/api/courses/{courseId:guid}/quizzes/{id:guid}` | Yes | Instructor | Delete quiz |
| 9.5 | `POST` | `/api/courses/{courseId:guid}/quizzes/{quizId:guid}/questions` | Yes | Instructor | Add question |
| 9.6 | `PUT` | `/api/courses/{courseId:guid}/quizzes/{quizId:guid}/questions/{questionId:guid}` | Yes | Instructor | Update question |
| 9.7 | `DELETE` | `/api/courses/{courseId:guid}/quizzes/{quizId:guid}/questions/{questionId:guid}` | Yes | Instructor | Delete question |
| **Quiz Attempts** | | | | | |
| 10.1 | `POST` | `/api/enrollments/{enrollmentId:guid}/quizzes/{quizId:guid}/attempts` | Yes | — | Start quiz attempt |
| 10.2 | `PUT` | `/api/enrollments/{enrollmentId:guid}/quizzes/{quizId:guid}/attempts/{attemptId:guid}` | Yes | — | Submit quiz attempt |
| 10.3 | `GET` | `/api/enrollments/{enrollmentId:guid}/quizzes/{quizId:guid}/attempts` | Yes | — | List attempts |
| 10.4 | `GET` | `/api/enrollments/{enrollmentId:guid}/quizzes/{quizId:guid}/attempts/{attemptId:guid}` | Yes | — | Get attempt result |
| **Enrollments** | | | | | |
| 11.1 | `POST` | `/api/enrollments` | Yes | — | Enroll in course |
| 11.2 | `GET` | `/api/enrollments` | Yes | — | List my enrollments |
| 11.3 | `GET` | `/api/enrollments/{id:guid}` | Yes | — | Get enrollment details |
| 11.4 | `GET` | `/api/enrollments/{enrollmentId:guid}/progress` | Yes | — | Get enrollment progress |
| 11.5 | `PUT` | `/api/enrollments/{enrollmentId:guid}/progress` | Yes | — | Update progress |
| 11.6 | `POST` | `/api/enrollments/{enrollmentId:guid}/progress/{contentType}/{contentId:guid}/complete` | Yes | — | Mark content as completed |
