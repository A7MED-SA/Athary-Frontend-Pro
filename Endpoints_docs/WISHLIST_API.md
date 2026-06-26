# Athary Platform — Wishlist API Documentation

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
2. [Wishlist Endpoints](#2-wishlist-endpoints)
3. [DTO Reference](#3-dto-reference)
4. [Endpoint Summary Table](#4-endpoint-summary-table)

---

## 1. Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| `COURSE_ALREADY_IN_WISHLIST` | 400 | Course already exists in wishlist |
| `WISHLIST_ITEM_NOT_FOUND` | 404 | Wishlist item not found |
| `COURSE_NOT_FOUND` | 404 | Course not found |
| `VALIDATION_ERROR` | 400 | FluentValidation or argument error |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

---

## 2. Wishlist Endpoints

All endpoints require authentication.

### 2.1 `GET /api/wishlist`

**Auth:** Required

**Business Logic:**
1. Load all wishlist items for current user
2. Include course title, image, instructor name, and price
3. Ordered by `AddedAt` descending

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "guid",
        "courseId": "guid",
        "courseTitle": "Introduction to Arabic Calligraphy",
        "courseImageUrl": "/api/files/guid/download",
        "instructorName": "John Doe",
        "price": 99.99,
        "addedAt": "2026-06-26T10:00:00Z"
      }
    ],
    "count": 1
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

### 2.2 `POST /api/wishlist/{courseId}`

**Auth:** Required

**Path Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `courseId` | guid | Course to add to wishlist |

**Business Logic:**
1. Validate course exists → 404 if not
2. Check course not already in wishlist → `COURSE_ALREADY_IN_WISHLIST` if exists
3. Add item to wishlist

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "courseId": "guid",
    "courseTitle": "Introduction to Arabic Calligraphy",
    "courseImageUrl": "/api/files/guid/download",
    "instructorName": "John Doe",
    "price": 99.99,
    "addedAt": "2026-06-26T10:00:00Z"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Course already in wishlist |
| 401 | Missing/invalid JWT |
| 404 | Course not found |

### 2.3 `DELETE /api/wishlist/{courseId}`

**Auth:** Required

**Path Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `courseId` | guid | Course to remove from wishlist |

**Business Logic:**
1. Find wishlist item by userId + courseId → 404 if not found
2. Hard delete the item

**Success Response — `204 No Content`**

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Wishlist item not found |

---

## 3. DTO Reference

| DTO | Fields |
|---|---|
| **WishlistResponseDto** | `items: WishlistItemDto[]`, `count` |
| **WishlistItemDto** | `id`, `courseId`, `courseTitle`, `courseImageUrl?`, `instructorName?`, `price`, `addedAt` |

---

## 4. Endpoint Summary Table

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/wishlist` | Yes | Get user's wishlist |
| `POST` | `/api/wishlist/{courseId}` | Yes | Add course to wishlist |
| `DELETE` | `/api/wishlist/{courseId}` | Yes | Remove course from wishlist |
