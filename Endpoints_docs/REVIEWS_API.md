# Athary Platform — Reviews API Documentation

> **Base URL:** `http://<host>:5000`
> **Response Envelope:** All responses wrapped in `ApiResponse<T>`

```jsonc
{
  "success": true,
  "data": null,
  "message": null,
  "errorCode": null,
  "errors": null
}
```

---

## Table of Contents

1. [Error Codes](#1-error-codes)
2. [Reviews Endpoints](#2-reviews-endpoints)
3. [Video Comments Endpoints](#3-video-comments-endpoints)
4. [Enums Reference](#4-enums-reference)
5. [DTO Reference](#5-dto-reference)
6. [Endpoint Summary Table](#6-endpoint-summary-table)

---

## 1. Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| **Review** | | |
| `ALREADY_REVIEWED` | 400 | User already reviewed this course |
| `REVIEW_NOT_FOUND` | 404 | Review not found |
| `REVIEW_FLAG_PERMISSION_DENIED` | 403 | User cannot flag this review |
| `INVALID_REVIEW_STATUS` | 400 | Invalid moderation status |
| **Video Comment** | | |
| `PARENT_COMMENT_NOT_FOUND` | 404 | Parent comment not found for reply |
| `COMMENT_NOT_FOUND` | 404 | Comment not found |
| **General** | | |
| `VALIDATION_ERROR` | 400 | FluentValidation or argument error |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

---

## 2. Reviews Endpoints

### 2.1 `POST /api/reviews`

**Auth:** Required

**Request Body:**
```jsonc
{
  "courseId": "guid",       // required
  "rating": 5,              // required, 1-5
  "comment": "string | null" // optional, max 2000
}
```

**Business Logic:**
1. Extract userId from JWT
2. Validate rating (1-5) and comment length (max 2000)
3. Check user is enrolled in course → error if not
4. Check no existing review by user for this course → `ALREADY_REVIEWED` if exists
5. Create review with `Status = Pending`, `IsVerified = true` if user completed course
6. Log activity "CreatedReview"

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "userId": "guid",
    "userFullName": "John Doe",
    "courseId": "guid",
    "courseTitle": "Course Title",
    "rating": 5,
    "comment": "Great course!",
    "status": "Pending",
    "isVerified": false,
    "helpfulCount": 0,
    "notHelpfulCount": 0,
    "isFlagged": false,
    "createdAt": "2026-06-26T10:00:00Z",
    "updatedAt": null
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Already reviewed / validation failure |
| 401 | Missing/invalid JWT |

### 2.2 `GET /api/reviews/course/{courseId}`

**Auth:** Anonymous

**Query Parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | int | 1 | Page number |
| `pageSize` | int | 10 | Items per page |

**Business Logic:**
1. Returns approved reviews for a course (paginated)

**Success Response — `200 OK`:** Returns `List<ReviewResponse>`.

**Errors:**
| Code | Condition |
|---|---|
| 500 | Server error |

### 2.3 `GET /api/reviews/{id}`

**Auth:** Anonymous

**Business Logic:**
1. Returns full review details including moderation info

**Success Response — `200 OK`:** Returns `ReviewDetailResponse` (same as `ReviewResponse` plus `moderatedAt`, `moderatedBy`, `moderatorName`, `deletedAt`, `flaggedBy`, `flaggedAt`).

**Errors:**
| Code | Condition |
|---|---|
| 404 | Review not found |

### 2.4 `PUT /api/reviews/{id}`

**Auth:** Required

**Request Body:** Same as `CreateReviewRequest`.

**Business Logic:**
1. Verify review ownership (userId matches)
2. Update rating and/or comment
3. Reset status to `Pending` (requires re-moderation)

**Success Response — `200 OK`:** Returns `ReviewResponse`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure |
| 401 | Missing/invalid JWT |
| 404 | Review not found |

### 2.5 `DELETE /api/reviews/{id}`

**Auth:** Required

**Business Logic:**
1. Verify review ownership (userId matches)
2. Soft delete (sets `DeletedAt`)

**Success Response — `204 No Content`**

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Review not found |

### 2.6 `POST /api/reviews/{id}/helpful`

**Auth:** Required

**Request Body:**
```jsonc
{
  "isHelpful": true    // bool, required
}
```

**Business Logic:**
1. Toggle helpful/not-helpful vote
2. If user already voted with same value → remove vote
3. If user voted opposite → switch vote count

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "message": "Helpful status updated."
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Review not found |

### 2.7 `POST /api/reviews/{id}/flag`

**Auth:** Required, Role: Instructor

**Business Logic:**
1. Only instructors can flag reviews
2. Set `IsFlagged = true`, `FlaggedBy`, `FlaggedAt`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "message": "Review flagged for moderation."
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 403 | Not an instructor |
| 404 | Review not found |

### 2.8 `GET /api/reviews/pending`

**Auth:** Required, Role: Admin

**Business Logic:**
1. Returns all reviews with `Status = Pending` (not deleted, not flagged)

**Success Response — `200 OK`:** Returns `List<ReviewDetailResponse>`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 403 | Not an admin |

### 2.9 `PUT /api/reviews/{id}/moderate`

**Auth:** Required, Role: Admin

**Request Body:**
```jsonc
{
  "status": "Approved"    // string: "Approved" | "Rejected"
}
```

**Business Logic:**
1. Set review status to Approved or Rejected
2. Record `ModeratedBy` and `ModeratedAt`

**Success Response — `200 OK`:** Returns `ReviewResponse`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid review status |
| 401 | Missing/invalid JWT |
| 403 | Not an admin |
| 404 | Review not found |

---

## 3. Video Comments Endpoints

### 3.1 `GET /api/videos/{videoId}/comments`

**Auth:** Anonymous (optional auth for user-specific data)

**Path Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `videoId` | guid | Video ID |

**Business Logic:**
1. If user is authenticated, pass userId for like-status detection
2. Returns top-level comments with nested replies

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "videoId": "guid",
      "userId": "guid",
      "userName": "John Doe",
      "content": "Great video!",
      "isEdited": false,
      "likesCount": 5,
      "repliesCount": 2,
      "createdAt": "2026-06-26T10:00:00Z",
      "updatedAt": null,
      "parentCommentId": null,
      "replies": [
        {
          "id": "guid",
          "videoId": "guid",
          "userId": "guid",
          "userName": "Jane Doe",
          "content": "I agree!",
          "isEdited": false,
          "likesCount": 1,
          "repliesCount": 0,
          "createdAt": "2026-06-26T11:00:00Z",
          "updatedAt": null,
          "parentCommentId": "guid",
          "replies": null
        }
      ]
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 500 | Server error |

### 3.2 `POST /api/videos/{videoId}/comments`

**Auth:** Required

**Request Body:**
```jsonc
{
  "content": "string",               // required, max 2000
  "parentCommentId": "guid | null"   // optional, for replies
}
```

**Business Logic:**
1. Validate content (non-empty, max 2000 chars)
2. If `parentCommentId` provided → validate parent exists → 404 if not
3. Create comment (or reply)

**Success Response — `201 Created`:** Returns `CommentResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure |
| 401 | Missing/invalid JWT |
| 404 | Parent comment not found |

### 3.3 `PUT /api/videos/{videoId}/comments/{commentId}`

**Auth:** Required

**Request Body:**
```jsonc
{
  "content": "string",               // required, max 2000
  "parentCommentId": "guid | null"
}
```

**Business Logic:**
1. Verify comment ownership (userId matches)
2. Update content, set `IsEdited = true`

**Success Response — `200 OK`:** Returns `CommentResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure |
| 401 | Missing/invalid JWT |
| 404 | Comment not found |

### 3.4 `DELETE /api/videos/{videoId}/comments/{commentId}`

**Auth:** Required

**Business Logic:**
1. Verify comment ownership (userId matches)
2. Soft delete → 404 if not found

**Success Response — `204 No Content`**

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Comment not found |

### 3.5 `POST /api/videos/{videoId}/comments/{commentId}/like`

**Auth:** Required

**Business Logic:**
1. Toggle like on comment
2. If already liked → unlike (decrement)
3. If not liked → like (increment)

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "commentId": "guid",
    "likesCount": 6,
    "isLikedByCurrentUser": true
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Comment not found |

---

## 4. Enums Reference

### 4.1 ReviewStatus

| Value | Description |
|---|---|
| `Pending` | Awaiting moderation |
| `Approved` | Visible to public |
| `Rejected` | Hidden, rejected by admin |

---

## 5. DTO Reference

### 5.1 Review DTOs

| DTO | Fields |
|---|---|
| **CreateReviewRequest** | `courseId`\*, `rating`\* (1-5), `comment?` (max 2000) |
| **ReviewResponse** | `id`, `userId`, `userFullName`, `courseId`, `courseTitle`, `rating`, `comment?`, `status`, `isVerified`, `helpfulCount`, `notHelpfulCount`, `isFlagged`, `createdAt`, `updatedAt?` |
| **ReviewDetailResponse** | All `ReviewResponse` fields + `moderatedAt?`, `moderatedBy?`, `moderatorName?`, `deletedAt?`, `flaggedBy?`, `flaggedAt?` |
| **ReviewHelpfulRequest** | `isHelpful`\* |
| **ModerateReviewRequest** | `status`\* ("Approved" / "Rejected") |

### 5.2 Video Comment DTOs

| DTO | Fields |
|---|---|
| **CreateCommentDto** | `content`\*, `parentCommentId?` |
| **CommentResponseDto** | `id`, `videoId`, `userId`, `userName`, `content`, `isEdited`, `likesCount`, `repliesCount`, `createdAt`, `updatedAt?`, `parentCommentId?`, `replies?` |
| **CommentLikeResponseDto** | `commentId`, `likesCount`, `isLikedByCurrentUser` |

---

## 6. Endpoint Summary Table

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/reviews` | Yes | — | Create a review |
| `GET` | `/api/reviews/course/{courseId}` | No | — | List course reviews (paginated) |
| `GET` | `/api/reviews/{id}` | No | — | Get review details |
| `PUT` | `/api/reviews/{id}` | Yes | — | Update own review |
| `DELETE` | `/api/reviews/{id}` | Yes | — | Delete own review |
| `POST` | `/api/reviews/{id}/helpful` | Yes | — | Toggle helpful/not-helpful |
| `POST` | `/api/reviews/{id}/flag` | Yes | Instructor | Flag review for moderation |
| `GET` | `/api/reviews/pending` | Yes | Admin | List pending reviews |
| `PUT` | `/api/reviews/{id}/moderate` | Yes | Admin | Moderate review (approve/reject) |
| `GET` | `/api/videos/{videoId}/comments` | No* | — | List video comments |
| `POST` | `/api/videos/{videoId}/comments` | Yes | — | Add comment/reply |
| `PUT` | `/api/videos/{videoId}/comments/{commentId}` | Yes | — | Update comment |
| `DELETE` | `/api/videos/{videoId}/comments/{commentId}` | Yes | — | Delete comment |
| `POST` | `/api/videos/{videoId}/comments/{commentId}/like` | Yes | — | Toggle like on comment |

\* `GET /api/videos/{videoId}/comments` is anonymous but includes user-specific like status when authenticated.
