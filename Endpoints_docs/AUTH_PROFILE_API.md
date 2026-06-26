# Athary Platform — Auth & Profile API Documentation

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

1. [Authentication & Authorization](#1-authentication--authorization)
2. [Error Handling](#2-error-handling)
3. [Auth Endpoints](#3-auth-endpoints)
4. [OAuth Endpoints](#4-oauth-endpoints)
5. [Profile Endpoints](#5-profile-endpoints)
6. [Notification Preferences Endpoints](#6-notification-preferences-endpoints)
7. [DTO Reference](#7-dto-reference)
8. [Endpoint Summary Table](#8-endpoint-summary-table)

---

## 1. Authentication & Authorization

### 1.1 JWT Configuration

| Setting | Value |
|---|---|
| Algorithm | HMAC-SHA256 |
| Issuer | `"Athary"` |
| Audience | `"AtharyClient"` |
| Access Token Expiry | 60 minutes |
| Refresh Token Expiry | 7 days |
| Clock Skew | 0 (zero tolerance) |

### 1.2 JWT Token Claims

| Claim | Type | Source |
|---|---|---|
| `sub` (NameIdentifier) | `Guid` | `user.Id` |
| `email` | `string` | `user.Email` |
| `jti` | `Guid` | Unique per token |
| `sid` | `Guid` | Session ID |
| `FullName` | `string` | `user.FullName` |
| `role` | `string[]` | User roles |
| `permission` | `string[]` | User permissions |

### 1.3 Authorization

| Mechanism | Effect |
|---|---|
| `[Authorize]` | Requires valid JWT → 401 if missing/invalid |
| `[AllowAnonymous]` | Public endpoint |
| `[HasPermission("...")]` | Custom attribute, checks `permission` claim → 403 if missing |
| `[Authorize(Roles = "Admin")]` | Built-in role check |

Default role on registration: **"Student"**

### 1.4 Rate Limiting

| Limiter | Limit | Window | Applied To |
|---|---|---|---|
| `Auth` | 10 | 1 minute | `AuthController` (all endpoints) |

### 1.5 Identity Password Policy

- Min 8 characters
- At least 1 digit, 1 lowercase, 1 uppercase, 1 non-alphanumeric
- Lockout: 5 failed attempts → 15 min lockout

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
  "errorCode": "DUPLICATE_EMAIL | INVALID_CREDENTIALS | ...",
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
    "Email": ["'Email' must be a valid email address."],
    "Password": ["'Password' must not be empty."]
  }
}
```

### 2.3 Error Code Reference

كل خطأ بيرجع معاه `errorCode` (string)Machine-readable عشان الف رونت ي distinguish بين الأخطاء من غير ما يعتمد على `message` text.

| Error Code | HTTP Status | Description |
|---|---|---|
| **Auth** | | |
| `INVALID_USER` | 400 | Invalid/missing user ID in JWT |
| `INVALID_SESSION` | 400 | Invalid/missing session ID in JWT |
| `USER_NOT_FOUND` | 404 | User not found or deleted |
| `DUPLICATE_EMAIL` | 400 | Email already registered |
| `REGISTRATION_FAILED` | 400 | Identity error during registration |
| `INVALID_CREDENTIALS` | 403 | Wrong email or password |
| `ACCOUNT_LOCKED` | 403 | Account locked after failed attempts |
| `ACCOUNT_NOT_ACTIVE` | 403 | Email not verified yet |
| `ACCOUNT_NO_LONGER_ACTIVE` | 403 | Account deactivated |
| `INVALID_REFRESH_TOKEN` | 403 | Refresh token invalid/expired |
| `SESSION_VALIDATION_FAILED` | 403 | Session validation failed |
| `SESSION_NOT_FOUND` | 404 | Session not found during logout |
| `EMAIL_ALREADY_VERIFIED` | 400 | Email already confirmed |
| `INVALID_OR_EXPIRED_OTP` | 400 | OTP invalid or expired |
| `PASSWORD_RESET_FAILED` | 400 | Identity error during password reset |
| `PASSWORD_CHANGE_FAILED` | 400 | Identity error during password change |
| **OAuth** | | |
| `INVALID_PROVIDER` | 400 | Wrong OAuth provider for endpoint |
| `OAUTH_AUTHENTICATION_FAILED` | 403 | Token validation failed with provider |
| `OAUTH_EMAIL_NOT_FOUND` | 403 | No email returned from Microsoft |
| `OAUTH_USER_CREATION_FAILED` | 400 | Could not create user from OAuth data |
| `OAUTH_EXTERNAL_LOGIN_FAILED` | 400 | Could not link external login |
| **Profile** | | |
| `INVALID_IMAGE_FILE` | 400 | File is not an image or not ready |
| `FILE_NOT_OWNED` | 403 | File doesn't belong to user |
| `USER_NO_PROFILE_PICTURE` | 400 | No profile picture to delete |
| `DUPLICATE_PHONE_NUMBER` | 400 | Phone number already exists for user |
| `PHONE_NOT_FOUND` | 404 | Phone not found |
| `ADDRESS_NOT_FOUND` | 404 | Address not found |
| `INVALID_FULL_NAME` | 400 | Full name cannot be empty |
| **General** | | |
| `VALIDATION_ERROR` | 400 | FluentValidation or argument error |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

### 2.4 Security Headers (ALL responses)

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
X-Permitted-Cross-Domain-Policies: none
```

---

## 3. Auth Endpoints

### 3.1 `POST /api/auth/register`

**Auth:** Anonymous | **Rate Limit:** Auth (10/min)

**Request Body:**
```jsonc
{
  "firstName": "string",        // required, max 100
  "lastName": "string",         // required, max 100
  "email": "string",            // required, valid email
  "password": "string",         // required, min 8, digit+lower+upper+special
  "confirmPassword": "string",  // required, must match password
  "gender": "string | null",    // optional: Male | Female | Other | PreferNotToSay
  "dateOfBirth": "2024-01-15 | null",   // optional, must be past
  "phoneNumber": "string | null",       // optional, regex: ^\+?[\d\s\-()]{7,20}$
  "country": "string | null",           // optional, max 100
  "city": "string | null",              // optional, max 100
  "streetLine1": "string | null",       // optional
  "postalCode": "string | null"         // optional, max 20
}
```

**Business Logic:**
1. Check email uniqueness → throw if exists
2. Create `User` with `EmailConfirmed = false`, `IsActive = false`
3. Assign role **"Student"**
4. Create `UserPhone` (Primary, default) if phone provided
5. Create `Address` (Home, default) if address fields provided
6. Generate 6-digit email verification OTP (15 min expiry)
7. Log activity "Register"
8. Uses database transaction

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "userId": "guid",
    "email": "user@example.com",
    "message": "User registered successfully. Please verify your email."
  },
  "message": "Registration successful. Please check your email for verification code."
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure / duplicate email / password policy violation |
| 500 | Server error |

---

### 3.2 `POST /api/auth/login`

**Auth:** Anonymous | **Rate Limit:** Auth (10/min)

**Request Body:**
```jsonc
{
  "email": "string",       // required
  "password": "string",    // required
  "rememberMe": false      // bool, optional, defaults to false
}
```

**Business Logic:**
1. Find user by email → 403 if not found
2. Check password → 403 if wrong (counts toward lockout)
3. If locked out → 403 "Account locked due to multiple failed attempts"
4. Check `IsActive && EmailConfirmed` → 403 if inactive
5. Update `LastLogin`, create `Session` with refresh token hash
6. Generate JWT access token, log "Login" activity

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "base64-256-bit-random",
    "sessionId": "guid",
    "expiresAt": "2026-06-26T12:00:00Z",
    "user": {
      "id": "guid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "profilePictureUrl": null,
      "isActive": true,
      "emailConfirmed": true,
      "roles": ["Student"]
    }
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure |
| 403 | Invalid email/password / locked account / inactive account |
| 500 | Server error |

---

### 3.3 `POST /api/auth/refresh`

**Auth:** Anonymous (uses refresh token) | **Rate Limit:** Auth (10/min)

**Request Body:**
```jsonc
{
  "refreshToken": "string"   // required, the base64 refresh token
}
```

**Business Logic:**
1. Hash refresh token (SHA-256), look up session
2. Validate session: `IsActive`, not expired
3. Check user `IsActive && EmailConfirmed`
4. Generate new access token (same `sessionId`)
5. Generate new refresh token, update session

**Success Response — `200 OK`:** Same shape as login response.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure |
| 403 | Invalid/expired refresh token / session invalid / account inactive |

---

### 3.4 `POST /api/auth/verify-email`

**Auth:** Anonymous | **Rate Limit:** Auth (10/min)

**Request Body:**
```jsonc
{
  "token": "string",    // required, the 6-digit OTP
  "email": "string"     // required, valid email
}
```

**Business Logic:**
1. Find user by email
2. Verify OTP: check hash, type `EmailVerification`, not expired (15 min), not used
3. Set `EmailConfirmed = true`, `IsActive = true`
4. Mark token as used, log "EmailVerified"

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Email verified successfully. Your account is now active."
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure / invalid or expired OTP |
| 500 | User not found |

---

### 3.5 `POST /api/auth/resend-verification`

**Auth:** Anonymous | **Rate Limit:** Auth (10/min)

**Request Body:**
```jsonc
{
  "email": "string"   // required, valid email
}
```

**Business Logic:**
1. Find user by email
2. If email already confirmed → 400 "Email already verified"
3. Invalidate previous unused tokens, generate new OTP

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Verification code sent to your email."
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure / email already verified |

---

### 3.6 `POST /api/auth/forgot-password`

**Auth:** Anonymous | **Rate Limit:** Auth (10/min)

**Request Body:**
```jsonc
{
  "email": "string"   // required, valid email
}
```

**Business Logic:**
1. Find user by email — **silent return** if not found (no info disclosure)
2. Invalidate previous password-reset tokens
3. Generate 6-digit OTP (type `PasswordReset`, 15 min expiry)
4. Send email

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "If the email exists, a password reset code has been sent."
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure |

---

### 3.7 `POST /api/auth/reset-password`

**Auth:** Anonymous | **Rate Limit:** Auth (10/min)

**Request Body:**
```jsonc
{
  "token": "string",             // required, the 6-digit OTP
  "email": "string",             // required, valid email
  "newPassword": "string",       // required, min 8, digit+lower+upper+special
  "confirmPassword": "string"    // required, must match newPassword
}
```

**Business Logic:**
1. Find user by email
2. Verify OTP (type `PasswordReset`)
3. Use `UserManager` Identity token flow to reset password
4. Mark OTP as used
5. Revoke ALL active sessions (forces re-login)
6. Log "PasswordReset"

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Password reset successfully. Please login with your new password."
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure / invalid or expired OTP |
| 500 | User not found |

---

### 3.8 `POST /api/auth/change-password`

**Auth:** Required | **Rate Limit:** Auth (10/min)

**Request Body:**
```jsonc
{
  "currentPassword": "string",   // required
  "newPassword": "string"        // required, min 8, digit+lower+upper+special
}
```

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. `UserManager.ChangePasswordAsync()` validates current password and updates

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Password changed successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure / password change failure |
| 401 | Missing/invalid JWT |

---

### 3.9 `POST /api/auth/logout`

**Auth:** Required | **Rate Limit:** Auth (10/min)

**Request Body:** None

**Business Logic:**
1. Extract `sessionId` from JWT `sid` claim
2. Set session `IsActive = false`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Logged out successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid session |
| 401 | Missing/invalid JWT |

---

### 3.10 `POST /api/auth/logout-all`

**Auth:** Required | **Rate Limit:** Auth (10/min)

**Request Body:** None

**Business Logic:**
1. Extract `userId` from `sub` and `sessionId` from `sid`
2. Revoke all sessions **except** current one

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "All other sessions logged out successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid user or session |
| 401 | Missing/invalid JWT |

---

### 3.11 `GET /api/auth/sessions`

**Auth:** Required | **Rate Limit:** Auth (10/min)

**Query Parameters:** None

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Return all active sessions for the user

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0 ...",
      "createdAt": "2026-06-25T10:00:00Z",
      "lastUsed": "2026-06-26T08:30:00Z",
      "isActive": true
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid user |
| 401 | Missing/invalid JWT |

---

### 3.12 `DELETE /api/auth/sessions/{sessionId:guid}`

**Auth:** Required | **Rate Limit:** Auth (10/min)

**Request Body:** None

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Retrieve all user sessions and find the requested one
3. If session does not belong to user → 404
4. Revoke the specific session via `ISessionService.RevokeSessionAsync()`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Session logged out successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid user |
| 401 | Missing/invalid JWT |
| 404 | Session not found |

**Auth:** Required | **Rate Limit:** Auth (10/min)

**Query Parameters:** None

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Return all active sessions for the user

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0 ...",
      "createdAt": "2026-06-25T10:00:00Z",
      "lastUsed": "2026-06-26T08:30:00Z",
      "isActive": true
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid user |
| 401 | Missing/invalid JWT |

---

## 4. OAuth Endpoints

### 4.1 `POST /api/oauth/google`

**Auth:** Anonymous

**Request Body:**
```jsonc
{
  "idToken": "string",    // required, Google ID token (JWT from Google OAuth client)
  "provider": "google"    // required, must be "google"
}
```

**Business Logic:**
1. Validate `provider == "google"` → 400 if not
2. Validate ID token via `GoogleJsonWebSignature.ValidateAsync()` with `Authentication:Google:ClientId`
3. Find or create user (auto-confirmed, auto-activated, role "Student")
4. Link external login via `UserManager.AddLoginAsync()`
5. Create session, generate JWT
6. Log "Login" with "User logged in via Google OAuth"

**Success Response — `200 OK`:** Same as login `AuthResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid provider (not "google") |
| 403 | Google authentication failed (invalid token) |

---

### 4.2 `POST /api/oauth/microsoft`

**Auth:** Anonymous

**Request Body:**
```jsonc
{
  "idToken": "string",       // required, Microsoft access token
  "provider": "microsoft"    // required, must be "microsoft"
}
```

**Business Logic:**
1. Validate `provider == "microsoft"` → 400 if not
2. Call Microsoft Graph API `GET https://graph.microsoft.com/v1.0/me` with Bearer token
3. Extract: `mail`/`userPrincipalName`, `givenName`, `surname`, `id`
4. Find or create user (auto-confirmed, auto-activated, role "Student")
5. Link external login, create session, generate JWT
6. Log "Login" with "User logged in via Microsoft OAuth"

**Success Response — `200 OK`:** Same as login `AuthResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid provider (not "microsoft") |
| 403 | Microsoft authentication failed |

---

## 5. Profile Endpoints

### 5.1 `GET /api/profile/me`

**Auth:** Required

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Load user with phones, non-deleted addresses, profile image
3. 404 if not found or soft-deleted (`DeletedAt != null`)

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "bio": null,
    "gender": "Male",
    "dateOfBirth": "1990-01-15",
    "nationality": "Egyptian",
    "profileImageUrl": "https://minio-host/images/uuid.jpg",
    "createdAt": "2026-01-01T00:00:00Z",
    "phones": [
      {
        "id": "guid",
        "phoneNumber": "+201234567890",
        "type": "Primary",
        "isVerified": false,
        "isDefault": true
      }
    ],
    "addresses": [
      {
        "id": "guid",
        "type": "Home",
        "streetLine1": "123 Main St",
        "streetLine2": null,
        "city": "Cairo",
        "stateProvince": null,
        "postalCode": "12345",
        "country": "Egypt",
        "contactPhone": null,
        "isDefault": true
      }
    ]
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | User not found |

---

### 5.2 `GET /api/profile/{userId:guid}`

**Auth:** Anonymous (public profile)

**Business Logic:**
1. Load user by ID (non-deleted)
2. Returns **public** profile only (no email, phones, addresses)

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "fullName": "John Doe",
    "slug": "john-doe",
    "bio": "A passionate educator",
    "nationality": "Egyptian",
    "profileImageUrl": "https://minio-host/images/uuid.jpg",
    "createdAt": "2026-01-01T00:00:00Z"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 404 | User not found or deleted |

---

### 5.3 `PUT /api/profile`

**Auth:** Required

**Request Body (all fields nullable — partial update):**
```jsonc
{
  "firstName": "string | null",      // max 100
  "lastName": "string | null",       // max 100
  "bio": "string | null",           // max 1000
  "gender": "string | null",        // Male | Female | Other | PreferNotToSay
  "dateOfBirth": "2024-01-15 | null",  // must be past
  "nationality": "string | null"    // max 100
}
```

**Business Logic:**
1. Load user with phones, addresses, profile image
2. Only update non-null fields (merge patch)
3. Set `UpdatedAt = DateTime.UtcNow`

**Success Response — `200 OK`:** Same shape as `GET /api/profile/me`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure |
| 401 | Missing/invalid JWT |
| 404 | User not found |

---

### 5.4 `POST /api/profile/picture`

**Auth:** Required

**Request Body:**
```jsonc
{
  "fileId": "guid"   // required, ID of previously uploaded image
}
```

**Business Logic:**
1. Validate file exists, is `StoredFileType.Image`, `FileStatus.Ready`, not deleted
2. Validate file ownership (`file.UploadedBy == userId`) → 403 if not
3. Soft-delete old profile picture if exists
4. Set new file visibility to `FileVisibility.Public`
5. Update `ProfileImageFileId`

**Success Response — `200 OK`:** Updated `ProfileDto` (same shape as `GET /api/profile/me`).

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid file (not image / not ready / deleted) |
| 401 | Missing/invalid JWT |
| 403 | File does not belong to user |
| 404 | User not found |

---

### 5.5 `DELETE /api/profile/picture`

**Auth:** Required

**Request Body:** None

**Business Logic:**
1. Load user with profile image
2. If no profile picture → 400 "User has no profile picture"
3. Soft-delete the image file, set `ProfileImageFileId = null`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Profile picture deleted successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | No profile picture to delete |
| 401 | Missing/invalid JWT |
| 404 | User not found |

---

### 5.6 `POST /api/profile/phones`

**Auth:** Required

**Request Body:**
```jsonc
{
  "phoneNumber": "string",        // required, regex: ^\+?[\d\s\-()]{7,20}$
  "type": "Primary",              // optional, defaults Primary (Primary | Secondary)
  "isDefault": false              // bool, optional
}
```

**Business Logic:**
1. Validate no duplicate phone for this user
2. If `isDefault == true`, set all other phones to non-default
3. If no existing phones, new one becomes default regardless
4. Create `UserPhone` with `IsVerified = false`

**Success Response — `201 Created`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "phoneNumber": "+201234567890",
    "type": "Primary",
    "isVerified": false,
    "isDefault": true
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure / duplicate phone |
| 401 | Missing/invalid JWT |
| 404 | User not found |

---

### 5.7 `DELETE /api/profile/phones/{phoneId:guid}`

**Auth:** Required

**Business Logic:**
1. Find phone by ID and userId
2. If deleted phone was default, assign earliest-created remaining phone as default
3. **Hard delete** the phone entity

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Phone deleted successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Phone not found |

---

### 5.8 `PUT /api/profile/phones/{phoneId:guid}/default`

**Auth:** Required

**Business Logic:**
1. Load all user phones
2. Set `IsDefault = true` on specified phone, `false` on all others

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Default phone set successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Phone not found |

---

### 5.9 `POST /api/profile/addresses`

**Auth:** Required

**Request Body:**
```jsonc
{
  "type": "Home",                        // optional, defaults "Home"
  "streetLine1": "string",               // required, max 255
  "streetLine2": "string | null",        // max 255
  "city": "string",                      // required, max 100
  "stateProvince": "string | null",      // max 100
  "postalCode": "string",                // required, max 20
  "country": "string",                   // required, max 100
  "contactPhone": "string | null",       // regex: ^\+?[\d\s\-()]{7,20}$
  "isDefault": false                     // bool, optional
}
```

**Business Logic:**
1. If `isDefault == true`, set all existing non-deleted addresses to non-default
2. If no existing addresses, new one becomes default regardless

**Success Response — `201 Created`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "type": "Home",
    "streetLine1": "123 Main St",
    "streetLine2": null,
    "city": "Cairo",
    "stateProvince": null,
    "postalCode": "12345",
    "country": "Egypt",
    "contactPhone": null,
    "isDefault": true
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure |
| 401 | Missing/invalid JWT |
| 404 | User not found |

---

### 5.10 `PUT /api/profile/addresses/{addressId:guid}`

**Auth:** Required

**Request Body (all fields nullable - partial update):**
```jsonc
{
  "type": "string | null",             // max 100
  "streetLine1": "string | null",      // max 255
  "streetLine2": "string | null",      // max 255
  "city": "string | null",             // max 100
  "stateProvince": "string | null",    // max 100
  "postalCode": "string | null",       // max 20
  "country": "string | null",          // max 100
  "contactPhone": "string | null",     // regex: ^\+?[\d\s\-()]{7,20}$
  "isDefault": true | null             // bool?
}
```

**Business Logic:**
1. Only update non-null fields (partial update)
2. If `isDefault == true`, unset default on all other addresses
3. Set `UpdatedAt = DateTime.UtcNow`

**Success Response — `200 OK`:** Returns updated `AddressDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure |
| 401 | Missing/invalid JWT |
| 404 | Address not found |

---

### 5.11 `DELETE /api/profile/addresses/{addressId:guid}`

**Auth:** Required

**Business Logic:**
1. **Soft delete** — sets `DeletedAt = DateTime.UtcNow`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Address deleted successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Address not found |

---

### 5.12 `PUT /api/profile/addresses/{addressId:guid}/default`

**Auth:** Required

**Business Logic:**
1. Load all non-deleted addresses
2. Set `IsDefault = true` on target, `false` on all others

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Default address set successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Address not found |

---

## 6. Notification Preferences Endpoints

### 6.1 `GET /api/notifications/preferences`

**Auth:** Required

**Business Logic:**
1. Return user's notification preferences
2. Auto-create with defaults if none exist

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "emailNotifications": true,
    "pushNotifications": true,
    "courseUpdates": true,
    "marketingEmails": false,
    "newMessageAlerts": true,
    "liveSessionReminders": true,
    "quizReminders": true,
    "certificateAchievements": true,
    "announcementAlerts": true
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

---

### 6.2 `PUT /api/notifications/preferences`

**Auth:** Required

**Request Body (all fields nullable `bool?` — partial update):**
```jsonc
{
  "emailNotifications": true | null,
  "pushNotifications": true | null,
  "courseUpdates": true | null,
  "marketingEmails": false | null,
  "newMessageAlerts": true | null,
  "liveSessionReminders": true | null,
  "quizReminders": true | null,
  "certificateAchievements": true | null,
  "announcementAlerts": true | null
}
```

**Business Logic:**
1. Only update non-null fields
2. Auto-create preferences record if none exists

**Success Response — `200 OK`:** Returns the complete `NotificationPreferencesDto`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

---

## 7. DTO Reference

### 7.1 AuthRequest DTOs

| DTO | Fields |
|---|---|
| **RegisterDto** | `firstName`\*, `lastName`\*, `email`\*, `password`\*, `confirmPassword`\*, `gender?`, `dateOfBirth?`, `phoneNumber?`, `country?`, `city?`, `streetLine1?`, `postalCode?` |
| **LoginDto** | `email`\*, `password`\*, `rememberMe?` |
| **RefreshTokenDto** | `refreshToken`\* |
| **VerifyEmailDto** | `token`\*, `email`\* |
| **ResendVerificationDto** | `email`\* |
| **ForgotPasswordDto** | `email`\* |
| **ResetPasswordDto** | `token`\*, `email`\*, `newPassword`\*, `confirmPassword`\* |
| **ChangePasswordDto** | `currentPassword`\*, `newPassword`\* |
| **OAuthLoginDto** | `idToken`\*, `provider`\* |

### 7.2 AuthResponse DTOs

| DTO | Fields |
|---|---|
| **RegisterResponseDto** | `userId`, `email`, `message` |
| **AuthResponseDto** | `accessToken`, `refreshToken`, `sessionId`, `expiresAt`, `user: UserInfoDto` |
| **UserInfoDto** | `id`, `email`, `fullName`, `profilePictureUrl?`, `isActive`, `emailConfirmed`, `roles` |
| **SessionDto** | `id`, `ipAddress`, `userAgent`, `createdAt`, `lastUsed?`, `isActive` |

### 7.3 Profile DTOs

| DTO | Fields |
|---|---|
| **ProfileDto** | `id`, `fullName`, `email`, `bio?`, `gender?`, `dateOfBirth?`, `nationality?`, `profileImageUrl?`, `createdAt`, `phones[]`, `addresses[]` |
| **PublicProfileDto** | `id`, `fullName?`, `slug?`, `bio?`, `nationality?`, `profileImageUrl?`, `createdAt` |
| **PhoneDto** | `id`, `phoneNumber`, `type`, `isVerified`, `isDefault` |
| **AddressDto** | `id`, `type`, `streetLine1`, `streetLine2?`, `city`, `stateProvince?`, `postalCode`, `country`, `contactPhone?`, `isDefault` |
| **UpdateProfileDto** | `firstName?`, `lastName?`, `bio?`, `gender?`, `dateOfBirth?`, `nationality?` |
| **AddPhoneDto** | `phoneNumber`\*, `type?`, `isDefault?` |
| **AddAddressDto** | `type?`, `streetLine1`\*, `streetLine2?`, `city`\*, `stateProvince?`, `postalCode`\*, `country`\*, `contactPhone?`, `isDefault?` |
| **UpdateAddressDto** | Same as AddAddress but all nullable |
| **SetProfileImageDto** | `fileId`\* |

### 7.4 Notification Preferences DTOs

| DTO | Fields |
|---|---|
| **NotificationPreferencesDto** | `emailNotifications`, `pushNotifications`, `courseUpdates`, `marketingEmails`, `newMessageAlerts`, `liveSessionReminders`, `quizReminders`, `certificateAchievements`, `announcementAlerts` (all `bool`) |
| **UpdateNotificationPreferencesDto** | Same fields but all `bool?` (nullable) |

---

## 8. Endpoint Summary Table

| Method | Route | Auth | Rate Limit | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | No | 10/min | Register new user |
| `POST` | `/api/auth/login` | No | 10/min | Login |
| `POST` | `/api/auth/refresh` | No | 10/min | Refresh tokens |
| `POST` | `/api/auth/verify-email` | No | 10/min | Verify email OTP |
| `POST` | `/api/auth/resend-verification` | No | 10/min | Resend verification code |
| `POST` | `/api/auth/forgot-password` | No | 10/min | Request password reset |
| `POST` | `/api/auth/reset-password` | No | 10/min | Reset password with OTP |
| `POST` | `/api/auth/change-password` | Yes | 10/min | Change password |
| `POST` | `/api/auth/logout` | Yes | 10/min | Logout current session |
| `POST` | `/api/auth/logout-all` | Yes | 10/min | Logout all other sessions |
| `GET` | `/api/auth/sessions` | Yes | 10/min | List active sessions |
| `DELETE` | `/api/auth/sessions/{sessionId:guid}` | Yes | 10/min | Logout specific session |
| `POST` | `/api/oauth/google` | No | — | Google OAuth login |
| `POST` | `/api/oauth/microsoft` | No | — | Microsoft OAuth login |
| `GET` | `/api/profile/me` | Yes | — | Get own profile (full) |
| `GET` | `/api/profile/{userId:guid}` | No | — | Get public profile |
| `PUT` | `/api/profile` | Yes | — | Update profile (partial) |
| `POST` | `/api/profile/picture` | Yes | — | Set profile picture |
| `DELETE` | `/api/profile/picture` | Yes | — | Delete profile picture |
| `POST` | `/api/profile/phones` | Yes | — | Add phone |
| `DELETE` | `/api/profile/phones/{phoneId:guid}` | Yes | — | Delete phone |
| `PUT` | `/api/profile/phones/{phoneId:guid}/default` | Yes | — | Set default phone |
| `POST` | `/api/profile/addresses` | Yes | — | Add address |
| `PUT` | `/api/profile/addresses/{addressId:guid}` | Yes | — | Update address (partial) |
| `DELETE` | `/api/profile/addresses/{addressId:guid}` | Yes | — | Delete address (soft) |
| `PUT` | `/api/profile/addresses/{addressId:guid}/default` | Yes | — | Set default address |
| `GET` | `/api/notifications/preferences` | Yes | — | Get notification prefs |
| `PUT` | `/api/notifications/preferences` | Yes | — | Update notification prefs |

---

## 9. Related API Documentation

| Document | Covers |
|---|---|
| [`COURSES_API.md`](COURSES_API.md) | Course management, public browsing, admin review, sections, videos, documents, quizzes, quiz attempts, enrollments (49 endpoints) |
| [`COMMERCE_API.md`](COMMERCE_API.md) | Cart, orders, payments, coupons, refunds, admin payments, admin coupons, admin refunds (26 endpoints) |
| [`PUBLIC_API.md`](PUBLIC_API.md) | Public landing pages, about, testimonials (static content) |
| [`REVIEWS_API.md`](REVIEWS_API.md) | Course reviews, video comments (7 endpoints) |
| [`WISHLIST_API.md`](WISHLIST_API.md) | Wishlist CRUD (4 endpoints) |
| [`CATEGORIES_API.md`](CATEGORIES_API.md) | Category management (6 endpoints) |
| [`LIVE_SESSIONS_API.md`](LIVE_SESSIONS_API.md) | Live session management & attendance (7 endpoints) |
| [`NOTIFICATIONS_API.md`](NOTIFICATIONS_API.md) | User notifications (6 endpoints) |
| [`MEDIA_API.md`](MEDIA_API.md) | File upload, admin media management (8 endpoints) |
| [`CERTIFICATES_API.md`](CERTIFICATES_API.md) | Certificate generation & admin management (6 endpoints) |
| [`INSTRUCTOR_REQUESTS_API.md`](INSTRUCTOR_REQUESTS_API.md) | Instructor application requests (10 endpoints) |
| [`COMMUNICATION_API.md`](COMMUNICATION_API.md) | Announcements, messages, reports, activity logs, system settings (17 endpoints) |
| [`DASHBOARD_API.md`](DASHBOARD_API.md) | Student, instructor, admin dashboards (8 endpoints) |
| [`MANAGEMENT_COURSES_API.md`](MANAGEMENT_COURSES_API.md) | Course scheduling & deletion management (4 endpoints) |
| [`ADMIN_API.md`](ADMIN_API.md) | Admin user management, contact messages, testimonials (8 endpoints) |
