# Athary Platform — Certificates API Documentation

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
2. [Certificate Endpoints](#2-certificate-endpoints)
3. [Admin Certificate Endpoints](#3-admin-certificate-endpoints)
4. [DTO Reference](#4-dto-reference)
5. [Endpoint Summary Table](#5-endpoint-summary-table)

---

## 1. Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| **Certificate** | | |
| `ENROLLMENT_NOT_FOUND` | 404 | Enrollment record not found |
| `ENROLLMENT_NOT_COMPLETED` | 400 | Course not yet completed |
| `CERTIFICATE_NOT_FOUND` | 404 | Certificate not found |
| `CERTIFICATE_ACCESS_DENIED` | 403 | User doesn't own this certificate |
| `CERTIFICATE_ALREADY_REVOKED` | 400 | Certificate already revoked |

---

## 2. Certificate Endpoints

### 2.1 `GET /api/certificates/my`

**Auth:** Required

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Return all certificates belonging to the current user

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "userId": "guid",
      "userFullName": "John Doe",
      "courseId": "guid",
      "courseTitle": "Introduction to Programming",
      "verificationCode": "ATH-ABC123XYZ",
      "status": "Active",
      "issuedAt": "2026-06-01T00:00:00Z",
      "completedAt": "2026-05-30T00:00:00Z",
      "certificateFileId": "guid",
      "revokedAt": null
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

### 2.2 `GET /api/certificates/{id:guid}`

**Auth:** Required

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Load certificate by ID
3. Verify ownership (`certificate.UserId == userId`) → 403 if not

**Success Response — `200 OK`:** Returns single `CertificateResponse`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 403 | Certificate access denied (not owner or admin) |
| 404 | Certificate not found |

---

### 2.3 `GET /api/certificates/{id:guid}/download`

**Auth:** Required

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Verify ownership
3. Generate or retrieve PDF stream for the certificate
4. Return as `application/pdf` file download

**Success Response — `200 OK`:** Binary PDF file with `Content-Type: application/pdf` and filename `certificate-{id}.pdf`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 403 | Certificate access denied |
| 404 | Certificate not found |

---

### 2.4 `GET /api/certificates/verify/{code}`

**Auth:** Anonymous

**Business Logic:**
1. Look up certificate by verification code
2. Return verification result with course and user info

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "isValid": true,
    "fullName": "John Doe",
    "courseTitle": "Introduction to Programming",
    "issuedAt": "2026-06-01T00:00:00Z",
    "completedAt": "2026-05-30T00:00:00Z",
    "verificationCode": "ATH-ABC123XYZ",
    "status": "Active"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 404 | Certificate not found |

---

## 3. Admin Certificate Endpoints

All admin certificate endpoints require `Admin` role.

### 3.1 `GET /api/admin/certificates`

**Auth:** Admin

**Query Parameters:**
| Param | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | int | No | 1 | Page number |
| `pageSize` | int | No | 20 | Items per page |

**Business Logic:**
1. Return paginated list of all certificates across all users

**Success Response — `200 OK`:** Returns `List<CertificateResponse>`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |

---

### 3.2 `POST /api/admin/certificates/{id:guid}/revoke`

**Auth:** Admin

**Request Body (optional):**
```jsonc
{
  "reason": "Instructor request - course completion invalid"   // optional, string?
}
```

**Business Logic:**
1. Revoke a certificate
2. Set `Status` to `Revoked`, record `RevokedAt` and admin ID
3. Optional reason stored

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Certificate revoked successfully."
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Certificate already revoked |
| 401 | Missing/invalid JWT (non-admin) |
| 404 | Certificate not found |

---

### 3.3 `POST /api/admin/certificates/issue`

**Auth:** Admin

**Request Body:**
```jsonc
{
  "userId": "guid",             // required
  "courseId": "guid",           // required
  "enrollmentId": "guid"        // required
}
```

**Business Logic:**
1. Manually issue a certificate to a user for a course
2. Generate unique verification code
3. Create certificate record with status `Active`

**Success Response — `200 OK`:** Returns `CertificateResponse`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Enrollment not found / not completed |
| 401 | Missing/invalid JWT (non-admin) |
| 404 | User or course not found |

---

## 4. DTO Reference

### 4.1 Request DTOs

| DTO | Fields |
|---|---|
| **IssueCertificateRequest** | `userId`\*, `courseId`\*, `enrollmentId`\* |
| **RevokeCertificateRequest** | `reason?` |

### 4.2 Response DTOs

| DTO | Fields |
|---|---|
| **CertificateResponse** | `id`, `userId`, `userFullName`, `courseId`, `courseTitle`, `verificationCode`, `status`, `issuedAt`, `completedAt`, `certificateFileId?`, `revokedAt?` |
| **CertificateVerificationResponse** | `isValid`, `fullName`, `courseTitle`, `issuedAt`, `completedAt`, `verificationCode`, `status` |

---

## 5. Endpoint Summary Table

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/certificates/my` | Required | List own certificates |
| `GET` | `/api/certificates/{id:guid}` | Required | Get certificate by ID |
| `GET` | `/api/certificates/{id:guid}/download` | Required | Download certificate PDF |
| `GET` | `/api/certificates/verify/{code}` | Anonymous | Verify certificate by code |
| `GET` | `/api/admin/certificates` | Admin | List all certificates (paginated) |
| `POST` | `/api/admin/certificates/{id:guid}/revoke` | Admin | Revoke a certificate |
| `POST` | `/api/admin/certificates/issue` | Admin | Manually issue certificate |
