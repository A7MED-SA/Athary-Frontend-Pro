# Athary Platform — Management Courses API Documentation

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
2. [Management Courses Endpoints](#2-management-courses-endpoints)
3. [DTO Reference](#3-dto-reference)
4. [Endpoint Summary Table](#4-endpoint-summary-table)

---

## 1. Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| **Courses - General** | | |
| `COURSE_NOT_FOUND` | 404 | Course not found |
| `COURSE_NOT_PUBLISHED` | 400 | Course not published |
| `COURSE_NOT_PENDING` | 400 | Course not in pending status |
| `COURSE_PERMISSION_DENIED` | 403 | User doesn't own this course |
| `COURSE_HAS_NO_IMAGE` | 400 | Course has no image |
| `CANNOT_DELETE_PUBLISHED_COURSE` | 400 | Cannot delete a published course |
| `INVALID_SCHEDULED_DATE` | 400 | Invalid scheduled date |
| `COURSE_HAS_SCHEDULED_DELETION` | 400 | Course already has scheduled deletion |
| **Courses - Section** | | |
| `SECTION_NOT_FOUND` | 404 | Section not found |
| `SECTION_PERMISSION_DENIED` | 403 | User doesn't own this section |
| `SECTION_ITEM_NOT_FOUND` | 404 | Section item not found |
| **Courses - Video** | | |
| `VIDEO_NOT_FOUND` | 404 | Video not found |
| **Courses - Document** | | |
| `DOCUMENT_NOT_FOUND` | 404 | Document not found |
| **Courses - Quiz** | | |
| `QUIZ_NOT_FOUND` | 404 | Quiz not found |
| `QUESTION_NOT_FOUND` | 404 | Question not found |
| `QUIZ_ATTEMPT_MAX_REACHED` | 400 | Max quiz attempts reached |
| `QUIZ_ATTEMPT_NOT_FOUND` | 404 | Quiz attempt not found |
| `QUIZ_ATTEMPT_ALREADY_SUBMITTED` | 400 | Quiz already submitted |
| `CANNOT_DELETE_QUIZ_WITH_ATTEMPTS` | 400 | Cannot delete quiz with existing attempts |
| `INVALID_CONTENT_TYPE` | 400 | Invalid content type |
| **Courses - Edit Request** | | |
| `EDIT_REQUEST_NOT_FOUND` | 404 | Edit request not found |

---

## 2. Management Courses Endpoints

All management endpoints require `Instructor` role.

### 2.1 `GET /api/management/courses`

**Auth:** Instructor

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Return all courses owned by the instructor with management metadata

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "title": "Introduction to Programming",
      "slug": "introduction-to-programming",
      "description": "A comprehensive programming course",
      "thumbnailUrl": "https://minio-host/thumbnails/abc.jpg",
      "price": 99.99,
      "status": "Published",
      "categoryName": "Computer Science",
      "totalDurationMinutes": 840,
      "enrollmentCount": 1250,
      "averageRating": 4.7,
      "revenue": 124987.50,
      "sectionCount": 12,
      "lessonCount": 48,
      "createdAt": "2026-01-15T00:00:00Z",
      "publishedAt": "2026-02-01T00:00:00Z",
      "updatedAt": "2026-06-20T10:00:00Z"
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-instructor) |

---

### 2.2 Reuse These DTOs From Dashboard

The `ManagementCourseDto` is shared with the instructor dashboard. It provides a comprehensive view of each course including:

| Field | Description |
|---|---|
| `id` | Course unique identifier |
| `title` | Course title |
| `slug` | URL-friendly slug |
| `description?` | Course description |
| `thumbnailUrl?` | Course thumbnail image URL |
| `price` | Course price |
| `status` | Course status (Draft, Pending, Published, etc.) |
| `categoryName` | Category display name |
| `totalDurationMinutes` | Total video duration |
| `enrollmentCount` | Number of enrolled students |
| `averageRating` | Average review rating |
| `revenue` | Total revenue generated |
| `sectionCount` | Number of sections |
| `lessonCount` | Total lessons across all sections |
| `createdAt` | Creation timestamp |
| `publishedAt?` | Publication timestamp |
| `updatedAt?` | Last update timestamp |

---

## 3. DTO Reference

### 3.1 Response DTOs

| DTO | Fields |
|---|---|
| **ManagementCourseDto** | `id`, `title`, `slug`, `description?`, `thumbnailUrl?`, `price`, `status`, `categoryName`, `totalDurationMinutes`, `enrollmentCount`, `averageRating`, `revenue`, `sectionCount`, `lessonCount`, `createdAt`, `publishedAt?`, `updatedAt?` |

---

## 4. Endpoint Summary Table

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/management/courses` | Instructor | List managed courses with details |
