# API Routes: Dashboards + Secondary Features + Missing Backend Features

**Date**: 2026-06-23
**Feature**: 003-dashboards-secondary-features

## Overview

All routes are consumed by the 22 service files in `src/features/*/services/`. This document maps each page component to the routes it uses.

## Dashboard Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/student/dashboard/overview` | `dashboardService.getStudentOverview()` | Yes | Student dashboard metrics |
| GET | `/student/dashboard/weekly-activity` | `dashboardService.getStudentWeeklyActivity()` | Yes | Weekly study activity |
| GET | `/student/dashboard/certificates` | `dashboardService.getStudentCertificates()` | Yes | Student certificates |
| GET | `/instructor/dashboard/overview` | `dashboardService.getInstructorOverview()` | Yes | Instructor dashboard metrics |
| GET | `/instructor/dashboard/revenue` | `dashboardService.getInstructorRevenue()` | Yes | Revenue trend |
| GET | `/instructor/dashboard/students` | `dashboardService.getInstructorStudents()` | Yes | Student list |
| GET | `/instructor/dashboard/pending-requests` | `dashboardService.getInstructorPendingRequests()` | Yes | Pending edit requests |
| GET | `/instructor/dashboard/recent-reviews` | `dashboardService.getInstructorRecentReviews()` | Yes | Recent reviews |
| GET | `/admin/dashboard/overview` | `dashboardService.getAdminOverview()` | Yes | Admin dashboard metrics |
| GET | `/admin/dashboard/revenue` | `dashboardService.getAdminRevenue()` | Yes | Revenue trend |
| GET | `/admin/dashboard/user-growth` | `dashboardService.getAdminUserGrowth()` | Yes | User growth trend |
| GET | `/admin/dashboard/enrollment-trend` | `dashboardService.getAdminEnrollmentTrend()` | Yes | Enrollment trend |
| GET | `/admin/dashboard/top-courses` | `dashboardService.getAdminTopCourses()` | Yes | Top courses |

## Profile Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/profile/me` | `profileService.getMe()` | Yes | Current user profile |
| PUT | `/profile/profile` | `profileService.update()` | Yes | Update profile |
| POST | `/profile/picture` | `profileService.setPicture()` | Yes | Set profile picture |
| DELETE | `/profile/picture` | `profileService.deletePicture()` | Yes | Delete profile picture |
| GET | `/profile/phones` | `profileService.getPhones()` | Yes | List phones |
| POST | `/profile/phones` | `profileService.addPhone()` | Yes | Add phone |
| DELETE | `/profile/phones/{id}` | `profileService.deletePhone()` | Yes | Delete phone |
| PUT | `/profile/phones/{id}/default` | `profileService.setDefaultPhone()` | Yes | Set default phone |
| GET | `/profile/addresses` | `profileService.getAddresses()` | Yes | List addresses |
| POST | `/profile/addresses` | `profileService.createAddress()` | Yes | Create address |
| PUT | `/profile/addresses/{id}` | `profileService.updateAddress()` | Yes | Update address |
| DELETE | `/profile/addresses/{id}` | `profileService.deleteAddress()` | Yes | Delete address |
| PUT | `/profile/addresses/{id}/default` | `profileService.setDefaultAddress()` | Yes | Set default address |

## Media Upload Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| POST | `/media/upload-url` | `mediaService.getUploadUrl()` | Yes | Get presigned upload URL |
| POST | `/media/confirm-upload` | `mediaService.confirmUpload()` | Yes | Confirm upload completed |
| GET | `/media/{fileId}/view-url` | `mediaService.getViewUrl()` | Yes | Get view URL |

## Public Instructor Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/public/instructors/{slug}` | `publicInstructorService.getBySlug()` | No | Get instructor by slug |
| GET | `/public/instructors/{slug}/courses` | `publicInstructorService.getCourses()` | No | Get instructor courses |
| GET | `/public/instructors/check-slug` | `publicInstructorService.checkSlug()` | Yes | Check slug availability |
| GET | `/public/instructors/search` | `publicInstructorService.search()` | No | Search instructors |

## Messaging Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/messages/conversations` | `messageService.getConversations()` | Yes | List conversations |
| GET | `/messages/conversations/{userId}` | `messageService.getConversation()` | Yes | Get conversation messages |
| POST | `/messages` | `messageService.send()` | Yes | Send message |
| GET | `/messages/unread-count` | `messageService.getUnreadCount()` | Yes | Get unread count |
| PATCH | `/messages/{id}/read` | `messageService.markRead()` | Yes | Mark message read |

## Wishlist Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/wishlist` | `wishlistService.get()` | Yes | Get wishlist |
| POST | `/wishlist/{courseId}` | `wishlistService.add()` | Yes | Add to wishlist |
| DELETE | `/wishlist/{courseId}` | `wishlistService.remove()` | Yes | Remove from wishlist |

## Refund Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| POST | `/refunds` | `refundService.request()` | Yes | Request refund |
| GET | `/admin/refunds` | `adminService.getRefunds()` | Yes | List refunds (admin) |
| POST | `/admin/refunds/approve` | `adminService.approveRefund()` | Yes | Approve refund (admin) |
| POST | `/admin/refunds/reject` | `adminService.rejectRefund()` | Yes | Reject refund (admin) |

## Instructor Request Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/instructor-requests/can-submit` | `instructorRequestService.canSubmit()` | Yes | Check if can submit |
| POST | `/instructor-requests` | `instructorRequestService.submit()` | Yes | Submit application |
| GET | `/instructor-requests/my-requests` | `instructorRequestService.getMyRequests()` | Yes | Get my requests |
| GET | `/instructor-requests/my-requests/{id}` | `instructorRequestService.getMyRequestDetail()` | Yes | Get request detail |
| DELETE | `/instructor-requests/{id}/cancel` | `instructorRequestService.cancel()` | Yes | Cancel request |
| GET | `/instructor-requests/pending` | `instructorRequestService.getPending()` | Yes | List pending (admin) |
| GET | `/instructor-requests/{id}` | `instructorRequestService.getDetail()` | Yes | Get detail (admin) |
| PUT | `/instructor-requests/{id}/process` | `instructorRequestService.process()` | Yes | Process request (admin) |

## Admin Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/admin/users` | `adminUsersService.getAll()` | Yes | List users |
| GET | `/admin/coupons` | `adminService.getCoupons()` | Yes | List coupons |
| POST | `/admin/coupons` | `adminService.createCoupon()` | Yes | Create coupon |
| PUT | `/admin/coupons/{id}` | `adminService.updateCoupon()` | Yes | Update coupon |
| PATCH | `/admin/coupons/{id}/toggle` | `adminService.toggleCoupon()` | Yes | Toggle coupon active |
| DELETE | `/admin/coupons/{id}` | `adminService.deleteCoupon()` | Yes | Delete coupon |
| GET | `/admin/payment-methods` | `adminService.getPaymentMethods()` | Yes | List payment methods |
| POST | `/admin/payment-methods` | `adminService.createPaymentMethod()` | Yes | Create payment method |
| PATCH | `/admin/payment-methods/{id}/toggle` | `adminService.togglePaymentMethod()` | Yes | Toggle payment method |

## Auth Routes

| Method | Route | Service | Auth | Description |
|--------|-------|---------|------|-------------|
| POST | `/auth/change-password` | `authService.changePassword()` | Yes | Change password |
| GET | `/auth/sessions` | `authService.getSessions()` | Yes | List active sessions |
| DELETE | `/auth/sessions/{id}` | `authService.revokeSession()` | Yes | Revoke session |

## SignalR Hubs

| Hub | Connection | Events | Description |
|-----|------------|--------|-------------|
| `/hubs/notifications` | `createNotificationHub()` | `ReceiveNotification` | Real-time notifications |
| `/hubs/messaging` | `createMessagingHub()` | `ReceiveMessage` | Real-time messages |

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
