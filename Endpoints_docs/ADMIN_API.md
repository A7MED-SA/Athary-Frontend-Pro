# Athary Platform — Admin Management API Documentation

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
2. [User Management Endpoints](#2-user-management-endpoints)
3. [Contact Messages Endpoints](#3-contact-messages-endpoints)
4. [Testimonials Endpoints](#4-testimonials-endpoints)
5. [DTO Reference](#5-dto-reference)
6. [Endpoint Summary Table](#6-endpoint-summary-table)

---

## 1. Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| **General** | | |
| `USER_NOT_FOUND` | 404 | User not found |
| `ALREADY_ADMIN` | 400 | User is already an admin |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |
| **Contact** | | |
| `CONTACT_MESSAGE_NOT_FOUND` | 404 | Contact message not found |
| `SPAM_CONTENT_DETECTED` | 400 | Spam content detected |

---

## 2. User Management Endpoints

All user management endpoints require `Admin` role.

### 2.1 `GET /api/admin/users`

**Auth:** Admin

**Query Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| `search` | string | No | Search by name or email |
| `role` | string | No | Filter by role |
| `isActive` | bool | No | Filter by active status |
| `page` | int | No | Page number (default 1) |
| `pageSize` | int | No | Page size (default 20) |

**Business Logic:**
1. Return paginated, filterable list of all users

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "guid",
        "email": "john@example.com",
        "fullName": "John Doe",
        "profilePictureUrl": null,
        "isActive": true,
        "emailConfirmed": true,
        "createdAt": "2026-01-01T00:00:00Z",
        "lastLogin": "2026-06-26T08:00:00Z",
        "roles": ["Student"]
      }
    ],
    "page": 1,
    "pageSize": 20,
    "totalCount": 1500,
    "totalPages": 75,
    "hasPreviousPage": false,
    "hasNextPage": true
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |

---

### 2.2 `GET /api/admin/users/{userId:guid}`

**Auth:** Admin

**Business Logic:**
1. Return user details by ID

**Success Response — `200 OK`:** Returns `AdminUserListItemDto`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |
| 404 | User not found |

---

### 2.3 `PATCH /api/admin/users/{userId:guid}/toggle-active`

**Auth:** Admin

**Business Logic:**
1. Toggle the `IsActive` flag on the user account
2. If deactivating, all active sessions are invalidated

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": true,          // new active state
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |
| 404 | User not found |

---

### 2.4 `DELETE /api/admin/users/{userId:guid}`

**Auth:** Admin

**Business Logic:**
1. Soft-delete the user (sets `DeletedAt`)
2. Revoke all active sessions

**Success Response — `204 No Content`:** No body.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |
| 404 | User not found |

---

### 2.5 `POST /api/admin/users/{userId:guid}/make-admin`

**Auth:** Admin

**Business Logic:**
1. Find user by ID (must not be soft-deleted)
2. Check if user already has `Admin` role → 400 `ALREADY_ADMIN`
3. Assign `Admin` role via `UserManager.AddToRoleAsync()`
4. Return updated user data with new roles list

**Success Response — `200 OK`:** Returns `AdminUserListItemDto` with roles including "Admin".

**Errors:**
| Code | Condition |
|---|---|
| 400 | User is already an admin |
| 401 | Missing/invalid JWT (non-admin) |
| 404 | User not found |

---

## 3. Contact Messages Endpoints

All contact message endpoints require `Admin` role.

### 3.1 `GET /api/admin/contact`

**Auth:** Admin

**Query Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| `isRead` | bool | No | Filter by read status |

**Business Logic:**
1. Return all contact messages (submitted from public contact form)
2. Optionally filter by read/unread status

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+201234567890",
      "subject": "Course Inquiry",
      "message": "I have a question about...",
      "isRead": false,
      "createdAt": "2026-06-26T10:00:00Z"
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |

---

### 3.2 `PUT /api/admin/contact/{id:guid}/mark-read`

**Auth:** Admin

**Business Logic:**
1. Mark a contact message as read

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Message marked as read"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |
| 404 | Contact message not found |

---

### 3.3 `DELETE /api/admin/contact/{id:guid}`

**Auth:** Admin

**Business Logic:**
1. Delete a contact message

**Success Response — `204 No Content`:** No body.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |
| 404 | Contact message not found |

---

## 4. Testimonials Endpoints

All testimonial endpoints require `Admin` role.

### 4.1 `GET /api/admin/testimonials`

**Auth:** Admin

**Query Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| `isApproved` | bool | No | Filter by approval status |

**Business Logic:**
1. Return all testimonials, optionally filtered by approval status

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "content": "Great platform!",
      "rating": 5,
      "userName": "John Doe",
      "userAvatar": null,
      "displayOrder": 1,
      "createdAt": "2026-06-01T00:00:00Z"
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |

---

### 4.2 `PUT /api/admin/testimonials/{id:guid}`

**Auth:** Admin

**Request Body (all fields optional — partial update):**
```jsonc
{
  "content": "Updated testimonial",   // optional, string?
  "rating": 4,                        // optional, int?
  "isApproved": true,                 // optional, bool?
  "displayOrder": 2                   // optional, int?
}
```

**Business Logic:**
1. Update testimonial fields (only non-null fields are applied)

**Success Response — `200 OK`:** Returns `TestimonialDto`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |
| 404 | Testimonial not found |

---

### 4.3 `DELETE /api/admin/testimonials/{id:guid}`

**Auth:** Admin

**Business Logic:**
1. Delete testimonial

**Success Response — `204 No Content`:** No body.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |
| 404 | Testimonial not found |

---

### 4.4 `PATCH /api/admin/testimonials/{id:guid}/approve`

**Auth:** Admin

**Business Logic:**
1. Set testimonial as approved for public display

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Testimonial approved"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |
| 404 | Testimonial not found |

---

### 4.5 `PATCH /api/admin/testimonials/{id:guid}/flag`

**Auth:** Admin

**Request Body (raw string):**
```jsonc
"reason"    // required, the flag reason as plain string
```

**Business Logic:**
1. Flag a testimonial as inappropriate with a reason

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Testimonial flagged"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |
| 404 | Testimonial not found |

---

### 4.6 `PUT /api/admin/testimonials/reorder`

**Auth:** Admin

**Request Body:**
```jsonc
[
  { "id": "guid", "order": 1 },
  { "id": "guid", "order": 2 },
  { "id": "guid", "order": 3 }
]
```

**Business Logic:**
1. Update display order for multiple testimonials at once

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Testimonials reordered"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |
| 400 | Invalid reorder data |

---

## 5. DTO Reference

### 5.1 Admin User DTOs

| DTO | Fields |
|---|---|
| **AdminUserListItemDto** | `id`, `email`, `fullName`, `profilePictureUrl?`, `isActive`, `emailConfirmed`, `createdAt`, `lastLogin?`, `roles[]` |

### 5.2 Contact DTOs

| DTO | Fields |
|---|---|
| **ContactMessageDto** | `id`, `fullName`, `email`, `phone?`, `subject`, `message`, `isRead`, `createdAt` |
| **CreateContactMessageDto** | `fullName`\*, `email`\*, `phone?`, `subject`\*, `message`\* |

### 5.3 Testimonial DTOs

| DTO | Fields |
|---|---|
| **TestimonialDto** | `id`, `content`, `rating`, `userName`, `userAvatar?`, `displayOrder`, `createdAt` |
| **CreateTestimonialDto** | `content`\*, `rating`\* |
| **UpdateTestimonialDto** | `content?`, `rating?`, `isApproved?`, `displayOrder?` |

### 5.4 Other DTOs

| DTO | Fields |
|---|---|
| **ReorderItemDto** | `id`, `order` |

---

## 6. Endpoint Summary Table

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/users` | Admin | List all users (paginated, filterable) |
| `GET` | `/api/admin/users/{userId:guid}` | Admin | Get user by ID |
| `PATCH` | `/api/admin/users/{userId:guid}/toggle-active` | Admin | Toggle user active status |
| `DELETE` | `/api/admin/users/{userId:guid}` | Admin | Delete user (soft) |
| `POST` | `/api/admin/users/{userId:guid}/make-admin` | Admin | Assign admin role |
| `GET` | `/api/admin/contact` | Admin | List contact messages |
| `PUT` | `/api/admin/contact/{id:guid}/mark-read` | Admin | Mark contact as read |
| `DELETE` | `/api/admin/contact/{id:guid}` | Admin | Delete contact message |
| `GET` | `/api/admin/testimonials` | Admin | List testimonials |
| `PUT` | `/api/admin/testimonials/{id:guid}` | Admin | Update testimonial |
| `DELETE` | `/api/admin/testimonials/{id:guid}` | Admin | Delete testimonial |
| `PATCH` | `/api/admin/testimonials/{id:guid}/approve` | Admin | Approve testimonial |
| `PATCH` | `/api/admin/testimonials/{id:guid}/flag` | Admin | Flag testimonial |
| `PUT` | `/api/admin/testimonials/reorder` | Admin | Reorder testimonials |
