# API Routes: Auth + Courses + Cart Integration

**Date**: 2026-06-23
**Feature**: 002-auth-courses-cart-integration

## Overview

All routes are consumed by the 22 service files in `src/features/*/services/`. This document maps each page component to the routes it uses.

## Auth Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| POST | `/auth/login` | `authService.login()` | No | Email/password login |
| POST | `/auth/register` | `authService.register()` | No | Create new account |
| POST | `/auth/refresh` | `authService.refreshToken()` | No | Refresh access token |
| POST | `/auth/verify-email` | `authService.verifyEmail()` | No | Confirm email with token |
| POST | `/auth/forgot-password` | `authService.forgotPassword()` | No | Request password reset |
| POST | `/auth/reset-password` | `authService.resetPassword()` | No | Reset password with token |
| POST | `/auth/change-password` | `authService.changePassword()` | Yes | Change password |
| POST | `/auth/logout` | `authService.logout()` | Yes | Invalidate session |
| GET | `/auth/sessions` | `authService.getSessions()` | Yes | List active sessions |
| DELETE | `/auth/sessions/{id}` | `authService.revokeSession()` | Yes | Revoke a session |
| POST | `/oauth/google` | `authService.loginWithGoogle()` | No | OAuth with Google idToken |
| POST | `/oauth/microsoft` | `authService.loginWithMicrosoft()` | No | OAuth with Microsoft idToken |

## Course Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/public/courses` | `courseService.getPublicList()` | No | List courses with filters |
| GET | `/public/courses/{id}` | `courseService.getPublicById()` | No | Course detail |
| GET | `/public/courses/slug/{slug}` | `courseService.getPublicBySlug()` | No | Course by slug |
| GET | `/public/courses/{id}/related` | `courseService.getRelated()` | No | Related courses |
| GET | `/public/courses/stats` | `courseService.getStats()` | No | Platform stats |
| GET | `/public/courses/filters/options` | `courseService.getFilterOptions()` | No | Filter options |
| GET | `/public/courses/search/suggest` | `courseService.getSuggestions()` | No | Search suggestions |
| GET | `/categories` | `categoryService.getAll()` | No | List categories |

## Enrollment Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| POST | `/enrollments` | `enrollmentService.enroll()` | Yes | Enroll in free course |
| GET | `/enrollments/{id}/progress` | `enrollmentService.getProgress()` | Yes | Get progress |

## Cart Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/cart` | `cartService.get()` | Yes | Get cart contents |
| POST | `/cart/items` | `cartService.addItem()` | Yes | Add course to cart |
| DELETE | `/cart/items/{id}` | `cartService.removeItem()` | Yes | Remove from cart |
| POST | `/cart/coupons/validate` | `cartService.applyCoupon()` | Yes | Validate & apply coupon |
| DELETE | `/cart/coupons` | `cartService.removeCoupon()` | Yes | Remove coupon |

## Order Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| POST | `/orders` | `orderService.create()` | Yes | Create order from cart |
| GET | `/orders/{id}` | `orderService.getById()` | Yes | Order detail |

## Payment Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| POST | `/payments/process` | `paymentService.process()` | Yes | Process payment → redirect URL |
| GET | `/payments/methods` | `paymentService.getMethods()` | Yes | Available payment methods |

## Review Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/reviews/course/{courseId}` | `reviewService.getCourseReviews()` | No | Course reviews |

## Landing Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/public/landing` | `publicService.getLanding()` | No | Aggregated landing data |

## Profile Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/profile/me` | `profileService.getMe()` | Yes | Current user profile |
| PUT | `/profile/me` | `profileService.update()` | Yes | Update profile |

## Response Envelope

All endpoints return responses wrapped in `ApiResponse<T>`:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}
```

Paginated endpoints return `ApiResponse<PagedList<T>>`:

```typescript
interface PagedList<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
```
