# Athary Platform — Instructor Requests API Documentation

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
2. [Student/Instructor Endpoints](#2-studentinstructor-endpoints)
3. [Admin Endpoints](#3-admin-endpoints)
4. [DTO Reference](#4-dto-reference)
5. [Enums Reference](#5-enums-reference)
6. [Endpoint Summary Table](#6-endpoint-summary-table)

---

## 1. Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| **Instructor Requests** | | |
| `INSTRUCTOR_REQUEST_NOT_ALLOWED` | 400 | Request cannot be performed (e.g. cancel non-pending request) |
| `INSTRUCTOR_REQUEST_NOT_FOUND` | 404 | Request not found |
| `MAX_DOCUMENTS_REACHED` | 400 | Maximum number of documents per request reached |

---

## 2. Student/Instructor Endpoints

### 2.1 `GET /api/instructor-requests/can-submit`

**Auth:** Required

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Check if user can submit a new instructor request (no pending request exists)

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

---

### 2.2 `POST /api/instructor-requests`

**Auth:** Required

**Request Body:**
```jsonc
{
  "message": "I would like to become an instructor",            // required, string
  "documents": [
    {
      "documentType": "CV",                                      // required, DocumentType enum
      "fileId": "guid",                                          // optional, Guid?
      "urlValue": "https://example.com/portfolio"                // optional, string?
    }
  ]
}
```

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Verify user has no pending request
3. Create instructor request with status `Pending`
4. Attach provided documents

**Success Response — `201 Created`:** Returns `InstructorRequestDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Max documents reached / already has pending request |
| 401 | Missing/invalid JWT |

---

### 2.3 `PUT /api/instructor-requests/{requestId:guid}`

**Auth:** Required

**Request Body:**
```jsonc
{
  "message": "Updated message",                                  // required, string
  "documents": [ /* InstructorRequestDocumentDto[] */ ]
}
```

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Verify request belongs to user and is still in `Pending` status
3. Update message and replace documents

**Success Response — `200 OK`:** Returns updated `InstructorRequestDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Cannot modify processed request |
| 401 | Missing/invalid JWT |
| 404 | Request not found |

---

### 2.4 `POST /api/instructor-requests/{requestId:guid}/documents`

**Auth:** Required

**Request Body:**
```jsonc
{
  "documentType": "CV",          // required, DocumentType enum
  "fileId": "guid",              // optional, Guid?
  "urlValue": "https://..."      // optional, string?
}
```

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Verify request belongs to user and is pending
3. Add document to request

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "تم إضافة المستند بنجاح"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Max documents reached |
| 401 | Missing/invalid JWT |
| 404 | Request not found |

---

### 2.5 `GET /api/instructor-requests/my-requests`

**Auth:** Required

**Business Logic:**
1. Return all requests submitted by the current user

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "status": "Pending",
      "message": "I would like to become an instructor",
      "submittedAt": "2026-06-20T10:00:00Z",
      "processedAt": null,
      "processedByUserName": null,
      "documentsCount": 2
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

### 2.6 `GET /api/instructor-requests/my-requests/{requestId:guid}`

**Auth:** Required

**Business Logic:**
1. Return detailed request info (includes documents, admin notes, rejection reason)

**Success Response — `200 OK`:** Returns `InstructorRequestDetailDto`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Request not found |

---

### 2.7 `DELETE /api/instructor-requests/{requestId:guid}/cancel`

**Auth:** Required

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Verify request belongs to user and is in `Pending` status
3. Cancel the request

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "تم إلغاء الطلب بنجاح"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Cannot cancel (not in Pending status) |
| 401 | Missing/invalid JWT |
| 404 | Request not found |

---

## 3. Admin Endpoints

All admin endpoints require `Admin` role.

### 3.1 `GET /api/instructor-requests/pending`

**Auth:** Admin

**Business Logic:**
1. Return all requests with `Pending` status

**Success Response — `200 OK`:** Returns `List<InstructorRequestDto>`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |

---

### 3.2 `GET /api/instructor-requests/{requestId:guid}`

**Auth:** Admin

**Business Logic:**
1. Return full request details including documents

**Success Response — `200 OK`:** Returns `InstructorRequestDetailDto`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |
| 404 | Request not found |

---

### 3.3 `PUT /api/instructor-requests/{requestId:guid}/process`

**Auth:** Admin

**Request Body:**
```jsonc
{
  "status": "Approved",          // required, InstructorRequestStatus (Approved | Rejected | RequiresMoreInfo)
  "adminNotes": "Looks good",    // optional, string?
  "rejectionReason": null        // optional, string? (required when Rejected)
}
```

**Business Logic:**
1. Extract admin `userId` from JWT `sub` claim
2. Update request status
3. If `Approved`, assign user the `Instructor` role
4. Record processed by and processed at

**Success Response — `200 OK`:** Returns updated `InstructorRequestDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid status transition |
| 401 | Missing/invalid JWT (non-admin) |
| 404 | Request not found |

---

### 3.4 `DELETE /api/instructor-requests/{requestId:guid}`

**Auth:** Admin

**Business Logic:**
1. Permanently delete the request

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "تم حذف الطلب بنجاح"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |
| 404 | Request not found |

---

## 4. DTO Reference

### 4.1 Request DTOs

| DTO | Fields |
|---|---|
| **SubmitInstructorRequestDto** | `message`\*, `documents`\* (list of InstructorRequestDocumentDto) |
| **UpdateInstructorRequestDto** | `message`\*, `documents`\* |
| **AddDocumentToRequestDto** | `documentType`\*, `fileId?`, `urlValue?` |
| **ProcessInstructorRequestDto** | `status`\* (Approved/Rejected/RequiresMoreInfo), `adminNotes?`, `rejectionReason?` |
| **InstructorRequestDocumentDto** | `documentType`\*, `fileId?`, `urlValue?` |

### 4.2 Response DTOs

| DTO | Fields |
|---|---|
| **InstructorRequestDto** | `id`, `userName`, `userEmail`, `status`, `message?`, `submittedAt`, `processedAt?`, `processedByUserName?`, `documentsCount` |
| **InstructorRequestDetailDto** (extends InstructorRequestDto) | + `documents[]`, `adminNotes?`, `rejectionReason?` |

---

## 5. Enums Reference

### InstructorRequestStatus
| Value | Description |
|---|---|
| `Pending` | Awaiting admin review |
| `Approved` | User promoted to Instructor |
| `Rejected` | Request denied |
| `RequiresMoreInfo` | Admin needs additional documents |

### DocumentType
| Value | Description |
|---|---|
| `CV` | Curriculum vitae / resume |
| `Certificate` | Professional certificate |
| `IDCard` | Identity card / passport |
| `Degree` | Academic degree |
| `PortfolioLink` | External portfolio URL |
| `Transcript` | Academic transcript |
| `Other` | Other document type |

---

## 6. Endpoint Summary Table

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/instructor-requests/can-submit` | Required | Check if user can submit request |
| `POST` | `/api/instructor-requests` | Required | Submit new instructor request |
| `PUT` | `/api/instructor-requests/{requestId:guid}` | Required | Update own request |
| `POST` | `/api/instructor-requests/{requestId:guid}/documents` | Required | Add document to request |
| `GET` | `/api/instructor-requests/my-requests` | Required | List own requests |
| `GET` | `/api/instructor-requests/my-requests/{requestId:guid}` | Required | Get own request details |
| `DELETE` | `/api/instructor-requests/{requestId:guid}/cancel` | Required | Cancel own pending request |
| `GET` | `/api/instructor-requests/pending` | Admin | List pending requests |
| `GET` | `/api/instructor-requests/{requestId:guid}` | Admin | Get any request details |
| `PUT` | `/api/instructor-requests/{requestId:guid}/process` | Admin | Approve/reject request |
| `DELETE` | `/api/instructor-requests/{requestId:guid}` | Admin | Delete request |
