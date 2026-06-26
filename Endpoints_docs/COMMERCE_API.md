# Athary Platform — Commerce API Documentation

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
3. [Cart Endpoints](#3-cart-endpoints)
4. [Coupon Endpoints (Public)](#4-coupon-endpoints-public)
5. [Order Endpoints](#5-order-endpoints)
6. [Payment Endpoints](#6-payment-endpoints)
7. [Refund Endpoints (User)](#7-refund-endpoints-user)
8. [Admin Coupon Endpoints](#8-admin-coupon-endpoints)
9. [Admin Payment Method Endpoints](#9-admin-payment-method-endpoints)
10. [Admin Refund Endpoints](#10-admin-refund-endpoints)
11. [DTO Reference](#11-dto-reference)
12. [Enums Reference](#12-enums-reference)
13. [Endpoint Summary Table](#13-endpoint-summary-table)

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
| `[Authorize(Roles = "Admin")]` | Built-in role check, requires **Admin** role → 403 if not |

Default role on registration: **"Student"**

### 1.4 Rate Limiting

| Limiter | Limit | Window | Applied To |
|---|---|---|---|
| `Auth` | 10 | 1 minute | `AuthController` (all endpoints) |

Commerce endpoints currently have **no rate limiting** applied.

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
  "errorCode": "COURSE_NOT_FOUND | COUPON_INVALID | ...",
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
    "Code": ["'Code' must not be empty."]
  }
}
```

### 2.3 Commerce Error Code Reference

كل خطأ بيرجع معاه `errorCode` (string) Machine-readable عشان الف رونت ي distinguish بين الأخطاء من غير ما يعتمد على `message` text.

| Error Code | HTTP Status | Description |
|---|---|---|
| **Cart** | | |
| `COURSE_NOT_FOUND` | 404 | Course does not exist |
| `ALREADY_ENROLLED` | 400 | User is already enrolled in the course |
| `COURSE_ALREADY_IN_CART` | 400 | Course is already in the user's cart |
| `CART_NOT_FOUND` | 404 | Cart not found for user |
| `CART_ITEM_NOT_FOUND` | 404 | Item not found in cart |
| `CART_EMPTY` | 400 | Cart is empty (cannot proceed to checkout) |
| **Coupon** | | |
| `COUPON_CODE_EXISTS` | 400 | Coupon code already exists (duplicate) |
| `INVALID_COUPON_TYPE` | 400 | Invalid coupon type (not Percentage or Fixed) |
| `INVALID_COUPON_SCOPE` | 400 | Invalid coupon scope (not All, SpecificCourses, or Category) |
| `COUPON_NOT_FOUND` | 404 | Coupon not found |
| `COUPON_INVALID` | 400 | Coupon is expired, inactive, or conditions not met |
| **Order** | | |
| `ORDER_NOT_FOUND` | 404 | Order not found or does not belong to user |
| `ORDER_ALREADY_PROCESSED` | 400 | Order has already been processed (paid/failed) |
| **Payment** | | |
| `PAYMENT_METHOD_NOT_FOUND` | 404 | Payment method not found or inactive |
| `INVALID_PAYMENT_TYPE` | 400 | Invalid payment method type |
| **Refund** | | |
| `PAYMENT_NOT_FOUND` | 404 | Payment not found |
| `PAYMENT_NOT_COMPLETED` | 400 | Payment has not been completed (cannot refund) |
| `ORDER_NOT_COMPLETED` | 400 | Order is not in Completed status |
| `REFUND_ALREADY_EXISTS` | 400 | A refund request already exists for this payment |
| `REFUND_NOT_FOUND` | 404 | Refund request not found |
| `REFUND_NOT_PENDING` | 400 | Refund is not in Pending status (cannot approve/reject) |
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

## 3. Cart Endpoints

### 3.1 `GET /api/cart`

**Auth:** Required (JWT, any role)

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Load cart with items, course snapshots, and applied coupon
3. Calculate dynamic subtotal, discount, and final amount

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "items": [
      {
        "id": "guid",
        "courseId": "guid",
        "courseTitle": "Advanced C# Programming",
        "courseImageUrl": "https://minio-host/images/course.jpg",
        "instructorName": "John Doe",
        "priceSnapshot": 199.99,
        "currentPrice": 199.99,
        "addedAt": "2026-06-25T10:00:00Z"
      }
    ],
    "subtotal": 199.99,
    "couponCode": null,
    "discountAmount": 0,
    "finalAmount": 199.99
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Cart not found for user |

---

### 3.2 `POST /api/cart/items`

**Auth:** Required (JWT, any role)

**Request Body:**
```jsonc
{
  "courseId": "guid"   // required, UUID of the course to add
}
```

**Business Logic:**
1. Validate course exists and is published → 404 if not
2. Check user is not already enrolled → 400 if enrolled
3. Check course is not already in cart → 400 if already present
4. Add item with snapshot of current price, title, and instructor name

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "courseId": "guid",
    "courseTitle": "Advanced C# Programming",
    "courseImageUrl": "https://minio-host/images/course.jpg",
    "instructorName": "John Doe",
    "priceSnapshot": 199.99,
    "currentPrice": 199.99,
    "addedAt": "2026-06-25T10:00:00Z"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Already enrolled / course already in cart |
| 401 | Missing/invalid JWT |
| 404 | Course not found |

---

### 3.3 `DELETE /api/cart/items/{itemId}`

**Auth:** Required (JWT, any role)

**Path Parameters:**
| Name | Type | Description |
|---|---|---|
| `itemId` | `Guid` | ID of the cart item to remove |

**Business Logic:**
1. Remove cart item by `itemId` for the current user
2. Recalculate cart totals
3. If coupon was applied, validate it again against updated cart

**Success Response — `204 No Content`:** No body.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Cart item not found |

---

### 3.4 `POST /api/cart/apply-coupon`

**Auth:** Required (JWT, any role)

**Request Body:**
```jsonc
{
  "code": "SUMMER2026"   // required, coupon code string
}
```

**Business Logic:**
1. Find coupon by code (active, valid dates, usage limits)
2. Validate coupon against cart contents (scope, minimum purchase)
3. Apply coupon → calculate discount and store on cart
4. Return updated discount and final amount

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "code": "SUMMER2026",
    "discountAmount": 30.00,
    "finalAmount": 169.99,
    "message": "Coupon applied successfully"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Coupon invalid (expired, inactive, minimum not met) |
| 401 | Missing/invalid JWT |
| 404 | Coupon not found |

---

### 3.5 `DELETE /api/cart/coupon`

**Auth:** Required (JWT, any role)

**Business Logic:**
1. Remove applied coupon from cart
2. Recalculate totals (discount reset to zero)

**Success Response — `204 No Content`:** No body.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

---

## 4. Coupon Endpoints (Public)

### 4.1 `POST /api/coupons/validate`

**Auth:** Required (JWT, any role)

**Request Body:**
```jsonc
{
  "code": "SUMMER2026",        // required, coupon code
  "cartTotal": 199.99,         // required, decimal
  "courseIds": [               // required, list of course UUIDs in cart
    "guid-1",
    "guid-2"
  ]
}
```

**Business Logic:**
1. Find coupon by code → 404 if not found
2. Check `IsActive`, `ValidFrom`/`ValidUntil` dates
3. Check `UsageLimit` and `UserLimitPerUser`
4. Check `ApplicableTo` scope against provided `courseIds`
5. Check `MinimumPurchaseAmount` against `cartTotal`
6. Return validation result with calculated discount

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "code": "SUMMER2026",
    "isValid": true,
    "discountAmount": 30.00,
    "finalAmount": 169.99,
    "message": "Coupon is valid"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Coupon invalid (expired, scope mismatch, minimum not met) |
| 401 | Missing/invalid JWT |
| 404 | Coupon not found |

---

## 5. Order Endpoints

### 5.1 `GET /api/orders`

**Auth:** Required (JWT, any role)

**Business Logic:**
1. Extract `userId` from JWT
2. Return all orders for the user (ordered by most recent)

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "orderNumber": "ORD-20260625-A3B2",
      "subtotal": 199.99,
      "discountAmount": 30.00,
      "finalAmount": 169.99,
      "status": "Completed",
      "couponCode": "SUMMER2026",
      "itemCount": 2,
      "createdAt": "2026-06-25T10:00:00Z"
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

### 5.2 `GET /api/orders/{orderId}`

**Auth:** Required (JWT, any role)

**Path Parameters:**
| Name | Type | Description |
|---|---|---|
| `orderId` | `Guid` | UUID of the order |

**Business Logic:**
1. Load order by ID for the current user
2. Include order items (course snapshots) and payment history

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "orderNumber": "ORD-20260625-A3B2",
    "subtotal": 199.99,
    "discountAmount": 30.00,
    "finalAmount": 169.99,
    "status": "Completed",
    "couponCode": "SUMMER2026",
    "items": [
      {
        "id": "guid",
        "courseId": "guid",
        "courseTitle": "Advanced C# Programming",
        "priceAtPurchase": 99.99
      }
    ],
    "payments": [
      {
        "id": "guid",
        "amount": 169.99,
        "status": "Succeeded",
        "gatewayResponse": null,
        "createdAt": "2026-06-25T10:05:00Z"
      }
    ],
    "createdAt": "2026-06-25T10:00:00Z"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Order not found |

---

### 5.3 `POST /api/orders`

**Auth:** Required (JWT, any role)

**Request Body:**
```jsonc
{
  "couponCode": "SUMMER2026 | null"   // optional, coupon code to apply
}
```

**Business Logic:**
1. Load user's cart with items
2. If `couponCode` provided, validate and apply it
3. Validate cart is not empty → 400 if empty
4. Validate all courses exist and are published
5. Check user is not already enrolled in any course → 400 if enrolled
6. Create order with `OrderStatus.Pending`, generate unique `OrderNumber`
7. Snapshot item prices into `OrderItem` records
8. Clear cart after order creation
9. Return created order

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "orderNumber": "ORD-20260625-A3B2",
    "subtotal": 199.99,
    "discountAmount": 30.00,
    "finalAmount": 169.99,
    "status": "Pending",
    "couponCode": "SUMMER2026",
    "itemCount": 2,
    "createdAt": "2026-06-25T10:00:00Z"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Cart empty / already enrolled / invalid coupon |
| 401 | Missing/invalid JWT |
| 404 | Course not found |

---

## 6. Payment Endpoints

### 6.1 `POST /api/payments/process?orderId={orderId}`

**Auth:** Required (JWT, any role)

**Query Parameters:**
| Name | Type | Description |
|---|---|---|
| `orderId` | `Guid` | UUID of the order to pay for |

**Request Body:**
```jsonc
{
  "paymentMethodId": "guid"   // required, UUID of the payment method
}
```

**Business Logic:**
1. Load order by ID for current user
2. Validate order is `Pending` → 400 if already processed
3. Load payment method (must be active) → 404 if not found
4. Process payment through the configured gateway (MockPaymentGateway)
5. On success: update order to `Completed`, set payment to `Succeeded`, create enrollments
6. On failure: set order to `Failed`, set payment to `Failed`
7. Return payment details

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "orderId": "guid",
    "amount": 169.99,
    "status": "Succeeded",
    "gatewayTransactionId": "txn_abc123def456",
    "gatewayResponse": null,
    "paymentMethodName": "Visa Credit Card",
    "createdAt": "2026-06-25T10:05:00Z"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Order already processed |
| 401 | Missing/invalid JWT |
| 404 | Order not found / payment method not found |

---

### 6.2 `GET /api/payments/methods`

**Auth:** Public (`[AllowAnonymous]`)

**Business Logic:**
1. Return all active payment methods

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "name": "Visa Credit Card",
      "provider": "Stripe",
      "type": "CreditCard",
      "isActive": true,
      "configuration": null
    }
  ],
  "message": null
}
```

**Errors:** None.

---

### 6.3 `GET /api/payments/history/{orderId}`

**Auth:** Required (JWT, any role)

**Path Parameters:**
| Name | Type | Description |
|---|---|---|
| `orderId` | `Guid` | UUID of the order |

**Business Logic:**
1. Return all payment attempts for the given order
2. Includes both succeeded and failed attempts

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "orderId": "guid",
      "amount": 169.99,
      "status": "Succeeded",
      "gatewayTransactionId": "txn_abc123def456",
      "gatewayResponse": null,
      "paymentMethodName": "Visa Credit Card",
      "createdAt": "2026-06-25T10:05:00Z"
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

## 7. Refund Endpoints (User)

### 7.1 `POST /api/refunds`

**Auth:** Required (JWT, any role)

**Request Body:**
```jsonc
{
  "paymentId": "guid",    // required, UUID of the completed payment
  "reason": "Course content did not match description"   // optional, string
}
```

**Business Logic:**
1. Validate payment exists and belongs to user's order
2. Validate payment status is `Succeeded` → 400 if not
3. Validate order status is `Completed` → 400 if not
4. Check no existing refund for this payment → 400 if already requested
5. Create refund request with `RefundStatus.Requested`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "paymentId": "guid",
    "amount": 169.99,
    "reason": "Course content did not match description",
    "status": "Requested",
    "orderNumber": "ORD-20260625-A3B2",
    "requestedAt": "2026-06-26T08:00:00Z",
    "processedAt": null,
    "processedByName": null
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Payment not completed / order not completed / refund already exists |
| 401 | Missing/invalid JWT |
| 404 | Payment not found |

---

### 7.2 `GET /api/refunds`

**Auth:** Required (JWT, any role)

**Business Logic:**
1. Return all refund requests for the current user

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "paymentId": "guid",
      "amount": 169.99,
      "reason": "Course content did not match description",
      "status": "Approved",
      "orderNumber": "ORD-20260625-A3B2",
      "requestedAt": "2026-06-26T08:00:00Z",
      "processedAt": "2026-06-26T12:00:00Z",
      "processedByName": "Admin Ahmed"
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

## 8. Admin Coupon Endpoints

### 8.1 `GET /api/admin/coupons`

**Auth:** Required (Admin role only)

**Query Parameters:**
| Name | Type | Description |
|---|---|---|
| `isActive` | `bool?` | Optional filter — `true` for active, `false` for inactive, omit for all |

**Business Logic:**
1. Return all coupons, optionally filtered by active status

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "code": "SUMMER2026",
      "type": "Percentage",
      "value": 15.00,
      "maxDiscountAmount": 50.00,
      "minimumPurchaseAmount": 50.00,
      "applicableTo": "All",
      "usageLimit": 100,
      "userLimitPerUser": 1,
      "timesUsed": 42,
      "isActive": true,
      "validFrom": "2026-06-01T00:00:00Z",
      "validUntil": "2026-08-31T23:59:59Z",
      "createdAt": "2026-05-20T10:00:00Z"
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 403 | User is not Admin |

---

### 8.2 `GET /api/admin/coupons/{couponId}`

**Auth:** Required (Admin role only)

**Path Parameters:**
| Name | Type | Description |
|---|---|---|
| `couponId` | `Guid` | UUID of the coupon |

**Business Logic:**
1. Return coupon by ID

**Success Response — `200 OK`:** Same shape as list item in 8.1.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 403 | User is not Admin |
| 404 | Coupon not found |

---

### 8.3 `POST /api/admin/coupons`

**Auth:** Required (Admin role only)

**Request Body:**
```jsonc
{
  "code": "SUMMER2026",                    // required, unique coupon code
  "type": "Percentage",                    // required, "Percentage" or "Fixed"
  "value": 15.00,                          // required, discount value (% or fixed amount)
  "maxDiscountAmount": 50.00,              // optional, cap for percentage discounts
  "minimumPurchaseAmount": 50.00,          // optional, minimum cart total
  "applicableTo": "All",                   // required, "All" | "SpecificCourses" | "Category"
  "courseIds": ["guid-1", "guid-2"],       // optional, required if applicableTo = SpecificCourses
  "usageLimit": 100,                       // optional, max total uses
  "userLimitPerUser": 1,                   // optional, max uses per user
  "isPublic": true,                        // optional, defaults true
  "validFrom": "2026-06-01T00:00:00Z",     // optional, start date
  "validUntil": "2026-08-31T23:59:59Z"     // optional, end date
}
```

**Business Logic:**
1. Check coupon code uniqueness → 400 if code exists
2. Validate type is `Percentage` or `Fixed` → 400 if not
3. Validate applicableTo is valid → 400 if invalid
4. If applicableTo is `SpecificCourses`, ensure `courseIds` is provided
5. Create coupon with `IsActive = true`, `TimesUsed = 0`
6. Log admin activity

**Success Response — `200 OK`:** Returns created `CouponResponseDto` (same shape as 8.1).

**Errors:**
| Code | Condition |
|---|---|
| 400 | Duplicate code / invalid type / invalid scope |
| 401 | Missing/invalid JWT |
| 403 | User is not Admin |

---

### 8.4 `PUT /api/admin/coupons/{couponId}`

**Auth:** Required (Admin role only)

**Path Parameters:**
| Name | Type | Description |
|---|---|---|
| `couponId` | `Guid` | UUID of the coupon to update |

**Request Body:** Same as `CreateCouponDto` (full replacement — all fields required).

**Business Logic:**
1. Find coupon by ID → 404 if not found
2. Update all fields (full update, not partial)
3. Log admin activity

**Success Response — `200 OK`:** Returns updated `CouponResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Duplicate code / invalid type / invalid scope |
| 401 | Missing/invalid JWT |
| 403 | User is not Admin |
| 404 | Coupon not found |

---

### 8.5 `PATCH /api/admin/coupons/{couponId}/toggle`

**Auth:** Required (Admin role only)

**Path Parameters:**
| Name | Type | Description |
|---|---|---|
| `couponId` | `Guid` | UUID of the coupon |

**Business Logic:**
1. Find coupon by ID → 404 if not found
2. Toggle `IsActive` flag (`true` ↔ `false`)

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
| 403 | User is not Admin |
| 404 | Coupon not found |

---

### 8.6 `DELETE /api/admin/coupons/{couponId}`

**Auth:** Required (Admin role only)

**Path Parameters:**
| Name | Type | Description |
|---|---|---|
| `couponId` | `Guid` | UUID of the coupon to delete |

**Business Logic:**
1. Find coupon by ID → 404 if not found
2. Hard delete the coupon entity

**Success Response — `204 No Content`:** No body.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 403 | User is not Admin |
| 404 | Coupon not found |

---

## 9. Admin Payment Method Endpoints

### 9.1 `GET /api/admin/payment-methods`

**Auth:** Required (Admin role only)

**Business Logic:**
1. Return all payment methods (same as public endpoint but admin-facing)

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "name": "Visa Credit Card",
      "provider": "Stripe",
      "type": "CreditCard",
      "isActive": true,
      "configuration": null
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 403 | User is not Admin |

---

### 9.2 `POST /api/admin/payment-methods`

**Auth:** Required (Admin role only)

**Request Body:**
```jsonc
{
  "name": "Visa Credit Card",    // required, display name
  "provider": "Stripe",          // required, gateway provider name
  "type": "CreditCard",          // required, "CreditCard" | "DigitalWallet" | "BankTransfer"
  "configuration": null          // optional, JSON string with provider-specific config
}
```

**Business Logic:**
1. Create new payment method
2. New methods default to `IsActive = true`

**Success Response — `200 OK`:** Returns created `PaymentMethodResponse`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid payment type |
| 401 | Missing/invalid JWT |
| 403 | User is not Admin |

---

### 9.3 `PATCH /api/admin/payment-methods/{id}/toggle`

**Auth:** Required (Admin role only)

**Path Parameters:**
| Name | Type | Description |
|---|---|---|
| `id` | `Guid` | UUID of the payment method |

**Business Logic:**
1. Find payment method by ID → 404 if not found
2. Toggle `IsActive` flag

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
| 403 | User is not Admin |
| 404 | Payment method not found |

---

## 10. Admin Refund Endpoints

### 10.1 `GET /api/admin/refunds`

**Auth:** Required (Admin role only)

**Query Parameters:**
| Name | Type | Description |
|---|---|---|
| `status` | `RefundStatus?` | Optional filter — `Requested`, `Approved`, `Rejected`, `Processed` |

**Business Logic:**
1. Return all refund requests, optionally filtered by status

**Success Response — `200 OK`:** Returns list of `RefundResponseDto` (same shape as user's list).

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 403 | User is not Admin |

---

### 10.2 `POST /api/admin/refunds/approve`

**Auth:** Required (Admin role only)

**Request Body:**
```jsonc
{
  "refundId": "guid",        // required, UUID of the refund request
  "adminNotes": "Approved per refund policy"   // optional
}
```

**Business Logic:**
1. Find refund by ID → 404 if not found
2. Validate refund status is `Requested` → 400 if not pending
3. Set status to `Approved`, record processed admin ID, timestamp, notes

**Success Response — `200 OK`:** Returns updated `RefundResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Refund not in pending status |
| 401 | Missing/invalid JWT |
| 403 | User is not Admin |
| 404 | Refund not found |

---

### 10.3 `POST /api/admin/refunds/reject`

**Auth:** Required (Admin role only)

**Request Body:**
```jsonc
{
  "refundId": "guid",        // required, UUID of the refund request
  "adminNotes": "Does not meet refund criteria"   // optional
}
```

**Business Logic:**
1. Find refund by ID → 404 if not found
2. Validate refund status is `Requested` → 400 if not pending
3. Set status to `Rejected`, record processed admin ID, timestamp, notes

**Success Response — `200 OK`:** Returns updated `RefundResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Refund not in pending status |
| 401 | Missing/invalid JWT |
| 403 | User is not Admin |
| 404 | Refund not found |

---

## 11. DTO Reference

### 11.1 Request DTOs

| DTO | Fields |
|---|---|
| **AddToCartRequest** | `courseId`\* |
| **ApplyCouponRequest** | `code`\* |
| **ValidateCouponRequest** | `code`\*, `cartTotal`\*, `courseIds`\*[] |
| **CreateOrderRequest** | `couponCode?` |
| **ProcessPaymentRequest** | `paymentMethodId`\* |
| **CreatePaymentMethodRequest** | `name`\*, `provider`\*, `type`\*, `configuration?` |
| **RequestRefundRequest** | `paymentId`\*, `reason?` |
| **ProcessRefundRequest** | `refundId`\*, `adminNotes?` |
| **CreateCouponDto** | `code`\*, `type`\*, `value`\*, `maxDiscountAmount?`, `minimumPurchaseAmount?`, `applicableTo`\*, `courseIds?[]`, `usageLimit?`, `userLimitPerUser?`, `isPublic?`, `validFrom?`, `validUntil?` |

### 11.2 Response DTOs

| DTO | Fields |
|---|---|
| **CartResponseDto** | `id`, `items[]: CartItemDto`, `subtotal`, `couponCode?`, `discountAmount`, `finalAmount` |
| **CartItemDto** | `id`, `courseId`, `courseTitle`, `courseImageUrl?`, `instructorName?`, `priceSnapshot`, `currentPrice`, `addedAt` |
| **ApplyCouponResponse** | `code`, `discountAmount`, `finalAmount`, `message?` |
| **ValidateCouponResponse** | `code`, `isValid`, `discountAmount`, `finalAmount`, `message?` |
| **OrderResponseDto** | `id`, `orderNumber`, `subtotal`, `discountAmount`, `finalAmount`, `status`, `couponCode?`, `itemCount`, `createdAt` |
| **OrderDetailDto** | `id`, `orderNumber`, `subtotal`, `discountAmount`, `finalAmount`, `status`, `couponCode?`, `items[]: OrderItemDto`, `payments[]: PaymentHistoryDto`, `createdAt` |
| **OrderItemDto** | `id`, `courseId`, `courseTitle`, `priceAtPurchase` |
| **PaymentHistoryDto** | `id`, `amount`, `status`, `gatewayResponse?`, `createdAt` |
| **PaymentResponseDto** | `id`, `orderId`, `amount`, `status`, `gatewayTransactionId?`, `gatewayResponse?`, `paymentMethodName?`, `createdAt` |
| **PaymentMethodResponse** | `id`, `name`, `provider`, `type`, `isActive`, `configuration?` |
| **CouponResponseDto** | `id`, `code`, `type`, `value`, `maxDiscountAmount?`, `minimumPurchaseAmount?`, `applicableTo`, `usageLimit?`, `userLimitPerUser?`, `timesUsed`, `isActive`, `validFrom?`, `validUntil?`, `createdAt` |
| **RefundResponseDto** | `id`, `paymentId`, `amount`, `reason?`, `status`, `orderNumber?`, `requestedAt`, `processedAt?`, `processedByName?` |

---

## 12. Enums Reference

### 12.1 `OrderStatus`

| Value | Description |
|---|---|
| `Pending` | Order created, awaiting payment |
| `Completed` | Payment succeeded, enrollments created |
| `Failed` | Payment failed |
| `Refunded` | Order fully refunded |

### 12.2 `PaymentStatus`

| Value | Description |
|---|---|
| `Succeeded` | Payment completed successfully |
| `Pending` | Payment in progress |
| `Failed` | Payment failed |

### 12.3 `PaymentMethodType`

| Value | Description |
|---|---|
| `CreditCard` | Credit / debit card |
| `DigitalWallet` | Digital wallet (e.g. PayPal, Apple Pay) |
| `BankTransfer` | Bank transfer / wire |

### 12.4 `CouponType`

| Value | Description |
|---|---|
| `Percentage` | Percentage-based discount (e.g. 15% off) |
| `Fixed` | Fixed amount discount (e.g. $10 off) |

### 12.5 `CouponApplicableTo`

| Value | Description |
|---|---|
| `All` | Applies to all courses / products |
| `SpecificCourses` | Applies only to specific courses (listed in `courseIds`) |
| `Category` | Applies to all courses in a specific category |

### 12.6 `RefundStatus`

| Value | Description |
|---|---|
| `Requested` | User requested a refund, pending admin review |
| `Approved` | Admin approved the refund |
| `Rejected` | Admin rejected the refund |
| `Processed` | Refund has been processed (payment reversed) |

### 12.7 `PaymentCurrency`

| Value | Description |
|---|---|
| `EGP` | Egyptian Pound |
| `USD` | US Dollar |
| `EUR` | Euro |

---

## 13. Endpoint Summary Table

### 13.1 User / Public Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/cart` | Yes | Get current user's cart |
| `POST` | `/api/cart/items` | Yes | Add course to cart |
| `DELETE` | `/api/cart/items/{itemId}` | Yes | Remove item from cart |
| `POST` | `/api/cart/apply-coupon` | Yes | Apply coupon to cart |
| `DELETE` | `/api/cart/coupon` | Yes | Remove coupon from cart |
| `POST` | `/api/coupons/validate` | Yes | Validate a coupon code |
| `GET` | `/api/orders` | Yes | List user's orders |
| `GET` | `/api/orders/{orderId}` | Yes | Get order details |
| `POST` | `/api/orders` | Yes | Create order from cart |
| `POST` | `/api/payments/process` | Yes | Process payment for an order |
| `GET` | `/api/payments/methods` | No | List active payment methods |
| `GET` | `/api/payments/history/{orderId}` | Yes | Get payment history for an order |
| `POST` | `/api/refunds` | Yes | Request a refund |
| `GET` | `/api/refunds` | Yes | List user's refund requests |

### 13.2 Admin Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/coupons` | Admin | List all coupons |
| `GET` | `/api/admin/coupons/{couponId}` | Admin | Get coupon by ID |
| `POST` | `/api/admin/coupons` | Admin | Create a new coupon |
| `PUT` | `/api/admin/coupons/{couponId}` | Admin | Update a coupon |
| `PATCH` | `/api/admin/coupons/{couponId}/toggle` | Admin | Toggle coupon active status |
| `DELETE` | `/api/admin/coupons/{couponId}` | Admin | Delete a coupon |
| `GET` | `/api/admin/payment-methods` | Admin | List all payment methods |
| `POST` | `/api/admin/payment-methods` | Admin | Create a payment method |
| `PATCH` | `/api/admin/payment-methods/{id}/toggle` | Admin | Toggle payment method active status |
| `GET` | `/api/admin/refunds` | Admin | List all refund requests |
| `POST` | `/api/admin/refunds/approve` | Admin | Approve a refund request |
| `POST` | `/api/admin/refunds/reject` | Admin | Reject a refund request |
