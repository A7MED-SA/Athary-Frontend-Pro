# Athary Platform — Notifications API Documentation

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
2. [Notifications Endpoints](#2-notifications-endpoints)
3. [Notification Preferences Endpoints](#3-notification-preferences-endpoints)
4. [Enums Reference](#4-enums-reference)
5. [DTO Reference](#5-dto-reference)
6. [Endpoint Summary Table](#6-endpoint-summary-table)

---

## 1. Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| `NOTIFICATION_NOT_FOUND` | 404 | Notification not found |
| `VALIDATION_ERROR` | 400 | FluentValidation or argument error |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

---

## 2. Notifications Endpoints

All notification endpoints require authentication.

### 2.1 `GET /api/notifications`

**Auth:** Required

**Query Parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | int | 1 | Page number |
| `pageSize` | int | 20 | Items per page |
| `isRead` | bool? | null | Filter by read/unread status |

**Business Logic:**
1. Extract userId from JWT
2. Return paginated list of notifications for user, ordered by `CreatedAt` descending
3. Optionally filter by `isRead`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "guid",
        "title": "New Course Available",
        "message": "A new course has been added to your library",
        "type": "Course",
        "linkUrl": "/courses/guid",
        "icon": "book-open",
        "isRead": false,
        "createdAt": "2026-06-26T10:00:00Z",
        "readAt": null
      }
    ],
    "totalCount": 1,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

### 2.2 `GET /api/notifications/unread-count`

**Auth:** Required

**Business Logic:**
1. Count unread notifications for the user

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": 5,
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

### 2.3 `PATCH /api/notifications/{notificationId}/read`

**Auth:** Required

**Path Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `notificationId` | guid | Notification ID |

**Business Logic:**
1. Verify notification belongs to user
2. Set `IsRead = true`, `ReadAt = UtcNow`
3. If not found or not owned → `NOTIFICATION_NOT_FOUND`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Marked as read"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Notification not found |

### 2.4 `POST /api/notifications/mark-all-read`

**Auth:** Required

**Business Logic:**
1. Mark all unread notifications for user as read
2. Set `ReadAt = UtcNow` on all

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": 3,
  "message": "3 notifications marked as read"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

### 2.5 `DELETE /api/notifications/{notificationId}`

**Auth:** Required

**Path Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `notificationId` | guid | Notification ID |

**Business Logic:**
1. Verify notification belongs to user
2. Hard delete the notification

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Notification deleted"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Notification not found |

### 2.6 `DELETE /api/notifications/clear-all`

**Auth:** Required

**Business Logic:**
1. Delete ALL notifications for the user

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": 10,
  "message": "10 notifications deleted"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

---

## 3. Notification Preferences Endpoints

### 3.1 `GET /api/notifications/preferences`

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

### 3.2 `PUT /api/notifications/preferences`

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

**Success Response — `200 OK`:** Returns complete `NotificationPreferencesDto`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

---

## 4. Enums Reference

### 4.1 NotificationType

| Value | Description |
|---|---|
| `Course` | Course-related notifications |
| `Payment` | Payment and billing notifications |
| `System` | System-wide announcements |
| `Message` | New message alerts |
| `InstructorRequest` | Instructor request status updates |
| `Enrollment` | Enrollment confirmations |
| `Assignment` | Assignment/quiz related notifications |

---

## 5. DTO Reference

### 5.1 Notification DTOs

| DTO | Fields |
|---|---|
| **NotificationDto** | `id`, `title`, `message?`, `type` (NotificationType), `linkUrl?`, `icon?`, `isRead`, `createdAt`, `readAt?` |
| **NotificationListDto** | `notifications: NotificationDto[]`, `totalCount`, `page`, `pageSize`, `totalPages` |
| **CreateNotificationDto** | `userId`\*, `title`\*, `message?`, `type`\*, `linkUrl?`, `icon?` |

### 5.2 Notification Preferences DTOs

| DTO | Fields |
|---|---|
| **NotificationPreferencesDto** | `emailNotifications`, `pushNotifications`, `courseUpdates`, `marketingEmails`, `newMessageAlerts`, `liveSessionReminders`, `quizReminders`, `certificateAchievements`, `announcementAlerts` (all `bool`) |
| **UpdateNotificationPreferencesDto** | Same fields but all `bool?` (nullable) |

---

## 6. Endpoint Summary Table

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | Yes | List notifications (paginated, filterable) |
| `GET` | `/api/notifications/unread-count` | Yes | Get unread notification count |
| `PATCH` | `/api/notifications/{notificationId}/read` | Yes | Mark notification as read |
| `POST` | `/api/notifications/mark-all-read` | Yes | Mark all notifications as read |
| `DELETE` | `/api/notifications/{notificationId}` | Yes | Delete a notification |
| `DELETE` | `/api/notifications/clear-all` | Yes | Delete all notifications |
| `GET` | `/api/notifications/preferences` | Yes | Get notification preferences |
| `PUT` | `/api/notifications/preferences` | Yes | Update notification preferences |
